class UID{
    static idx(idxName){
        if (!window.idxCache){
            window.idxCache = {}
        }
        if(!window.idxCache.hasOwnProperty(idxName)){
            window.idxCache[idxName] = 0
        } else {
            window.idxCache[idxName] += 1
        }
        return idxName + "-" + window.idxCache[idxName]
    }

    static uuid(size=null) {
        if(!size){
            size = 35;
        }
        const hashTable = [
            'a',
            'b',
            'c',
            'd',
            'e',
            'f',
            '0',
            '1',
            '2',
            '3',
            '4',
            '5',
            '6',
            '7',
            '8',
            '9'
        ]
        if(size <= 0){
            throw Error("Invalid Size [" + size + "]")
        }
        let uuid = []
        for (let i = 0; i < size; i++) {
            if (i === 7 || i === 12 || i === 17 || i === 22) {
                uuid[i] = '-'
            } else {
                uuid[i] = hashTable[Math.floor(Math.random() * hashTable.length - 1)]
            }
        }
        return uuid.join('')
    }
}

export {UID}