var tool = require('./tool'),
    mt = require('./util');

if(!global.log){
    global.log = console.log;
}
/*
 * param: model名称, model配置, 数据连接配置
 * 
 * 
 */
var Model = function (name, config, controller, dbConf) {

        // 添加默认属性
        if (config.readAllAllowed === undefined) {
            config.readAllAllowed = true;
        }
        if (config.keyField === undefined) {
            config.keyField = '_id';
        }
        // 一些基础属性
        this.name = name;
        this.config = config;
        this.controller = controller;

        if (dbConf) {
            // 数据库连接

        }

        // 可以通过哪些字段查询
        this.allowReadFields = [];
        // 如果设定为* 或者没有配置,  则视为全部允许
        if (this.config.readBy === '*' || this.config.readBy === undefined) {
            // 没有schema, 或者完全为空
            if (this.config.schema == undefined || tool.isEmptyObj(this.config.schema)) {
                this.allowReadFields = '*';
            }
            // 如果有schema, 就把所有字段定为可readBy
            // 方便后面进行query过滤和矫正
            else {
                for (var key in this.config.schema) {
                    this.allowReadFields.push(key);
                }
            }
        }
        else {
            this.allowReadFields = this.config.readBy;
        }


        var baseUrl = '/api/' + this.name;
        var _self = this;


        this.readQueryFilter = function (query) {
            // 如果不是"全部字段均可拿来当做查询参数"
            var filteredQuery = {};
            var allowedFileds = this.allowReadFields;
            var _self = this;
            // * 是上面没有定义readBy且没有schema导致的,
            // 这样就没有办法过滤查询条件, 也没有办法矫正string -> number
            // 所以直接把query传下去
            if (allowedFileds == '*') {
                return query;
            }
            else {
                allowedFileds.forEach(function (by) {
                    // 如果这个字段传了 矫正一下
                    if (query[by] !== undefined) {
                        var adjusted = mt.checkSingleField(query[by], _self.config.schema[by]);
                        if (adjusted !== false) {
                            filteredQuery[by] = adjusted;
                        }
                    }
                });
            }

            return filteredQuery;
        };

        // handler的context会被绑定为koa的上下文, this.req, this.request的那个
        this.route = {
            _create: {
                action: 'post',
                url: baseUrl,
                handler: function * () {
                    var param = this.request.body.fields;
                    try{
                        var res = yield _self.controller._create.call(this, param);
                        mt.sendRes.call(this, res);
                    }catch(e){
                        mt.ReqError.call(500);
                        log('koa-restful',"can't find the controller");
                    }

                }
            },
            _read: {
                action: 'get',
                url: baseUrl + '/:id',
                handler: function*() {
                    try{
                        var res = yield _self.controller._read.call(this, this.params.id);
                        mt.sendRes.call(this, res);
                    }catch(e){
                        mt.ReqError.call(500);
                        log('koa-restful',"can't find the controller");
                    }

                }
            },
            _readByQuery: {
                action: 'get',
                url: baseUrl,
                handler: function*() {
                    var param = this.request.query;
                    try{
                        var res = yield _self.controller._readByQuery.call(this, param);
                        mt.sendRes.call(this, res);
                    }catch(e){
                        mt.ReqError.call(500);
                        log('koa-restful',"can't find the controller");
                    }

                }
            },
            _update: {
                action: 'put',
                url: baseUrl + '/:id',
                handler: function*() {
                    var updates = this.request.body.fields;
                    try{
                        var res = yield _self.controller._update.call(this, this.params.id, updates);
                        mt.sendRes.call(this, res);
                    }catch(e){
                        mt.ReqError.call(500);
                        log('koa-restful',"can't find the controller");
                    }

                }
            },
            _updateByQuery: {
                action: 'put',
                url: baseUrl,
                handler: function*() {
                    var query = this.request.query;
                    var updates = this.request.body.fields;
                    try{
                        var res = yield _self.controller._updateByQuery.call(this, query, updates);
                        mt.sendRes.call(this, res);
                    }catch(e){
                        mt.ReqError.call(500);
                        log('koa-restful',"can't find the controller");
                    }

                }
            },
            _delete: {
                action: 'delete',
                url: baseUrl + '/:id',
                handler: function*() {
                    try{
                        var res = yield _self.controller._delete.call(this, this.params.id);
                        mt.sendRes.call(this, res);
                    }catch(e){
                        mt.ReqError.call(500);
                        log('koa-restful',"can't find the controller");
                    }

                }
            },
            _deleteByQuery: {
                action: 'delete',
                url: baseUrl,
                handler: function*() {
                    var param = this.request.query;
                    try{
                        var res = yield _self.controller._deleteByQuery.call(this, param);
                        mt.sendRes.call(this, res);
                    }catch(e){
                        mt.ReqError.call(500);
                        log('koa-restful',"can't find the controller");
                    }

                }
            }
        };

        return this;
    };

Model.prototype.bindRoute = function (app) {
    for (var name in this.route) {
        var route = this.route[name];
        if(this.config.disable) continue;
        app[route.action](route.url, route.handler);
    }
};

module.exports = Model;

