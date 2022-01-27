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

    static loadCSS(cssPath){
        let xhr = new XMLHttpRequest();
        xhr.open("GET", cssPath, false)
        try {
            xhr.send();
            if (xhr.status != 200) {
                throw Error(`Error ${xhr.status}: ${xhr.statusText}`)
            } else {
                let cssArray = xhr.response.split("\r\n")
                cssArray.splice(0,0,"<style>")
                cssArray.push("</style>")
                return cssArray
            }
        } catch(err) { // instead of onerror
            throw Error('Request failed')
        }
    }
}

export {StyleSheet}
