import {MenuReg} from "../../component/menuReg/menuReg.js"
import {DivEle} from "../../lib/divEle.js"

class TestMenu extends DivEle{
    constructor(props){
        super(props)
    }

    outputHTML(){
        let htmlList = [
            "<table border=1>",
            "  <tr>",
            "    <td onClick='alert(1)' style='cursor: pointer;'>line 1</td>",
            "  </tr>",
            "  <tr>",
            "    <td onClick='alert(2)' style='cursor: pointer;'>line 2</td>",
            "  </tr>",
            "</table>"
        ]
        return htmlList
    }
}

window.main = function main(){
    let regMenu = new MenuReg({
        "divId": "windowRoot"
    })
    new TestMenu({
        "parentId": regMenu.id,
        "childId": "test"
    })
    let nextMenu = new MenuReg({
        "divId": "windowRoot"
    })
}
