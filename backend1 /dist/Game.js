"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
const chess_js_1 = require("chess.js");
const messages_1 = require("./messages");
class Game {
    constructor(player1, player2) {
        this.moveCount = 0; // For Counting which player move is that ? 
        this.player1 = player1;
        this.player2 = player2;
        this.board = new chess_js_1.Chess();
        this.moves = [];
        this.startTime = new Date();
        //  When the game is started let both the players know that game is started and their respective colors 
        this.player1.send(JSON.stringify({
            type: messages_1.INIT_GAME,
            color: "white"
        }));
        this.player2.send(JSON.stringify({
            type: messages_1.INIT_GAME,
            color: "black"
        }));
    }
    makeMove(socket, move) {
        //  Validation  : is user is valid , is move is valid 
        // validate the type of move using zod 
        if (this.moveCount % 2 == 0 && socket !== this.player1) {
            return;
        }
        if (this.moveCount % 2 == 1 && socket !== this.player2) {
            return;
        }
        try {
            this.board.move(move);
        }
        catch (e) {
            console.log("Something went wrong in Make Move", e);
            return;
        }
        if (this.board.isGameOver()) {
            this.player1.emit(JSON.stringify({
                type: messages_1.GAME_OVER,
                payload: {
                    winner: this.board.turn() === 'w' ? "black" : "white"
                }
            }));
            return;
        }
        if (this.board.isGameOver()) {
            this.player2.emit(JSON.stringify({
                type: messages_1.GAME_OVER,
                payload: {
                    winner: this.board.turn() === 'w' ? "black" : "white"
                }
            }));
            return;
        }
        // Otherwise Make Moves
        if (this.moveCount % 2 == 0) {
            this.player2.send(JSON.stringify({
                move: messages_1.MOVE,
                payload: move
            }));
        }
        else {
            this.player1.send(JSON.stringify({
                move: messages_1.MOVE,
                payload: move
            }));
        }
        this.moveCount++;
    }
}
exports.Game = Game;
