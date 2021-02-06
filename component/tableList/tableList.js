import { DataType } from "../../lib/dataType.js"
import { DataStore } from "../../lib/dataStore.js"
import {DivEle} from "../../lib/divEle.js"
import { Style } from "../../lib/style.js"

class TableList extends DivEle {
    static selectionChanged = "tableListSelectionChanged"

    constructor(props, parent=null){
        super(props, parent)
        this.fieldSchema = props.fieldSchema
        if(!this.fieldSchema){
            throw Error("missing display field schema")
        }
        this.displayOrder = props.displayOrder
        if(!this.displayOrder || this.displayOrder.length == 0){
            throw Error("displayOrder is missing or is empty")
        }
        this.validateDisplay()
        this.dataStore = props.dataStore
        if(!this.props.dataStore || !(this.props.dataStore instanceof DataStore)){
            throw Error("please provide DataStore from dataStore.js as storage backend")
        }
        this.selectDataId = props.selectDataId
        if(!this.selectDataId){
            throw Error("missing data allocation to store list selection result")
        }
        this.selection = this.dataStore.getData(this.selectDataId)
        if(!this.selection){
            throw Error("invalid selectDataId=" +selectDataId + " from DataStore")
        }
    }

    validateDisplay(){
        for(let attr of this.displayOrder){
            if(!this.fieldSchema[attr[0]] || !this.fieldSchema[attr[0]].type){
                throw Error("missing schema or data type for attr=" + attr[0])
            }
        }
    }

    bindData(dataId){
        if(!this.dataId || this.dataId!=dataId){
            if(this.dataId){
                this.dataStore.unsubscribe(this.dataId, this.id)
            }            
            this.dataId = dataId
            if(this.selection.dataId){
                delete this.selection.dataId
            }
            if(this.selection.data){
                delete this.selection.data
                this.dataStore.notify(this.selectDataId)
            }            
            this.dataBag = this.dataStore.getData(this.dataId, DataStore.subscriber(this.id, this.handleEvent))
            if(!this.dataBag){
                throw Error("invalid data=" + this.dataId + " from DataStore")
            }
            this.render()
        }
    }

    selectData(idx){
        if((!this.selectedIdx || this.selectedIdx != idx) && this.dataBag.data[idx]){
            this.selection.dataId = this.dataId
            this.selection.data = this.dataBag.data[idx]
            this.dataStore.notify(this.selectDataId)
            return true
        }
        return false
    }

    outputHTML(){
        let htmlList = []
        let headerStr = ""
        for(let idx in this.displayOrder){
            headerStr += "<th>" + this.displayOrder[idx][1] + "</th>"
        }
        htmlList.push(headerStr)
        if (this.dataBag && this.dataBag.data){
            let lineStr = ""
            for(let idx in this.dataBag.data){
                for(let cI in this.displayOrder){
                    let attr = this.displayOrder[cI][0]
                    let td_val = this.dataBag.data[idx][attr]
                    if (td_val === null){
                        td_val = ""
                    }
                    lineStr += "<td>" + td_val + "</td>"
                }
                let selectEvent = {
                    "src": idx,
                    "type": TableList.selectionChanged
                }
                lineStr = "<tr onclick='" + this.eventTriger(selectEvent) + "'>" + lineStr + "</tr>"
                htmlList.push(lineStr)
            }
        }
        Style.applyIndent(htmlList)
        htmlList.splice(0, 0, "<table border=1>")
        htmlList.push("</table>")
        return htmlList
    }

    processEvent(event){
        if(event.type == TableList.selectionChanged){
            return this.selectData(event.src)            
        }
        if(event.type == DataStore.dataChanged){
            return true
        }
        return false
    }
}

export {TableList}
