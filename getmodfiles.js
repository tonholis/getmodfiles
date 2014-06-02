//Script para listar os arquivos modificados em um diretorio base (dir) a partir de uma certa data (fromDate)

//Documentação NodeJS
//http://nodejs.org/api/fs.html

var fs = require('fs');
var fse = require('fs-extra');
var path = require('path');

//diretorio base
// var dir = "C:\\inetpub\\wwwroot\\Intranet";
// var copyDir = __dirname + "\\copy";
var dir = __dirname + "/test";
var copyDir = __dirname + "/copy";

//output type: text, copy, both
var output = "text"; //default
if (process.argv.length > 2)
	output = process.argv[2];

//consider files from this date
var fromDate = new Date(2014, 1, 10); //o mes começa em 0 (janeiro)

var walk = function(dir, done) {
	var results = [];
	fs.readdir(dir, function(err, list) {
		if (err) 
			return done(err);
				
		var pending = list.length;
		if (!pending) 
			return done(null, results);

		list.forEach(function(file) {
			file = dir + path.sep + file;

			fs.stat(file, function(err, stat) {
				if (stat && stat.isDirectory()) {
					walk(file, function(err, res) {
						results = results.concat(res);
						
						if (!--pending) 
							done(null, results);
					});
				} else {
					if (stat.mtime >= fromDate) {
						results.push(file);
						
						if (!--pending) 
							done(null, results);
					}
				}
			});
		});
	});
};

var writeResults = function (results) {
	var output = path.join(__dirname, 'mfiles-out.txt');
	fs.writeFile(output, results.join('\n'), function(err) {
		if(err) {
			console.log(err);
		} else {
			console.log("Report generated!!!");
		}
	});
};

var copyFiles = function (results) {
	results.forEach(function (file) {
		var copyPath = path.join(copyDir, file.replace(dir, ""));		

		fse.ensureDir(path.dirname(copyPath), function (error) {
			if (error) return error;
		
			console.log(copyPath);	
			fse.copy(file, copyPath);			
		});
	});

	console.log("Files copied!!!");	
};


walk(dir, function(err, results) {
	if (err) throw err;

	if (output == 'both' || output == 'text')
		writeResults(results);	

	if (output == 'both' || output == 'copy')
		copyFiles(results);
});