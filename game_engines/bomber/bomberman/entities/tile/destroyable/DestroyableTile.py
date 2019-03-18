from bomberman.entities.tile.Tile import Tile
from bomberman.entities.bomb.FlameSegment import FlameSegment

"""Đối tượng cố định có thể bị phá hủy"""
class DestroyableTile(Tile):
    def __init__(self, x, y, sprite):
        Tile.__init__(self, x, y, sprite)
        self._destroyed = False
        self._timeToDisapear = 20

    def update(self):
        if self._destroyed:
            if self._timeToDisapear > 0:
                self._timeToDisapear -= 1
            else:
                self.remove()

    def destroy(self):
        self._destroyed = True

    def collide(self, _entity):
        res = super(DestroyableTile, self).collide(_entity)
        if res:
            if isinstance(_entity, FlameSegment):
                self.destroy()
        return res
