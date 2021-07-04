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
}

export {StyleSheet}
