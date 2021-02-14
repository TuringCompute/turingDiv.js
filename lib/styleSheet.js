class StyleSheet{
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
