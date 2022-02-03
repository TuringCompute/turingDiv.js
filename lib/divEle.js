import {UID} from "./uid.js"
import {Format} from "./format.js"
import {OrderedDict} from "./orderedDict.js"
import { EventSrc } from "./event.js"

class DivEle{
    static Events = Object.freeze({
        "loaded": "DivElementLoaded",
        "resized": "windowResized"
    })

    static Key = Object.freeze({
        "divId": "divId",
        "divIdx": "divIdx"
    })

    eventTriger(eventObj){
        //eventObj["eventSrcObj"]
        eventObj[EventSrc.Key.src] = this.id
        let lineStr = "getDivEle(\"" + this.id + "\").htmlEvent(this, event, " + JSON.stringify(eventObj) + ")"
        return lineStr
    }

    htmlEvent(ele, event, eventObj){
        if(event){
            eventObj[EventSrc.Key.rawEvent] = event
        }
        if(ele){
            eventObj[EventSrc.Key.srcEle] = ele
        }
        this.handleEvent(eventObj)
    }

    static getDivEle(eleId){
        if(!window.divElements || !window.divElements[eleId]){
            throw Error("element " + eleId + " does not exists")
        }
        return window.divElements[eleId]
    }

    constructor(props){
        this.id = UID.idx(DivEle.Key.divIdx)
        if(!window.divElements){
            window.divElements = {}
            window.getDivEle = DivEle.getDivEle
        }
        window.divElements[this.id] = this
        this.props = props
        if (!this.props){
            throw Error("parameter pros should not be null")
        }
        this.apply_props()
        this.parent = null
        // when you want to put the component at a location
        if (!this.parentId){
            let parentDiv = document.getElementById(props[DivEle.Key.divId])
            if(!parentDiv){
                throw Error("root node div [" + props[DivEle.Key.divId] + "] does not exists")
            }
            let div = document.createElement("div")
            div.setAttribute("id", this.id)
            parentDiv.appendChild(div)
            // only bind resized to root of the tree
            this.resized = this.resized.bind(this)
            window.addEventListener("resize", this.resized)
        }else{
            this.parent = DivEle.getDivEle(this.parentId)
            if(!parent){
                throw Error("parent " +this.parentId + " does not exists")
            }
            if(!this.childId){
                throw Error("need childId to register with parent " + this.parentId)
            }
            this.parent.setChild(this.childId, this)
        }
        this.handleEvent = this.handleEvent.bind(this)
        this.children = new OrderedDict(OrderedDict.emptyDict())
    }

    default_values(){
        return null
    }

    apply_props(){
        if(!this.appliedProperties){
            this.appliedProperties = []
        }
        for(let key of this.appliedProperties){
            if(!this.props.hasOwnProperty(key) && this.hasOwnProperty(key)){
                delete this[key]
            }
        }
        let defaultValues = this.default_values()
        if(defaultValues){
            Object.assign(this, defaultValues)   
        }
        this.appliedProperties = Object.keys(this.props)
        Object.assign(this, this.props)        
    }

    setChild(childId, childObj){
        if(!childObj || !(childObj instanceof DivEle)){
            throw Error("invalid child " + childId + ", need to be a DivEle")
        }
        let child = this.children.getValue(childId)
        if(child && child.node){
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
        for(let childId of this.children.list){
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
        if(!renderDiv){
            throw Error("div [" + this.id + "] dose not exists, please render root first")
        }else{
            let htmlList = this.outputHTML()
            let htmlStr = htmlList.join("\n")
            renderDiv.outerHTML = htmlStr
            let eventLoaded = EventSrc.new(DivEle.Events.loaded, this.id, {})
            this.propagateEvent(eventLoaded)
        }
    }

    resized(){
        let resizeEvent = EventSrc.new(DivEle.Events.resized, this.id, {})
        this.propagateEvent(resizeEvent)
    }


    // add mechanism to progagate event down the tree.
    // when it propagate from parent, processEvent will decide if current node want to render.
    // if decide to render, then propagate stopped here
    // render will propagate a loaded event down.
    propagateEvent(eventObj){
        let shouldRender = this.processEvent(eventObj)
        if(shouldRender){
            this.render()
        } else {
            for(let childId of this.children.list){
                let child = this.children.getValue(childId)
                if(child.node){
                    child.node.propagateEvent(eventObj)
                }
            }
        }        
    }

    outputHTML(){
        throw Error("please override outputHTML")
    }

    addDivEleFrame(htmlList){
        Format.applyIndent(htmlList)
        let styleStr = ""
        if(this.props.hasOwnProperty("zIdx")){
            styleStr = "z-index:" + this.props.zIdx + ";"
        }
        htmlList.splice(0,0, "<div id='" + this.id + "' style='width:100%; height:100%;" + styleStr + "'>")
        htmlList.push("</div>")
    }

    handleEvent(eventObj){
        // take in data first decide if I want to re-render myself
        let shouldRender =  this.processEvent(eventObj)
        // ask parent how they would process the vent, if they don't want to render
        let parentRender = false
        // if current process event to keep the event local, then do not propagate the event up
        if(this.parentId && !EventSrc.stopped(eventObj)){
            let parent = DivEle.getDivEle(this.parentId)
            if(parent && parent.handleEvent(eventObj)){
                parentRender = true
            }
        }
        // only call render when parent does not want to render and local decided to render
        if(shouldRender && !parentRender)
            this.render()
        else
            return false
        return true
    }

    processEvent(eventObj){
        return false
    }
}

export {DivEle}
