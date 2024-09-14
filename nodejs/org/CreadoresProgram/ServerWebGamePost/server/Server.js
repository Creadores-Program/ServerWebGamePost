const http = require("http");
const fs = require("fs");
const path = require("path");
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
        this.processDatapacks = procecerDatapacks;
        this.httpServer = http.createServer(this.processSubDatapacks);
        this.httpServer.listen(this.port, "0.0.0.0", ()=>{
            return true;
        });
    }
    stop(){
        this.httpServer.close(()=>{
            for (let prop in this) {
                if (this.hasOwnProperty(prop)) {
                  delete this[prop];
                }
            }
        });
    }
    sendDataPacket(identifier, datapack){
        if(this.players[identifier] == null){
            this.players[identifier] = [];
        }
        this.players[identifier][this.players[identifier].length] = datapack;
    }
    deletePlayer(identifier){
        delete this.players[identifier];
    }
    processSubDatapacks(request, reponse){
        try{
          if(request.url == "/favicon.ico"){
            if(request.method != "GET"){
                reponse.statusCode = 404;
                return;
            }
            if(this.imgSrc == null){
                reponse.end("");
                return;
            }
            let logoPath = path.join(__dirname, this.imgSrc);
            fs.readFile(logoPath, (err, logo)=>{
                if(err){
                    reponse.statusCode = 500;
                    reponse.setHeader('Content-Type', 'text/plain');
                    reponse.end(err);
                    return;
                }
                reponse.statusCode = 200;
                reponse.setHeader("Content-Type", "image/jpeg");
                reponse.end(logo);
            });
          }else if(request.url == "/ServerWebGamePost"){
            if(request.method != "POST"){
                reponse.statusCode = 404;
                return;
            }
            let body = "";
            request.on("data", chunk =>{
                body += chunk.toString();
            })
            request.on("end", ()=>{
                let datapack = JSON.parse(body);
                this.processDatapacks(datapack);
                let responDatapacks = {};
                responDatapacks.datapacksLot = this.players[datapack.identifier];
                this.players[datapack.identifier] = [];
                reponse.statusCode = 200;
                reponse.setHeader("Content-Type", "application/json");
                reponse.end(JSON.stringify(responDatapacks));
            });
          }
        }catch(erro){
            reponse.statusCode = 500;
            reponse.setHeader('Content-Type', 'text/plain');
            reponse.end(erro);
        }
    }
}
module.exports = Server;