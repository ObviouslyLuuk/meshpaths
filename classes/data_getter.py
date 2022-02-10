import csv

class DataGetter:
    def __init__(self, netlist_id: int) -> None:
        self.netlist_id = netlist_id
        self.chip_id = 1
        if netlist_id > 3:
            self.chip_id = 2


    def parse_gates(self) -> list:
        with open(f"src_data/chip_{self.chip_id}/print_{self.chip_id}.csv", "r") as f:
            reader = csv.DictReader(f)
            gate_list = []
            for row in reader:
                gate_list.append((
                    int(row[" x"]), 
                    0, 
                    int(row[" y"]),
                ))
        return gate_list


    def parse_netlist(self) -> list:
        with open(f"src_data/chip_{self.chip_id}/netlist_{self.netlist_id}.csv", "r") as f:
            reader = csv.DictReader(f)
            net_list = []
            for row in reader:
                net_list.append((
                    int(row["chip_a"]), 
                    int(row[" chip_b"]),
                ))
        return net_list