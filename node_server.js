var fs = require('fs');
var express = require("express");
var nowjs = require("now");
var consts = require("./constants.js");
var game = require("./game.js");

var app = express.createServer();
app.get('/', function(req, res){
    res.sendfile("index.html");
});
app.get('/static/*', function(req, res){
    var path = req.params[0];
    if(path.indexOf("..") == -1){
        res.sendfile(req.params[0]); 
    }
});
app.listen(8080);

var everyone = require("now").initialize(app);

rooms = {};

everyone.connected(function(clientId){
  console.log("Joined: " + this.now.name);
  var room = initRoom(this.now.room);
  if(room.players.length >= room.rules.maxplayers){
    this.now.receiveMessage("Error", "Room full!");
    return false;
  }
  for(var i = 0; i < room.players.length; i++){
    this.now.addUser(room.players[i].now.name, room.players[i].now.color);
  }
  room.addUser(clientId);
  //everyone.now.receiveMessage(this.now.name, "joined");
  room.now.addUser(this.now.name, this.now.color);
  
  
  //-everyone.now.receiveBoard(board);
});


everyone.disconnected(function(clientId){
  console.log("Left: " + this.now.name);
  rooms[this.now.room].removeUser(clientId);
  //everyone.now.receiveMessage(this.now.name, "left");
  rooms[this.now.room].now.rmUser(this.now.color);
});

everyone.now.distributeMessage = function(message){
    everyone.now.receiveMessage(this.now.name, message, this.now.color);
};

everyone.now.distributeMove = function(move){
    var room = rooms[this.now.room];
    if(!room)
        return;
    if(room.turn != this.now.playerno)
        return;
    if(room.players.length < room.rules.minplayers)
        return;
    var res = room.rules.play(room.board, move);
    if(res){
        everyone.now.filterBoard(room.board, this.now.room);
        room.turn++;
        room.turn %= room.players.length;
        room.players[room.turn].now.receiveMessage("Play", "it's your turn");
    }else{
        this.now.receiveMessage("Error", "Bad move");
    }
}

everyone.now.filterBoard = function(board, destRoom){
    if(this.now.room == destRoom){
        this.now.receiveBoard(board);
    }
}

function initRoom(roomstr){
    if(!rooms[roomstr]){
        var rm = rooms[roomstr] = nowjs.getGroup(roomstr);
        rm.rules = game.connectFourRules;
        rm.board = rm.rules.initBoard();
        rm.players = [];
        rm.turn = 0;
        rm.on("connect", function(clientId){
            this.now.playerno = rm.players.push(this) - 1;
            this.now.receiveBoard(rm.board);
            if(rm.rules.maxplayers < rm.players.length){
                this.now.receiveMessage("Error", "Room full!");
                this.room = null;
                rm.removeUser(clientId);
            }
        });
        rm.on("disconnect", function(clientId){
            console.log(rm.players.length);
            rm.players.splice(this.now.playerno, 1);
            if(rm.players.length == 0){
                delete rooms[roomstr];
            }
            rm.turn %= rm.players.length;
            for(var i = 0; i < rm.players.length; i++){
                rm.players[i].now.playerno = i;
            }
            rm.players[rm.turn].now.receiveMessage("Play", "it's your turn");
        });
    }
    return rooms[roomstr];
}
