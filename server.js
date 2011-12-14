"use strict";

var http = require('http');
var staticServer = require('node-static');
var socketio = require('socket.io');
var playlist = require('./Playlist.js');
var medialist = require('./Medialist.js');

var fileServer = new staticServer.Server(__dirname + '/public');
var PORT = 8085;

var server = http.createServer(function(request, response){
    request.addListener('end', function(){
        fileServer.serve(request, response);
    });
});
server.listen(PORT);

var websock = socketio.listen(server);
websock.configure(function(){
    websock.disable('log');
});
websock.sockets.on('connection', function(socket){
    socket.join('users');

    socket.emit('init', {
        playlist: playlist.list,
        medialist: medialist.list,
    });

    socket.on('song selected', function(song){
        playlist.addSong(song, 'local', socket.handshake.address.address);
        if (playlist.list.length === 1){
            playlist.play();
        }
        socket.broadcast.emit('playlist updated', playlist.list);
        socket.emit('playlist updated', playlist.list);
    });
});

playlist.onCurrentSongComplete = function(){
    websock.sockets.in('users').emit('playlist updated', playlist.list);
};

console.log('Server started on port: ' + PORT);

