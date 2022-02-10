class Gate:
    def __init__(self, id, pos) -> None:
        self.id = id
        self.pos = pos
        self.nets = []

    def add_net(self, net):
        self.nets.append(net)
