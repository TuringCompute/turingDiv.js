import {TableList} from "../../component/tableList/tableList.js"
import {DataStore} from "../../lib/dataStore.js"
import {DataType} from "../../lib/dataType.js"

window.main = function main(){
    let store = new DataStore()
    let dataId = "testData"
    window.dataBag = store.newData(dataId, DataStore.subscriber(dataId, dataChanged))
    window.dataBag.data = [
        {"attrName": "quantity", "type": "integer", "required": false}
    ]
    let selectDataId = "testSel01"
    window.selection = store.newData(selectDataId, DataStore.subscriber(selectDataId, selectionChanged))
    let tblLst = new TableList(
        {
            "divId": "tableListTest01",
            "dataStore": store,
            "displayOrder": [["attrName", "Attribute"], ["type", "Data Type"], ["required", "Required"]],
            "fieldSchema": {
                "attrName":{"type": DataType.string},
                "type": {"type": DataType.string},
                "required": {"type": DataType.bool}
            },
            "selectDataId": selectDataId
        }
    )
    tblLst.bindData(dataId)
    tblLst.render()
}

function selectionChanged(event){
    console.log("selection changed")
    console.log(window.selection)
}

function dataChanged(event){
    console.log("data changed")
    console.log(window.dataBag)
}
