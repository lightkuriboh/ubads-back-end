
"""
Chứa các thông tin cần thiết về game
"""
class GameInfo:
    WIDTH = 0
    HEIGHT = 0
    TITLE = "Bomberman"

    BOMRATE = 3
    BOMRADIUS = 1
    BOMBERSPEED = 1.0
    """ số lượt delay giữa hai lần đặt bomb """
    BOMBDELAY = 5

    """ số lượt delay giữa hai lần đặt wall """
    BRICKDELAY = 20

    """Thời gian hồi lại item ở item hole"""
    ITEMCOOLDOWN = 40

    TIME = 10
    POINT = 1

    """input mac dinh neu bot khong tra ve gi"""
    DEFAULTINPUT = [0, 0]

    EXPLODETIME = 0

    @staticmethod
    def getExplodeTime():
        return GameInfo.EXPLODETIME

    @staticmethod
    def setExplodeTime(explodeTime):
        GameInfo.EXPLODETIME = explodeTime

    @staticmethod
    def getDefaultInput():
        return GameInfo.DEFAULTINPUT

    @staticmethod
    def setDefaultInput(defaultInput):
        GameInfo.DEFAULTINPUT = defaultInput

    @staticmethod
    def getBombRadius():
        return GameInfo.BOMRADIUS

    @staticmethod
    def getBombRate():
        return GameInfo.BOMRATE

    @staticmethod
    def getBomberSpeed():
        return GameInfo.BOMBERSPEED

    @staticmethod
    def getBombDelay():
        return GameInfo.BOMBDELAY

    @staticmethod
    def getBrickDelay():
        return GameInfo.BRICKDELAY

    @staticmethod
    def getTime():
        return GameInfo.TIME

    @staticmethod
    def getItemCooldown():
        return GameInfo.ITEMCOOLDOWN

    @staticmethod
    def getPoint():
        return GameInfo.POINT

    @staticmethod
    def getWidth():
        return GameInfo.WIDTH

    @staticmethod
    def getHeight():
        return GameInfo.HEIGHT

    @staticmethod
    def setBombRadius(bomRad):
        GameInfo.BOMRADIUS = bomRad

    @staticmethod
    def setBombRate(bomRate):
        GameInfo.BOMRATE = bomRate

    @staticmethod
    def setBomberSpeed(speed):
        GameInfo.BOMBERSPEED = speed

    @staticmethod
    def setBombDelay(bombDelay):
        GameInfo.BOMBDELAY = bombDelay

    @staticmethod
    def setBrickDelay(brickDelay):
        GameInfo.BRICKDELAY = brickDelay

    @staticmethod
    def setTime(time):
        GameInfo.TIME = time

    @staticmethod
    def setItemCooldown(itemCoolDown):
        GameInfo.ITEMCOOLDOWN = itemCoolDown

    @staticmethod
    def setPoint(point):
        GameInfo.POINT = point

    @staticmethod
    def setWidth(width):
        GameInfo.WIDTH = width

    @staticmethod
    def setHeight(height):
        GameInfo.HEIGHT = height


