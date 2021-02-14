import {Event} from "./event.js"

class DataStore{
    static dataChanged = "dataChanged"

    static subscriber(id, notify){
        if(typeof notify !== 'function'){
            throw Error("notify should be a function to send data changed Event")
        }
        return {
            "id": id,
            "notify": notify
        }
    }

    constructor(){
        this.store = {}
        this.subscription = {}
    }

    newData(dataId, owner){
        if(this.store[dataId]){
            throw Error("data " + dataId + " already exists.")
        }
        this.store[dataId] = {}
        this.subscribe(dataId, owner)
        return this.store[dataId]
    }

    getData(dataId, subscriber=null){
        this.subscribe(dataId, subscriber)
        return this.store[dataId]
    }

    subscribe(dataId, subscriber){
        if(subscriber && subscriber.id && typeof subscriber.notify === "function"){
            if(!this.subscription[dataId]){
                this.subscription[dataId] = {}
            }
            this.subscription[dataId][subscriber.id] = subscriber.notify
        }
    }

    unsubscribe(dataId, subscriberId){
        if(this.subscription[dataId] && this.subscription[dataId][subscriberId]){
            delete this.subscription[dataId][subscriberId]
        }
        if(Object.keys(this.subscription[dataId]).length == 0){
            delete this.subscription[dataId]
            if(this.store[dataId]){
                delete this.store[dataId]
            }
        }
    }

    notify(dataId){
        if(this.subscription[dataId]){
            for(let nId in this.subscription[dataId]){
                let e = Event.new(DataStore.dataChanged, dataId, {})
                let subscriber = this.subscription[dataId][nId]
                subscriber(null, null, e)
            }
        }
    }
}

export {DataStore}
