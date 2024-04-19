"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
var chess_js_1 = require("chess.js");
var Game = /** @class */ (function () {
    function Game(player1, player2) {
        this.player1 = player1;
        this.player2 = player2;
        this.board = new chess_js_1.Chess();
        this.moves = [];
        this.startTime = new Date();
    }
    Game.prototype.makeMove = function (socket, move) {
    };
    return Game;
}());
exports.Game = Game;
