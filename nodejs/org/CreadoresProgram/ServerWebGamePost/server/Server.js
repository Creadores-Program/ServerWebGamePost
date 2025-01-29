const http = require("http");
const fs = require("fs");
const path = require("path");
class Server {
    getPort(){
        return this.port;
    }
    getProcessDatapacks(){
        return this.processDatapacks;
    }
    getPlayers(){
        return this.players;
    }
    getHttpServer(){
        return this.httpServer;
    }
    constructor(port, imgSrc, processDatapacks) {
        if(processDatapacks == null){
            throw new Error("NullPointerException in procecerDatapacks not Null");
        }
        if(port == null){
            throw new Error("NullPointerException in procecerDatapacks not Null");
        }
        this.port = port;
        this.players = {};
        this.imgSrc = imgSrc;
        this.processDatapacks = processDatapacks;
        this.httpServer = http.createServer((this.processSubDatapacks).bind(this));
        this.httpServer.listen(this.port, "0.0.0.0", ()=>{
            return true;
        });
    }
    stop(){
        this.httpServer.close((()=>{
            for (let prop in this) {
                if (this.hasOwnProperty(prop)) {
                  delete this[prop];
                }
            }
        }).bind(this));
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
    addFilterOrigin(filter){
        if(this.filters == null){
            this.filters = [];
        }
        this.filters[this.filters.length] = filter;
    }
    removeFilterOrigin(filter){
        if(this.filters != null){
            let index = this.filters.indexOf(filter);
            if(index != -1){
                this.filters.splice(index, 1);
            }
        }
    }
    banIp(ip){
        if(this.banIps == null){
            this.banIps = [];
        }
        this.banIps[this.banIps.length] = ip;
    }
    unbanIp(ip){
        if(this.banIps != null){
            let index = this.banIps.indexOf(ip);
            if(index != -1){
                this.banIps.splice(index, 1);
            }
        }
    }
    processSubDatapacks(request, reponse){
        try{
            if(this.banIps != null && this.banIps.includes(request.connection.remoteAddress)) return;
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
            if(request.method == "OPTIONS"){
                response.statusCode = 200;
                let Allow = this.filters && this.filters.length > 0 ? this.filters.join(',') : '*';
                reponse.setHeader("Access-Control-Allow-Origin", Allow);
                reponse.setHeader("Access-Control-Allow-Methods", "POST");
                reponse.setHeader("Access-Control-Allow-Headers", "Content-Type");
                reponse.end();
                return;
            }
            if(request.method != "POST" || (this.filters != null && this.filters.includes(request.headers["origin"]))){
                reponse.statusCode = 404;
                return;
            }
            let body = "";
            request.on("data", chunk =>{
                body += chunk.toString();
            });
            request.on("end", (()=>{
                let datapack = JSON.parse(body);
                this.processDatapacks(datapack);
                let responDatapacks = {};
                responDatapacks.datapacksLot = this.players[datapack.identifier];
                this.players[datapack.identifier] = [];
                reponse.statusCode = 200;
                reponse.setHeader("Content-Type", "application/json");
                let Allow = this.filters && this.filters.length > 0 ? this.filters.join(',') : '*';
                reponse.setHeader("Access-Control-Allow-Origin", Allow);
                reponse.setHeader("Access-Control-Allow-Methods", "POST");
                reponse.setHeader("Access-Control-Allow-Headers", "Content-Type");
                reponse.end(JSON.stringify(responDatapacks));
            }).bind(this));
          }
        }catch(erro){
            reponse.statusCode = 500;
            reponse.setHeader('Content-Type', 'text/plain');
            reponse.end(erro);
        }
    }
}
Object.freeze(Server.prototype);
module.exports = Server;
