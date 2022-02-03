import {DivEle} from "../../lib/divEle.js"
import {MouseState} from "../../lib/mouse.js"
import {EventSrc} from "../../lib/event.js"
import {Format} from "../../lib/format.js"

class MenuReg extends DivEle{
    static Key = Object.freeze({
        "menuReg": "DivEleMenuReg"
    })

    static Events = Object.freeze({
        "show": "MenuRegShow",
        "hide": "MenuRegHide"
    })

    constructor(props){
        if (!MenuReg.instance){
            if(!props){
                props = {}
            }
            let menuDiv = document.getElementById(props[DivEle.Key.divId])
            if(!props[DivEle.Key.divId] || !menuDiv){
                MenuReg.initDiv()
                props[DivEle.Key.divId] = MenuReg.Key.MenuReg
            }
            super(props)
            this.showMenuId = null
            this.posStyle = ""
            this.menuMap = {}
            this.showMenuTopLeft = this.showMenuTopLeft.bind(this)
            window.showMenuTopLeft = this.showMenuTopLeft
            MenuReg.instance = this
        }
        return MenuReg.instance
    }

    static initDiv(){
        let menuDiv = document.getElementById(MenuReg.Key.MenuReg)
        if(!menuDiv){
            menuDiv = document.createElement("div")
            menuDiv.id = MenuReg.Key.MenuReg
            document.body.appendChild(menuDiv)
        }
    }

    // Please make sure create MenuReg Object at root level so it can successfully initiate
    // usually initiallized in main.js
    static GetMenu(){
        let menu = new MenuReg()
        return menu
    }

    registerMenu(menu){
        if(!menu.menuId){
            throw Error("invalid object, missing attribute menuId")
        }
        this.menuMap[menu.menuId] = menu
    }

    showMenuTopLeft(top, left, menuId){
        if(!menuId || !this.menuMap.hasOwnProperty(menuId)){
            throw Error("invalid menuId [" + menuId + "]")
        }
        let posStyle = "top: " + top + "px; left: " + left + "px;"
        if(!this.showMenuId || this.showMenuId != menuId || this.posStyle != posStyle){
            this.showMenuId = menuId
            this.posStyle = posStyle
        }
        this.handleEvent(EventSrc.new(MenuReg.Events.show, null, null))
    }

    hide(){
        if(this.showMenuId){
            this.handleEvent(EventSrc.new(MenuReg.Events.hide, null, null))
        }
    }

    _hideMenu(){
        if(this.showMenuId){
            this.showMenuId = null
            this.posStyle = ""
        }
    }

    outputHTML(){
        let htmlList = []
        if(this.showMenuId && this.menuMap.hasOwnProperty(this.showMenuId)){
            let menuObj = this.menuMap[this.showMenuId]
            let menuHtml = menuObj.outputHTML()
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
        } else if(eventObj.type == MenuReg.Events.hide || eventObj.type == MouseState.mouseUp){
            let event = eventObj[EventSrc.Key.rawEvent]
            if (this.clickIn(event)){
                return false
            }
            this._hideMenu()
            mouse.deregister()
            return true
        }
        return false
    }
}

class MenuTemplate extends DivEle{
    getMenuId(){
        throw Error("please implement getMenuId function")
    }

    constructor(props){
        super(props)
        if(!this.parent){
            throw Error("Menu should have a parent.")
        }
        this.menuId = this.getMenuId()
        let menu = MenuReg.GetMenu()
        menu.registerMenu(this)
    }

    idInput(attribute, value){
        return this.id + "_" + attribute + "_" + value
    }

    processEvent(eventObj){
        if(eventObj.type == DivEle.Events.resized){
            let menu = MenuReg.GetMenu()
            menu.hide()            
        }
    }
}

export {MenuReg, MenuTemplate}