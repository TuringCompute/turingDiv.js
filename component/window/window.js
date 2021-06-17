import {DivEle} from "../../lib/divEle.js"
import {Format} from "../../lib/format.js"
import {OrderedDict} from "../../lib/orderedDict.js"
import {StyleSheet} from "../../lib/styleSheet.js"
import {EventSrc} from "../../lib/event.js"
import {MouseState} from "../../lib/mouse.js"

class WinEle extends DivEle{
    
    constructor(props){
        super(props)
        let childrenData = OrderedDict.emptyDict()
        if (props.children){
            childrenData = props.children
        }
        if (!this.props.title){
            this.props.title = "&nbsp;"
        }
        this.props.titleHeight = 30
        this.children = new OrderedDict(childrenData)
        this.closed = false
        this.minDisplay = false
        this.maxDisplay = true
    }

    static Action = Object.freeze({
        "btnClose": "winEleButtonClose",
        "move": "winEleMove",
        "resizeLeft": "resizeLeft",
        "resizeRight": "resizeRight",
        "resizeBottom": "resizeBottom"
    })

    mouseEvent(action){
        let mseEventStr = " onMouseDown='" + this.eventTriger(EventSrc.new(MouseState.mouseDown, null, {"action": action})) + "' "
        return mseEventStr
    }

    titleHtml(){
        let htmlList = []
        htmlList.push("<div style='position:absolute;color:#ffffff; background-color:#2a9df4;" + 
        "left:0px;top:0px;height:" + this.props.titleHeight + "px;width:" + this.props.width + "px;'"+
        " " + this.mouseEvent([WinEle.Action.move]) + ">")
        htmlList.push(" <table style='width:100%; height:100%;'>")
        htmlList.push("     <tr>")
        htmlList.push("         <td width=100%>" + this.props.title + "</td>")
        htmlList.push("         <td><button type='button' class='btn-close' onClick='" + this.eventTriger(EventSrc.new(WinEle.Action.btnClose, null, {})) + "'>X</button></td>")
        htmlList.push("     </tr>")
        htmlList.push(" </table>")
        htmlList.push("</div>")
        return htmlList
    }

    outputHTML(){
        StyleSheet.validatePos(this.props)
        let htmlList = []
        if(this.closed){
            return htmlList
        }
        let titleBar = this.titleHtml()
        htmlList.push(...titleBar)
        this.addBoarder(htmlList)
        let winHeight = (this.props.height - 20)
        if(winHeight > 0){
            htmlList.push("<div class='crop' style='left:0px;top:" + this.props.titleHeight + "px;height=" + winHeight + "px;width:" + this.props.width + "px;'>")
            let childrenIdx = this.children.listIdx()
            for(let childId of childrenIdx){
                let cNode = this.children.data[childId].node
                childHtml = cNode.outputHTML()
                htmlList.push(...childHtml)
            }
            htmlList.push("</div>")
        }
        Format.applyIndent(htmlList)
        this.addDivEleFrame(htmlList)
        return htmlList
    }

    addBoarder(htmlList){
        let brHtml = [
            "<div " + this.mouseEvent([WinEle.Action.resizeLeft]) + " style='position:absolute;top:0;left:0;bottom:0;border-left: 2px solid #2a9df4;cursor: w-resize;'></div>",
            "<div " + this.mouseEvent([WinEle.Action.resizeLeft, WinEle.Action.resizeBottom]) + " style='position:absolute;width:6px;height:6px;border-radius: 2px;border: 1px solid #808080; background: #FFF;opacity: 0; bottom: -3px;left: -3px;cursor: sw-resize;'></div>",
            "<div " + this.mouseEvent([WinEle.Action.resizeRight]) + " style='position:absolute;top:0;right:0;bottom:0;border-right: 2px solid #2a9df4;cursor: e-resize;'></div>",
            "<div " + this.mouseEvent([WinEle.Action.resizeRight, WinEle.Action.resizeBottom]) + " style='position:absolute;width:6px;height:6px;border-radius: 2px;border: 1px solid #808080; background: #FFF;opacity: 0; bottom: -3px;right: -3px;cursor: se-resize;'></div>",
            "<div " + this.mouseEvent([WinEle.Action.resizeBottom]) + " style='position:absolute;left:0;right:0;bottom:0;border-bottom: 2px solid #2a9df4;cursor: s-resize;'></div>"
        ]
        htmlList.push(...brHtml)
    }

    addDivEleFrame(htmlList){
        Format.applyIndent(htmlList)
        let zIdx = ""
        if (this.props.hasOwnProperty("zIdx")){
            zIdx = "z-index:" + this.props.zIdx + ";"
        }
        htmlList.splice(0,0, "<div id='" + this.id + "' style='position:absolute;left:" + this.props.left + "px;top:" + this.props.top + "px;" + 
                            "width:" + this.props.width + "px;height:" + this.props.height + "px;" + zIdx + "'>")
        htmlList.push("</div>")
    }

    processEvent(eventObj){
        let mouse = new MouseState()
        if(eventObj.type == MouseState.mouseDown){
            this.mouseData = {
                "action": eventObj.data.action,
                "left": this.props.left,
                "top": this.props.top,
                "width": this.props.width,
                "height": this.props.height,
                "x": event.x,
                "y": event.y
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
                    this.props.left = this.mouseData.left + (event.x - this.mouseData.x)
                    this.props.top = this.mouseData.top + (event.y - this.mouseData.y)
                } else {
                    if(this.mouseData.action[0] == WinEle.Action.resizeLeft){
                        let xDist = event.x - this.mouseData.x
                        if(xDist > this.mouseData.width){
                            xDist = this.mouseData.width
                        }
                        this.props.left = this.mouseData.left + xDist
                        this.props.width = this.mouseData.width - xDist
                    }
                    if(this.mouseData.action[0] == WinEle.Action.resizeRight){
                        let xDist = event.x - this.mouseData.x
                        this.props.width = this.mouseData.width + xDist
                        if(this.props.width < 0){
                            this.props.width = 0
                        }
                    }
                    if(this.mouseData.action.indexOf(WinEle.Action.resizeBottom) >= 0){
                        let yDist = event.y - this.mouseData.y
                        this.props.height = this.mouseData.height + yDist
                        if(this.props.width < 0){x
                            this.props.width = 0
                        }
                    }
                }
                return true
            }
        } else if (eventObj.type == WinEle.Action.btnClose){
            this.closed = true
            return true
        }
        return false
    }

}

export {WinEle}
