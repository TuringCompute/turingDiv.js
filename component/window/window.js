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
        this.init_property()
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

    init_property(){
        this.leftBoarder = ""
        this.leftBoarderCur = ""
        this.leftBottomDot = ""
        this.leftBottomCur = ""
        this.rightBoarder = ""
        this.rightBoarderCur = ""
        this.rightBottomDot = ""
        this.rightBottomCur = ""
        this.bottomBoarder = ""
        this.bottomCur = ""
        if(this.enableResize || this.enableResizeLeft){
            this.leftBoarder = this.mouseEvent([WinEle.Action.resizeLeft])
            this.leftBoarderCur = "cursor: w-resize;"
        }
        if(this.enableResize || this.enableResizeRight){
            this.rightBoarder = this.mouseEvent([WinEle.Action.resizeRight])
            this.rightBoarderCur = "cursor: e-resize;"
        }            
        if(this.enableResize || this.enableResizeBottom){
            this.bottomBoarder = this.mouseEvent([WinEle.Action.resizeBottom])
            this.bottomCur = "cursor: s-resize;"
            if(this.enableResize || this.enableResizeRight){
                this.rightBottomDot = this.mouseEvent([WinEle.Action.resizeRight, WinEle.Action.resizeBottom])
                this.rightBottomCur = "cursor: se-resize;"
            }
            if(this.enableResize|| this.enableResizeLeft){
                this.leftBottomDot = this.mouseEvent([WinEle.Action.resizeLeft, WinEle.Action.resizeBottom])
                this.leftBottomCur = "cursor: sw-resize;"
            }
        }
    }

    mouseEvent(action){
        let mseEventStr = " onMouseDown='" + this.eventTriger(EventSrc.new(MouseState.mouseDown, null, {"action": action})) + "' "
        return mseEventStr
    }

    calcTitleHeight(){
        if(this.enableTitle){
            return this.titleHeight
        }
        return 0
    }

    innerWidth(){
        return this.width=="100%"? this.width: (this.width - 5) + "px"
    }

    innerHeight(){
        let titleHeight = this.calcTitleHeight()
        return this.height=="100%"? this.height: (this.height - titleHeight - 5) + "px"
    }

    titleHtml(){
        if (!this.enableTitle){
            return []
        }
        let moveEventStr = this.enableMove? this.mouseEvent([WinEle.Action.move]): ""
        let titleHtml = []
        titleHtml.push("    <tr style='height:30px;'>")
        titleHtml.push("        <td style='color:#ffffff; background-color:#2a9df4;width:" + this.innerWidth() + 
                        "' colspan=3 " + moveEventStr + ">")
        titleHtml.push("            <table style='width:100%; height:100%;'>")
        titleHtml.push("                <tr>")
        titleHtml.push("                    <td width=100%>" + this.title + "</td>")
        if (this.enableCloseButton){
            titleHtml.push("                    <td><button type='button' class='btn-close' onClick='" + this.eventTriger(EventSrc.new(WinEle.Action.btnClose, null, {})) + "'>X</button></td>")
        }
        titleHtml.push("                </tr>")
        titleHtml.push("            </table>")
        titleHtml.push("        </td>")
        titleHtml.push("    </tr>")
        return titleHtml
    }

    outputHTML(){
        let htmlList = []
        if(this.closed){
            return []
        }
        let titleHtml = this.titleHtml()
        htmlList.push("<table style='height:100%;border-spacing:0px;padding:0px;border-left: 2px solid #2a9df4;border-right: 2px solid #2a9df4;border-bottom:2px solid #2a9df4;'>")
        htmlList.push(...titleHtml)
        htmlList.push("    <tr>")
        htmlList.push("        <td " + this.leftBoarder + " style='width:2px;" + this.leftBoarderCur + "'></td>")
        htmlList.push("        <td style='width:" + this.innerWidth() + ";height:100%;vertical-align:top;'>")
        let childrenIdx = this.children.listIdx()
        for(let childId of childrenIdx){
            let cNode = this.children.data[childId].node
            let childHtml = cNode.outputHTML()
            Format.applyIndent(childHtml, "            ")
            htmlList.push(...childHtml)
        }
        htmlList.push("        </td>")
        htmlList.push("        <td style='width:2px;" + this.rightBoarderCur + "' " + this.rightBoarder + "></td>")
        htmlList.push("    </tr>")
        htmlList.push("    <tr>")
        htmlList.push("        <td " + this.leftBottomDot + " style='width:2px;" + this.leftBottomCur + "'></td>")
        htmlList.push("        <td " + this.bottomBoarder + " style='width:2px;" + this.bottomCur + "'></td>")
        htmlList.push("        <td " + this.rightBottomDot + " style='width:2px;" + this.rightBottomCur + "'></td>")
        htmlList.push("    </tr>")
        htmlList.push("</table>")
        Format.applyIndent(htmlList)
        this.addDivEleFrame(htmlList)
        return htmlList
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
                            "width:" + frameWidth + ";height:" + frameHeight + ";" + zIdx + "'>")
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
            EventSrc.stop(eventObj)
        } else if(eventObj.type == MouseState.mouseUp){
            if(this.mouseData){
                delete this.mouseData
            }
            mouse.deregister()
            EventSrc.stop(eventObj)
        } else if(eventObj.type == MouseState.mouseMoved){
            if(this.mouseData && this.mouseData.action){
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
