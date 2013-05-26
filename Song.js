"use strict";

// var fileAPI = require('fileapi');
function Song(args){
    this.path = args.path;
    this.type = args.type;
    this.addedOn = args.addedOn;
    this.addedByIP = args.addedByIP;
    this.username = args.username;
    //this.songInfo = this.getSongInfo(args.path);
}

// Song.prototype.getSongInfo = function(path){
// 	FileAPI.getInfo(file, function (err, info){
//     if( !err ){
// 	       console.log(info); // { title: "...", album: "...", artists: "...", ... }
// 	    }
// 	});

// }

module.exports = Song;




