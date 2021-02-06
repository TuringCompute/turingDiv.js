class DataType{
    static bool = "bool"
    static decimal = "decimal"
    static integer = "integer"
    static simpleValue = "simpleValue"
    static string = "string"
    static indexedList = "indexedList"
    static list = "list"
    static orderedDict = "orderedDict"
    static dict = "dict"

    static htmlValue(valueType, value){
        if(!value){
            if(valueType == DataType.bool){
                return ""
            } else {
                return "value=''"
            }
        }
        if(valueType == DataType.bool){
            if(value == 1){
                return "checked"
            }else if(value == 0){
                return ""
            }
            if (Boolean(value)){
                return "checked"
            }
            return ""
        }
        return "value='" + value + "'"
    }

    static htmlToValue(valueType, valueStr){
        if (valueType == DataType.integer){
            return parseInt(valueStr)
        } else if(valueType == DataType.decimal){
            return parseFloat(valueStr)
        } else {
            return valueStr
        }
    }
}

export {DataType}