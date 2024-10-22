import ServerWebGamePost
import time
import threading


serverT = None
pingClient = 0

def test_Server():
    prefix = "[Creadores Program Test] "
    print(prefix+"Test Server...")

    class TestProcess(ServerWebGamePost.Server.ProcessDatapackServer):
        def processDatapack(self, datapack):
            assert datapack.ping == pingClient
            print(str(int(time.time() * 1000) - datapack.ping) + "ms Ping")
            serverT.sendDataPacket(datapack.identifier, {
                "status": "OK"
            })
            serverT.stop()

    def ThreadServ():
        global serverT
        serverT = ServerWebGamePost.Server(3000, None, TestProcess)

    hiloServ = threading.Thread(target=ThreadServ)
    hiloServ.start()

    print(prefix+"Test Client...")

    clientT = ServerWebGamePost.Client("127.0.0.1", "3000", False)

    def clientCallb(datapack):
        assert datapack.status == "OK"
        global pingClient
        exit()
    clientT.setProcessDatapacks(clientCallb)
    pingClient = int(time.time() * 1000)
    clientT.sendDataPacket({
        "identifier": "108023",
        "ping": pingClient
    })
