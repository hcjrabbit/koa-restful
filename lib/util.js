if(!global.log){
    global.log = console.log;
}

var mt = {
    // at first, just for 'create'
    // then build other functions
    checkSchema: function(param, schema){
        var reqData = param;
        // 没有传post数据
        if(!reqData){
            return false;
        }

        // 未定义schema
        if( schema == undefined ){
            return reqData;
        }

        var checkedFields = {};
        for( var key in schema ){
            var checkedField = mt.checkSingleField( reqData[key], schema[key] );
            if( checkedField === false ){
                log('dev err', 'post data did not check right, \nschema: ', schema, '\npost data:', reqData );
                log('dev err', 'err filed: ', key);
                log('dev err', 'err value: ', reqData[key]);
                return false
            }
            checkedFields[key] = checkedField;
        }
        return checkedFields;
    },
    // 根据配置 检查传递的参数
    // valid  返回参数值
    // invalid 返回false
    checkSingleField: function ( val, rq ){
        // 如果必备参数没传, 立刻返回false
        if(rq.required){
            if(val === undefined){
                return false;
            }
        }

        // 判断类型, 通过, 返回参数值
        //      不通过, 视情况返回false或默认空值
        switch( rq.type ){
            case 'string':
                if( mt.isType.string(val) ){
                    return val;
                }
                else{
                    return ( rq.required? false : '' );
                }
                break;
            case 'number':
                var numberVal = Number(val);
                if( mt.isType.number(numberVal) ){
                    return numberVal;
                }
                else{
                    return ( rq.required? false : 0 );
                }
                break;
            case 'array':
                if( mt.isType.array(val) ){
                    return val;
                }
                else{
                    return ( rq.required? false : [] );
                }
            case 'object':
                if( mt.isType.object(val) ){
                    return val;
                }
                else{
                    return ( rq.required? false : {} );
                }
            case 'email':
                if(mt.isType.looseEmail(val)){
                    return val;
                }
                else{
                    return ( rq.required? false : '' );
                }
                break;
        }
        return false;
    },
    sendRes: function (data){
        var resData = data;
        this.body = resData || this.body;
    },
    ReqError: function(code, message) {
        this.name = 'request error';
        this.code = code;
        this.msg = message || 'error occured while deail with request';
    },
    isType: {
        string: function(val){
            return (typeof val === 'string');
        },
        number: function(val){
            return !isNaN(val)
        },
        array: function(val){
            return Array.isArray(val)
        },
        // 狭义的对象
        object: function(val){
            return (typeof val === 'object' && !Array.isArray(val) && !(val instanceof Function));
        },
        uuid: function(val){
            return ( mt.isType.string(val));
        },
        function: function(val){
            return (val instanceof Function);
        }
    }
};

mt.ReqError.prototype = new Error();
mt.ReqError.prototype.constructor = mt.ReqError;

module.exports = mt;