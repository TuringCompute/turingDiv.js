import {DataStore} from "../../lib/dataStore.js"
import {DivEle} from "../../lib/divEle.js"
import {Format} from "../../lib/format.js"
import {Event} from "../../lib/event.js"

class TableList extends DivEle {
    static selectionChanged = "tableListSelectionChanged"

    constructor(props){
        super(props)
        this.fieldSchema = props.fieldSchema
        this.displayOrder = props.displayOrder
        this.validateSchema()
        this.selectDataId = props.selectDataId
        if(!this.selectDataId){
            throw Error("missing data allocation to store list selection result")
        }
        this.selection = DataStore.GetStore().getData(this.selectDataId)
        if(!this.selection){
            throw Error("invalid selectDataId=" +selectDataId + " from DataStore")
        }
    }

    validateSchema(){
        if(!this.fieldSchema){
            throw Error("missing display field schema")
        }
        if(!this.displayOrder || this.displayOrder.length == 0){
            throw Error("displayOrder is missing or is empty")
        }
        for(let attr of this.displayOrder){
            if(!this.fieldSchema[attr[0]] || !this.fieldSchema[attr[0]].type){
                throw Error("missing schema or data type for attr=" + attr[0])
            }
        }
    }

    bindData(dataId){
        if(!this.dataId || this.dataId!=dataId){
            let store = DataStore.GetStore()
            if(this.dataId){
                store.unsubscribe(this.dataId, this.id)
            }            
            this.dataId = dataId
            if(this.selection.dataId){
                delete this.selection.dataId
            }
            if(this.selection.data){
                delete this.selection.data
                store.notify(this.selectDataId)
            }            
            this.dataBag = store.getData(this.dataId, DataStore.subscriber(this.id, this.handleEvent))
            if(!this.dataBag){
                throw Error("invalid data=" + this.dataId + " from DataStore")
            }
            this.render()
        }
    }

    selectData(idx){
        if((!this.selection.idx || this.selection.idx != idx) && this.dataBag.data[idx]){
            this.selection.dataId = this.dataId
            this.selection.idx = idx
            this.selection.data = this.dataBag.data[idx]
            DataStore.GetStore().notify(this.selectDataId)
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
                if(idx != this.selection.idx){
                    let selectEvent = Event.new(TableList.selectionChanged, idx, {})
                    lineStr = "<tr onclick='" + this.eventTriger(selectEvent) + "'>" + lineStr + "</tr>"
                } else {
                    lineStr = "<tr style='background-color: #ddd;'>" + lineStr + "</tr>"
                }

                
                htmlList.push(lineStr)
            }
        }
        Format.applyIndent(htmlList)
        htmlList.splice(0, 0, "<table border=1>")
        htmlList.push("</table>")
        Format.applyIndent(htmlList)
        this.addDivEleFrame(htmlList)
        return htmlList
    }

    processEvent(src, event, eventObj){
        if(eventObj.type == TableList.selectionChanged){
            return this.selectData(eventObj.src)            
        }
        if(eventObj.type == DataStore.dataChanged){
            return true
        }
        return false
    }
}

export {TableList}
