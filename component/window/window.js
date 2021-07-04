import {DivEle} from "../../lib/divEle.js"
import {Format} from "../../lib/format.js"
import {OrderedDict} from "../../lib/orderedDict.js"
import {EventSrc} from "../../lib/event.js"
import {MouseState} from "../../lib/mouse.js"

class WinEle extends DivEle{
    static defaultValue = Object.freeze({
        "left": 0,
        "top": 0,
        "height": "100%",
        "width": "100%",
        "title": "&nbsp",
        "titleHeight": 30,
        "closed": false,
        "minDisplay": false,
        "maxDisplay": false,
        "enableMove": true,
        "enableTitle": true,
        "enableCloseButton": true,
        "enableResize": true,
        "enableResizeRight": false,
        "enableResizeLeft": false,
        "enableResizeBottom": false
    })

    constructor(props){
        super(props)
        let childrenData = OrderedDict.emptyDict()
        if (props.children){
            childrenData = props.children
        }
    }

    default_values(){
        return WinEle.defaultValue
    }

    static Action = Object.freeze({
        "btnClose": "winEleButtonClose",
        "move": "winEleMove",
        "resizeLeft": "resizeLeft",
        "resizeRight": "resizeRight",
        "resizeBottom": "resizeBottom"
    })

    static Event = Object.freeze({
        "closed": "winEleClosed",
        "resized": "winEleResized",
        "moved": "winEleMoved"
    })

    mouseEvent(action){
        let mseEventStr = " onMouseDown='" + this.eventTriger(EventSrc.new(MouseState.mouseDown, null, {"action": action})) + "' "
        return mseEventStr
    }

    innerWidth(){
        return this.width=="100%"? this.width: this.width + "px"
    }

    innerHeight(){
        return this.height=="100%"? this.height: (this.height - this.titleHeight) + "px"
    }

    titleHtml(){
        let htmlList = []
        let moveEventStr = this.enableMove? this.mouseEvent([WinEle.Action.move]): ""
        htmlList.push("<div style='position:relative;color:#ffffff; background-color:#2a9df4;" + 
        "left:0px;top:0px;height:" + this.titleHeight + "px;width:" + this.innerWidth() + "px;'"+
        " " + moveEventStr + ">")
        htmlList.push(" <table style='width:100%; height:100%;'>")
        htmlList.push("     <tr>")
        htmlList.push("         <td width=100%>" + this.title + "</td>")
        if (this.enableCloseButton){
            htmlList.push("         <td><button type='button' class='btn-close' onClick='" + this.eventTriger(EventSrc.new(WinEle.Action.btnClose, null, {})) + "'>X</button></td>")
        }
        htmlList.push("     </tr>")
        htmlList.push(" </table>")
        htmlList.push("</div>")
        return htmlList
    }

    outputHTML(){
        let htmlList = []
        if(this.closed){
            return htmlList
        }
        if (this.enableTitle){
            let titleBar = this.titleHtml()
            htmlList.push(...titleBar)
        }        
        this.addBoarder(htmlList)
        htmlList.push("<div class='crop' style='left:0px;top:" + this.titleHeight + "px;height=" + this.innerHeight() + ";width:" + this.innerWidth() + ";'>")
        let childrenIdx = this.children.listIdx()
        for(let childId of childrenIdx){
            let cNode = this.children.data[childId].node
            let childHtml = cNode.outputHTML()
            htmlList.push(...childHtml)
        }
        htmlList.push("</div>")
        Format.applyIndent(htmlList)
        this.addDivEleFrame(htmlList)
        return htmlList
    }

