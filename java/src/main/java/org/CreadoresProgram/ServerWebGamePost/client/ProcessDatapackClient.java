package org.CreadoresProgram.ServerWebGamePost.client;
import lombok.Getter;
import lombok.Setter;
import lombok.NonNull;
import com.alibaba.fastjson2.JSONObject;
import com.alibaba.fastjson2.JSONArray;
public class ProcessDatapackClient{
    @Getter
    public ServerWebGamePostClient server;
    public ProcessDatapackClient(@NonNull ServerWebGamePostClient server){
        this.server = server;
    }
    public void process(@NonNull JSONObject datapacksLot){
        JSONArray datapacks = datapacksLot.getJSONArray("datapacksLot");
        for(Object datapackOb : datapacks){
            JSONObject datapack = (JSONObject) datapackOb;
            this.processDatapack(datapack);
        }
    }
    public void processDatapack(@NonNull JSONObject datapack){
        //code...
    }
}