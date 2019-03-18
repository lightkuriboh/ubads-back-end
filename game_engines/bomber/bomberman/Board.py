from bomberman.GameInfo import GameInfo
from bomberman.Player import Player
from bomberman.entities.bomb.Bomb import Bomb
from bomberman.level.FileLoader import FileLoader
from bomberman.entities.tile.destroyable.Brick import Brick
from bomberman.data_manager.RenderData import RenderData
from bomberman.data_structure.DIRECTION import DIRECTION
from bomberman.entities.tile.Wall import Wall
from bomberman.entities.character.Bomber import Bomber
from bomberman.entities.character.enemy.Enemy import Enemy
class Board:
    def __init__(self, game, id):
        self._player = []
        self._game = game
        self._width = GameInfo.getWidth()
        self._height = GameInfo.getHeight()
        """list layer entity, layered entity ở Tile (i, j) tương ứng với phần tử thứ
        j*(width) + i với width là chiều rộng bảng, i và j được đánh số bắt đầu từ 0"""
        self._entities = []
        """Số lượt diễn ra game"""
        self._time = GameInfo.getTime()
        """Số điểm cộng thêm khi ăn được item Point"""
        self.point = GameInfo.getPoint()
        self._listMessages = []
        """List Item Hole"""
        self._listHole = [0, 0, 0, 0]
        self.loadMap()
        self._turn = 0
        self._ended = False
        import os
        myPath = "../../../fight_log/" + id + ".json"
        self._converter = RenderData(os.path.join(game.getPath(),myPath),
                                        self._game.getPlayerName(0), self._game.getPlayerName(1))
        self.printInitialInfo()

    """
    print info for turn 0, including map width, height and number of turns
    """
    def printInitialInfo(self):
        print(self._width, self._height, GameInfo.getTime())
        import sys
        sys.stdout.flush()

    def update(self, inputList):
        if self._ended:
            return
        self._player[0].setInput([inputList[0], inputList[1]])
        self._player[1].setInput([inputList[2], inputList[3]])
        self.updateEntities()
        self.updatePlayers()
        self._turn += 1
        self.parseInfo()
        self.detectEndGame()
        self.writeInfo()

    def updateEntities(self):
        for x in range(self._width):
            for y in range(self._height):
                self._entities[y * self._width + x].update()

    def detectEndGame(self):
        if self._time > 1:
            self._time -= 1
        else:
            self.endGame()

    def updatePlayers(self):
        for player in self._player:
            player.updateEnemy()
        for player in self._player:
            player.updateBomber()

    """Xử lý các character hoặc entity bị lửa đốt, fseg là đối tượng FlameSegment được truyền vào"""
    def destroyAllAt(self, fseg):
        character = self.getCharacterAtExcluding(fseg.getXTile(), fseg.getYTile(), None)
        for char in character:
            char.collide(fseg)
        bomb = self.getUnexplodedBombAt(fseg.getXTile(), fseg.getYTile())
        if bomb != None:
            bomb.explode()
        layer = self.getLayeredEntityAt(fseg.getXTile(), fseg.getYTile())
        layer.getTopEntity().collide(fseg)

    """Hàm trả về layered entities có tọa độ tile là (xTile, yTile)"""
    def getLayeredEntityAt(self, xTile, yTile):
        return self._entities[yTile * self._width + xTile]

    """Hàm trả về list các character xuất hiện trong Tile (xTile, yTile) ngoại trừ character Exclude"""
    def getCharacterAtExcluding(self, xTile, yTile, Exclude):
        characters = []
        layer = self.getLayeredEntityAt(xTile, yTile)
        for player in self._player:
            characters.append(player.getBomber())
            characters.append(player.getEnemy())
        characters = [character for character in characters if (character.collide(layer) and character != Exclude)]
        return characters

    """
    Kiem tra xem character co bi va cham voi brick hay bomb nao co
    toa do tile(xTile, yTile) ma khong duoc phep hay khong. Tra ve
    True neu khong va False neu co
    """
    def availableForCharacter(self, xTile, yTile, character):
        layer = self.getLayeredEntityAt(xTile, yTile)
        if isinstance(layer.getTopEntity(), Wall):
            return False
        if isinstance(layer.getTopEntity(), Brick) or isinstance(layer.getTopEntity(), Bomb):
            if character in layer.getTopEntity().getCurChar():
                return True
            else:
                return False
        return True


    """
    Trả về một đối tượng bomb chua explode có tọa độ tile (xTile, yTile) 
    """
    def getUnexplodedBombAt(self, xTile, yTile):
        layer = self.getLayeredEntityAt(xTile, yTile)
        if isinstance(layer.getTopEntity(), Bomb):
            return layer.getUnexplodedBomb()
        else:
            return None

    """
    Hàm truyền bomber vào để lấy vị trí tạo ra Mesage tương ứng
    """
    def addPoint(self, bomber):
        self._player[bomber.getId()] += self.point

    def endGame(self):
        self._ended = True
        winner = 0
        if self._player[0].getPoint() > self._player[1].getPoint():
            winner = 1
        elif self._player[1].getPoint() > self._player[0].getPoint():
            winner = 2
        self._converter.writeObj()
        self._game.endGame(winner, self._player[0].getPoint(), self._player[1].getPoint())

    """
    Lấy tất cả các đối tượng bomb 
    """

    def getTotalBomb(self):
        bombsList = []
        for player in self._player:
            for bomb in player.getBomber().getBombsList():
                bombsList.append(bomb)
        return bombsList

    """
    Lấy tất cả các đối tượng bomb chua no
    """
    def getBombsList(self):
        bombsList = []
        for player in self._player:
            for bomb in player.getBomber().getBombsList():
                if not bomb.is_exploded():
                    bombsList.append(bomb)
        return bombsList

    """
    Lay cac doi tuong bomb da bi no
    """
    def getExplosionList(self):
        exList = []
        for player in self._player:
            for bomb in player.getBomber().getBombsList():
                if bomb.is_exploded():
                    exList.append(bomb)
        return exList

    """
    Tạo ra các đối tượng theo data của map
    """
    def loadMap(self):
        loader = FileLoader(self)
        loader.loadLevel()
        self._player = [Player(0, self), Player(1, self)]

    def setWidth(self, width):
        self._width = width

    def setHeight(self, height):
        self._height = height

    def getWidth(self):
        return self._width

    def getHeight(self):
        return self._height

    def getBomberWithId(self, id):
        return self._player[id].getBomber()

    def getEnemyWithId(self, id):
        return self._player[id].getEnemy()

    def setLayeredEntityAt(self, xTile, yTile, layer):
        self._entities[yTile * self._width + xTile] = layer

    """
    Trả về một list các doi tuong brick
    """
    def getBrickList(self):
        brickList = []
        for xTile in range(self.getWidth()):
            for yTile in range(self.getHeight()):
                layer = self.getLayeredEntityAt(xTile, yTile)
                if isinstance(layer.getTopEntity(), Brick):
                    brickList.append(layer.getTopEntity())
        return brickList

    """
    Khởi tạo mảng entities theo chiều dài và chiều rộng bảng
    """
    def initEntities(self):
        for i in range(self._width * self._height):
            self._entities.append(0)

    def getPlayer(self, id):
        return self._player[id]

    def getPath(self):
        return self._game.getPath()

    """
    In ra các thông tin hiện tại của game
    cho lần lượt player1 và player2
    """
    def writeInfo(self):
        p1 = self.playerInfo(0)
        p2 = self.playerInfo(1)
        data = []
        for item in p1:
            data.append(item)
        for item in p2:
            data.append(item)
        print(*data)

    """
    In ra thông tin cho player có _id = id
    """
    def playerInfo(self, id):
        oppId = 0
        if id == 0:
            oppId = 1
        bomber = self._player[id].getBomber()
        enemy = self._player[id].getEnemy()
        oppBomber = self._player[oppId].getBomber()
        oppEnemy = self._player[oppId].getEnemy()
        bombList = self.getTotalBomb()
        brickList = self.getBrickList()
        info = [ self._turn, self._player[id].getPoint(), self._player[oppId].getPoint(),
              bomber.getXTile(), bomber.getYTile(), enemy.getXTile(), enemy.getYTile(),
              oppBomber.getXTile(), oppBomber.getYTile(), oppEnemy.getXTile(), oppEnemy.getYTile(),
              self._listHole[0].getType(),self._listHole[0].getType(),self._listHole[0].getType(),self._listHole[0].getType()]

        info.append(len(brickList))
        for brick in brickList:
            info.append(brick.getXTile())
            info.append(brick.getYTile())
        info.append(len(bombList))
        for bomb in bombList:
            info.append(bomb.getXTile())
            info.append(bomb.getYTile())
            info.append(bomb.get_radius())
            info.append(bomb.get_timeToExplode())
        return info

    """
    Thêm một đối tượng Item Hole vào list
    """
    def addHole(self, itemHole):
        self._listHole[itemHole.getId()] = itemHole

    """
    Lay thong tin render cua id
    """
    def getPlayerRenderInfo(self, id):
        p = dict()
        player = self.getPlayer(id)
        p["score"] = player.getPoint()
        p["bombs"] = player.getBomber().getBombRate()
        p["rollers"] = player.getBomber().getSpeed()
        p["flames"] = player.getBomber().getBombRad()
        p["paws"] = player.getEnemy().getSpeed()
        bomber = dict()
        bomber["x"] = player.getBomber().getXTile()
        bomber["y"] = player.getBomber().getYTile()
        p["bomber"] = bomber
        enemy = dict()
        enemy["x"] = player.getEnemy().getXTile()
        enemy["y"] = player.getEnemy().getYTile()
        p["enemy"] = enemy
        #print(bomber["x"], bomber["y"], id)
        return p


    """
    Tạo các gói thông tin theo id
    """
    def parseInfo(self):

        game = dict()
        game["gameStatus"] = self._turn
        game["player_1"] = self.getPlayerRenderInfo(0)
        game["player_2"] = self.getPlayerRenderInfo(1)
        mine = []
        for hole in self._listHole:
            mine.append(hole.getType())
        game["mine"] = mine

        bombs = []
        bombList = self.getBombsList()
        for bomb in bombList:
            b = dict()
            b["x"] = bomb.getXTile()
            b["y"] = bomb.getYTile()
            bombs.append(b)
        game["bombs"] = bombs

        bricks = []
        bList = self.getBrickList()
        for brick in bList:
            b = dict()
            b["x"] = brick.getXTile()
            b["y"] = brick.getYTile()
            bricks.append(b)
        game["bricks"] = bricks

        explosions = []
        exList = self.getExplosionList()
        for bomb in exList:
            b = dict()
            b["x"] = bomb.getXTile()
            b["y"] = bomb.getYTile()
            b["u"] = bomb.getDirLength(DIRECTION.NORTH)
            b["d"] = bomb.getDirLength(DIRECTION.SOUTH)
            b["r"] = bomb.getDirLength(DIRECTION.EAST)
            b["l"] = bomb.getDirLength(DIRECTION.WEST)
            explosions.append(b)
        game["explosions"] = explosions
        self._converter.updateObj(game)






