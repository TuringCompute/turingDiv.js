import {DataStore} from "../../lib/dataStore.js"
import {DataType} from "../../lib/dataType.js"
import {DivEle} from "../../lib/divEle.js"
import {Event} from "../../lib/event.js"
import {OrderedDict} from "../../lib/orderedDict.js"
import {Style} from "../../lib/style.js"


class FormEditor extends DivEle{
    static inputChanged = "formEditorInputChanged"

    constructor(props){
        super(props)
        if(!props.schema){
            throw Error("missing schema in props to build")
        }
        this.dataStore = props.dataStore
        this.dataBag = this.dataStore.newData(this.id, DataStore.subscriber(this.id, this.handleEvent))
        this.dataBag["data"] = {}
        this.bindData()
        this.schema = new OrderedDict(this.props.schema)
        this.template = this.props.template
    }

    bindData(){
        this.data = this.dataBag.data
    }

    outputHTML(){
        let htmlList = []
        if(!this.tempalte){
            // no display template, so use the default attribute edit table
            for(let idx in this.schema.attrOrder){
                let attr = this.schema.attrOrder[idx]
                let attrDef = this.schema.data[attr]
                let inputType = "text"
                if(attrDef.type == DataType.bool){
                    inputType = "checkbox"
                }
                let changeEvent = Event.new(FormEditor.inputChanged, attr, {})
                let attrVal = null
                if(this.data && this.data[attr]){
                    attrVal = this.data[attr]
                }
                let inputVal = DataType.htmlValue(attrDef.type, attrVal)
                let inputStr = "<input name='" + attr + "' type='" + inputType + "' " + inputVal + 
                                    " onChange='" + this.eventTriger(changeEvent) + "' />"
                htmlList.push("<tr><td>" + attr + "</td><td>" + inputStr + "</td></tr>")
            }
            if(htmlList.length > 0){
                Style.applyIndent(htmlList)
                htmlList.splice(0, 0 , "<table>")
                htmlList.push("</table>")
            }
            Style.applyIndent(htmlList)
            this.addDivEleFrame(htmlList)
        }else{
            throw Error("no code for display according to template yet")
        }
        return htmlList
    }

    processEvent(src, event, eventObj){
        if(eventObj.type == FormEditor.inputChanged){
            let attr = eventObj.src
            if (!this.schema.data.hasOwnProperty(attr)){
                return false
            }
            let attrDef = this.schema.data[attr]
            if (!attrDef){
                console.log("invalid event. attr=" + attr + " does not exists in schema")
            }
            let attrValue = src.value
            if(eventObj.data.hasOwnProperty("attrValue")){
                attrValue = eventObj.data.attrValue
            } else {
                if(src.type == "checkbox"){
                    attrValue = src.checked
                } else {
                    attrValue = DataType.htmlToValue(attrDef.type, attrValue)
                }
            }            
            if(!this.data[attr] || this.data[attr] != attrValue){
                this.data[attr] = attrValue
                if(this.dataBag.dataId){
                    this.dataStore.notify(this.dataBag.dataId)
                }
            }
        } else if(eventObj.type == DataStore.dataChanged && eventObj.src == this.id){
            this.bindData()
            this.render()
            return true
        }
        return false
    }
}

export {FormEditor}