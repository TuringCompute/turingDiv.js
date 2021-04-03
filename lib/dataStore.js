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

    newData(dataId, owner){
        if(this.store[dataId]){
            throw Error("data " + dataId + " already exists.")
        }
        this.store[dataId] = {
            "data": {},
            "event": new EventSrc(dataId, {})
        }
        this.subscribe(dataId, owner)
        return this.store[dataId].data
    }

    getData(dataId, subscriber=null){
        this.subscribe(dataId, subscriber)
        if(this.store[dataId]){
            return this.store[dataId].data
        }
        throw Error("data id=[" + dataId + "] does not eixsts")
    }

    subscribe(dataId, subscriber){
        if(this.store[dataId] && subscriber && subscriber.id && typeof subscriber.notify === "function"){
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

    notify(dataId){
        if(this.store[dataId]){
            this.store[dataId].event.publish(EventSrc.new(DataStore.dataChanged, dataId, {}))
        }
    }
}

export {DataStore}
