import {DataStore} from "../../lib/dataStore.js"
import {DivEle} from "../../lib/divEle.js"
import {Format} from "../../lib/format.js"
import {EventSrc} from "../../lib/event.js"


class TabSwitch extends DivEle{
    static selectionChanged = "tabSwitchSelectionChanged"

    constructor(props){
        super(props)
        this.dataBag = DataStore.GetStore().newData(this.id, DataStore.subscriber(this.id, this.handleEvent))
        this.tabCache = {}
    }

    bindData(tabOpts){
        if(!tabOpts || !Array.isArray(tabOpts) || tabOpts.length == 0){
            throw Error("data tabOpts need to be an array, and it cannot be empty")
        }
        this.dataBag.tabData = tabOpts
        this.dataBag.selectedIdx = 0
        DataStore.GetStore().notify(this.id)
    }

    selectIdx(idx){
        if(idx != this.dataBag.selectIdx){
            this.dataBag.selectedIdx = idx
            DataStore.GetStore().notify(this.id)
        }
    }

    tabDataChanged(){
        if(!this.tabCache || !this.tabCache.hasOwnProperty("selectedIdx") || !this.tabCache.hasOwnProperty("tabData")){
            return true
        }
        if(this.tabCache.selectedIdx != this.dataBag.selectedIdx){
            return true
        }
        if(this.tabCache.tabData.length != this.dataBag.tabData.length){
            return true
        }
        for(let idx=0; idx< this.tabCache.tabData.length; idx++){
            if(this.tabCache.tabData[idx] != this.dataBag.tabData[idx]){
                return true
            }
        }
        return false
    }

    processEvent(eventObj){
        if(eventObj.type == TabSwitch.selectionChanged){
            this.selectIdx(eventObj.src)
            return false
        }else if(eventObj.type == DataStore.dataChanged){
            return this.tabDataChanged()
        }
    }

    selectedTabValue(){
        return this.dataBag.tabData[this.dataBag.selectedIdx]
    }

    selectedTabHtml(idx){
        return "<td style='border-left: 1px solid rgba(204,31,48,1);border-top: 2px solid rgba(204,31,48,1);border-right: 2px solid rgba(204,31,48,1);cursor:default;'>" + this.dataBag.tabData[idx] + "</td>"
    }

    optTabHtml(idx){
        let selectEvent = EventSrc.new(TabSwitch.selectionChanged, idx, {})
        return "<td style='border-top: 1px solid rgba(204,31,48,1);border-right: 1px solid rgba(204,31,48,1);cursor:hand;' onclick='" + this.eventTriger(selectEvent) +"'>" + this.dataBag.tabData[idx] + "</td>"
    }

    outputTabHtml(){
        let tabList = []
        for(let idx=0; idx<this.dataBag.tabData.length; idx++){
            if(idx == this.dataBag.selectedIdx){
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
        this.tabCache.selectedIdx = this.dataBag.selectedIdx
        this.tabCache.tabData = this.dataBag.tabData
        return htmlList
    }

}

export {TabSwitch}
