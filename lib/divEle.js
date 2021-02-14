import {UID} from "./uid.js"
import { Style } from "./style.js"

class DivEle{
    static divIdx = "divIdx"

    eventTriger(eventObj){
        let lineStr = "getDivEle(\"" + this.id + "\").handleEvent(this, event, " + JSON.stringify(eventObj) + ")"
        return lineStr
    }

    static getDivEle(eleId){
        if(!window.divElements[eleId]){
            throw Error("element " + eleId + " does not exists")
        }
        return window.divElements[eleId]
    }

    constructor(props){
        this.id = UID.idx(DivEle.divIdx)
        if(!window.divElements){
            window.divElements = {}
            window.getDivEle = DivEle.getDivEle
        }
        window.divElements[this.id] = this
        this.props = props
        if (!this.props){
            throw Error("parameter pros should not be null")
        }
        this.parentId = this.props.parentId
        // when you want to put the component at a location
        if (!this.parentId){
            let parentDiv = document.getElementById(props.divId)
            if(!parentDiv){
                throw Error("root node div [" + props.divId + "] does not exists")
            }
            this.div = document.createElement("div")
            this.div.setAttribute("id", this.id)
            parentDiv.appendChild(this.div)
        }        
        this.handleEvent = this.handleEvent.bind(this)
    }

    render(){
        let renderDiv = document.getElementById(this.id)
        if(renderDiv){
            let htmlList = this.outputHTML()
            let htmlStr = htmlList.join("\n")
            renderDiv.outerHTML = htmlStr
        }        
    }

    outputHTML(){
        throw Error("please override outputHTML")
    }

    addDivEleFrame(htmlList){
        Style.applyIndent(htmlList)
        htmlList.splice(0,0, "<div id='" + this.id + "'>")
        htmlList.push("</div>")
    }

    handleEvent(src, event, eventObj){
        // take in data first decide if I want to re-render myself
        let shouldRender =  this.processEvent(src, event, eventObj)
        // ask parent how they would process the vent, if they don't want to render
        if(!this.parent || !this.parent.handleEvent(src, event, eventObj)){
            // if this node need to render, then render it and return True
            if(shouldRender){
                this.render()
            } else {
                // nobody want to re-render, then pass it to next
                return false
            }
        }
        return true
    }

    processEvent(src, event, eventObject){
        throw Error("processEvent not implemented yet")
    }
}

export {DivEle}
