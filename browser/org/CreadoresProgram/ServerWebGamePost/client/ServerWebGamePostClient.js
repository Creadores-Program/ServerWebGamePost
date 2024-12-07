class ServerWebGamePostClient {
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
    sendDataPacket(datapack){
        let prefix = "";
        if(this.isHttps){
            prefix = "https://";
        }else{
            prefix = "http://";
        }
        fetch(prefix+this.domain+":"+this.port+"/ServerWebGamePost", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(datapack)
        }).then((reponse) => reponse.json()).then((data)=>{
            this.processSubDatapackspriv(data);
        }).catch((error) =>{
            throw error;
        });
    }
    processSubDatapackspriv(datapacks){
        for(let i in datapacks.datapacksLot){
            this.processDatapackspriv(datapacks.datapacksLot[i]);
        }
    }
}
Object.freeze(ServerWebGamePostClient.prototype);