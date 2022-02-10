import webview
import csv
import json

from classes.data_getter import DataGetter

def main(window: webview.Window) -> None:
    # window.evaluate_js(f"""document.body.insertAdjacentHTML("beforeend", '<div id="two">{json.dumps(parse_terminals(1))}</div>')""")

    data_getter = DataGetter(4)
    gate_list = data_getter.parse_gates()
    net_list = data_getter.parse_netlist()
    window.evaluate_js(f"""document.value.add_boxes({json.dumps(gate_list)})""")


