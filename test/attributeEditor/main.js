import {DataStore} from "../../lib/dataStore.js"
import {FormEditor} from "../../component/formEditor/formEditor.js"
import {EditList, TableList} from "../../component/tableList/tableList.js"
import { EventSrc } from "../../lib/event.js"

class DataCtrl{
    constructor(props){
        this.listDataId = props.listDataId
        this.editorDataId = props.editorDataId
        this.id = "dataCtrl"
        if(!this.listDataId){
            throw Error("missing listDataId in parameter for DataCtrl")
        }
        if(!this.editorDataId){
            throw Error("missing editorDataId in parameter for DataCtrl")
        }
        this.handleEvent = this.handleEvent.bind(this)
        let store = DataStore.GetStore()
        this.listData = store.getData(this.listDataId, DataStore.subscriber(this.id, this.handleEvent))
        this.editorData = store.getData(this.editorDataId, DataStore.subscriber(this.id, this.handleEvent))
    }

    handleEvent(eventObj){
        // currently, only handle data change event
        if(eventObj.type != DataStore.dataChanged){
            return
        }
        if(eventObj.data[EventSrc.Key.src] == this.id){
            return
        }
        let currentId = this.editorData[FormEditor.Key.dataId]
        if(eventObj.src == this.listDataId){
            let editDataId = this.listData[TableList.Key.selectedId]
            if(editDataId != currentId){
                let editData = {}
                if(editDataId == EditList.Key.new){
                    editData = this.listData[EditList.Key.newRecord]
                } else if (this.listData[TableList.Key.records][editDataId]) {
                    editData = this.listData[TableList.Key.records][editDataId]
                } else {
                    editDataId = null
                    editData = {}
                }
                FormEditor.bindData(this.editorData, editDataId, editData)
                DataStore.GetStore().notify(this.editorDataId, this.id)
            }
        } else if(eventObj.src = this.editorDataId){
            if(currentId == EditList.Key.new){
                let newRecord = this.listData[EditList.Key.newRecord]
                this.listData[EditList.Key.newRecord] = {}
                this.listData[TableList.Key.records].push(newRecord)
                this.listData[TableList.Key.selectedId] = (this.listData[TableList.Key.records].length - 1).toString()
                DataStore.GetStore().notify(this.listDataId, this.id)
            } else if(this.listData[TableList.Key.records][currentId]){
                DataStore.GetStore().notify(this.listDataId, this.id )
            }
        }
    }

}


window.main = function main(){
    let data = [
        {
            "attrName": "quantity",
            "type": "integer",
            "required": false
        }
    ]
    let fieldSchema = {
        "$$order": ["attrName", "type", "required", "other"],
        "attrName": {
            "type": "string"
        },
        "type": {
            "type": "string"
        },
        "required": {
            "type": "bool"
        },
        "other": {
            "type": "string"
        }
    }
    let tList = new EditList({
        "divId": "attributeList",
        "fieldSchema": fieldSchema,
        "displayOrder": [["attrName", "Attribute"], ["type", "Data Type"], ["required", "Required"]]
    })
    tList.bindData(data)
    tList.render()
    let attrEditor = new FormEditor({
        "divId": "attributeEditor",
        "schema": fieldSchema
    })
    attrEditor.render()
    new DataCtrl({
        "listDataId": tList.id,
        "editorDataId": attrEditor.id
    })
}
