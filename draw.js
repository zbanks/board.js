function drawBoard(board){
    var table = $("<table class='board'></table>");
    for(var i = board.w-1; i >=0; i--){
        var tr = $("<tr></tr>");
        for(var j = 0; j < board.h; j++){
            var td = $("<td></td>");
            if(board.board[i][j]){
                td.append(drawPiece(board.board[i][j]));
            }
            td.data("p", [i, j]);
            tr.append(td);
        }
        table.append(tr);
    }
    return table;
}

function drawPiece(piece){
    return $("<div class='piece' style='background-color:"+piece.color+"'>&nbsp;</span>");
}
