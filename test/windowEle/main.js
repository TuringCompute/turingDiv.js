import {WinEle} from "../../component/window/window.js"

window.main = function main(){
    let winEle = new WinEle(
        {
            "divId": "windowRoot",
            "width": 500,
            "height": 200
        }
    )
    winEle.render()
}
