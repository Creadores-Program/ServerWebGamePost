<?php

final class Client {
    private $domain;
    private $port;
    private $isHttps;
    private $processDatapacksPriv;

    public function __construct($domain, $port, $isHttps) {
        $this->domain = $domain;
        $this->port = $port;
        $this->isHttps = $isHttps;
    }
    
    public function setProcessDatapacks(callable $callback) {
        $this->processDatapacksPriv = $callback;
    }
    
    public function getProcessDatapacks() {
        return $this->processDatapacksPriv;
    }
    
    public function sendDatapacket($datapack) {
        $prefix = $this->isHttps ? "https://" : "http://";
        $url = $prefix . $this->domain . ":" . $this->port . "/ServerWebGamePost";
        $jsonData = json_encode($datapack);
        
        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
        curl_setopt($ch, CURLOPT_POSTFIELDS, $jsonData);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            "Content-Type: application/json",
            "Content-Length: " . strlen($jsonData)
        ]);
        
        $response = curl_exec($ch);
        if ($response === false) {
            throw new Exception("cURL error: " . curl_error($ch));
        }
        curl_close($ch);
        
        $decodedResponse = json_decode($response, true);
        if (is_array($decodedResponse)) {
            $this->processSubDatapacksPriv($decodedResponse);
        }
    }
    
    private function processSubDatapacksPriv($datapacks) {
        if (isset($datapacks['datapacksLot']) && is_array($datapacks['datapacksLot'])) {
            foreach ($datapacks['datapacksLot'] as $data) {
                if (is_callable($this->processDatapacksPriv)) {
                    call_user_func($this->processDatapacksPriv, $data);
                }
            }
        }
    }
}
?>