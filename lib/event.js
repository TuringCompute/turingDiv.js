class Event{
    static new(eventType, src, eventData){
        return {
            "src": src,
            "type": eventType,
            "data": eventData            
        }
    }

    static src(srcName){
        return {
            "src": srcName
        }
    }
}

export {Event}
