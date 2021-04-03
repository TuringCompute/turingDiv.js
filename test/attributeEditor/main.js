import {DataStore} from "../../lib/dataStore.js"
import {FormEditor} from "../../component/formEditor/formEditor.js"
import {TableList} from "../../component/tableList/tableList.js"

function dataChanged(eventObj){
    console.log("data changed")
}

window.main = function main(){
    window.store = new DataStore()
    window.attrList = store.newData("tableList", DataStore.subscriber("main", dataChanged))
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
        "schema": fieldSchema
    })
    attrEditor.render()
    let tList = new TableList({
        "divId": "attributeList",
        "fieldSchema": fieldSchema,
        "displayOrder": [["attrName", "Attribute"], ["type", "Data Type"], ["required", "Required"]],
        "selectDataId": attrEditor.id
    })
    window.attrList = tList
    tList.render()
}

window.setData = function setData(){
    window.attrList.bindData("tableList")
}
