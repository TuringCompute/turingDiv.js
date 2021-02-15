import {DivEle} from "../../lib/divEle.js"
import {Style} from "../../lib/style.js"
import {OrderedDict} from "../../lib/orderedDict.js"
import {StyleSheet} from "../../lib/styleSheet.js"
import {Event} from "../../lib/event.js"
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
        this.props.titleHeight = 20
        this.children = new OrderedDict(childrenData)
    }

    static Action = {
        move: "winEleMove",
        resizeLeft: "resizeLeft",
        resizeRight: "resizeRight",
        resizeBottom: "resizeBottom"
    }

    mouseEvent(action){
        let mseEventStr = " onMouseDown='" + this.eventTriger(Event.new(MouseState.mouseDown, null, {"action": action})) + "' "
        return mseEventStr
    }

    outputHTML(){
        StyleSheet.validatePos(this.props)
        let htmlList = []
        htmlList.push("<div style='position:absolute;color:#ffffff; background-color:#2a9df4;" + 
                    "left:0px;top:0px;height:" + this.props.titleHeight + "px;width:" + this.props.width + "px;'"+
                    " " + this.mouseEvent([WinEle.Action.move]) + ">" + this.props.title + "</div>")
        this.addBoarder(htmlList)
        let winHeight = (this.props.height - 20)
        if(winHeight > 0){
            htmlList.push("<div class='crop' style='left:0px;top:" + this.props.titleHeight + "px;height=" + winHeight + "px;width:" + this.props.width + "px;'>")
            for(let childId of this.children.attrOrder){
                let cNode = this.children.data[childId].node
                childHtml = cNode.outputHTML()
                htmlList.push(...childHtml)
            }
            htmlList.push("</div>")
        }
        Style.applyIndent(htmlList)
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
        Style.applyIndent(htmlList)
        htmlList.splice(0,0, "<div id='" + this.id + "' style='position:absolute;left:" + this.props.left + "px;top:" + this.props.top + "px;" + 
                            "width:" + this.props.width + "px;height:" + this.props.height + "px;'>")
        htmlList.push("</div>")
    }

    processEvent(src, event, eventObj){
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
            window.mouse.registerTarget(this)
        } else if(eventObj.type == MouseState.mouseUp){
            if(this.mouseData){
                delete this.mouseData
            }
            window.mouse.deregister()
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
        }
        return false
    }

}

export {WinEle}
