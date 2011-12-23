"use strict";

var fs = require('fs');

function Medialist(){
    this.baseDir = __dirname + '/media/';
    this.list = fs.readdirSync(this.baseDir);
}

Medialist.prototype.saveMedia = function(filename, tmpPath, callback){
    fs.rename(tmpPath, this.baseDir + filename, (function(err){
        if (err){
            console.error(err);
        }else{
            this.list.push(filename);
            callback();
        }
    }).bind(this));
};

module.exports = new Medialist;
