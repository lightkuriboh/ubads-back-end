from bomberman.Board import Board
from bomberman.data_manager.ConfigData import ConfigData
import time
class Game:

    def __init__(self, id, name1, name2):
        """Một mảng gồm hai phần tử DirState với phần tử thứ nhất của bomber và thứ 2 của enemy
        của player 1, phần tử thứ 3 của bomber và thứ 4 của enemy của player 2"""
        self._inputList = [0, 0]
        """Tên của hai player có id 0 và 1 lần lượt là phần tử thứ 1 và 2"""
        self._name = [name1, name2]
        """id của Game"""
        self._id = id
        import os
        self._path = os.path.dirname(__file__)
        self._winner = "GAME HASNOT BEEN FINISHED YET!"
        self.loadConfig()
        self._board = Board(self, id)
        self.dem = 0

    def update(self):
        self._board.update(self._inputList)
        """
        if self.dem != 0:
            self._board.update([DIRECTION.EAST + 1, DIRECTION.EAST + 1, DIRECTION.WEST + 1, DIRECTION.WEST + 1])
        else:
            self._board.update([5, 5, 5, 5])
        """
        self.dem += 1

    def loadConfig(self):
        import os
        config = ConfigData(os.path.join(self._path,"config/config.json"))
        config.loadConfig()

    def setInput(self, inputList):
        self._inputList = inputList

    def start(self):
        self._running = True
        cnt = 0
        while self._running:
            from bomberman.GameInfo import GameInfo
            b1, e1 = map(int, input().split())
            b2, e2 = map(int, input().split())
            #print(b1, e1)
            self.setInput([b1,e1,b2,e2])
            _start = time.time()
            self.update()
            if not self._running:
                break
            #time.sleep(max(1./25 - (time.time() - _start), 0))


    """
    Sau khi game kết thúc param winner là id của player dành thắng cuộc,
    nếu game có kết quả hòa winner = 0
    """
    def endGame(self, winner, p1Point, p2Point):
        self._running = False
        if winner == -1:
            self._winner = "TIE"
        else:
            self._winner = self._name[winner]
        self.writeResult(p1Point, p2Point, self._winner)

    """
    In ket qua
    -1 neu attacker thua, 1 neu win va 0 neu hoa
    """
    def writeResult(self, p1Point, p2Point, winnerName):
        import os
        path = "../../../fight_result/"+str(self._id)+".result"
        file = open(os.path.join(self._path, path), "w+")
        if winnerName == "TIE":
            s = str(0) + "*" + str(p1Point) + "*" + str(p2Point) + "*"
        elif self._name[0] == winnerName:
            s = str(1) + "*" + str(p1Point) + "*" + str(p2Point) + "*"
        else:
            s = str(-1) + "*" + str(p1Point) + "*" + str(p2Point) + "*"
        file.write(s)


    def getPlayerName(self, id):
        return self._name[id]

    def getWinner(self):
        return self._winner

    """
    path to the bomberman directory
    """
    def getPath(self):
        return self._path