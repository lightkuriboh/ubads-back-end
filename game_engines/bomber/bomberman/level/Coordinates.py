
from bomberman.graphic.Sprite import Sprite
"""
Chuyển đổi từ tọa độ trong mảng và tọa độ trên màn hình  
"""
class Coordinates:
    @staticmethod
    def pixelToTile(i):
        return (int)(i / Sprite.SIZE)

    @staticmethod
    def tileToPixel(i):
        return (int)(i * Sprite.SIZE)

    """
    Hàm này fix tọa độ để một đối tượng lọt hẳn vào một Tile nếu như nó chỉ
    thừa ra ngoài chút ít. Hàm này có tác dụng giúp các đối tượng rẽ trái phải
    dễ dàng hơn
    """
    @staticmethod
    def fixCoordinates(x, y, speed):
        newCrd = [x, y]

        if Coordinates.tileToPixel(Coordinates.pixelToTile(x) + 1) - x < speed:
            newCrd[0] = Coordinates.tileToPixel(Coordinates.pixelToTile(x) + 1)

        if Coordinates.tileToPixel(Coordinates.pixelToTile(y) + 1) - y < speed:
            newCrd[1] = Coordinates.tileToPixel(Coordinates.pixelToTile(y) + 1)

        if x - Coordinates.tileToPixel(Coordinates.pixelToTile(x)) < speed:
            newCrd[0] = Coordinates.tileToPixel(Coordinates.pixelToTile(x))

        if y - Coordinates.tileToPixel(Coordinates.pixelToTile(y)) < speed:
            newCrd[1] = Coordinates.tileToPixel(Coordinates.pixelToTile(y))

        newCrd[0] = int(newCrd[0])
        newCrd[1] = int(newCrd[1])
        return newCrd
