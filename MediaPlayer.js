"use strict";

var exec = require('child_process').exec;

function MediaPlayer(){
    this.isPlaying = false;
    this.currentMediaPath = null;
    this.playingCompleteCallback = null;
}

MediaPlayer.prototype.play = function(path, playingCompleteCallback){
    if (!this.isPlaying){
        this.playingCompleteCallback = playingCompleteCallback;
        this.isPlaying = true;
        var command = "mplayer -novideo '" + path + "'";
        exec(command, {maxBuffer: 1024 * 1024}, this.songComplete.bind(this));
    }
};

MediaPlayer.prototype.songComplete = function(err, stdout, stderr) {
    this.isPlaying = false;
    this.playingCompleteCallback();
};

MediaPlayer.prototype.stop = function() {
    if (this.isPlaying) {
        this.isPlaying = false;
        // Executing the following exec will execute 'songComplete' callback
        exec("killall mplayer");
    }
};

module.exports = new MediaPlayer;
