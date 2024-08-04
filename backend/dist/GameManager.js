"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameManager = void 0;
const Messages_1 = require("./Messages");
const Game_1 = require("./Game");
class GameManager {
    constructor() {
        this.games = [];
        this.pendingUser = null;
        this.users = [];
    }
    addUser(socket) {
        this.users.push(socket);
        this.addhandler(socket);
    }
    removeUser(socket) {
        this.users = this.users.filter(user => user !== socket);
        //stop the game or wait for reconnect !
    }
    addhandler(socket) {
        socket.on("message", (data) => {
            const message = JSON.parse(data.toString());
            if (message.type == Messages_1.INIT_GAME) {
                if (this.pendingUser) {
                    // Start THe Game 
                    const game = new Game_1.Game(this.pendingUser, socket);
                    this.games.push(game);
                    this.pendingUser = null;
                }
                else {
                    this.pendingUser = socket;
                }
            }
            if (message.type == Messages_1.MOVE) {
                const game = this.games.find(game => game.player1 == socket || game.player2 == socket);
                if (game) {
                    game.makeMove(socket, message.move);
                }
            }
        });
    }
}
exports.GameManager = GameManager;
