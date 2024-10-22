import ServerWebGamePost
import time
import threading


serverT = None

def test_Server():
    prefix = "[Creadores Program Test] "
    print(prefix+"Test Server...")
    pingClient = 0

    class TestProcess(ServerWebGamePost.Server.ProcessDatapackServer):
        def processDatapack(self, datapack):
            assert datapack.ping == pingClient
            print((int(time.time() * 1000) - datapack.ping) + "ms Ping")
            serverT.sendDataPacket(datapack.identifier, {
                "status": "OK"
            })
            serverT.stop()


    def ThreadServ():
        serverT = ServerWebGamePost.Server(3000, None, TestProcess)

    hiloServ = threading.Thread(target=ThreadServ)
    hiloServ.start()

    print(prefix+"Test Client...")

    clientT = ServerWebGamePost.Client("127.0.0.1", 3000, False)

    def clientCallb(datapack):
        assert datapack.status == "OK"
        exit()
    clientT.setProcessDatapacks(clientCallb)
    pingClient = int(time.time() * 1000)
    clientT.sendDataPacket({
        "identifier": "108023",
        "ping": pingClient
    })
