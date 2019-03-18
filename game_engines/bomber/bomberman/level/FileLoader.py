from bomberman.entities.tile.Grass import Grass
from bomberman.entities.tile.Wall import Wall
from bomberman.entities.tile.destroyable.Brick import Brick
from bomberman.entities.tile.ItemHole import ItemHole
from bomberman.entities.LayeredEntity import LayeredEntity
from bomberman.level.Coordinates import Coordinates
from bomberman.graphic.Sprite import Sprite

"""
class thực hiện việc tạo các entities theo một file text
"""
class FileLoader:
    def __init__(self, board):
        self._board = board
        """Kích thước của bảng nhập vào"""
        self._width = self._board.getWidth()
        self._height = self._board.getHeight()
        self._holeId = [1,0,2,3]

    def loadLevel(self):
        import os
        with open(os.path.join(self._board.getPath(),"config/map_data.txt"),"r") as f:
            self._board.initEntities()
            self._map = []
            for line in f:
                for char in line:
                    if char != '\n':
                        self._map.append(char)
            self.creatEntities()

    def creatEntities(self):
        countHole = 0
        for yTile in range(self._height):
            for xTile in range(self._width):
                pos = yTile * self._width + xTile
                x = Coordinates.tileToPixel(xTile)
                y = Coordinates.tileToPixel(yTile)
                layer = None
                if self._map[pos] == '#':
                    layer = LayeredEntity(x, y, [Wall(x, y, Sprite.wall)])
                elif self._map[pos] == '.':
                    layer = LayeredEntity(x, y , [Grass(x, y, Sprite.grass)])
                elif self._map[pos] == 'o':
                    layer = LayeredEntity(x, y, [Grass(x, y, Sprite.grass),
                                                 ItemHole(x, y, Sprite.item_hole, self._board, self._holeId[countHole])])
                    countHole += 1
                    self._board.addHole(layer.getTopEntity())
                self._board.setLayeredEntityAt(xTile, yTile, layer)




    def getWidth(self):
        return self._width

    def getHeight(self):
        return self._height

    def getLevel(self):
        return self._level