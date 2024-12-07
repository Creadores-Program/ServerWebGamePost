const ServerWebGamePost = require("../index");
const prefix = "[Creadores Program Test] ";
console.info(prefix+"Test Server...");
const helloWoldData = function (datapack){
    console.info((Date.now() - datapack.ping) + "ms Ping");
    ServerWGP.sendDataPacket(datapack.identifier, {
        status: "OK"
    });
    ServerWGP.stop();
};
var ServerWGP = new ServerWebGamePost.Server(3000, null, helloWoldData);
console.info(prefix+"Test Client...");
var ClientWGP = new ServerWebGamePost.Client("127.0.0.1", 3000, false);
const okf = function(d) {
    console.info(d.status);
    console.info(prefix+"Test Done!");
}
ClientWGP.processDatapacks = okf;
ClientWGP.sendDatapacket({
    identifier: "108023",
    ping: Date.now()
});
