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
        self.httpServer = HTTPServer(("0.0.0.0", self.port), self.processDatapacks)
        self.httpServer.serverFat = self
        self.httpServer.serve_forever()

    def getHttpServer(self):
        return self.httpServer

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

    def sendDataPacket(self, identifier, datapack):
        if identifier not in self.players:
            self.players[identifier] = []
        self.players[identifier].append(datapack)

    def addFilterOrigin(self, origin):
        if self.filters is None:
            self.filters = []
        self.filters.append(origin)

    def removeFilterOrigin(self, origin):
        if self.filters is None:
            return
        self.filters.remove(origin)

    def banIp(self, ip):
        if self.bannedIps is None:
            self.bannedIps = []
        self.bannedIps.append(ip)

    def unbanIp(self, ip):
        if self.bannedIps is None:
            return
        self.bannedIps.remove(ip)

    class ProcessDatapackServer(BaseHTTPRequestHandler):

        def do_POST(self):
            if (self.server.serverFat.bannedIps is not None and self.client_address[0] in self.server.serverFat.bannedIps):
                self.send_response(403)
                self.end_headers()
                return
            url = str(self.path)
            if url != "/ServerWebGamePost":
                return
            if (self.server.serverFat.filters is not None and self.headers['Origin'] not in self.server.serverFat.filters):
                self.send_response(403)
                self.end_headers()
                return
            filters = self.server.serverFat.filters
            allow = ','.join(filters) if filters and len(filters) > 0 else '*'
            self.send_header('Access-Control-Allow-Origin', allow)
            self.send_header('Access-Control-Allow-Methods', "POST")
            self.send_header('Access-Control-Allow-Headers', "Content-Type")
            try:
                datapack = json.loads(self.rfile.read(int(self.headers['Content-Length'])))
                self.processDatapack(datapack)
                responDatapacks = {}
                responDatapacks.datapacksLot = self.server.serverFat.players[datapack.identifier]
                self.server.serverFat.players[datapack.identifier] = []
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
            if (self.server.serverFat.bannedIps is not None and self.client_address[0] in self.server.serverFat.bannedIps):
                self.send_response(403)
                self.end_headers()
                return
            url = str(self.path)
            if url != "/favicon.ico":
                self.send_response(404)
                return
            self.send_response(200)
            if self.server.serverFat.imgSrc is None:
                self.end_headers()
                self.wfile.write("".encode('utf-8'))
                return
            self.send_header('Content-Type', "image/jpeg")
            self.end_headers()
            with open(self.server.serverFat.imgSrc, "rb") as logo:
                self.wfile.write(logo.read())

        def do_OPTIONS(self):
            if (self.server.serverFat.bannedIps is not None and self.client_address[0] in self.server.serverFat.bannedIps):
                self.send_response(403)
                self.end_headers()
                return
            self.send_response(200)
            filters = self.server.serverFat.filters
            allow = ','.join(filters) if filters and len(filters) > 0 else '*'
            self.send_header('Access-Control-Allow-Origin', allow)
            self.send_header('Access-Control-Allow-Methods', "POST")
            self.send_header('Access-Control-Allow-Headers', "Content-Type")
            self.end_headers()

        def processDatapack(self, datapack):
            pass
