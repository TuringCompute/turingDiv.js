class OrderedDict{
    static order = "$$order"

    constructor(data){
        this.data = data
        this.attrOrder = data[OrderedDict.order]
        this.validate()        
    }

    validate(){
        if(!this.attrOrder || !Array.isArray(this.attrOrder)){
            throw Error("Invalid format, missing " + OrderedDict.order + " it's not an array")
        }
        for(let attr in this.data){
            if(attr == OrderedDict.order){
                continue
            }
            if( this.attrOrder.indexOf(attr) == -1){
                throw Error(OrderedDict.order +" has " + orderCount + " attr=" + attr)
            }
        }
        let countMap = {}
        for(let idx in this.attrOrder){
            let attr = this.attrOrder[idx]
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
    
    setValue(attr, attrValue, idx=null){
        if(attr == OrderedDict.order){ throw Error(OrderedDict.order + " is a keyword, cannot be set as attr name") }
        this.data[attr] = attrValue
        if(idx !== null){
            curidx = this.attrOrder.indexOf(attr)
            if (curidx == idx){
                return
            }
            delete this.attrOrder[curidx]
            this.attrOrder.splice(idx, 0 , attr)
        }
    }

    popAttr(attr){
        let attrValue = this.data[attr]
        delete this.data[attr]
        idx = this.attrOrder.indexOf(attr)
        if(idx == -1){
            return null
        }
        delete this.attrOrder[idx]
        return attrValue
    }

}

export {OrderedDict}