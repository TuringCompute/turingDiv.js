import {DataStore} from "../../lib/dataStore.js"
import {DataType} from "../../lib/dataType.js"
import {DivEle} from "../../lib/divEle.js"
import {EventSrc} from "../../lib/event.js"
import {OrderedDict} from "../../lib/orderedDict.js"
import {Format} from "../../lib/format.js"


class FormEditor extends DivEle{
    static Event = Object.freeze({
        "inputChanged": "formEditorInputChanged",
        "saveData": "formEditorSaveData"
    })

    static Key = Object.freeze({
        "dataId": "editingDataId",
        "data": "editingData"
    })

    constructor(props){
        super(props)
        if(!props.schema){
            throw Error("missing schema in props to build")
        }
        this.dataBag = DataStore.GetStore().newData(this.id, DataStore.subscriber(this.id, this.handleEvent))
        this.schema = new OrderedDict(this.props.schema)
        this.template = this.props.template
    }

    static bindData(dataBag, dataId, data){
        dataBag[FormEditor.Key.dataId] = dataId
        dataBag[FormEditor.Key.data] = data
    }

    outputHTML(){
        let htmlList = ["<table>"]
        if(!this.tempalte){
            // no display template, so use the default attribute edit table
            let data = this.dataBag[FormEditor.Key.data]
            for(let idx in this.schema.list){
                let attr = this.schema.list[idx]
                let attrDef = this.schema.getValue(attr)
                let inputType = "text"
                if(attrDef.type == DataType.bool){
                    inputType = "checkbox"
                }
                let changeEvent = EventSrc.new(FormEditor.Event.inputChanged, attr, {})
                changeEvent[EventSrc.srcEle]
                let attrVal = null
                if(data && data[attr]){
                    attrVal = data[attr]
                }
                let inputVal = DataType.htmlValue(attrDef.type, attrVal)
                let inputStr = "<input name='" + attr + "' type='" + inputType + "' " + inputVal + 
                                    " onChange='" + this.eventTriger(changeEvent) + "' />"
                htmlList.push("  <tr><td>" + attr + "</td><td>" + inputStr + "</td></tr>")
            }
            let saveDisabled = "disabled"
            if(this.dataBag[FormEditor.Key.dataId]){
                saveDisabled = ""
            }
            let saveEvent = EventSrc.new(FormEditor.Event.saveData, null, {})
            htmlList.push("<tr><td align=center><button type='button' onClick='" + this.eventTriger(saveEvent) + "' " + saveDisabled + ">Save</button></td></tr>")
            htmlList.push("</table>")
            Format.applyIndent(htmlList)
            this.addDivEleFrame(htmlList)
        }else{
            throw Error("no code for display according to template yet")
        }
        return htmlList
    }

    // form editor should never redraw itself.
    // if parent change my context, either parent should redraw itself or parent know to kick off my redraw
    processEvent(eventObj){
        if(eventObj.type == FormEditor.Event.inputChanged){
            let data = this.dataBag[FormEditor.Key.data]
            if(!data){
                return false
            }
            let attr = eventObj.src
            if (!this.schema.data.hasOwnProperty(attr)){
                return false
            }
            let attrDef = this.schema.data[attr]
            if (!attrDef){
                console.log("invalid event. attr=" + attr + " does not exists in schema")
            }
            let htmlEle = eventObj[EventSrc.Key.srcEle];
            if(!htmlEle){
                console.log("irregular, do nothing, input change without field [" + EventSrc.Key.srcEle + "]")
                return false
            }
            let attrValue = htmlEle.value
            if(eventObj.data.hasOwnProperty("attrValue")){
                attrValue = eventObj.data.attrValue
            } else {
                if(htmlEle.type == "checkbox"){
                    attrValue = htmlEle.checked
                } else {
                    attrValue = DataType.htmlToValue(attrDef.type, attrValue)
                }
            }            
            if(!data.hasOwnProperty(attr) || data[attr] != attrValue){
                data[attr] = attrValue
            }
        } else if(eventObj.type == FormEditor.Event.saveData){
            DataStore.GetStore().notify(this.id, this.id)
        } else if(eventObj.type == DataStore.dataChanged && eventObj.data[EventSrc.Key.src] != this.id){
            return true
        }
        return false
    }
}

export {FormEditor}