import {DataStore} from "../../lib/dataStore.js"
import {FormEditor} from "../../component/formEditor/formEditor.js"
import {TableList} from "../../component/tableList/tableList.js"

window.main = function main(){
    window.store = new DataStore()
    window.attrList = store.newData("tableList", DataStore.subscriber("main", dataChange))
    window.attrList.data = [
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
    let attrEditor = new FormEditor({
        "divId": "attributeEditor",
        "dataStore": window.store, 
        "schema": fieldSchema
    })
    attrEditor.render()
    let tList = new TableList({
        "divId": "attributeList",
        "dataStore": window.store, 
        "fieldSchema": fieldSchema,
        "displayOrder": [["attrName", "Attribute"], ["type", "Data Type"], ["required", "Required"]],
        "selectDataId": attrEditor.id
    })
    window.attrList = tList
    tList.render()
}

function dataChange(event){
    console.log("list data changes")
}

window.setData = function setData(){
    window.attrList.bindData("tableList")
}
