import ServerWebGamePost
import time


def testServer():
    prefix = "[Creadores Program Test] "
    print(prefix+"Test Server...")
    pingClient = 0
    serverT = None

    class TestProcess(ServerWebGamePost.Server.ProcessDatapackServer):
        def processDatapack(self, datapack):
            assert datapack.ping == pingClient
            print((int(time.time() * 1000) - datapack.ping) + "ms Ping")
            serverT.sendDataPacket(datapack.identifier, {
                "status": "OK"
            })
            serverT.stop()

    serverT = ServerWebGamePost.Server(3000, None, TestProcess)

    print(prefix+"Test Client...")

    clientT = ServerWebGamePost.Client("127.0.0.1", 3000, False)

    def clientCallb(datapack):
        assert datapack.status == "OK"
    clientT.setProcessDatapacks(clientCallb)
    pingClient = int(time.time() * 1000)
    clientT.sendDataPacket({
        "identifier": "108023",
        "ping": pingClient
    })
