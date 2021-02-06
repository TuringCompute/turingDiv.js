class Event{
    static new(eventType, eventSrc, eventData){
        return {
            "src": eventSrc,
            "type": eventType,
            "data": eventData            
        }
    }
}

class EventHandler{
    handleEvent(event){
        throw Error("processEvent is not implemented")
    }
}

export {Event, EventHandler}
