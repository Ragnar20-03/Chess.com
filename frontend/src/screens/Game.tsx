import { useEffect, useState } from "react";
import { Button } from "../components/Button"
import { ChessBoard } from "../components/ChessBoard"
import { useSocket } from "../hooks/useSocket"
import {Chess} from 'chess.js'

// todo move toether , code repetation
export const INIT_GAME = "init_game";
export const MOVE = "move"
export const GAME_OVER = "Game Over "

export const Game = () => {

    const socket = useSocket ( ) ; 
    const [chess , setChess] = useState ( new Chess ())
    const [board , setBoard]  = useState ( chess.board () )

    useEffect ( () => {
         if (!socket)
         {
            return; 
         }
         socket.onmessage = (event) => {
            const message = JSON.parse(event.data) ; 
            console.log(message);
            switch (message.type) {
                case INIT_GAME:
                    setChess (new Chess ())
                    setBoard(chess.board())
                    break;

                case MOVE:
                    const move = message.payload; 
                    chess.move(move)
                    setBoard(chess.board())
                    break;
                
                case GAME_OVER:
                    console.log("Game Over");
                    break;
            }
         }
    } , [socket] )

    if (!socket ) return <div>
        connecting ....
    </div>

    return <div className=" flex justify-center">
        <div className="pt-8 max-w-screen-lg w-full ">
            <div className="grid grid-cols-6 gap-4  w-full">
                <div className=" col-span-4 bg-red-200 ">
                    <ChessBoard />
                </div>
                <div className="col-span-2 bg-green-200 w-full">
                    <Button onClick={ () => {
                            socket.send(JSON.stringify({
                                type : INIT_GAME
                            }))
                        }} >
                        Play 
                    </Button>
                </div>
            </div>
        </div>
    </div>
}