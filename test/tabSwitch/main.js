import {TabSwitch} from "../../component/tabSwitch/tabSwitch.js"

window.main = function main(){
    let param = {
        "divId": "displaySelect"
    }
    param[TabSwitch.Key.tabList] = ["optA", "optB", "optC"]
    let tabSwitch = new TabSwitch(param)
    tabSwitch.render()
}
