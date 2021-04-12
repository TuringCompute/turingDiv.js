class Format{
    static applyIndent(htmlLines, indentStr){
        if(indentStr == null){
            indentStr = "    "
        }
        for(let i=0; i < htmlLines.length; i++){
            htmlLines[i] = indentStr + htmlLines[i]
        }
    }
}

export {Format}