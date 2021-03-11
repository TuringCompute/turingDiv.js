import {PopMenu} from "../../component/popMenu/popMenu.js"
import {DivEle} from "../../lib/divEle.js"

class TestMenu extends DivEle{
    constructor(props){
        super(props)
    }

    outputHTML(){
        let htmlList = [
            "<table border=1>",
            "  <tr>",
            "    <td>line 1</td>",
            "  </tr>",
            "  <tr>",
            "    <td>line 2</td>",
            "  </tr>",
            "</table>"
        ]
        return htmlList
    }
}

window.main = function main(){
    let popMenu = new PopMenu({
        "divId": "windowRoot"
    })
    new TestMenu({
        "parentId": popMenu.id,
        "childId": "test"
    })
}
