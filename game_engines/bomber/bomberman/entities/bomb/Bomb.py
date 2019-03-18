from bomberman.entities.Entity import Entity
from bomberman.level.Coordinates import Coordinates
from bomberman.graphic.Sprite import Sprite
from bomberman.entities.bomb.Flame import Flame
from bomberman.entities.bomb.FlameSegment import FlameSegment
from bomberman.data_structure.DIRECTION import DIRECTION
from bomberman.GameInfo import GameInfo
class Bomb(Entity):
    def __init__(self, x, y, board, radius):
        self._timeToExplode = GameInfo.getExplodeTime()
        self._sprite = Sprite.bomb
        self._curChar = []
        self._board = board
        self._x = Coordinates.tileToPixel(Coordinates.pixelToTile(x))
        self._y = Coordinates.tileToPixel(Coordinates.pixelToTile(y))
        self._radius = radius
        self._flame = []
        self._exploded = False
        self._clock = 0
        self.initCurChar()

    def update(self):
        if self._timeToExplode > 1:
            self._timeToExplode -= 1
        else:
            self._timeToExplode -= 1
            if not self._exploded:
                self.explode()
            else:
                self.updateFlames()
                self.remove()
        self.updateCurChar()
    """
    Hàm này và hàm updateCurChar có tác dụng khởi tạo và cập nhật các đối tượng 
    hiện tại đang va chạm với bom khi bom được đặt, nếu các đối tượng này đi ra
    khỏi vùng va chạm với bom sẽ không thể đi vào bom được nữa.
    """
    def initCurChar(self):
        character = self._board.getCharacterAtExcluding(self.getXTile(), self.getYTile(), None)
        for char in character:
            self._curChar.append(char)

    def updateCurChar(self):
        self._curChar = [char for char in self._curChar if self.collide(char)]

    def updateFlames(self):
        for flame in self._flame:
            flame.update()

    """
    Khởi tạo các đối tượng Flame và xử lý khi bom nổ
    """
    def explode(self):
        if self._exploded:
            return
        self._exploded = True

        """need fix"""
        self._flame.append(Flame(self._x, self._y, DIRECTION.SOUTH, self._radius, self._board))
        self._flame.append(Flame(self._x, self._y, DIRECTION.EAST, self._radius, self._board))
        self._flame.append(Flame(self._x, self._y, DIRECTION.NORTH, self._radius, self._board))
        self._flame.append(Flame(self._x, self._y, DIRECTION.WEST, self._radius, self._board))

        for flame in self._flame:
            flame.burn()
        flame = FlameSegment(self._x, self._y, DIRECTION.SOUTH)
        self._board.destroyAllAt(flame)

    """
    Do dai cua bomb khi no ve mot huong
    """
    def getDirLength(self, direction):
        return self._flame[direction].getLen()

    def getCurChar(self):
        return self._curChar

    def is_exploded(self):
        return self._exploded

    def get_radius(self):
        return self._radius

    def get_curChar(self):
        return self._curChar

    def get_timeToExplode(self):
        return self._timeToExplode
    """
    Trả về đối tượng flame theo hướng đã chọn của đối tượng bomb
    """
    def getFlameAt(self, idx):
        return self._flame[idx]