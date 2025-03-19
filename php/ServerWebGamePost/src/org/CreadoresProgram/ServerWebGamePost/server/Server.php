<?php

final class Server {
    private $port;
    private $imgSrc;
    private $processDatapacks;
    private $players = [];
    private $filters = [];
    private $banIps = [];

    public function __construct($port, $imgSrc, callable $processDatapacks) {
        if ($port === null) {
            throw new Exception("NullPointerException in port not null");
        }
        if ($processDatapacks === null) {
            throw new Exception("NullPointerException in processDatapacks not null");
        }
        $this->port = $port;
        $this->imgSrc = $imgSrc;
        $this->processDatapacks = $processDatapacks;
    }
    
    public function getPort() {
        return $this->port;
    }
    
    public function getProcessDatapacks() {
        return $this->processDatapacks;
    }
    
    public function getPlayers() {
        return $this->players;
    }
    
    public function sendDataPacket($identifier, $datapack) {
        if (!isset($this->players[$identifier])) {
            $this->players[$identifier] = [];
        }
        $this->players[$identifier][] = $datapack;
    }
    
    public function deletePlayer($identifier) {
        unset($this->players[$identifier]);
    }
    
    public function addFilterOrigin($filter) {
        $this->filters[] = $filter;
    }
    
    public function removeFilterOrigin($filter) {
        $index = array_search($filter, $this->filters, true);
        if ($index !== false) {
            unset($this->filters[$index]);
            $this->filters = array_values($this->filters);
        }
    }
    
    public function banIp($ip) {
        $this->banIps[] = $ip;
    }
    
    public function unbanIp($ip) {
        $index = array_search($ip, $this->banIps, true);
        if ($index !== false) {
            unset($this->banIps[$index]);
            $this->banIps = array_values($this->banIps);
        }
    }
    public function processSubDatapacks() {
        $uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
        $method = $_SERVER['REQUEST_METHOD'];
        $remoteAddress = $_SERVER['REMOTE_ADDR'];
        
        if (!empty($this->banIps) && in_array($remoteAddress, $this->banIps)) {
            exit;
        }
        
        if ($uri === '/favicon.ico') {
            if ($method !== 'GET') {
                header($_SERVER['SERVER_PROTOCOL'] . ' 404 Not Found');
                exit;
            }
            if ($this->imgSrc === null) {
                echo "";
                exit;
            }
            $logoPath = __DIR__ . '/' . $this->imgSrc;
            if (!file_exists($logoPath)) {
                header($_SERVER['SERVER_PROTOCOL'] . ' 500 Internal Server Error');
                header("Content-Type: text/plain");
                echo "Error: imagen no encontrada";
                exit;
            }
            header("Content-Type: image/jpeg");
            readfile($logoPath);
            exit;
        } else if ($uri === '/ServerWebGamePost') {
            if ($method === 'OPTIONS') {
                header("Access-Control-Allow-Origin: " . (!empty($this->filters) ? implode(',', $this->filters) : '*'));
                header("Access-Control-Allow-Methods: POST");
                header("Access-Control-Allow-Headers: Content-Type");
                exit;
            }
            
            $headers = function_exists('getallheaders') ? getallheaders() : [];
            $origin = isset($headers['Origin']) ? $headers['Origin'] : '';
            
            if ($method !== 'POST' || (!empty($this->filters) && in_array($origin, $this->filters))) {
                header($_SERVER['SERVER_PROTOCOL'] . ' 404 Not Found');
                exit;
            }
            
            $body = file_get_contents("php://input");
            $datapack = json_decode($body, true);
            
            if ($datapack === null) {
                header($_SERVER['SERVER_PROTOCOL'] . ' 400 Bad Request');
                echo "Error: JSON inválido";
                exit;
            }
            
            call_user_func($this->processDatapacks, $datapack);
            
            $identifier = isset($datapack['identifier']) ? $datapack['identifier'] : null;
            $responseDatapacks = [];
            if ($identifier !== null && isset($this->players[$identifier])) {
                $responseDatapacks['datapacksLot'] = $this->players[$identifier];
                $this->players[$identifier] = [];
            } else {
                $responseDatapacks['datapacksLot'] = [];
            }
            
            header("Content-Type: application/json");
            header("Access-Control-Allow-Origin: " . (!empty($this->filters) ? implode(',', $this->filters) : '*'));
            header("Access-Control-Allow-Methods: POST");
            header("Access-Control-Allow-Headers: Content-Type");
            echo json_encode($responseDatapacks);
            exit;
        }
    }
}

?>