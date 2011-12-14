"use strict";

var exec = require('child_process').exec;

function MediaPlayer(){
    this.isPlaying = false;
    this.currentMediaPath = null;
}

MediaPlayer.prototype.play = function(path, playingCompleteCallback){
    if (!this.isPlaying){
        this.isPlaying = true;
        var command = "mplayer '" + path + "'";
        var t = this;
        exec(command, function(err, stdout, stderr){
            t.isPlaying = false;
            playingCompleteCallback();
        });
    }
};

module.exports = new MediaPlayer;
