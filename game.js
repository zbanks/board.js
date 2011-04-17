function Board(w, h){
    this.board = [];
    this.w = w;
    this.h = h;
    for(var i = 0; i < w; i++){
        this.board[i] = [];
        for(var j = 0; j < h; j++){
            this.board[i][j] = null;
        }
    }
    
    this.move = function(mv){
        this.board[mv.x][mv.y] = mv.piece;
    }
}

function Piece(){
    this.color = "#888";
}

function Move(piece, x, y){
    this.piece = piece;
    this.x = x;
    this.y = y;
}

function ConnectFourRules(){
    this.maxplayers = 3;
    this.minplayers = 2;
    this.initBoard = function(){
        return new Board(6, 7);
    };
    this.play = function(board, move){
        if(move.y < 0 || move.y >= board.h){
            console.log("illegal col");
            return false;
        }
        var i = 0;
        for(; i < board.w; i++){
            if(!board.board[i][move.y])
                break;
        }
        if(i == board.w){
            console.log("full row");
            return false;
        }
        move.x = i;
        board.board[move.x][move.y] = move.piece;
        return true;
    };
    this.checkWin = function(){
    
    };
}

if(typeof(exports) !== 'undefined' && exports != null) {
    exports.Board = Board;
    exports.Piece = Piece;
    exports.Move = Move;
    exports.connectFourRules = new ConnectFourRules();
}
