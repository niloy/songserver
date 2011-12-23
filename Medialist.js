"use strict";

var fs = require('fs');

function Medialist(){
    this.baseDir = __dirname + '/media/';
    this.list = fs.readdirSync(this.baseDir);
}

Medialist.prototype.saveMedia = function(files, callback){
    var totalFiles = 0;
    for (var j in files){
        totalFiles++;
    }

    var count = 0;
    for (var i in files){
        var file = files[i];
        fs.rename(file.path, this.baseDir + file.name, (function(filename, err){
            count++;
            if (err){
                console.error(err);
            }else{
                this.list.push(filename);
            }
            
            if (count === totalFiles){
                callback();
            }
        }).bind(this, file.name));
    }
};

module.exports = new Medialist;
