class IndexedList {
    static Key = Object.freeze({
        "idx": "indexAttribute",
        "type": "listDataSourceType"
    })

    constructor(props){
        if(!props.hasOwnProperty(IndexedList.Key.idx)){
            throw Error("Missing init param [" + IndexedList.Key.idx + "]")
        }
        this.idxAttr = props[IndexedList.Key.idx]
        this.hash = {}
        this.list = []
    }

    value(){
        let retList = []
        for(let idx of this.list){
            retList.push(this.hash[idx])
        }
        return retList
    }

    validate(item){
        if(!item.hasOwnProperty(this.idxAttr)){
            throw Error("item missing [" + this.idxAttr + "]")
        }
        let idxVal = item[this.idxAttr]
        if(this.hash.hasOwnProperty(idxVal)){
            throw Error("item [" + this.idxAttr + "] = (" + idxVal + ") already exists")
        }
        return idxVal
    }

    indexList(itemList){
        if(!itemList){
            return []
        }
        if(!Array.isArray(itemList)){
            itemList = [itemList]
        }
        let newList = []
        let newHash = {}
        for(let i=0; i<itemList.length; i++){
            let item = itemList[i]
            let idxVal = this.validate(item)
            if(newHash.hasOwnProperty(idxVal)){
                throw Error("item [" + i + "] has [" + this.idxAttr + "] = [" + idxVal + "] duplicated in itself")
            }
            newHash[idxVal] = item
            newList.push(idxVal)
        }
        this.hash.assign(newHash)
        return newList        
    }

    push(items){
        let newList = this.indexList(items)
        this.list.push(...newList)
    }

    splice(idx, size, items){
        let removed = this.list.splice(idx, size)
        for(let i = 0; i< removed.length; i++){
            let idxVal = removed[i]
            delete this.hash[idxVal]            
        }
        let newList = this.indexList(items)
        this.list.splice(idx, 0, newList)
    }

    popIdx(idx){
        let item = this.hash[idx]
        if(item){
            delete this.hash[idx]
        }
        return item
    }

    pop(){
        let idx = this.list.pop()
        return this.popIdx(idx)
    }

    shift(){
        let idx = this.list.shift()
        return this.popIdx(idx)
    }
}