class Sprites:
    SIZE = 16

    def __init__(self, rw, rh):
        self._realWidth = rw
        self._realHeight = rh

    def getSize(self):
        return self.SIZE

    def get_realWidth(self):
        return self._realWidth

    def get_realHeight(self):
        return self._realHeight