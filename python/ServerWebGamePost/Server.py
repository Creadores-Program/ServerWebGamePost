from http.server import BaseHTTPRequestHandler, HTTPServer
import json


class Server:

    def __init__(self, port, imgSrc, processDatapacks):
        if processDatapacks is None:
            raise ValueError("NullPointerException in procecerDatapacks not None")
        if port is None:
            raise ValueError("NullPointerException in port not None")
        self.port = port
        self.players = {}
        self.imgSrc = imgSrc
        self.processDatapacks = processDatapacks
        self.processDatapacks.serverFat = self
        self.httpServer = HTTPServer(("/ServerWebGamePost", self.port), self.processDatapacks)
        self.httpServer.serve_forever()

    def getPort(self):
        return self.port
    
    def getProcessDatapacks(self):
        return self.processDatapacks
    
    def getPlayers(self):
        return self.players
    
    def deletePlayer(self, identifier):
        del self.players[identifier]

    def stop(self):
        self.httpServer.server_close()

    def sendDatapacket(self, identifier, datapack):
        if self.players[identifier] is None:
            self.players[identifier] = []
        self.players[identifier].append(datapack)

    class ProcessDatapackServer(BaseHTTPRequestHandler):

        def do_POST(self):
            url = str(self.path)
            if url != "/ServerWebGamePost":
                return
            try:
                datapack = json.loads(self.rfile.read(int(self.headers['Content-Length'])))
                self.processDatapack(datapack)
                responDatapacks = {}
                responDatapacks.datapacksLot = self.serverFat.players[datapack.identifier]
                self.serverFat.players[datapack.identifier] = []
                self.send_response(200)
                self.send_header('Content-type', "application/json")
                self.end_headers()
                self.wfile.write(json.dumps(responDatapacks).encode('utf-8'))
            except TypeError as e:
                self.send_response(500)
                self.send_header('Content-Type', 'text/plain')
                self.end_headers()
                self.wfile.write(str(e).encode('utf-8'))

        def do_GET(self):
            url = str(self.path)
            if url != "/favicon.ico":
                self.send_response(404)
                return
            self.send_response(200)
            if self.serverFat.imgSrc is None:
                self.end_headers()
                self.wfile.write("".encode('utf-8'))
                return
            self.send_header('Content-Type', "image/jpeg")
            self.end_headers()
            with open(self.serverFat.imgSrc, "rb") as logo:
                self.wfile.write(logo.read())
            
        def processDatapack(self, datapack):
            pass
