import fetch from "node-fetch";
class Client {
    constructor(domain, port, isHttps) {
        this.domain = domain;
        this.port = port;
        this.isHttps = isHttps;
    }
    set processDatapacks(callback){
        return this.setProcessDatapacks(callback);
    }
    get processDatapacks(){
        return this.getProcessDatapacks();
    }
    setProcessDatapacks(callback){
        this.processDatapackspriv = callback;
    }
    getProcessDatapacks(){
        return this.processDatapackspriv;
    }
    sendDatapacket(datapack){
        let prefix = "";
        if(this.isHttps){
            prefix = "https://";
        }else{
            prefix = "http://";
        }
        let reponse = await fetch(prefix+this.domain+":"+this.port+"/ServerWebGamePost", {
            method: "post",
            body: JSON.stringify(datapack),
            headers: {
                "Content-Type": "application/json"
            }
        });
        let data = await reponse.json();
        this.processSubDatapackspriv(data);
    }
    processSubDatapackspriv(datapacks){
        for(let i in datapacks.datapacksLot){
            this.processDatapackspriv(datapacks.datapacksLot[i]);
        }
    }
}
module.exports = Client;