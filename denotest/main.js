import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const ServerWebGamePost = require("ServerWebGamePost");
const prefix = "[Creadores Program Test] ";
console.info(prefix+"Test Server...");
const helloWoldData = function (datapack){
    console.info((Date.now() - datapack.ping) + "ms Ping");
    ServerWGP.sendDataPacket(datapack.identifier, {
        status: "OK"
    });
    ServerWGP.stop();
    console.info(prefix+"Test Done!");
};
const ServerWGP = new ServerWebGamePost.Server(3000, null, helloWoldData);
console.info(prefix+"Test Client...");
const ClientWGP = new ServerWebGamePost.Client("127.0.0.1", 3000, false);
const okf = function(d) {
    console.info(d.status);
}
ClientWGP.processDatapacks = okf;
ClientWGP.sendDatapacket({
    identifier: "108023",
    ping: Date.now()
});
