//http://nodejs.org/api/fs.html

var fs = require('fs');
var path = require('path');

//diretorio base
var dir = "C:\\inetpub\\wwwroot\\Intranet";

//apresenta os arquivos a partir desta data
var fromDate = new Date(2014, 1, 10); //o mes começa em 0 (janeiro)

var walk = function(dir, done) {
  var results = [];
  fs.readdir(dir, function(err, list) {
    if (err) return done(err);
    var pending = list.length;
    if (!pending) return done(null, results);
    list.forEach(function(file) {
      file = dir + '\\' + file;
      fs.stat(file, function(err, stat) {
        if (stat && stat.isDirectory()) {
          walk(file, function(err, res) {
            results = results.concat(res);
            if (!--pending) done(null, results);
          });
        } else {
			if (stat.mtime >= fromDate)
			  results.push(file);
          if (!--pending) done(null, results);
        }
      });
    });
  });
};

walk(dir, function(err, results) {
	if (err) throw err;
  
	var output = path.join(__dirname, 'mfiles-out.txt');
	fs.writeFile(output, results.join('\n'), function(err) {
		if(err) {
			console.log(err);
		} else {
			console.log("Pronto!!!");
		}
	}); 
});