const ServerWebGamePost = require("../index");
const prefix = "[Creadores Program Test] ";
console.info(prefix+"Test Server...");
function helloWoldData(datapack){
    console.info((Date.now() - datapack.ping) + "ms Ping");
    ServerWGP.sendDatapacket({
        status: "OK"
    });
}
var ServerWGP = new ServerWebGamePost.Server(8080, null, helloWoldData);
console.info(prefix+"Test Client...");
var ClientWGP = new ServerWebGamePost.Client("0.0.0.0", 8080, false);
ClientWGP.sendDatapacket({
    identifier: "12983",
    ping: Date.now()
});
ServerWGP.stop();
console.info(prefix+"Test Done!");