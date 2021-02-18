import {UID} from "./uid.js"
import {Style} from "./format.js"
import {OrderedDict} from "./orderedDict.js"

class DivEle{
    static divIdx = "divIdx"

    eventTriger(eventObj){
        let lineStr = "getDivEle(\"" + this.id + "\").handleEvent(this, event, " + JSON.stringify(eventObj) + ")"
        return lineStr
    }

    static getDivEle(eleId){
        if(!window.divElements || !window.divElements[eleId]){
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
        this.childId = this.props.childId
        // when you want to put the component at a location
        if (!this.parentId){
            let parentDiv = document.getElementById(props.divId)
            if(!parentDiv){
                throw Error("root node div [" + props.divId + "] does not exists")
            }
            this.div = document.createElement("div")
            this.div.setAttribute("id", this.id)
            parentDiv.appendChild(this.div)
        }else{
            let parent = DivEle.getDivEle(this.parentId)
            if(!parent){
                throw Error("parent " +this.parentId + " does not exists")
            }
            if(!this.childId){
                throw Error("need childId to register with parent " + this.parentId)
            }
            this.parent.setChild(this.childId, this)
        }
        this.handleEvent = this.handleEvent.bind(this)
        this.children = OrderedDict.emptyDict()
    }

    setChild(childId, childObj){
        if(!childObj || !(childObj instanceof DivEle)){
            throw Error("invalid child " + childId + ", need to be a DivEle")
        }
        let child = this.children.getValue(childId)
        if(!child && child.node){
            child.node.destroy()
        }
        this.children.setValue(childId, {
            "node": childObj
        })
    }

    markChildDeleted(childId){
        let child = this.children.getValue(childId)
        if(child && child.node){
            delete this.children[childId].node
        }
    }

    destroy(){
        if(!window.divElements || !window.divElements.hasOwnProperty(this.id)){
            return
        }
        for(let childId of this.children.attrOrder){
            let child = this.children.getValue(childId)
            if(child.node){
                child.node.destroy()
            }
        }
        if(this.parentId){
            let parent = DivEle.getDivEle(this.parentId)
            if(parent){
                parent.markChildDeleted(this.childId)
            }
        }
        delete window.divElements[this.id]
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
        Format.applyIndent(htmlList)
        if(this.props.hasOwnProperty("zIdx")){
            htmlList.splice(0,0, "<div id='" + this.id + " style='z-index:" + this.props.zIdx + ";'>")
        } else {
            htmlList.splice(0,0, "<div id='" + this.id + "'>")
        }
        
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
