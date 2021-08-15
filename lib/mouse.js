import {EventSrc} from "./event.js"

class MouseState{
    static mouse = "mouse"
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

    fireEvent(eventType, e){
        if(this.target){
            let eventObj = EventSrc.new(eventType, null, {})
            eventObj[EventSrc.Key.rawEvent] = e
            eventObj[EventSrc.Key.src] = MouseState.mouse
            this.target.handleEvent(eventObj)
        }
    }

    onMouseMove(e){
        this.fireEvent(MouseState.mouseMoved, e)
    }

    onMouseLeave(e){
        this.fireEvent(MouseState.mouseLeave, e)
    }

    onMouseOut(e){
        this.fireEvent(MouseState.mouseOut, e)
    }

    onMouseUp(e){
        this.fireEvent(MouseState.mouseUp, e)
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
}

export {MouseState}

