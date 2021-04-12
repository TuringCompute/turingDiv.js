import {TableList} from "../../component/tableList/tableList.js"
import {DataType} from "../../lib/dataType.js"

window.main = function main(){
    let data = [
        {"attrName": "quantity", "type": "integer", "required": false},
        {"attrName": "testName", "type": "String", "required": true}
    ]
    let tblLst = new TableList(
        {
            "divId": "tableListTest01",
            "displayOrder": [["attrName", "Attribute"], ["type", "Data Type"], ["required", "Required"]],
            "fieldSchema": {
                "attrName":{"type": DataType.string},
                "type": {"type": DataType.string},
                "required": {"type": DataType.bool}
            }
        }
    )
    tblLst.bindData(data)    
    tblLst.render()    
}
