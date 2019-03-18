from bomberman.entities.Entity import Entity
from bomberman.graphic.Sprite import Sprite

"""
FlameSegment là class biểu diễn một ngọn lửa ở một Tile
"""
class FlameSegment(Entity):
    """
    @:param x
	@:param y
	@:param direction
    """
    def __init__(self, x, y, direction):
        self._x = x
        self._y = y
        self._direction = direction
        self._sprite = Sprite.explosion_horizontal
    
    def update(self):
        pass

    def collide(self, _entity):
        return super(FlameSegment, self).collide(_entity)
