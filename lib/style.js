class Style{
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

    static applyIndent(htmlLines){
        for(let i=0; i < htmlLines.length; i++){
            htmlLines[i] = "    " + htmlLines[i]
        }
    }
}

export {Style}