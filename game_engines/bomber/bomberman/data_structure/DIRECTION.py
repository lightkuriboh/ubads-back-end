class DIRECTION:
    NORTH = 2
    SOUTH = 0
    WEST = 3
    EAST = 1
    BOMB_PLACE = 4
    """
    Thay đổi tọa độ với mỗi hướng
    """
    @staticmethod
    def calDir(direction):
        if direction == DIRECTION.EAST:
            return [1, 0]
        if direction == DIRECTION.WEST:
            return [-1, 0]
        if direction == DIRECTION.SOUTH:
            return [0, 1]
        if direction == DIRECTION.NORTH:
            return [0, -1]