    addBoarder(htmlList){
        let leftBoarder = ""
        let leftBoarderCur = ""
        let leftBottomDot = ""
        let leftBottomCur = ""
        let rightBoarder = ""
        let rightBoarderCur = ""
        let rightBottomDot = ""
        let rightBottomCur = ""
        let bottomBoarder = ""
        let bottomCur = ""
        
        if(this.enableResize || this.enableResizeLeft){
            leftBoarder = this.mouseEvent([WinEle.Action.resizeLeft])
            leftBoarderCur = "cursor: w-resize;"
        }
        if(this.enableResize || this.enableResizeRight){
            rightBoarder = this.mouseEvent([WinEle.Action.resizeRight])
            rightBoarderCur = "cursor: e-resize;"
        }            
        if(this.enableResize || this.enableResizeBottom){
            bottomBoarder = this.mouseEvent([WinEle.Action.resizeBottom])
            bottomCur = "cursor: s-resize;"
            if(this.enableResize || this.enableResizeRight){
                rightBottomDot = this.mouseEvent([WinEle.Action.resizeRight, WinEle.Action.resizeBottom])
                rightBottomCur = "cursor: se-resize;"
            }
            if(this.enableResize|| this.enableResizeLeft){
                leftBottomDot = this.mouseEvent([WinEle.Action.resizeLeft, WinEle.Action.resizeBottom])
                leftBottomCur = "cursor: sw-resize;"
            }
        }
            
        let brHtml = [
            "<div " + leftBoarder + " style='position:absolute;top:0;left:0;bottom:0;border-left: 2px solid #2a9df4;" + leftBoarderCur + "'></div>",
            "<div " + leftBottomDot + " style='position:absolute;width:6px;height:6px;border-radius: 2px;border: 1px solid #808080; background: #FFF;opacity: 0; bottom: -3px;left: -3px;" + leftBottomCur + "'></div>",
            "<div " + rightBoarder + " style='position:absolute;top:0;right:0;bottom:0;border-right: 2px solid #2a9df4;" + rightBoarderCur + "'></div>",
            "<div " + rightBottomDot + " style='position:absolute;width:6px;height:6px;border-radius: 2px;border: 1px solid #808080; background: #FFF;opacity: 0; bottom: -3px;right: -3px;" + rightBottomCur + "'></div>",
            "<div " + bottomBoarder + " style='position:absolute;left:0;right:0;bottom:0;border-bottom: 2px solid #2a9df4;" + bottomCur + "'></div>"
        ]        
        htmlList.push(...brHtml)
    }

    addDivEleFrame(htmlList){
        Format.applyIndent(htmlList)
        let zIdx = ""
        if (this.props.hasOwnProperty("zIdx")){
            zIdx = "z-index:" + this.props.zIdx + ";"
        }
        let frameHeight = this.height == "100%"? this.height: this.height + "px"
        let frameWidth = this.width == "100%"? this.width: this.width + "px"
        htmlList.splice(0,0, "<div id='" + this.id + "' style='position:relative;left:" + this.left + "px;top:" + this.top + "px;" + 
                            "width:" + frameWidth + ";height:" + frameHeight+ ";" + zIdx + "'>")
        htmlList.push("</div>")
    }

    processEvent(eventObj){
        let mouse = new MouseState()
        let renderDiv = document.getElementById(this.id)
        if (!renderDiv){
            return false
        }
        let rawEvent = eventObj[EventSrc.Key.rawEvent]
        if(eventObj.type == MouseState.mouseDown){
            this.mouseData = {
                "action": eventObj.data.action,
                "left": this.left,
                "top": this.top,
                "width": this.width == "100%"? renderDiv.clientWidth: this.width,
                "height": this.height == "100%"? renderDiv.clientHeight: this.height,
                "x": rawEvent.x,
                "y": rawEvent.y
            }
            mouse.registerTarget(this)
        } else if(eventObj.type == MouseState.mouseUp){
            if(this.mouseData){
                delete this.mouseData
            }
            mouse.deregister()
        } else if(eventObj.type == MouseState.mouseMoved){
            if(this.mouseData){
                if(this.mouseData.action[0] == WinEle.Action.move){
                    this.left = this.mouseData.left + (rawEvent.x - this.mouseData.x)
                    this.top = this.mouseData.top + (rawEvent.y - this.mouseData.y)
                    eventObj.type = WinEle.Event.moved
                } else {
                    if(this.mouseData.action[0] == WinEle.Action.resizeLeft){
                        let xDist = rawEvent.x - this.mouseData.x
                        if(xDist > this.mouseData.width){
                            xDist = this.mouseData.width
                        }
                        this.left = this.mouseData.left + xDist
                        this.width = this.mouseData.width - xDist
                    }
                    if(this.mouseData.action[0] == WinEle.Action.resizeRight){
                        let xDist = rawEvent.x - this.mouseData.x
                        this.width = this.mouseData.width + xDist
                        if(this.width < 0){
                            this.width = 0
                        }
                    }
                    if(this.mouseData.action.indexOf(WinEle.Action.resizeBottom) >= 0){
                        let yDist = rawEvent.y - this.mouseData.y
                        this.height = this.mouseData.height + yDist
                        if(this.width < 0){x
                            this.width = 0
                        }
                    }
                    eventObj.type = WinEle.Event.resized
                }
                return true
            }
        } else if (eventObj.type == WinEle.Action.btnClose){
            this.closed = true
            eventObj.type = WinEle.Event.closed
            return true
        }
        return false
    }

}

export {WinEle}
