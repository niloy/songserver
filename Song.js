"use strict";

function Song(args){
    this.path = args.path;
    this.type = args.type;
    this.addedOn = args.addedOn;
    this.addedByIP = args.addedByIP;
    this.username = args.username;
}

module.exports = Song;
