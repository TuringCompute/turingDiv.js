import { UID } from "./uid.js"

class EventSrc{
    static new(eventType, src, eventData){
        let eventObj = {
            "src": src,
            "type": eventType,
            "data": eventData
        }
        eventObj[EventSrc.Key.uId] = UID.uuid()
        return eventObj
    }

    static Key = Object.freeze({
        "event": "event",
        "rawEvent": "htmlRawEvent",
        "src": "eventSrcObj",
        "srcEle": "eventSrcElement",
        "srcId": "eventSrcId",
        "stop": "eventPropagateStop",
        "uId": "eventUId"
    })

    static Event = Object.freeze({
        "deleted": "eventSubscriberRegistryDeleted"
    })

    static stop(eventObj){
        eventObj[EventSrc.Key.stop] = true
    }

    static stopped(eventObj){
        if(eventObj.hasOwnProperty(EventSrc.Key.stop) && eventObj[EventSrc.Key.stop]){
            return true
        }
        return false
    }

    static nodify(subscriber, eventObj){
        if(typeof subscriber == "function"){ 
            subscriber(eventObj)
        }
    }

    constructor(id, srcObj){
        this.id = id
        this.src = srcObj
        this.regCache = {}
    }

    reg(id, subscriber){
        this.unReg(id)
        this.regCache[id] = subscriber
    }

    unReg(id){
        if(this.regCache.hasOwnProperty(id)){
            EventSrc.nodify(this.regCache[id], EventSrc.new(EventSrc.Event.deleted, id, {}))
            delete this.regCache[id]
        }
    }

    regSize(){
        return Object.keys(this.regCache).length;
    }

    publish(eventObj){
        for(let subId in this.regCache){
            EventSrc.nodify(this.regCache[subId], eventObj)
        }
    }
}

export {EventSrc}
