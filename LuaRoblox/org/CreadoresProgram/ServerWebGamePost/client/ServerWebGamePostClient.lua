local HttpService = game:GetService("HttpService")

local ServerWebGamePostClient = {}
ServerWebGamePostClient.__index = ServerWebGamePostClient

function ServerWebGamePostClient.new(domain, port, isHttps)
    local self = setmetatable({}, ServerWebGamePostClient)
    self.domain = domain
    self.port = port
    self.isHttps = isHttps
    self.processDatapackspriv = nil
    return self
end

function ServerWebGamePostClient:setProcessDatapacks(callback)
    self.processDatapackspriv = callback
end

function ServerWebGamePostClient:getProcessDatapacks()
    return self.processDatapackspriv
end

function ServerWebGamePostClient:sendDataPacket(datapack)
    local prefix = self.isHttps and "https://" or "http://"
    local url = prefix .. self.domain .. ":" .. tostring(self.port) .. "/ServerWebGamePost"
    local jsonData = HttpService:JSONEncode(datapack)
    
    local success, response = pcall(function()
        return HttpService:RequestAsync({
            Url = url,
            Method = "POST",
            Headers = {
                ["Content-Type"] = "application/json"
            },
            Body = jsonData
        })
    end)
    
    if success then
        local data = HttpService:JSONDecode(response.Body)
        self:processSubDatapackspriv(data)
    else
        error("HTTP Request failed: " .. tostring(response))
    end
end

function ServerWebGamePostClient:processSubDatapackspriv(datapacks)
    if datapacks and datapacks.datapacksLot then
        for _, dp in ipairs(datapacks.datapacksLot) do
            if self.processDatapackspriv then
                self.processDatapackspriv(dp)
            end
        end
    end
end

return ServerWebGamePostClient