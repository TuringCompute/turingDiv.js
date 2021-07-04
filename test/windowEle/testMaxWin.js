import {WinEle} from "../../component/window/window.js"

// pass in no height and width, it should max to the window

window.main = function main(){
    let winEle = new WinEle(
        {
            "divId": "windowRoot"
        }
    )
    winEle.render()
}
