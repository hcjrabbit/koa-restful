var $requireDir_f = require('require-dir');

var $ModelClass = require('./lib/core');



module.exports = function($modelPath_s, $controlPath_s, $dbConf_s, $app_o){
    var $modelConfig_o = $requireDir_f($modelPath_s),
        $controllers_o = $requireDir_f($controlPath_s);
    var $Model_o = {};
    global.$$models_o = $Model_o;
    global.$$controllers_o = $controllers_o;

    for(var $mName_s in $modelConfig_o){
        $Model_o[$mName_s] = new $ModelClass($mName_s, $modelConfig_o[$mName_s],$controllers_o[$mName_s], $dbConf_s);

        $Model_o[$mName_s].bindRoute($app_o);
    }
};