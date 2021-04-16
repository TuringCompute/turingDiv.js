import {DataStore} from "../../lib/dataStore.js"
import {DivEle} from "../../lib/divEle.js"
import {Format} from "../../lib/format.js"
import {EventSrc} from "../../lib/event.js"

class TableList extends DivEle {
    static selectionChanged = "tableListSelectionChanged"
    
    static Key = Object.freeze({
        "records": "tableListRecords",
        "selectedId":  "tableListSelectionIdx"        
    })

    constructor(props){
        super(props)
        this.fieldSchema = props.fieldSchema
        this.displayOrder = props.displayOrder
        this.validateSchema()
        this.dataBag = DataStore.GetStore().newData(this.id, DataStore.subscriber(this.id, this.handleEvent))
        this.dataBag[TableList.Key.records] = []
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

    // bind new data should not automatically re-render
    // only method meaning the component is already displayed can call notify
    bindData(data){
        if(!data || !Array.isArray(data)){
            throw Error("data to bind should be an array.")
        }
        this.dataBag[TableList.Key.records] = data
    }

    selectData(idx){
        if(!this.dataBag.hasOwnProperty(TableList.Key.selectedId) || this.dataBag[TableList.Key.selectedId] != idx){
            if(this.dataBag.hasOwnProperty(TableList.Key.records) && this.dataBag[TableList.Key.records][idx]){
                this.dataBag[TableList.Key.selectedId] = idx
                DataStore.GetStore().notify(this.id)
            }
        }
    }

    recordHtml(id, record){
        let selectedId = null;
        if(this.dataBag.hasOwnProperty(TableList.Key.selectedId)){
            selectedId = this.dataBag[TableList.Key.selectedId]
        }
        let style= ""
        let event = EventSrc.new(TableList.selectionChanged, id, {})
        let selectEvent = " onclick='" + this.eventTriger(event) + "' "
        if(id == selectedId){
            style = "background-color: #ddd;"
            selectEvent = ""
        }
        let lineStr = "<td align=center style='cursor: pointer;" + style + "'" + selectEvent + ">" + id + "</td>"
        for(let cI in this.displayOrder){
            let attr = this.displayOrder[cI][0]
            let td_val = record[attr]
            if (!td_val && td_val!=0){
                td_val = ""
            }
            lineStr += "<td style='cursor: pointer;" + style + "'" + selectEvent + ">" + td_val + "</td>"
        }
        return lineStr
    }

    listHtml(){
        let htmlList = []
        if (this.dataBag && this.dataBag.hasOwnProperty(TableList.Key.records)){
            for(let idx in this.dataBag[TableList.Key.records]){
                let record = this.dataBag[TableList.Key.records][idx]
                let recordLine = this.recordHtml(idx, record)
                htmlList.push("<tr>" + recordLine + "</tr>")
            }
        }
        return htmlList
    }

    headerHtml(){
        let headerStr = "<th>Idx</th>"
        for(let idx in this.displayOrder){
            headerStr += "<th>" + this.displayOrder[idx][1] + "</th>"
        }
        return headerStr
    }

    outputHTML(){
        let htmlList = []
        let headerStr = this.headerHtml()
        htmlList.push(headerStr)
        let itemLines = this.listHtml()
        htmlList.push(...itemLines)
        Format.applyIndent(htmlList)
        htmlList.splice(0, 0, "<table>")
        htmlList.push("</table>")
        Format.applyIndent(htmlList)
        this.addDivEleFrame(htmlList)
        return htmlList
    }

    processEvent(eventObj){
        if(eventObj.type == TableList.selectionChanged){
            this.selectData(eventObj.src)            
        } else if(eventObj.type == DataStore.dataChanged){
            return true
        }
        return false
    }
}

class EditList extends TableList {
    static Event = Object.freeze({
        "deleted": "editListRecordsDeleted",
        "checkbox": "editListRecordCheckBox"
    })

    static Key = Object.freeze({
        "new": "new",
        "newRecord": "editListNewRecord",
        "checkbox": "editListCheckboxList"
    })

    constructor(props){
        super(props)
        this.dataBag[EditList.Key.newRecord] = {}
        this.dataBag[EditList.Key.checkbox] = []
    }

    selectData(idx){
        super.selectData(idx)
        if(idx == EditList.Key.new){
            this.dataBag[TableList.Key.selectedId] = idx
            DataStore.GetStore().notify(this.id)
        }
    }

    headerHtml(){
        let headerLine = super.headerHtml()
        let event = EventSrc.new(EditList.Event.deleted, null, {})
        headerLine += "<th><button type='button' onClick='" + this.eventTriger(event) + "'>DEL</button></th>"
        return headerLine
    }

    recordHtml(idx, record){
        let recordLine = super.recordHtml(idx, record)
        let event = EventSrc.new(EditList.Event.checkbox, idx, this.dataBag[EditList.Key.newRecord])
        let checked = ""
        if(this.dataBag[EditList.Key.checkbox].includes(idx)){
            checked = "checked"
        }
        recordLine += "<td align=center><input type='checkbox' onChange='" + this.eventTriger(event) + "' " + checked + "></td>"
        return recordLine
    }

    listHtml(){
        let htmlList = super.listHtml()
        // use super record method without delete checkbox
        let newRecordLine = super.recordHtml(EditList.Key.new, {})
        newRecordLine += "<td>&nbsp</td>"
        htmlList.push("<tr>" + newRecordLine + "</tr>")
        return htmlList
    }

    processEvent(eventObj){
        if(super.processEvent(eventObj)){
            return true
        } else if(eventObj.type == EditList.Event.checkbox){
            if(this.dataBag[EditList.Key.checkbox].includes(eventObj.src)){
                this.dataBag[EditList.Key.checkbox] = this.dataBag[EditList.Key.checkbox].filter(function(value, index, arr){
                    if(value == eventObj.src){
                        return false
                    }
                    return true
                })
            }else{
                this.dataBag[EditList.Key.checkbox].push(eventObj.src)
            }
        } else if(eventObj.type == EditList.Event.deleted){
            let deleteList = this.dataBag[EditList.Key.checkbox]
            let newList = this.dataBag[TableList.Key.records].filter(function(value, index, arr){
                if(deleteList.includes(index.toString())){
                    return false
                }
                return true
            })
            this.dataBag[EditList.Key.checkbox].length = 0
            if(newList.length != this.dataBag[TableList.Key.records].length){
                this.dataBag[TableList.Key.records].length = 0
                this.dataBag[TableList.Key.records].push(...newList)            
                DataStore.GetStore().notify(this.id)
            }
        }
        return false
    }
}
export {TableList, EditList}
