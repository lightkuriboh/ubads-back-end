from bomberman.entities.tile.Tile import Tile

class Grass(Tile):
    def __init__(self, x, y, sprite):
        Tile.__init__(self, x, y, sprite)

    def update(self):
        pass