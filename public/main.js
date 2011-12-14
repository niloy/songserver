"use strict";

$(function(){
    var socket = io.connect();
    
    socket.on('init', function(data){
        var medialist = data.medialist;
        var playlist = data.playlist;
        
        updatePlaylist(playlist);
        updateMedialist(medialist);
    });
    
    socket.on('playlist updated', function(playlist){
        updatePlaylist(playlist);
    });
    
    function updatePlaylist(playlist){
        $("#playlist").empty();
        if (playlist.length === 0){
            $("<li>").text("Playlist is empty").appendTo("#playlist");
        }else{
            for (var i = 0; i < playlist.length; i++){
                $("<li>").text(playlist[i].path).appendTo("#playlist");
            }
        }
    }
    
    function updateMedialist(medialist){
        $("#medialist").empty();        
        if (medialist.length === 0){
            $("<li>").text("Medialist is empty").appendTo("#medialist");
        }else{
            for (var i = 0; i < medialist.length; i++){
                (function(song){
                    $("<li>").text(medialist[i]).appendTo("#medialist").click(function(){
                        socket.emit('song selected', song);
                    });
                })(medialist[i]);
            }
        }
    }
});
