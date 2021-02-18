class StyleSheet{
    static inline(data){
        let cssStr = ""
        for(let key in data){
            let keyStr = key + ":" + data[key] + ";"
            if (cssStr == ""){
                cssStr = keyStr
            } else {
                cssStr = cssStr + " " + keyStr
            }
        }
        return "style='" + cssStr + "'"
    }

    static validatePos(dataBag){
        for(let propName of ["left", "top"]){
            if(!dataBag.hasOwnProperty(propName)){
                dataBag[propName] = 0
            }
        }
        for(let propName of ["width", "height"]){
            if(!dataBag.hasOwnProperty(propName)){
                throw "missing property [" + propName + "]"
            }
        }
    }
}

export {StyleSheet}
