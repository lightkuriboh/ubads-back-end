from bomberman.entities.tile.Tile import Tile
from bomberman.entities.character.Bomber import Bomber
"""Item tăng bán kính của bomb lên 1"""
class FlameItem(Tile):
    def __init__(self, x, y, sprite):
        Tile.__init__(self, x, y, sprite)

    def collide(self, _entity):
        res = super().collide(_entity)
        if res:
            if isinstance(_entity, Bomber):
                _entity.increaseBombRadius(1)
                self.remove()
        return res

    def update(self):
        pass

