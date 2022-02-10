import webview
from main import main

"""
serverless app architecture
"""

class Api():
    def __init__(self) -> None:
        self.window = None

    def set_window(self, window: webview.Window) -> None:
        self.window = window

    def exit(self) -> None:
        # KeyError: 'master'
        self.window.destroy()

    def toggleFullscreen(self) -> None:
        # JS: window.pywebview.api.toggleFullscreen()
        self.window.toggle_fullscreen()


if __name__ == '__main__':
    api = Api()
    window = webview.create_window(
        'pywebview window', 
        'assets/index.html', 
        js_api=api, 
        min_size=(1000, 500),
        # fullscreen=True,
        # frameless=True,
    )
    api.set_window(window)
    webview.start(main, window, debug=True)