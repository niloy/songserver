"use strict";

var Song = require('./Song.js');

function Playlist(){
    this.songSelectionGap = 30; // minimum time(seconds) user must wait before queuing next song
    this.list = [];
    this.isPlaying = false;
    this.currentlyPlaying = null;
    this.mediaPlayer = require('./MediaPlayer.js');
    this.onCurrentSongComplete = function(){};
}

Playlist.prototype.getLastSongAddedByIP = function(IP){
    var entry = null;
    for (var i = this.list.length - 1; i >= 0; i--){
        if (this.list[i].addedByIP === IP){
            entry = this.list[i];
            break;
        }
    }
    return entry;
};

/**
 * Returns 0 if song was added to playlist, else a non zero number to indicate
 * time(seconds) remaining before next songs can be added by the same IP.
 */

Playlist.prototype.addSong = function(path, type, IP){
    var secondsToAddNextSong;
    var lastSongByIP = this.getLastSongAddedByIP(IP);
    var song = new Song({
        path: path,
        type: type, 
        addedOn: new Date,
        addedByIP: IP,
    });
    if (lastSongByIP === null){
        this.list.push(song);
        secondsToAddNextSong = 0;
    }else{
        var timeDiff = Math.floor((Date.now() - lastSongByIP.addedOn) / 1000);
        if (timeDiff > this.songSelectionGap){
            this.list.push(song);
            secondsToAddNextSong = 0;
        }else{
            secondsToAddNextSong = this.songSelectionGap - timeDiff;
        }
    }
    return secondsToAddNextSong;
};

Playlist.prototype.getCurrentSong = function(){
    return this.currentlyPlaying;
};

Playlist.prototype.removeSong = function(songIndex){
    if (songIndex === 0) {
        this.mediaPlayer.stop();
    } else {
        this.list.splice(songIndex, 1);
    }
};

Playlist.prototype.play = function(){
    if (!this.isPlaying && this.list.length > 0){
        this.isPlaying = true;
        this.currentlyPlaying = this.list[0];
        var t = this;
        this.mediaPlayer.play('./media/' + this.currentlyPlaying.path, function(){
            t.list.shift();
            t.isPlaying = false;
            t.onCurrentSongComplete();
            t.play();
        });
    }
};

module.exports = new Playlist;
