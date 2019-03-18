from bomberman.data_structure.DIRECTION import DIRECTION
from bomberman.entities.bomb.FlameSegment import FlameSegment
from bomberman.level.Coordinates import Coordinates
from bomberman.entities.Entity import Entity
from bomberman.entities.tile.destroyable.Brick import Brick
from bomberman.entities.tile.Wall import Wall
from bomberman.graphic.Sprite import Sprite

"""
Flame là một đối tượng biểu diễn một tia lửa theo đường thẳng.
Một đối tượng Bomb gồm 4 đối tượng Flame theo 4 phía của class DIRECTION
"""
class Flame(Entity):
    """
    @:param x hoành độ bắt đầu của Flame
	@:param y tung độ bắt đầu của Flame
    @:param direction là hướng của Flame
	@:param radius độ dài cực đại của Flame
	"""
    def __init__(self, x, y, direction, radius, board):
        dir_change = DIRECTION.calDir(direction)
        self._x = x + dir_change[0] * Sprite.SIZE
        self._y = y + dir_change[1] * Sprite.SIZE
        self._direction = direction
        self._radius = radius
        self._board = board
        self.createFlameSegments()

    """
    Tạo các FlameSegment, mỗi segment ứng một đơn vị độ dài
    """
    def createFlameSegments(self):
        self._flamesegment = []
        realLen = self.calculatePermitedDistance()
        dir_change = DIRECTION.calDir(self._direction)
        for i in range(realLen):
            xTile = self.getXTile() + i * dir_change[0]
            yTile = self.getYTile() + i * dir_change[1]
            self._flamesegment.append(FlameSegment(Coordinates.tileToPixel(xTile), Coordinates.tileToPixel(yTile),
                                                   self._direction))

    """
    Xử lý các entity khi bị lửa chạm vào
    """
    def burn(self):
        for fseg in self._flamesegment:
            self._board.destroyAllAt(fseg)

    """
    Tính toán độ dài của một Flame
    Một Flame sẽ dừng khi gặp phải Brick hay Wall
    """
    def calculatePermitedDistance(self):
        dir_change = DIRECTION.calDir(self._direction)
        len = self._radius
        for i in range(self._radius):
            xTile = self.getXTile() + i * dir_change[0]
            yTile = self.getYTile() + i * dir_change[1]
            layer = self._board.getLayeredEntityAt(xTile, yTile)

            if isinstance(layer.getTopEntity(), Wall):
                len = i - 1
                break
            elif isinstance(layer.getTopEntity(), Brick):
                len = i
                break
        return len

    def getLen(self):
        return len(self._flamesegment)

    def update(self):
        for fseg in self._flamesegment:
            fseg.update()
    
    def collide(self, _entity):
        return super(Flame, self).collide(_entity)
    


