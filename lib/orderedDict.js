class OrderedDict{
    static order = "$$order"

    static emptyDict(){
        let empty = {}
        empty[OrderedDict.order] = []
        return empty
    }

    constructor(data){
        this.data = data
        this.list = data[OrderedDict.order]
        this.validate()        
    }

    validate(){
        if(!this.list || !Array.isArray(this.list)){
            throw Error("Invalid format, missing " + OrderedDict.order + " it's not an array")
        }
        for(let attr in this.data){
            if(attr == OrderedDict.order){
                continue
            }
            if( this.list.indexOf(attr) == -1){
                throw Error(OrderedDict.order +" has " + orderCount + " attr=" + attr)
            }
        }
        let countMap = {}
        for(let idx in this.list){
            let attr = this.list[idx]
            if(!this.data[attr]){
                throw Error("missing definition of attr=" + attr)
            }
            if(!countMap[attr]){
                countMap[attr] = 1
            } else {
                throw Error("attr=" + attr + " has more than 1 occourance in " + OrderedDict.order )
            }
        }
    }
    
    setValue(key, value, idx=null){
        if(key == OrderedDict.order){ throw Error(OrderedDict.order + " is a keyword, cannot be set as attr name") }
        this.data[key] = value
        if(idx !== null){
            curidx = this.list.indexOf(key)
            if (curidx == idx){
                return
            }
            delete this.list[curidx]
            this.list.splice(idx, 0 , key)
        } else {
            this.list.push(key)
        }        
    }

    getValue(key){
        if(key == OrderedDict.data || !this.data.hasOwnProperty(key)){
            return null
        }
        return this.data[key]
    }

    getIdx(idx){
        if(idx < 0 || idx >= this.list.length){
            return null
        }
        let key = this.list[idx]
        return this.getValue(key)
    }

    listIdx(){
        return this.list.slice()
    }

    pop(key){
        let value = this.data[key]
        delete this.data[key]
        idx = this.list.indexOf(key)
        if(idx == -1){
            return null
        }
        delete this.list[idx]
        return value
    }

}

export {OrderedDict}