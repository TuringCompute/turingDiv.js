import {TabSwitch} from "../../component/tabSwitch/tabSwitch.js"

window.main = function main(){
    let param = {
        "divId": "displaySelect"
    }
    param[TabSwitch.Key.tabList] = [
        {
            [TabSwitch.Key.tabKey]: "optA",
            [TabSwitch.Key.tabDisplay]: "option A"
        }, 
        {
            [TabSwitch.Key.tabKey]: "optB",
            [TabSwitch.Key.tabDisplay]: "option B"
        },
        {
            [TabSwitch.Key.tabKey]: "optC",
            [TabSwitch.Key.tabDisplay]: "option C"
        }
    ]
    let tabSwitch = new TabSwitch(param)
    tabSwitch.render()
}
