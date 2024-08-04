"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
const chess_js_1 = require("chess.js");
const Messages_1 = require("./Messages");
class Game {
    constructor(player1, player2) {
        this.player1 = player1;
        this.player2 = player2;
        this.board = new chess_js_1.Chess();
        this.startTime = new Date();
        this.player1.send(JSON.stringify({
            type: Messages_1.INIT_GAME,
            payload: {
                color: "White"
            }
        }));
        this.player2.send(JSON.stringify({
            type: Messages_1.INIT_GAME,
            payload: {
                color: "Black"
            }
        }));
    }
    makeMove(socket, move) {
        console.log("inside Make Move");
        //validate the type of move 
        if (this.board.moves.length % 2 == 0 && socket !== this.player1) {
            return;
        }
        if (this.board.moves.length % 2 == 1 && socket !== this.player2) {
            return;
        }
        try {
            this.board.move(move);
            console.log("move succed !");
        }
        catch (e) {
            console.log("error Occured on Game.ys 54 ", e);
            return;
        }
        if (this.board.isGameOver()) {
            this.player1.emit(JSON.stringify({
                type: Messages_1.GAME_OVER,
                payload: {
                    winner: this.board.turn() === "w" ? "black" : "white"
                }
            }));
            this.player2.send(JSON.stringify({
                type: Messages_1.GAME_OVER,
                payload: {
                    winner: this.board.turn() === "w" ? "black" : "white"
                }
            }));
            return;
        }
        if (this.board.moves.length % 2 == 0) {
            console.log("inside sent1");
            this.player2.send(JSON.stringify({
                type: Messages_1.MOVE,
                payload: move
            }));
            console.log("sent1");
        }
        else {
            console.log("inside sent 2");
            this.player1.send(JSON.stringify({
                type: Messages_1.MOVE,
                payload: move
            }));
            console.log("sent 2");
        }
    }
}
exports.Game = Game;
