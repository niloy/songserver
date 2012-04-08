"use strict";

var http = require('http');
var staticServer = require('node-static');
var socketio = require('socket.io');
var playlist = require('./Playlist.js');
var medialist = require('./Medialist.js');
var formidable = require('formidable');

var fileServer = new staticServer.Server(__dirname + '/public');
var PORT = 8085;

var server = http.createServer(function(request, response){
    if (request.url === '/upload'){
        var form = new formidable.IncomingForm();
        form.parse(request, function(err, fields, files){
            medialist.saveMedia(files, function(){
                websock.sockets.in('users').emit('medialist updated', medialist.list);
            });
            response.end('ok');
        });
    }else{
        request.addListener('end', function(){
            fileServer.serve(request, response);
        });
    }
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
        var time = playlist.addSong(song, 'local', socket.handshake.address.address);
        if (time === 0){
            if (playlist.list.length === 1){
                playlist.play();
            }
            socket.broadcast.emit('playlist updated', playlist.list);
            socket.emit('playlist updated', playlist.list);
        }else{
            socket.emit('wait for song add', time);
        }
    });
    
    socket.on('song removed', function(songIndex) {
        var ip = socket.handshake.address.address;
        
        if (ip === playlist.list[songIndex].addedByIP) {
            playlist.removeSong(songIndex);
            websock.sockets.in('users').emit('playlist updated', playlist.list);
        } else {
            socket.emit('message', 'Sorry, you can only remove your own songs. \
Yeh I know the ideal thing would be to not show the remove button, but that \
requires too much effort, I am too lazy, this works!');
        }
    });
});

playlist.onCurrentSongComplete = function(){
    websock.sockets.in('users').emit('playlist updated', playlist.list);
};

console.log('Server started on port: ' + PORT);

