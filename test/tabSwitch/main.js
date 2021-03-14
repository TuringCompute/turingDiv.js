import {TabSwitch} from "../../component/tabSwitch/tabSwitch.js"
import {DataStore} from "../../lib/dataStore.js"
import {DivEle} from "../../lib/divEle.js"

class TabSwitchTest extends DivEle{
    constructor(props){
        super(props)
        let tabSwitch = new TabSwitch({
            "divId": "tabDiv"
        })
        this.selectionData = DataStore.GetStore().getData(tabSwitch.id, DataStore.subscriber(this.id, this.handleEvent))
        tabSwitch.bindData(["optA", "optB", "optC"])
        tabSwitch.render()
    }

    processEvent(src, event, eventObj){
        if(eventObj.type==DataStore.dataChanged){
            return true
        }
    }

    outputHTML(){
        let htmlList = []
        htmlList.push("selected idx=[" + this.selectionData.selectedIdx + "], value=[" + this.selectionData.tabData[this.selectionData.selectedIdx] + "]")
        this.addDivEleFrame(htmlList)
        return htmlList
    }
}

window.main = function main(){
    let tabSwitch = new TabSwitchTest({"divId": "displaySelect"})
    tabSwitch.render()
}
