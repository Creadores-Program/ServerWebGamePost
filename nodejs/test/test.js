const ServerWebGamePost = require("../index");
const prefix = "[Creadores Program Test] ";
console.info(prefix+"Test Server...");
function helloWoldData(datapack){
    console.info((Date.now() - datapack.ping) + "ms Ping");
    ServerWGP.sendDatapacket({
        status: "OK"
    });
}
var ServerWGP = new ServerWebGamePost.Server(3000, null, helloWoldData);
console.info(prefix+"Test Client...");
var ClientWGP = new ServerWebGamePost.Client("localhost", 3000, false);
ClientWGP.sendDatapacket({
    identifier: "108023",
    ping: Date.now()
});
ServerWGP.stop();
console.info(prefix+"Test Done!");