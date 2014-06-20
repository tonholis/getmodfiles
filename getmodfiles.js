//Refs
//http://nodejs.org/api/fs.html

var fs = require('fs');
var fse = require('fs-extra');
var path = require('path');

/****************
VARS
*****************/

//base dir
var dir = __dirname + "/test";

//output dir for copy
var copyDir = __dirname + "/copy";

//look for files from this date
var fromDate = new Date(2014, 1, 10); 

//output type
var output = "text"; //default

/****************
ARGUMENTS
*****************/
console.log(process.argv);
if (process.argv.length >= 3)
{
	dir = process.argv[2];
}

if (process.argv.length >= 4)
{
	var sdate = process.argv[3].split('-');
	fromDate = new Date(sdate[0], parseInt(sdate[1]) - 1, sdate[2]);
}

if (process.argv.length >= 5)
{
	output = process.argv[4];
}

/****************
ARGUMENTS
*****************/
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
					if (stat.mtime >= fromDate)
						results.push(file);

					if (!--pending) 
						done(null, results);
				}
			});
		});
	});
};

var writeResults = function (results) {
	var report = path.join(__dirname, 'report.txt');
	
	var content = results.length + " files changed from " + fromDate.toLocaleString();
	content += '\n\n' + results.join('\n');

	fs.writeFile(report, content, function(err) {
		if(err) {
			console.log(err);
		} else {
			console.log("Report created in " + report);
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

	console.log(results.length + " files copied");	
};

walk(dir, function(err, results) {
	if (err) throw err;

	if (results.length == 0)
	{
		console.log('No files were modified from ' + fromDate);
		return;
	}

	if (output == 'both' || output == 'text')
		writeResults(results);	

	if (output == 'both' || output == 'copy')
		copyFiles(results);
});