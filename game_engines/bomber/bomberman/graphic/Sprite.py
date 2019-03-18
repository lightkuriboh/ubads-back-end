from bomberman.graphic.Sprites import Sprites
"""Lưu trữ thông tin các pixel của 1 sprite (hình ảnh game)"""


class Sprite:
    SIZE = 16
    """
    BOARD SPRITES
    """
    grass = Sprites(16, 16)
    brick = Sprites(16, 16)
    wall = Sprites(16, 16)
    portal = Sprites(16, 16)

    """
    BOMBER SPRITES
    """
    player_up = Sprites(16, 16)
    player_down = Sprites(16, 16)
    player_left = Sprites(16, 16)
    player_right = Sprites(16, 16)

    """
    CHARACTER SPRITES
    """
    #BALLOOM
    balloom_left_1 = Sprites(16, 16)

    balloom_right_1 = Sprites(16, 16)

    """
    BOMB SPRITES
    """
    bomb = Sprites(16, 16)

    """
    FLAMESEGMENT SPRITES
    """

    explosion_horizontal = Sprites(16, 16)
    """
    POWEUPS SPRITES
    """
    powerup_bombs = Sprites(16, 16)
    powerup_flame = Sprites(16, 16)
    powerup_speed = Sprites(16, 16)
    powerup_wallpass = Sprites(16, 16)
    powerup_detonator = Sprites(16, 16)
    powerup_bompass = Sprites(16, 16)
    powerup_flamepass = Sprites(16, 16)
    powerup_point = Sprites(16, 16)

    """
    ITEM HOLE SPRITE
    """
    item_hole = Sprites(16, 16)