import {DivEle} from "../../lib/divEle.js"

class DynaList extends DivEle{
    static Key = Object.freeze({
        "dataType": "dynamicListDataType",
        "data": "dynamicListData"
    })

    static State = Object.freeze({
        "collapsed": "dynamicListCollapsed",
        "expanded": "dynamicListExpanded"

    })

    static Event = Object.freeze({
        "stateChange": "dynamicListStateSwitched",
        "moveUp": "dynamicListItemMoveUp",
        "moveDown": "dynamicListItemMoveDown",
        "selected": "dynamicListItemSelected"
    })

    constructor(props){
        super(props)
        this.state = DynaList.State.collapsed
        this.dataBag = DataStore.GetStore().newData(this.id, DataStore.subscriber(this.id, this.handleEvent))
        if(props.hasOwnProperty(DynaList.Key.data)){
            this.bind(props[DynaList.Key.dataType])
        }
    }

    bind(data){
        if(!Array.isArray(data)){
            throw Error("data to bind is not an array")
        }
        this.dataBag[DynaList.Key.data] = data
        this.selectedIdx = -1
    }

    expandTable(){
        if(this.state == DynaList.State.collapsed || !this.dataBag.hasOwnProperty(DynaList.Key.data) || this.dataBag[DynaList.Key.data].length == 0){
            return []
        }
        let htmlList = []
        let listLen = this.dataBag[DynaList.Key.data].length
        let buttonColumn = "<td rowspan=" + listLen + "><button>up</button><br><button>down</button></td>"
        for(let idx=0; idx < listLen; idx ++){
            if(idx > 0){
                buttonColumn = ""
            }            
            htmlList.push("<tr><td>" + this.dataBag[DynaList.Key.data][idx] + "</td>" + buttonColumn + "</tr>")
        }
        return htmlList
    }

    outputHTML(){
        let displayIdx = this.selectedIdx? this.selectedIdx: ""
        let expandList = this.expandTable()
        Format.applyIndent(expandList)
        let htmlList = [
            "<table>",
            "   <tr>",
            "       <td>" + displayIdx + "</td><td><button>choose</button></td>",
            "   </tr>",
            ...expandList,
            "</table>"
        ]
        Format.applyIndent(htmlList)
        this.addDivEleFrame(htmlList)
        return htmlList
    }

    processEvent(eventObj){
        if(eventObj.type == DynaList.Event.stateChange){
            if(this.state == DynaList.State.collapsed){
                this.state = DynaList.State.expanded
            } else {
                this.state = DynaList.State.collapsed
            }
            return true
        } else if(eventObj.type == DynaList.Event.moveUp && this.selectedIdx > -1){
            this.selectedIdx -= 1
        } else if(eventObj.type == DynaList.Event.moveDown && this.selectedIdx > -1){

        } else if(eventObj.type == DynaList.Event.selected){

        }
        return false
    }

}

