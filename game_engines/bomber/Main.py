from bomberman.Game import Game

def parse_args(args):
    return args[1], args[2], args[3]

if __name__ == "__main__":
    import sys
    args = sys.argv
    id, name1, name2 = parse_args(args)
    game = Game(id, name1, name2)
    game.start()
