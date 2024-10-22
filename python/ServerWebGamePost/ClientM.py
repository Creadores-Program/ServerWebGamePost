import requests


class Client:
    def __init__(self, domain, port, isHttps):
        self.domain = domain
        self.port = port
        self.isHttps = isHttps

    def setProcessDatapacks(self, callb):
        self.processdatapacks = callb

    def getProcessDatapacks(self):
        return self.processdatapacks

    def __processSubDatapackspriv(self, datapacks):
        for i in datapacks["datapacksLot"]:
            self.processdatapacks(i)

    def sendDataPacket(self, datapack):
        prefix = "https://" if self.isHttps else "http://"
        res = requests.post(prefix+self.domain+":"+self.port+"/ServerWebGamePost", json=datapack).json()
        self.__processSubDatapackspriv(res)
