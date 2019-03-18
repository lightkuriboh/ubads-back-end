from bomberman.entities.tile.Tile import Tile
from bomberman.entities.character.Bomber import Bomber
"""Item tăng 1 lượt đặt bomb"""
class BombItem(Tile):
    def __init__(self, x, y, sprite):
        Tile.__init__(self, x, y, sprite)

    def collide(self, _entity):
        res = super().collide(_entity)
        if res:
            if isinstance(_entity, Bomber):
                _entity.increaseBombRate(1)
                self.remove()
        return res

    def update(self):
        pass


