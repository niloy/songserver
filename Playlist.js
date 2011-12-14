"use strict";

var Song = require('./Song.js');

function Playlist(){
    this.list = [];
    this.isPlaying = false;
    this.currentlyPlaying = null;
    this.mediaPlayer = require('./MediaPlayer.js');
    this.onCurrentSongComplete = function(){};
}

Playlist.prototype.addSong = function(path, type, IP){
    this.list.push(new Song({
        path: path,
        type: type, 
        addedOn: new Date,
        addedByIP: IP,
    }));
};

Playlist.prototype.getCurrentSong = function(){
    return this.currentlyPlaying;
};

Playlist.prototype.removeSong = function(){
    return this.list.shift();
};

Playlist.prototype.play = function(){
    if (!this.isPlaying && this.list.length > 0){
        this.isPlaying = true;
        this.currentlyPlaying = this.list[0];
        var t = this;
        this.mediaPlayer.play('./media/' + this.currentlyPlaying.path, function(){
            t.removeSong();
            t.isPlaying = false;
            t.onCurrentSongComplete();
            t.play();
        });
    }
};

module.exports = new Playlist;
