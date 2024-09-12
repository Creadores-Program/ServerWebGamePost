const http = require("http");
class Server {
    get port(){
        return this.port;
    }
    getPort(){
        return this.port;
    }
    get processDatapacks(){
        return this.processDatapacks;
    }
    getProcessDatapacks(){
        return this.processDatapacks;
    }
    getPlayers(){
        return this.players;
    }
    set players(value){
        return false;
    }
    get httpServer(){
        return this.httpServer;
    }
    getHttpServer(){
        return this.httpServer;
    }
    constructor(port, imgSrc, procecerDatapacks) {
        if(procecerDatapacks == null){
            throw new Error("NullPointerException in procecerDatapacks not Null");
        }
        if(port == null){
            throw new Error("NullPointerException in procecerDatapacks not Null");
        }
        this.port = port;
        this.players = {};
        this.imgSrc = imgSrc;
        this.httpServer = http.createServer(this.processSubDatapacks);
    }
    sendDataPacket(identifier, datapack){
        if(this.players[identifier] == null){
            this.players[identifier] = [];
        }
        this.players[identifier][this.players[identifier].length] = datapack;
    }
    processSubDatapacks(request, reponse){
        if(request.method != "POST"){
            reponse.statusCode = 404;
            return;
        }
        if(request.url == "/favicon.ico"){
            if(this.imgSrc == null){
                reponse.end("");
                return;
            }

        }else if(){

        }else{
            
        }
    }
}
module.exports = Server;