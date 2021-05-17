import {DivEle} from "../../lib/divEle.js"
import {Format} from "../../lib/format.js"
import {EventSrc} from "../../lib/event.js"


class TabSwitch extends DivEle{
    static Event = Object.freeze({
        "clicked": "tabSwitchTabClicked",
        "changed": "tabSwitchSectionChanged"
    })

    static Key = Object.freeze({
        "tabDisplay": "tabSwitchDisplay",
        "tabKey": "tabSwitchTabKey",
        "tabList": "tabSwitchTabList"
    })

    constructor(props){
        super(props)
        if(!props.hasOwnProperty(TabSwitch.Key.tabList) || !Array.isArray(props[TabSwitch.Key.tabList] || props[TabSwitch.Key.tabList].length==0)){
            throw Error("property " +TabSwitch.Key.tabList + " need to be an array with data")
        }
        this.tabList = []
        for(let idx in props[TabSwitch.Key.tabList]){
            let tab = props[TabSwitch.Key.tabList][idx]
            if(!tab.hasOwnProperty(TabSwitch.Key.tabKey)){
                throw Error("missing Key [" + TabSwitch.Key.tabKey + "] @ tab #" + idx)
            }
            if (!tab.hasOwnProperty(TabSwitch.Key.tabDisplay)){
                throw Error("missing Key [" + TabSwitch.Key.tabDisplay + "] @ tab #" + idx)
            }
            this.tabList.push(tab)
        }
        this.selectedTab = 0
    }

    processEvent(eventObj){
        if(eventObj.type == TabSwitch.Event.clicked && eventObj.src != this.selectedTab){
            this.selectedTab = eventObj.src
            eventObj.type = TabSwitch.Event.changed
            eventObj.src = this.id
            return true
        }
        EventSrc.stop(eventObj)
        return false
    }

    selectedTabValue(){
        let tab = this.tabList[this.selectedTab]
        return tab[TabSwitch.Key.tabKey]
    }

    selectedTabHtml(idx){
        let display = this.tabList[idx][TabSwitch.Key.tabDisplay]
        return "<td style='border-left: 1px solid rgba(204,31,48,1);border-top: 2px solid rgba(204,31,48,1);border-right: 2px solid rgba(204,31,48,1);cursor:default;'>" + display + "</td>"
    }

    optTabHtml(idx){
        let display = this.tabList[idx][TabSwitch.Key.tabDisplay]
        let selectEvent = EventSrc.new(TabSwitch.Event.clicked, idx, {})
        return "<td style='border-top: 1px solid rgba(204,31,48,1);border-right: 1px solid rgba(204,31,48,1);cursor:hand;' onclick='" + this.eventTriger(selectEvent) +"'>" + display + "</td>"
    }

    outputTabHtml(){
        let tabList = []
        for(let idx=0; idx< this.tabList.length; idx++){
            if(idx == this.selectedTab){
                tabList.push(this.selectedTabHtml(idx))
            } else {
                tabList.push(this.optTabHtml(idx))
            }
        }
        return tabList
    }

    outputHTML(){
        let htmlList = []
        htmlList.push("<table>")
        let tabList = this.outputTabHtml()
        Format.applyIndent(tabList)
        tabList.splice(0,0,"<tr>")
        tabList.push("</tr>")
        Format.applyIndent(tabList)
        htmlList.push(...tabList)
        htmlList.push("</table>")
        this.addDivEleFrame(htmlList)
        return htmlList
    }

}

export {TabSwitch}
