class Net:
    def __init__(self, gate0, gate1) -> None:
        self.gate = (gate0, gate1)
        self.dist = self.calc_dist(gate0, gate1)

        gate0.nets.append(self)
        gate1.nets.append(self)

        self.path = []
        self.pathlen = 0
        self.closed = False

    def calc_dist(self, gate0, gate1):
        """Get the Manhattan distance between the two gates"""
        return sum([abs(gate0.pos[axis]-gate1.pos[axis]) for axis in ["x", "y", "z"]])
