import {SVGLayer} from "../../component/svg/svgLayer.js"
import {UID} from "../../lib/uid.js"
import {DataStore} from "../../lib/dataStore.js"

class Main{
    handleEvent(event){
        console.log(this.data)
    }

    constructor(){
        this.id = UID.uuid()
        this.handleEvent = this.handleEvent.bind(this)
    }

    run(){
        window.store = new DataStore()
        window.svgLayer = new SVGLayer({"divId": "svgTest"})
        window.svgLayer.render()
    }

    setTestData(){
        window.svgLayer.left += 10
        window.svgLayer.top += 10
        window.svgLayer.render()
    }
}

window.main = new Main()

window.divEvent = function divEvent(event){
    let divEle = window.divElements[event.src]
}
