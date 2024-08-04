import { WebSocket } from "ws"
import { INIT_GAME } from "./Messages"

interface Game 
{
    id : number , 
    name : string , 
    player1 : WebSocket , 
    player2 : WebSocket 
}

export class GameManager 
{
    private games : Game [] 
    private pendingUser : WebSocket 
    private  users : WebSocket [] 
    constructor () 
    {
        this.games = [] 
    }

    addUser (socket : WebSocket )
    {
        this.users.push(socket);
    }

    removeUser ( socket : WebSocket)
    {   
        this.users = this.users.filter(user => user !== socket)

        //stop the game or wait for reconnect !
    }

    private handleMessage () 
    {

    }
    private addhandler ( socket : WebSocket)
    {
        socket.on("message" , (data) => {
            const message = JSON.stringify(data.toString() );
            if (message == INIT_GAME)
            {
                if (this.pendingUser)
                {
                    // Start THe Game 
                }
                else 
                {
                    this.pendingUser = socket ; 
                }
            }
        })
    }
}