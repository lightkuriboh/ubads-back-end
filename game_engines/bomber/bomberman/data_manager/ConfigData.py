import json
from bomberman.GameInfo import GameInfo
class ConfigData:
    def __init__(self, path):
        self._path = path

    def loadConfig(self):
        with open(self._path) as f:
            data = json.load(f)
        GameInfo.setBombDelay(data["data"]["bomb_delay"])
        GameInfo.setBomberSpeed(data["data"]["bomber_speed"])
        GameInfo.setBrickDelay(data["data"]["brick_delay"])
        GameInfo.setBombRadius(data["data"]["bomb_radius"])
        GameInfo.setBombRate(data["data"]["bomb_rate"])
        GameInfo.setHeight(data["data"]["height"])
        GameInfo.setWidth(data["data"]["width"])
        GameInfo.setTime(data["data"]["time"])
        GameInfo.setPoint(data["data"]["point"])
        GameInfo.setDefaultInput(data["data"]["default_input"])
        GameInfo.setItemCooldown(data["data"]["item_cooldown"])
        GameInfo.setExplodeTime(data["data"]["explode_time"])

