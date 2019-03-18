import json
class RenderData:
    def __init__(self, path, name1, name2):
        self._path = path
        self.data = dict()
        self.gameif = dict()
        self.data["data"] = self.gameif
        self.gameif["player_1"] = name1
        self.gameif["player_2"] = name2
        self.gameif["result"] = ""
        self.gameif["game"] = []

    def updateObj(self, object):
        self.gameif["game"].append(object)

    def writeObj(self):
        with open(self._path, "w") as write_file:
            json.dump(self.data, write_file)