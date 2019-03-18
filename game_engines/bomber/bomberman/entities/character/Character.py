from bomberman.entities.Entity import Entity
from bomberman.level.Coordinates import Coordinates
from bomberman.data_structure.DIRECTION import DIRECTION
from bomberman.GameInfo import GameInfo
import abc
"""
Bao gồm Bomber và Enemy
"""
class Character(Entity):
    def __init__(self, x, y, board, id):
        self._id = id
        self._x = x
        self._y = y
        self._board = board

        """Hướng quay mặt của Character, dùng để chọn Sprite hiển thị"""
        self._direction = -1

        """Kiểm tra xem character còn sống không"""
        self._alive = True

        """Kiểm tra xem character có đang di chuyển không"""
        self._moving = False

        self._speed = GameInfo.getBomberSpeed()

        """_dirState có dạng biểu diễn nhị phân mà bit thứ i bằng 0 thì character 
        đang đi về hướng i trong bảng DIRECTION. Bit thứ 4 thì cho biết bomber 
        có đặt bomb hay không, với Enemy bit này cho biết Enemy có đặt tường không"""
        self._dirState = 0

    @abc.abstractmethod
    def update(self):
        pass

    """
    Tính toán hướng đi cho Character dựa theo dirState
    """
    def calculateMove(self):
        newX = self._x
        newY = self._y
        self._moving = False
        if (self._dirState & (1 << DIRECTION.NORTH)) > 0:
            newY -= self._speed
            self._moving = True
        if (self._dirState & (1 << DIRECTION.SOUTH)) > 0:
            newY += self._speed
            self._moving = True
        if (self._dirState & (1 << DIRECTION.WEST)) > 0:
            newX -= self._speed
            self._moving = True
        if (self._dirState & (1 << DIRECTION.EAST)) > 0:
            newX += self._speed
            self._moving = True
        newCrd = Coordinates.fixCoordinates(newX, newY, self._speed)
        newX = newCrd[0]
        newY = newCrd[1]
        if self._moving:
            self.move(newX, newY)

    """
    Di chuyển Character đến tọa độ pixel(xa, ya)
    """
    def move(self, xa, ya):
        if xa > self._x:
            self._direction = DIRECTION.EAST
        if xa < self._x:
            self._direction = DIRECTION.WEST
        if ya > self._y:
            self._direction = DIRECTION.NORTH
        if ya < self._y:
            self._direction = DIRECTION.SOUTH
        if not self.canMove(xa, ya):
            if self.canMove(self._x, ya):
                xa = self._x
            elif self.canMove(xa,self._y):
                ya = self._y
            else:
                xa = self._x
                ya = self._y
        #print(xa, ya, self.canMove(xa, ya))
        self._x = xa
        self._y = ya

    """
    Kiểm tra xem đối tượng có thể đi đến vị trí(x,y) trên tọa độ pixel hay không
    """
    def canMove(self, x, y):
        xTile = Coordinates.pixelToTile(x)
        yTile = Coordinates.pixelToTile(y)
        return self._board.availableForCharacter(xTile, yTile, self)

    """
    Được gọi khi đối tượng bị tiêu diệt
    """
    @abc.abstractmethod
    def kill(self):
        pass

    def getId(self):
        return self._id

    """
    Dirstate nay do nguoi choi truyen vao nen chi co 0-5
    """
    def setDirState(self, dirState):
        dirState -= 1
        if dirState < 0:
            self._dirState = 0
        else:
            self._dirState = (1 << dirState)

    def getSpeed(self):
        return self._speed