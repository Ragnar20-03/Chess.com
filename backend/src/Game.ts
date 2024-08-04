import { WebSocket } from "ws";
import {Chess} from 'chess.js'
import { GAME_OVER, INIT_GAME, MOVE } from "./Messages";

export class Game 
{
    public  player1 : WebSocket ; 
    public player2 : WebSocket ; 
    public board : Chess 
    private startTime  : Date;
    private moveCount : number ; 

    constructor (player1 : WebSocket , player2 : WebSocket) 
    {
        this.player1 = player1 ; 
        this.player2 = player2 
        this.board = new Chess();
        this.startTime = new Date() ;
        this.moveCount = 0 ; 
        
        this.player1.send (JSON.stringify( { 
            type : INIT_GAME , 
            payload : { 
                color : "White" 
            }
        }))

        this.player2.send (JSON.stringify( { 
            type : INIT_GAME , 
            payload : { 
                color : "Black" 
            }
        }))
    }

     makeMove (socket : WebSocket  , move : {
        from : string , 
        to : string
    }) 
    {
            console.log("inside Make Move");
            
        //validate the type of move 
        if (this.board.moves.length % 2 == 0 && socket !== this.player1)
        {
            return ;
        }
        if (this.board.moves.length % 2 == 1 && socket !== this.player2)
        {
            return;
        }


        try
        {
            this.board.move(move);
            console.log("move succed !");
            
        }
        catch (e) 
        {
            console.log("error Occured on Game.ys 54 " , e);
            return ;
        } 

        if(this.board.isGameOver () )
        {
            this.player1.emit (JSON.stringify( {
                type : GAME_OVER , 
                payload  : {
                    winner : this.board.turn() === "w" ? "black" : "white"
                }
            }))

            this.player2.send (JSON.stringify( {
                type : GAME_OVER , 
                payload  : {
                    winner : this.board.turn() === "w" ? "black" : "white"
                }
            }))
            return ;
        }

        if ( this.board.moves.length % 2 == 0 )
        {
            console.log("inside sent1");
            
            this.player2.send(JSON.stringify( {
                
                type : MOVE , 
                payload : move
            }))
            console.log("sent1");
        }
        else 
        {
            console.log("inside sent 2");
            
            this.player1.send(JSON.stringify({
                type : MOVE , 
                payload : move 
            }))
            console.log("sent 2");
            
        }
        this.moveCount ++ ; 
    }

}