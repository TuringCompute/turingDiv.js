import {DivEle} from "../../lib/divEle.js"
import {MouseState} from "../../lib/mouse.js"
import {Event} from "../../lib/event.js"
import {Format} from "../../lib/format.js"

class PopMenu extends DivEle{
    static Events = {
        "show": "popMenuShow",
        "hide": "popMenuHide"
    }
    constructor(props){
        if (!PopMenu.instance){
            super(props)
            PopMenu.instance = this
            this.showMenuId = null
            this.posStyle = ""
            this.showMenuTopLeft = this.showMenuTopLeft.bind(this)
            window.showMenuTopLeft = this.showMenuTopLeft
        }
        return PopMenu.instance
    }

    showMenuTopLeft(top, left, menuId){
        if(!menuId || !this.children.getValue(menuId)){
            throw Error("invalid menuId [" + menuId + "]")
        }
        let posStyle = "top: " + top + "px; left: " + left + "px;"
        if(!this.showMenuId || this.showMenuId != menuId || this.posStyle != posStyle){
            this.showMenuId = menuId
            this.posStyle = posStyle
        }
        this.handleEvent(null, null, Event.new(PopMenu.Events.show, null, null))
    }

    hideMenu(){
        if(this.showMenuId){
            this.showMenuId = null
            this.posStyle = ""
        }
    }

    outputHTML(){
        let htmlList = []
        if(this.showMenuId){
            let menuObj = this.children.getValue(this.showMenuId)
            let menuHtml = menuObj.node.outputHTML()
            Format.applyIndent(menuHtml)
            htmlList.push(...menuHtml)
        }
        this.addDivEleFrame(htmlList)
        return htmlList
    }

    addDivEleFrame(htmlList){
        Format.applyIndent(htmlList)
        let posStyle = this.posStyle
        if(this.props.hasOwnProperty("zIdx")){
            htmlList.splice(0,0, "<div id='" + this.id + " style='z-index:" + this.props.zIdx + ";" + posStyle + "'>")
        } else {
            if(posStyle !== ""){
                posStyle = "style='" + posStyle + "'"
            }
            htmlList.splice(0,0, "<div id='" + this.id + "' " + posStyle + ">")
        }
        htmlList.push("</div>")
    }
    
    processEvent(src, event, eventObj){
        let mouse = MouseState.GetMouse()
        if(eventObj.type == PopMenu.Events.show){
            mouse.registerTarget(this)
            return true
        } else if(eventObj.type == MouseState.mouseUp){
            this.hideMenu()
            mouse.deregister()
            return true
        }
        return false
    }
}

export {PopMenu}