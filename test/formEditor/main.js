import {FormEditor} from "../../component/formEditor/formEditor.js"
import {DataStore} from "../../lib/dataStore.js"
import {UID} from "../../lib/uid.js"

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
        let attrEditor = new FormEditor({
            "divId": "attrEditor",
            "dataStore": window.store,
            "schema": {
                "$$order": ["test1", "test2", "test3"],
                "test1": {
                    "type": "string"
                },
                "test2": {
                    "type": "string"
                },
                "test3": {
                    "type": "bool"
                }
            }
        })
        attrEditor.render()
    }

    setTestData(){
        if (Object.keys(window.divElements).length != 1){
            throw Error("Failed to find divElement for attr Editor")
        }
        let divEleId = Object.keys(window.divElements)[0]
        console.log("attr editor id=" +divEleId)
        let attrEditor = window.divElements[divEleId]
        if(!attrEditor || !(attrEditor instanceof FormEditor)){
            throw Error("invalid attr Editor id=" + divEleId)
        }
        this.data = window.store.newData("testAttr", DataStore.subscriber(this.id, this.handleEvent))
        window.store.notify("testAttr")
        this.data.test1 = "t1"
        this.data.test2 = "t2"
        this.data.test3 = true
        let editorData = window.store.getData(divEleId)
        editorData.dataId = "testAttr"
        editorData.data = this.data
        window.store.notify(divEleId)
    }
}

window.main = new Main()

window.divEvent = function divEvent(event){
    let divEle = window.divElements[event.src]
}
