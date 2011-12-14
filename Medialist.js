"use strict";

var fs = require('fs');

function Medialist(){
    this.list = fs.readdirSync(__dirname + '/media');
}

module.exports = new Medialist;
