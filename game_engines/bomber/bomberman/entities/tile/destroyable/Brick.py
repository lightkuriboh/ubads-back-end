from bomberman.entities.tile.destroyable.DestroyableTile import DestroyableTile
class Brick(DestroyableTile):
    def __init__(self, x, y, sprite, board):
        DestroyableTile.__init__(self, x, y, sprite)
        self._board = board
        self._curChar = []
        self.initCurChar()

    def update(self):
        super(Brick, self).update()
        self.updateCurChar()

    """
    Hàm này và hàm updateCurChar có tác dụng khởi tạo và cập nhật các đối tượng 
    hiện tại đang va chạm với brick khi brick được đặt, nếu các đối tượng này đi ra
    khỏi vùng va chạm với brick sẽ không thể đi vào brick được nữa.
    """
    def initCurChar(self):
        character = self._board.getCharacterAtExcluding(self.getXTile(), self.getYTile(), None)
        for char in character:
            self._curChar.append(char)

    def updateCurChar(self):
        self._curChar = [char for char in self._curChar if self.collide(char)]

    def getCurChar(self):
        return self._curChar



