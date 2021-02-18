class Format{
    static applyIndent(htmlLines){
        for(let i=0; i < htmlLines.length; i++){
            htmlLines[i] = "    " + htmlLines[i]
        }
    }
}

export {Format}