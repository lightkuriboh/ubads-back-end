from bomberman.entities.character.Character import Character
from bomberman.graphic.Sprite import Sprite
from bomberman.GameInfo import GameInfo
from bomberman.level.Coordinates import Coordinates
from bomberman.entities.bomb.Bomb import Bomb
from bomberman.entities.character.enemy.Enemy import Enemy
from bomberman.entities.bomb.FlameSegment import FlameSegment
from bomberman.entities.tile.destroyable.Brick import Brick
class Bomber(Character):
    """
    bombRad là bán kính của quả bomb
    bombRate là số bomb tối đa bomber có thể đặt
    """
    def __init__(self, x, y, board, id):
        Character.__init__(self, x, y, board, id)
        self._bombs = []
        if id == 1:
            self._sprite = Sprite.player_right
        else:
            self._sprite = Sprite.player_left
        """Số lượng bomb tối đa Bomber có thể đặt"""
        self._bomRate = GameInfo.getBombRate()
        """Bán kính quả bomb do Bomber này đặt"""
        self._bombRad = GameInfo.getBombRadius()
        """ Nếu readyTime = 0 thì có thể đặt bomb, mỗi lần đặt bomb readyTime sẽ
        được reset về một giá trị cho trước và giảm dần cho đến khi = 0 """
        self._readyTime = 0

    def update(self):
        #print(self.getXTile(), self.getYTile(), self.getId(), self._dirState)
        self.clearBombs()
        if not self._alive:
            self.remove()
        else:
            self.calculateMove()
            self.detectPlaceBomb()
            self.checkSurvive()
            if self._readyTime > 0:
                self._readyTime -= 0

    """Kiểm tra xem đối tượng có bị va chạm với enemy không"""
    def checkSurvive(self):
        opponentId = 1
        if self._id == 1:
            opponentId = 0
        enemy = self._board.getEnemyWithId(opponentId)
        self.collide(enemy)

    """
    Kiểm tra xem AI có muốn đặt bomb không
    """
    def detectPlaceBomb(self):
        if (self._dirState & (1 << 4)) > 0:
            self.placeBomb()

    """ 
    đặt bomb ở tile có tọa độ tile (x, y) nếu có thể
    """
    def placeBomb(self):
        xTile = Coordinates.pixelToTile(self._x + self._sprite.get_realWidth() / 2 - 1)
        yTile = Coordinates.pixelToTile(self._y + self._sprite.get_realHeight() / 2 - 1)
        x = Coordinates.tileToPixel(xTile)
        y = Coordinates.tileToPixel(yTile)
        layer = self._board.getLayeredEntityAt(xTile, yTile)
        if not self.canPlaceBomb():
            return
        bomb = Bomb(x, y, self._board, self._bombRad)
        self._bombs.append(bomb)
        layer.addTop(bomb)
        self._readyTime = GameInfo.getBombDelay()

    """
    Hàm sẽ kiểm tra xem ở vị trí hiện tại có thể đặt bomb hay không
    """
    def canPlaceBomb(self):
        if self._readyTime != 0 and self.getCurrentBombNumber() >= self._bombRad:
            return False
        xTile = Coordinates.pixelToTile(self._x + self._sprite.get_realWidth() / 2 - 1)
        yTile = Coordinates.pixelToTile(self._y + self._sprite.get_realHeight() / 2 - 1)
        layer = self._board.getLayeredEntityAt(xTile, yTile)
        if isinstance(layer.getTopEntity(), Brick) or isinstance(layer.getTopEntity(), Bomb):
            return False
        else:
            return True

    def kill(self):
        self._alive = False

    """Loại bỏ các đối tượng bomb đã bị remove trong list"""
    def clearBombs(self):
        self._bombs = [bomb for bomb in self._bombs if not bomb.isRemove()]

    def getCurrentBombNumber(self):
        return len(self._bombs)

    """Bomber sẽ gọi hàm kill() khi va chạm với Enemy của đối phương hoặc lửa"""
    def collide(self, _entity):
        res = super(Bomber, self).collide(_entity)

        if res:
            if (isinstance(_entity, Enemy) and _entity.getId() != self._id) \
                    or isinstance(_entity, FlameSegment):
                self.kill()
        return res

    def increaseBombRate(self, x):
        self._bomRate += x

    def increaseSpeed(self, x):
        self._speed += x

    def increaseBombRadius(self, x):
        self._bombRad += x

    def getBombRad(self):
        return self._bombRad

    def getBombRate(self):
        return self._bomRate

    def getBoard(self):
        return self._board

    def addPoint(self):
        self._board.addPoint(self)

    def getBombsList(self):
        return self._bombs




