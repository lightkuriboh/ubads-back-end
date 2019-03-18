from bomberman.entities.tile.Tile import Tile
from bomberman.GameInfo import GameInfo
import random
from bomberman.entities.tile.item.BombItem import BombItem
from bomberman.entities.tile.item.FlameItem import FlameItem
from bomberman.entities.tile.item.SpeedItem import SpeedItem
from bomberman.entities.tile.item.Point import Point
from bomberman.graphic.Sprite import Sprite

class ItemHole(Tile):

    def __init__(self, x, y, sprite, board, id):
        Tile.__init__(self, x, y, sprite)
        self._item = None
        self._type = 0
        self._cooldown = GameInfo.getItemCooldown()
        self._board = board
        self._id = id

    """
    Khi cooldown = 0 sẽ reset lại đồng thời tạo ra một item 
    """
    def update(self):
        if self._item != None:
            return
        else:
            self._type = 0
        if self._cooldown > 0:
            self._cooldown -= 1
        else:
            layer = self._board.getLayeredEntityAt(self.getYTile(), self.getYTile())
            if self._type == 0:
                rdn = random.randint(1,4)
                if rdn == 1:
                    self._item = Point(self._x, self._y, Sprite.powerup_point)
                elif rdn == 2:
                    self._item = SpeedItem(self._x, self._y, Sprite.powerup_speed)
                elif rdn == 3:
                    self._item = FlameItem(self._x, self._y, Sprite.powerup_flame)
                elif rdn == 4:
                    self._item = BombItem(self._x, self._y, Sprite.powerup_bombs)
                self._type = rdn
            else:
                self._item = Point(self._x, self._y, Sprite.powerup_point)
                self._type = 1
            self._cooldown = GameInfo.getItemCooldown()
            layer.addTop(self._item)

    def getType(self):
        return self._type

    def getId(self):
        return self._id


