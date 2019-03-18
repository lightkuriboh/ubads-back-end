import abc
from bomberman.entities.Entity import Entity

class Tile(Entity):
    SIZE = 16
    def __init__(self, x, y, sprite):
        self._x = x
        self._y = y
        self._sprite = sprite

    def collide(self, _entity):
        return super(Tile, self).collide(_entity)

    @abc.abstractmethod
    def update(self):
        pass

