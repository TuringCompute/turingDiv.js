import {WinEle} from "../../component/window/window.js"
import {MouseState} from "../../lib/mouse.js"


window.main = function main(){
    MouseState.start()
    let winEle = new WinEle(
        {
            "divId": "windowRoot",
            "width": 500,
            "height": 200
        }
    )
    winEle.render()
}
