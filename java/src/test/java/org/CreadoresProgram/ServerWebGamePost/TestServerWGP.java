package org.CreadoresProgram.ServerWebGamePost;
import org.junit.jupiter.api.Test;
import org.CreadoresProgram.ServerWebGamePost.server.ServerWebGamePostServer;
import org.CreadoresProgram.ServerWebGamePost.server.ProcessDatapackServer;
import org.CreadoresProgram.ServerWebGamePost.client.ServerWebGamePostClient;
import org.CreadoresProgram.ServerWebGamePost.client.ProcessDatapackClient;
import com.alibaba.fastjson2.JSONObject;

public class TestServerWGP {

    @Test
    public void testCreateServer() {
        String prefix = "[Creadores Program Test] ";
        System.out.println(prefix+"Test Server...");
        ServerWebGamePostServer server = new ServerWebGamePostServer(3000, null, new ProcessDatapackServer(){
            @Override
            public void processDatapack(JSONObject datapack){
                System.out.println((System.currentTimeMillis() - datapack.getLongValue("ping")) + "ms Ping");
                JSONObject datatu = new JSONObject();
                datatu.put("status", "OK");
                server.sendDataPacket(datapack.getString("identifier"), datatu);
                server.stop();
            }
        });
        System.out.println(prefix+"Test Client...");
        ServerWebGamePostClient client = new ServerWebGamePostClient("127.0.0.1", 3000, false);
        client.setProcessDatapacks(new ProcessDatapackClient(client){
            @Override
            public void processDatapack(JSONObject datapack){
                System.out.println(datapack.getString("status"));
                System.out.println(prefix+"Test Done!");
                System.exit(0);
            }
        });
        JSONObject jsdatap = new JSONObject();
        jsdatap.put("identifier", "108023");
        jsdatap.put("ping", System.currentTimeMillis());
        client.sendDataPacket(jsdatap);
    }
}