package org.CreadoresProgram.ServerWebGamePost.client;
import lombok.Getter;
import lombok.Setter;
import lombok.NonNull;
import com.alibaba.fastjson2.JSONObject;
import com.alibaba.fastjson2.JSON;
import java.net.HttpURLConnection;
import java.net.URL;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.IOException;

public class ServerWebGamePostClient{
    private String domain;
    private int port;
    private boolean isHttps;
    @Getter
    @Setter
    public ProcessDatapackClient processDatapacks;

    @Getter
    @Setter
    public String userAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36 Edg/128.0.0.0";

    public ServerWebGamePostClient(@NonNull String domain, @NonNull int port, @NonNull boolean isHttps){
        this.domain = domain;
        this.port = port;
        this.isHttps = isHttps;
        this.processDatapacks = new ProcessDatapackClient(this);
    }
    public void sendDataPacket(@NonNull JSONObject datapack){
        String prefix = "";
        if(this.isHttps){
            prefix = "https://";
        }else{
            prefix = "http://";
        }
        String datapackstr = datapack.toJSONString();
        HttpURLConnection serverFtch = new URL(prefix+this.domain+":"+this.port+"/ServerWebGamePost").openConnection();
        serverFtch.setRequestMethod("POST");
        serverFtch.setRequestProperty("User-Agent", this.userAgent);
        serverFtch.setRequestProperty("Content-Type", "application/json; utf-8");
        serverFtch.setDoOutput(true);
        try(OutputStream osftch = serverFtch.getOutputStream()){
            byte[] inputftch = datapackstr.getBytes("utf-8");
            osftch.write(inputftch, 0, inputftch.length);
        }catch(IOException e){
            System.err.println(e);
        }
        try(BufferedReader brftch = new BufferedReader(new InputStreamReader(serverFtch.getInputStream(), "uft-8"))){
            StringBuilder responseftch = new StringBuilder();
            String line;
            while((line = brftch.readLine()) != null){
                responseftch.append(line.trim());
            }
            this.processDatapacks.process(JSON.parseObject(responseftch.toString()));
        }catch(IOException e){
            System.err.println(e);
        }
    }
}