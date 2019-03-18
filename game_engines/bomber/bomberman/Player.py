from bomberman.entities.character.Bomber import Bomber
from bomberman.entities.character.enemy.Enemy import Enemy
from bomberman.level.Coordinates import Coordinates


class Player:
    def __init__(self, id, board):
        self._point = 0
        self._id = id
        if self._id == 0:
            self._bomber = Bomber(Coordinates.tileToPixel(1), Coordinates.tileToPixel(1), board, id)
            self._enemy = Enemy(Coordinates.tileToPixel(1), Coordinates.tileToPixel(board.getHeight()- 2), board, id)
        elif self._id == 1:
            self._bomber = Bomber(Coordinates.tileToPixel(board.getWidth() - 2), Coordinates.tileToPixel(board.getHeight() - 2), board, id)
            self._enemy = Enemy(Coordinates.tileToPixel(board.getWidth() - 2), Coordinates.tileToPixel(1), board, id)

    def updateBomber(self):
        self._bomber.update()

    def updateEnemy(self):
        self._enemy.update()

    def setBomber(self, bomber):
        self._bomber = bomber

    def setEnemy(self, enemy):
        self._enemy = enemy

    def getBomber(self):
        return self._bomber

    def getEnemy(self):
        return self._enemy

    def addPoint(self, point):
        self._point += point

    def getPoint(self):
        return self._point

    """Đọc vào input của người chơi"""
    def setInput(self, inputList):
        self._bomber.setDirState(inputList[0])
        self._enemy.setDirState(inputList[1])

