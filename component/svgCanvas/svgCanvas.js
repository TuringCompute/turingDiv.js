import {DivEle} from "../../lib/divEle.js"

// this class is a container by itself.
// the ini drawing is stored in props for display.
// each of the drawing element are represented as an svg element
// root element is the Canvas itself.
// the entire drawing is a tree of elements. every time data change in the drawing, will require redraw of entire canvas
class SvgCanvas extends DivEle{
    constructor(props){
        super(props)
    }
}


