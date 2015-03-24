# Build restfull-api server with koa


## Install

koa-restful is available using [npm](https://npmjs.org):

```
npm install koa-restful
```
## example
use : create koa app.js file ,require koa-restful and write this
### 目录结构
    |-core
    |-model
    |---schema
    |-public
    |---image
    |---lib
    |---layout
    |-views    
    |-app.js
    
### 代码

```
var app = require('koa')(),
	restful = require('koa-restful');
var opt = { 
    modelPath : '../../app/models',
    controllerPath : '../../app/controllers',
    config : {
    	db : ''
    }
};
if( opt.modelPath ){
    restful(opt.modelPath, opt.controllerPath, opt.config.db, app);
}
else{
    log('app-init', 'no model folder, did not init models and models-routes');
}
app.listen(3000);
```
* `modelPath` : model文件夹路径
* `controllerPath` : controllerPath 文件夹路径
* `config` : 数据库等配置信息

### model 数据模型
通过实例化/prototype扩展baseModel生成一个新的model: 


`schemaObj`很重要, 你可以在里面定义model的所有属性, 各个属性的类型和是否必须.  以user为例

| action | url              | 含义                   | model方法名
| :------| :--------------: | :---------------------:| -------------:
| get    | /api/user/:id      | 获取某个               | model._read
| get    | /api/user?foo=bar  | 通过query查询,获取一些(query为空时获取所有)  | model._readByQuery 
| post   | /api/user          | 新建一个用户           | model._create
| put    | /api/user/:id      | 修改一个用户, updates放在request body中     | model._update
| put    | /api/user?foo=bar  | 通过query查询,修改一个用户   | model._update
| delete | /api/user/:id      | 删除某个用户           | model._delete
| delete | /api/user?foo=bar  | 通过query查询, 删除某些用户(query为空时会删除所有)  | model._deleteByQuery

    
`:id`是在schema中制定的关键属性(如自定义的id或者email), 如果没有指定的话会使用默认的`_id`
上述方法会在每一个controller中实现, 可以通过$$controllers_o这个全局变量访问`$$controllers_o.controllerName.method(param, [field])`, 路由也会自动绑定. </br>
如果对于现有的路由不满意, 可以在schema中配置说明不添加某些路由disable默认为false即添加.然后自己去添加路由, 也可覆盖默认的model方法.



## MIT Licensed
