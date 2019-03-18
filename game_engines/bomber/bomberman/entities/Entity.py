"""Lớp đại diện cho tất cả thực thể trong game (Bomber, Enemy, Wall, Brick,...)"""
import abc
import math
from bomberman.level.Coordinates import Coordinates

class Entity(abc.ABC):
    _x = 0.0
    _y = 0.0
    _remove = False
    _sprite = None

    """ Phương thức này được gọi liên tục trong vòng lặp game,
	mục đích để xử lý sự kiện và cập nhật trạng thái Entity
	"""
    @abc.abstractmethod
    def update(self):
        pass

    def remove(self):
        self._remove = True

    def isRemove(self):
        return self._remove

    def getSprite(self):
        return self._sprite

    """
    Phương thức kiểm tra xem hai entity có va chạm vào nhau không.
    Trong một số entity đặc biệt như bomber hay enemy hàm này sẽ thêm một số xử lý
    """
    def collide(self, _entity):
        return (self.getXTile() == _entity.getXTile() and self.getYTile() == _entity.getYTile())

    def getX(self):
        return self._x

    def getY(self):
        return self._y

    def getXTile(self):
        return Coordinates.pixelToTile(self._x)

    def getYTile(self):
        return Coordinates.pixelToTile(self._y)


