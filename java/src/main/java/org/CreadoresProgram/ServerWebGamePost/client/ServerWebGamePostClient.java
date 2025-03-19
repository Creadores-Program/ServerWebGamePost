package org.CreadoresProgram.ServerWebGamePost.client;

import lombok.Getter;
import lombok.Setter;
import lombok.NonNull;
import com.alibaba.fastjson2.JSONObject;
import com.alibaba.fastjson2.JSON;
import org.jsoup.Jsoup;
import org.jsoup.Connection;

public final class ServerWebGamePostClient {
    private String domain;
    private int port;
    private boolean isHttps;
    
    @Getter
    @Setter
    public ProcessDatapackClient processDatapacks;

    @Getter
    @Setter
    public String userAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36 Edg/134.0.0.0";

    public ServerWebGamePostClient(@NonNull String domain, @NonNull int port, @NonNull boolean isHttps) {
        this.domain = domain;
        this.port = port;
        this.isHttps = isHttps;
        this.processDatapacks = new ProcessDatapackClient(this);
    }

    public void sendDataPacket(@NonNull JSONObject datapack) {
        try {
            String prefix = this.isHttps ? "https://" : "http://";
            String datapackstr = datapack.toJSONString();
            String url = prefix + this.domain + ":" + this.port + "/ServerWebGamePost";
            
            Connection.Response response = Jsoup
                .connect(url)
                .userAgent(this.userAgent)
                .header("Content-Type", "application/json")
                .requestBody(datapackstr)
                .method(Connection.Method.POST)
                .ignoreContentType(true)
                .execute();
            
            this.processDatapacks.process(JSON.parseObject(response.body()));
        } catch(Exception erd) {
            System.err.println(erd);
        }
    }
}
