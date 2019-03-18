from bomberman.entities.character.Character import Character
from bomberman.entities.bomb.FlameSegment import FlameSegment
from bomberman.graphic.Sprite import Sprite
from bomberman.GameInfo import GameInfo
from bomberman.level.Coordinates import Coordinates
from bomberman.entities.tile.destroyable.Brick import Brick
from bomberman.entities.bomb.Bomb import Bomb
from bomberman.entities.tile.destroyable.Brick import Brick

class Enemy(Character):
    def __init__(self, x, y, board, id):
        Character.__init__(self, x , y, board, id)
        if id == 1:
            self._sprite = Sprite.balloom_right_1
        else:
            self._sprite = Sprite.balloom_left_1

        """ Nếu readyTime = 0 thì có thể đặt brick, mỗi lần đặt brick readyTime sẽ
        được reset về một giá trị cho trước và giảm dần cho đến khi = 0 """
        self._readyTime = 0

    def update(self):
        if not self._alive:
            self.remove()
        else:
            self.calculateMove()
            self.detectPlaceBrick()
            if self._readyTime > 0:
                self._readyTime -= 1

    """
    Kiểm tra xem AI có muốn đặt brick không
    """
    def detectPlaceBrick(self):
        if (self._dirState & (1 << 4)) > 0 :
            self.placeBrick()

    """ 
    đặt brick ở tile có tọa độ tile (x, y) nếu có thể
    """
    def placeBrick(self):
        xTile = Coordinates.pixelToTile(self._x + self._sprite.get_realWidth() / 2 - 1)
        yTile = Coordinates.pixelToTile(self._y + self._sprite.get_realHeight() / 2 - 1)
        x = Coordinates.tileToPixel(xTile)
        y = Coordinates.tileToPixel(yTile)
        layer = self._board.getLayeredEntityAt(xTile, yTile)
        if not self.canPlaceBrick():
            return
        brick = Brick(x, y, Sprite.brick, self._board)
        layer.addTop(brick)
        self._readyTime = GameInfo.getBrickDelay()

    """
    Hàm sẽ kiểm tra xem ở vị trí hiện tại có thể đặt brick hay không
    """
    def canPlaceBrick(self):
        if self._readyTime != 0:
            return False
        xTile = Coordinates.pixelToTile(self._x + self._sprite.get_realWidth() / 2 - 1)
        yTile = Coordinates.pixelToTile(self._y + self._sprite.get_realHeight() / 2 - 1)
        layer = self._board.getLayeredEntityAt(xTile, yTile)
        if isinstance(layer.getTopEntity(), Brick) or isinstance(layer.getTopEntity(), Bomb):
            return False
        else:
            return True


    def kill(self):
        if not self._alive:
            return
        self._alive = False
        # points can be changed if needed

    def collide(self, _entity):
        res = super(Enemy, self).collide(_entity)
        if res:
            if isinstance(_entity, FlameSegment):
                self.kill()
        return res
