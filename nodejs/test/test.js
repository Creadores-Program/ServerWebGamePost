const ServerWebGamePost = require("../index");
const prefix = "[Creadores Program Test] ";
console.info(prefix+"Test Server...");
const helloWoldData = function (datapack){
    console.info((Date.now() - datapack.ping) + "ms Ping");
    ServerWGP.sendDatapacket({
        status: "OK"
    });
    ServerWGP.stop();
    console.info(prefix+"Test Done!");
};
var ServerWGP = new ServerWebGamePost.Server(3000, null, helloWoldData);
ServerWGP.processDatapacks = helloWoldData;
console.info(prefix+"Test Client...");
var ClientWGP = new ServerWebGamePost.Client("127.0.0.1", 3000, false);
const okf = function(d) {
    console.info(d.status);
}
ClientWGP.processDatapacks = okf;
ClientWGP.sendDatapacket({
    identifier: "108023",
    ping: Date.now()
});
