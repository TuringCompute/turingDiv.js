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
        if(!document.body){
            throw Error("failed to load MouseState since there is no document.body, please call this class after document load")
        }
        if(!MouseState.instance){
            this.onMouseMove = this.onMouseMove.bind(this)
            this.onMouseLeave = this.onMouseLeave.bind(this)
            this.onMouseUp = this.onMouseUp.bind(this)
            document.body.onmousemove = this.onMouseMove
            document.body.onmouseleave = this.onMouseLeave
            document.body.onmouseup = this.onMouseUp
            MouseState.instance = this
        }
        return MouseState.instance
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

