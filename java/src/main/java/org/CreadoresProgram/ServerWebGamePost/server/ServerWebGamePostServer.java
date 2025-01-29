package org.CreadoresProgram.ServerWebGamePost.server;
import spark.Service;
import lombok.Getter;
import lombok.Setter;
import lombok.NonNull;
import java.io.*;
import java.nio.file.Files;
import com.alibaba.fastjson2.JSONObject;
import com.alibaba.fastjson2.JSONArray;
import java.util.HashMap;
import java.util.ArrayList;
import javax.annotation.Nullable;
public final class ServerWebGamePostServer{
    @Getter
    private int port;
    @Getter
    public Service sparkServer;
    @Getter
    public ProcessDatapackServer processDatapacks;

    @Getter
    private HashMap<String, JSONArray> players;

    public ArrayList<String> bannedIps = new ArrayList<>();

    @Getter
    private ArrayList<String> filters = new ArrayList<>();

    public ServerWebGamePostServer(@NonNull int port){
        this(port, null);
    }

    public ServerWebGamePostServer(@NonNull int port, @Nullable String imgSrc){
        this(port, imgSrc, new ProcessDatapackServer());
    }

    public ServerWebGamePostServer(@NonNull int port, @Nullable String imgSrc, @NonNull ProcessDatapackServer procecerDatapacks){
        this.port = port;
        this.processDatapacks = procecerDatapacks;
        this.processDatapacks.setServer(this);
        this.players = new HashMap<>();
        this.sparkServer = Service.ignite();
        this.sparkServer.port(this.port);
        this.sparkServer.get("/favicon.ico", (req, res)-> {
            if(this.bannedIps.contains(req.ip())) return null;
            if(imgSrc == null){
                return "";
            }
            try{
                File logo = new File(imgSrc);
                byte[] logoBytes = Files.readAllBytes(logo.toPath());
                res.type("image/jpeg");
                res.status(200);
                res.raw().getOutputStream().write(logoBytes);
                res.raw().getOutputStream().flush();
                res.raw().getOutputStream().close();
                return res.raw();
            }catch(Exception e){
                res.status(500);
                System.err.println(e);
                return e;
            }
        });
        this.sparkServer.post("/ServerWebGamePost", this.processDatapacks);
        this.sparkServer.options("/ServerWebGamePost", (req, res)->{
            if(this.bannedIps.contains(req.ip())) return null;
            String allow = !this.getFilters().isEmpty() ? String.join(",", this.getFilters()) : "*";
            res.header("Access-Control-Allow-Origin", allow);
            res.header("Access-Control-Allow-Methods", "POST");
            res.header("Access-Control-Allow-Headers", "Content-Type");
            res.status(200);
            return "OK";
        });
    }
    public void sendDataPacket(@NonNull String identifier, @NonNull JSONObject datapack){
        if(!this.players.containsKey(identifier)){
            this.players.put(identifier, new JSONArray());
        }
        this.players.get(identifier).add(datapack);
    }
    public void stop(){
        if(this.sparkServer != null){
            this.sparkServer.stop();
            this.sparkServer.awaitStop();
        }
    }
    public void banIp(@NonNull String ip){
        this.bannedIps.add(ip);
    }
    public void unbanIp(@NonNull String ip){
        this.bannedIps.remove(ip);
    }
    public void addFilterOrigin(@NonNull String origin){
        this.filters.add(origin);
    }
    public void removeFilterOrigin(@NonNull String origin){
        this.filters.remove(origin);
    }
}