package org.CreadoresProgram.ServerWebGamePost.server;
import spark.Route;
import lombok.NonNull;
import lombok.Setter;
import spark.Request;
import spark.Response;
import com.alibaba.fastjson2.JSONObject;
import com.alibaba.fastjson2.JSON;
public class ProcessDatapackServer implements Route{
    @Setter
    public ServerWebGamePostServer server;

    public ProcessDatapackServer(){
    }

    @Override
    public Object handle(Request request, Response response) throws Exception{
        if(this.server.bannedIps.contains(request.ip())){
            response.status(403);
            return "Forbidden";
        }
        if(!this.server.getFilters().isEmpty() && !this.server.getFilters().contains(request.headers("Origin"))){
            response.status(403);
            return "Forbidden";
        }
        JSONObject datapack = JSON.parseObject(request.body());
        this.processDatapack(datapack);
        JSONObject reponDatapacks = new JSONObject();
        reponDatapacks.put("datapacksLot", this.server.getPlayers().get(datapack.getString("identifier")));
        this.server.getPlayers().get(datapack.getString("identifier")).clear();
        response.status(200);
        response.type("application/json");
        String allow = (!this.server.getFilters().isEmpty()) ? String.join(",", this.server.getFilters()) : "*";
        response.header("Access-Control-Allow-Origin", allow);
        response.header("Access-Control-Allow-Methods", "POST");
        response.header("Access-Control-Allow-Headers", "Content-Type");
        return reponDatapacks.toJSONString();
    }
    public void processDatapack(@NonNull JSONObject datapack){
        //code...
    }
}