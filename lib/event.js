class EventSrc{
    static new(eventType, src, eventData){
        return {
            "src": src,
            "type": eventType,
            "data": eventData
        }
    }

    static Key = Object.freeze({
        "rawEvent": "htmlRawEvent",
        "src": "eventSrcObj",
        "srcEle": "eventSrcElement",
        "srcId": "eventSrcId",
        "event": "event"
    })

    static Event = Object.freeze({
        "deleted": "eventSubscriberRegistryDeleted"
    })

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
