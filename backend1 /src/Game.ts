import {WebSocket} from "ws";
import {Chess} from 'chess.js';
import { GAME_OVER, INIT_GAME, MOVE } from "./messages";


export class Game 
{
    public player1 : WebSocket ; 
    public player2 : WebSocket;

    private moveCount = 0 ;   // For Counting which player move is that ? 
    private board : Chess // The Board is the string format of all moves " qwe232r2rqwere4e5e6  ,etc"
    private moves : string []
    private startTime : Date

    constructor(player1 : WebSocket , player2 : WebSocket)
    {
        this.player1 = player1 ; 
        this.player2 = player2
        this.board = new Chess()
        this.moves = [] ; 
        this.startTime = new Date()

        //  When the game is started let both the players know that game is started and their respective colors 
        this.player1.send(JSON.stringify({
            type : INIT_GAME  ,
            color : "white" 
        }))
        this.player2.send(JSON.stringify({
            type : INIT_GAME , 
            color : "black"
        }))
    }

    makeMove(socket  :WebSocket , move : {
        from : string , 
        to : string 
     })
    {
        //  Validation  : is user is valid , is move is valid 
        // validate the type of move using zod 
        if (this.moveCount % 2 == 0 && socket !== this.player1)
        {
            return
        }
        if (this.moveCount % 2 == 1 && socket !== this.player2)
        {
            return
        }
        try 
        {
            this.board.move(move )
            
        }catch(e)
        {
            console.log("Something went wrong in Make Move" , e);
            
            return 
        }
        
        if (this.board.isGameOver())
        {
            this.player1.emit(JSON.stringify({
                type : GAME_OVER , 
                payload : {
                    winner : this.board.turn() === 'w' ? "black" : "white"
                }
            }))
            return ;
        }
        if (this.board.isGameOver())
        {
            this.player2.emit(JSON.stringify({
                type : GAME_OVER , 
                payload : {
                    winner : this.board.turn() === 'w' ? "black" : "white"
                }
            }))
            return ;
        }
        
        // Otherwise Make Moves
        if (this.moveCount % 2 == 0 )
        {
            this.player2.send(JSON.stringify({
                move : MOVE,
                payload : move
            }))
        }
        else
        {
            this.player1.send(JSON.stringify({
                move : MOVE,
                payload : move
            }))
        }
        this.moveCount ++ ;
    }
}