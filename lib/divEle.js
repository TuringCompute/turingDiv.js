import {UID} from "./uid.js"
import {EventHandler} from "./event.js"
import { Style } from "./style.js"

class DivEle{
    static divIdx = "divIdx"

    eventTriger(eventObj){
        let lineStr = "getDivEle(\"" + this.id + "\").handleEvent(" + JSON.stringify(eventObj) + ")"
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
            this.div = document.getElementById(props.divId)
            if(!this.div){
                throw Error("root node has to bind to existing div.")
            }
        }        
        this.handleEvent = this.handleEvent.bind(this)
    }

    render(){
        let renderDiv = this.div
        if(!renderDiv){
            // if the div already created itself
            renderDiv = document.getElementById(this.id)
            if(!renderDiv){
                let parent = getDivEle(this.parentId)
                parent.render()
                return
            }
        }
        let htmlList = this.outputHTML()
        if(this.parentId){
            // only non-root element can control it's location and appearence
            // root element can only change its own content, so, it should only be used to define boundaries
            this.addDivEleFrame(htmlList)
        }
        let htmlStr = htmlList.join("\n")
        if(this.parentId){
            renderDiv.outerHTML = htmlStr
        } else {
            renderDiv.innerHTML = htmlStr
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

    handleEvent(event){
        // take in data first decide if I want to re-render myself
        let shouldRender =  this.processEvent(event)
        // ask parent how they would process the vent, if they don't want to render
        if(!this.parent || !this.parent.handleEvent(event)){
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

    processEvent(event){
        throw Error("processEvent not implemented yet")
    }
}

export {DivEle}
