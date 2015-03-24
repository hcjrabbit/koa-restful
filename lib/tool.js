var tool = {
    isEmptyObj: function(obj){
        for( var key in obj ){
            return false;
        }
        return true;
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
            return ( mu.isType.string(val));
        },
        function: function(val){
            return (val instanceof Function);
        }
    }
};


module.exports = tool;