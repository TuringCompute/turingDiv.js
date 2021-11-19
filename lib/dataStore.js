import {EventSrc} from "./event.js"

class DataStore{
    static dataChanged = "dataStoreDataChanged"

    static subscriber(id, notify){
        return {
            "id": id,
            "notify": notify
        }
    }

    constructor(){
        if(!DataStore.instance){
            this.store = {}
            DataStore.instance = this
        }
        return DataStore.instance
    }

    static GetStore(){
        return new DataStore()
    }

    newData(dataId){
        if(this.store[dataId]){
            return
        }
        this.store[dataId] = {
            "data": {},
            "event": new EventSrc(dataId, {})
        }
    }

    getData(dataId, subscriber=null){
        this.subscribe(dataId, subscriber)
        if(this.store[dataId]){
            return this.store[dataId].data
        }
        return null
    }

    subscribe(dataId, subscriber){
        if(subscriber && subscriber.id && typeof subscriber.notify === "function"){
            this.newData(dataId)
            this.store[dataId].event.reg(subscriber.id, subscriber.notify)
        }
    }

    unsubscribe(dataId, subscriber){
        if(this.store[dataId]){
            this.store[dataId].event.unReg(subscriber.id)
        }
        if(this.store[dataId].event.regSize == 0){
            // if nobody is subscribing to the data, then the data is useless, garbage collect it
            delete this.store[dataId]
        }
    }

    notify(dataId, src, tags){
        if(this.store[dataId]){
            let eventObj = {}
            if(src){
                eventObj[EventSrc.Key.src] = src
            }
            if(tags && typeof tags === 'object'){
                Object.assign(eventObj, tags)
            }
            this.store[dataId].event.publish(EventSrc.new(DataStore.dataChanged, dataId, eventObj))
        }
    }
}

export {DataStore}
