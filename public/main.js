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
                var song = playlist[i];
                var date = new Date(song.addedOn);
                var text = '<span class="path">' + song.path + '</span> - '
                            + '<span class="ip">' + song.addedByIP + '</span> - '
                            + '<span class="date">' + date.toTimeString() + '</span>';
                $("<li>").html(text).appendTo("#playlist");
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
