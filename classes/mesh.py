import numpy as np

class Mesh:
    def __init__(self, dimensions: dict={"x":18,"y":8,"z":17}) -> None:
        self.dimensions = dimensions

        self.gates = []

        self.nodes = np.zeros((dimensions.x, dimensions.y, dimensions.z))


    def pos_empty(self, x: int, y: int, z: int) -> bool:
        return (self.nodes[x][y][z] == 0)

    
