import {DivEle} from "../../lib/divEle.js"
import {MouseState} from "../../lib/mouse.js"
import {EventSrc} from "../../lib/event.js"
import {Format} from "../../lib/format.js"

class MenuReg extends DivEle{
    static Events = {
        "show": "MenuRegShow",
        "hide": "MenuRegHide"
    }
    constructor(props){
        if (!MenuReg.instance){
            super(props)
            MenuReg.instance = this
            this.showMenuId = null
            this.posStyle = ""
            this.showMenuTopLeft = this.showMenuTopLeft.bind(this)
            window.showMenuTopLeft = this.showMenuTopLeft
        }
        return MenuReg.instance
    }

    static GetMenu(){
        if(!MenuReg.instance){
            throw Error("please instantiate MenuReg with a div-id")
        }
        return MenuReg.instance
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
        this.handleEvent(EventSrc.new(MenuReg.Events.show, null, null))
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
        if(this.props.hasOwnProperty("zIdx")){
            htmlList.splice(0,0, "<div id='" + this.id + " style='z-index:" + this.props.zIdx + ";position: absolute;" + this.posStyle + "'>")
        } else {
            htmlList.splice(0,0, "<div id='" + this.id + "' style='position: absolute;" + this.posStyle + "'>")
        }
        htmlList.push("</div>")
    }

    clickIn(event){
        if(!event){
            return false
        }
        let div = document.getElementById(this.id)
        if(event.clientX < div.offsetLeft || event.clientX > (div.offsetLeft + div.offsetWidth)){
            return false
        }
        if(event.clientY < div.offsetTop || event.clientY > (div.offsetTop + div.offsetHeight)){
            return false
        }
        return true
    }

    processEvent(eventObj){
        let mouse = new MouseState()
        if(eventObj.type == MenuReg.Events.show){
            mouse.registerTarget(this)
            return true
        } else if(eventObj.type == MouseState.mouseUp){
            let event = eventObj[EventSrc.Key.rawEvent]
            if (this.clickIn(event)){
                return false
            }
            this.hideMenu()
            mouse.deregister()
            return true
        }
        return false
    }
}

export {MenuReg}