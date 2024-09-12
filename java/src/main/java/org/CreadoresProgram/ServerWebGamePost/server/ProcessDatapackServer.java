package org.CreadoresProgram.ServerWebGamePost.server;
import spark.Route;
import lombok.NonNull;
import spark.Request;
import spark.Response;
import com.alibaba.fastjson2.JSONObject;
import com.alibaba.fastjson2.JSON;
public class ProcessDatapackServer implements Route{
    @Setter
    public ServerWebGamePostServer server;
    @Override
    public Object handle(Request request, Response response) throws Exception{
        JSONObject datapack = JSON.parseObject(request.body());
        this.processDatapack(datapack);
        JSONObject reponDatapacks = new JSONObject();
        reponDatapacks.put("datapacksLot", this.server.getPlayers().get(datapack.getString("identifier")));
        this.server.getPlayers().get(datapack.getString("identifier")).clear();
        response.status(200);
        response.type("application/json");
        return reponDatapacks.toJSONString();
    }
    public void processDatapack(@NonNull JSONObject datapack){
        //code...
    }
}