from bomberman.data_structure.util import Stack
from bomberman.entities.Entity import Entity
from bomberman.entities.bomb.Bomb import Bomb
"""
Chứa và quản lý nhiều Entity tại cùng một vị trí
Ví dụ: tại vị trí dấu Item, có 3 Entity [Grass, Item, Brick]
"""
class LayeredEntity(Entity):

    def __init__(self, x, y, entitiesList):
        self._entities = Stack()
        self._x = x
        self._y = y
        for i in range(len(entitiesList)):
            self._entities.push(entitiesList[i])

    def update(self):
        self.getTopEntity().update()
        self.clearRemove()

    def getUnexplodedBomb(self):
        tmp = []
        result = None
        while isinstance(self.getTopEntity(), Bomb):
            bomb = self.getTopEntity()
            if bomb.is_exploded():
                tmp.append(bomb)
                self.removeTop()
            else:
                self.removeTop()
                result = bomb
                break
        cur = len(tmp)
        cur -= 1
        while cur >= 0:
            self.addTop(tmp[cur])
            cur -= 1
        return result

    def getTopEntity(self):
        return self._entities.top()

    def isEmpty(self):
        return self._entities.isEmpty()

    def removeTop(self):
        self._entities.pop()

    def addTop(self, e):
        self._entities.push(e)

    def addBeforeTop(self, e):
        x = self._entities.pop()
        self._entities.push(e)
        self._entities.push(x)

    def clearRemove(self):
        while not self.isEmpty() and self.getTopEntity().isRemove():
            self.removeTop()


    def getSprite(self):
        return self.getTopEntity().getSprite()

    def collide(self, e):
        return self.getTopEntity().collide(e)