"use strict";

function Song(args){
    this.path = args.path;
    this.type = args.type;
    this.addedOn = args.addedOn;
    this.addedByIP = args.addedByIP;
}

module.exports = Song;
