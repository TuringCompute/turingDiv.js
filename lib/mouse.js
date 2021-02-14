import {Event} from "./event.js"

class MouseState{
    static mouseDown = "mouseStateDown"
    static mouseLeave = "mouseStateLeave"
    static mouseMoved = "mouseStateMoved"
    static mouseOut = "mouseStateMoveOut"
    static mouseUp = "mouseStateUp"
    static bodyCanvas = "bodyCanvas"

    changeCursor(ele, pointer){
        ele.style.cursor = pointer
    }

    static changeCursorStr(pointer){
        let cStr = " onmouseover='mouse.changeCursor(this, \"" + pointer + "\");'"
        cStr = cStr + " onmouseleave='mouse.changeCursor(this, \"auto\");''"
        return cStr
    }

    constructor(){
        if(!MouseState.instance){
            MouseState.instance = this
        }
        return MouseState.instance
    }

    static start(){
        if(!document.body){
            throw Error("failed to load MouseState since there is no document.body")
        }
        if(!window.mouse){
            window.mouse = new MouseState()            
        }
    }

    onMouseMove(e){
        if(this.target){
            this.target.handleEvent(null, e, Event.new(MouseState.mouseMoved, null, {}))
        }
    }

    onMouseLeave(e){
        if(this.target){
            this.target.handleEvent(null, e, Event.new(MouseState.mouseLeave, null, {}))
        }        
    }

    onMouseOut(e){
        if(this.target){
            this.target.handleEvent(null, e, Event.new(MouseState.mouseOut, null, {}))
        }
    }

    onMouseUp(e){
        if(this.target){
            this.target.handleEvent(null, e, Event.new(MouseState.mouseUp, null, {}))
        }
    }

    registerTarget(target){
        if(!target || !target.handleEvent || !(typeof target.handleEvent == "function")){
            throw Error("invalid target. misisng handleEvent function")
        }
        this.target = target
    }

    deregister(){
        if(this.target){
            delete this.target
        }
    }

    mouseEvent(src, event, eventObj){
        if(this.target){
            this.target.handleEvent(src, event, eventObj)
        }        
    }
}

export {MouseState}

