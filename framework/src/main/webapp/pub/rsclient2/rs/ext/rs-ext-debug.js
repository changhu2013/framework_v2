
Rs.ns("Rs.ext.state");

(function(){
    /**
     * @class Rs.ext.state.Provider
     * <p>该类用于对用户偏好信息的管理</p>
     * @extends Ext.util.Observable
     * @param {Object} config
     */
    Rs.ext.state.Provider = function(config) {
        this.state = {};
        Ext.apply(this, config || {});
        this.addEvents(
            /**
             * @event statechange 
             * 当用户偏好信息发生变化时触发给事件
             * @parqam {Provider} provider
             * @param {String} method;
             * @param {String} module;
             * @param {String} scheme;
             * @param {Object} data;
             */
            'statechange',
            /**
             * @event load 
             * 当用户偏好信息加载完成时触发该事件
             * @param {Rs.ext.state.Provider} this provider of the StateManager
             * @param {Array} moduels;
             */
            'load');
        Rs.ext.state.Provider.superclass.constructor.call(this);
        if(this.autoLoad === true) {
            this.load();
        } else if(Rs.isArray(this.autoLoad) && this.autoLoad.length > 0) {
            this.load(this.autoLoad);
        }
        this.on('statechange', this.sync, this, {
            scope : this,
            buffer : 100
        });
    };
    Ext.extend(Rs.ext.state.Provider, Rs.util.Observable, {
        /**
         * @cfg {Boolean} autoLoad  
         * <p>默认为false, 是否加载用户偏好信息<br>
         * 当autoLoad为一个Object则取其module属性来加载数据.
         * </p>
         */
        autoLoad : false,

        /**
         * @cfg {String} url 
         * <p>用户偏好信息URL.</p>
         */
        
        /**
         * <p>加载模块方案</p>
         * @param {String} modules
         * @param {Function} callback
         * @param {Object} scope
         */
        load : function(modules, callback, scope) {
            Rs.Service.call({
                url : this.url,
                method : "load",
                params : {
                    modules : Rs.isArray(modules) ? modules : [ modules ]
                }
            }, this.__onLoad.createDelegate(this, 
                [callback, scope], 3), scope);
        },
        
        // private
        __onLoad : function(schemes, options, callback, scope) {
            var s, mc, sc, sd, df;
            Rs.each(schemes, function(s) {
                mc = s.moduleCode;
                sc = s.schemeCode;
                s.stateData == undefined ? s.stateData = '' : null;
                sd = Rs.decode(s.stateData || '') || {};
                df = (s.defaultFlag === true);
                this.state[mc] ? null : this.state[mc] = {};
                this.state[mc][sc] ? null : this.state[mc][sc] = {};
                Rs.apply(this.state[mc][sc], {
                    defaultFlag : df,
                    stateData : sd
                });
            }, this);
            if(callback && Rs.isFunction(callback)) {
                callback.call(scope || this, schemes);
            }
            this.fireEvent("load", this, schemes);
        },

        //private
        sync : function(provider, method, params) {
            Rs.Service.call({
            	url : this.url,
            	method : method,
            	params : params
            }, this.onSync, this);
        },

        // private
        onSync : function(succ) {
            if(succ != true){
                Ext.Msg.alert("提示", "操作失败");
            }
        },

        /**
         * <p>获取某模块下某方案的数据</p>
         * @param {String} module 模块名称
         * @param {String} scheme 方案名称
         * @param {Object} defualtValue 默认值
         * @return {Object}
         */
        get : function(module, scheme, defaultValue) {
            return Rs.isDefined(this.state[module])
                && Rs.isObject(this.state[module])
                && Rs.isDefined(this.state[module][scheme]) 
                ? this.state[module][scheme]
                : defaultValue;
        },

        /**
         * <p>获取某模块的所有方案</p>
         * @param {String} module
         * @return {Object}
         */
        getAll : function(module) {
            return Ext.isDefined(this.state[module])
                && Ext.isObject(this.state[module]) 
                ? this.state[module]
                : {};
        },
        
        /**
         * <p>获取某模块的默认方案<p>
         * @param {String} moduleCode
         * @return {String}
         */
        getDefaultSchemeCode : function(moduleCode) {
            var module = this.state[moduleCode], sc, s;
            if(module) {
                for(sc in module) {
                    s = module[sc];
                    if(s.defaultFlag === true) {
                        return sc;
                    }
                }
            }
        },

        /**
         * 设置某方案某模块的值
         * @param {String} module
         * @param {String} scheme
         * @param {Object} value
         */
        set : function(module, scheme, value, config) {
            !Rs.isDefined(this.state[module]) 
            ? this.state[module] = {} 
            : null;
            !Rs.isDefined(this.state[module][scheme]) 
            ? this.state[module][scheme] = {
                defaultFlag : false,
                stateData : ''
            }: null;
            this.state[module][scheme] = Rs.apply(
            	this.state[module][scheme],{ 
            		stateData : value
                });
            Rs.apply(this.state[module][scheme], config || {});
            var m = {}, 
            	s = {}, 
            	d = this.state[module][scheme];
            s[scheme] = Rs.apply(Rs.apply({}, d), {
            	stateData : Rs.encode(d.stateData)
            });
            m[module] = s;
            this.fireEvent("statechange", this, 'sync', {
            	data : m
            });
        },

        /**
         * <p>给方案重命名</p>
         * @param {String} module
         * @param {String} oldName 
         * @param {Object} newName 
         */
        rename : function(module, oldName, newName) {
            !Rs.isDefined(this.state[module]) 
            ? this.state[module] = {} : null;
            this.state[module][newName] = Ext.apply( {}, 
            	this.state[module][oldName] || {
                    defaultFlag : false,
                    stateData : ''
                });
            delete this.state[module][oldName];
            this.fireEvent('statechange', this, 'rename', {
                moduleCode : module,
                newName : newName,
                oldName : oldName
            });
        },

        /**
         * <p>设置某方案为默认方案</p>
         * @param {String} module
         * @param {String} scheme
         */
        setDefault : function(module, scheme) {
            var m = this.state[module], sc, s;
            if(m) {
            	for(sc in m) {
                    s = m[sc];
                    if(s) {
                        if(sc == scheme) {
                            s.defaultFlag = true;
                            this.fireEvent('statechange', this,
                                'setDefault', {
                                    moduleCode : module,
                                    schemeCode : scheme
                                });
                        } else {
                            s.defaultFlag = false;
                        }
                    }
                }
            }
        },

        /**
         * <p>删除某模块下的某方案</p>
         * @param {String} module
         * @param {String} scheme
         */
        clear : function(module, scheme) {
            Rs.isDefined(this.state[module])
            && Ext.isDefined(this.state[module][scheme]) 
            ? delete this.state[module][scheme] : null;
            this.fireEvent('statechange', this, 'clear', {
                moduleCode : module,
                schemeCode : scheme
            });
        },

        /**
         * <p>删除某模块下的所有方案</p>
         * @param {String} module
         */
        clearAll : function(module) {
            Rs.isDefined(this.state[module]) 
            ? delete this.state[module] : null;
            this.fireEvent('statechange', this, 'clear',{ 
            	moduleCode : module
            });
        }
    });
})();
Rs.ns("Rs.ext.state");

(function(){
	/**
	 * @class Rs.ext.state.StateManger
	 * <p>
	 *    用户偏好信息管理
	 * <p>
	 * @constructor
	 */
	Rs.ext.state.StateManager = function(){
	    var provider = new Rs.ext.state.Provider({
	    	url : '/rsc/rsclient/statemanager'
	    });
	    return {
	        /**
	         * <p>
	         * 初始化state manger。加载模块资源
	         * </p>
	         * @param {Array} modules 要初始化的模块名称
	         * @param (Function) callback 初始化回调方法
	         * @param (Object) scope
	         */
	        init : function(modules, callback, scope){
	            provider.load(modules, callback, scope);
	        },
	        
	        /**
	         * <p>设置默认的state provder</p> 
	         * @parame {Object} stateProvider
	         */
	        setProvider : function(stateProvider){
	            provider = stateProvider;
	        },

	        /**
	         * <p>获取state provder</p>
	         * @return {Provider} 
	         */
	        getProvider : function(){
	            return provider;
	        },

	        /**
	         * <p>获取指定模块和指定方案的默认值</p>
	         * @param {String} module 模块名称
	         * @param {String} scheme 该模块方案名称
	         * @param {Object} defaultValue 默认值
	         * @return {Object} 
	         */
	        get : function(module,  scheme, defaultValue){
	            return provider.get(module, scheme, defaultValue);
	        },
	        
	        /**
	         * <p>获取某模块的所有方案</p>
	         * @param {String} module 模块名称
	         * @return {Object}
	         */
	        getAll : function(module){
	            return provider.getAll(module);
	        },
	        
	        /**
	         * <p>获取方案个数</p>
	         * @param {String} moduleCode
	         * @return {Number} count the count of the schmes;
	         */
	        getSchemeCount : function(moduleCode){
	            var schemes = this.getAll(moduleCode), 
	                sc, 
	                i = 0;
	            for(sc in schemes){
	                i++;
	            }
	            return i;
	        },
	        
	        /**
	         * <p>获取某模块的默认方案</p>
	         * @param {String} module 模块名称
	         * @return {Object} the default scheme of scheme;
	         */
	        getDefaultSchemeCode : function(module){
	            return provider.getDefaultSchemeCode(module);
	        },
	        
	        /**
	         * <p>设置模块方案值</p>
	         * @param {String} module 模块名称
	         * @param {String} scheme 方案名称
	         * @param {Object} value 值
	         * @param {Object} config 默认配置
	         */
	        set : function(module, scheme, value, config){
	            provider.set(module, scheme, value, config);
	        },
	       
	        /**
	         * <p>重命名方案</p>
	         * @param {String} module 模块名称
	         * @param {String} oldName 原名称
	         * @param {Object} newName 新名称
	         */
	        rename : function(module, oldName, newName){
	            provider.rename(module, oldName, newName);
	        },
	        
	        /**
	         * <p>设置默认方案</p>
	         * @param {String} module 模块名称
	         * @param {String} scheme 方案名称
	         */
	        setDefault : function(module, scheme){
	            provider.setDefault(module, scheme);
	        },
	        
	        /**
	         * <p>删除某个模块的某个方案</p>
	         * @param {String} module 模块名称
	         * @param {String} scheme 方案名称
	         */
	        clear : function(module, scheme){
	            provider.clear(module, scheme);
	        },
	        
	        /**
	         * <p>删除某模块下的所有方案</p>
	         * @param {String} module 模块名称
	         */
	        clearAll : function (moduel){
	            provider.clearAll(module);
	        }
	    };
	}();
})();
Rs.ns("Rs.ext.state");
(function() {
	/**
	 * @class Rs.ext.state.StatePlugin
	 * <p>用户偏好信息插件</p>
	 * extends  Ext.util.Observable
	 * @constructor
	 * @param {Object} config
	 */
    Rs.ext.state.StatePlugin = function(config) {
        Ext.apply(this, config);
        Rs.ext.state.StatePlugin.superclass.constructor.call(this);
        this.addEvents(
        /**
         * @event beforestaterestore Fires before the state of the
         *        component is restored. Return false from an event
         *        handler to stop the restore.
         * @param {Rs.ext.state.StatePlugin} this
         * @param {Object} scheme
         */
        'beforestaterestore',
        /**
         * @event staterestore Fires after the state of the component is
         *        restored.
         * @param {Rs.ext.state.StatePlugin} this
         * @param {Object}
         *            state The hash of state values returned from the
         *            StateProvider. This is passed to <b><tt>applyState</tt></b>.
         *            By default, that simply copies property values
         *            into this Component. The method maybe overriden to
         *            provide custom state restoration.
         */
        'staterestore',
        /**
         * @event beforestatesave Fires before the state of the
         *        component is saved to the configured state provider.
         *        Return false to stop the save.
         * @param {Rs.ext.state.StatePlugin} this
         * @param {String} stateId
         * @param {String} schemeCode
         * @param {Object} state
         */
        'beforestatesave',
        /**
         * @event statesave Fires after the state of the component is
         *        saved to the configured state provider.
         * @param {Rs.ext.state.StatePlugin} this
         * @param {String} stateId
         * @param {String} schemeCode
         * @param {Object} state
         */
        'statesave' ,
        
        /**
         * @event stateload 方案后台数据返回后,触发.
         * @param {Rs.ext.state.StatePlugin} this
         * @param {Object} state
         */
        'stateload');
        
        if(Rs.ext.state.StateManager
            && this.scheme !== false
            && Rs.isNumber(this.scheme)) {
            this.button = new Ext.SplitButton( {
                xtype : 'splitbutton',
                iconCls : 'rs-action-scheme',
                text : '创建方案',
                handler : this.createScheme,
                scope : this,
                menu : this.stateManagerMenu = new Ext.menu.Menu()
            });
            Rs.ext.state.StateManager.getProvider().on('statechange',
                this.syncStateMangerMenu, this, {
                    single : true,
                    delay : 25
            });
            this.stateManagerMenu.on('beforeshow', this.syncStateMangerMenu, this);
        }
    };
    
    Ext.extend(Rs.ext.state.StatePlugin, Ext.util.Observable, {
        /**
         * @cfg {Boolean/Number} scheme 
         * <p>如果为false表示该插件不支持保存多个方案,
         *    只有一个用户偏好信息。 如果为数字类型则表示可保存的方案的个数,默认方案数位10 
         * </p>
         */
        scheme : 10,
        /**
         * @cfg {String} schemeMsg
         * <p>提示语</p>
         */
        schemeMsg : '您不能再创建方案, 最多创建{0}个方案',
        /**
         * <p>初始化方法</p>
         * @param {Component} comp
         */
        init : function(c) {
            this.comp = c;
            this.stateId = this.comp.getStateId();
            this.initStateEvents();
            this.initState();
        },
        /**
         * <p>获取stateId</p>
         * @return {String} stateId the stateId of the component;
         */
        getStateId : function() {
            return this.stateId;
        },

        // private
        initStateEvents : function() {
            if(this.comp.stateEvents) {
                for( var i = 0, e; e = this.comp.stateEvents[i]; i++) {
                    this.comp.on(e, this.saveScheme, this, { 
                    	delay : 100
                    });
                }
            }
        },

        // private
        initState : function() {
            if(Rs.ext.state.StateManager) {
                var stateId = this.getStateId(), 
                    sc,
                    scheme;
                if(stateId){
                    Rs.ext.state.StateManager.init(stateId, function() {
                        sc = Rs.ext.state.StateManager.getDefaultSchemeCode(stateId);
                        this.fireEvent('stateload', this, sc);
                        if(sc) {
                            scheme = Rs.ext.state.StateManager.get(stateId, sc);
                            if(scheme 
                            	&& this.fireEvent('beforestaterestore', this, scheme) !== false) {
                                this.applyScheme(sc, scheme);
                                this.fireEvent('staterestore', this, scheme);
                            }
                        }
                    }, this);
                }
            }
        },

        // private
        createScheme : function() {
            var stateId = this.getStateId(),
                c = Rs.ext.state.StateManager.getSchemeCount(stateId);
            if((Rs.isNumber(this.scheme) && this.scheme > c)
                || this.scheme === true) {
                Ext.Msg.prompt('创建方案', '请输入方案名称', function(btn, text) {
                    if(btn == 'ok' && !Rs.isEmpty(text, false) && text.length <= 30) {
                        if(Rs.isNumber(this.scheme)) {
                            this.currentSchemeCode = text;
                            this.saveScheme();
                        }
                    }
                }, this);
            } else {
                Ext.Msg.alert("提示", String.format(this.schemeMsg, c));
            }
        },

        // private
        saveScheme : function() {
            if(Rs.ext.state.StateManager) {
                var stateId = this.getStateId(), 
                    schemeCode = this.currentSchemeCode || this.getStateId(), 
                    config = this.scheme != false ? null : { 
                	    defaultFlag : true
                	};
                if(stateId) {
                    var state = this.comp.getState();
                    if(this.fireEvent('beforestatesave', this, stateId,
                        schemeCode, state) !== false) {
                        Rs.ext.state.StateManager.set(stateId, schemeCode, state, config);
                        this.fireEvent('statesave', this, stateId, schemeCode, state);
                    }
                }
            }
        },

        // private
        applyScheme : function(schemecode, scheme) {
            this.currentSchemeCode = schemecode;
            if(scheme && scheme.stateData) {
                this.comp.applyState(scheme.stateData);
            }
        },

        // private
        renameScheme : function(schemeCode) {
            Ext.Msg.prompt('提示', '请输入新名称', function(btn, text) {
                if(btn == 'ok') {
                    if(schemeCode != text && !Rs.isEmpty(text, false)
                        && text.length <= 30) {
                        var stateId = this.getStateId();
                        if(this.currentSchemeCode == schemeCode) {
                            this.currentSchemeCode = text;
                        }
                        Rs.ext.state.StateManager.rename(stateId, schemeCode, text);
                    }
                }
            }, this, false, schemeCode);
        },

        // private
        setDefaultScheme : function(schemeCode) {
            var stateId = this.getStateId();
            if(stateId && schemeCode){
            	Rs.ext.state.StateManager.setDefault(stateId, schemeCode);	
            }
        },

        // private
        deleteScheme : function(schemeCode) {
            Ext.Msg.show( {
                title : '提示',
                msg : '您确定要删除该方案吗?',
                buttons : Ext.Msg.YESNO,
                fn : function(btn) {
                    if(btn === 'yes') {
                        var stateId = this.getStateId();
                        if(stateId && schemeCode){
                        	Rs.ext.state.StateManager.clear(stateId, schemeCode);	
                        }
                    }
                },
                animEl : 'elId',
                icon : Ext.MessageBox.QUESTION,
                scope : this
            });
        },

        // private
        syncStateMangerMenu : function() {
            var stateId = this.getStateId(), 
                module = Rs.ext.state.StateManager.getAll(stateId), 
                sc, 
                s, 
                cs, 
                df;
            this.stateManagerMenu.removeAll();
            for(sc in module) {
                s = module[sc];
                cs = (this.currentSchemeCode === sc);
                df = (s.defaultFlag === true);
                this.stateManagerMenu.add( {
                    text : sc,
                    cls : (df ? "rs-state-default-scheme" : "") + (cs ? " rs-state-current-scheme" : ""),
                    handler : this.applyScheme.createDelegate(this, [sc, Rs.ext.state.StateManager.get(stateId, sc)]),
                    scope : this,
                    menu : new Ext.menu.Menu( { items : [{
	                        text : '应用',
	                        disabled : cs ? true : false,
	                        handler : this.applyScheme.createDelegate(this,[sc, Rs.ext.state.StateManager.get(stateId, sc)]),
	                        scope : this
	                    }, {
	                        text : '重命名',
	                        handler : this.renameScheme.createDelegate(this, [sc]),
	                        scope : this
	                    }, {
	                        text : '设为默认',
	                        disabled : df ? true : false,
	                        handler : this.setDefaultScheme.createDelegate(this, [sc]),
	                        scope : this
	                    }, {
	                        text : '保存',
	                        disabled : cs ? false : true,
	                        handler : this.saveScheme,
	                        scope : this
	                    }, {
	                        text : '删除',
	                        handler : this.deleteScheme.createDelegate(this, [sc]),
	                        scope : this
	                    } ]
                   })
               });
           }
           return this.stateManagerMenu.items.length >= 1;
        }
    });
})();
Ext.ns("Rs.ext.query");

(function() {
    /**
     * @class Rs.ext.query.QueryPanel <p>查询面板</p>
     * @extends Ext.Panel
     * @constructor
     * @param {Object} config
     */
    Rs.ext.query.QueryPanel = function(config) {
        Ext.apply(this, config || {
            layout : 'column'
        });
        if(this.isPop){
            this.bbar = new Ext.Toolbar({items : ['->']});
        }
        
        this.editors = {};
        
        Rs.ext.query.QueryPanel.superclass.constructor.call(this, config);
        this.addEvents(
        /**
         * @event beforeselectcondition 
         * @param {Rs.ext.query.Condition} condition 
         * @param {Object} filter
         */
        'beforeselectcondition',
        /**
         * @event selectcondition
         * @param {Rs.ext.query.Conditon} conditon
         * @param {Object} filter
         */
        'selectcondition',
        /**
         * @event beforeunselectcondition 
         * @param {Rs.ext.qeury.Conditon} conditon
         * @param {Object} filter
         */
        'beforeunselectcondition',
        /**
         * @event unselectcondition 
         * <p>删除某个查询条件后，触发该事件</p>
         * @param {Rs.ext.qeury.Conditon} conditon
         * @param {Object} filter
         */
        'unselectcondition',
        /**
         * @event beforequery 
         * <p>查询之前执行触发该事件，如果监听该事件的回调方法返回false 则终止该操作</p>
         * @param {Rs.ext.query.QueryPanel} queryPanel
         * @param {Object} params 
         */
        'beforequery',
        /**
         * @event query 
         * <p>查询</p>
         * @param {Rs.ext.query.QueryPanel} queryPanel
         * @param {Object} params
         */
        'query',
        /**
         * @event reset 
         * <p>重置</p>
         * @param {Rs.ext.query.QueryPanel} queryPanel
         */
        'reset');
        
        this.on('resize', function(){
            if(this.ownerCt){
                this.ownerCt.doLayout();
            }
        },this, {delay: 10});
    };

    Ext.extend(Rs.ext.query.QueryPanel, Ext.Panel, {

        /**
         * @cfg {Boolean} animCollapse
         */
        animCollapse : false,
        
        /**
         * @cfg {Boolean} isPop
         * 是否为弹出式, 默认为false
         */
        isPop : false,
        
        bodyCfg : {
                cls : 'rs-query-panel-body'
            },
            
        // private
        bodyStyle : 'padding:5px;',

        // private
        cls : 'rs-query-panel',

        /**
         * @cfg {Boolean} autoHeight
         */
        autoHeight : true,

        /**
         * @cfg {Boolean} autoScroll
         */
        autoScroll : true,

        /**
         * @cfg {Object} defaults
         */
        defaults : { 
            border : false
        },

        // private
        layout : 'column',
        
        
        // override
        initComponent : function() {
            Rs.ext.query.QueryPanel.superclass.initComponent.call(this);
            this.addActionsButtons();
            if(Ext.isArray(this.conditions)) {
                var conds = this.conditions;
                for(var i = 0; i < conds.length; i++){
                    if(conds[i].editor){
                        this.addConditionToPanel(conds[i]);
                        this.addConditionToMenu(conds[i], !conds[i].hidden);
                    }
                }
            }
        },
        
        addConditionToPanel : function(c){
            var addflag = false;
            if(this.items){
                this.items.each(function(item){
                    if(item.dataIndex == c.dataIndex){
                        item.show();
                        try {
                        	this.syncSize();
                        } catch(e) {
                        	
                        }
                        addflag = true;
                        return false;
                    }
                },this);
                if(addflag){
                    return;
                }
            }
            var editor = {};
            if(!c.editor.isXType){
                editor = Ext.create(Ext.apply(c.editor || {}, {
                    fieldLabel : c.header,
                    labelStyle: 'text-align:right;',
                    width : 120
                }), 'textfield');
            } else{
                editor = Ext.apply(c.editor, {
                    labelStyle: 'text-align:right;',
                    fieldLabel : c.header,
                    width : 120
                });
            }
            this.editors[c.dataIndex] = editor.id;
            this.add({
                layout : 'form',
                bodyCfg : {cls : 'rs-query-panel-body'},
                width : 230 ,
                dataIndex : c.dataIndex,
                hidden : c.hidden,
                items : [editor]});
            if(this.rendered){
                this.syncSize();
            }
        },
        
        getEditor : function(index){
            return this.findById(this.editors[index]);
        },
        
        removeConditionFromPanel : function(index){
            this.items.each(function(item){
                if(item.dataIndex == index){
                    item.hide();
                    this.syncSize();
                    return false;
                }
            },this);
        },

        // private
        addActionsButtons : function() {
            var tb = this.getBottomToolbar() || this.getTopToolbar() || this;
            tb.addButton( {
                iconCls : 'rs-action-condition',
                text : '条件',
                scope : this,
                menu : this.addConditonMenu = new Ext.menu.Menu()
            });
            tb.addButton({
                iconCls : 'rs-action-reset',
                text : '重置',
                handler : this.resetConditions,
                scope : this
            });
            tb.addButton( {
                iconCls : 'rs-action-query',
                text : '查询',
                handler : this.doQuery,
                scope : this
            });
        },

        // private
        addConditionToMenu : function(condition, checked) {
            if(!condition){
                return;
            }
            var item = this.addConditonMenu.add({
                text : condition.header || condition.dataIndex,
                dataIndex : condition.dataIndex,
                condition : condition,
                checked : checked,
                hideOnClick : false,
                handler : this.onConditionMenuClick,
                scope : this
            });
        },

        onConditionMenuClick : function(item, e){
            if(item.checked){
                this.removeConditionFromPanel(item.dataIndex);
                this.fireEvent('unselectcondition', this ,item );
            } else{
                this.addConditionToPanel(item.condition);
                this.fireEvent('selectcondition', this ,item);
            }
        },

        // private
        resetConditions : function() {
            this.items.each(function(item) {
                item.items.items[0].reset();
            }, this);
            if(this.store){
                this.store.load();
            }
            this.fireEvent('reset', this);
        },

        /**
         * <p>绑定到Store.用户表格等使用Store的控件查询</p>
         * @param {Store} store
         */
        bindStore : function(store, queryCallback, queryScope) {
            this.store = store;
            this.queryCallback = queryCallback;
            this.queryScope = queryScope;
        },

        /**
         * <p>绑定到节点.用于树的查询</p>
         * @param {Node} node
         */
        bindNode : function(node) {
            this.node = node;
        },
        
        /**
         * <p>绑定到GeneralselPanel.用于GeneralselPanel的查询</p>
         * @param {GeneralselPanel} panel
         */
        bindGeneralselPanel : function(panel) {
            this.gPanel = panel;
        },

        /**
         * <p>获取查询条件</p>
         * @return {Object} params
         */
        getParams : function() {
            var params = {};
            this.items.each(function(item){
                if(!item.hidden){ //如果是隐藏的条件则不读取他的值
                    var v = item.items.items[0].getValue() ;
                        if(!Ext.isEmpty(v)){
                        params[item.dataIndex] = v;
                    }
                }
            },this) ;
            return params;
        },

        /**
         * <p>执行查询</p>
         */
        doQuery : function() {
            if(!this.preDoQuery()) {
                return;
            }
            var params = this.getParams();
            if(params && this.fireEvent("beforequery", this, params) !== false) {
                if(this.store) {
                    if(this.queryCallback){
                        var param = this.getSQL(params);
                        this.queryCallback.call(this.queryScope, param);
                    } else{
                        Ext.apply(params, this.store.baseParams || this.grid.store.baseParams || {});
                        this.store.load( { 
                            params : params
                        });
                    }
                } else if(this.grid && this.grid.store){
                    if(this.queryCallback){
                        var param = this.getSQL(params);
                        this.queryCallback.call(this.queryScope, param);
                    } else{
                        Ext.apply(params, this.grid.store.baseParams || {});
                        params.metaData.start = 0 ;
                        this.grid.store.load( { 
                            params : params
                        });
                    }
                }  else if(this.node) {
                    //删除上次查询时给绑定的节点添加的baseParams参数
                    if(this.nodeBaseParams) {
                        var p = this.nodeBaseParams, 
                            l = this.node.getLoader().baseParams,
                            i;
                        for(i in p) {
                            l[i] ? delete l[i] : null;
                        }
                    }
                    this.node.collapse(true);
                    while (this.node.firstChild) {
                        this.node.removeChild(this.node.firstChild, true);
                        var a = this ;
                    }
                    this.node.loaded = false;
                    this.node.loading = -1;
                    
                    //将查询条件添加到node的baseParams中
                    Ext.apply(this.node.getLoader().baseParams, params);
                    this.node.expand(false, false);
                    
                    //将此次查询的查询条件记录在nodeBaseParams中
                    this.nodeBaseParams = params;
                } 
                this.fireEvent("query", this, params);
            }
        },
        
        /**
         * <p>获取sql查询条件</p>
         * @param {Object} params
         * @return {String} 
         */
        getSQL : function(params){
            var condition = [];
            for(var p in params){
                condition.push(p + " like '" + params[p] + "%'");
            }
            return condition.join(' AND ');
        },
        
        // private
        preDoQuery : function() {
            var v = true;
            this.items.each(function(item) {
                return v = item.items.items[0].validate();
            }, this);
            return v;
        },

        // private
        applyState : function(state) {
            if(state && state.conditions) {
                this.resetConditions();//需要先将上一个方案的条件去掉
                this.addConditonMenu.items.each(function(item){
                    if(state.conditions[item.dataIndex]!==undefined){ 
                        item.setChecked(true);
                        this.addConditionToPanel(item.condition);
                    }else{
                        item.setChecked(false);
                        this.removeConditionFromPanel(item.dataIndex);
                    }
                },this);
                this.setValue(state.conditions); //lulu 0627
            }
        },

        setValue : function(vobject){
            for(var p in vobject){
                this.findById(this.editors[p]).setValue(vobject[p]);
            }
        },

        // private
        getState : function() {
            var o = { 
                    conditions : {}
                }, 
                i = 0;
            this.addConditonMenu.items.each(function(item){
                if(item.checked){
                    o.conditions[item.dataIndex] = this.findById(this.editors[item.dataIndex]).getValue();
                }
            },this);
            return o; 
        },

        // private override
        destroy : function() {
            Rs.ext.query.QueryPanel.superclass.destroy.apply(this, arguments);
            //this.queryConditionModel.destroy();
        }
        
    });
    
    Ext.ComponentMgr.registerType("rs-ext-querypanel", Rs.ext.query.QueryPanel);
})();
Ext.ns("Rs.ext.tree");
(function(){
	/**
	 * @class Rs.ext.tree.TreeLoader
	 * <p>该类继承自Ext.tree.TreeLoader并使用Rs.Services.call从后台获取数据。
	 * dataUrl或url 为获取数据的url
	 * method 为返回数据的后台业务方法名称
	 * getParams 返回要传入后台的参数</p>
	 * @extends Ext.tree.TreeLoader
	 * @constructor
	 * Creates a new Treeloader.
	 * @param {Object} config A config object containing config properties.
	 */
	Rs.ext.tree.TreeLoader = function(config){
	    Ext.apply(this, config);
	    Rs.ext.tree.TreeLoader.superclass.constructor.call(this);
	};

	Rs.extend(Rs.ext.tree.TreeLoader, Ext.tree.TreeLoader, {
		
		/**
		 * @cfg {String} method defualt load
		 * <p>从服务器获取数据的业务方法名称, 默认为load</p>
		 */
		method : 'load',
		
		/**
		 * @cfg {String} nodeAttrsParams
		 * <p>
		 * 要传递到后台的node.attributes的属性名称
		 * </p>
		 */
		
		/**
		 * <p>获取参数</p>
		 * @param {Node} node
		 * @return {Object} params
		 */
		getParams : function(node){
			var params = Rs.ext.tree.TreeLoader.superclass.getParams.call(this, node),
				naps = [];
			if(Ext.isString(this.nodeAttrsParams)){
				naps.push(this.nodeAttrsParams);
			}else if(Ext.isArray(this.nodeAttrsParams)){
				Ext.each(this.nodeAttrsParams, function(p){
					if(Ext.isString(p)){
						naps.push(p);
					}
				}, this);
			}
			return Ext.copyTo(params || {}, node.attributes, naps);
		},
		
		//private
		requestData : function(node, callback, scope){
		    if(this.fireEvent("beforeload", this, node, callback) !== false){
		        if(this.directFn){
		            var args = this.getParams(node);
		            args.push(this.processDirectResponse.createDelegate(this, [{callback: callback, node: node, scope: scope}], true));
		            this.directFn.apply(window, args);
		        }else{
		            this.transId = Rs.Service.call({
		                method:this.method,
		                url: this.dataUrl||this.url,
		                callback: this.handleResponse,
		                scope: this,
		                argument: {callback: callback, node: node, scope: scope},
		                params: this.getParams(node)
		            });
		        }
		    }else{
		        this.runCallback(callback, scope || node, []);
	    	}
		},
		
	    handleResponse : function(response, succ, options){
	        if(succ === false){
	        	this.handleFailure(response);
	        }else {
	    		this.transId = false;
	            var a = response.argument;
	            this.processResponse(response, a.node, a.callback, a.scope);
	            this.fireEvent("load", this, a.node, response);        	
	        }
	    }

	});
})();
Ext.ns('Rs.ext.tree');

(function() {
	/**
	 * @class Rs.ext.tree.PagingTreeLoader
	 * <p>分页树Loader</p>
	 * @extends Ext.tree.TreeLoader
	 * <pre><code>
	the response node json eg: 
	{ 
	    childTotal : 89,
	    nodes : [{
	        id: 1, 
	        name : 'node-1'
	    }, {
	        id : 2, 
	        name : 'node-2'}
	    ]}
	}
	 * </code></pre> 
	 * @constructor
	 * @param {Object} config
	 */
	Rs.ext.tree.PagingTreeLoader = function(config) {
		Ext.apply(this, config || {});
		// private 如果要递增的添加子项节点条目，则clearOnLoad 必须设为false
		this.clearOnLoad = false;
        Rs.ext.tree.PagingTreeLoader.superclass.constructor.call(this, config);
	};

	Ext.extend(Rs.ext.tree.PagingTreeLoader, Rs.ext.tree.TreeLoader, {

		/**
		 * @cfg {Number} pageSize default 20
		 * <p>每页显示节点条数</p>
		 */
		pageSize : 20,

		/**
		 * @cfg {String} moreNodeName;
		 * <p>更多节点名称</p>
		 */
		moreNodeName : "",
		
		/**
		 * @param {Node} node
		 * @return {Object}
		 */
		getParams : function(node){
			var params = Rs.ext.tree.PagingTreeLoader.superclass.getParams.call(this, node),
			    pi = {
					start : 0,
					limit : this.pageSize
				},
				moreNode = node.lastChild;
			if(moreNode != undefined && moreNode.isMoreNode === true ){
				pi = moreNode.getPagingInfo();
			}
			return Ext.apply(params, pi);
	    },
		
		/**
		 * <p>
		 * Override the method of Ext.tree.TreeLoader update the
		 * childTotal of parent node
		 * </p>
		 * @param {Object} response
		 * @param {Node} node
		 * @param {Function} callback
		 * @param {Object} scope
		 */
		processResponse : function(response, node, callback, scope) {
			var json = response.responseText;
			try {
				var data = response.responseData || Ext.decode(json), 
					nc = data.nodes || [];
				node.beginUpdate();
				// 获取moreNode
				var moreNode = this.getMoreNode(node, data);
				for ( var i = 0, len = nc.length; i < len; i++) {
					var n = this.createNode(nc[i]);
					if (n) {
						node.appendChild(n);
					}
				}
				// 如果有moreNode 则装载该moreNode, 并设置分页信息
				if(moreNode != undefined){
					moreNode.setChildrenInfo({
						childTotal : data.childTotal || node.childNodes.length,
						childCount : node.childNodes.length
					});
					node.appendChild(moreNode);
				}
				node.endUpdate();
				this.runCallback(callback, scope || node, [ node ]);
			} catch (e) {
				this.handleFailure(response);
			}
		},

		// private
		// 如果需要，返回moreNode
		getMoreNode : function(node, data) {
			var nc = data.nodes || [],
		    	ct = data.childTotal || nc.length,
		    	moreNode = node.lastChild;
			/*
			 * 如果最后一个节点是moreNode,则将最有一个节点卸载 
			 */
			if(moreNode != undefined){
				if(moreNode.isMoreNode === true ){
					node.removeChild(moreNode, false);
				}else {
					moreNode = undefined;
				}
			}
			/*
			 * 如果子项总数大于 当前子项个数 与本次加载的子项个数之和，
			 * 表明后台仍有子项未加载,返回一个moreNode
			 */
			if (ct > node.childNodes.length + nc.length){
				if(moreNode == undefined){
					moreNode = this.createVirtualMoreNode(node);
				}
				return moreNode;
			}
		},

		//private
		createVirtualMoreNode : function(node) {
			var attr = {}, a;
			for (a in node.attributes) {
				attr[a] = undefined;
			}
			return new Rs.ext.tree.PagingTreeMoreNode(Ext.apply(attr, {
				text : this.moreNodeName,
				leaf : true
			}));
		}
	});
})();
(function(){
	/**
	 * @class Rs.ext.tree.PagingTreeMoreNodeUI
	 * @extends Ext.tree.TreeNodeUI
	 */
	Rs.ext.tree.PagingTreeMoreNodeUI = Ext.extend(Ext.tree.TreeNodeUI, {
		
		 // private
	    onChilrenInfoChange : function(node, text, oldText){
	        if(this.rendered){
	        	this.childrenInfo.innerHTML = text;
	        }
	    },
		
		// Override
		renderElements : function(n, a, targetNode, bulkRender) {
			this.indentMarkup = n.parentNode ? n.parentNode.ui.getChildIndent() : '';
			/**
			 * add some indent caching, this helps performance when
			 * rendering a large tree
			 */
			var nel,
				href = this.getHref(a.href), 
				buf = [
					'<li class="x-tree-node">',
					'<div ext:tree-node-id="',
					n.id,
					'" class="x-tree-node-el x-tree-node-leaf x-unselectable ',
					a.cls,
					'" unselectable="on">',
					'<span class="x-tree-node-indent">',
					this.indentMarkup,
					"</span>",
					'<img alt="" src="',
					this.emptyIcon,
					'" class="x-tree-ec-icon x-tree-elbow" />',
					'<span class="x-tree-more-node x-tree-more-node-achor" unselectable="on"></span>',
					'<span ext:qtip="加载下一页数据" class="x-tree-more-node x-tree-more-node-icon" unselectable="on"></span>',
					'<span ext:qtip="加载所有数据" class="x-tree-more-node x-tree-more-node-all-icon" unselectable="on"></span>',
					'<a hidefocus="on" class="x-tree-node-anchor" href="', href, '" tabIndex="1" ',
					a.hrefTarget ? ' target="' + a.hrefTarget + '"' : "",
					'><span unselectable="on">', 
					n.text,
					"</span></a>",
					'<span unselectable="on">',
					n.childrenInfoMsg,
					"</span>",
					"</div>",
					'<ul class="x-tree-node-ct" style="display:none;"></ul>',
					"</li>" ].join('');

			if (bulkRender !== true && n.nextSibling && (nel = n.nextSibling.ui.getEl())) {
				this.wrap = Ext.DomHelper.insertHtml("beforeBegin", nel, buf);
			} else {
				this.wrap = Ext.DomHelper.insertHtml("beforeEnd", targetNode, buf);
			}
			this.elNode = this.wrap.childNodes[0];
			this.ctNode = this.wrap.childNodes[1];
			var cs = this.elNode.childNodes;
			this.indentNode = cs[0];
			this.ecNode = cs[1];
			this.iconNode = cs[2];
			this.moreNode = Ext.fly(cs[3]);
			this.moreNode.on("click", function() {
				this.node.appendPagingNodes();
			}, this);
			this.moreAllNode = Ext.fly(cs[4]);
			this.moreAllNode.on("click", function() {
				this.node.appendAllPagingNodes();
			}, this);
			this.anchor = cs[5];
			this.textNode = cs[5].firstChild;
			this.childrenInfo = cs[6];
		}
	});
	
	/**
	 * @class Rs.ext.tree.PagingTreeMoreNode
	 * <p>虚拟节点，名称显示为"更多"，点击该虚拟节点展开其父项节点的更多子节点。</p>
	 * @extend Ext.tree.TreeNode
	 * @constructor
	 * @param {Object} config
	 */
	Rs.ext.tree.PagingTreeMoreNode = function(config) {
		Ext.apply(this, config || {});
		Rs.ext.tree.PagingTreeMoreNode.superclass.constructor.apply(this, arguments);
	};
	Ext.extend(Rs.ext.tree.PagingTreeMoreNode, Ext.tree.TreeNode, {

		// is virtual
		isMoreNode : true,
		
		/**
		 * @cfg {NodeUI} defultUI
		 * the ui of node
		 */
		defaultUI : Rs.ext.tree.PagingTreeMoreNodeUI,

		//private
		childrenInfoMsg : "",

		/**
		 * @cfg {String} displayChildrenInfo
		 * <p>显示分页信息</p>
		 */
		displayChildrenInfo : '当前显示{0}个,共{1}个',
		
		/**
		 * <p>
		 * 设置子项信息，分页信息包含两项内容：
		 * childTotal : 实际子项总数,
		 * childCount : 当前子项总数
		 * </p>
		 * @param {Object} childrenInfo
		 */
		setChildrenInfo : function(chindrenInfo) {
			this.childrenInfo = chindrenInfo;
			this.childrenInfoMsg = String.format(this.displayChildrenInfo, 
				chindrenInfo.childCount, 
				chindrenInfo.childTotal);
			this.ui.onChilrenInfoChange(this, this.childrenInfoMsg);
		},
		
		setPagingInfo : function(pagingInfo){
			this.pagingInfo = pagingInfo;
		},
		
		getPagingInfo : function(){
			return this.pagingInfo;
		},
		
		// private
		appendPagingNodes : function() {
			var owner = this.getOwnerTree();
			loader = owner && owner.loader ? owner.loader : null;
			this.setPagingInfo({
				start : this.childrenInfo.childCount,
				limit : loader ? loader.pageSize : 20
			});
			this.onAppendPagingNodes();
		},

		// private
		appendAllPagingNodes : function() {
			var ct = this.childrenInfo.childTotal,
				cc = this.childrenInfo.childCount;
			this.setPagingInfo({
				start : cc,
				limit : ct - cc
			});
			this.onAppendPagingNodes();
		}, 
		
		//private
		onAppendPagingNodes : function(){
			var PN = this.parentNode;
			if(PN){
				PN.childrenRendered = true;
				PN.loaded = false;
				PN.expand(false, false);
			}
		}
	});

})();
Ext.ns("Rs.ext.data");

(function(){
	
	/**
	 * @class Rs.ext.data.Proxy
	 * @extends Ext.data.DataProxy 
	 */
	Rs.ext.data.Proxy = function(conn){
		this.serviceUrl = {
			read : conn.readUrl || conn.url,
			create : conn.createUrl || conn.url,
			update : conn.updateUrl || conn.url,
			destroy : conn.destroyUrl || conn.url
		};
		this.serviceMethod = {
			read : conn.readMethod || 'read',
			create : conn.createMethod || 'create',
			update : conn.updateMethod || 'update',
			destroy : conn.destroyMethod || 'destroy'
		};
		delete conn.readUrl;
		delete conn.readMethod;
		delete conn.createUrl;
		delete conn.createMethod;
		delete conn.updateUrl;
		delete conn.updateMethod;
		delete conn.destroyUrl;
		delete conn.destroyMethod;
		this.useAjax = !conn || !conn.events;
		Rs.ext.data.Proxy.superclass.constructor.call(this, conn);
	    // A hash containing active requests, keyed on action [Ext.data.Api.actions.create|read|update|destroy]
	    var actions = Ext.data.Api.actions;
	    this.activeRequest = {};
	    for (var verb in actions) {
	        this.activeRequest[actions[verb]] = undefined;
	    }
	    this.service = new Rs.data.Service({
	        autoAbort : false
	    });
	};
	
	Ext.extend(Rs.ext.data.Proxy, Ext.data.DataProxy, {
		
		api : {
			read : 'read',
			update : 'update',
			create : 'create',
			destroy : 'destroy'
		},
		
	    doRequest : function(action, rs, params, reader, cb, scope, arg) {
	        var  o = {
	        	url : this.serviceUrl[action],
	        	method : this.serviceMethod[action],
	            request: {
	                callback : cb,
	                scope : scope,
	                arg : arg
	            },
	            params : {
            	    params : params || params.jsonData || params.xmlData || {} 
                },
	            reader: reader,
	            callback : this.createCallback(action, rs),
	            scope: this
	        };
            if (this.activeRequest[action]) {
                //this.service.abort(this.activeRequest[action]);
            }
            this.activeRequest[action] = this.service.call(o);
	    },

	    /**
	     * Returns a callback function for a request.  Note a special case is made for the
	     * read action vs all the others.
	     * @param {String} action [create|update|delete|load]
	     * @param {Ext.data.Record[]} rs The Store-recordset being acted upon
	     * @private
	     */
	    createCallback : function(action, rs) {
	        return function(success, result, ec, em, data, o, response) {
	            this.activeRequest[action] = undefined;
	            if (!success) {
	                if (action === Ext.data.Api.actions.read) {
	                    // @deprecated: fire loadexception for backwards compat.
	                    // TODO remove
	                    this.fireEvent('loadexception', this, o, response, ec, em, data);
	                }
	                this.fireEvent('exception', this, 'response', action, o, response, ec, em, data);
	                o.request.callback.call(o.request.scope, null, o.request.arg, false);
	                return;
	            }
	            if (action === Ext.data.Api.actions.read) {
	                this.onRead(action, o, result);
	            } else {
	                this.onWrite(action, o, result, rs);
	            }
	        };
	    },

	    /**
	     * Callback for read action
	     * @param {String} action Action name as per {@link Ext.data.Api.actions#read}.
	     * @param {Object} o The request transaction object
	     * @param {Object} res The server response
	     * @fires loadexception (deprecated)
	     * @fires exception
	     * @fires load
	     * @protected
	     */
	    onRead : function(action, o, response) {
	        var result;
	        try {
	            result = o.reader.read(response);
	        }catch(e){
	            // @deprecated: fire old loadexception for backwards-compat.
	            // TODO remove
	            this.fireEvent('loadexception', this, o, response, e);

	            this.fireEvent('exception', this, 'response', action, o, response, e);
	            o.request.callback.call(o.request.scope, null, o.request.arg, false);
	            return;
	        }
	        if (result.success === false) {
	            // @deprecated: fire old loadexception for backwards-compat.
	            // TODO remove
	            this.fireEvent('loadexception', this, o, response);

	            // Get DataReader read-back a response-object to pass along to exception event
	            var res = o.reader.readResponse(action, response);
	            this.fireEvent('exception', this, 'remote', action, o, res, null);
	        }
	        else {
	            this.fireEvent('load', this, o, o.request.arg);
	        }
	        // TODO refactor onRead, onWrite to be more generalized now that we're dealing with Ext.data.Response instance
	        // the calls to request.callback(...) in each will have to be made identical.
	        // NOTE reader.readResponse does not currently return Ext.data.Response
	        o.request.callback.call(o.request.scope, result, o.request.arg, result.success);
	    },
	    /**
	     * Callback for write actions
	     * @param {String} action [Ext.data.Api.actions.create|read|update|destroy]
	     * @param {Object} trans The request transaction object
	     * @param {Object} res The server response
	     * @fires exception
	     * @fires write
	     * @protected
	     */
	    onWrite : function(action, o, response, rs) {
	        var reader = o.reader;
	        var res;
	        try {
	            res = reader.readResponse(action, response);
	        } catch (e) {
	            this.fireEvent('exception', this, 'response', action, o, response, e);
	            o.request.callback.call(o.request.scope, null, o.request.arg, false);
	            return;
	        }
	        if (res.success === true) {
	            this.fireEvent('write', this, action, res.data, res, rs, o.request.arg);
	        } else {
	            this.fireEvent('exception', this, 'remote', action, o, res, rs);
	        }
	        // TODO refactor onRead, onWrite to be more generalized now that we're dealing with Ext.data.Response instance
	        // the calls to request.callback(...) in each will have to be made similar.
	        // NOTE reader.readResponse does not currently return Ext.data.Response
	        o.request.callback.call(o.request.scope, res.data, res, res.success);
	    },

	    // inherit docs
	    destroy: function(){
	        if(!this.useAjax){
	            this.conn.abort();
	        }else if(this.activeRequest){
	            var actions = Ext.data.Api.actions;
	            for (var verb in actions) {
	                if(this.activeRequest[actions[verb]]){
	                    Rs.Service.abort(this.activeRequest[actions[verb]]);
	                }
	            }
	        }
	        Rs.ext.data.Proxy.superclass.destroy.call(this);
	    }
		
	});
	
})();
Ext.ns("Rs.ext.data");

(function(){
	
	Rs.ext.data.Reader = function(){
		Rs.ext.data.Reader.superclass.constructor.apply(this, arguments);
	};
	
	Ext.extend(Rs.ext.data.Reader, Ext.data.JsonReader, {
		
		read : function(o){
			if(!o) {
				throw {message: 'JsonReader.read: Json object not found'};
			}
			return this.readRecords(o);
		}
		
	});
	
})();
Ext.ns("Rs.ext.data");

(function(){
	/**
	 * @class Rs.ext.data.Writer
	 * @extends Ext.data.JsonWriter
	 */
	Rs.ext.data.Writer = function(){
		Rs.ext.data.Writer.superclass.constructor.apply(this, arguments);
	};
	
	Ext.extend(Rs.ext.data.Writer, Ext.data.JsonWriter, {
		
		/**
		 * @cfg {Boolean} writerAllFields 
		 * <p>
		 * 发送更新请求时,是否将所有属性都发送到后台,默认值为false
		 * </p>
		 */
		writeAllFields : false,
		
		encodeDelete : true,
		
		/**
		 * <p>
		 * 重写JsonWriter的render方法，
		 * 1 发送到后台的数据不进行编码,并作为params的属性发送到后台.
		 * </p>
		 * @param {Object} params
		 * @param {Object} baseParams
		 * @param {Object} data
		 */
		render : function(params, baseParams, data) {
			Ext.apply(params, baseParams);
			params[this.meta.root] = data;
    	}
	});
	
})();
Ext.ns("Rs.ext.data");

(function(){
	
	/**
	 * @class Rs.ext.data.Store
	 * 不支持远程对多个字段进行排序, 默认可进行远程排序
	 * 可将对数据的增删改查发送到不同的URL
	 * 
	 * 如果没有readUrl, upateUrl, createUrl, destroyUrl，则把请求发送给默认的url
	 * 
	 * 如果没有readMethod, updateMethod, createMethod, destroyMethod 则将调用默认的
	 * read upate create destroy 方法.
	 * 
	 * 查询数据URL为readService.jsp 调用的查询方法为readItems
	 * 更新数据URL为updateService.jsp 调用的更新方法为updateItems
	 * 新建数据URL为createService.jsp 调用的新增方法为createItems
	 * 删除数据URL为destroyService.jsp 调用的删除方法为destroyItems
	 * 
	 * 如下配置即可：
	 * <pre><code>
     var store2 = new Rs.ext.data.Store({
            autoLoad : true,
            autoDestroy: true,
            readUrl: 'readService.jsp',
            readMethod : 'readItems',
            updateUrl : 'updateService.jsp', 
            updateMethod : 'updateItems',
            createUrl : 'createService.jsp',
            createMethod : 'createItems',
            destroyUrl : 'destroyService.jsp',
            destroyMethod : 'destroyItems',
            root: 'items',
            idProperty: 'code',
            sortField : 'name',
            fields: ['code', 'name', {name:'price', type: 'float'}],
            baseParams : {
                pm_flag : 'Y'
            }
       });
	 * </code></pre>
	 * @extends Ext.data.Store
	 * @constructor
	 * @param {Object} config
	 */
	Rs.ext.data.Store = function(config){
		
		var idProperty = config.idProperty ? config.idProperty 
				: config.reader ? config.reader.idProperty : 'id',
			root = config.root ? config.root 
				: config.reader ? config.reader.root : 'data',
			fields = config.fields ? Ext.data.Record.create(config.fields) 
				: cofnig.reader ? config.reader.fields : undefined,
			totalProperty = config.totalProperty || 'total',
			successProperty = config.successProperty || 'success',
			messageProperty = config.messageProperty || 'message',
			proxy = config.proxy || new Rs.ext.data.Proxy({
				url : config.url || config.readUrl || config.createUrl || config.updateUrl || config.destroyUrl,
				readUrl : config.readUrl,
				readMethod : config.readMethod,
				createUrl : config.createUrl,
				createMethod : config.createMethod,
				updateUrl : config.updateUrl,
				updateMethod : config.updateMethod,
				destroyUrl : config.destroyUrl,
				destroyMethod : config.destroyMethod
			}),
			writer = config.writer || new Rs.ext.data.Writer({
				idProperty : idProperty,
				listful : true
			}), 
			reader = new Rs.ext.data.Reader({
				idProperty : idProperty,
			    root : root,
			    totalProperty : totalProperty,
			    successProperty : successProperty,
			    messageProperty : messageProperty
			}, fields);
			
		Rs.ext.data.Store.superclass.constructor.call(this, Ext.apply(config, {
			proxy : proxy,
			writer : writer,
			reader : reader
		}));
		
        //设置metaData为baseParams,每次请求都会将metaData作为参数传入后台，
		//后台根据metaData组织数据
		Ext.apply(this.baseParams, {
			metaData : Ext.apply({
				paramNames : this.paramNames
			}, this.reader.meta)
		});
	};
	
	Ext.extend(Rs.ext.data.Store, Ext.data.Store, {
		/**
		 * @cfg {String} readUrl 
		 * <p>
		 * 读取url.
		 * </p>
		 */
		
		/**
		 * @cfg {String} readMethod 
		 * <p>
		 * 读取方法名.
		 * </p>
		 */
		
		/**
		 * @cfg {String} createUrl 
		 * <p>
		 * 增加url.
		 * </p>
		 */
		
		/**
		 * @cfg {String} createMethod 
		 * <p>
		 * 增加方法名.
		 * </p>
		 */
		
		/**
		 * @cfg {String} updateUrl 
		 * <p>
		 * 更新url.
		 * </p>
		 */
		
		/**
		 * @cfg {String} updateMethod 
		 * <p>
		 * 更新方法名.
		 * </p>
		 */

		/**
		 * @cfg {String} destroyUrl 
		 * <p>
		 * 删除url.
		 * </p>
		 */
		
		/**
		 * @cfg {String} destroyMethod 
		 * <p>
		 * 删除方法名.
		 * </p>
		 */
		
		
		
		/**
		 * @cfg {Boolean} remoteSort 
		 * <p>
		 * 远程排序, 默认为true.
		 * </p>
		 */
		remoteSort : true,
		
		/**
		 * @cfg {Boolean} autoSave
		 * <p>
		 * 主动保存, 当用户修改或删除了数据,将马上发送请求与后台同步
		 * </p>
		 */
		autoSave : false,
		
		/**
		 * @cfg {Boolean} pruneModifiedRecords 
		 */
		pruneModifiedRecords : true,
		
		  /**
	     * <p>Loads the Record cache from the configured <tt>{@link #proxy}</tt> using the configured <tt>{@link #reader}</tt>.</p>
	     * <br><p>Notes:</p><div class="mdetail-params"><ul>
	     * <li><b><u>Important</u></b>: loading is asynchronous! This call will return before the new data has been
	     * loaded. To perform any post-processing where information from the load call is required, specify
	     * the <tt>callback</tt> function to be called, or use a {@link Ext.util.Observable#listeners a 'load' event handler}.</li>
	     * <li>If using {@link Ext.PagingToolbar remote paging}, the first load call must specify the <tt>start</tt> and <tt>limit</tt>
	     * properties in the <code>options.params</code> property to establish the initial position within the
	     * dataset, and the number of Records to cache on each read from the Proxy.</li>
	     * <li>If using {@link #remoteSort remote sorting}, the configured <code>{@link #sortInfo}</code>
	     * will be automatically included with the posted parameters according to the specified
	     * <code>{@link #paramNames}</code>.</li>
	     * </ul></div>
	     * @param {Object} options An object containing properties which control loading options:<ul>
	     * <li><b><tt>params</tt></b> :Object<div class="sub-desc"><p>An object containing properties to pass as HTTP
	     * parameters to a remote data source. <b>Note</b>: <code>params</code> will override any
	     * <code>{@link #baseParams}</code> of the same name.</p>
	     * <p>Parameters are encoded as standard HTTP parameters using {@link Ext#urlEncode}.</p></div></li>
	     * <li><b>callback</b> : Function<div class="sub-desc"><p>A function to be called after the Records
	     * have been loaded. The callback is called after the load event is fired, and is passed the following arguments:<ul>
	     * <li>r : Ext.data.Record[] An Array of Records loaded.</li>
	     * <li>options : Options object from the load call.</li>
	     * <li>success : Boolean success indicator.</li></ul></p></div></li>
	     * <li><b>scope</b> : Object<div class="sub-desc"><p>Scope with which to call the callback (defaults
	     * to the Store object)</p></div></li>
	     * <li><b>add</b> : Boolean<div class="sub-desc"><p>Indicator to append loaded records rather than
	     * replace the current cache.  <b>Note</b>: see note for <tt>{@link #loadData}</tt></p></div></li>
	     * </ul>
	     * @return {Boolean} If the <i>developer</i> provided <tt>{@link #beforeload}</tt> event handler returns
	     * <tt>false</tt>, the load call will abort and will return <tt>false</tt>; otherwise will return <tt>true</tt>.
	     */
		load : function(options) {
	        options = Ext.apply({}, options);
	        this.storeOptions(options);
	        //将排序信息存如baseParams.metaData中，后台可根据sortInfo对数据进行排序
	        if(this.sortInfo && this.remoteSort){
	            var pn = this.paramNames,
	            	si = {};
	            si[pn.sort] = this.sortInfo.field;
	            si[pn.dir] = this.sortInfo.direction;
	            Ext.apply(this.baseParams.metaData, {
	            	sortInfo : si
	            });
	        }
	        try {
	            return this.execute('read', null, options); // <-- null represents rs.  No rs for load actions.
	        } catch(e) {
	            this.handleException(e);
	            return false;
	        }
	    }, 
	    
	    /**
	     * 重写的{@link Ext.data.Store#singleSort}方法, 原方法中，
	     * 如果是远程排序则，将已经修改的sortToggle和sortInfo又重新赋值给当前Sort对象，这是有问题滴。
	     * @param {String} fieldName  排序字段
	     * @param {String} dir 排序方式
	     */
	    singleSort: function(fieldName, dir) {
	        var field = this.fields.get(fieldName);
	        if (!field) {
	            return false;
	        }

	        var name       = field.name,
	            sortInfo   = this.sortInfo || null,
	            sortToggle = this.sortToggle ? this.sortToggle[name] : null;

	        if (!dir) {
	            if (sortInfo && sortInfo.field == name) { // toggle sort dir
	                dir = (this.sortToggle[name] || 'ASC').toggle('ASC', 'DESC');
	            } else {
	                dir = field.sortDir;
	            }
	        }

	        this.sortToggle[name] = dir;
	        this.sortInfo = {field: name, direction: dir};
	        this.hasMultiSort = false;

	        if (this.remoteSort) {
	            if (!this.load(this.lastOptions)){
	                /*
	            	if (sortToggle) {
	                    this.sortToggle[name] = sortToggle;
	                }
	                if (sortInfo) {
	                    this.sortInfo = sortInfo;
	                }
	                */
	            }
	        } else {
	            this.applySort();
	            this.fireEvent('datachanged', this);
	        }
	        return true;
	    }
		
	});
	
})();
Ext.ns("Rs.ext.grid");

(function(){
	
	/**
	 * @class Rs.ext.data.GroupingStore
	 * @extends Rs.ext.data.Store
	 * @constructor
	 * Creates a new GroupingStore.
	 * @param {Object} config A config object containing the objects needed for the Store to access data,
	 * and read the data into Records.
	 * @xtype groupingstore
	 */
	Rs.ext.data.GroupingStore = function(config) {
	    config = config || {};

	    //We do some preprocessing here to massage the grouping + sorting options into a single
	    //multi sort array. If grouping and sorting options are both presented to the constructor,
	    //the sorters array consists of the grouping sorter object followed by the sorting sorter object
	    //see Ext.data.Store's sorting functions for details about how multi sorting works
	    this.hasMultiSort  = true;
	    this.multiSortInfo = this.multiSortInfo || {sorters: []};

	    var sorters    = this.multiSortInfo.sorters,
	        groupField = config.groupField || this.groupField,
	        sortInfo   = config.sortInfo || this.sortInfo,
	        groupDir   = config.groupDir || this.groupDir;

	    //add the grouping sorter object first
	    if(groupField){
	        sorters.push({
	            field    : groupField,
	            direction: groupDir
	        });
	    }

	    //add the sorting sorter object if it is present
	    if (sortInfo) {
	        sorters.push(sortInfo);
	    }

	    Rs.ext.data.GroupingStore.superclass.constructor.call(this, config);

	    this.addEvents(
	      /**
	       * @event groupchange
	       * Fired whenever a call to store.groupBy successfully changes the grouping on the store
	       * @param {Ext.data.GroupingStore} store The grouping store
	       * @param {String} groupField The field that the store is now grouped by
	       */
	      'groupchange'
	    );

	    this.applyGroupField();
	};


	Ext.extend(Rs.ext.data.GroupingStore, Rs.ext.data.Store, {

	    /**
	     * @cfg {String} groupField
	     * The field name by which to sort the store's data (defaults to '').
	     */
	    /**
	     * @cfg {Boolean} remoteGroup
	     * True if the grouping should apply on the server side, false if it is local only (defaults to true).  If the
	     * grouping is local, it can be applied immediately to the data.  If it is remote, then it will simply act as a
	     * helper, automatically sending the grouping field name as the 'groupBy' param with each XHR call.
	     */
	    remoteGroup : true,
	    /**
	     * @cfg {Boolean} groupOnSort
	     * True to sort the data on the grouping field when a grouping operation occurs, false to sort based on the
	     * existing sort info (defaults to false).
	     */
	    groupOnSort:false,

	    /**
	     * @cfg {String} groupDir
	     * The direction to sort the groups. Defaults to <tt>'ASC'</tt>.
	     */
	    groupDir : 'ASC',

	    /**
	     * Clears any existing grouping and refreshes the data using the default sort.
	     */
	    clearGrouping : function(){
	        this.groupField = false;
	        if(this.remoteGroup){
	            if(this.baseParams){
	                delete this.baseParams.groupBy;
	                delete this.baseParams.groupDir;
	            }
	            var lo = this.lastOptions;
	            if(lo && lo.params){
	                delete lo.params.groupBy;
	                delete lo.params.groupDir;
	            }
	            this.reload();
	        }else {
	            this.sort();
	            this.fireEvent('datachanged', this);
	        }
	    },

	    /**
	     * Groups the data by the specified field.
	     * @param {String} field The field name by which to sort the store's data
	     * @param {Boolean} forceRegroup (optional) True to force the group to be refreshed even if the field passed
	     * in is the same as the current grouping field, false to skip grouping on the same field (defaults to false)
	     */
	    groupBy : function(field, forceRegroup, direction) {
	        direction = direction ? (String(direction).toUpperCase() == 'DESC' ? 'DESC' : 'ASC') : this.groupDir;

	        if (this.groupField == field && this.groupDir == direction && !forceRegroup) {
	            return; // already grouped by this field
	        }

	        //check the contents of the first sorter. If the field matches the CURRENT groupField (before it is set to the new one),
	        //remove the sorter as it is actually the grouper. The new grouper is added back in by this.sort
	        var sorters = this.multiSortInfo.sorters;
	        if (sorters.length > 0 && sorters[0].field == this.groupField) {
	            sorters.shift();
	        }

	        this.groupField = field;
	        this.groupDir = direction;
	        this.applyGroupField();

	        var fireGroupEvent = function() {
	            this.fireEvent('groupchange', this, this.getGroupState());
	        };

	        if (this.groupOnSort) {
	            this.sort(field, direction);
	            fireGroupEvent.call(this);
	            return;
	        }

	        if (this.remoteGroup) {
	            this.on('load', fireGroupEvent, this, {single: true});
	            this.reload();
	        } else {
	            this.sort(sorters);
	            fireGroupEvent.call(this);
	        }
	    },

	    //GroupingStore always uses multisorting so we intercept calls to sort here to make sure that our grouping sorter object
	    //is always injected first.
	    sort : function(fieldName, dir) {
	        if (this.remoteSort) {
	            return Ext.data.GroupingStore.superclass.sort.call(this, fieldName, dir);
	        }

	        var sorters = [];

	        //cater for any existing valid arguments to this.sort, massage them into an array of sorter objects
	        if (Ext.isArray(arguments[0])) {
	            sorters = arguments[0];
	        } else if (fieldName == undefined) {
	            //we preserve the existing sortInfo here because this.sort is called after
	            //clearGrouping and there may be existing sorting
	            sorters = this.sortInfo ? [this.sortInfo] : [];
	        } else {
	            //TODO: this is lifted straight from Ext.data.Store's singleSort function. It should instead be
	            //refactored into a common method if possible
	            var field = this.fields.get(fieldName);
	            if (!field) return false;

	            var name       = field.name,
	                sortInfo   = this.sortInfo || null,
	                sortToggle = this.sortToggle ? this.sortToggle[name] : null;

	            if (!dir) {
	                if (sortInfo && sortInfo.field == name) { // toggle sort dir
	                    dir = (this.sortToggle[name] || 'ASC').toggle('ASC', 'DESC');
	                } else {
	                    dir = field.sortDir;
	                }
	            }

	            this.sortToggle[name] = dir;
	            this.sortInfo = {field: name, direction: dir};

	            sorters = [this.sortInfo];
	        }

	        //add the grouping sorter object as the first multisort sorter
	        if (this.groupField) {
	            sorters.unshift({direction: this.groupDir, field: this.groupField});
	        }

	        return this.multiSort.call(this, sorters, dir);
	    },

	    /**
	     * @private
	     * Saves the current grouping field and direction to this.baseParams and this.lastOptions.params
	     * if we're using remote grouping. Does not actually perform any grouping - just stores values
	     */
	    applyGroupField: function(){
	        if (this.remoteGroup) {
	            if(!this.baseParams){
	                this.baseParams = {};
	            }
	            var gi = {
            		groupBy : this.groupField,
	                groupDir: this.groupDir
	            };
	            Ext.apply(this.baseParams.metaData, {
	            	groupInfo : gi
	            });
	            var lo = this.lastOptions;
	            if (lo && lo.params) {
	                lo.params.groupDir = this.groupDir;
	                //this is deleted because of a bug reported at http://www.extjs.com/forum/showthread.php?t=82907
	                delete lo.params.groupBy;
	            }
	        }
	    },

	    /**
	     * @private
	     * TODO: This function is apparently never invoked anywhere in the framework. It has no documentation
	     * and should be considered for deletion
	     */
	    applyGrouping : function(alwaysFireChange){
	        if(this.groupField !== false){
	            this.groupBy(this.groupField, true, this.groupDir);
	            return true;
	        }else{
	            if(alwaysFireChange === true){
	                this.fireEvent('datachanged', this);
	            }
	            return false;
	        }
	    },

	    /**
	     * @private
	     * Returns the grouping field that should be used. If groupOnSort is used this will be sortInfo's field,
	     * otherwise it will be this.groupField
	     * @return {String} The group field
	     */
	    getGroupState : function(){
	        return this.groupOnSort && this.groupField !== false ?
	               (this.sortInfo ? this.sortInfo.field : undefined) : this.groupField;
	    }
	});
	
	Ext.reg('rs-ext-groupingstore', Rs.ext.data.GroupingStore);

})();
Ext.ns("Rs.ext.data");

(function(){
	
	/**
	 * @class Rs.ext.data.GeneralselStore
	 * <p>GeneralselStore可根据progCode从后台获取数据，该Store不能对数据进行增删改操作。</p>
	 * @extends Rs.ext.data.Store
	 */
	Rs.ext.data.GeneralselStore = function(config){
		config = config || {};
		var progCode = config.progCode,
			progCondition = config.progCondition;
		if(Ext.isEmpty(progCode, false)){
			throw 'progCode is null';
		}
		var url = config.url || '/rsc/rsclient/generalsel', 
			baseParams = Ext.apply(config.baseParams || {}, {
				progCode : progCode
			});
		Rs.ext.data.GeneralselStore.superclass.constructor.call(this, Ext.apply(config, {
			url : url,
			baseParams : baseParams,
			baseProgCondition : progCondition
		}));
	};
	
	Ext.extend(Rs.ext.data.GeneralselStore, Rs.ext.data.Store, {
		
		/**
	     * @cfg {Boolean} loadMetaData <tt>true</tt> to load meta data when load data
	     * (defaults to <tt>true</tt>).
	     * 设置是否获取metaData信息, 在发送请求获取数据时将此参数传递到后台
	     */
		loadMetaData : true,
		
		 /**
	     * <p>Loads the Record cache including meta data or not from the configured <tt>{@link #proxy}</tt> using the configured <tt>{@link #reader}</tt>.</p>
	     * <br><p>Notes:</p><div class="mdetail-params"><ul>
	     * <li><b><u>Important</u></b>: loading is asynchronous! This call will return before the new data has been
	     * loaded. To perform any post-processing where information from the load call is required, specify
	     * the <tt>callback</tt> function to be called, or use a {@link Ext.util.Observable#listeners a 'load' event handler}.</li>
	     * <li>If using {@link Ext.PagingToolbar remote paging}, the first load call must specify the <tt>start</tt> and <tt>limit</tt>
	     * properties in the <code>options.params</code> property to establish the initial position within the
	     * dataset, and the number of Records to cache on each read from the Proxy.</li>
	     * <li>If using {@link #remoteSort remote sorting}, the configured <code>{@link #sortInfo}</code>
	     * will be automatically included with the posted parameters according to the specified
	     * <code>{@link #paramNames}</code>.</li>
	     * </ul></div>
		 * 重写父类 load 方法，将 loadMetaData 做为 baseParams.metaData 的
		 * 参数传入服务器
	     * @param {Object} options An object containing properties which control loading options:<ul>
	     * <li><b><tt>params</tt></b> :Object<div class="sub-desc"><p>An object containing properties to pass as HTTP
	     * parameters to a remote data source. <b>Note</b>: <code>params</code> will override any
	     * <code>{@link #baseParams}</code> of the same name.</p>
	     * <p>Parameters are encoded as standard HTTP parameters using {@link Ext#urlEncode}.</p></div></li>
	     * <li><b>callback</b> : Function<div class="sub-desc"><p>A function to be called after the Records
	     * have been loaded. The callback is called after the load event is fired, and is passed the following arguments:<ul>
	     * <li>r : Ext.data.Record[] An Array of Records loaded.</li>
	     * <li>options : Options object from the load call.</li>
	     * <li>success : Boolean success indicator.</li></ul></p></div></li>
	     * <li><b>scope</b> : Object<div class="sub-desc"><p>Scope with which to call the callback (defaults
	     * to the Store object)</p></div></li>
	     * <li><b>add</b> : Boolean<div class="sub-desc"><p>Indicator to append loaded records rather than
	     * replace the current cache.  <b>Note</b>: see note for <tt>{@link #loadData}</tt></p></div></li>
	     * </ul>
	     * @return {Boolean} If the <i>developer</i> provided <tt>{@link #beforeload}</tt> event handler returns
	     * <tt>false</tt>, the load call will abort and will return <tt>false</tt>; otherwise will return <tt>true</tt>.
	     */
		load : function(options) {
			options = Ext.apply({}, options);
			if(!options.params){
				options.params = {};
			}
			Ext.apply(options.params, {
				progCondition : this.joinProgCondition(options.params)
			});
			Ext.apply(this.baseParams.metaData, {
				loadMetaData : this.loadMetaData === true
			});
			Rs.ext.data.GeneralselStore.superclass.load.apply(this, arguments);
	    },
		
	    //private
	    joinProgCondition : function(params){
	    	var baseProgCondition = this.baseProgCondition,
	    		progCondition = params ? params.progCondition : undefined;
	    	if(Ext.isEmpty(progCondition, false)){
	    		return baseProgCondition || '';
	    	}else if(Ext.isEmpty(baseProgCondition, false)){
	    		return progCondition || '';
	    	}else {
	    		var pco = this.splitProgCondition(progCondition),
	    			bpco = this.splitProgCondition(baseProgCondition),
	    			cds = [], cd,
	    			cdo = Ext.apply(pco || {}, bpco);
	    		for(var k in cdo){
	    			cd = cdo[k];
	    			if(cd && !Ext.isEmpty(cd, false)){
	    				cds.push(cdo[k]);
	    			}
	    		}
	    		if(cds.length > 0){
	    			return cds.join(' AND ');
	    		}
	    	}
	    },
	    
	    //private
	    splitProgCondition : function(content){
	            var result = {}, str,
	            i, l, c, cc, 
	            b = new Array();
	        for(i = 0, l = content.length; i < l; i++){
	        	if(content.substring(i, i + 3).toUpperCase() == 'AND'){
	                if(b.length > 0){
	                    this.buildConditionBlock(result, b.join(''));
	                    b = new Array();   
	                }
	                i = i + 3;
	            }else {
	            	c = content.charAt(i);
	            	if(c == '('){
	                    if(b.length > 0){
	                    	this.buildConditionBlock(result, b.join(''));
	                        b = new Array();
	                    }
	                    cc = 0;
	                    while(true && i < l){
	                        c = content.charAt(i++);
	                        b[b.length] = c;
	                        (c == '(')?(cc++):null;
	                        (c == ')')?(cc--):null;
	                        if(cc == 0){
	                            break;    
	                        }
	                    }
	                    this.buildConditionBlock(result, b.join(''));
	                    b = new Array();
	                }else {
	                	b[b.length] = c;
	                }
	            }
	        }
	        if(b.length > 0){
	        	this.buildConditionBlock(result, b.join(''));
	        }
	        return result;
	    },
	    
	    //private
	    buildConditionBlock : function(result, condition){
	    	var k = condition.replace(/\s/gi, '');
	    	result[k] = condition;
	    	return result;
	    },
	    
		/** 
		 * 重写父类 loadRecords 方法，当load完数据后，设置 loadMetaData 为false 
		 * 保证下次不在需要获取metaData 信息.
		 * @private
		 */
		loadRecords : function(o, options, success){
			Rs.ext.data.GeneralselStore.superclass.loadRecords.apply(this, arguments);
			this.loadMetaData = false;
		},
		
		/**
		 * 设置progCode <br/>
		 * 该store根据progCode来从后台获取数据。
		 * @param {String} progCode
		 * @param {String} progCondition 查询条件
		 */
		setProgCode : function(progCode, progCondition){
			if(Ext.isEmpty(progCode, false)){
				Rs.error('progCode is empty!');
			}
			this.progCode = progCode;
			this.baseProgCondition = progCondition;
			Ext.apply(this.baseParams || {}, {
				progCode : this.progCode
			});
			delete this.lastOptions;
			this.loadMetaData = true;
		}, 
		
		
		/**
		 * 获取progCode
		 * @return {String} progCode
		 */
		getProgCode : function(){
			return this.progCode;
		},
		
		/**
		 * 获取progCondition
		 * @return {String} progCondition
		 */
		getProgCondition : function(){
			return this.progCondition || '';
		}
		
	});
	
})();
Ext.namespace("Rs.ext.grid");

(function() {
	
	/**
	 * <p>
	 * 分页控件
	 * </p>
	 * @class Rs.ext.grid.SliderPagingToolbar 
	 * @extends  Ext.PagingToolbar
	 * @constructor
	 * @param {Object} config
	 */
	Rs.ext.grid.SliderPagingToolbar = function(config){
		Rs.ext.grid.SliderPagingToolbar.superclass.constructor.call(this, config);
	};
	
	Ext.extend(Rs.ext.grid.SliderPagingToolbar, Ext.PagingToolbar, {

		/**
		 * @cfg {Number} minPageSize
		 * 最小的每页显示数据条数, 默认为10
		 */
		minPageSize : 10,
		
		/**
		 * @cfg {Number} maxPageSize
		 * 最大的每页显示数据条数，默认为100
		 */
		maxPageSize : 100,
		
		/**
		 * @cfg {Number} pageSizeIncrement
		 * 步长 
		 */
		pageSizeIncrement : 10,
		
		/**
		 * @cfg {Number} pageSize
		 * <p>
		 * pageSize : 20
		 * </p>
		 */
		pageSize : 20,

		/**
		 * @cfg {Object} paramNames 
		 * <p>
		 * <pre><code>
		paramNames : {
			start : "start",
			limit : "limit"
		}
		 * </code></pre>
		 * </p>
		 */
		paramNames : {
			start : "start",
			limit : "limit"
		},
		
		beforePageText : "第",
		
		afterPageText : "页(共{0}页)",
		
		firstText : "第一页",
		
		lastText : "最后一页",
		
		nextText : "下一页",
		
		prevText : "上一页",
		
		refreshText : "刷新",
		
		/**
		 * 
		 * @cfg {Boolean} hasSlider
		 */
		hasSlider : true,
		
		initComponent : function(){
			Rs.ext.grid.SliderPagingToolbar.superclass.initComponent.apply(this, arguments);
			if(this.hasSlider === true){
				this.sliderField = new Ext.form.SliderField({
					width : 100,
					animate : true,
					increment : this.pageSizeIncrement,
					minValue : this.minPageSize,
					maxValue : this.maxPageSize,
					tipText: function(thumb){
						return "每页显示" + String(thumb.value) + "项";
	            	}
				});
                var index = this.items.indexOf(this.refresh);
				var sep = new Ext.Toolbar.Separator();
                this.items.insert(index+1,sep);
                this.items.insert(index+2,this.sliderField);
                this.sliderField.setValue(this.pageSize, false);
				this.setPageSizeTask = new Ext.util.DelayedTask(this.setPageSize, this);
				this.sliderField.slider.on('changecomplete', this.onPageSizeChanged, this);
			}
		},
		
		/**
		 * onPageSizeChanged
		 * @private
		 */
		onPageSizeChanged : function(field, value) {
			this.pageSize = value;
			this.setPageSizeTask.delay(50);
		},

		/**
		 * setPageSize
		 * @private
		 */
		setPageSize : function() {
			this.cursor = Math.floor(this.cursor / this.pageSize) * this.pageSize;
			var pn = this.getParams(),
				meta = this.store.baseParams.metaData || {};
			meta[pn['limit']] = this.pageSize;
			Ext.apply(this.store.baseParams, {
				metaData : meta
			});
			this.doLoad(this.cursor);
		},

		/**
	     * Binds the paging toolbar to the specified {@link Ext.data.Store}
	     * @param {Store} store The store to bind to this toolbar
	     * @param {Boolean} initial (Optional) true to not remove listeners
	     */
		bindStore : function(store, initial){
			if(store) {
				var pn = this.getParams(),
					meta = store.baseParams.metaData || {};
				meta[pn['limit']] = this.pageSize;
				Ext.apply(store.baseParams, {
					metaData : meta
				});
			}
			Rs.ext.grid.SliderPagingToolbar.superclass.bindStore.apply(this, arguments);
	    },
		
	    // private
	    onLoad : function(store, r, o){
	        if(!this.rendered){
	            this.dsLoaded = [store, r, o];
	            return;
	        }
	        var pn = this.getParams(),
	        	meta = store.baseParams.metaData;
	        this.cursor = (meta && meta[pn["start"]]) ? meta[pn["start"]] : 0;
	        var d = this.getPageData(), ap = d.activePage, ps = d.pages;
	        this.afterTextItem.setText(String.format(this.afterPageText, d.pages));
	        this.inputItem.setValue(ap);
	        this.first.setDisabled(ap == 1);
	        this.prev.setDisabled(ap == 1);
	        this.next.setDisabled(ap == ps);
	        this.last.setDisabled(ap == ps);
	        this.refresh.enable();
	        this.updateInfo();
	        this.fireEvent('change', this, d);
	    },
	    
		/**
		 * 载入数据
		 * @param {Number} start 起始的条目号
		 */
		doLoad : function(start) {
	    	var pn = this.getParams(),
				meta = this.store.baseParams.metaData || {};
			meta[pn['start']] = start;
			Ext.apply(this.store.baseParams, {
				metaData : meta
			});
			var o = this.store.lastOptions ? this.store.lastOptions.params || {} : {}; 
			if(this.fireEvent('beforechange', this, o) !== false) {
				this.store.load({params : o});
			}
		},
		
		/**
		 * 设置开始的位置
		 * @param {Number} start 开始位置的条目号
		 */
		setStart : function(start){
	    	var pn = this.getParams(),
				meta = this.store.baseParams.metaData || {};
			meta[pn['start']] = Ext.isNumber(start)?start:0;
			Ext.apply(this.store.baseParams, {
				metaData : meta
			});
		} ,
		
		//private
        updateInfo : function(){
            if(this.displayItem){
                var count = this.store.getCount();
                var d = this.getPageData() ;
                if(d && d.activePage > d.pages && count == 0){
                    this.doLoad((d.pages - 1) * this.pageSize);
                    return ;
                }
                var msg = count == 0 ? this.emptyMsg :
                String.format(this.displayMsg,this.cursor+1, this.cursor+count, this.store.getTotalCount());
                this.displayItem.setText(msg);
            }
        }
	});

	Ext.ComponentMgr.registerType("rs-ext-sliderpagingtoolbar", Rs.ext.grid.SliderPagingToolbar);
})();
(function(){
	
	/**
	 * @class Rs.ext.grid.RowCellSelectionModel
	 * @extends Ext.grid.RowSelectionModel
	 * 
	 * 当选中单元格的时候，按住Ctrl+C 可进行复制选中单元格的内容。不支持chrome 和safri浏览器的复制。
	 *<pre><code>
  var grid = new Ext.grid.GridPanel({
        store: store,
        sm : new Rs.ext.grid.RowCellSelectionModel(),
        title : 'Rs.ext.grid.RowCellSelectionModel',
        columns: [{
                header   : 'CODE', 
                width    : 170,
                sortable : true, 
                dataIndex: 'CODE'
            }, {
                header   : 'NAME', 
                width    : 150, 
                sortable : true, 
                dataIndex: 'NAME'
            }, {
            	header   : 'PRICE', 
                width    : 100, 
                sortable : true, 
                dataIndex: 'PRICE'
            }
        ],
        height: 350,
        width: 500
    });
	 *</code></pre>
	 * @constructor
	 * @param {Object} config The configuration options
	 */
	Rs.ext.grid.RowCellSelectionModel = function(config){
		Rs.ext.grid.RowCellSelectionModel.superclass.constructor.call(this, config);
		
		this.cellselection = null;
		
		this.addEvents(
	        /**
	         * @event beforecellselect
	         * Fires before a cell is selected, return false to cancel the selection.
	         * @param {SelectionModel} this
	         * @param {Number} rowIndex The selected row index
	         * @param {Number} colIndex The selected cell index
	         */
	        "beforecellselect",
	        /**
	         * @event cellselect
	         * Fires when a cell is selected.
	         * @param {SelectionModel} this
	         * @param {Number} rowIndex The selected row index
	         * @param {Number} colIndex The selected cell index
	         */
	        "cellselect", 
	        
	        /**
	         * @event cellselectionchange
	         * Fires when the active cellselection changes.
	         * @param {SelectionModel} this
	         * @param {Object} selection null for no selection or an object with two properties
	         * <div class="mdetail-params"><ul>
	         * <li><b>cell</b> : see {@link #getSelectedCell} 
	         * <li><b>record</b> : Ext.data.record<p class="sub-desc">The {@link Ext.data.Record Record}
	         * which provides the data for the row containing the selection</p></li>
	         * </ul></div>
	         */
	        "cellselectionchange"
	    );
		
	};
	
	Ext.extend(Rs.ext.grid.RowCellSelectionModel, Ext.grid.RowSelectionModel, {
		
		// private
	    initEvents : function(){
			Rs.ext.grid.RowCellSelectionModel.superclass.initEvents.apply(this, arguments);
			this.grid.on('cellmousedown', this.handleCellMouseDown, this);
	        this.grid.on(Ext.EventManager.getKeyEvent(), this.handleKeyDown, this);
	        this.grid.getView().on({
	            scope: this,
	            refresh: this.onViewChange,
	            rowupdated: this.onRowUpdated,
	            beforerowremoved: this.clearCellSelections,
	            beforerowsinserted: this.clearCellSelections
	        });
	        if(this.grid.isEditor){
	            this.grid.on('beforeedit', this.beforeEdit,  this);
	        }
	    },
	    
	    //private
	    beforeEdit : function(e){
	        this.select(e.row, e.column, false, true, e.record);
	    },
	    
	    //private
	    onViewChange : function(){
	        this.clearCellSelections(true);
	    },
	    
	    //private
	    onRowUpdated : function(v, index, r){
	        if(this.cellselection && this.cellselection.record == r){
	            v.onCellSelect(index, this.cellselection.cell[1]);
	        }
	    },
	    
	    //private
	    handleCellMouseDown : function(g, row, cell, e){
            if(e.button !== 0 || this.isLocked()){
                return;
            }
            this.select(row, cell);
        },
	    
        /**
	     * Selects a cell.  Before selecting a cell, fires the
	     * {@link #beforecellselect} event.  If this check is satisfied the cell
	     * will be selected and followed up by  firing the {@link #cellselect} and
	     * {@link #selectionchange} events.
	     * @param {Number} rowIndex The index of the row to select
	     * @param {Number} colIndex The index of the column to select
	     * @param {Boolean} preventViewNotify (optional) Specify <tt>true</tt> to
	     * prevent notifying the view (disables updating the selected appearance)
	     * @param {Boolean} preventFocus (optional) Whether to prevent the cell at
	     * the specified rowIndex / colIndex from being focused.
	     * @param {Ext.data.Record} r (optional) The record to select
	     */
	    select : function(rowIndex, colIndex, preventViewNotify, preventFocus, /*internal*/ r){
	        if(this.fireEvent("beforecellselect", this, rowIndex, colIndex) !== false){
	            this.clearCellSelections();
	            r = r || this.grid.store.getAt(rowIndex);
	            this.cellselection = {
	                record : r,
	                cell : [rowIndex, colIndex]
	            };
	            if(!preventViewNotify){
	                var v = this.grid.getView();
	                v.onCellSelect(rowIndex, colIndex);
	                if(preventFocus !== true){
	                    v.focusCell(rowIndex, colIndex);
	                }
	            }
	            this.fireEvent("cellselect", this, rowIndex, colIndex);
	            this.fireEvent("cellselectionchange", this, this.cellselection);
	        }
	    },
	    
	    /**
	     * If anything is selected, clears all selections and fires the selectionchange event.
	     * @param {Boolean} preventNotify <tt>true</tt> to prevent the gridview from
	     * being notified about the change.
	     */
	    clearCellSelections : function(preventNotify){
	        var cs = this.cellselection;
	        if(cs){
	            if(preventNotify !== true){
	                this.grid.view.onCellDeselect(cs.cell[0], cs.cell[1]);
	            }
	            this.cellselection = null;
	            this.fireEvent("cellselectionchange", this, null);
	        }
	    },
	    
		/**
	     * Returns an array containing the row and column indexes of the currently selected cell
	     * (e.g., [0, 0]), or null if none selected. The array has elements:
	     * <div class="mdetail-params"><ul>
	     * <li><b>rowIndex</b> : Number<p class="sub-desc">The index of the selected row</p></li>
	     * <li><b>cellIndex</b> : Number<p class="sub-desc">The index of the selected cell. 
	     * Due to possible column reordering, the cellIndex should <b>not</b> be used as an
	     * index into the Record's data. Instead, use the cellIndex to determine the <i>name</i>
	     * of the selected cell and use the field name to retrieve the data value from the record:<pre><code>
	// get name
	var fieldName = grid.getColumnModel().getDataIndex(cellIndex);
	// get data value based on name
	var data = record.get(fieldName);
	     * </code></pre></p></li>
	     * </ul></div>
	     * @return {Array} An array containing the row and column indexes of the selected cell, or null if none selected.
		 */
	    getSelectedCell : function(){
	        return this.cellselection ? this.cellselection.cell : null;
	    }, 
	    
	    /**
	     * Returns <tt>true</tt> if there is a selection.
	     * @return {Boolean}
	     */
	    hasCellSelection : function(){
	        return this.cellselection ? true : false;
	    },
	    
		//private
	    isSelectable : function(rowIndex, colIndex, cm){
	    	return !cm.isHidden(colIndex);
	    },
	    
	    /** @ignore */
	    handleKeyDown : function(e){
	    	if(e.getKey() == e.C && e.ctrlKey === true){
	    		var g = this.grid,
	    			cs = this.cellselection, cm, f, r;
	    		if(g && cs){
	    			cm = g.getColumnModel();
	    			c = cm.getColumnAt(cs.cell[1]);
	    			f = c ? c.dataIndex : undefined;
	    			r = cs.record;
	    			if(r && f){
	    				Rs.Clipboard.setData(r.get(f));
	    			}
	    		}
	    		return;
	    	}
	        if(!e.isNavKeyPress()){
	            return;
	        }
	        var k = e.getKey(),
	            g = this.grid,
	            s = this.cellselection,
	            sm = this,
	            walk = function(row, col, step){
	                return g.walkCells(
	                    row,
	                    col,
	                    step,
	                    g.isEditor && g.editing ? sm.acceptsNav : sm.isSelectable, // *** handle tabbing while editorgrid is in edit mode
	                    sm
	                );
	            },
	            cell, newCell, r, c, ae;

	        switch(k){
	            case e.ESC:
	            case e.PAGE_UP:
	            case e.PAGE_DOWN:
	                // do nothing
	                break;
	            default:
	                // *** call e.stopEvent() only for non ESC, PAGE UP/DOWN KEYS
	                e.stopEvent();
	                break;
	        }

	        if(!s){
	            cell = walk(0, 0, 1); // *** use private walk() function defined above
	            if(cell){
	                this.select(cell[0], cell[1]);
	            }
	            return;
	        }

	        cell = s.cell;  // currently selected cell
	        r = cell[0];    // current row
	        c = cell[1];    // current column
	        
	        switch(k){
	            case e.TAB:
	                if(e.shiftKey){
	                    newCell = walk(r, c - 1, -1);
	                }else{
	                    newCell = walk(r, c + 1, 1);
	                }
	                break;
	            case e.DOWN:
	                newCell = walk(r + 1, c, 1);
	                break;
	            case e.UP:
	                newCell = walk(r - 1, c, -1);
	                break;
	            case e.RIGHT:
	                newCell = walk(r, c + 1, 1);
	                break;
	            case e.LEFT:
	                newCell = walk(r, c - 1, -1);
	                break;
	            case e.ENTER:
	                if (g.isEditor && !g.editing) {
	                    g.startEditing(r, c);
	                    return;
	                }
	                break;
	        }

	        if(newCell){
	            // *** reassign r & c variables to newly-selected cell's row and column
	            r = newCell[0];
	            c = newCell[1];

	            this.select(r, c); // *** highlight newly-selected cell and update selection

	            if(g.isEditor && g.editing){ // *** handle tabbing while editorgrid is in edit mode
	                ae = g.activeEditor;
	                if(ae && ae.field.triggerBlur){
	                    // *** if activeEditor is a TriggerField, explicitly call its triggerBlur() method
	                    ae.field.triggerBlur();
	                }
	                g.startEditing(r, c);
	            }
	        }
	    }
		
	});
	
})();
(function(){
	/**
	 * @class Rs.ext.grid.CheckboxCellSelectionModel
	 * @extends Rs.ext.grid.RowCellSelectionModel
	 * 
	 * 当选中单元格的时候，安装Ctrl+C 可进行复制选中单元格的内容。不支持chrome 和safri浏览器的复制。
	 * A custom selection model that renders a column of checkboxes that can be toggled to select or deselect rows.
	 * <pre><code>
var store2 = new Rs.ext.data.Store({
    autoLoad : true,
    autoDestroy: true,
    url: 'testservice.jsp',
    fields: ['CODE', 'NAME', {name:'PRICE', type: 'float'}],
    baseParams : {
        pm_flag : 'Y'
    }
});
var sm2 = new Rs.ext.grid.CheckboxCellSelectionModel();
var grid2 = new Ext.grid.GridPanel({
    store: store2,
    title : 'Rs.ext.grid.CheckboxCellSelectionModel',
    sm : sm2,
    columns: [sm2, {
            header   : 'CODE', 
            width    : 170,
            sortable : true, 
            dataIndex: 'CODE'
        }, {
            header   : 'NAME', 
            width    : 150, 
            sortable : true, 
            dataIndex: 'NAME'
        }, {
            header   : 'PRICE', 
            width    : 100, 
            sortable : true, 
            dataIndex: 'PRICE'
        }
    ],
    height: 350,
    width: 500,
    bbar: new Rs.ext.grid.SliderPagingToolbar({
        pageSize : 20,
        hasSlider : true,
        store : store2,
        displayInfo : false
    })
}); 
	 * </code></pre> 
	 * @constructor
	 * @param {Object} config The configuration options
	 */
	Rs.ext.grid.CheckboxCellSelectionModel = function(config){
		Rs.ext.grid.CheckboxCellSelectionModel.superclass.constructor.call(this, config);
		 if(this.checkOnly){
			 this.handleMouseDown = Ext.emptyFn;
		 }
	};
	
	Ext.extend(Rs.ext.grid.CheckboxCellSelectionModel, Rs.ext.grid.RowCellSelectionModel, {
		
		/**
	     * @cfg {Boolean} checkOnly <tt>true</tt> if rows can only be selected by clicking on the
	     * checkbox column (defaults to <tt>true</tt>).
	     */
		checkOnly : true,
		
	    /**
	     * @cfg {String} header Any valid text or HTML fragment to display in the header cell for the
	     * checkbox column.  Defaults to:<pre><code>
	     * '&lt;div class="x-grid3-hd-checker">&#38;#160;&lt;/div>'</tt>
	     * </code></pre>
	     * The default CSS class of <tt>'x-grid3-hd-checker'</tt> displays a checkbox in the header
	     * and provides support for automatic check all/none behavior on header click. This string
	     * can be replaced by any valid HTML fragment, including a simple text string (e.g.,
	     * <tt>'Select Rows'</tt>), but the automatic check all/none behavior will only work if the
	     * <tt>'x-grid3-hd-checker'</tt> class is supplied.
	     */
	    header : '<div class="x-grid3-hd-checker">&#160;</div>',
	    /**
	     * @cfg {Number} width The default width in pixels of the checkbox column (defaults to <tt>20</tt>).
	     */
	    width : 20,
	    /**
	     * @cfg {Boolean} sortable <tt>true</tt> if the checkbox column is sortable (defaults to
	     * <tt>false</tt>).
	     */
	    sortable : false,

	    // private
	    menuDisabled : true,
	    fixed : true,
	    hideable: false,
	    dataIndex : '',
	    id : 'checker',
	    isColumn: true, // So that ColumnModel doesn't feed this through the Column constructor

	    // private
	    initEvents : function(){
		    Rs.ext.grid.CheckboxCellSelectionModel.superclass.initEvents.call(this);
	        this.grid.on('render', function(){
	            Ext.fly(this.grid.getView().innerHd).on('mousedown', this.onHdMouseDown, this);
	        }, this);
	    },
	    
	    /**
	     * @private
	     * Process and refire events routed from the GridView's processEvent method.
	     */
	    processEvent : function(name, e, grid, rowIndex, colIndex){
	        if (name == 'mousedown') {
	            this.onMouseDown(e, e.getTarget());
	            return false;
	        } else {
	            return Ext.grid.Column.prototype.processEvent.apply(this, arguments);
	        }
	    },
		
	    // private
	    onMouseDown : function(e, t){
	        if(e.button === 0 && t.className == 'x-grid3-row-checker'){ // Only fire if left-click
	            e.stopEvent();
	            var row = e.getTarget('.x-grid3-row');
	            if(row){
	                var index = row.rowIndex;
	                if(this.isSelected(index)){
	                    this.deselectRow(index);
	                }else{
	                    this.selectRow(index, true);
	                    this.grid.getView().focusRow(index);
	                }
	            }
	        }
	    },

	    // private
	    onHdMouseDown : function(e, t) {
	        if(t.className == 'x-grid3-hd-checker'){
	            e.stopEvent();
	            var hd = Ext.fly(t.parentNode);
	            var isChecked = hd.hasClass('x-grid3-hd-checker-on');
	            if(isChecked){
	                hd.removeClass('x-grid3-hd-checker-on');
	                this.clearSelections();
	            }else{
	                hd.addClass('x-grid3-hd-checker-on');
	                this.selectAll();
	            }
	        }
	    },

	    // private
	    renderer : function(v, p, record){
	        return '<div class="x-grid3-row-checker">&#160;</div>';
	    },
	    
	    onEditorSelect: function(row, lastRow){
	        if(lastRow != row && !this.checkOnly){
	            this.selectRow(row); // *** highlight newly-selected cell and update selection
	        }
	    },
	    
		//private
	    isSelectable : function(rowIndex, colIndex, cm){
	    	if(cm.getColumnAt(colIndex) instanceof Ext.grid.CheckboxSelectionModel){
	    		return false;
	    	}else {
	    		return !cm.isHidden(colIndex);	
	    	}
	    }

	});
})();
Ext.ns("Rs.ext.grid");

(function() {
    /**
     * @class Rs.ext.grid.GridSummary 表格当前页合计行插件
     * @extends Ext.util.Observable
     */
    Rs.ext.grid.GridSummary = function(config) {
        Ext.apply(this, config);
    };

    Ext.extend(Rs.ext.grid.GridSummary, Ext.util.Observable, {
        init: function(grid) {
            this.grid = grid;
            this.cm = grid.getColumnModel();
            this.view = grid.getView();
            var v = this.view;

            v.onLayout = this.onLayout;

            v.afterMethod('render', this.refreshSummary, this);
            v.afterMethod('refresh', this.refreshSummary, this);
            v.afterMethod('setSumValue', this.test, this);
            v.afterMethod('syncScroll', this.syncSummaryScroll, this);
            v.afterMethod('onColumnWidthUpdated', this.doWidth, this);
            v.afterMethod('onAllColumnWidthsUpdated', this.doAllWidths, this);
            v.afterMethod('onColumnHiddenUpdated', this.doHidden, this);
            v.afterMethod('onUpdate', this.refreshSummary, this);
            v.afterMethod('onRemove', this.refreshSummary, this);

            // update summary row on store's add / remove / clear events
            grid.store.on('add', this.refreshSummary, this);
            grid.store.on('remove', this.refreshSummary, this);
            grid.store.on('clear', this.refreshSummary, this);

            if (!this.rowTpl) {
                this.rowTpl = new Ext.Template('<div class="x-grid3-summary-row x-grid3-gridsummary-row-offset">', '<table class="x-grid3-summary-table" border="0" cellspacing="0" cellpadding="0" style="{tstyle}">', '<tbody><tr>{cells}</tr></tbody>', '</table>', '</div>');
                this.rowTpl.disableFormats = true;
            }
            this.rowTpl.compile();

            if (!this.cellTpl) {
                this.cellTpl = new Ext.Template('<td class="x-grid3-col x-grid3-cell x-grid3-td-{id} {css}" style="{style}">', '<div class="x-grid3-cell-inner x-grid3-col-{id}" unselectable="on">{value}</div>', "</td>");
                this.cellTpl.disableFormats = true;
            }
            this.cellTpl.compile();
        },

        calculate: function(rs, cs) {
            var data = {},
            fieldData = {},
            avgData = {},
            r, c, cfg = this.cm.config,
            cf;
            for (var i = 0,
            len = cs.length; i < len; i++) {
                c = cs[i];
                cf = cfg[i];
                for (var j = 0,
                jlen = rs.length; j < jlen; j++) {
                    r = rs[j];
                    if (cf && cf.summaryType) {
                        if (!data[c.name]) {
                            data[c.name] = {};
                        }
                        data[c.name][cf.summaryType] = Rs.ext.grid.GridSummary.Calculations[cf.summaryType](data[c.name][cf.summaryType] || 0, r, c.name, data[c.name][cf.summaryType], data[c.name]);
                    }
                }
            }
            return data;
        },

        onLayout: function(vw, vh) {
            if ('number' != Ext.type(vh)) {
                return;
            }
            if (!this.grid.getGridEl().hasClass('x-grid-hide-gridsummary')) {
                this.scroller.setHeight(vh - this.summary.getHeight());
            }
        },

        syncSummaryScroll: function() {
            var mb = this.view.scroller.dom;
            if (this.view.summaryWrap) {
                this.view.summaryWrap.dom.scrollLeft = mb.scrollLeft;
                this.view.summaryWrap.dom.scrollLeft = mb.scrollLeft;
            }
        },

        doWidth: function(col, w, tw) {
            if (this.view.summary) {
                var s = this.view.summary.dom;
                s.firstChild.style.width = tw;
                s.firstChild.rows[0].childNodes[col].style.width = w;
            }
        },

        doAllWidths: function(ws, tw) {
            var s = this.view.summary.dom,
            wlen = ws.length;
            s.firstChild.style.width = tw;
            cells = s.firstChild.rows[0].childNodes;
            for (var j = 0; j < wlen; j++) {
                cells[j].style.width = ws[j];
            }
        },

        doHidden: function(col, hidden, tw) {
            var s = this.view.summary.dom;
            var display = hidden ? 'none': '';
            s.firstChild.style.width = tw;
            s.firstChild.rows[0].childNodes[col].style.display = display;
        },
        putSumInfo: null,
        setSumValue: function(jsonV) {
            var cs = this.view.getColumnData();
            var buf = [],
            c,
            p = {},
            last = cs.length - 1;

            for (var i = 0,
            len = cs.length; i < len; i++) {
                c = cs[i];
                p.id = c.id;
                p.style = c.style;
                p.css = i == 0 ? 'x-grid3-cell-first ': (i == last ? 'x-grid3-cell-last ': '');
                if (jsonV && jsonV[c.name]) {
                    p.value = jsonV[c.name];
                } else {
                    p.value = '';
                }
                if (p.value == undefined || p.value === "") p.value = " ";
                buf[buf.length] = this.cellTpl.apply(p);
            }

            if (!this.view.summaryWrap) {
                this.view.summaryWrap = Ext.DomHelper.insertAfter(this.view.scroller, {
                    tag: 'div',
                    cls: 'x-grid3-gridsummary-row-inner'
                },
                true);
            } else {
                this.view.summary.remove();
            }
            this.putSumInfo = this.rowTpl.apply({
                tstyle: 'width:' + this.view.getTotalWidth() + ';',
                cells: buf.join('')
            });
            this.view.summary = this.view.summaryWrap.insertHtml('afterbegin', this.putSumInfo, true);
        },

        refreshSumValue: function() {
            if (!this.view.summaryWrap) {
                this.view.summaryWrap = Ext.DomHelper.insertAfter(this.view.scroller, {
                    tag: 'div',
                    cls: 'x-grid3-gridsummary-row-inner'
                },
                true);
            } else {
                this.view.summary.remove();
            }
            this.view.summary = this.view.summaryWrap.insertHtml('afterbegin', this.putSumInfo, true);
        },

        renderSummary: function(o, cs) {
            cs = cs || this.view.getColumnData();
            var cfg = this.cm.config;
            var buf = [],
            c,
            p = {},
            cf,
            last = cs.length - 1;

            for (var i = 0,
            len = cs.length; i < len; i++) {
                c = cs[i];
                cf = cfg[i];
                p.id = c.id;
                p.style = c.style;
                p.css = i == 0 ? 'x-grid3-cell-first ': (i == last ? 'x-grid3-cell-last ': '');
                p.value = this.renderResultValue(cf, p, o, c);
                if (p.value == undefined || p.value === "") p.value = "&#160;";
                buf[buf.length] = this.cellTpl.apply(p);
            }

            return this.rowTpl.apply({
                tstyle: 'width:' + this.view.getTotalWidth() + ';',
                cells: buf.join('')
            });
        },
        renderResultValue: function(cf, p, o, c) {
            if (cf.summaryType || cf.summaryRenderer) {
                var sr = Rs.ext.grid.GridSummary.SummaryRenderer[cf.summaryType];
                if (o.data[c.name]) {
                    return (cf.summaryRenderer || sr || c.renderer)(o.data[c.name][cf.summaryType], p, o);
                } else {
                    return (cf.summaryRenderer || sr || c.renderer)(o.data[c.name], p, o);
                }
            } else {
                return '';
            }
        },
        refreshSummary: function() {
            if (this.putSumInfo) {
                this.refreshSumValue(this.putSumInfo);
                return;
            }
            var g = this.grid,
            ds = g.store;
            var cs = this.view.getColumnData();
            var rs = ds.getRange();
            var data = this.calculate(rs, cs);
            var buf = this.renderSummary({
                data: data
            },
            cs);

            if (!this.view.summaryWrap) {
                this.view.summaryWrap = Ext.DomHelper.insertAfter(this.view.scroller, {
                    tag: 'div',
                    cls: 'x-grid3-gridsummary-row-inner'
                },
                true);
            } else {
                this.view.summary.remove();
            }
            this.view.summary = this.view.summaryWrap.insertHtml('afterbegin', buf, true);
        },

        toggleSummary: function(visible) {
            var el = this.grid.getGridEl();
            if (el) {
                if (visible === undefined) {
                    visible = el.hasClass('x-grid-hide-gridsummary');
                }
                el[visible ? 'removeClass': 'addClass']('x-grid-hide-gridsummary');
                this.view.layout();
            }
        },

        /**
         * 获取合计行
         * 
         * @return {HTMLElement/Ext.Element}
         */
        getSummaryNode: function() {
            return this.view.summary;
        }
    });

    Rs.ext.grid.GridSummary.Calculations = {

        'sum': function(v, record, field) {
            return v + Ext.num(record.data[field], 0);
        },

        'count': function(v, record, field, data) {
            return data ? ++data: (data = 1);
        },

        'max': function(v, record, field, data) {
            var v = record.data[field];
            var max = (data === undefined) || (data == 0) ? (data = v) : data;
            return Math.max(v, max);
        },

        'min': function(v, record, field, data) {
            var v = parseFloat(record.data[field]);
            var min = (data === undefined) || (data == 0) ? (data = v) : data;
            return Math.min(v, min);
        },

        'average': function(v, record, field, data, avgData) {

            var c = avgData['count_avg'] ? ++avgData['count_avg'] : (avgData['count_avg'] = 1);
            var t = (avgData['total'] = (parseFloat(avgData['total'] || 0) + (Ext.num(record.data[field] || 0))));

            return t === 0 ? 0 : t / c;
        }
    };

    Rs.ext.grid.GridSummary.SummaryRenderer = {

        'count' : function(v, params, data) {
            return v != null || v ? '共' + v + '条' : '';
        },
        'sum' : function(v, params, data) {
            return v != null || v ? '合计值:' + v : '';
        },
        'max' : function(v, params, data) {
            return v != null || v ? '最大值:' + v : '';
        },
        'min' : function(v, params, data) {
            return v != null || v ? '最小值:' + v : '';
        },
        'average' : function(v, params, data) {
            return v != null || v ? '平均值:' + v : '';
        }
    };
})();
Ext.ns("Rs.ext.grid");

(function() {
    /**
     * @class Rs.ext.grid.GridPageSummary 表格当前页合计行插件
     * @extends Ext.util.Observable
     */
    Rs.ext.grid.GridPageSummary = function(config) {
        Ext.apply(this, config);
    };

    Ext.extend(Rs.ext.grid.GridPageSummary, Ext.util.Observable, {
        init: function(grid) {
            this.grid = grid;
            this.cm = grid.getColumnModel();
            this.view = grid.getView();
            var v = this.view;

            v.doRender = this.doRender.createDelegate(this);
            v.afterMethod('onUpdate', this.refreshPageSummary, this);
            v.afterMethod('onRemove', this.refreshPageSummary, this);

            // update summary row on store's add / remove / clear events
            grid.store.on('add', this.refreshPageSummary, this);
            grid.store.on('remove', this.refreshPageSummary, this);
            grid.store.on('clear', this.refreshPageSummary, this);

            if (!this.cellTpl) {
                this.cellTpl = new Ext.Template('<td class="x-grid3-col x-grid3-cell x-grid3-td-{id} {css}" style="{style}" tabIndex="0" {cellAttr}>', '<div class="x-grid3-pagesummary-cell-inner x-grid3-cell-inner x-grid3-col-{id}" unselectable="on" {attr}>{value}</div>', '</td>');
            }
            this.cellTpl.compile();

        },

        doRender: function(columns, records, store, startRow, colCount, stripe) {
            var templates = this.view.templates,
            cellTemplate = templates.cell,
            rowTemplate = templates.row,
            last = colCount - 1,
            tstyle = 'width:' + this.view.getTotalWidth() + ';',
            // buffers
            rowBuffer = [],
            colBuffer = [],
            rowParams = {
                tstyle: tstyle
            },
            meta = {},
            len = records.length,
            alt,
            column,
            record,
            i,
            j,
            rowIndex;

            //build up each row's HTML
            for (j = 0; j < len; j++) {
                record = records[j];
                colBuffer = [];

                rowIndex = j + startRow;

                //build up each column's HTML
                for (i = 0; i < colCount; i++) {
                    column = columns[i];
                    meta.id = column.id;
                    meta.css = i === 0 ? 'x-grid3-cell-first ': (i == last ? 'x-grid3-cell-last ': '');
                    meta.attr = meta.cellAttr = '';
                    meta.style = column.style;
                    meta.value = column.renderer.call(column.scope, record.data[column.name], meta, record, rowIndex, i, store);

                    if (Ext.isEmpty(meta.value)) {
                        meta.value = '&#160;';
                    }

                    if (this.markDirty && record.dirty && typeof record.modified[column.name] != 'undefined') {
                        meta.css += ' x-grid3-dirty-cell';
                    }

                    colBuffer[colBuffer.length] = cellTemplate.apply(meta);
                }

                alt = [];
                //set up row striping and row dirtiness CSS classes
                if (stripe && ((rowIndex + 1) % 2 === 0)) {
                    alt[0] = 'x-grid3-row-alt';
                }

                if (record.dirty) {
                    alt[1] = ' x-grid3-dirty-row';
                }

                rowParams.cols = colCount;

                if (this.getRowClass) {
                    alt[2] = this.view.getRowClass(record, rowIndex, rowParams, store);
                }

                rowParams.alt = alt.join(' ');
                rowParams.cells = colBuffer.join('');

                rowBuffer[rowBuffer.length] = rowTemplate.apply(rowParams);
            }
            var el = Ext.get(this.view.mainBody.dom.childNodes[this.view.mainBody.dom.childNodes.length - 1]);
            if (el && el.hasClass && el.hasClass('x-grid3-pagesummary-row')) {
                el.remove();
            }
            rowBuffer[rowBuffer.length] = this.refreshSummary();
            return rowBuffer.join('');
        },

        calculate: function(rs, cs) {
            var data = {},
            fieldData = {},
            avgData = {},
            r, c, cfg = this.cm.config,
            cf, oldName;
            var addlineflag = this.addline ? this.addline: 0;
            for (var i = 0,
            len = cs.length; i < len; i++) {
                c = cs[i];
                cf = cfg[i];
                for (var j = 0,
                jlen = rs.length; j < jlen; j++) {
                    r = rs[j];
                    if (cf && cf.summaryType) {
                        if (!data[c.name]) {
                            data[c.name] = {};
                        }
                        data[c.name][cf.summaryType] = Rs.ext.grid.GridSummary.Calculations[cf.summaryType](data[c.name][cf.summaryType] || 0, r, c.name, data[c.name][cf.summaryType], data[c.name]);
                    }
                }
            }
            return data;
        },

        onLayout: function(vw, vh) {
            if ('number' != Ext.type(vh)) {
                return;
            }
            if (!this.grid.getGridEl().hasClass('x-grid-hide-gridsummary')) {
                this.scroller.setHeight(vh - this.summary.getHeight());
            }
        },

        syncSummaryScroll: function() {
            var mb = this.view.scroller.dom;
            this.view.summaryWrap.dom.scrollLeft = mb.scrollLeft;
            this.view.summaryWrap.dom.scrollLeft = mb.scrollLeft;
        },

        doWidth: function(col, w, tw) {
            var s = this.view.summary.dom;
            s.firstChild.style.width = tw;
            s.firstChild.rows[0].childNodes[col].style.width = w;
        },

        doAllWidths: function(ws, tw) {
            var s = this.view.summary.dom,
            wlen = ws.length;
            s.firstChild.style.width = tw;
            cells = s.firstChild.rows[0].childNodes;
            for (var j = 0; j < wlen; j++) {
                cells[j].style.width = ws[j];
            }
        },

        doHidden: function(col, hidden, tw) {
            var s = this.view.summary.dom;
            var display = hidden ? 'none': '';
            s.firstChild.style.width = tw;
            s.firstChild.rows[0].childNodes[col].style.display = display;
        },
        putSumInfo: null,

        refreshSumValue: function() {
            if (!this.view.summaryWrap) {
                this.view.summaryWrap = Ext.DomHelper.insertAfter(this.view.scroller, {
                    tag: 'div',
                    cls: 'x-grid3-gridsummary-row-inner'
                },
                true);
            } else {
                this.view.summary.remove();
            }
            this.view.summary = this.view.summaryWrap.insertHtml('afterbegin', this.putSumInfo, true);
        },

        renderSummary: function(o, cs) {
            cs = cs || this.view.getColumnData();
            var cfg = this.cm.config;
            var buf = [],
            c,
            p = {},
            cf,
            last = cs.length - 1,
            pp = {},
            tstyle = 'width:' + this.view.getTotalWidth() + ';',
            rowParams = {
                tstyle: tstyle
            };

            for (var i = 0,
            len = cs.length; i < len; i++) {

                c = cs[i];
                cf = cfg[i];
                p.id = c.id;
                p.style = c.style;
                p.css = i == 0 ? 'x-grid3-cell-first ': (i == last ? 'x-grid3-cell-last ': '');
                var st = cf.summaryType;
                if (st || cf.summaryRenderer) {
                    var sr = Rs.ext.grid.GridPageSummary.SummaryRenderer[st];
                    p.value = (cf.summaryRenderer || sr || c.renderer)(o.data[c.name][cf.summaryType], p, o);
                } else {
                    p.value = '';
                }
                if (p.value == undefined || p.value === "") p.value = "&#160;";
                buf[buf.length] = this.cellTpl.apply(p);
            }

            rowParams.alt = 'x-grid3-pagesummary-row';
            rowParams.cells = buf.join('');

            return rowParams; //this.pageSummary = this.view.templates.row.apply(rowParams);
        },

        refreshSummary: function() {
            if (this.putSumInfo) {
                return this.putSumInfo;
            }
            var g = this.grid,
            ds = g.store;
            var cs = this.view.getColumnData();
            var rs = ds.getRange();
            var data = this.calculate(rs, cs);
            var buf = this.renderSummary({
                data: data
            },
            cs);
            return this.pageSummary = this.view.templates.row.apply(buf);
        },

        refreshPageSummary: function() {
            if (this.putSumInfo) {
                return this.putSumInfo;
            }
            var g = this.grid,
            ds = g.store;
            var cs = this.view.getColumnData();
            var rs = ds.getRange();
            if (this.pageSummary) {
                var data = this.calculate(rs, cs);
                var buf = this.renderSummary({
                    data: data
                },
                cs);
                var row = this.view.mainBody.dom.childNodes[this.view.mainBody.dom.childNodes.length - 1];
                row.innerHTML = this.view.templates.rowInner.apply(buf);
            }
        },

        toggleSummary: function(visible) {
            var el = this.grid.getGridEl();
            if (el) {
                if (visible === undefined) {
                    visible = el.hasClass('x-grid-hide-gridsummary');
                }
                el[visible ? 'removeClass': 'addClass']('x-grid-hide-gridsummary');
                this.view.layout();
            }
        },

        /**
         * 获取合计行
         * 
         * @return {HTMLElement/Ext.Element}
         */
        getSummaryNode: function() {
            return this.view.summary;
        }
    });

    Rs.ext.grid.GridPageSummary.SummaryRenderer = {

        'count' : function(v, params, data) {
            return v != null || v ? '共' + v + '条' : '';
        },
        'sum' : function(v, params, data) {
            return v != null || v ? '合计值:' + v : '';
        },
        'max' : function(v, params, data) {
            return v != null || v ? '最大值:' + v : '';
        },
        'min' : function(v, params, data) {
            return v != null || v ? '最小值:' + v : '';
        },
        'average' : function(v, params, data) {
            return v != null || v ? '平均值:' + v : '';
        }
    };

})();
Ext.ns("Rs.ext.grid");

(function() {

    /**
     * @class Rs.ext.grid.HybridGridSummary
     * 实现服务器端合计和当页数据合计
     * @extend Rs.ext.grid.GridSummary
     * <pre><code>
     *  {
     *      data: [
     *          {
     *              projectId: 100,     project: 'House',
     *              taskId:    112, description: 'Paint',
     *              estimate:    6,        rate:     150,
     *              due:'06/24/2007'
     *          },
     *          ...
     *      ],
     * 
     *      summaryData: {
     *              description: 14, 
     *              estimate: 9,
     *              rate: 99, 
     *              due: new Date(2009, 6, 29),
     *              cost: 999
     *          }
     *  }
     * </code></pre> 
     * 
     */
    Rs.ext.grid.HybridGridSummary = function(config) {
        Rs.ext.grid.HybridGridSummary.superclass.constructor.apply(this, arguments);
    };

    Ext.extend(Rs.ext.grid.HybridGridSummary, Rs.ext.grid.GridSummary, {
        
    	init: function(grid) {
            Rs.ext.grid.HybridGridSummary.superclass.init.apply(this, arguments);    		
    	},
    	
        calculate: function(rs, cs) {
            var gdata = this.getSummaryData();
            return gdata || Rs.ext.grid.HybridGridSummary.superclass.calculate.call(this, rs, cs);
        },

        getSummaryData: function() {
            var reader = this.grid.getStore().reader,
            json = reader.jsonData,
            fields = reader.recordType.prototype.fields,
            v;

            if (json && json.summaryData) {
                v = json.summaryData;
                if (v) {
                    return this.extractValues(v, fields.items, fields.length);
                }
            }
            return null;
        },

        extractValues: function(data, items, len) {
            var reader = this.grid.getStore().reader;
            var cfg = this.cm.config;
            var f, values = {} ;
            for (var j = 0; j < len; j++) {
                f = items[j];
                var v = reader.ef[j](data);
                values[f.name] = f.convert((v !== undefined) ? v: f.defaultValue, data);
            }
            return values;
        },

        /* 
          * @param {Object} data data object
          * @param {Boolean} skipRefresh (Optional) Defaults to false
          * */
        updateSummaryData: function(data, skipRefresh) {
            var json = this.grid.getStore().reader.jsonData;
            if (!json.summaryData) {
                json.summaryData = {};
            }
            json.summaryData = data;
            if (!skipRefresh) {
                this.refreshSummary();
            }
        },
        renderResultValue: function(cf, p, o, c) {
            if (cf.summaryType || cf.summaryRenderer) {
                var sr = Rs.ext.grid.HybridGridSummary.SummaryRenderer[cf.summaryType];
                var value ;
                if (o.data[c.name]) {
                    value =  (cf.summaryRenderer || sr || c.renderer)(o.data[c.name][cf.summaryType], p, o);
                } else {
                    value = (cf.summaryRenderer || sr || c.renderer)(o.data[c.name], p, o);
                }
                if(value.search("null") > -1){ //表示有null,需要去掉
                    return '' ;
                } else if (value.search("共:0条") > -1){
                    return '' ;
                }
                return value ;
            } else {
                return '';
            }
        },
        refreshSummary: function() {
            if (this.putSumInfo) {
                this.refreshSumValue(this.putSumInfo);
                return;
            }
            var g = this.grid,
            ds = g.store;
            var cs = this.view.getColumnData();
            var rs = ds.getRange();
            var data = this.calculate(rs, cs);
            var buf = this.renderSummary({
                data: data
            },
            cs);
            if (!this.view.totalsummaryWrap) {
                this.view.totalsummaryWrap = Ext.DomHelper.insertAfter(this.view.scroller, {
                    tag: 'div',
                    cls: 'x-grid3-gridsummary-row-inner'
                },
                true);
            } else {
                this.view.totalsummary.remove();
            }
            this.view.totalsummary = this.view.totalsummaryWrap.insertHtml('afterbegin', buf, true);
        },

        refreshSumValue: function() {
            if (!this.view.totalsummaryWrap) {
                this.view.totalsummaryWrap = Ext.DomHelper.insertAfter(this.view.scroller, {
                    tag: 'div',
                    cls: 'x-grid3-gridsummary-row-inner'
                },
                true);
            } else {
                this.view.totalsummary.remove();
            }
            this.view.totalsummary = this.view.summaryWrap.insertHtml('afterbegin', this.putSumInfo, true);
        },

        setSumValue: function(jsonV) {
            var cs = this.view.getColumnData();
            var buf = [],
            c,
            p = {},
            last = cs.length - 1;

            for (var i = 0,
            len = cs.length; i < len; i++) {
                c = cs[i];
                p.id = c.id;
                p.style = c.style;
                p.css = i == 0 ? 'x-grid3-cell-first ': (i == last ? 'x-grid3-cell-last ': '');
                if (jsonV && jsonV[c.name]) {
                    p.value = jsonV[c.name];
                } else {
                    p.value = '';
                }
                if (p.value == undefined || p.value === "") p.value = " ";
                buf[buf.length] = this.cellTpl.apply(p);
            }
            if (!this.view.totalsummaryWrap) {
                this.view.totalsummaryWrap = Ext.DomHelper.insertAfter(this.view.scroller, {
                    tag: 'div',
                    cls: 'x-grid3-gridsummary-row-inner'
                },
                true);
            } else {
                this.view.totalsummary.remove();
            }
            this.putSumInfo = this.rowTpl.apply({
                tstyle: 'width:' + this.view.getTotalWidth() + ';',
                cells: buf.join('')
            });
            this.view.totalsummary = this.view.totalsummaryWrap.insertHtml('afterbegin', this.putSumInfo, true);
        },

        onLayout: function(vw, vh) {
            if ('number' != Ext.type(vh)) {
                return;
            }
            if (!this.grid.getGridEl().hasClass('x-grid-hide-gridsummary')) {
                this.scroller.setHeight(vh - (this.summary ? this.summary.getHeight() : 0) - this.totalsummary.getHeight());
            }
        },

        /**
         * 解决滚动条问题
         */
        syncSummaryScroll: function() {
            Rs.ext.grid.HybridGridSummary.superclass.syncSummaryScroll.apply(this, arguments);
            var mb = this.view.scroller.dom;
            if (this.view.totalsummaryWrap) {
                this.view.totalsummaryWrap.dom.scrollLeft = mb.scrollLeft;
                this.view.totalsummaryWrap.dom.scrollLeft = mb.scrollLeft;
            }
        },

        doWidth: function(col, w, tw) {
            Rs.ext.grid.HybridGridSummary.superclass.doWidth.apply(this, arguments);
            if (this.view.totalsummary) {
                var s = this.view.totalsummary.dom;
                s.firstChild.style.width = tw;
                s.firstChild.rows[0].childNodes[col].style.width = w;
            }
        } ,
        
        doAllWidths: function(ws, tw) {
            var s = this.view.totalsummary.dom,
            wlen = ws.length;
            s.firstChild.style.width = tw;
            cells = s.firstChild.rows[0].childNodes;
            for (var j = 0; j < wlen; j++) {
                cells[j].style.width = ws[j];
            }
        },

        doHidden: function(col, hidden, tw) {
            var s = this.view.totalsummary.dom;
            var display = hidden ? 'none': '';
            s.firstChild.style.width = tw;
            s.firstChild.rows[0].childNodes[col].style.display = display;
        }

    });

    Rs.ext.grid.HybridGridSummary.SummaryRenderer = {

        'count': function(v, params, data) {
            return v ? v: '';
        },
        'sum': function(v, params, data) {
            return v ? v: '';
        },
        'max': function(v, params, data) {
            return v ? v: '';
        },
        'min': function(v, params, data) {
            return v ? v: '';
        },
        'average': function(v, params, data) {
            return v ? v: '';
        }
    };

})();
Ext.ns("Rs.ext.grid");

(function(){
    /**
     * @class Rs.ext.grid.GroupSummary
     * @extends Ext.util.Observable
     * A GridPanel plugin that enables dynamic column calculations and a dynamically
     * updated grouped summary row.
     */
    Rs.ext.grid.GroupSummary = Ext.extend(Ext.util.Observable, {
        /**
         * @cfg {Function} summaryRenderer Renderer example:<pre><code>
    summaryRenderer: function(v, params, data){
        return ((v === 0 || v > 1) ? '(' + v +' Tasks)' : '(1 Task)');
    },
         * </code></pre>
         */
        /**
         * @cfg {String} summaryType (Optional) The type of
         * calculation to be used for the column.  For options available see
         * {@link #Calculations}.
         */

        constructor : function(config){
            Ext.apply(this, config);
            Rs.ext.grid.GroupSummary.superclass.constructor.call(this);
        },
        
        init : function(grid){
            this.grid = grid;
            var v = this.view = grid.getView();
            v.doGroupEnd = this.doGroupEnd.createDelegate(this);

            v.afterMethod('onColumnWidthUpdated', this.doWidth, this);
            v.afterMethod('onAllColumnWidthsUpdated', this.doAllWidths, this);
            v.afterMethod('onColumnHiddenUpdated', this.doHidden, this);
            v.afterMethod('onUpdate', this.doUpdate, this);
            v.afterMethod('onRemove', this.doRemove, this);

            if(!this.rowTpl){
                this.rowTpl = new Ext.Template(
                    '<div class="x-grid3-summary-row" style="{tstyle}">',
                    '<table class="x-grid3-summary-table" border="0" cellspacing="0" cellpadding="0" style="{tstyle}">',
                        '<tbody><tr>{cells}</tr></tbody>',
                    '</table></div>'
                );
                this.rowTpl.disableFormats = true;
            }
            this.rowTpl.compile();

            if(!this.cellTpl){
                this.cellTpl = new Ext.Template(
                    '<td class="x-grid3-col x-grid3-cell x-grid3-td-{id} {css}" style="{style}">',
                    '<div class="x-grid3-cell-inner x-grid3-col-{id}" unselectable="on">{value}</div>',
                    "</td>"
                );
                this.cellTpl.disableFormats = true;
            }
            this.cellTpl.compile();
        },

        /**
         * Toggle the display of the summary row on/off
         * @param {Boolean} visible <tt>true</tt> to show the summary, <tt>false</tt> to hide the summary.
         */
        toggleSummaries : function(visible){
            var el = this.grid.getGridEl();
            if(el){
                if(visible === undefined){
                    visible = el.hasClass('x-grid-hide-summary');
                }
                el[visible ? 'removeClass' : 'addClass']('x-grid-hide-summary');
            }
        },

        renderSummary : function(o, cs){
            cs = cs || this.view.getColumnData();
            var cfg = this.grid.getColumnModel().config,
                buf = [], c, p = {}, cf, last = cs.length-1;
            for(var i = 0, len = cs.length; i < len; i++){
                c = cs[i];
                cf = cfg[i];
                p.id = c.id;
                p.style = c.style;
                p.css = i == 0 ? 'x-grid3-cell-first ' : (i == last ? 'x-grid3-cell-last ' : '');
                if(cf.summaryType || cf.summaryRenderer){
                    p.value = (cf.summaryRenderer || c.renderer)(o.data[c.name], p, o);
                }else{
                    p.value = '';
                }
                if(p.value == undefined || p.value === "") p.value = "&#160;";
                buf[buf.length] = this.cellTpl.apply(p);
            }

            return this.rowTpl.apply({
                tstyle: 'width:'+this.view.getTotalWidth()+';',
                cells: buf.join('')
            });
        },

        /**
         * @private
         * @param {Object} rs
         * @param {Object} cs
         */
        calculate : function(rs, cs){
            var data = {}, r, c, cfg = this.grid.getColumnModel().config, cf;
            for(var j = 0, jlen = rs.length; j < jlen; j++){
                r = rs[j];
                for(var i = 0, len = cs.length; i < len; i++){
                    c = cs[i];
                    cf = cfg[i];
                    if(cf.summaryType){
                        data[c.name] = Rs.ext.grid.GroupSummary.Calculations[cf.summaryType](data[c.name] || 0, r, c.name, data);
                    }
                }
            }
            return data;
        },

        doGroupEnd : function(buf, g, cs, ds, colCount){
            var data = this.calculate(g.rs, cs);
            buf.push('</div>', this.renderSummary({data: data}, cs), '</div>');
        },

        doWidth : function(col, w, tw){
            if(!this.isGrouped()){
                return;
            }
            var gs = this.view.getGroups(),
                len = gs.length,
                i = 0,
                s;
            for(; i < len; ++i){
                s = gs[i].childNodes[2];
                s.style.width = tw;
                s.firstChild.style.width = tw;
                s.firstChild.rows[0].childNodes[col].style.width = w;
            }
        },

        doAllWidths : function(ws, tw){
            if(!this.isGrouped()){
                return;
            }
            var gs = this.view.getGroups(),
                len = gs.length,
                i = 0,
                j, 
                s, 
                cells, 
                wlen = ws.length;
                
            for(; i < len; i++){
                s = gs[i].childNodes[2];
                s.style.width = tw;
                s.firstChild.style.width = tw;
                cells = s.firstChild.rows[0].childNodes;
                for(j = 0; j < wlen; j++){
                    cells[j].style.width = ws[j];
                }
            }
        },

        doHidden : function(col, hidden, tw){
            if(!this.isGrouped()){
                return;
            }
            var gs = this.view.getGroups(),
                len = gs.length,
                i = 0,
                s, 
                display = hidden ? 'none' : '';
            for(; i < len; i++){
                s = gs[i].childNodes[2];
                s.style.width = tw;
                s.firstChild.style.width = tw;
                s.firstChild.rows[0].childNodes[col].style.display = display;
            }
        },
        
        isGrouped : function(){
            return !Ext.isEmpty(this.grid.getStore().groupField);
        },

        // Note: requires that all (or the first) record in the
        // group share the same group value. Returns false if the group
        // could not be found.
        refreshSummary : function(groupValue){
            return this.refreshSummaryById(this.view.getGroupId(groupValue));
        },

        getSummaryNode : function(gid){
            var g = Ext.fly(gid, '_gsummary');
            if(g){
                return g.down('.x-grid3-summary-row', true);
            }
            return null;
        },

        refreshSummaryById : function(gid){
            var g = Ext.getDom(gid);
            if(!g){
                return false;
            }
            var rs = [];
            this.grid.getStore().each(function(r){
                if(r._groupId == gid){
                    rs[rs.length] = r;
                }
            });
            var cs = this.view.getColumnData(),
                data = this.calculate(rs, cs),
                markup = this.renderSummary({data: data}, cs),
                existing = this.getSummaryNode(gid);
                
            if(existing){
                g.removeChild(existing);
            }
            Ext.DomHelper.append(g, markup);
            return true;
        },

        doUpdate : function(ds, record){
            this.refreshSummaryById(record._groupId);
        },

        doRemove : function(ds, record, index, isUpdate){
            if(!isUpdate){
                this.refreshSummaryById(record._groupId);
            }
        },

        /**
         * Show a message in the summary row.
         * <pre><code>
    grid.on('afteredit', function(){
        var groupValue = 'Ext Forms: Field Anchoring';
        summary.showSummaryMsg(groupValue, 'Updating Summary...');
    });
         * </code></pre>
         * @param {String} groupValue
         * @param {String} msg Text to use as innerHTML for the summary row.
         */
        showSummaryMsg : function(groupValue, msg){
            var gid = this.view.getGroupId(groupValue),
                 node = this.getSummaryNode(gid);
            if(node){
                node.innerHTML = '<div class="x-grid3-summary-msg">' + msg + '</div>';
            }
        }
    });
    

    /**
     * Calculation types for summary row:</p><div class="mdetail-params"><ul>
     * <li><b><tt>sum</tt></b> : <div class="sub-desc"></div></li>
     * <li><b><tt>count</tt></b> : <div class="sub-desc"></div></li>
     * <li><b><tt>max</tt></b> : <div class="sub-desc"></div></li>
     * <li><b><tt>min</tt></b> : <div class="sub-desc"></div></li>
     * <li><b><tt>average</tt></b> : <div class="sub-desc"></div></li>
     * </ul></div>
     * <p>Custom calculations may be implemented.  An example of
     * custom <code>summaryType=totalCost</code>:</p><pre><code>
    // define a custom summary function
    Rs.ext.grid.GroupSummary.Calculations['totalCost'] = function(v, record, field){
        return v + (record.data.estimate * record.data.rate);
    };
     * </code></pre>
     * @property Calculations
     */
    Rs.ext.grid.GroupSummary.Calculations = {
        'sum' : function(v, record, field){
            return v + (record.data[field]||0);
        },

        'count' : function(v, record, field, data){
            return data[field+'count'] ? ++data[field+'count'] : (data[field+'count'] = 1);
        },

        'max' : function(v, record, field, data){
            var v = record.data[field];
            var max = data[field+'max'] === undefined ? (data[field+'max'] = v) : data[field+'max'];
            return v > max ? (data[field+'max'] = v) : max;
        },

        'min' : function(v, record, field, data){
            var v = record.data[field];
            var min = data[field+'min'] === undefined ? (data[field+'min'] = v) : data[field+'min'];
            return v < min ? (data[field+'min'] = v) : min;
        },

        'average' : function(v, record, field, data){
            var c = data[field+'count'] ? ++data[field+'count'] : (data[field+'count'] = 1);
            var t = (data[field+'total'] = ((data[field+'total']||0) + (record.data[field]||0)));
            return t === 0 ? 0 : t / c;
        }
    };
    
})();
Ext.ns("Rs.ext.grid");

(function() {
    /**
     * @class Rs.ext.grid.HybridGroupSummary
     * @extends Rs.ext.grid.GroupSummary Adds capability to specify the summary
     *          data for the group via json as illustrated here:
     * 
     * <pre><code>
     *  {
     *      data: [
     *          {
     *              projectId: 100,     project: 'House',
     *              taskId:    112, description: 'Paint',
     *              estimate:    6,        rate:     150,
     *              due:'06/24/2007'
     *          },
     *          ...
     *      ],
     * 
     *      groupSummaryData: {
     *          'House': {
     *              description: 14, estimate: 9,
     *                     rate: 99, due: new Date(2009, 6, 29),
     *                     cost: 999
     *          }
     *      }
     *  }
     * </code></pre>
     */
    Rs.ext.grid.HybridGroupSummary = function(config) {
        Rs.ext.grid.HybridGroupSummary.superclass.constructor.apply(this,
            arguments);
    };

    Ext.extend(Rs.ext.grid.HybridGroupSummary, Rs.ext.grid.GroupSummary, {
        /**
         * @private
         * @param {Object}
         *            rs
         * @param {Object}
         *            cs
         */
        calculate : function(rs, cs) {
            var gcol = this.view.getGroupField(), gvalue =
                    rs[0].data[gcol], gdata =
                    this.getGroupSummaryData(gvalue);
            return gdata
                || Rs.ext.grid.HybridGroupSummary.superclass.calculate.call(
                    this, rs, cs);
        },

        /**
         * <pre><code>
         * grid.on('afteredit', function() {
         *  var groupValue = 'Ext Forms: Field Anchoring';
         *  summary.showSummaryMsg(groupValue, 'Updating Summary...');
         *  setTimeout(function() { // simulate server call
         *          // HybridGroupSummary class implements updateSummaryData
         *          summary.updateSummaryData(groupValue,
         *          // create data object based on configured dataIndex
         *              {
         *                  description : 22,
         *                  estimate : 888,
         *                  rate : 888,
         *                  due : new Date(),
         *                  cost : 8
         *              });
         *      }, 2000);
         * });
         * </code></pre>
         * 
         * @param {String}
         *            groupValue
         * @param {Object}
         *            data data object
         * @param {Boolean}
         *            skipRefresh (Optional) Defaults to false
         */
        updateSummaryData : function(groupValue, data, skipRefresh) {
            var json = this.grid.getStore().reader.jsonData;
            if(!json.summaryData) {
                json.summaryData = {};
            }
            json.summaryData[groupValue] = data;
            if(!skipRefresh) {
                this.refreshSummary(groupValue);
            }
        },

        /**
         * Returns the summaryData for the specified groupValue or null.
         * 
         * @param {String}
         *            groupValue
         * @return {Object} summaryData
         */
        getGroupSummaryData : function(groupValue) {
            var reader = this.grid.getStore().reader, json =
                    reader.jsonData, fields =
                    reader.recordType.prototype.fields, v;

            if(json && json.groupSummaryData) {
                v = json.groupSummaryData[groupValue];
                if(v) {
                    return reader.extractValues(v, fields.items,
                        fields.length);
                }
            }
            return null;
        }
    });
})();
Ext.ns("Rs.ext.grid");
(
function(){
    /**
     * @class Rs.ext.grid.ExportButton
     * 表格数据导出按钮
     * @extends Ext.Button
     * @constructor
     * @param {Object} config 
     */
    Rs.ext.grid.ExportButton = Ext.extend(Ext.Button,{
        /**
         * @cfg {Object} grid 导出按钮绑定的表格
         */
        /**
         * @cfg {String} filename 导出文件名
         */
        /**
         * @cfg {Boolean} paging 是否分页，默认为false
         */
        paging : false,
        
        /**
         * @cfg {String} text 导出按钮上显示的内容,默认为导出CSV文件
         */
        text: '导出CSV文件',
        
        iconCls : 'rs-action-export',
        /**
         * @cfg {Boolean} visibleOnly 是否导出隐藏列，默认为true ,flase 表示导出所有列,包括隐藏列 , true 只导出显示列
         */
        visibleOnly : true,
        
        /**
         * @cfg {Array} headers 指定导出的表头二维数组，默认为表格当前列名，例：
         * * <pre><code>
         [["第一列字段名","第一列表头名"],["第二列字段名","第二列表头名"]]
         * </code></pre>
         */
        /*
         * private
         */
        handler : function(){
            var store = this.grid.getStore();
            //var bp = store.baseParams ;
            var bp = store.lastOptions.params;
            if(typeof(bp) =='undefined' ){
                bp = store.baseParams ;
            }
            /*if(!this.header){
                this.header = this.getHeader();
            }*/
            this.header = this.getHeader();
            var service = new Rs.data.Service({
                url : store.readUrl || store.url,
                method : 'export',
                accept : 'json',
                timeout : 3000000
            });
            //当用户点击导出按钮后
            //this.setText("生成CSV文件");  //将按钮上的内容替换成"生成CSV文件"
            this.setIconClass('rs-action-exporting');//并设置图标样式为"rs-action-exporting"
            this.disable();//将按钮设置成disable状态,防止用户重复点击导出
            this.removeClass(this.disabledClass);//移除设置disable状态的样式
            
            service.call( {
                params : { 
                    params : Ext.apply({
                        header : this.header,
                        paging : this.paging
                    }, bp)
                }
            },
            
            function(fileinfo) {
                //导出完成后             
                this.enable();//将按钮状态修改为可点击状态   
                //this.setText("导出CSV文件");//将按钮上的内容替换成"导出CSV文件"
                this.setIconClass("rs-action-export");//并设置图标样式为"rs-action-export"
                
                var frame = Ext.fly(this.id+"-iframe");
                if(frame){
                    frame.remove();
                }
                frame = Ext.DomHelper.append(Ext.getBody(), {
                    tag : "div",
                    id : this.id+"-iframe",
                    style : "display:none",
                    html : "<iframe src='/rsc/rsclient/export?sfilename=" 
                        + fileinfo.filename
                        + "&cfilename=" + encodeURIComponent(encodeURIComponent(this.filename+".csv"))+"'></iframe>"
                });
            }, this);
        },

        /*
         * private
         */
        getHeader : function(){
            var header = [];
            var colModle = this.grid.getColumnModel();
            var colnumbers = colModle.getColumnCount();
            if(this.visibleOnly){ //true 只导出显示列
                for(var i = 0; i < colnumbers; i++){
                    if(!colModle.isHidden(i)){
                        var index = colModle.getDataIndex(i);
                        if(index){
                            var colHeader = [];
                            colHeader[0] = index;
                            colHeader[1] = colModle.getColumnHeader(i);
                            colHeader[2] = colModle.config[i].summaryType,
                            header.push(colHeader);
                        }
                    }
                }
            } else{ //false 导出所有列
                for(var i = 0; i < colnumbers; i++){
                    var index = colModle.getDataIndex(i);
                    if(index){
                        var colHeader = [];
                        colHeader[0] = index;
                        colHeader[1] = colModle.getColumnHeader(i);
                        colHeader[2] = colModle.config[i].summaryType,
                        header.push(colHeader);
                    }
                }
            }
            return header;
        }
    });
}
)();
Ext.ns("Rs.ext.grid");

(function(){
    
    /**
     * @class Rs.ext.grid.TreeColumn  树表格之树列
     * @extends Ext.grid.Column
     * @constructor {Object} cfg
     */
    Rs.ext.grid.TreeColumn = function(cfg){
        cfg = Ext.apply(cfg || {}, {});
        Rs.ext.grid.TreeColumn.superclass.constructor.call(this, cfg);
    };
    
    Ext.extend(Rs.ext.grid.TreeColumn, Ext.grid.Column, {
        
        emptyIcon : Ext.BLANK_IMAGE_URL,
        
        /**
         * @param {Object} value
         * @param {Object} metaData
         * @param {Record} record
         * @param {number} rowIdx
         * @param {number} colIdx
         * @param {Store} store
         * @param {View} view
         * @private
         */
        renderer : function(value, metaData, record, rowIdx, colIdx, store, view) {
            var n = record.node,
                a = n.attributes,
                buf,
                cb = false, //Ext.isBoolean(a.checked),
                href = this.getHref(a.href);
            buf = ['<div class="x-tree-root-ct x-tree-arrows x-tree-root-node x-tree-node"><div ext:tree-node-id="', n.id, 
                   '" class="x-tree-node-el ' + (n.isLeaf()?'x-tree-node-leaf':n.isExpandable()&&n.isExpanded()?'x-tree-node-expanded':'x-tree-node-collapsed') + ' x-unselectable ', a.cls,'" unselectable="on">',
                   '<span class="x-tree-node-indent">', this.getChildIndent(n), "</span>",
                   '<img alt="" src="', this.emptyIcon, '" class="x-tree-ec-icon '+ (n.isLeaf()?"x-tree-elbow-end":n.isExpandable()&&n.isExpanded()?'x-tree-elbow-minus':'x-tree-elbow-plus')+ '" />',
                   '<img alt="" src="', a.icon || this.emptyIcon, '" class="x-tree-node-icon',(a.icon ? " x-tree-node-inline-icon" : ""),(a.iconCls ? " "+a.iconCls : ""),'" unselectable="on" />',
                   cb ? ('<input class="x-tree-node-cb" type="checkbox" ' + (a.checked ? 'checked="checked" />' : '/>')) : '',
                   '<a hidefocus="on" class="x-tree-node-anchor" href="',href,'" tabIndex="1" ',
                    a.hrefTarget ? ' target="'+a.hrefTarget+'"' : "", '><span unselectable="on">', value, "</span></a></div>",
                   '<ul class="x-tree-node-ct" style="display:none;"></ul>',
                   "</div>"];
            return buf.join('');
        },
        
        
        //private
        getHref : function(href){
            return Ext.isEmpty(href) ? (Ext.isGecko ? '' : '#') : href;
        }, 
        
        //private
        getChildIndent : function(node){
            var buf = [],
                p = node ? node.parentNode : null;
            while(p){
                if(!p.isRoot || (p.isRoot && p.ownerTree.rootVisible)){
                    if(!p.isLast()) {
                        buf.unshift('<img alt="" src="'+this.emptyIcon+'" class="x-tree-elbow-line" />');
                    } else {
                        buf.unshift('<img alt="" src="'+this.emptyIcon+'" class="x-tree-icon" />');
                    }
                }
                p = p.parentNode;
            }
            return buf.join("");
        }, 
        
        //private
        processEvent : function(name, e, grid, rowIndex, colIndex){
            var m = e.getTarget().className.match(/x-tree-ec-icon/);
            if (m) {
                if (name == 'click' || name == 'mousedown') {
                    var store = grid.getStore(), record, node;
                    if(store && (record = store.getAt(rowIndex)) && (node = record.node)){
                        if(node.isExpanded()){
                            store.collapse(record , true);
                        }else {
                            store.expand(record);
                        }
                    }
                }
            }
            return Rs.ext.grid.TreeColumn.superclass.processEvent.apply(this, arguments);
        }
        
    });

    Ext.grid.Column.types['treecolumn'] = Rs.ext.grid.TreeColumn;   
    
})();
Ext.ns("Rs.ext.grid");

(function(){
    
    var Node = function(config, record) {
        
        this.idProperty = config && config.idProperty ? config.idProperty : 'id';
        delete config.idProperty;
        
        Node.superclass.constructor.call(this, config);
        //record 和 node 相互持有引用
        if(record != undefined){
            this.record = record;
            record.node = this;
        }
        this.addEvents(

            'beforeexpand', 
            
            'expand', 
            
            'beforecollapse', 
            
            'collapse');
    };

    Ext.extend(Node, Ext.tree.AsyncTreeNode, {
        
        //private
        isNode : true,
        
        //private
        loading : -1,
        
        //
        getId : function(){
            return this.id;
        },

        //
        isExpanded : function() {
            return this.expanded === true;
        },

        //
        isLoaded : function() {
            return this.loading > 0;
        },
        
        //
        setLoaded : function(loaded){
            loaded === true ? (this.loading = 1) : null;
        },
        
        //
        isLoading : function() {
            return this.loading === 0;
        }, 
        
        //
        setLoading : function(loading){
            loading === true ? (this.loading = 0): null;
        },
        
        
        //
        isLeaf : function() {
            return this.attributes.leaf === true;
        },      
        
        ///
        createNode: function(record) {
            if(record && record.isNode === true){
                return record;
            }else if(record.data != undefined){
                var data = record.data;
                node = new Node(Ext.apply(data, {
                    id : data[this.idProperty],
                    idProperty : this.idProperty
                }), record);
                return node;
            };
        },
        
        //
        appendChild : function(node){
            var me = this,
                i, ln;
            if (Ext.isArray(node)) {
                for (i = 0, ln = node.length; i < ln; i++) {
                    me.appendChild(node[i]);
                }
            } else {
                node = me.createNode(node);
                if(node != undefined){
                    return Node.superclass.appendChild.call(this, node);
                }
            }
        }, 
        
        //private
        expand : function(recursive, callback, scope){
            var me = this;
            if(!me.isLeaf() && !me.isExpanded()){
                me.fireEvent('beforeexpand', me, function(nodes){
                    me.expanded = true;
                    me.fireEvent('expand', me, me.childNodes);
                    if (recursive === true) {
                        me.expandChildren(true, callback, scope);
                    }else {
                        me.runCallback(callback, scope || me, [me.childNodes]);
                    }
                }, scope);
            }else {
                me.runCallback(callback, scope || me);
            }
        }, 
        
        //private
        expandChildren: function(recursive, callback, scope) {
            var me = this,
                i = 0,
                nodes = me.childNodes,
                ln = nodes.length,
                node,
                expanding = 0;
            for (; i < ln; ++i) {
                node = nodes[i];
                if (!node.isLeaf() && !node.isExpanded()) {
                    expanding++;
                    nodes[i].expand(recursive, function () {
                        expanding--;
                        if (callback && !expanding) {
                            me.runCallback(callback, scope || me, me.childNodes); 
                        }
                    }, me);
                }
            }
            if (!expanding && callback) {
                me.runCallback(callback, scope || me, me.childNodes);
            }
        }, 
        
        
        removeChild : function(node, destroy){
            //this.ownerTree.getSelectionModel().unselect(node);
            Ext.tree.TreeNode.superclass.removeChild.apply(this, arguments);
            
            if(!destroy){
                var rendered = node.ui.rendered;
                
                if(rendered){
                    node.ui.remove();
                }
                if(rendered && this.childNodes.length < 1){
                    this.collapse(false, false);
                }else{
                    this.ui.updateExpandIcon();
                }
                if(!this.firstChild && !this.isHiddenRoot()){
                    this.childrenRendered = false;
                }
            }
            return node;
        },
        
        destroy : function(silent){
            Ext.tree.TreeNode.superclass.destroy.call(this, silent);
            Ext.destroy(this.ui, this.loader);
            this.ui = this.loader = null;
        },
        
        //private
        collapse: function(recursive, callback, scope) {
            var me = this;
            if (!me.isLeaf() && me.isExpanded()) {
                me.fireEvent('beforecollapse', me, function(nodes) {
                    me.expanded = false;
                    if (recursive) {
                        me.collapseChildren(true, callback, scope);
                        me.fireEvent('collapse', me, me.childNodes, false);
                    }else {
                        me.fireEvent('collapse', me, me.childNodes, false);
                        me.runCallback(callback, scope || me, [me.childNodes]);
                    }
                }, me);
            }else {
                me.runCallback(callback, scope || me);
            }
        },
        
        //private
        collapseChildren: function(recursive, callback, scope) {
            var me = this,
                i = 0,
                nodes = me.childNodes,
                ln = nodes.length,
                node,
                collapsing = 0;
            
            for (; i < ln; ++i) {
                node = nodes[i];
                if (!node.isLeaf() && node.isExpanded()) {
                    collapsing++;
                    nodes[i].collapse(recursive, function () {
                        collapsing--;
                        if (callback && !collapsing) {
                            me.runCallback(callback, scope || me, me.childNodes); 
                        }
                    });                            
                }
            }
            if (!collapsing && callback) {
                me.runCallback(callback, scope || me, me.childNodes);
            }
        },
        
        //private
        runCallback : function(cb, scope, args){
            if(Ext.isFunction(cb)){
                cb.apply(scope, args);
            }
        }
        
    });
    
    //private
    var Tree = function(config){
        Tree.superclass.constructor.call(this, config);
    };
    
    Ext.extend(Tree, Ext.data.Tree, {
        
        //proxyNodeEvent
        proxyNodeEvent : function(ename, node, a1, a2, a3, a4, a5){
            if(ename == 'collapse' || ename == 'expand' || ename == 'beforecollapse' || ename == 'beforeexpand' || ename == 'move' || ename == 'beforemove'){
                ename = ename+'record';
            }
            if(ename == 'expandrecord' || ename == 'collapserecord'){
                var pr = node.record, cr = []; 
                if(Ext.isArray(a1)){
                    for(var i = 0, l = a1.length; i < l; i++){
                        if(a1[i] != undefined && a1[i].isNode && a1[i].record != undefined){
                            cr.push(a1[i].record);
                        }
                    }
                }else if(a1 != undefined && a1.isNode && a1.record != undefined){
                    cr.push(a1.record);
                }
                return this.fireEvent(ename, pr, cr, a2, a3, a4, a5);
            }else {
                var pr = node.record;
                if(node.isRoot || pr != undefined){
                    return this.fireEvent(ename, pr, a1, a2, a3, a4, a5);
                }
            }
        }
    
    });
    
    
    /**
     * @class Rs.ext.grid.TreeStore
     * TreeStore 类
     * @extends Rs.ext.data.Store
     * @constructor {Object} config
     */
    Rs.ext.grid.TreeStore = function(config){
        var me = this, 
            root,
            fields;
        config = Ext.apply({}, config);
        fields = config.fields || me.fields;
        if (!fields) {
            config.fields = [{name: 'text', type: 'string'}];
        }
        me.tree = new Ext.data.Tree();
        // 重写Ext.data.Tree的proxyNodeEvent方法,修改传入参数
        me.tree = new Tree();
        root = me.root;
        if (root) {
            delete me.root;
            me.setRootRecord(root);
        }
        
        // TODO :
        me.tree.on({
            scope: me,
            remove: me.onRemoveRecord,
            
            beforeexpandrecord : me.onBeforeExpandRecord,
            expandrecord : me.onExpandRecord,
            beforecollapserecord : me.onBeforeCollapseRecord,
            collapserecord : me.onCollapseRecord,
            beforeinsertrecord : me.onBeforeExpandRecord,
            insertrecord: me.onExpandRecord,
            
            beforemoverecord : me.onBeforeMoveRecord,
            moverecord : me.onMoveRecord
        });
        
        this.autoLoad = false;
        Rs.ext.grid.TreeStore.superclass.constructor.call(this, Ext.apply(config, {
            root : this.defaultRootProperty
        }));
        
        me.relayEvents(me.tree, [
             /**
                 * @event append Fires when a new child node is appended to a
                 *        node in this store's tree.
                 * @param {Tree}
                 *            tree The owner tree
                 * @param {Node}
                 *            parent The parent node
                 * @param {Node}
                 *            node The newly appended node
                 * @param {Number}
                 *            index The index of the newly appended node
                 */
             "append",
             
             /**
                 * @event remove Fires when a child node is removed from a node
                 *        in this store's tree.
                 * @param {Tree}
                 *            tree The owner tree
                 * @param {Node}
                 *            parent The parent node
                 * @param {Node}
                 *            node The child node removed
                 */
             "remove",
             
             /**
                 * @event move Fires when a node is moved to a new location in
                 *        the store's tree
                 * @param {Tree}
                 *            tree The owner tree
                 * @param {Node}
                 *            node The node moved
                 * @param {Node}
                 *            oldParent The old parent of this node
                 * @param {Node}
                 *            newParent The new parent of this node
                 * @param {Number}
                 *            index The index it was moved to
                 */
             "move",
             
             /**
                 * @event insert Fires when a new child node is inserted in a
                 *        node in this store's tree.
                 * @param {Tree}
                 *            tree The owner tree
                 * @param {Node}
                 *            parent The parent node
                 * @param {Node}
                 *            node The child node inserted
                 * @param {Node}
                 *            refNode The child node the node was inserted
                 *            before
                 */
             "insert",
             
             /**
                 * @event beforeappend Fires before a new child is appended to a
                 *        node in this store's tree, return false to cancel the
                 *        append.
                 * @param {Tree}
                 *            tree The owner tree
                 * @param {Node}
                 *            parent The parent node
                 * @param {Node}
                 *            node The child node to be appended
                 */
             "beforeappend",
             
             /**
                 * @event beforeremove Fires before a child is removed from a
                 *        node in this store's tree, return false to cancel the
                 *        remove.
                 * @param {Tree}
                 *            tree The owner tree
                 * @param {Node}
                 *            parent The parent node
                 * @param {Node}
                 *            node The child node to be removed
                 */
             "beforeremove",
             
             /**
                 * @event beforemove Fires before a node is moved to a new
                 *        location in the store's tree. Return false to cancel
                 *        the move.
                 * @param {Tree}
                 *            tree The owner tree
                 * @param {Node}
                 *            node The node being moved
                 * @param {Node}
                 *            oldParent The parent of the node
                 * @param {Node}
                 *            newParent The new parent the node is moving to
                 * @param {Number}
                 *            index The index it is being moved to
                 */
             "beforemove",
             
             /**
                 * @event beforeinsert Fires before a new child is inserted in a
                 *        node in this store's tree, return false to cancel the
                 *        insert.
                 * @param {Tree}
                 *            tree The owner tree
                 * @param {Node}
                 *            parent The parent node
                 * @param {Node}
                 *            node The child node to be inserted
                 * @param {Node}
                 *            refNode The child node the node is being inserted
                 *            before
                 */
             "beforeinsert",
              
              /**
                 * @event expand Fires when this node is expanded.
                 * @param {Node}
                 *            this The expanding node
                 */
              "expand",
              
              /**
                 * @event collapse Fires when this node is collapsed.
                 * @param {Node}
                 *            this The collapsing node
                 */
              "collapse",
              
              /**
                 * @event beforeexpand Fires before this node is expanded.
                 * @param {Node}
                 *            this The expanding node
                 */
              "beforeexpand",
              
              /**
                 * @event beforecollapse Fires before this node is collapsed.
                 * @param {Node}
                 *            this The collapsing node
                 */
              "beforecollapse",

              /**
                 * @event sort Fires when this TreeStore is sorted.
                 * @param {Node}
                 *            node The node that is sorted.
                 */             
              "sort",
              
              "rootchange"
         ]);
         
         me.addEvents(
             /**
                 * @event rootchange Fires when the root node on this TreeStore
                 *        is changed.
                 * @param {Rs.ext.grid.TreeStore}
                 *            store This TreeStore
                 * @param {Node}
                 *            The new root node.
                 */
             'rootchange'
        );
        
        if (Ext.isDefined(me.nodeParameter)) {
            me.nodeParam = me.nodeParameter;
            delete me.nodeParameter;
        }
        
        //主动展开跟节点
        //this.getRootNode().expand();
    };
    
    Ext.extend(Rs.ext.grid.TreeStore, Rs.ext.data.Store, {
        
        /**
         * @cfg {Boolean} clearOnLoad (optional) Default to true. Remove
         *      previously existing child nodes before loading.
         */
        clearOnLoad : true,

        /**
         * @cfg {String} nodeParameter
         */
        
        /**
         * @cfg {String} nodeParam The name of the parameter sent to the server
         *      which contains the identifier of the node. Defaults to
         *      <tt>'node'</tt>.
         */
        nodeParam: 'node',

        /**
         * @cfg {String} defaultRootId The default root id. Defaults to 'root'
         */
        defaultRootId: 'root',
        
        /**
         * @cfg {String} defaultRootProperty The root property to specify on the
         *      reader if one is not explicitly defined.
         */
        defaultRootProperty: 'children',

        /**
         * @cfg {Boolean} folderSort Set to true to automatically prepend a leaf
         *      sorter (defaults to <tt>undefined</tt>)
         */
        folderSort: false,
        
        /**
         * 设置根节点
         * @param {Node} root
         */
        setRootNode: function(root) {
            var me = this;
            
            root = root || {};
            if (!root.isNode) {
                root = new Node(Ext.apply(root, {
                    id: me.defaultRootId,
                    idProperty : this.idProperty
                }));
            }
            me.tree.setRootNode(root);
            if (!root.isLoaded() && root.isExpanded()) { 
                me.load({
                    node : root 
                });
            }
            this.fireEvent('rootchange', me, root);
            return root;
        },
        
        /**
         * 获取根节点
         * @return {Node}
         */
        getRootNode: function() {
            var root = this.tree.getRootNode(); 
            if(root == undefined){
                root = this.setRootNode({
                    expanded: true
                });
            }
            return root;
        },

        /**
         * Returns the record node by id
         * @return {Ext.data.NodeInterface}
         */
        getNodeById: function(id) { 
            return this.tree.getNodeById(id); 
        },
        
        /**
         * Loads the Store using its configured {@link #proxy}.
         * 
         * @param {Object}
         *            options Optional config object. This is passed into the
         *            {@link Ext.data.Operation Operation} object that is
         *            created and then sent to the proxy's
         *            {@link Ext.data.proxy.Proxy#read} function. The options
         *            can also contain a node, which indicates which node is to
         *            be loaded. If not specified, it will default to the root
         *            node.
         */
        load: function(options) {
            options = options || {};
            options.params = options.params || {};
            
            var me = this,
                node = options.node || me.getRootNode();
                
            if (!node) {
                node = me.setRootNode({
                    expanded: true
                });
            }
            
            if (me.clearOnLoad) {
                node.removeAll();
            }
            
            Ext.applyIf(options, {
                node: node
            });
            options.params[me.nodeParam] = node ? node.getId() : 'root';
            Ext.applyIf(options.params, node.getOwnerTree().getRootNode().getLoader().baseParams);
            if (node) {
                node.setLoading(true);
            }
            return Rs.ext.grid.TreeStore.superclass.load.call(this, options);
        },
        
        /**
         * Fills a record with a series of child records.
         * 
         * @private
         */
        fillNode: function(node, records) {
            var me = this,
                ln = records ? records.length : 0,
                i = 0, sortCollection;
            node.setLoaded(true);
            for (; i < ln; i++) {
                node.appendChild(records[i]);
            }
            return records;
        },
        
        //private
        loadRecords : function(o, options, success){
            if (this.isDestroyed === true) {
                return;
            }
            if(!o || success === false){
                if(success !== false){
                    this.fireEvent('load', this, [], options);
                }
                if(options.callback){
                    options.callback.call(options.scope || this, [], options, false, o);
                }
                return;
            }
            this.fillNode(options.node, o.records);
            if(options.callback){
                options.callback.call(options.scope || this, o.records, options, true);
            }
        },
        
        // private
        collapse: function(record, deep, callback, scope){
            var me = this,
                node = record.node;
            if(node != undefined){
                return node.collapse(deep, callback, scope);
            }else if(Ext.isFunction(callback)){
                callback.call(scope || this);
            }
        },
        
        // private
        expand: function(record, deep, callback, scope){
            var me = this,
                node = record.node;
            if(node != undefined){
                return node.expand(deep, callback, scope);
            }else if(Ext.isFunction(callback)){
                callback.call(scope || this);
            }
        },
        
        //private
        onBeforeExpandRecord : function(record, callback, scope){
            var me = this, 
                node = record ? record.node : me.getRootNode();
            if (node.isLoaded()) {
                me.runCallback(callback, scope || node, [node.childNodes]);
            }else if (node.isLoading()) {
                this.on('load', function() {
                    me.runCallback(callback, scope || node, [node.childNodes]);
                }, this, {single: true});
            }else {
                this.load({
                    node: node,
                    callback: function() {
                        me.runCallback(callback, scope || node, [node.childNodes]);
                    }
                });
            }
        },
        
        //private
        onExpandRecord : function(record, childRecord, callback, scope){
            var index = this.indexOf(record),
                toAdd = childRecord || [];
            if(record != undefined){
                toAdd.unshift(record);
                this.remove(record);
            }
            this.insert(index >= 0 ? index : 0, toAdd);
        },
        
        //private
        onBeforeCollapseRecord : function(record, callback, scope){
            var node = record ? record.node : this.getRootNode();
            callback.call(scope || node, node.childNodes);
        },
        
        //private
        onCollapseRecord : function(record, childRecord, callback, scope){
            var toRemove = childRecord || [],
                index;
            if(record != undefined){
                index = this.indexOf(record);
                toRemove.unshift(record);
                this.remove(toRemove);
                this.insert(index >= 0 ? index : 0, [record]);
            }else {
                this.remove(toRemove);
            }
        },
        
        //private
        onRemoveRecord : function(){
            
        },
        
        onBeforeMoveRecord : function(){
            
        },
        
        onMoveRecord : function(){
            
        },
        
        onCreateRecords: function(records, operation, success) { 
            
        }, 
        
        onUpdateRecords: function(records, operation, success){ 
            
        },
        
        onDestroyRecords: function(records, operation, success){ 
            
        }, 
        
        /*sortData : function() {
            var me = this,
                sortInfo  = this.hasMultiSort ? this.multiSortInfo : this.sortInfo,
                direction = sortInfo.direction || "ASC",
                sorters   = sortInfo.sorters,
                sortFns   = [];

            //if we just have a single sorter, pretend it's the first in an array
            if (!this.hasMultiSort) {
                sorters = [{direction: direction, field: sortInfo.field}];
            }

            //create a sorter function for each sorter field/direction combo
            for (var i=0, j = sorters.length; i < j; i++) {
                sortFns.push(this.createSortFunction(sorters[i].field, sorters[i].direction));
            }
            if (sortFns.length == 0) {
                return;
            }
            var directionModifier = direction.toUpperCase() == "DESC" ? -1 : 1;

            var fn = function(r1, r2) {
              var result = sortFns[0].call(this, r1, r2);
              if (sortFns.length > 1) {
                  for (var i=1, j = sortFns.length; i < j; i++) {
                      result = result || sortFns[i].call(this, r1, r2);
                  }
              }

              return directionModifier * result;
            };
            var root = me.getRootNode();
            me.sortChildNodes(root, fn);
            var rs = [];
            root.cascade(function(node){
                if(!node.isRoot && node.record){
                    rs.push(node.record);
                }
            }, me);
            me.removeAll();
            me.add(rs);
        },*/
        //private
        sortData : function() {
            var me = this,
                sortInfo  = this.hasMultiSort ? this.multiSortInfo : this.sortInfo,
                direction = sortInfo.direction || "ASC",
                sorters   = sortInfo.sorters,
                sortFns   = [];

            //if we just have a single sorter, pretend it's the first in an array
            if (!this.hasMultiSort) {
                sorters = [{direction: direction, field: sortInfo.field}];
            }

            //create a sorter function for each sorter field/direction combo
            /*for (var i=0, j = sorters.length; i < j; i++) {
                sortFns.push(this.createSortFunction(sorters[i].field, sorters[i].direction));
            }*/
            sortFns = this.createSortFunction(sorters);
            /*if (sortFns.length == 0) {
                return;
            }*/
            var root = me.getRootNode();
            //for(var i = 0; i < sortFns.length;i++){
                root.cascade(function(node){
                    if(!node.isLeaf() && node.hasChildNodes()&& node.isExpanded()){
                        //node.sort(sortFns[i]);
                        node.sort(sortFns);
                    }
                }, me);
            //}
            var rs = [];
            root.cascade(function(node){
                if(!node.isRoot && node.record && node.parentNode.isExpanded()){
                    rs.push(node.record);
                }
            }, me);
            me.removeAll();
            me.add(rs);
        },
        
        sortChildNodes:function(node, fn){
            var childNodes = [].concat(node.childNodes);
            while(node.firstChild){
                var child = node.firstChild;
                child.remove();
            }
            var childNodes = this.sortNodeList(childNodes, fn);
            node.appendChild(childNodes);
        },
        
        sortNodeList:function(nodeList, fn){
            if(nodeList.length == 0){
                return [];
            }
            var list = nodeList.sort(fn);
            for(var i = 0, l = list.length; i < l; i++){
                this.sortChildNodes(list[i], fn);
            }
            return list;
        },
        
        /*createSortFunction: function(field, direction) {
            direction = direction || "ASC";
            var directionModifier = direction.toUpperCase() == "DESC" ? -1 : 1;
            var sortType = this.fields.get(field).sortType;
            return function(n1, n2) {
                var r1 = n1.record,
                    r2 = n2.record;
                var v1 = sortType(r1.data[field]),
                    v2 = sortType(r2.data[field]);
                
                return directionModifier * (v1 > v2 ? 1 : (v1 < v2 ? -1 : 0));
            };
        },*/
        createSortFunction: function(sorts) {
            //var sortTypes = this.fields.get(field).sortType;
            var fields = this.fields;
            return function(n1, n2) {
                var r1 = n1.record,
                    r2 = n2.record;
                for(var i = 0; i < sorts.length; i++){
                    var sortType = fields.get(sorts[i].field).sortType;
                    var v1 = sortType(r1.data[sorts[i].field]),
                        v2 = sortType(r2.data[sorts[i].field]);
                    if(v1 == v2){
                        continue;
                    } else{
                        return (sorts[i].direction.toUpperCase() == "DESC" ? -1 : 1)*(v1 > v2 ? 1 : -1);
                    }
                }
                
                return 0;
            };
        },
        
        /**
         * 
         * @param {Function} callback
         * @param {Object} scope
         * @param {Arrays} args
         * @private
         */
        runCallback : function(cb, scope, args){
            if(Ext.isFunction(cb)){
                cb.apply(scope, args);
            }
        }, 
        
        /**
         * destroy
         * @private
         */
        destroy : function(){
            if(!this.isDestroyed){
                var root = this.getRootNode();
                 if(root && root.destroy){
                     root.destroy(true);
                 }
            }
            Rs.ext.grid.TreeStore.superclass.destroy.apply(this, arguments);
        }
        
    });
    
})();
Ext.ns("Rs.ext.grid");

(function(){
    
    var TreeGridView = function(config){
        TreeGridView.superclass.constructor.call(this, Ext.apply(config || {}, {
            cellSelectorDepth : 5
        }));
    };
    
    Ext.extend(TreeGridView, Ext.grid.GridView, {
        /**
         * @cfg {boolean} autoScrollToTop
         * 当store刷新后是否主动将滚动条移到顶, 默认为false
         * @private
         */
        autoScrollToTop : false,
        
        /**
         * 监听store的load事件.<br>
         * 重写Ext.grid.GridView的onLoad方法，添加判断autoScrollToTop逻辑.
         * @private
         */
        onLoad : function() {
            if(this.autoScrollToTop === true){
                TreeGridView.superclass.onLoad.apply(this, arguments);
            }
        }
        
    });
    
    /**
     * @class Rs.ext.grid.TreeGridPanel
     * 树表格控件<br>
     * 继承自Ext.gridEditorGridPanel<br>
     * @extends Ext.grid.EditorGridPanel
     * @constructor {Object} config
     */
    Rs.ext.grid.TreeGridPanel = function(config){
        Rs.ext.grid.TreeGridPanel.superclass.constructor.call(this, config);
    };
    
    Ext.extend(Rs.ext.grid.TreeGridPanel, Ext.grid.EditorGridPanel, {
        /**
         * Returns the grid's GridView object.
         * 重写EditorGridPanel的getView方法，使用TreeGridView
         * @return {Ext.grid.TreeGridView} The tree grid view
         */
        getView : function() {
            if (!this.view) {
                this.view = new TreeGridView(this.viewConfig);
            }
            return this.view;
        }
        
    });
    Ext.ComponentMgr.registerType("rs-ext-treegridpanel", Rs.ext.grid.TreeGridPanel);
})();
Ext.ns("Rs.ext.grid");

(function(){
    
    /**
     * @class Rs.ext.grid.GeneralselGridPanel 望远镜表格
     * 该类实现通过望远镜编码和查询条件来获取数据的表格。显示的数据列为望远镜定义中定义的列。
     * 也可以通过columns 和cm 来配置要显示的列。
     * <pre><code>
    var grid = new Rs.ext.grid.GeneralselGridPanel( {
        title : '订单明细表格1',
        height : 350,
        width : 400,
        progCode : 'ordDetail',
        progCondition : ' a.company_code = \'00\' and rownum < 20 ',
        sm : new Ext.grid.CheckboxSelectionModel()     //设置selection model
    });
    grid.render('grid-div1');
    
    //store 和grid
    var store8 = new Rs.ext.data.GeneralselStore({
        autoLoad : true,
        autoDestroy : true,
        progCode : 'invVendor',
        progCondition : ' company_code = \'00\' '
    });
    
    var grid8 = new Rs.ext.grid.GeneralselGridPanel({
        title : '表格',
        height : 350,
        width : 400,
        store : store8,
        //指定要显示的列，如果不指定，则将会根据望远镜定义的列来显示数据
        columns : [{
            dataIndex : 'VENDOR_NAME',
            header : '供应商名称',
            width : 200,
            sortable : true
        }, {
            dataIndex : 'VENDOR_CODE',
            header : '供应商编码',
            width : 150,
            sortable : true
        }],
        bbar: new Rs.ext.grid.SliderPagingToolbar({
            pageSize : 10,
            hasSlider : true,
            store : store8,
            displayInfo : false
        })
    });
    grid8.render("grid-div8");
     * </code></pre>
     * @extends Ext.grid.GridPanel
     */
    Rs.ext.grid.GeneralselGridPanel = function(config){
        config = config  || {};
        var progCode = config.progCode,
            progCondition = config.progCondition;
        var store = config.store || config.ds || new Rs.ext.data.GeneralselStore({
            autoLoad : true,
            autoDestroy: true,
            progCode : progCode,
            progCondition : progCondition
        });
        var columns = config.columns || [];
		this.configColumns =  columns ;
        delete config.columns;
        Ext.applyIf(config, {
            store : store,
            columns : columns
        });
        Rs.ext.grid.GeneralselGridPanel.superclass.constructor.call(this, config);
        
        //当 store 的元数据发生变化的时候修改表格的colModel
        this.store.on('metachange', this.onStoreMeataChange, this);
    };
    
    Ext.extend(Rs.ext.grid.GeneralselGridPanel, Ext.grid.GridPanel, {
        
        /**
         * @cfg {String} progCode 望远镜编码
         */
        
        /**
         * @cfg {String} progCondition 望远镜条件
         */
        
        //private
        onStoreMeataChange : function(store, meta){
            var columns = [], fields = [], i, l, field ;
            if(fields = meta ? meta.fields : undefined){
                if(this.selModel != undefined
                    && this.selModel instanceof Ext.grid.CheckboxSelectionModel){
                    columns.push(this.selModel);
                    if(this.rendered == true){
                        this.getSelectionModel().init(this);
                    }
                }
                if(this.configColumns.length == 0){
                    for(i = 0, l = fields.length; i < l; i++){
                        for(var k in fields){
                            var f = fields[k] ;
                            if(f['seqNo'] == i){
                                field = f ;
                                break ;
                            }
                        }
                        var c = {
                            dataIndex : field.name,
                            header : field.descCh || field.descEn || field.name,
                            width : field.width,
                            align : field.align,
                            hidden : field.hidden,
                            editable : false,
                            hideable : true,
                            sortable : true
                        } ;
                        columns.push(c);
                    }
                } else {
                    columns = Ext.combine(columns,this.configColumns) ;
                }
                var colModel = new Ext.grid.ColumnModel(columns);
                this.reconfigure(store, colModel);
            }
        }
    });
    
    Ext.ComponentMgr.registerType("rs-ext-generalselgridpanel", Rs.ext.grid.GeneralselGridPanel);
})();
Ext.ns("Rs.ext.grid");

(function(){
    //查询面板
    var QueryPanel = function(config){
        config = config || {};
        var region = config.region;
        if(region == 'west' || region == 'east'){
            Ext.apply(config, {
                width : 129,
                autoWidth : false,
                autoHeight : false
            });
        }else {
            Ext.apply(config, {
                autoWidth : false,
                autoHeight : true
            });
        }
        QueryPanel.superclass.constructor.call(this, Ext.applyIf(config, {
            collapsible : true,
            collapsed : true,
            hideCollapseTool : true,
            collapseMode : "mini",
            split : true
        }));
        this.on('beforeexpand', function(){
            return this.configDisabled != true;
        }, this);
        this.on('render', function(){
            if(this.configCollapsed === false  
                && this.loadFields === true){
                this.expand();
            }
            if(this.configDisabled == true){
                this.setDisabled(true);
            }
        }, this, {
            scope : this, 
            delay : 10,
            single : true
        });
		
		this.on('resize', function(){
            if(this.ownerCt){
                this.ownerCt.doLayout();
            }
        },this, {delay: 10});
		
    };
    
    Ext.extend(QueryPanel, Ext.Panel, {

        bodyStyle : 'padding:5px;',

        autoScroll : true,
        
        defaults : {
            border : false
        },
        
        animCollapse : false,
        
        configCollapsed : true,
        
        layout : 'column',
        
		bbar : ['->',{
            iconCls : 'rs-action-query' ,
            text : '查询',
            handler : function(){
                this.ownerCt.ownerCt.doQuery();
            }
        },{xtype: 'tbspacer'},{xtype: 'tbspacer'},{
            iconCls : 'rs-action-reset' ,
            text : '重置',
            handler : function(){
                this.ownerCt.ownerCt.doReset();
            }
        }] ,
		
        reconfigure : function(generalselPanel, conditions){
            this.loadFields = false;
            this.generalselPanel = generalselPanel;
            var fields = [], 
                conditionFields = [];
            for(var i = 0, l = conditions.length; i < l; i++){
                if(!this.displayQueryField){
                    var field = Ext.create(Ext.apply(conditions[i], {
                        width : 125 ,
                        style : {
                            marginRight : '4px' ,
                            marginBottom : '2px'
                        }
                    }), 'textfield'); 
                    fields.push({
                        bodyStyle:"background:transparent;padding:3px 1px 1px 3px",
                        width : 132,
                        items : field
                    });
                    conditionFields.push(field);
                } else {
                    if(this.displayQueryField.indexOf(conditions[i]['dataIndex']) > -1 ){
                        var field = Ext.create(Ext.apply(conditions[i], {
                            width : 125 ,
                            style : {
                                marginRight : '4px' ,
                                marginBottom : '2px'
                            }
                        }), 'textfield'); 
                        fields.push({
                            bodyStyle:"background:transparent;padding:3px 1px 1px 3px",
                            width : 132,
                            items : field
                        });
                        conditionFields.push(field);
                    }
                }
            }
            this.removeFields();
            this.oldConditionFields = this.add(fields);
            this.conditionFields = conditionFields;
            this.loadFields = true;
            if(this.configCollapsed === false 
                && this.rendered === true){
                this.expand();
            }
			this.fireEvent('resize');
        },
        
        //private
        removeFields : function(){
            var ofs = this.oldConditionFields || [];
            for(var i = 0, l = ofs.length; i < l; i++){
                this.remove(ofs[i], true);
            }
            delete this.oldConditionFields;
        },
        
        //private
        doQuery : function(){
            var cfs = this.conditionFields || [],
                condition = [];
            for(var i = 0, l = cfs.length; i < l; i++){
                var cf = cfs[i],
                    field = cf.dataIndex,
                    value = cf.getValue();
                if(field != undefined && field.trim() != ""
                    && value != undefined && value.trim() != ""){
                    condition.push(field + " like '" + value + "%'");
                }
            }
            progCondtion = this.buildProgCondtion(condition.join(' AND '));
            this.generalselPanel.query(progCondtion);
        },
        
		buildProgCondtion : function(progCondition){
            return progCondition;
        },
		
        //private
        doReset : function(){
            var cfs = this.conditionFields || [];
            for(var i = 0, l = cfs.length; i < l; i++){
                var cf = cfs[i];
                cf.reset();
            }
        }, 
        
        //
        setDisabled : function(disable){
            QueryPanel.superclass.setDisabled.apply(this, arguments);
            this.configDisabled = disable;
            if(disable == true) {
                (this.collapsed != true)?this.collapse():null;
            }else {
                /*
                (this.collapsed == true && this.configCollapsed === false 
                && this.rendered === true)?this.expand():null;
                */
            }
        },
        
        //private
        onDestroy : function(){
            QueryPanel.superclass.onDestroy.apply(this, arguments);
            this.removeFields();
        }
    
    });
    
    /**
     * @class Rs.ext.grid.GeneralselPanel 
     * @extends Ext.Panel
     * <pre><code>
var p1 = new Rs.ext.grid.GeneralselPanel( {
    progCode :  'SelFixValueChange',
    progCondition : ' company_code = \'00\'',
    pageSize : false, //不进行分页
    queryPanelCollapsed : false,  //查询面板自动展开
    gridConfig : {
         sm : new Ext.grid.CheckboxSelectionModel() //设置selection model
    }
});
     * </code></pre>
     */
    Rs.ext.grid.GeneralselPanel = function(config){
        config = config  || {};
        
        var progCode = config.progCode,
            progCondition = config.progCondition ,
			displayQueryField = config.displayQueryField ;

        this.store = new Rs.ext.data.GeneralselStore({
            autoLoad : false,
            autoDestroy: true,
            progCode : progCode,
            progCondition : progCondition
        });
        
        var gridConfig = config.gridConfig || {},
            columns = gridConfig.columns || [];
        
        //分页
        var pageSize = config.pageSize;
        if(pageSize !== false){
            pageSize = Ext.isNumber(pageSize)?pageSize:20;
            this.pagingToolbar = new Rs.ext.grid.SliderPagingToolbar({
                pageSize : pageSize,
                border : true,
                store : this.store,
                hasSlider : false,
                displayInfo : false
            });
            Ext.apply(config, {
                keys : [{
                    key: 36, //home
                    fn: function(){
                        var data = this.pagingToolbar.getPageData();
                        if(data && data.activePage > 1){
                            this.pagingToolbar.moveFirst();
                        }
                    },
                    scope: this
                }, {
                    key: 35, //end
                    fn: function(){
                        var data = this.pagingToolbar.getPageData();
                        if(data && data.activePage < data.pages){
                            this.pagingToolbar.moveLast();
                        }
                    },
                    scope: this
                }, {
                    key: 33, //page up
                    fn: function(){
                        var sd = this.grid.getView().scroller.dom;
                        if(sd.scrollTop <= 0){
                            var data = this.pagingToolbar.getPageData();
                            if(data && data.activePage > 1){
                                this.pagingToolbar.movePrevious();
                                sd.scrollTop = sd.scrollHeight - sd.clientHeight;
                            }
                        }
                    },
                    scope: this
                }, {
                    key: 34, //page down
                    fn: function(){
                        var sd = this.grid.getView().scroller.dom;
                        if(sd.clientHeight + sd.scrollTop >= sd.scrollHeight){
                            var data = this.pagingToolbar.getPageData();
                            if(data && data.activePage < data.pages){
                                this.pagingToolbar.moveNext();
                            }
                        }
                    },
                    scope: this
                }]
            });
            Ext.apply(config, {
                bbar : this.pagingToolbar
            });
        }
        
        //数据表格
        this.grid = new Rs.ext.grid.GeneralselGridPanel(Ext.apply(gridConfig, {
            store : this.store,
            columns : columns,
            deferRowRender : false,
            enableHdMenu : false,
            loadMask : true,
            region: 'center'
        }));
        
        //查询面板
        var qpcfg = config.queryPanelConfig || {}, 
            qpc = config.queryPanelCollapsed,
            qpp = config.queryPanelPosition,
            qpd = config.queryPanelDisable ;
			
		if(config.buildProgCondtion){
            buildProgCondtion = config.buildProgCondtion
        }	
        
        if(config.queryPanel){
            this.queryPanel = config.queryPanel;
            this.queryPanel.bindStore(this.store, this.query, this);
            this.queryPanel.on('selectcondition', this.onQueryPanelChange, this);
            this.queryPanel.on('unselectcondition', this.onQueryPanelChange, this);
        } else{
            if(config.buildProgCondtion){
                this.queryPanel = new QueryPanel(Ext.apply(qpcfg, {
                    region :  qpp || 'north',
                    configCollapsed : Ext.isBoolean(qpc) ? qpc : true,
                    configDisabled : Ext.isBoolean(qpd) ? qpd : false ,
                    buildProgCondtion : buildProgCondtion
                }));
            } else {
                this.queryPanel = new QueryPanel(Ext.apply(qpcfg, {
                    region :  qpp || 'north',
                    configCollapsed : Ext.isBoolean(qpc) ? qpc : true,
                    configDisabled : Ext.isBoolean(qpd) ? qpd : false
                }));
            }
            this.buildinPanel = true;
        }
        
        delete config.progCode;
        delete config.progCondition;
		delete config.displayQueryField;
        delete config.gridConfig;
        delete config.queryPanelCollapsed;
        delete config.queryPanelPosition;
        delete config.buildProgCondtion;

        /*this.queryPanel.on('resize', function(){
            this.layout.layout();
        },this, {delay: 10});*/
        
        Rs.ext.grid.GeneralselPanel.superclass.constructor.call(this, Ext.apply(config, {
            layout: 'border'
        }));
        
        //自动加载数据
        if(this.storeAutoLoad == true){
            this.store.load();
        }
        //监听store事件
        this.store.on('metachange', this.onStoreMeataChange, this);
        this.store.on("loadexception", this.onLoadException, this);
    };
    
    Ext.extend(Rs.ext.grid.GeneralselPanel, Ext.Panel, {
        
        /**
         * @cfg {String} progCode 望远镜编码
         */
        
        /**
         * @cfg {String} progCondition 望远镜条件
         */
		
        /**
         * @cfg {Object} queryPanelConfig 查询面板属性配置
         */
        
        /**
         * @cfg {Object} gridConfig 表格属性配置
         */
        
        /**
         * @cfg {Boolean} storeAutoLoad 是否自动加载数据, 默认为true
         */
        storeAutoLoad : true,
        
        /**
         * @cfg {Boolean/Number} pageSize 每页显示条数,如果为false表示不进行分页,
         * 默认进行分页，且分页条数为20
         */
        
        /**
         * 
         * @cfg {String} queryPanelPosition 查询面板位置, 默认位置为 north 
         * 可设置的位置有如下：west east north south
         */
        
        /**
         * @cfg {Boolean} queryPanelCollapsed 查询面板是否展开, 默认为不展开 true
         */
        
        /**
         * @cfg {Boolean} queryPanelDisable 查询面板可用, 默认是可用 false
         */
        queryPanelDisable : false,
        
        //private override
        initComponent : function(){
            Rs.ext.grid.GeneralselPanel.superclass.initComponent.apply(this, arguments);
            this.add(this.queryPanel);
            this.add(this.grid);
        }, 
        
        /**
         * 设置查询面板可用/不可用.
         * Convenience function for setting disabled/enabled by boolean
         * @param {Boolean} disable
         */
        setQueryPanelDisable : function(disable){
            if(this.rendered && this.queryPanelDisable != disable){
                this.queryPanelDisable = disable;
                this.queryPanel.setDisabled(disable == true);
            }
        },
        
        onQueryPanelChange : function(){
            this.doLayout();
        },
        /**
         * 获取store
         * @return {Mixed store}
         */
        getStore : function(){
            return this.store;
        },
        
        /**
         * 获取表格
         * @return {Grid} 
         */
        getGrid : function(){
            return this.grid;
        },
        
        /**
         * 获取分页控件
         * @return {Toolbar} 
         */
        getPagingToolbar : function(){
            return this.pagingToolbar;
        },
        
        //private
        onStoreMeataChange : function(store, meta){
            var conditions = [],
                fields, i, l, 
                field,
                header;
            if(this.queryPanel && (fields = meta ? meta.queryFields : undefined)){
                for(i = 0, l = fields.length; i < l; i++){
                    field = fields[i];
                    header = field.descCh || field.descEn || field.name;
                    conditions.push({
                        dataIndex : field.name,
                        allowBlank : field.allowBlank,
                        emptyText : header,
                        blankText : header + '不能为空'
                    });
                }
                if(conditions.length > 0){
                    if(this.buildinPanel === true){
                        this.queryPanel.reconfigure(this, conditions);
                    }
                }
            }
        },
        
        //private
        onLoadException : function(proxy, options, response, e){
            //TODO : 提示异常信息
        },
        
        /**
         * 查询数据
         * @params {String} progCondition 查询条件, 编写SQL查询条件
         */
        query : function(progCondition, callback, scope){
            if(Ext.isFunction(callback)){
                this.store.on('load', function(store, records, options){
                    callback.call(scope || this, store, records, options);
                }, this, {
                    single : true
                });
            }
            var ptb = this.getPagingToolbar();
            if(ptb != undefined){
                ptb.setStart(0);
            }
            if(!Ext.isEmpty(progCondition, false) 
                && Ext.isString(progCondition)){
                var params = {};
                Ext.apply(params, {
                    progCondition : progCondition 
                });
                this.store.load({
                    params : params 
                });
            }else {
                this.store.load();
            }
        }, 
        
        //private
        onDestroy : function(){
            Rs.ext.grid.GeneralselPanel.superclass.onDestroy.apply(this, arguments);
            if(this.store){
                this.store.un('metachange', this.onStoreMeataChange, this);
                this.store.un('load', this.onLoadSelectFirstRow, this);
                this.store.un("loadexception", this.onLoadException, this);
                this.store.destroy();
            }
            if(this.grid){
                this.grid.destroy();
            }
            if(this.pagingToolbar){
                this.pagingToolbar.destroy();
            }
            if(this.queryPanel){
                this.queryPanel.destroy();
            }
        } ,
        
        /**
         * 修改望远镜上的store以及条件
         */
        setProgCode : function(progCode,progCondition){
            this.store.setProgCode(progCode,progCondition) ;
        }
    });
    
    Ext.ComponentMgr.registerType("rs-ext-generalselpanel", Rs.ext.grid.GeneralselPanel);
})();

Ext.ns('Rs.ext.grid');

/**
 * @class Rs.ext.grid.BufferView
 * @extends Ext.grid.GridView
 * A custom GridView which renders rows on an as-needed basis.
 */
(function(){
	Rs.ext.grid.BufferView = Ext.extend(Ext.grid.GridView, {
		/**
		 * @cfg {Number} rowHeight
		 * The height of a row in the grid.
		 */
		rowHeight: 19,
	
		/**
		 * @cfg {Number} borderHeight
		 * The combined height of border-top and border-bottom of a row.
		 */
		borderHeight: 2,
	
		/**
		 * @cfg {Boolean/Number} scrollDelay
		 * The number of milliseconds before rendering rows out of the visible
		 * viewing area. Defaults to 100. Rows will render immediately with a config
		 * of false.
		 */
		scrollDelay: 100,
	
		/**
		 * @cfg {Number} cacheSize
		 * The number of rows to look forward and backwards from the currently viewable
		 * area.  The cache applies only to rows that have been rendered already.
		 */
		cacheSize: 20,
	
		/**
		 * @cfg {Number} cleanDelay
		 * The number of milliseconds to buffer cleaning of extra rows not in the
		 * cache.
		 */
		cleanDelay: 500,
	
		initTemplates : function(){
			Rs.ext.grid.BufferView.superclass.initTemplates.call(this);
			var ts = this.templates;
			// empty div to act as a place holder for a row
		        ts.rowHolder = new Ext.Template(
			        '<div class="x-grid3-row {alt}" style="{tstyle}"></div>'
			);
			ts.rowHolder.disableFormats = true;
			ts.rowHolder.compile();
	
			ts.rowBody = new Ext.Template(
			        '<table class="x-grid3-row-table" border="0" cellspacing="0" cellpadding="0" style="{tstyle}">',
				'<tbody><tr>{cells}</tr>',
				(this.enableRowBody ? '<tr class="x-grid3-row-body-tr" style="{bodyStyle}"><td colspan="{cols}" class="x-grid3-body-cell" tabIndex="0" hidefocus="on"><div class="x-grid3-row-body">{body}</div></td></tr>' : ''),
				'</tbody></table>'
			);
			ts.rowBody.disableFormats = true;
			ts.rowBody.compile();
		},
	
		getStyleRowHeight : function(){
			return Ext.isBorderBox ? (this.rowHeight + this.borderHeight) : this.rowHeight;
		},
	
		getCalculatedRowHeight : function(){
			return this.rowHeight + this.borderHeight;
		},
	
		getVisibleRowCount : function(){
			var rh = this.getCalculatedRowHeight(),
			    visibleHeight = this.scroller.dom.clientHeight;
			return (visibleHeight < 1) ? 0 : Math.ceil(visibleHeight / rh);
		},
	
		getVisibleRows: function(){
			var count = this.getVisibleRowCount(),
			    sc = this.scroller.dom.scrollTop,
			    start = (sc === 0 ? 0 : Math.floor(sc/this.getCalculatedRowHeight())-1);
			return {
				first: Math.max(start, 0),
				last: Math.min(start + count + 2, this.ds.getCount()-1)
			};
		},
	
		doRender : function(cs, rs, ds, startRow, colCount, stripe, onlyBody){
			var ts = this.templates, 
	            ct = ts.cell, 
	            rt = ts.row, 
	            rb = ts.rowBody, 
	            last = colCount-1,
			    rh = this.getStyleRowHeight(),
			    vr = this.getVisibleRows(),
			    tstyle = 'width:'+this.getTotalWidth()+';height:'+rh+'px;',
			    // buffers
			    buf = [], 
	            cb, 
	            c, 
	            p = {}, 
	            rp = {tstyle: tstyle}, 
	            r;
			for (var j = 0, len = rs.length; j < len; j++) {
				r = rs[j]; cb = [];
				var rowIndex = (j+startRow),
				    visible = rowIndex >= vr.first && rowIndex <= vr.last;
				if (visible) {
					for (var i = 0; i < colCount; i++) {
						c = cs[i];
						p.id = c.id;
						p.css = i === 0 ? 'x-grid3-cell-first ' : (i == last ? 'x-grid3-cell-last ' : '');
						p.attr = p.cellAttr = "";
						p.value = c.renderer(r.data[c.name], p, r, rowIndex, i, ds);
						p.style = c.style;
						if (p.value === undefined || p.value === "") {
							p.value = "&#160;";
						}
						if (r.dirty && typeof r.modified[c.name] !== 'undefined') {
							p.css += ' x-grid3-dirty-cell';
						}
						cb[cb.length] = ct.apply(p);
					}
				}
				var alt = [];
				if(stripe && ((rowIndex+1) % 2 === 0)){
				    alt[0] = "x-grid3-row-alt";
				}
				if(r.dirty){
				    alt[1] = " x-grid3-dirty-row";
				}
				rp.cols = colCount;
				if(this.getRowClass){
				    alt[2] = this.getRowClass(r, rowIndex, rp, ds);
				}
				rp.alt = alt.join(" ");
				rp.cells = cb.join("");
				buf[buf.length] =  !visible ? ts.rowHolder.apply(rp) : (onlyBody ? rb.apply(rp) : rt.apply(rp));
			}
			return buf.join("");
		},
	
		isRowRendered: function(index){
			var row = this.getRow(index);
			return row && row.childNodes.length > 0;
		},
	
		syncScroll: function(){
			Rs.ext.grid.BufferView.superclass.syncScroll.apply(this, arguments);
			this.update();
		},
	
		// a (optionally) buffered method to update contents of gridview
		update: function(){
			if (this.scrollDelay) {
				if (!this.renderTask) {
					this.renderTask = new Ext.util.DelayedTask(this.doUpdate, this);
				}
				this.renderTask.delay(this.scrollDelay);
			}else{
				this.doUpdate();
			}
		},
	    
	    onRemove : function(ds, record, index, isUpdate){
			Rs.ext.grid.BufferView.superclass.onRemove.apply(this, arguments);
	        if(isUpdate !== true){
	            this.update();
	        }
	    },
	
		doUpdate: function(){
			if (this.getVisibleRowCount() > 0) {
				var g = this.grid, 
	                cm = g.colModel, 
	                ds = g.store,
	    	        cs = this.getColumnData(),
			        vr = this.getVisibleRows(),
	                row;
				for (var i = vr.first; i <= vr.last; i++) {
					// if row is NOT rendered and is visible, render it
					if(!this.isRowRendered(i) && (row = this.getRow(i))){
						var html = this.doRender(cs, [ds.getAt(i)], ds, i, cm.getColumnCount(), g.stripeRows, true);
						row.innerHTML = html;
					}
				}
				this.clean();
			}
		},
	
		// a buffered method to clean rows
		clean : function(){
			if(!this.cleanTask){
				this.cleanTask = new Ext.util.DelayedTask(this.doClean, this);
			}
			this.cleanTask.delay(this.cleanDelay);
		},
	
		doClean: function(){
			if (this.getVisibleRowCount() > 0) {
				var vr = this.getVisibleRows();
				vr.first -= this.cacheSize;
				vr.last += this.cacheSize;
	
				var i = 0, rows = this.getRows();
				// if first is less than 0, all rows have been rendered
				// so lets clean the end...
				if(vr.first <= 0){
					i = vr.last + 1;
				}
				for(var len = this.ds.getCount(); i < len; i++){
					// if current row is outside of first and last and
					// has content, update the innerHTML to nothing
					if ((i < vr.first || i > vr.last) && rows[i].innerHTML) {
						rows[i].innerHTML = '';
					}
				}
			}
		},
	    
	    removeTask: function(name){
	        var task = this[name];
	        if(task && task.cancel){
	            task.cancel();
	            this[name] = null;
	        }
	    },
	    
	    destroy : function(){
	        this.removeTask('cleanTask');
	        this.removeTask('renderTask');  
	        Rs.ext.grid.BufferView.superclass.destroy.call(this);
	    },
	
		layout: function(){
	    	Rs.ext.grid.BufferView.superclass.layout.call(this);
			this.update();
		}
	});
})();

Ext.ns('Rs.ext.grid');


(function(){

	/**
	 * @class Rs.ext.grid.RowEditor
	 * @extends Ext.Panel
	 * Plugin that adds the ability to rapidly edit full rows in a grid.
	 * A validation mode may be enabled which uses AnchorTips to notify the user of all
	 * validation errors at once.
	 *
	 */
	
	Rs.ext.grid.RowEditor = Ext.extend(Ext.Panel, {
	    floating: true,
	    shadow: false,
	    layout: 'hbox',
	    cls: 'x-small-editor',
	    buttonAlign: 'center',
	    baseCls: 'x-row-editor',
	    elements: 'header,footer,body',
	    frameWidth: 5,
	    buttonPad: 3,
	    clicksToEdit: 'auto',
	    monitorValid: true,
	    focusDelay: 250,
	    errorSummary: true,
	
	    saveText: '确定',
	    cancelText: '取消',
	    commitChangesText: '您必须将修改内容保存或取消',
	    errorText: '提示',
	
	    defaults: {
	        normalWidth: true
	    },
	
	    initComponent: function(){
	    	Rs.ext.grid.RowEditor.superclass.initComponent.call(this);
	        this.addEvents(
	            /**
	             * @event beforeedit
	             * Fired before the row editor is activated.
	             * If the listener returns <tt>false</tt> the editor will not be activated.
	             * @param {Ext.ux.grid.RowEditor} roweditor This object
	             * @param {Number} rowIndex The rowIndex of the row just edited
	             */
	            'beforeedit',
	            /**
	             * @event canceledit
	             * Fired when the editor is cancelled.
	             * @param {Ext.ux.grid.RowEditor} roweditor This object
	             * @param {Boolean} forced True if the cancel button is pressed, false is the editor was invalid.
	             */
	            'canceledit',
	            /**
	             * @event validateedit
	             * Fired after a row is edited and passes validation.
	             * If the listener returns <tt>false</tt> changes to the record will not be set.
	             * @param {Ext.ux.grid.RowEditor} roweditor This object
	             * @param {Object} changes Object with changes made to the record.
	             * @param {Ext.data.Record} r The Record that was edited.
	             * @param {Number} rowIndex The rowIndex of the row just edited
	             */
	            'validateedit',
	            /**
	             * @event afteredit
	             * Fired after a row is edited and passes validation.  This event is fired
	             * after the store's update event is fired with this edit.
	             * @param {Ext.ux.grid.RowEditor} roweditor This object
	             * @param {Object} changes Object with changes made to the record.
	             * @param {Ext.data.Record} r The Record that was edited.
	             * @param {Number} rowIndex The rowIndex of the row just edited
	             */
	            'afteredit'
	        );
	    },
	
	    init: function(grid){
	        this.grid = grid;
	        this.ownerCt = grid;
	        if(this.clicksToEdit === 2){
	            grid.on('rowdblclick', this.onRowDblClick, this);
	        }else{
	            grid.on('rowclick', this.onRowClick, this);
	            if(Ext.isIE){
	                grid.on('rowdblclick', this.onRowDblClick, this);
	            }
	        }
	
	        // stopEditing without saving when a record is removed from Store.
	        grid.getStore().on('remove', function() {
	            this.stopEditing(false);
	        },this);
	
	        grid.on({
	            scope: this,
	            keydown: this.onGridKey,
	            columnresize: this.verifyLayout,
	            columnmove : this.onColumnMove,
	            reconfigure: this.refreshFields,
	            beforedestroy : this.beforedestroy,
	            destroy : this.destroy,
	            bodyscroll: {
	                buffer: 250,
	                fn: this.positionButtons
	            }
	        });
	        //grid.on('columnmove',this.refreshFields,this,{delay:100, scope:this});
	        grid.getColumnModel().on('hiddenchange', this.verifyLayout, this, {delay:1});
	        grid.getView().on('refresh', this.stopEditing.createDelegate(this, [false]));
	    },
	
	    beforedestroy: function() {
	        this.stopMonitoring();
	        this.grid.getStore().un('remove', this.onStoreRemove, this);
	        this.stopEditing(false);
	        Ext.destroy(this.btns, this.tooltip);
	    },
	
	    refreshFields: function(){
	        this.initFields();
	        this.verifyLayout(true);
	    },
		
	    reinitFields: function(){
	    	this.stopEditing();
	    	this.initialized = false;
	    },
	    
	    isDirty: function(){
	        var dirty;
	        this.items.each(function(f){
	            if(String(this.values[f.id]) !== String(f.getValue())){
	                dirty = true;
	                return false;
	            }
	        }, this);
	        return dirty;
	    },
	
	    startEditing: function(rowIndex, doFocus){
	        if(this.editing && this.isDirty()){
	            this.showTooltip(this.commitChangesText);
	            return;
	        }
	        if(Ext.isObject(rowIndex)){
	            rowIndex = this.grid.getStore().indexOf(rowIndex);
	        }
	        if(this.fireEvent('beforeedit', this, rowIndex) !== false){
	            this.editing = true;
	            var g = this.grid, view = g.getView(),
	                row = view.getRow(rowIndex),
	                record = g.store.getAt(rowIndex);

	            this.record = record;
	            this.rowIndex = rowIndex;
	            this.values = {};
	            if(!this.rendered){
	                this.render(view.getEditorParent());
	            }
	            var w = Ext.fly(row).getWidth();
	            this.setSize(w);
	            if(!this.initialized){
	                this.initFields();
	            }
	            var cm = g.getColumnModel(), fields = this.items.items, f, val;
	            for(var i = 0, len = cm.getColumnCount(); i < len; i++){
	                val = this.preEditValue(record, cm.getDataIndex(i));
	                f = fields[i];
	                f.setValue(val);
	                this.values[f.id] = Ext.isEmpty(val) ? '' : val;
	            }
	            this.verifyLayout(true);
	            if(!this.isVisible()){
	                this.setPagePosition(Ext.fly(row).getXY());
	            } else{
	                this.el.setXY(Ext.fly(row).getXY(), {duration:0.15});
	            }
	            if(!this.isVisible()){
	                this.show().doLayout();
	            }
	            if(doFocus !== false){
	                this.doFocus.defer(this.focusDelay, this);
	            }
	        }
	    },
	    
	    stopEditing : function(saveChanges){
	        this.editing = false;
	        if(!this.isVisible()){
	            return;
	        }
	        if(saveChanges === false || !this.isValid()){
	            this.hide();
	            this.fireEvent('canceledit', this, saveChanges === false);
	            return;
	        }
	        var changes = {},
	            r = this.record,
	            hasChange = false,
	            cm = this.grid.colModel,
	            fields = this.items.items;
	        for(var i = 0, len = cm.getColumnCount(); i < len; i++){
	            if(!cm.isHidden(i)){
	                var dindex = cm.getDataIndex(i);
	                if(!Ext.isEmpty(dindex)){
	                    var oldValue = r.data[dindex],
	                        value = this.postEditValue(fields[i].getValue(), oldValue, r, dindex);
	                    if(String(oldValue) !== String(value)){
	                        changes[dindex] = value;
	                        hasChange = true;
	                    }
	                }
	            }
	        }
	        if(hasChange && this.fireEvent('validateedit', this, changes, r, this.rowIndex) !== false){
	            r.beginEdit();
	            Ext.iterate(changes, function(name, value){
	                r.set(name, value);
	            });
	            r.endEdit();
	            this.fireEvent('afteredit', this, changes, r, this.rowIndex);
	        }
	        this.hide();
	    },
	    
	    verifyLayout: function(force) {

	        if (this.el && (this.isVisible() || force === true)) {
	            var row = this.grid.getView().getRow(this.rowIndex);
	            this.setSize(Ext.fly(row).getWidth(), Ext.isIE ? Ext.fly(row).getHeight() + 9 : undefined);
	            var cm = this.grid.colModel, fields = this.items.items;
	            for (var i = 0, len = cm.getColumnCount(); i < len; i++) {
	                if (!cm.isHidden(i)) {
	                    var adjust = 0;
	                    if (i === (len - 1)) {
	                        adjust += 3; // outer padding
	                    } else {
	                        adjust += 1;
	                    }
	                    fields[i].show();
	                    aw = cm.getColumnWidth(i) - adjust;
	                    fields[i].setWidth(aw); //当一个组件渲染后，这个函数改变的是封装此组件的el的style属性width，并不修改组件的width属性
	                    fields[i].width = aw;//解决roweditor拖动列时错位的BUG
	                } else {
	                    fields[i].hide();
	                }
	            }
	            this.doLayout();
	            this.positionButtons();
	        }
	    },
	    
	    onColumnMove : function(o, n){
	    	if(!this.initialized){
	    		this.refreshFields();
	    	} else{
		    	var fields = this.items.items;
		    	if(o > n){
		    		fields[o].el.setX(fields[n].el.getX());
		    		for(var i = n; i < o; i++){
		    			fields[i].el.setX(fields[i].el.getX()+fields[o].el.getWidth());
		    		}
		    	} else{
		    		for(var i = o+1; i <= n; i++){
		    			fields[i].el.setX(fields[i].el.getX()-fields[o].el.getWidth());
		    		}
		    		fields[o].el.setX(fields[n].el.getX()+fields[n].el.getWidth());
		    	}
		    	if(o==0){
		    		if(fields[0] instanceof Ext.form.DisplayField){
		    			fields[0].el.removeClass("x-grid3-roweditor-uneditable-first-left");
		    			fields[0].el.addClass("x-grid3-roweditor-uneditable-left");
		    		} 
		    	}
		    	var movedColumn = this.items.items.splice(o,1);
		    	this.items.items.splice(n,0,movedColumn[0]);
	    	}
	    },
	    
	    slideHide : function(){
	        this.hide();
	    },
	
	    initFields: function(){
	        var cm = this.grid.getColumnModel(), pm = Ext.layout.ContainerLayout.prototype.parseMargins;
	        this.removeAll(false);
	        for(var i = 0, len = cm.getColumnCount(); i < len; i++){
	            var c = cm.getColumnAt(i);
	            var ed = c.getEditor?c.getEditor():null;
	            if(!ed){
	                ed = c.displayEditor || (i==0? new Ext.form.DisplayField({cls:'x-grid3-roweditor-uneditable-first x-grid3-roweditor-uneditable-first-left'}): new Ext.form.DisplayField({cls:'x-grid3-roweditor-uneditable x-grid3-roweditor-uneditable-left'}));
	            }
	            if(i == 0){
	                ed.margins = pm('0 1 2 1');
	            } else if(i == len - 1){
	                ed.margins = pm('0 0 2 1');
	            } else{
	                if (Ext.isIE) {
	                    ed.margins = pm('0 0 2 0');
	                }
	                else {
	                    ed.margins = pm('0 1 2 0');
	                }
	            }
	            ed.setWidth(cm.getColumnWidth(i));
	            ed.column = c;
	            if(ed.ownerCt !== this){
	                ed.on('focus', this.ensureVisible, this);
	                ed.on('specialkey', this.onKey, this);
	            }
	            this.insert(i, ed);
	        }
	        this.initialized = true;
	    },
	
	    onKey: function(f, e){
	        if(e.getKey() === e.ENTER){
	            this.stopEditing(true);
	            e.stopPropagation();
	        }
	    },
	
	    onGridKey: function(e){
	        if(e.getKey() === e.ENTER && !this.isVisible()){
	            var r = this.grid.getSelectionModel().getSelected();
	            if(r){
	                var index = this.grid.store.indexOf(r);
	                this.startEditing(index);
	                e.stopPropagation();
	            }
	        }
	    },
	
	    ensureVisible: function(editor){
	        if(this.isVisible()){
	             this.grid.getView().ensureVisible(this.rowIndex, this.grid.colModel.getIndexById(editor.column.id), true);
	        }
	    },
	
	    onRowClick: function(g, rowIndex, e){
	        if(this.clicksToEdit == 'auto'){
	            var li = this.lastClickIndex;
	            this.lastClickIndex = rowIndex;
	            if(li != rowIndex && !this.isVisible()){
	                return;
	            }
	        }
	        this.startEditing(rowIndex, false);
	        this.doFocus.defer(this.focusDelay, this, [e.getPoint()]);
	    },
	
	    onRowDblClick: function(g, rowIndex, e){
	        this.startEditing(rowIndex, false);
	        this.doFocus.defer(this.focusDelay, this, [e.getPoint()]);
	    },
	
	    onRender: function(){
	    	Rs.ext.grid.RowEditor.superclass.onRender.apply(this, arguments);
	        this.el.swallowEvent(['keydown', 'keyup', 'keypress']);
	        this.btns = new Ext.Panel({
	            baseCls: 'x-plain',
	            cls: 'x-btns',
	            elements:'body',
	            layout: 'table',
	            width: (this.minButtonWidth * 2) + (this.frameWidth * 2) + (this.buttonPad * 4), // width must be specified for IE
	            items: [{
	                ref: 'saveBtn',
	                itemId: 'saveBtn',
	                xtype: 'button',
	                text: this.saveText,
	                width: this.minButtonWidth,
	                handler: this.stopEditing.createDelegate(this, [true])
	            }, {
	                xtype: 'button',
	                text: this.cancelText,
	                width: this.minButtonWidth,
	                handler: this.stopEditing.createDelegate(this, [false])
	            }]
	        });
	        this.btns.render(this.bwrap);
	    },
	
	    afterRender: function(){
	    	Rs.ext.grid.RowEditor.superclass.afterRender.apply(this, arguments);
	        this.positionButtons();
	        if(this.monitorValid){
	            this.startMonitoring();
	        }
	    },
	
	    onShow: function(){
	        if(this.monitorValid){
	            this.startMonitoring();
	        }
	        Rs.ext.grid.RowEditor.superclass.onShow.apply(this, arguments);
	    },
	
	    onHide: function(){
	    	Rs.ext.grid.RowEditor.superclass.onHide.apply(this, arguments);
	        this.stopMonitoring();
	        this.grid.getView().focusRow(this.rowIndex);
	    },
	
	    positionButtons: function(){
	        if(this.btns){
	            var g = this.grid,
	                h = this.el.dom.clientHeight,
	                view = g.getView(),
	                scroll = view.scroller.dom.scrollLeft,
	                bw = this.btns.getWidth(),
	                width = Math.min(g.getWidth(), g.getColumnModel().getTotalWidth());
	
	            this.btns.el.shift({left: (width/2)-(bw/2)+scroll, top: h - 2, stopFx: true, duration:0.2});
	        }
	    },
	
	    // private
	    preEditValue : function(r, field){
	        var value = r.data[field];
	        return this.autoEncode && typeof value === 'string' ? Ext.util.Format.htmlDecode(value) : value;
	    },
	
	    // private
	    postEditValue : function(value, originalValue, r, field){
	        return this.autoEncode && typeof value == 'string' ? Ext.util.Format.htmlEncode(value) : value;
	    },
	
	    doFocus: function(pt){
	        if(this.isVisible()){
	            var index = 0,
	                cm = this.grid.getColumnModel(),
	                c;
	            if(pt){
	                index = this.getTargetColumnIndex(pt);
	            }
	            for(var i = index||0, len = cm.getColumnCount(); i < len; i++){
	                c = cm.getColumnAt(i);
	                if(!c.hidden && c.getEditor && c.getEditor()){
	                    c.getEditor().focus();
	                    break;
	                }
	            }
	        }
	    },
	
	    getTargetColumnIndex: function(pt){
	        var grid = this.grid,
	            v = grid.view,
	            x = pt.left,
	            cms = grid.colModel.config,
	            i = 0,
	            match = false;
	        for(var len = cms.length, c; c = cms[i]; i++){
	            if(!c.hidden){
	                if(Ext.fly(v.getHeaderCell(i)).getRegion().right >= x){
	                    match = i;
	                    break;
	                }
	            }
	        }
	        return match;
	    },
	
	    startMonitoring : function(){
	        if(!this.bound && this.monitorValid){
	            this.bound = true;
	            Ext.TaskMgr.start({
	                run : this.bindHandler,
	                interval : this.monitorPoll || 200,
	                scope: this
	            });
	        }
	    },
	
	    stopMonitoring : function(){
	        this.bound = false;
	        if(this.tooltip){
	            this.tooltip.hide();
	        }
	    },
	
	    isValid: function(){
	        var valid = true;
	        this.items.each(function(f){
	            if(!f.isValid(true)){
	                valid = false;
	                return false;
	            }
	        });
	        return valid;
	    },
	
	    // private
	    bindHandler : function(){
	        if(!this.bound){
	            return false; // stops binding
	        }
	        var valid = this.isValid();
	        if(!valid && this.errorSummary){
	            this.showTooltip(this.getErrorText().join(''));
	        }
	        this.btns.saveBtn.setDisabled(!valid);
	        this.fireEvent('validation', this, valid);
	    },
	
	    lastVisibleColumn : function() {
	        var i = this.items.getCount() - 1,
	            c;
	        for(; i >= 0; i--) {
	            c = this.items.items[i];
	            if (!c.hidden) {
	                return c;
	            }
	        }
	    },
	
	    showTooltip: function(msg){
	        var t = this.tooltip;
	        if(!t){
	            t = this.tooltip = new Ext.ToolTip({
	                maxWidth: 600,
	                cls: 'errorTip',
	                width: 300,
	                title: this.errorText,
	                autoHide: false,
	                anchor: 'left',
	                anchorToTarget: true,
	                mouseOffset: [40,0]
	            });
	        }
	        var v = this.grid.getView(),
	            top = parseInt(this.el.dom.style.top, 10),
	            scroll = v.scroller.dom.scrollTop,
	            h = this.el.getHeight();
	
	        if(top + h >= scroll){
	            t.initTarget(this.lastVisibleColumn().getEl());
	            if(!t.rendered){
	                t.show();
	                t.hide();
	            }
	            t.body.update(msg);
	            t.doAutoWidth(20);
	            t.show();
	        }else if(t.rendered){
	            t.hide();
	        }
	    },
	
	    getErrorText: function(){
	        var data = ['<ul>'];
	        this.items.each(function(f){
	            if(!f.isValid(true)){
	                data.push('<li>', f.getActiveError(), '</li>');
	            }
	        });
	        data.push('</ul>');
	        return data;
	    }
	});
	
})();

Ext.ns('Rs.ext.grid');

/**
 * @class Rs.ext.grid.RowExpander
 * @extends Ext.util.Observable
 * Plugin that adds the ability to have a Column in a grid which enables
 * a second row body which expands/contracts.  The expand/contract behavior is configurable to react
 * on clicking of the column, double click of the row, and/or hitting enter while a row is selected.
 *
 */
(function(){
	Rs.ext.grid.RowExpander = Ext.extend(Ext.util.Observable, {
	    /**
	     * @cfg {Boolean} expandOnEnter
	     * <tt>true</tt> to toggle selected row(s) between expanded/collapsed when the enter
	     * key is pressed (defaults to <tt>true</tt>).
	     */
	    expandOnEnter : true,
	    /**
	     * @cfg {Boolean} expandOnDblClick
	     * <tt>true</tt> to toggle a row between expanded/collapsed when double clicked
	     * (defaults to <tt>true</tt>).
	     */
	    expandOnDblClick : true,
	
	    header : '',
	    width : 20,
	    sortable : false,
	    fixed : true,
	    hideable: false,
	    menuDisabled : true,
	    dataIndex : '',
	    id : 'expander',
	    lazyRender : true,
	    enableCaching : true,
	
	    constructor: function(config){
	        Ext.apply(this, config);
	
	        this.addEvents({
	            /**
	             * @event beforeexpand
	             * Fires before the row expands. Have the listener return false to prevent the row from expanding.
	             * @param {Object} this RowExpander object.
	             * @param {Object} Ext.data.Record Record for the selected row.
	             * @param {Object} body body element for the secondary row.
	             * @param {Number} rowIndex The current row index.
	             */
	            beforeexpand: true,
	            /**
	             * @event expand
	             * Fires after the row expands.
	             * @param {Object} this RowExpander object.
	             * @param {Object} Ext.data.Record Record for the selected row.
	             * @param {Object} body body element for the secondary row.
	             * @param {Number} rowIndex The current row index.
	             */
	            expand: true,
	            /**
	             * @event beforecollapse
	             * Fires before the row collapses. Have the listener return false to prevent the row from collapsing.
	             * @param {Object} this RowExpander object.
	             * @param {Object} Ext.data.Record Record for the selected row.
	             * @param {Object} body body element for the secondary row.
	             * @param {Number} rowIndex The current row index.
	             */
	            beforecollapse: true,
	            /**
	             * @event collapse
	             * Fires after the row collapses.
	             * @param {Object} this RowExpander object.
	             * @param {Object} Ext.data.Record Record for the selected row.
	             * @param {Object} body body element for the secondary row.
	             * @param {Number} rowIndex The current row index.
	             */
	            collapse: true
	        });
	
	        Rs.ext.grid.RowExpander.superclass.constructor.call(this);
	
	        if(this.tpl){
	            if(typeof this.tpl == 'string'){
	                this.tpl = new Ext.Template(this.tpl);
	            }
	            this.tpl.compile();
	        }
	
	        this.state = {};
	        this.bodyContent = {};
	    },
	
	    getRowClass : function(record, rowIndex, p, ds){
	        p.cols = p.cols-1;
	        var content = this.bodyContent[record.id];
	        if(!content && !this.lazyRender){
	            content = this.getBodyContent(record, rowIndex);
	        }
	        if(content){
	            p.body = content;
	        }
	        return this.state[record.id] ? 'x-grid3-row-expanded' : 'x-grid3-row-collapsed';
	    },
	
	    init : function(grid){
	        this.grid = grid;
	
	        var view = grid.getView();
	        view.getRowClass = this.getRowClass.createDelegate(this);
	
	        view.enableRowBody = true;
	
	
	        grid.on('render', this.onRender, this);
	        grid.on('destroy', this.onDestroy, this);
	    },
	
	    // @private
	    onRender: function() {
	        var grid = this.grid;
	        var mainBody = grid.getView().mainBody;
	        mainBody.on('mousedown', this.onMouseDown, this, {delegate: '.x-grid3-row-expander'});
	        if (this.expandOnEnter) {
	            this.keyNav = new Ext.KeyNav(this.grid.getGridEl(), {
	                'enter' : this.onEnter,
	                scope: this
	            });
	        }
	        if (this.expandOnDblClick) {
	            grid.on('rowdblclick', this.onRowDblClick, this);
	        }
	    },
	    
	    // @private    
	    onDestroy: function() {
	        if(this.keyNav){
	            this.keyNav.disable();
	            delete this.keyNav;
	        }
	        /*
	         * A majority of the time, the plugin will be destroyed along with the grid,
	         * which means the mainBody won't be available. On the off chance that the plugin
	         * isn't destroyed with the grid, take care of removing the listener.
	         */
	        var mainBody = this.grid.getView().mainBody;
	        if(mainBody){
	            mainBody.un('mousedown', this.onMouseDown, this);
	        }
	    },
	    // @private
	    onRowDblClick: function(grid, rowIdx, e) {
	        this.toggleRow(rowIdx);
	    },
	
	    onEnter: function(e) {
	        var g = this.grid;
	        var sm = g.getSelectionModel();
	        var sels = sm.getSelections();
	        for (var i = 0, len = sels.length; i < len; i++) {
	            var rowIdx = g.getStore().indexOf(sels[i]);
	            this.toggleRow(rowIdx);
	        }
	    },
	
	    getBodyContent : function(record, index){
	        if(!this.enableCaching){
	            return this.tpl.apply(record.data);
	        }
	        var content = this.bodyContent[record.id];
	        if(!content){
	            content = this.tpl.apply(record.data);
	            this.bodyContent[record.id] = content;
	        }
	        return content;
	    },
	
	    onMouseDown : function(e, t){
	        e.stopEvent();
	        var row = e.getTarget('.x-grid3-row');
	        this.toggleRow(row);
	    },
	
	    renderer : function(v, p, record){
	        p.cellAttr = 'rowspan="2"';
	        return '<div class="x-grid3-row-expander">&#160;</div>';
	    },
	
	    beforeExpand : function(record, body, rowIndex){
	        if(this.fireEvent('beforeexpand', this, record, body, rowIndex) !== false){
	            if(this.tpl && this.lazyRender){
	                body.innerHTML = this.getBodyContent(record, rowIndex);
	            }
	            return true;
	        }else{
	            return false;
	        }
	    },
	
	    toggleRow : function(row){
	        if(typeof row == 'number'){
	            row = this.grid.view.getRow(row);
	        }
	        this[Ext.fly(row).hasClass('x-grid3-row-collapsed') ? 'expandRow' : 'collapseRow'](row);
	    },
	
	    expandRow : function(row){
	        if(typeof row == 'number'){
	            row = this.grid.view.getRow(row);
	        }
	        var record = this.grid.store.getAt(row.rowIndex);
	        var body = Ext.DomQuery.selectNode('tr:nth(2) div.x-grid3-row-body', row);
	        if(this.beforeExpand(record, body, row.rowIndex)){
	            this.state[record.id] = true;
	            Ext.fly(row).replaceClass('x-grid3-row-collapsed', 'x-grid3-row-expanded');
	            this.fireEvent('expand', this, record, body, row.rowIndex);
	        }
	    },
	
	    collapseRow : function(row){
	        if(typeof row == 'number'){
	            row = this.grid.view.getRow(row);
	        }
	        var record = this.grid.store.getAt(row.rowIndex);
	        var body = Ext.fly(row).child('tr:nth(1) div.x-grid3-row-body', true);
	        if(this.fireEvent('beforecollapse', this, record, body, row.rowIndex) !== false){
	            this.state[record.id] = false;
	            Ext.fly(row).replaceClass('x-grid3-row-expanded', 'x-grid3-row-collapsed');
	            this.fireEvent('collapse', this, record, body, row.rowIndex);
	        }
	    }
	});

})();
Ext.ns("Rs.ext.grid");

(function() {
    
    Rs.ext.grid.ColumnModel = Ext.extend(Ext.grid.ColumnModel, {
        getColumnHeader : function(col) {
            var editor = this.config[col].editor ;
            if(editor == null || editor == undefined){
                return this.config[col].header;
            }
            var header = this.config[col].header ;
            return  header + " <span class='rs-cell-editor'>&nbsp;&nbsp;&nbsp;&nbsp;</span>";
        }
    });
    
})();
Ext.ns("Rs.ext.grid");

Rs.ext.grid.EditorGridViewPlugin = function(config) {
    Ext.apply(this, config);
};

Ext.extend(Rs.ext.grid.EditorGridViewPlugin, Ext.util.Observable, {
    
    init: function(editorgridpanel) {
        
        var view = editorgridpanel.getView() ;
        
        Ext.apply(view, {
            initTemplates: function() {
                var templates = view.templates || {},
                template, name,

                headerCellTpl = new Ext.Template('<td class="x-grid3-hd x-grid3-cell x-grid3-td-{id} {css}" style="{style}">',
                    '<div {tooltip} {attr} class="x-grid3-hd-inner x-grid3-hd-{id}" unselectable="on" style="{istyle}">',
                    view.grid.enableHdMenu ? '<a class="x-grid3-hd-btn" href="#"></a>': '',
                    '{value}', '<img alt="" class="rs-cell-editor" src="', Ext.BLANK_IMAGE_URL, '" />',
                    '<img alt="" class="x-grid3-sort-icon" src="', Ext.BLANK_IMAGE_URL, '" />', 
                    '</div>', '</td>'),

                rowBodyText = ['<tr class="x-grid3-row-body-tr" style="{bodyStyle}">', 
                    '<td colspan="{cols}" class="x-grid3-body-cell" tabIndex="0" hidefocus="on">', 
                    '<div class="x-grid3-row-body">{body}</div>', '</td>', '</tr>'].join(""),

                innerText = ['<table class="x-grid3-row-table" border="0" cellspacing="0" cellpadding="0" style="{tstyle}">', 
                    '<tbody>', '<tr>{cells}</tr>', view.enableRowBody ? rowBodyText: '', 
                    '</tbody>', '</table>'].join("");

                Ext.applyIf(templates, {
                    hcell: headerCellTpl,
                    cell: view.cellTpl,
                    body: view.bodyTpl,
                    header: view.headerTpl,
                    master: view.masterTpl,
                    row: new Ext.Template('<div class="x-grid3-row {alt}" style="{tstyle}">' + innerText + '</div>'),
                    rowInner: new Ext.Template(innerText)
                });

                for (name in templates) {
                    template = templates[name];

                    if (template && Ext.isFunction(template.compile) && !template.compiled) {
                        template.disableFormats = true;
                        template.compile();
                    }
                }

                view.templates = templates;
                view.colRe = new RegExp('x-grid3-td-([^\\s]+)', '');
            },
            
            
            // private
            render : function() {
                if (this.autoFill) {
                    var ct = this.grid.ownerCt;
                    
                    if (ct && ct.getLayout()) {
                        ct.on('afterlayout', function() {
                            this.fitColumns(true, true);
                            this.updateHeaders();
                            this.updateHeaderSortState();
                        }, this, {single: true});
                    }
                } else if (this.forceFit) {
                    this.fitColumns(true, false);
                } else if (this.grid.autoExpandColumn) {
                    this.autoExpand(true);
                }
                
                this.grid.getGridEl().dom.innerHTML = this.renderUI();
                
                this.afterRenderUI();
                this.updateEditorPen();
            },
            
            //private
            updateEditorPen: function() {
                var columnModelConfig = view.cm.config;
                for (var i = 0,
                len = columnModelConfig.length; i < len; i++) {
                    var c = columnModelConfig[i];
                    if (c.editor) {
                        view.mainHd.select('td').item(i).addClass("rs-grid-editor");
                    }
                }
            },

            onDataChange : function(){
                this.refresh(true);
                this.updateHeaderSortState();
                this.updateEditorPen();
                this.syncFocusEl(0);
            } ,
            
            onColumnMove : function(cm, oldIndex, newIndex) {
                this.indexMap = null;
                this.refresh(true);
                this.updateEditorPen();
                this.restoreScroll(this.getScrollState());
                
                this.afterMove(newIndex);
                this.grid.fireEvent('columnmove', oldIndex, newIndex);
            }
        });
    }
});
(function(){
	/**
	 * @class Rs.ext.grid.LockingGridView
	 * @extends Ext.grid.GridView
	 * @constructor
	 * @param {Object} config 
	 */

	Rs.ext.grid.LockingGridView = Ext.extend(Ext.grid.GridView, {
	    lockText : 'Lock',
	    unlockText : 'Unlock',
	    rowBorderWidth : 1,
	    lockedBorderWidth : 1,
	
	    /*
	     * This option ensures that height between the rows is synchronized
	     * between the locked and unlocked sides. This option only needs to be used
	     * when the row heights aren't predictable.
	     */
	    syncHeights: false,
	
	    initTemplates : function(){
	        var ts = this.templates || {};
	
	        if (!ts.masterTpl) {
	            ts.masterTpl = new Ext.Template(
	                '<div class="x-grid3" hidefocus="true">',
	                    '<div class="x-grid3-locked">',
	                        '<div class="x-grid3-header"><div class="x-grid3-header-inner"><div class="x-grid3-header-offset" style="{lstyle}">{lockedHeader}</div></div><div class="x-clear"></div></div>',
	                        '<div class="x-grid3-scroller"><div class="x-grid3-body" style="{lstyle}">{lockedBody}</div><div class="x-grid3-scroll-spacer"></div></div>',
	                    '</div>',
	                    '<div class="x-grid3-viewport x-grid3-unlocked">',
	                        '<div class="x-grid3-header"><div class="x-grid3-header-inner"><div class="x-grid3-header-offset" style="{ostyle}">{header}</div></div><div class="x-clear"></div></div>',
	                        '<div class="x-grid3-scroller"><div class="x-grid3-body" style="{bstyle}">{body}</div><a href="#" class="x-grid3-focus" tabIndex="-1"></a></div>',
	                    '</div>',
	                    '<div class="x-grid3-resize-marker">&#160;</div>',
	                    '<div class="x-grid3-resize-proxy">&#160;</div>',
	                '</div>'
	            );
	        }
	
	        this.templates = ts;
	
	        Rs.ext.grid.LockingGridView.superclass.initTemplates.call(this);
	    },
	
	    getEditorParent : function(ed){
	        return this.el.dom;
	    },
	
	    initElements : function(){
	        var el             = Ext.get(this.grid.getGridEl().dom.firstChild),
	            lockedWrap     = el.child('div.x-grid3-locked'),
	            lockedHd       = lockedWrap.child('div.x-grid3-header'),
	            lockedScroller = lockedWrap.child('div.x-grid3-scroller'),
	            mainWrap       = el.child('div.x-grid3-viewport'),
	            mainHd         = mainWrap.child('div.x-grid3-header'),
	            scroller       = mainWrap.child('div.x-grid3-scroller');
	            
	        if (this.grid.hideHeaders) {
	            lockedHd.setDisplayed(false);
	            mainHd.setDisplayed(false);
	        }
	        
	        if(this.forceFit){
	            scroller.setStyle('overflow-x', 'hidden');
	        }
	        
	        Ext.apply(this, {
	            el      : el,
	            mainWrap: mainWrap,
	            mainHd  : mainHd,
	            innerHd : mainHd.dom.firstChild,
	            scroller: scroller,
	            mainBody: scroller.child('div.x-grid3-body'),
	            focusEl : scroller.child('a'),
	            resizeMarker: el.child('div.x-grid3-resize-marker'),
	            resizeProxy : el.child('div.x-grid3-resize-proxy'),
	            lockedWrap: lockedWrap,
	            lockedHd: lockedHd,
	            lockedScroller: lockedScroller,
	            lockedBody: lockedScroller.child('div.x-grid3-body'),
	            lockedInnerHd: lockedHd.child('div.x-grid3-header-inner', true)
	        });
	        
	        this.focusEl.swallowEvent('click', true);
	    },
	
	    getLockedRows : function(){
	        return this.hasRows() ? this.lockedBody.dom.childNodes : [];
	    },
	
	    getLockedRow : function(row){
	        return this.getLockedRows()[row];
	    },
	
	    getCell : function(row, col){
	        var lockedLen = this.cm.getLockedCount();
	        if(col < lockedLen){
	            return this.getLockedRow(row).getElementsByTagName('td')[col];
	        }
	        return Rs.ext.grid.LockingGridView.superclass.getCell.call(this, row, col - lockedLen);
	    },
	
	    getHeaderCell : function(index){
	        var lockedLen = this.cm.getLockedCount();
	        if(index < lockedLen){
	            return this.lockedHd.dom.getElementsByTagName('td')[index];
	        }
	        return Rs.ext.grid.LockingGridView.superclass.getHeaderCell.call(this, index - lockedLen);
	    },
	
	    addRowClass : function(row, cls){
	        var lockedRow = this.getLockedRow(row);
	        if(lockedRow){
	            this.fly(lockedRow).addClass(cls);
	        }
	        Rs.ext.grid.LockingGridView.superclass.addRowClass.call(this, row, cls);
	    },
	
	    removeRowClass : function(row, cls){
	        var lockedRow = this.getLockedRow(row);
	        if(lockedRow){
	            this.fly(lockedRow).removeClass(cls);
	        }
	        Rs.ext.grid.LockingGridView.superclass.removeRowClass.call(this, row, cls);
	    },
	
	    removeRow : function(row) {
	        Ext.removeNode(this.getLockedRow(row));
	        Rs.ext.grid.LockingGridView.superclass.removeRow.call(this, row);
	    },
	
	    removeRows : function(firstRow, lastRow){
	        var lockedBody = this.lockedBody.dom,
	            rowIndex = firstRow;
	        for(; rowIndex <= lastRow; rowIndex++){
	            Ext.removeNode(lockedBody.childNodes[firstRow]);
	        }
	        Rs.ext.grid.LockingGridView.superclass.removeRows.call(this, firstRow, lastRow);
	    },
	
	    syncScroll : function(e){
	        this.lockedScroller.dom.scrollTop = this.scroller.dom.scrollTop;
	        Rs.ext.grid.LockingGridView.superclass.syncScroll.call(this, e);
	    },
	
	    updateSortIcon : function(col, dir){
	        var sortClasses = this.sortClasses,
	            lockedHeaders = this.lockedHd.select('td').removeClass(sortClasses),
	            headers = this.mainHd.select('td').removeClass(sortClasses),
	            lockedLen = this.cm.getLockedCount(),
	            cls = sortClasses[dir == 'DESC' ? 1 : 0];
	            
	        if(col < lockedLen){
	            lockedHeaders.item(col).addClass(cls);
	        }else{
	            headers.item(col - lockedLen).addClass(cls);
	        }
	    },
	
	    updateAllColumnWidths : function(){
	        var tw = this.getTotalWidth(),
	            clen = this.cm.getColumnCount(),
	            lw = this.getLockedWidth(),
	            llen = this.cm.getLockedCount(),
	            ws = [], len, i;
	        this.updateLockedWidth();
	        for(i = 0; i < clen; i++){
	            ws[i] = this.getColumnWidth(i);
	            var hd = this.getHeaderCell(i);
	            hd.style.width = ws[i];
	        }
	        var lns = this.getLockedRows(), ns = this.getRows(), row, trow, j;
	        for(i = 0, len = ns.length; i < len; i++){
	            row = lns[i];
	            row.style.width = lw;
	            if(row.firstChild){
	                row.firstChild.style.width = lw;
	                trow = row.firstChild.rows[0];
	                for (j = 0; j < llen; j++) {
	                   trow.childNodes[j].style.width = ws[j];
	                }
	            }
	            row = ns[i];
	            row.style.width = tw;
	            if(row.firstChild){
	                row.firstChild.style.width = tw;
	                trow = row.firstChild.rows[0];
	                for (j = llen; j < clen; j++) {
	                   trow.childNodes[j - llen].style.width = ws[j];
	                }
	            }
	        }
	        this.onAllColumnWidthsUpdated(ws, tw);
	        this.syncHeaderHeight();
	    },
	
	    updateColumnWidth : function(col, width){
	        var w = this.getColumnWidth(col),
	            llen = this.cm.getLockedCount(),
	            ns, rw, c, row;
	        this.updateLockedWidth();
	        if(col < llen){
	            ns = this.getLockedRows();
	            rw = this.getLockedWidth();
	            c = col;
	        }else{
	            ns = this.getRows();
	            rw = this.getTotalWidth();
	            c = col - llen;
	        }
	        var hd = this.getHeaderCell(col);
	        hd.style.width = w;
	        for(var i = 0, len = ns.length; i < len; i++){
	            row = ns[i];
	            row.style.width = rw;
	            if(row.firstChild){
	                row.firstChild.style.width = rw;
	                row.firstChild.rows[0].childNodes[c].style.width = w;
	            }
	        }
	        this.onColumnWidthUpdated(col, w, this.getTotalWidth());
	        this.syncHeaderHeight();
	    },
	
	    updateColumnHidden : function(col, hidden){
	        var llen = this.cm.getLockedCount(),
	            ns, rw, c, row,
	            display = hidden ? 'none' : '';
	        this.updateLockedWidth();
	        if(col < llen){
	            ns = this.getLockedRows();
	            rw = this.getLockedWidth();
	            c = col;
	        }else{
	            ns = this.getRows();
	            rw = this.getTotalWidth();
	            c = col - llen;
	        }
	        var hd = this.getHeaderCell(col);
	        hd.style.display = display;
	        for(var i = 0, len = ns.length; i < len; i++){
	            row = ns[i];
	            row.style.width = rw;
	            if(row.firstChild){
	                row.firstChild.style.width = rw;
	                row.firstChild.rows[0].childNodes[c].style.display = display;
	            }
	        }
	        this.onColumnHiddenUpdated(col, hidden, this.getTotalWidth());
	        delete this.lastViewWidth;
	        this.layout();
	    },
	
	    doRender : function(cs, rs, ds, startRow, colCount, stripe){
	        var ts = this.templates, ct = ts.cell, rt = ts.row, last = colCount-1,
	            tstyle = 'width:'+this.getTotalWidth()+';',
	            lstyle = 'width:'+this.getLockedWidth()+';',
	            buf = [], lbuf = [], cb, lcb, c, p = {}, rp = {}, r;
	        for(var j = 0, len = rs.length; j < len; j++){
	            r = rs[j]; cb = []; lcb = [];
	            var rowIndex = (j+startRow);
	            for(var i = 0; i < colCount; i++){
	                c = cs[i];
	                p.id = c.id;
	                p.css = (i === 0 ? 'x-grid3-cell-first ' : (i == last ? 'x-grid3-cell-last ' : '')) +
	                    (this.cm.config[i].cellCls ? ' ' + this.cm.config[i].cellCls : '');
	                p.attr = p.cellAttr = '';
	                p.value = c.renderer(r.data[c.name], p, r, rowIndex, i, ds);
	                p.style = c.style;
	                if(Ext.isEmpty(p.value)){
	                    p.value = '&#160;';
	                }
	                if(this.markDirty && r.dirty && Ext.isDefined(r.modified[c.name])){
	                    p.css += ' x-grid3-dirty-cell';
	                }
	                if(c.locked){
	                    lcb[lcb.length] = ct.apply(p);
	                }else{
	                    cb[cb.length] = ct.apply(p);
	                }
	            }
	            var alt = [];
	            if(stripe && ((rowIndex+1) % 2 === 0)){
	                alt[0] = 'x-grid3-row-alt';
	            }
	            if(r.dirty){
	                alt[1] = ' x-grid3-dirty-row';
	            }
	            rp.cols = colCount;
	            if(this.getRowClass){
	                alt[2] = this.getRowClass(r, rowIndex, rp, ds);
	            }
	            rp.alt = alt.join(' ');
	            rp.cells = cb.join('');
	            rp.tstyle = tstyle;
	            buf[buf.length] = rt.apply(rp);
	            rp.cells = lcb.join('');
	            rp.tstyle = lstyle;
	            lbuf[lbuf.length] = rt.apply(rp);
	        }
	        return [buf.join(''), lbuf.join('')];
	    },
	    processRows : function(startRow, skipStripe){
	        if(!this.ds || this.ds.getCount() < 1){
	            return;
	        }
	        var rows = this.getRows(),
	            lrows = this.getLockedRows(),
	            row, lrow;
	        skipStripe = skipStripe || !this.grid.stripeRows;
	        startRow = startRow || 0;
	        for(var i = 0, len = rows.length; i < len; ++i){
	            row = rows[i];
	            lrow = lrows[i];
	            row.rowIndex = i;
	            lrow.rowIndex = i;
	            if(!skipStripe){
	                row.className = row.className.replace(this.rowClsRe, ' ');
	                lrow.className = lrow.className.replace(this.rowClsRe, ' ');
	                if ((i + 1) % 2 === 0){
	                    row.className += ' x-grid3-row-alt';
	                    lrow.className += ' x-grid3-row-alt';
	                }
	            }
	            this.syncRowHeights(row, lrow);
	        }
	        if(startRow === 0){
	            Ext.fly(rows[0]).addClass(this.firstRowCls);
	            Ext.fly(lrows[0]).addClass(this.firstRowCls);
	        }
	        Ext.fly(rows[rows.length - 1]).addClass(this.lastRowCls);
	        Ext.fly(lrows[lrows.length - 1]).addClass(this.lastRowCls);
	    },
	    
	    syncRowHeights: function(row1, row2){
	        if(this.syncHeights){
	            var el1 = Ext.get(row1),
	                el2 = Ext.get(row2),
	                h1 = el1.getHeight(),
	                h2 = el2.getHeight();
	
	            if(h1 > h2){
	                el2.setHeight(h1);
	            }else if(h2 > h1){
	                el1.setHeight(h2);
	            }
	        }
	    },
	
	    afterRender : function(){
	        if(!this.ds || !this.cm){
	            return;
	        }
	        var bd = this.renderRows() || ['&#160;', '&#160;'];
	        this.mainBody.dom.innerHTML = bd[0];
	        this.lockedBody.dom.innerHTML = bd[1];
	        this.processRows(0, true);
	        if(this.deferEmptyText !== true){
	            this.applyEmptyText();
	        }
	        this.grid.fireEvent('viewready', this.grid);
	    },
	
	    renderUI : function(){        
	        var templates = this.templates,
	            header = this.renderHeaders(),
	            body = templates.body.apply({rows:'&#160;'});
	
	        return templates.masterTpl.apply({
	            body  : body,
	            header: header[0],
	            ostyle: 'width:' + this.getOffsetWidth() + ';',
	            bstyle: 'width:' + this.getTotalWidth()  + ';',
	            lockedBody: body,
	            lockedHeader: header[1],
	            lstyle: 'width:'+this.getLockedWidth()+';'
	        });
	    },
	    
	    afterRenderUI: function(){
	        var g = this.grid;
	        this.initElements();
	        Ext.fly(this.innerHd).on('click', this.handleHdDown, this);
	        Ext.fly(this.lockedInnerHd).on('click', this.handleHdDown, this);
	        this.mainHd.on({
	            scope: this,
	            mouseover: this.handleHdOver,
	            mouseout: this.handleHdOut,
	            mousemove: this.handleHdMove
	        });
	        this.lockedHd.on({
	            scope: this,
	            mouseover: this.handleHdOver,
	            mouseout: this.handleHdOut,
	            mousemove: this.handleHdMove
	        });
	        this.scroller.on('scroll', this.syncScroll,  this);
	        if(g.enableColumnResize !== false){
	            this.splitZone = new Ext.grid.GridView.SplitDragZone(g, this.mainHd.dom);
	            this.splitZone.setOuterHandleElId(Ext.id(this.lockedHd.dom));
	            this.splitZone.setOuterHandleElId(Ext.id(this.mainHd.dom));
	        }
	        if(g.enableColumnMove){
	            this.columnDrag = new Ext.grid.GridView.ColumnDragZone(g, this.innerHd);
	            this.columnDrag.setOuterHandleElId(Ext.id(this.lockedInnerHd));
	            this.columnDrag.setOuterHandleElId(Ext.id(this.innerHd));
	            this.columnDrop = new Ext.grid.HeaderDropZone(g, this.mainHd.dom);
	        }
	        if(g.enableHdMenu !== false){
	            this.hmenu = new Ext.menu.Menu({id: g.id + '-hctx'});
	            this.hmenu.add(
	                {itemId: 'asc', text: this.sortAscText, cls: 'xg-hmenu-sort-asc'},
	                {itemId: 'desc', text: this.sortDescText, cls: 'xg-hmenu-sort-desc'}
	            );
	            if(this.grid.enableColLock !== false){
	                this.hmenu.add('-',
	                    {itemId: 'lock', text: this.lockText, cls: 'xg-hmenu-lock'},
	                    {itemId: 'unlock', text: this.unlockText, cls: 'xg-hmenu-unlock'}
	                );
	            }
	            if(g.enableColumnHide !== false){
	                this.colMenu = new Ext.menu.Menu({id:g.id + '-hcols-menu'});
	                this.colMenu.on({
	                    scope: this,
	                    beforeshow: this.beforeColMenuShow,
	                    itemclick: this.handleHdMenuClick
	                });
	                this.hmenu.add('-', {
	                    itemId:'columns',
	                    hideOnClick: false,
	                    text: this.columnsText,
	                    menu: this.colMenu,
	                    iconCls: 'x-cols-icon'
	                });
	            }
	            this.hmenu.on('itemclick', this.handleHdMenuClick, this);
	        }
	        if(g.trackMouseOver){
	            this.mainBody.on({
	                scope: this,
	                mouseover: this.onRowOver,
	                mouseout: this.onRowOut
	            });
	            this.lockedBody.on({
	                scope: this,
	                mouseover: this.onRowOver,
	                mouseout: this.onRowOut
	            });
	        }
	
	        if(g.enableDragDrop || g.enableDrag){
	            this.dragZone = new Ext.grid.GridDragZone(g, {
	                ddGroup : g.ddGroup || 'GridDD'
	            });
	        }
	        this.updateHeaderSortState();    
	    },
	
	    layout : function(){
	        if(!this.mainBody){
	            return;
	        }
	        var g = this.grid;
	        var c = g.getGridEl();
	        var csize = c.getSize(true);
	        var vw = csize.width;
	        if(!g.hideHeaders && (vw < 20 || csize.height < 20)){
	            return;
	        }
	        this.syncHeaderHeight();
	        if(g.autoHeight){
	            this.scroller.dom.style.overflow = 'visible';
	            this.lockedScroller.dom.style.overflow = 'visible';
	            if(Ext.isWebKit){
	                this.scroller.dom.style.position = 'static';
	                this.lockedScroller.dom.style.position = 'static';
	            }
	        }else{
	            this.el.setSize(csize.width, csize.height);
	            var hdHeight = this.mainHd.getHeight();
	            var vh = csize.height - (hdHeight);
	        }
	        this.updateLockedWidth();
	        if(this.forceFit){
	            if(this.lastViewWidth != vw){
	                this.fitColumns(false, false);
	                this.lastViewWidth = vw;
	            }
	        }else {
	            this.autoExpand();
	            this.syncHeaderScroll();
	        }
	        this.onLayout(vw, vh);
	    },
	
	    getOffsetWidth : function() {
	        return (this.cm.getTotalWidth() - this.cm.getTotalLockedWidth() + this.getScrollOffset()) + 'px';
	    },
	
	    renderHeaders : function(){
	        var cm = this.cm,
	            ts = this.templates,
	            ct = ts.hcell,
	            cb = [], lcb = [],
	            p = {},
	            len = cm.getColumnCount(),
	            last = len - 1;
	        for(var i = 0; i < len; i++){
	            p.id = cm.getColumnId(i);
	            p.value = cm.getColumnHeader(i) || '';
	            p.style = this.getColumnStyle(i, true);
	            p.tooltip = this.getColumnTooltip(i);
	            p.css = (i === 0 ? 'x-grid3-cell-first ' : (i == last ? 'x-grid3-cell-last ' : '')) +
	                (cm.config[i].headerCls ? ' ' + cm.config[i].headerCls : '');
	            if(cm.config[i].align == 'right'){
	                p.istyle = 'padding-right:16px';
	            } else {
	                delete p.istyle;
	            }
	            if(cm.isLocked(i)){
	                lcb[lcb.length] = ct.apply(p);
	            }else{
	                cb[cb.length] = ct.apply(p);
	            }
	        }
	        return [ts.header.apply({cells: cb.join(''), tstyle:'width:'+this.getTotalWidth()+';'}),
	                ts.header.apply({cells: lcb.join(''), tstyle:'width:'+this.getLockedWidth()+';'})];
	    },
	
	    updateHeaders : function(){
	        var hd = this.renderHeaders();
	        this.innerHd.firstChild.innerHTML = hd[0];
	        this.innerHd.firstChild.style.width = this.getOffsetWidth();
	        this.innerHd.firstChild.firstChild.style.width = this.getTotalWidth();
	        this.lockedInnerHd.firstChild.innerHTML = hd[1];
	        var lw = this.getLockedWidth();
	        this.lockedInnerHd.firstChild.style.width = lw;
	        this.lockedInnerHd.firstChild.firstChild.style.width = lw;
	    },
	
	    getResolvedXY : function(resolved){
	        if(!resolved){
	            return null;
	        }
	        var c = resolved.cell, r = resolved.row;
	        return c ? Ext.fly(c).getXY() : [this.scroller.getX(), Ext.fly(r).getY()];
	    },
	
	    syncFocusEl : function(row, col, hscroll){
	    	Rs.ext.grid.LockingGridView.superclass.syncFocusEl.call(this, row, col, col < this.cm.getLockedCount() ? false : hscroll);
	    },
	
	    ensureVisible : function(row, col, hscroll){
	        return Rs.ext.grid.LockingGridView.superclass.ensureVisible.call(this, row, col, col < this.cm.getLockedCount() ? false : hscroll);
	    },
	
	    insertRows : function(dm, firstRow, lastRow, isUpdate){
	        var last = dm.getCount() - 1;
	        if(!isUpdate && firstRow === 0 && lastRow >= last){
	            this.refresh();
	        }else{
	            if(!isUpdate){
	                this.fireEvent('beforerowsinserted', this, firstRow, lastRow);
	            }
	            var html = this.renderRows(firstRow, lastRow),
	                before = this.getRow(firstRow);
	            if(before){
	                if(firstRow === 0){
	                    this.removeRowClass(0, this.firstRowCls);
	                }
	                Ext.DomHelper.insertHtml('beforeBegin', before, html[0]);
	                before = this.getLockedRow(firstRow);
	                Ext.DomHelper.insertHtml('beforeBegin', before, html[1]);
	            }else{
	                this.removeRowClass(last - 1, this.lastRowCls);
	                Ext.DomHelper.insertHtml('beforeEnd', this.mainBody.dom, html[0]);
	                Ext.DomHelper.insertHtml('beforeEnd', this.lockedBody.dom, html[1]);
	            }
	            if(!isUpdate){
	                this.fireEvent('rowsinserted', this, firstRow, lastRow);
	                this.processRows(firstRow);
	            }else if(firstRow === 0 || firstRow >= last){
	                this.addRowClass(firstRow, firstRow === 0 ? this.firstRowCls : this.lastRowCls);
	            }
	        }
	        this.syncFocusEl(firstRow);
	    },
	
	    getColumnStyle : function(col, isHeader){
	        var style = !isHeader ? this.cm.config[col].cellStyle || this.cm.config[col].css || '' : this.cm.config[col].headerStyle || '';
	        style += 'width:'+this.getColumnWidth(col)+';';
	        if(this.cm.isHidden(col)){
	            style += 'display:none;';
	        }
	        var align = this.cm.config[col].align;
	        if(align){
	            style += 'text-align:'+align+';';
	        }
	        return style;
	    },
	
	    getLockedWidth : function() {
	        return this.cm.getTotalLockedWidth() + 'px';
	    },
	
	    getTotalWidth : function() {
	        return (this.cm.getTotalWidth() - this.cm.getTotalLockedWidth()) + 'px';
	    },
	
	    getColumnData : function(){
	        var cs = [], cm = this.cm, colCount = cm.getColumnCount();
	        for(var i = 0; i < colCount; i++){
	            var name = cm.getDataIndex(i);
	            cs[i] = {
	                name : (!Ext.isDefined(name) ? this.ds.fields.get(i).name : name),
	                renderer : cm.getRenderer(i),
	                id : cm.getColumnId(i),
	                style : this.getColumnStyle(i),
	                locked : cm.isLocked(i)
	            };
	        }
	        return cs;
	    },
	
	    renderBody : function(){
	        var markup = this.renderRows() || ['&#160;', '&#160;'];
	        return [this.templates.body.apply({rows: markup[0]}), this.templates.body.apply({rows: markup[1]})];
	    },
	    
	    refreshRow: function(record){
	        var store = this.ds, 
	            colCount = this.cm.getColumnCount(), 
	            columns = this.getColumnData(), 
	            last = colCount - 1, 
	            cls = ['x-grid3-row'], 
	            rowParams = {
	                tstyle: String.format("width: {0};", this.getTotalWidth())
	            }, 
	            lockedRowParams = {
	                tstyle: String.format("width: {0};", this.getLockedWidth())
	            }, 
	            colBuffer = [], 
	            lockedColBuffer = [], 
	            cellTpl = this.templates.cell, 
	            rowIndex, 
	            row, 
	            lockedRow, 
	            column, 
	            meta, 
	            css, 
	            i;
	        
	        if (Ext.isNumber(record)) {
	            rowIndex = record;
	            record = store.getAt(rowIndex);
	        } else {
	            rowIndex = store.indexOf(record);
	        }
	        
	        if (!record || rowIndex < 0) {
	            return;
	        }
	        
	        for (i = 0; i < colCount; i++) {
	            column = columns[i];
	            
	            if (i == 0) {
	                css = 'x-grid3-cell-first';
	            } else {
	                css = (i == last) ? 'x-grid3-cell-last ' : '';
	            }
	            
	            meta = {
	                id: column.id,
	                style: column.style,
	                css: css,
	                attr: "",
	                cellAttr: ""
	            };
	            
	            meta.value = column.renderer.call(column.scope, record.data[column.name], meta, record, rowIndex, i, store);
	            
	            if (Ext.isEmpty(meta.value)) {
	                meta.value = ' ';
	            }
	            
	            if (this.markDirty && record.dirty && typeof record.modified[column.name] != 'undefined') {
	                meta.css += ' x-grid3-dirty-cell';
	            }
	            
	            if (column.locked) {
	                lockedColBuffer[i] = cellTpl.apply(meta);
	            } else {
	                colBuffer[i] = cellTpl.apply(meta);
	            }
	        }
	        
	        row = this.getRow(rowIndex);
	        row.className = '';
	        lockedRow = this.getLockedRow(rowIndex);
	        lockedRow.className = '';
	        
	        if (this.grid.stripeRows && ((rowIndex + 1) % 2 === 0)) {
	            cls.push('x-grid3-row-alt');
	        }
	        
	        if (this.getRowClass) {
	            rowParams.cols = colCount;
	            cls.push(this.getRowClass(record, rowIndex, rowParams, store));
	        }
	        
	        // Unlocked rows
	        this.fly(row).addClass(cls).setStyle(rowParams.tstyle);
	        rowParams.cells = colBuffer.join("");
	        row.innerHTML = this.templates.rowInner.apply(rowParams);
	        
	        // Locked rows
	        this.fly(lockedRow).addClass(cls).setStyle(lockedRowParams.tstyle);
	        lockedRowParams.cells = lockedColBuffer.join("");
	        lockedRow.innerHTML = this.templates.rowInner.apply(lockedRowParams);
	        lockedRow.rowIndex = rowIndex;
	        this.syncRowHeights(row, lockedRow);  
	        this.fireEvent('rowupdated', this, rowIndex, record);
	    },
	
	    refresh : function(headersToo){
	        this.fireEvent('beforerefresh', this);
	        this.grid.stopEditing(true);
	        var result = this.renderBody();
	        this.mainBody.update(result[0]).setWidth(this.getTotalWidth());
	        this.lockedBody.update(result[1]).setWidth(this.getLockedWidth());
	        if(headersToo === true){
	            this.updateHeaders();
	            this.updateHeaderSortState();
	        }
	        this.processRows(0, true);
	        this.layout();
	        this.applyEmptyText();
	        this.fireEvent('refresh', this);
	    },
	
	    onDenyColumnLock : function(){
	
	    },
	
	    initData : function(ds, cm){
	        if(this.cm){
	            this.cm.un('columnlockchange', this.onColumnLock, this);
	        }
	        Rs.ext.grid.LockingGridView.superclass.initData.call(this, ds, cm);
	        if(this.cm){
	            this.cm.on('columnlockchange', this.onColumnLock, this);
	        }
	    },
	
	    onColumnLock : function(){
	        this.refresh(true);
	    },
	
	    handleHdMenuClick : function(item){
	        var index = this.hdCtxIndex,
	            cm = this.cm,
	            id = item.getItemId(),
	            llen = cm.getLockedCount();
	        switch(id){
	            case 'lock':
	                if(cm.getColumnCount(true) <= llen + 1){
	                    this.onDenyColumnLock();
	                    return undefined;
	                }
	                cm.setLocked(index, true);
	                if(llen != index){
	                    cm.moveColumn(index, llen);
	                    this.grid.fireEvent('columnmove', index, llen);
	                }
	            break;
	            case 'unlock':
	                if(llen - 1 != index){
	                    cm.setLocked(index, false, true);
	                    cm.moveColumn(index, llen - 1);
	                    this.grid.fireEvent('columnmove', index, llen - 1);
	                }else{
	                    cm.setLocked(index, false);
	                }
	            break;
	            default:
	                return Rs.ext.grid.LockingGridView.superclass.handleHdMenuClick.call(this, item);
	        }
	        return true;
	    },
	
	    handleHdDown : function(e, t){
	        Rs.ext.grid.LockingGridView.superclass.handleHdDown.call(this, e, t);
	        if(this.grid.enableColLock !== false){
	            if(Ext.fly(t).hasClass('x-grid3-hd-btn')){
	                var hd = this.findHeaderCell(t),
	                    index = this.getCellIndex(hd),
	                    ms = this.hmenu.items, cm = this.cm;
	                ms.get('lock').setDisabled(cm.isLocked(index));
	                ms.get('unlock').setDisabled(!cm.isLocked(index));
	            }
	        }
	    },
	
	    syncHeaderHeight: function(){
	        var hrow = Ext.fly(this.innerHd).child('tr', true),
	            lhrow = Ext.fly(this.lockedInnerHd).child('tr', true);
	            
	        hrow.style.height = 'auto';
	        lhrow.style.height = 'auto';
	        var hd = hrow.offsetHeight,
	            lhd = lhrow.offsetHeight,
	            height = Math.max(lhd, hd) + 'px';
	            
	        hrow.style.height = height;
	        lhrow.style.height = height;
	
	    },
	
	    updateLockedWidth: function(){
	        var lw = this.cm.getTotalLockedWidth(),
	            tw = this.cm.getTotalWidth() - lw,
	            csize = this.grid.getGridEl().getSize(true),
	            lp = Ext.isBorderBox ? 0 : this.lockedBorderWidth,
	            rp = Ext.isBorderBox ? 0 : this.rowBorderWidth,
	            vw = (csize.width - lw - lp - rp) + 'px',
	            so = this.getScrollOffset();
	        if(!this.grid.autoHeight){
	            var vh = (csize.height - this.mainHd.getHeight()) + 'px';
	            this.lockedScroller.dom.style.height = vh;
	            this.scroller.dom.style.height = vh;
	        }
	        this.lockedWrap.dom.style.width = (lw + rp) + 'px';
	        this.scroller.dom.style.width = vw;
	        this.mainWrap.dom.style.left = (lw + lp + rp) + 'px';
	        if(this.innerHd){
	            this.lockedInnerHd.firstChild.style.width = lw + 'px';
	            this.lockedInnerHd.firstChild.firstChild.style.width = lw + 'px';
	            this.innerHd.style.width = vw;
	            this.innerHd.firstChild.style.width = (tw + rp + so) + 'px';
	            this.innerHd.firstChild.firstChild.style.width = tw + 'px';
	        }
	        if(this.mainBody){
	            this.lockedBody.dom.style.width = (lw + rp) + 'px';
	            this.mainBody.dom.style.width = (tw + rp) + 'px';
	        }
	    }
	});
	
})();
(function(){
	/**
	 * @class Rs.ext.grid.LockingColumnModel
	 * @extends Ext.grid.ColumnModel
	 * @constructor
	 * @param {Object} config 
	 */
	
	Rs.ext.grid.LockingColumnModel = Ext.extend(Rs.ext.grid.ColumnModel, {
	    /**
	     * Returns true if the given column index is currently locked
	     * @param {Number} colIndex The column index
	     * @return {Boolean} True if the column is locked
	     */
	    isLocked : function(colIndex){
	        return this.config[colIndex].lockedColumn === true;
	    },
	
	    /**
	     * Locks or unlocks a given column
	     * @param {Number} colIndex The column index
	     * @param {Boolean} value True to lock, false to unlock
	     * @param {Boolean} suppressEvent Pass false to cause the columnlockchange event not to fire
	     */
	    setLocked : function(colIndex, value, suppressEvent){
	        if (this.isLocked(colIndex) == value) {
	            return;
	        }
	        this.config[colIndex].lockedColumn = value;
	        if (!suppressEvent) {
	            this.fireEvent('columnlockchange', this, colIndex, value);
	        }
	    },
	
	    /**
	     * Returns the total width of all locked columns
	     * @return {Number} The width of all locked columns
	     */
	    getTotalLockedWidth : function(){
	        var totalWidth = 0;
	        for (var i = 0, len = this.config.length; i < len; i++) {
	            if (this.isLocked(i) && !this.isHidden(i)) {
	                totalWidth += this.getColumnWidth(i);
	            }
	        }
	
	        return totalWidth;
	    },
	
	    /**
	     * Returns the total number of locked columns
	     * @return {Number} The number of locked columns
	     */
	    getLockedCount : function() {
	        var len = this.config.length;
	
	        for (var i = 0; i < len; i++) {
	            if (!this.isLocked(i)) {
	                return i;
	            }
	        }
	
	        //if we get to this point all of the columns are locked so we return the total
	        return len;
	    },
	
	    /**
	     * Moves a column from one position to another
	     * @param {Number} oldIndex The current column index
	     * @param {Number} newIndex The destination column index
	     */
	    moveColumn : function(oldIndex, newIndex){
	        var oldLocked = this.isLocked(oldIndex),
	            newLocked = this.isLocked(newIndex);
	
	        if (oldIndex < newIndex && oldLocked && !newLocked) {
	            this.setLocked(oldIndex, false, true);
	        } else if (oldIndex > newIndex && !oldLocked && newLocked) {
	            this.setLocked(oldIndex, true, true);
	        }
	
	        Rs.ext.grid.LockingColumnModel.superclass.moveColumn.apply(this, arguments);
	    }

	});
})();
Ext.namespace('Rs.ext.grid');
(function(){
	Rs.ext.grid.PagingSelectPlugin = function(config){
		this.cfg = config ;
		Ext.apply(this, config);
		this.addEvents('submit');
	} ;
	
	Ext.extend(Rs.ext.grid.PagingSelectPlugin , Ext.util.Observable , {
		init : function(grid){
			this.grid = grid ;
		} ,
		initWindow : function(grid){
			var lstore = this.createStore(grid)  ;
			var lsm = this.createSelectModel(grid);
			var lcm = this.createColumnModel(grid , lsm);
			
			this.leftGrid = new Ext.grid.GridPanel({
				border : false ,
				hideBorders : true ,
				store: lstore ,
	            sm : lsm ,
	            stripeRows: true,//行颜色交替显式
	            colModel: lcm ,
	            clicksToEdit: 1 ,
	            bbar: new Rs.ext.grid.SliderPagingToolbar({
	                pageSize: 10 ,//初始化显示的条数
	                hasSlider: false,//是否显示修改显示条数的滚动条
	                store: lstore ,
	                displayInfo: false
	            })
			});
			
			var rstore = new Ext.data.JsonStore({
				fields : grid.store.fields.keys
			});
			
			var rsm = this.createSelectModel(grid);
			var rcm = this.createColumnModel(grid , rsm);
			this.rightGrid = new Ext.grid.GridPanel({
				border : false ,
				hideBorders : true ,
				store: rstore ,
				sm: rsm ,
	            stripeRows: true,//行颜色交替显式
	            colModel: rcm ,
	            clicksToEdit: 1
			});
			
			this.buttonPanel = new Ext.Panel({
				layout : 'vbox' ,
				layoutConfig : {
					align : 'center' ,
					pack : 'center'
				} ,
				defaults : {
					margins : '10 0 10 0'
				},
				frame : true ,
				border : false ,
				hideBorders : true ,
	            items : [new Ext.Button({
	                    tooltip : '添加',
	                    iconCls : 'rs-action-goright',
	                    handler : this.doAppend,
	                    scope : this
	                }), new Ext.Button({
	                    tooltip : '移除',
	                    iconCls : 'rs-action-goleft',
	                    handler : this.doRemove,
	                    scope : this
	                }), new Ext.Button({
	                    tooltip : '全部添加',
	                    iconCls : 'rs-action-bacthgoright',
	                    handler : this.doAppendAll,
	                    scope : this
	                }), new Ext.Button({
	                    tooltip : '全部移除',
	                    iconCls : 'rs-action-bacthgoleft',
	                    handler : this.doRemoveAll,
	                    scope : this
	                })
	            ]
	        });
			var winCfg = {
				layout : 'fit' ,
				closable : true ,
				modal : true ,
				resizable : true ,
				border : false ,
				hideBorders : true ,
				width : 800 ,
				height : 600 ,
				items : [{
					layout : 'column' ,
					items : [{
						columnWidth : .5 ,
						layout : 'fit' ,
						items : [this.leftGrid]
					} , {
						padding : 2 ,
						margins : 3 ,
						items : [this.buttonPanel]
					} , {
						columnWidth : .5 ,
						layout : 'fit' ,
						items : [this.rightGrid]
					}]
				}] ,
				buttonAlign : 'center' ,
				buttons : [{
					xtype : 'button' ,
					text : '确定' ,
					iconCls : 'rs-action-ok' ,
					handler : this.doSubmit ,
					scope : this
				} , {
					xtype : 'button' ,
					text : '取消' ,
					iconCls : 'rs-action-cancel' ,
					handler : this.doCancel ,
					scope : this
				}],
				listeners : {
					resize : this.doLayoutPanel ,
					scope : this
				}
			} ;
			
			Rs.apply(winCfg , this.cfg);
			this.win = new Ext.Window(winCfg) ;
		} ,
		
		doLayoutPanel :function(c){
			var height = c.getInnerHeight() - 2 ,
				width = c.getInnerWidth();
			this.leftGrid.setHeight(height);
			this.buttonPanel.setHeight(height);
			this.rightGrid.setHeight(height);
		} ,
		
		/**
		 * 构建数据源
		 */
		createStore : function(grid){
			var cfg = this.createStoreConfig(grid);
			return new Rs.ext.data.Store(cfg);
		} ,
		
		/**
		 * 构建数据源参数
		 */
		createStoreConfig : function(grid){
			var gs = grid.getStore() ,
				baseParams = Rs.apply(baseParams || {} , gs.baseParams) ;
				cfg = {
					autoLoad : true ,
					autoDestroy : true ,
					url : gs.url ,
					fields : gs.fields.keys ,
					baseParams : baseParams
				};
			if(gs.sortInfo){
				Rs.apply(cfg , {
					sortInfo : gs.sortInfo
				} );
			}
			
			if(gs.idProperty){
				Rs.apply(cfg , {
					idProperty : gs.idProperty
				} );
			}
			return cfg ;
		} ,
		
		/**
		 * 构建列模型
		 */
		createColumnModel : function(grid , sm){
			var cm = grid.getColumnModel();
			var colModel = [sm] ;
			Ext.each(cm.config , function(item , index , cfgs){
				if(!(item instanceof Ext.grid.AbstractSelectionModel || item instanceof Ext.grid.ActionColumn)){
					colModel.push(Rs.apply({} , item));
				}
			} , this);
			return new Ext.grid.ColumnModel(colModel) ;
		} ,
		
		/**
		 * 构建选择器
		 */
		createSelectModel : function(grid){
			var sm = grid.getSelectionModel() ;
			if(sm instanceof Ext.grid.CheckboxSelectionModel){
				sm = new Ext.grid.CheckboxSelectionModel();
			} else {
				sm = new Rs.ext.grid.CheckboxCellSelectionModel({});
			} ;
			return sm ;
		} ,
		
		/**
		 * 添加操作
		 */
		doAppend : function(){
			var sm = this.leftGrid.getSelectionModel() ,
				records = sm.getSelections() ,
				rs = this.rightGrid.getStore() ;
			var distinctRecords= [] ;
			Ext.each(records , function(record , index , records){
				if(rs.getRange().indexOf(record) == -1){
					distinctRecords.push(record);
				};
			}  ,this);
			if(!Ext.isEmpty(distinctRecords)){
				this.rightGrid.getStore().add(distinctRecords);
			}
		} , 
		
		/**
		 * 移除操作
		 */
		doRemove : function(){
			var records = this.rightGrid.getSelectionModel().getSelections() ;
			if(!Ext.isEmpty(records)){
				this.rightGrid.getStore().remove(records);
			}
		} ,
		
		/**
		 * 将源表格数据全部添加到目标表格中
		 */
		doAppendAll : function(){
			this.leftGrid.getSelectionModel().selectAll() ;
			this.doAppend();
		} , 
		
		/**
		 * 清空目标表格数据
		 */
		doRemoveAll : function(){
			this.rightGrid.getStore().removeAll() ;
		} ,
		
		/**
		 * 点击确定按钮
		 */
		doSubmit : function(){
			this.fireEvent('submit' , this.plugin , this.win ,this.rightGrid.getStore().getRange() , this);
		} ,
		
		/**
		 * 点击取消按钮
		 */
		doCancel : function(){
			this.win.close();
		} ,
		
		/**
		 * @method getLeftGrid 获得源表格对象
		 */
		getLeftGrid : function(){
			return this.leftGrid ;
		} ,
		
		/**
		 * @method getRightGrid 获得目标表格对象
		 */
		getRightGrid : function(){
			return this.rightGrid ;
		} ,
		
		/**
		 * @method getPluginWindow 获得插件窗口
		 */
		getPluginWindow : function(){
			this.initWindow(this.grid) ;
			return this.win ;
		}
		
	});
	
})();
Ext.ns("Rs.ext.form");

(function(){

	var ActionLoad = function(){
		ActionLoad.superclass.constructor.apply(this, arguments);
	};
	
	Ext.extend(ActionLoad, Ext.form.Action.Load, {
		// private
	    run : function(){
	        var o = this.options,
	        	url = o.url || this.form.url || this.form.el.dom.action;
	        Rs.Service.call({
	        	url : url,
	        	method : 'load',
	        	scope : this,
	        	accept : 'html',
	        	params:this.getParams(),
	        	success: this.success,
	            failure: this.failure,
	            timeout: (o.timeout*1000) || (this.form.timeout*1000),
	            upload: this.form.fileUpload ? this.success : undefined
	        }, this);
	    },
	    
	    // private
	    getParams : function(){
	        var bp = this.form.baseParams;
	        var p = this.options.params;
	        if(p){
	            if(typeof p == "object"){
	                p = Rs.urlEncode(Rs.applyIf(p, bp));
	            }else if(typeof p == 'string' && bp){
	                p += '&' + Rs.urlEncode(bp);
	            }
	        }else if(bp){
	            p = Rs.urlEncode(bp);
	        }
	        return p;
	    }
		
	});
	
	var ActionSubmit = function(){
		ActionSubmit.superclass.constructor.apply(this, arguments);
	};
	
	Ext.extend(ActionSubmit, Ext.form.Action.Submit, {
		
		run : function(){
	        var o = this.options;
	        if(o.clientValidation === false || this.form.isValid()){
	            if (o.submitEmptyText === false) {
	                var fields = this.form.items,
	                    emptyFields = [],
	                    setupEmptyFields = function(f){
	                        if (f.el.getValue() == f.emptyText) {
	                            emptyFields.push(f);
	                            f.el.dom.value = "";
	                        }
	                        if(f.isComposite && f.rendered){
	                            f.items.each(setupEmptyFields);
	                        }
	                    };
	                    
	                fields.each(setupEmptyFields);
	            }
	            
	            var url = o.url || this.form.url || this.form.el.dom.action;
	            Rs.Service.call({
	            		form : this.form.el.dom,
						url : url,
						accept : 'html',
						method : o.method,
						params : this.getParams(),
						success : this.success,
			            failure : this.failure,
			            scope : this,
			            timeout : (o.timeout*1000) || (this.form.timeout*1000),
			            upload : this.form.fileUpload ? this.success : undefined,
						isUpload : this.form.fileUpload
					});
	            if (o.submitEmptyText === false) {
	                Ext.each(emptyFields, function(f) {
	                    if (f.applyEmptyText) {
	                        f.applyEmptyText();
	                    }
	                });
	            }
	        }else if (o.clientValidation !== false){ // client validation failed
	            this.failureType = Ext.form.Action.CLIENT_INVALID;
	            this.form.afterAction(this, false);
	        }
	    }, 
	    
	    // private
	    getParams : function(){
	        var bp = this.form.baseParams;
	        var p = this.options.params;
	        if(p){
	            if(typeof p == "object"){
	                p = Rs.urlEncode(Rs.applyIf(p, bp));
	            }else if(typeof p == 'string' && bp){
	                p += '&' + Rs.urlEncode(bp);
	            }
	        }else if(bp){
	            p = Rs.urlEncode(bp);
	        }
	        return p;
	    }
		
	});
	
	
	var ACTION_TYPES = {
		'load' : ActionLoad,
	    'submit' : ActionSubmit
	};
	
	/**
	 * @class Rs.ext.form.BasicForm
	 * @extends Ext.util.Observable
	 * @constructor
	 * @param {Mixed} el The form element or its id
	 * @param {Object} config Configuration options
	 */
	Rs.ext.form.BasicForm = function(){
		Rs.ext.form.BasicForm.superclass.constructor.apply(this, arguments);
	};

	Ext.extend(Rs.ext.form.BasicForm, Ext.form.BasicForm, {

		/**
		 * 默认值为load
		 * @cfg {String} loadMethod 
		 */
		loadMethod : 'load',
		
		/**
		 * 提交到后台的业务方法名称，默认的方法名称是submit
		 * 
		 * @cfg {String} submitMethod 
		 */
		submitMethod : 'submit',
		
	    /**
	     * @cfg {String} waitTitle
	     * The default title to show for the waiting message box (defaults to <tt>'Please Wait...'</tt>)
	     */
	    waitTitle: '请稍等...',
	    
	    //private
	    doAction : function(action, options){
	        if(Ext.isString(action)){
	            action = new ACTION_TYPES[action](this, options);
	        }
	        if(this.fireEvent('beforeaction', this, action) !== false){
	            this.beforeAction(action);
	            action.run.defer(100, action);
	        }
	        return this;
    	},
	    
	    /**
	     * Shortcut to {@link #doAction do} a {@link Ext.form.Action.Submit submit action}.
	     * @param {Object} options The options to pass to the action (see {@link #doAction} for details).<br>
	     * @return {BasicForm} this
	     */
	    submit : function(options){
	        options = options || {};
	        Ext.apply(options, {
				method : this.submitMethod
			});
	        if(this.standardSubmit){
	            var v = options.clientValidation === false || this.isValid();
	            if(v){
	                var el = this.el.dom;
	                if(this.url && Ext.isEmpty(el.action)){
	                    el.action = this.url;
	                }
	                el.submit();
	            }
	            return v;
	        }
	        this.doAction('submit', options);
	        return this;
	    },

	    /**
	     * Shortcut to {@link #doAction do} a {@link Ext.form.Action.Load load action}.
	     * @param {Object} options The options to pass to the action (see {@link #doAction} for details)
	     * @return {BasicForm} this
	     */
	    load : function(options){
	    	Ext.apply(options, {
				method : this.loadMethod
			});
	        this.doAction('load', options);
	        return this;
	    }
	  
	});

})();
Ext.ns("Rs.ext.form");

(function(){
	
	/**
	 * @class Rs.ext.form.FormPanel
	 * @extends Ext.form.FormPanel
	 * @constructor
	 * @param {Object} config Configuration options
	 * @xtype rs-ext-formpanel
	 */
	Rs.ext.form.FormPanel = function(){
		Rs.ext.form.FormPanel.superclass.constructor.apply(this, arguments);
	}; 
		
	Ext.extend(Rs.ext.form.FormPanel, Ext.form.FormPanel, {

		/**
		 * 默认值为load
		 * @cfg {String} loadMethod 
		 */
		loadMethod : 'load',
		
		/**
		 * 提交到后台的业务方法名称，默认的方法名称是submit
		 * 
		 * @cfg {String} submitMethod 
		 */
		submitMethod : 'submit',
		
		// private
	    createForm : function(){
	        var config = Ext.applyIf({listeners: {}}, this.initialConfig);
	        return new Rs.ext.form.BasicForm(null, config);
	    }

	});
	Ext.reg('rs-ext-formpanel', Rs.ext.form.FormPanel);

})();
Ext.ns("Rs.ext.form");
(function(){
    /**
     * @class Rs.ext.form.KindEditorPanel
     * @extends Ext.Panel
     * @constructor
     * @param {Object} config Configuration options
     * @xtype rs-ext-kindeditorpanel
     */
    Rs.ext.form.KindEditorPanel =  function(config){
        //提供2种方式路径配置
        if(!config.uploadJson && config.upload){
            var upload = config.upload ;
            config.uploadJson = upload.url + '?Rs-method=' + upload.method + "&Rs-accept=html&fileDir=" + upload.fileDir ;
            delete config.upload ;
        }
        Ext.apply(this, config);
        Rs.ext.form.KindEditorPanel.superclass.constructor.apply(this, arguments);
    }
    
    Ext.extend(Rs.ext.form.KindEditorPanel , Ext.Panel , {
        /**
         * @cfg {Array} 配置编辑器的工具栏，其中"-"表示换行，"|"表示分隔符。
         */
        editoritems : [
            'source', '|', 'undo', 'redo', '|' ,'print', 'rstemplate', 'code', 'cut', 'copy',
            'paste','plainpaste', 'wordpaste', '|', 'justifyleft', 'justifycenter', 'justifyright',
            'justifyfull', 'insertorderedlist', 'insertunorderedlist', 'indent', 'outdent', 'subscript',
            'superscript', 'clearhtml', 'quickformat', 'selectall', '|', 'fullscreen', '/',
            'formatblock', 'fontname', 'fontsize', '|', 'forecolor', 'hilitecolor', 'bold',
            'italic', 'underline', 'strikethrough', 'lineheight', 'removeformat', '|', 'image', 'multiimage',
            'flash', 'media','insertVideo' , 'table', 'hr', 'emoticons', 'baidumap', 'pagebreak',
            'anchor', 'link', 'unlink', '|', 'about'
        ],
        /**
         * @cfg {Boolean} 2 或1 或0，2 时可以拖动改变宽度和高度，1 时只能改变高度，0 时不能拖动 (默认：2)
         */
        resizeType : 2 ,
        /**
         * @cfg {String} 编辑器提交请求地址
         * 例如 uploadJson: '/rsc/rsclient/attachment?Rs-method=upload&fileDir=oa&Rs-accept=html',
         * 需要携带3个参数:Rs-method , fileDir , Rs-accept
         */
        uploadJson : '' ,
        /**
         * @cfg {Object} 
         */
        upload : {} ,
        
        height : 500 ,
        
        width : '90%' ,
        
        editorConfig : {} ,
        
        htmlEditor : {} ,
        
        onRender : function(ct , position){
            Rs.ext.form.KindEditorPanel.superclass.onRender.apply(this, arguments);
            var K = KindEditor  ,
                el = Ext.getDom(ct.dom) ,
                len = el.childNodes.length ,
                dom ;
            function getNode(dom){
                if(Ext.getDom(dom).childNodes.length > 0){
                    return getNode(dom.childNodes[0]);
                } else {
                    return dom ;
                }
            }
            if(len){
               dom = getNode(ct.dom);
            }
            Rs.apply(this.editorConfig || {} ,{
                items : this.editoritems,
                uploadJson : this.uploadJson ,
                height: this.height ,
                filterMode : false ,//true时过滤HTML代码,false时允许输入任何代码.默认值：false
                width: this.width ,
                resizeType: this.resizeType//2 或1 或0，2 时可以拖动改变宽度和高度，1 时只能改变高度，0 时不能拖动。
            });
            htmlEditor = K.create(dom , this.editorConfig);
        } ,
        
        /**
         * 设置编辑器内容
         */
        setValue : function(value){
            this.getEditor().html(value);
        } ,
        
        /**
         * 返回编辑器内容
         */
        getValue : function(){
            return htmlEditor.html();
        } ,
        
        /**
         * 清除编辑器内容
         */
        clearValue : function(){
            htmlEditor.html('');
        } ,
        
        /**
         * 获取KindEditor
         */
        getEditor : function(){
            return htmlEditor ;
        }
    });
    Ext.reg('kindeditor', Rs.ext.form.KindEditorPanel);
})();

Ext.ns("Rs.ext.form");
(function(){
    /**
     * @class Rs.ext.form.SimpleFileUploadPanel
     * @extends Ext.Panel
     * @constructor
     * @param {Object} config Configuration options
     * @xtype rs-ext-simplefileuploadpanel
     */
    Rs.ext.form.SimpleFileUploadPanel =  function(config){
        
        Ext.apply(this,config);
        
        this.attachmentIdTextField = new Ext.form.TextField({
            dataIndex : 'attachmentIdTextField',
            hidden : true ,
            value : -1
        });
        this.gp = new Ext.grid.GridPanel({
            stripeRows :true ,
            autoHeight : true ,
            border :false,
            hideHeaders : true ,
            store: new Ext.data.Store({
                fields:['attachmentId' , 'attachmentIndex' , 'id','name','type','size','state','percent']
            }),
            columns: [
                {header: '附件编码', width: 10, hidden: true,dataIndex: 'attachmentId', menuDisabled:true},
                {header: '附件索引', width: 10, hidden: true,dataIndex: 'attachmentIndex', menuDisabled:true},
                {header: '文件名', width: 190, sortable: true,dataIndex: 'name', menuDisabled:true},
                {header: '类型', width: 50, sortable: true,dataIndex: 'type', menuDisabled:true},
                {header: '大小', width: 80, sortable: true,dataIndex: 'size', menuDisabled:true,renderer:this.formatFileSize},
                {header: '进度', width: 150, sortable: true,dataIndex: 'percent', menuDisabled:true,renderer:this.formatProgressBar,scope:this},
                {header: '状态', width: 70, sortable: true,dataIndex: 'state', menuDisabled:true,renderer:this.formatFileState,scope:this},
                {header: '&nbsp;',width:200,dataIndex:'id', menuDisabled:true,renderer:this.formatDelBtn}
            ]
        });
        
        this.setting = {
            upload_url : this.uploadUrl, 
            flash_url : this.flashUrl,
            file_size_limit : this.fileSize || (1024*50) ,//上传文件体积上限，单位MB
            file_post_name : this.filePostName,
            file_types : this.fileTypes||"*.*",  //允许上传的文件类型 
            file_types_description : "All Files",  //文件类型描述
            file_upload_limit : "0",  //限定用户一次性最多上传多少个文件，在上传过程中，该数字会累加，如果设置为“0”，则表示没有限制 
            //file_queue_limit : "10",//上传队列数量限制，该项通常不需设置，会根据file_upload_limit自动赋值              
            post_params : this.postParams ,
            use_query_string : true,
            debug : false,
            button_cursor : SWFUpload.CURSOR.HAND,
            button_window_mode : SWFUpload.WINDOW_MODE.TRANSPARENT,
            custom_settings : {//自定义参数
                scope_handler : this
            },
            file_queued_handler : this.onFileQueued,
            swfupload_loaded_handler : function(){},// 当Flash控件成功加载后触发的事件处理函数
            file_dialog_start_handler : function(){},// 当文件选取对话框弹出前出发的事件处理函数
            file_dialog_complete_handler : this.onDiaogComplete,//当文件选取对话框关闭后触发的事件处理
            upload_start_handler : this.onUploadStart,// 开始上传文件前触发的事件处理函数
            upload_success_handler : this.onUploadSuccess,// 文件上传成功后触发的事件处理函数 
            swfupload_loaded_handler : function(){},// 当Flash控件成功加载后触发的事件处理函数  
            upload_progress_handler : this.uploadProgress,
            upload_complete_handler : this.onUploadComplete,
            upload_error_handler : this.onUploadError,
            file_queue_error_handler : this.onFileError
        };
        this.uppanel = new Ext.Panel({
			hidden : true ,
            autoHeight:true ,
            items :[this.attachmentIdTextField , this.gp] ,
            border : false
        });
        
        Ext.apply(this.listeners || {} , {
            'afterrender':function(){
                    var em = this.getTopToolbar().get(0).el.child('em');
                    var placeHolderId = Ext.id();
                    em.setStyle({
                        position : 'relative',
                        display : 'block' ,
                        'z-index' : 1
                    });
                    
                    em.createChild({
                        tag : 'div',
                        id : placeHolderId
                    });
                    
                    this.swfupload = new SWFUpload(Ext.apply(this.setting,{
                        button_width : em.getWidth(),
                        button_height : em.getHeight(),
                        button_placeholder_id :placeHolderId
                    }));
                    this.swfupload.uploadStopped = false;
                    Ext.get(this.swfupload.movieName).setStyle({
                        position : 'absolute',
                        top : '0px' ,
                        left : '-2px' ,
                        'z-index' : 2
                    });
                },
                scope : this,
                delay : 100
        });
		
        this.addBtn = new Ext.Button({
            text:'添加文件',
            iconCls:'rs-action-addfile'
        }),
        this.uploadBtn = new Ext.Button({
            text:'上传文件',
            iconCls:'rs-action-uploadfile',
            handler:this.startUpload,
            scope:this
        });
        this.stopBtn = new Ext.Button({
            text:'停止上传',
            iconCls:'rs-action-stopfile',
            handler:this.stopUpload,
            scope:this
        });
        this.deleteBtn = new Ext.Button({
            text:'删除所有',
            iconCls:'rs-action-cleanfile',
            handler:this.deleteAll,
            scope:this
        });
        var btns = [this.addBtn, '-'];
        if(this.enableFile){
            btns.push(this.uploadBtn);
            btns.push('-');
            btns.push(this.stopBtn);
            btns.push('-');
        }
        btns.push(this.deleteBtn);
        
        Rs.ext.form.SimpleFileUploadPanel.superclass.constructor.call(this, {
            border : false ,
            tbar : new Ext.Toolbar({
                hideBorders : true ,
                style: 'background-color:#FFFFFF; background-image:url();', 
                items: [btns]
            }),
            layout : 'fit' ,
            items : [this.uppanel]
        });
		
        this.addEvents(
        /**
         * @event diaogcomplete 在文件选择框关闭后触发
         * @param {SimpleFileUploadPanel} this
         */
        'diaogcomplete' ,
        
        /**
         * @event uploadsuccess 文件上传完成后触发
         * @param {SimpleFileUploadPanel} this
         * @param {Object} serverData
         * @param {Object} fileoption
         */
        'uploadsuccess' ,
        
        /**
         * @event deletefile 删除文件后触发
         * @param {SimpleFileUploadPanel} this
         * @param {Object} serverData
         */
        'deletefile'
        );
    }
    
    Ext.extend(Rs.ext.form.SimpleFileUploadPanel , Ext.Panel , {
	   
       //Myeclipse环境
       //flashUrl : '/rsc/js/rs/ext/resources/swfupload.swf' ,
       //标准环境
       flashUrl : '/com/rsc/rs/pub/rsclient2/rs/ext/resources/swfupload.swf' ,
       
	   /**
        * @cfg {Boolean} 是否可以通过点击上传按钮上传文件，默认true
        */
	   enableFile : true ,
	   
       width : 600 ,
       
       fieldLabel: null,
       
       fileSize : 1024*50 ,//限制文件大小 MB
       
       uploadUrl : null ,
       
       fileTypes : '*.*',//可上传文件类型
       
       postParams : {
       
       } ,

       toggleBtn :function(bl){
            this.addBtn.setDisabled(bl);
            if(this.uploadBtn){
                this.uploadBtn.setDisabled(bl);
            }
            if(this.stopBtn){
                this.stopBtn.setDisabled(!bl);
            }
            this.deleteBtn.setDisabled(bl);
            this.gp.getColumnModel().setHidden(6,bl);
        },
        onUploadStart : function(file) {  
           var post_params = this.settings.post_params;  
           Ext.apply(post_params,{//处理中文参数问题
                //fileName : file.name,
                fileName : encodeURIComponent(file.name) ,
                attachmentId : this.customSettings.scope_handler.attachmentIdTextField.getValue(),
                uploadType : 'simplePanel'
           });  
           this.setPostParams(post_params);  
        },
        startUpload : function() {
            if (this.swfupload) {
                if (this.swfupload.getStats().files_queued > 0) {
                    this.swfupload.uploadStopped = false;
                    this.toggleBtn(true);
                    this.swfupload.startUpload();
                }
            }
        },
        
        formatFileSize : function(_v, celmeta, record) {
            return Ext.util.Format.fileSize(_v);
        },
        
        formatFileState : function(n){//文件状态
            switch(n){
                case -1 : return '未上传';
                break;
                case -2 : return '正在上传';
                break;
                case -3 : return '<div style="color:red;">上传失败</div>';
                break;
                case -4 : return '上传成功';
                break;
                case -5 : return '取消上传';
                break;
                default: return n;
            }
        },
        
        formatProgressBar : function(v){
            var progressBarTmp = this.getTplStr(v);
            return progressBarTmp;
        },
        
        getTplStr : function(v){
            var bgColor = "#6593CF";
            var borderColor = "#7FA9E4";
            return String.format(
                '<div>'+
                    '<div style="border:1px solid {0};height:10px;width:{1}px;margin:4px 0px 1px 0px;float:left;">'+        
                        '<div style="float:left;background:{2};width:{3}%;height:10px;"><div></div></div>'+
                    '</div>'+
                '<div style="text-align:center;float:right;width:40px;margin:3px 0px 1px 0px;height:10px;font-size:12px;">{3}%</div>'+          
            '</div>', borderColor,(90),bgColor, v);
        } ,
        onUploadComplete : function(file) {
            var me = this.customSettings.scope_handler;
            if(file.filestatus==-4){
                var ds = me.gp.store;
                for(var i=0;i<ds.getCount();i++){
                    var record =ds.getAt(i);
                    if(record.get('id')==file.id){
                        record.set('percent', 100);
                        if(record.get('state')!=-3){
                            record.set('state', file.filestatus);
                        }
                        record.commit();
                    }
                }
            }
            if (this.getStats().files_queued > 0 && this.uploadStopped == false) {
                this.startUpload();
            } else {          
                me.toggleBtn(false);
                me.linkBtnEvent();
            }
        },
        
        onFileQueued : function(file) {
            var me = this.customSettings.scope_handler;
            var rec = new Ext.data.Record({
                id : file.id,
                name : file.name,
                size : file.size,
                type : file.type,
                state : file.filestatus,
                percent : 0
            })
            me.gp.getStore().add(rec);
        },
        
        onUploadSuccess : function(file, serverData) {
            var me = this.customSettings.scope_handler;
            var ds = me.gp.store;
            if (Ext.util.JSON.decode(serverData).success) {         
                for(var i=0;i<ds.getCount();i++){
                    var rec =ds.getAt(i);
                    if(rec.get('id')==file.id){
                        rec.set('state', file.filestatus);
                        rec.set('attachmentId', Ext.util.JSON.decode(serverData).attachmentId);
                        rec.set('attachmentIndex', Ext.util.JSON.decode(serverData).attachmentIndex);
                        me.attachmentIdTextField.setValue(Ext.util.JSON.decode(serverData).attachmentId);
                        rec.commit();
                    }
                }          
            }else{
                for(var i=0;i<ds.getCount();i++){
                    var rec =ds.getAt(i);
                    if(rec.get('id')==file.id){
                        rec.set('percent', 0);
                        rec.set('state', -3);
                        rec.commit();
                    }
                }
            }
            me.linkBtnEvent();
            me.fireEvent('uploadsuccess' , me , Ext.util.JSON.decode(serverData) , file);
        },
        uploadProgress : function(file, bytesComplete, totalBytes){//处理进度条
            var me = this.customSettings.scope_handler;
            var percent = Math.ceil((bytesComplete / totalBytes) * 100);
            percent = percent == 100? 99 : percent;
            var ds = me.gp.store;
            for(var i=0;i<ds.getCount();i++){
                var record =ds.getAt(i);
                if(record.get('id')==file.id){
                    record.set('percent', percent);
                    record.set('state', file.filestatus);
                    record.commit();
                }
            }
        },
        onUploadError : function(file, errorCode, message) {
            var me = this.customSettings.scope_handler;
            me.linkBtnEvent();
            var ds = me.gp.store;
            for(var i=0;i<ds.getCount();i++){
                var rec =ds.getAt(i);
                if(rec.get('id')==file.id){
                    rec.set('percent', 0);
                    rec.set('state', file.filestatus);
                    rec.commit();
                }
            }
        },
        onFileError : function(file,n){
            switch(n){
                case -100 : tip('待上传文件列表数量超限，不能选择！');
                break;
                case -110 : tip('文件太大，不能选择！');
                break;
                case -120 : tip('该文件大小为0，不能选择！');
                break;
                case -130 : tip('该文件类型不可以上传！');
                break;
            }
            function tip(msg){
                Ext.Msg.show({
                    title : '提示',
                    msg : msg,
                    width : 280,
                    icon : Ext.Msg.WARNING,
                    buttons :Ext.Msg.OK
                });
            }
        },
        onDiaogComplete : function(){
            var me = this.customSettings.scope_handler;
            me.linkBtnEvent();
			me.uppanel.show() ;
            me.fireEvent('diaogcomplete' , me);
        },
        stopUpload : function() {
            if (this.swfupload) {
                this.swfupload.uploadStopped = true;
                this.swfupload.stopUpload();
            }
            var me = this.customSettings.scope_handler;
            me.fireEvent('stopupload' , me);
        },
        deleteAll : function(){
            var ds = this.gp.store;
            for(var i=0;i<ds.getCount();i++){
                var record =ds.getAt(i);
                var file_id = record.get('id');
                this.deleteFile(record.get('attachmentId') , record.get('attachmentIndex') , record.get('state'));
                this.swfupload.cancelUpload(file_id,false);         
            }
            ds.removeAll();
            this.swfupload.uploadStopped = false;
            this.fireEvent('removeall' , this);
			this.uppanel.hide();
        },
        formatDelBtn : function(v){
            return "<a href='#' id='"+v+"'  style='color:red' class='link' ext:qtip='移除该文件'>移除</a>";
        },
        linkBtnEvent : function(){
            Ext.select('a.link',false,this.gp.el.dom).on('click',function(o,e){
                var ds = this.gp.store;
                for(var i=0;i<ds.getCount();i++){
                    var rec =ds.getAt(i);
                    if(rec.get('id')== e.id){
                        ds.remove(rec);
                        this.deleteFile(rec.get('attachmentId') , rec.get('attachmentIndex') , rec.get('state'));
                    }
                }           
                this.swfupload.cancelUpload(e.id,false) ;
            },this);
        } ,
        
        deleteFile : function(attachmentId , attachmentIndex , statu){
            if(statu != -4){
               return ;
            }
            Rs.Service.call({
                url : '/rsc/rsclient/attachment' ,
                method : 'deleteFile' ,
                params : {
                    attachmentId : attachmentId ,
                    attachmentIndex : attachmentIndex
                }
            } , function(result){
                this.fireEvent('deletefile' , this , result);
            } , this );
        }
    });
    Ext.reg('rs-ext-simplefileuploadpanel', Rs.ext.form.SimpleFileUploadPanel);
})();
Ext.ns("Rs.ext.form");

(function() {
    
    Rs.ext.form.DateField = function(config) {
        config = config ||{};
        Rs.ext.form.DateField.superclass.constructor.apply(this, arguments);
    };
    
    Ext.extend(Rs.ext.form.DateField, Ext.form.DateField, {
        
        setValue : function(date){
            var date = Rs.ext.form.DateField.superclass.setValue.apply(this, arguments);
            return date ;
        } ,
        
        getValue : function(){
            return Ext.form.DateField.superclass.getValue.apply(this,arguments) || "" ;
        } ,
        
        onTriggerClick : function(){
            
            if(this.disabled){
                return;
            }
            if(this.menu == null){
                this.menu = new Ext.menu.DateMenu({
                    hideOnClick: false,
                    focusOnSelect: false
                });
            }
            this.onFocus();
            Ext.apply(this.menu.picker,  {
                minDate : this.minValue,
                maxDate : this.maxValue,
                disabledDatesRE : this.disabledDatesRE,
                disabledDatesText : this.disabledDatesText,
                disabledDays : this.disabledDays,
                disabledDaysText : this.disabledDaysText,
                format : this.format,
                showToday : this.showToday,
                startDay: this.startDay,
                minText : String.format(this.minText, this.formatDate(this.minValue)),
                maxText : String.format(this.maxText, this.formatDate(this.maxValue))
            });
            //需要先将字符串转换成Date类型
            var value = this.parseDate(this.getValue()) || "" ;
            this.menu.picker.setValue( value || new Date());
            this.menu.show(this.el, "tl-bl?");
            this.menuEvents('on');
        }
    });
    
    Ext.ComponentMgr.registerType("rs-ext-datefield", Rs.ext.form.DateField);
})();
Ext.ns("Rs.ext.form");


(function(){
	
	/**
	 * @class Rs.ext.form.PeriodField
	 * 
	 * 核算期控件，用于编辑和显示核算期.<br/>
	 * 例如： 2010/05 表示2010年05核算期<br/>
	 * 一般情况核算期由年和月份构成.<br/>
	 * 
	 * @extends Ext.form.DateField
	 * Provides a date input form with a dropdown and automatic date validation.
	 * @constructor
	 * Create a new PeriodField
	 * @param {Object} config
	 * 
	 * 
	 */
	Rs.ext.form.PeriodField = function(cfg){
		Rs.ext.form.PeriodField.superclass.constructor.call(this, Ext.apply({}, cfg || {}));
	};
	Ext.extend(Rs.ext.form.PeriodField, Ext.form.DateField, {
	    
		/**
	     * @cfg {String} format
	     * The default date format string which can be overriden for localization support.  The format must be
	     * valid according to {@link Date#parseDate}, only considering the part with Y and m (defaults to <tt>'Y-m'</tt>).
	     * <p>日期显示格式，可被覆盖，有效格式参照{@link Date#parseDate}中涉及年月的部分，缺省为<tt>‘Y-m’</tt></p>
	     */
		format: "Y-m",

	    /**
	     * @cfg {String} altFormats
	     * Multiple date formats separated by "<tt>|</tt>" to try when parsing a user input value and it
	     * does not match the defined format (defaults to
	     * <tt>'m/Y|m-Y|mY|Ym|Y-m|Y.m|m.Y|m月Y年|Y年m月'</tt>).
	     * <p>手动输入时，支持除缺省格式之外的用‘<tt>|</tt>’分隔的多种日期格式</p>
	     */
		altFormats : "m/Y|m-Y|mY|Ym|Y-m|Y.m|m.Y|m月Y年|Y年m月",
		
		triggerClass: "x-form-date-trigger",
		
		parseDate : function(value) {        
			if(!value || Ext.isDate(value)){            
				return value;        
			}        
			var v = this.safeParse(value, this.format),            
			af = this.altFormats,            
			afa = this.altFormatsArray;        
			if (!v && af) {            
				afa = afa || af.split("|");            
				for (var i = 0, len = afa.length; i < len && !v; i++) {  
					if(afa[i].charAt(0) != this.format.charAt(0)){
						continue;
					}
					v = this.safeParse(value, afa[i]);            
				}        
			}        
			return v;    
		},
		
		setValue : function(v){
			this.value = v;
			Rs.ext.form.PeriodField.superclass.setValue.call(this,v);
		},
		
		getValue : function(){
			return this.value;
		},
		/*safeParse : function(value, format) {        
			if (/[gGhH]/.test(format.replace(/(\\.)/g, ''))) {            
				// if parse format contains hour information, no DST adjustment is necessary            
					return Date.parseDate(value, format);        
				} else {
					// set time to 12 noon, then clear the time            
					var parsedDate = Date.parseDate(value + ' ' + this.initTime, format + ' ' + this.initTimeFormat);            
					if (parsedDate) {                
						return parsedDate.clearTime();            
					}        
				}    
		},*/
		
		//private
		menuListeners: {
			select: function(m, d){
				this.setValue(d.format(this.format));
			},
			show: function(){
				this.onFocus();
			},
			hide: function(){
				this.focus.defer(10, this);
				var ml = this.menuListeners;
				this.menu.un("select", ml.select, this);
				this.menu.un("show", ml.show, this);
				this.menu.un("hide", ml.hide, this);
			}
		},
		//private
		onTriggerClick: function(){
			if (this.disabled) {
				return;
			}
			if (this.menu == null) {
				this.menu = new MonthMenu();
			}
			Ext.apply(this.menu.picker, {});
			this.menu.on(Ext.apply({}, this.menuListeners, {
				scope: this
			}));
			this.menu.show(this.el, "tl-bl?");
		}
	});
	//private
	var MonthMenu = function(config){
		MonthMenu.superclass.constructor.call(this, config);
		this.plain = true;
		var mi = new MonthItem(config);
		this.add(mi);
		this.picker = mi.picker;
		this.relayEvents(mi, ["select"]);
	};
	Ext.extend(MonthMenu, Ext.menu.Menu, {
		cls: 'x-date-menu'
	});
	//private
	var MonthAdapter = function(component, config){
		MonthAdapter.superclass.constructor.call(this, config);
		this.component = component;
	};
	Ext.extend(MonthAdapter, Ext.menu.BaseItem, {
		canActivate: true,
		onRender: function(container, position){
			this.component.render(container);
			this.el = this.component.getEl();
		},
		activate: function(){
			if (this.disabled) {
				return false;
			}
			this.component.focus();
			this.fireEvent("activate", this);
			return true;
		},
		deactivate: function(){
			this.fireEvent("deactivate", this);
		},
		disable: function(){
			this.component.disable();
			MonthAdapter.superclass.disable.call(this);
		},
		enable: function(){
			this.component.enable();
			MonthAdapter.superclass.enable.call(this);
		}
	});
	//private
	var MonthItem = function(config){
		MonthItem.superclass.constructor.call(this, new MonthPicker(config), config);
        this.picker = this.component;
        this.addEvents('select');
        this.picker.on("render", function(picker){
            picker.getEl().swallowEvent("click");
            picker.container.addClass("x-menu-date-item");
        });
        this.picker.on("select", this.onSelect, this);
    };
    Ext.extend(MonthItem, MonthAdapter, {
        onSelect: function(picker, date){
            this.fireEvent("select", this, date, picker);
            picker.hideMonthPicker();
        }
    });
    //private
    var MonthPicker = Ext.extend(Ext.Component, {
		format: "M-y",
		okText: '当前年月',//Ext.DatePicker.prototype.okText,
		cancelText: '取消',//Ext.DatePicker.prototype.cancelText,
		constrainToViewport: true,
		monthNames: ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'],//Date.monthNames,
		startDay: 0,
		value: 0,
		noPastYears: false,
		initComponent: function(){
			MonthPicker.superclass.initComponent.call(this);
			this.value = this.value ? this.value.clearTime() : new Date().clearTime();
			this.addEvents('select');
			if (this.handler) {
				this.on("select", this.handler, this.scope || this);
			}
		},
		focus: function(){
			if (this.el) {
				this.update(this.activeDate);
			}
		},
		onRender: function(container, position){
			var m = ['<div style="width: 200px; height:175px;"></div>'];
			m[m.length] = '<div class="x-date-mp"></div>';
			var el = document.createElement("div");
			el.className = "x-date-picker";
			el.innerHTML = m.join("");
			container.dom.insertBefore(el, position);
			this.el = Ext.get(el);
			this.monthPicker = this.el.down('div.x-date-mp');
			this.monthPicker.enableDisplayMode('block');
			this.el.unselectable();
			this.showMonthPicker();
			if (Ext.isIE) {
				this.el.repaint();
			}
			this.update(this.value);
		},
		createMonthPicker: function(){
			if (!this.monthPicker.dom.firstChild) {
				var buf = ['<table border="0" cellspacing="0">'];
				for (var i = 0; i < 6; i++) {
					buf.push('<tr>',
						i == 0 ? '<td class="x-date-mp-ybtn" align="center"><a class="x-date-mp-prev"></a></td><td class="x-date-mp-ybtn" align="center"><a class="x-date-mp-next x-date-mp-sep"></a></td>' : '<td class="x-date-mp-year"><a href="#"></a></td><td class="x-date-mp-year  x-date-mp-sep"><a href="#"></a></td>',
						'<td class="x-date-mp-month"><a href="#">', 
						this.monthNames[i].substr(0, 3), '</a></td>', 
						'<td class="x-date-mp-month"><a href="#">', 
						this.monthNames[i + 6].substr(0, 3), 
						'</a></td></tr>');
				}
				buf.push('<tr class="x-date-mp-btns"><td colspan="4"><button type="button" class="x-date-mp-ok">', this.okText, '</button><button type="button" class="x-date-mp-cancel">', this.cancelText, '</button></td></tr>', '</table>');
				this.monthPicker.update(buf.join(''));
				this.monthPicker.on('click', this.onMonthDblClick, this);
				this.monthPicker.on('dblclick', this.onMonthDblClick, this);
				this.mpMonths = this.monthPicker.select('td.x-date-mp-month');
				this.mpYears = this.monthPicker.select('td.x-date-mp-year');
				this.mpMonths.each(function(m, a, i){
					i += 1;
					if ((i % 2) == 0) {
						m.dom.xmonth = 5 + Math.round(i * .5);
					} else {
						m.dom.xmonth = Math.round((i - 1) * .5);
					}
				});
			}
		},
		showMonthPicker: function(){
			this.createMonthPicker();
			var size = this.el.getSize();
			this.monthPicker.setSize(size);
			this.monthPicker.child('table').setSize(size);
			this.mpSelMonth = (this.activeDate || this.value).getMonth();
			this.updateMPMonth(this.mpSelMonth);
			this.mpSelYear = (this.activeDate || this.value).getFullYear();
			this.updateMPYear(this.mpSelYear);
			this.monthPicker.show();
			//this.monthPicker.slideIn('t', {duration:.2});
		},
		updateMPYear: function(y){
			if (this.noPastYears) {
				var minYear = new Date().getFullYear();
				if (y < (minYear + 4)) {
					y = minYear + 4;
				}
			}
			this.mpyear = y;
			var ys = this.mpYears.elements;
			for (var i = 1; i <= 10; i++) {
				var td = ys[i - 1], y2;
				if ((i % 2) == 0) {
					y2 = y + Math.round(i * .5);
					td.firstChild.innerHTML = y2;
					td.xyear = y2;
				} else {
					y2 = y - (5 - Math.round(i * .5));
					td.firstChild.innerHTML = y2;
					td.xyear = y2;
				}
				this.mpYears.item(i - 1)[y2 == this.mpSelYear ? 'addClass' : 'removeClass']('x-date-mp-sel');
			}
		},
		updateMPMonth: function(sm){
			this.mpMonths.each(function(m, a, i){
				m[m.dom.xmonth == sm ? 'addClass' : 'removeClass']('x-date-mp-sel');
			});
		},
		selectMPMonth: function(m){},
		onMonthClick: function(e, t){
			e.stopEvent();
			var el = new Ext.Element(t), pn;
			if (el.is('button.x-date-mp-cancel')) {
				this.hideMonthPicker();
				//this.fireEvent("select", this, this.value);
			} else if (el.is('button.x-date-mp-ok')) {
	            this.update(new Date().clearTime());//this.update(new Date(this.mpSelYear, this.mpSelMonth, (this.activeDate || this.value).getDate()));
				//this.hideMonthPicker();
				this.fireEvent("select", this, this.value);
			} else if (pn = el.up('td.x-date-mp-month', 2)) {
				this.mpMonths.removeClass('x-date-mp-sel');
				pn.addClass('x-date-mp-sel');
				this.mpSelMonth = pn.dom.xmonth;
			} else if (pn = el.up('td.x-date-mp-year', 2)) {
				this.mpYears.removeClass('x-date-mp-sel');
				pn.addClass('x-date-mp-sel');
				this.mpSelYear = pn.dom.xyear;
			} else if (el.is('a.x-date-mp-prev')) {
				this.updateMPYear(this.mpyear - 10);
			} else if (el.is('a.x-date-mp-next')) {
				this.updateMPYear(this.mpyear + 10);
			}
		},
		onMonthDblClick: function(e, t){
			e.stopEvent();
			var el = new Ext.Element(t), pn;
			if (el.is('button.x-date-mp-cancel')) {
				this.hideMonthPicker();
				//this.fireEvent("select", this, this.value);
			} else if (el.is('button.x-date-mp-ok')) {
				this.activeDate = new Date().clearTime();
				this.value = this.activeDate;
				this.mpSelMonth = (this.activeDate || this.value).getMonth();
				this.updateMPMonth(this.mpSelMonth);
				this.mpSelYear = (this.activeDate || this.value).getFullYear();
				this.updateMPYear(this.mpSelYear);
	            this.update(this.activeDate || this.value);//this.update(new Date(this.mpSelYear, this.mpSelMonth, (this.activeDate || this.value).getDate()));
				//this.hideMonthPicker();
				this.fireEvent("select", this, this.value);
			} else if (pn = el.up('td.x-date-mp-month', 2)) {
				this.mpMonths.removeClass('x-date-mp-sel');
				pn.addClass('x-date-mp-sel');
				this.mpSelMonth = pn.dom.xmonth;
				this.update(new Date(this.mpSelYear, pn.dom.xmonth, (this.activeDate || this.value).getDate()));
				//this.hideMonthPicker();
				this.fireEvent("select", this, this.value);
			} else if (pn = el.up('td.x-date-mp-year', 2)) {
				//this.update(new Date(pn.dom.xyear, this.mpSelMonth, (this.activeDate || this.value).getDate()));
				//this.hideMonthPicker();
				//this.fireEvent("select", this, this.value);
				this.mpYears.removeClass('x-date-mp-sel');
				pn.addClass('x-date-mp-sel');
				this.mpSelYear = pn.dom.xyear;
			}else if (el.is('a.x-date-mp-prev')) {
				this.updateMPYear(this.mpyear - 10);
			} else if (el.is('a.x-date-mp-next')) {
				this.updateMPYear(this.mpyear + 10);
			}
		},
		hideMonthPicker: function(disableAnim){
			Ext.menu.MenuMgr.hideAll();
		},
		showPrevMonth: function(e){
			this.update(this.activeDate.add("mo", -1));
		},
		showNextMonth: function(e){
			this.update(this.activeDate.add("mo", 1));
		},
		showPrevYear: function(){
			this.update(this.activeDate.add("y", -1));
		},
		showNextYear: function(){
			this.update(this.activeDate.add("y", 1));
		},
		update: function(date){
			this.activeDate = date;
			this.value = date;
			if (!this.internalRender) {
				var main = this.el.dom.firstChild;
				var w = main.offsetWidth;
				this.el.setWidth(w + this.el.getBorderWidth("lr"));
				Ext.fly(main).setWidth(w);
				this.internalRender = true;
				if (Ext.isOpera && !this.secondPass) {
					main.rows[0].cells[1].style.width = (w - (main.rows[0].cells[0].offsetWidth + main.rows[0].cells[2].offsetWidth)) + "px";
					this.secondPass = true;
					this.update.defer(10, this, [date]);
				}
			}
		}
	});
})();
Ext.ns("Rs.ext.form");

(function() {
	
	/**
	 * @class Rs.ext.form.GridLoaderField  
	 * 望远镜控件
	 * @extends Ext.form.TriggerField
	 * @constructor {Object} config
	 */
	Rs.ext.form.GridLoaderField = function(config) {
		config = config || {};
		var progCode = config.progCode,
			progCondition = config.progCondition ,
			queryPanelConfig = config.queryPanelConfig,
			gridConfig = config.gridConfig,
			buildProgCondtion = config.buildProgCondtion  ;
		
		this.columns = config.columns || [];
		delete config.columns;
		
		Rs.ext.form.GridLoaderField.superclass.constructor.call(this, Ext.apply(config, {
			enableKeyEvents : true,
			validationEvent : 'blur'
		}));
		
		//创建查询面板
		this.generalselPanel = this.initGeneralselPanel({
			progCode : progCode,
			progCondition : progCondition ,
			queryPanelConfig : queryPanelConfig ,
			gridConfig : gridConfig ,
			buildProgCondtion : buildProgCondtion 
		});
		
		this.addEvents(
			
			/**
			 * @event beforeexpand 展开之前触发该事件，如果监听的回调方法返回false,
			 * 则取消展开表格面板.
			 * @param {GridLoaderField} this
			 */
			'beforeexpand',
			
			/**
			 * @event expand 展开表格面板之后触发该事件，
			 * @param {GridLoaderField} this
			 */
			'expand', 
			
			/**
			 * @event collapse 合拢表格面板之后触发该事件
			 * @param {GridLoaderField} this
			 */
			'collapse', 
			
			/**
			 * @event beforeselect 选择数据之前触发该事件
			 * 
			 */
			'beforeselect', 
			
			/**
			 * @event select 选择数据之后触发该事件
			 */
			'select',
			
			/**
			 * @event change 值发生变化的时候触发该事件
			 * @param {String} value 新值
			 * @param {String} oldValue 老值 
			 */
			'change',
			
			/**
			 * @event passed
			 */
			'passed', 
			
			/**
			 * @event unpassed 
			 */
			'unpassed');
	};

	Ext.extend(Rs.ext.form.GridLoaderField, Ext.form.TriggerField, {
		
		/**
		 * @cfg {Number} queryDelay 
		 * 查询延迟时间,默认200毫秒
		 */
		queryDelay : 200,

		/**
		 * @cfg {Number} gridWidth 
		 * 表格宽度, 默认为410
		 */
		gridWidth : 410,
		
		/**
		 * @cfg {Number} minGridWidth 
		 * 表格最小宽度, 默认为410
		 */
		minGridWidth : 410,
		
		/**
		 * @cfg {Number} maxGridWidth 
		 * 表格最大宽度, 默认为800
		 */
		maxGridWidth : 800,
		
		/**
		 * @cfg {Number} gridHeight 
		 * 表格高度, 默认为320
		 */
		gridHeight : 320,
		
		/**
		 * @cfg {Number} minGridHeight 
		 * 表格最小高度, 默认为320 
		 */
		minGridHeight : 320,
		
		/**
		 * @cfg {Number} maxGridHeight 
		 * 表格最大高度, 默认为600
		 */
		maxGridHeight : 600,
		
		/**
		 * @cfg {String} displayField 
		 * 显示字段名称, 如果不配置该属性, 则将以表格第
		 * 二个字段为为显示字段,不存在第二个字段则以第一个字段为显示字段名称.
		 */
		
		/**
		 * @cfg {String} valueField 
		 * 值字段名称, 如果不配置, 则将以表格第一个字段为
		 * 值字段.
		 */
		
		/**
		 * @cff {String} errorValueText 
		 * 错误值提示文本
		 */
		errorValueText : '错误数据',
		
		//private
		maskRe : /[^,;'"\\]/,
		
		//private
		keyNavConfig : {
			"up" : function() {
				if(this.isExpanded()) {
					this.focusPrev();
				}
			},
			"down" : function() {
				if(!this.isExpanded()) {
					/*this.expand();
					var s = this.generalselPanel.getStore();
					if(s && s.getCount() == 0){
						this.doQuery();
					}*/
				    this.onTriggerClick();
				} else {
					this.focusNext();
				}
			},
			"enter" : function(e) {
                e.stopPropagation();
				var grid = this.generalselPanel.getGrid();
				if(this.isExpanded()){
					this.onSelect();
				}
			},
			"esc" : function() {
				if(this.isExpanded()){
					this.collapse();
				}
			}, 
			'home' : function(e){
				var pagingToolbar = this.generalselPanel.getPagingToolbar(),
					data = pagingToolbar ? pagingToolbar.getPageData() : undefined;
				if(data && data.activePage > 1){
					pagingToolbar.moveFirst();
				}
			},
			'end' : function(){
				var pagingToolbar = this.generalselPanel.getPagingToolbar(),
					data = pagingToolbar ? pagingToolbar.getPageData() : undefined;
				if(data && data.activePage < data.pages){
					pagingToolbar.moveLast();
				}
			}, 
			'pageUp' : function(){
				var pagingToolbar = this.generalselPanel.getPagingToolbar(),
					data = pagingToolbar ? pagingToolbar.getPageData() : undefined;
				if(data && data.activePage > 1){
					pagingToolbar.movePrevious();
				}
			}, 
			'pageDown' : function(){
				var pagingToolbar = this.generalselPanel.getPagingToolbar(),
					data = pagingToolbar ? pagingToolbar.getPageData() : undefined;
				if(data && data.activePage < data.pages){
					pagingToolbar.moveNext();
				}
			},
			
			scope : this,
			
			doRelay : function(e, h, hname){
                if(hname == 'down' || this.scope.isExpanded()){
                    // this MUST be called before GridLoaderField#fireKey()
                    var relay = Ext.KeyNav.prototype.doRelay.apply(this, arguments);
                    if(!Ext.isIE && Ext.EventManager.useKeydown){
                        // call GridLoaderField#fireKey() for browsers which use keydown event (except IE)
                        this.scope.fireKey(e);
                    }
                    return relay;
                }
                return true;
            },

            forceKeyDown : true,
            defaultEventAction: 'stopEvent'
		},
		
		fireKey : function(e){
	        if (!this.isExpanded()) {
	            Rs.ext.form.GridLoaderField.superclass.fireKey.call(this, e);
	        }
	    },

		//private
		fieldKeyNavConfig : {
		/*	"enter" : function(e) {
                e.stopPropagation();
				var grid = this.generalselPanel.getGrid();
				if(this.isExpanded()
					&& grid.getSelectionModel().hasSelection()) {
					this.onSelect();
				}
			},
			"up" : function() {
				this.focusPrev();
			},
			"down" : function() {
				if(!this.isExpanded()) {
					this.onTriggerClick();
				} else {
					this.focusNext();
				}
			}*/
		},

		/**
		 * 创建查询面板
		 * @param {Object} config
		 */
		initGeneralselPanel : function(config){
			config = config || {};
			config = Ext.apply(config, {
				storeAutoLoad : false,
				queryPanelConfig : Ext.applyIf(config.queryPanelConfig || {}, {
					border : true,
					margins : "1 1 0 1"
				}),
				queryPanelCollapsed : false,
				queryPanelDisable : this.readOnly == true,  //如果望远镜为只读，隐藏表格中的查询面板
				gridConfig : Ext.applyIf(config.gridConfig || {}, {
					columns : this.columns,
					border : true,
					margins : "0 1 0 1"
				}),
				buildProgCondtion : config.buildProgCondtion ,
				width : this.gridWidth,
				height : this.gridHeight,
				border : false
			});
			var generalselPanel = new Rs.ext.grid.GeneralselPanel(config);
			return generalselPanel;
		},
		
		//override
		initEvents : function() {
			Rs.ext.form.GridLoaderField.superclass.initEvents.call(this);
			this.keyNav = new Ext.KeyNav(this.el, 
				Ext.apply(this.keyNavConfig, {
					scope : this,
					forceKeyDown : true
				}));
			this.mon(this.el, 'keyup', this.filterQuery, this);
			this.on('specialkey', this.tabKeyCollapse, this);
			this.quikTask = new Ext.util.DelayedTask(this.quickAhead, this);
		},
		
		//private
		initLayer : function() {
			this.view = new Ext.Layer( {
				constrain : false,
				shadow : "sides",
				cls : " x-combo-list "
			});
			this.view.swallowEvent("mousewheel");
			this.view.swallowEvent("mousedown");
			this.resizer = new Ext.Resizable(this.view, {
				pinned : true,
				handles : 'se',
				minWidth : this.minGridWidth,
				maxWidth : this.maxGridWidth,
				minHeight : this.minGridHeight,
				maxHeight : this.maxGridHeight
			});
			this.generalselPanel.render(this.view);
			this.initLayerEvents();
		},

		//private
		initLayerEvents : function() { 
			this.fieldKeyNav = new Ext.KeyNav(this.generalselPanel.el, 
				Ext.apply( this.fieldKeyNavConfig, {
					scope : this,
					forceKeyDown : true
				}));
			this.resizer.on('resize', function(r, w, h) {
				this.generalselPanel.setWidth(w - 2);
				this.generalselPanel.setHeight(h - 2);
			}, this);
			var grid = this.generalselPanel.getGrid();
			if(grid){
				grid.on("rowclick", this.rowClick, this, {
					delay : 20,
					scope : this
				});
			}
		},
		
		//private
		filterQuery : function(e) {
            if(!e.isSpecialKey() || e.getKey() == e.BACKSPACE || e.getKey() == e.DELETE){
                if(e.getKey() == e.BACKSPACE || e.getKey() == e.DELETE){
                    this.setValue(this.getRawValue());
                }
                this.quikTask.delay(this.queryDelay);
                this.on("blur", this.clearQueryTask, this);
            }
        },
		
		//private
		clearQueryTask : function() {
			this.un("blur", this.clearQueryTask);
			this.quikTask.cancel();
		},

		//private
		quickAhead : function() {
			if(!this.isExpanded()){
				this.expand();
			}
			this.doQuery();
		},
		
		//private
		rowClick : function(g){
			var sm;
			if(g && (sm = g.getSelectionModel())) {
				this.rowSelect(sm.getSelections());
				var s = g.getStore(), desel = [];
				s.each(function(r){
					if(sm.isSelected(r) == false){
						desel.push(r);
					}
				}, this);
				this.rowDeSelect(desel);
			}
		},
		
		//private
		rowSelect : function(records) {
			this.onSelect();
		},
		
		//private
		rowDeSelect : function(records){
			
		},
		
		/**
		 * 查询数据, 如果该控件为只读readOnly = true, 且当前有值，
		 * 则查询出该值的详细信息。如果当前控件并非只读readOnly = false, 则进行模糊查询。
		 */
		doQuery : function() {
			var displayField = this.getDisplayField(),
				valueField = this.getValueField(), value,
				progCondition;
			if(this.readOnly == true){
				value = this.getValue();
				if(!Ext.isEmpty(valueField, false) && !Ext.isEmpty(value, false)){
					progCondition = valueField + ' = \'' + value + '\'';
				}else {
					progCondition = '1 <> 1';
				}
			}else {
				value = this.getRawValue();
				if(!Ext.isEmpty(displayField, false) && !Ext.isEmpty(value, false)){
					progCondition = displayField + ' like \'' + value + '%\'';
				}
			}
			progCondition = this.buildProgCondtion(progCondition);
			if(this.fireEvent('beforequery', this, progCondition) !== false){
				this.generalselPanel.query(progCondition, function(store, records, options){
					this.fireEvent('query', this, records, progCondition);
				}, this);
			}
		},
		
		/**
		 * 构建查询条件,传入参数为已有的查询条件，用户可
		 * 重写该方法以修改查询条件.
		 * @param {String} progCondition
		 */
		buildProgCondtion : function(progCondition){
			return progCondition;
		},
		
		/**
		 * 表格面板是否展开
		 * Returns true if this grid panel is expanded
		 * @return {boolean}
		 */
		isExpanded : function() {
			return this.view && this.view.isVisible();
		},

		/**
		 * 展开表格面板
		 */
		expand : function() {
			if(this.view == undefined){
				this.initLayer();
			}
			if(this.isExpanded()) {
				return;
			}
			if(this.fireEvent('beforeexpand', this) !== false){
				this.view.alignTo(this.wrap, "tl-bl?");
				this.view.show();
				Ext.getDoc().on('mousewheel', this.collapseIf, this);
				Ext.getDoc().on('mousedown', this.collapseIf, this);
				this.fireEvent('expand', this);
			}
		},
		
		//private
		beforeCollapse : Ext.emptyFn,
		
		/**
		 * 合拢表格面板
		 */
		collapse : function() {
			if(!this.isExpanded()) {
				return;
			}
			this.beforeCollapse();
			this.view.hide();
			Ext.getDoc().un('mousewheel', this.collapseIf, this);
			Ext.getDoc().un('mousedown', this.collapseIf, this);
			this.fireEvent('collapse', this);
			this.onCollapse();
		},

		//private
		onCollapse : Ext.emptyFn,
		
		//private
		collapseIf : function(e) {
			if(e && !e.within(this.wrap) && !e.within(this.view)) {
				this.collapse();
			}
		},
		
		//private
		tabKeyCollapse : function(field, e){
			if(e && e.getKey() == e.TAB){
				this.collapse();
			}
		},
		
		// private
	    // This should be overriden by any subclass that needs to check whether or not the field can be blurred.
		validateBlur : function() {
			return !this.view || !this.view.isVisible();
		},

		//private
		onTriggerClick : function() {
			if(!this.isExpanded() && !this.disabled) {
				this.expand();
				this.doQuery();
			}else {
				this.collapse();
			}
		},

		//private
		focusFirst : function() {
			var grid = this.generalselPanel.getGrid(),
				store = this.generalselPanel.getStore(),	
				sm = grid.getSelectionModel();
			if(store.getCount() > 0){
				sm.selectFirstRow();
			}
			this.focus();
		},

		//private
		focusLast : function() {
			var grid = this.generalselPanel.getGrid(),
				store = this.generalselPanel.getStore(),	
				sm = grid.getSelectionModel();
			if(store.getCount() > 0){
				sm.selectLastRow();
			}
			this.focus();
		},

		//private
		focusPrev : function() {
			var grid = this.generalselPanel.getGrid(),
				sm = grid.getSelectionModel();
			if(sm.hasSelection()) {
				sm.selectPrevious();
			} else {
				sm.selectFirstRow();
			}
			this.focus();
		},

		//private
		focusNext : function() {
			var grid = this.generalselPanel.getGrid(),
				sm = grid.getSelectionModel();
			if(sm.hasSelection()) {
				sm.selectNext();
			} else {
				sm.selectFirstRow();
			}
			this.focus();
		},

		//private
		onSelect : function() {
			if(this.readOnly){
				this.collapse();
				return;
			}
			var grid = this.generalselPanel.getGrid(),
				store = this.generalselPanel.getStore(),
				sm = grid.getSelectionModel();
				record = sm.getSelected();
			if(record && this.fireEvent('beforeselect', this, record, store)) {
				var display = record.get(this.getDisplayField()),
					value = record.get(this.getValueField());
				
				this.el.dom.value = display;
				if(String(this.lastValue) != String(value)){
					this.fireEvent('change', this, value, this.lastValue);
				}
				this.lastValue = value;
				this.selectedRecord = record;
				this.collapse();
				this.fireEvent('select', this, record, value, display);
			}
		},
		
		/**
		 * 清除值
		 */
		clearValue : function() {
			delete this.lastValue;
			this.setRawValue('');
			delete this.selectedRecord;
			this.applyEmptyText();
		},

		/**
		 * 获取值
		 * @return {String} value
		 */
		getValue : function() {
			var value = this.lastValue || '';
			if (Ext.isEmpty(value)){
				delete this.selectedRecord;
			}
			return value;
		},
		
		/**
		 * 获取值Record
		 * @return {Record} record
		 */
		getValueRecord : function(){
			return this.selectedRecord;
		},
		
		/**
		 * 获取显示值的字段名称
		 * @return {String} displayField
		 */
		getDisplayField : function(){
			return this.displayField;
		},
		
		 /**
         * 设置望远镜显示值
         * @param {String} valueField 显示值
         */
		setDisplayField : function(displayField){
		   this.displayField = displayField ;
		} ,
		
		/**
		 * 获取值的字段名称
		 * @return {String} valueField
		 */
		getValueField : function(){
			return this.valueField;
		},

        /**
         * 设置望远镜拿到后台的值
         * @param {String} valueField 真正的值
         */
		setValueField : function(valueField){
		      this.valueField = valueField ;
		} ,
		
		/**
		 * 设置值
		 * @param {String} value 值
		 */
		setValue : function(value) {
			delete this.selectedRecord;
			var valueField = this.getValueField(),
				displayField = this.getDisplayField(),
				progCondition;
			if(!Ext.isEmpty(valueField, false) && !Ext.isEmpty(value, false)){
				
				this.lastValue = value ;
                Rs.ext.form.GridLoaderField.superclass.setValue.call(this,value);
				
				progCondition = valueField + ' = \'' + value + '\'';
				progCondition = this.buildProgCondtion(progCondition);
				this.generalselPanel.query(progCondition, function(store, records){
					var record = store.query(valueField, new RegExp("^" + value + "$")).get(0);
					if(record){
						this.el.dom.value = record.get(displayField);
						var oldValue = this.lastValue;
						this.lastValue = record.get(valueField);
						this.selectedRecord = record;
						this.fireEvent('change', this, this.lastValue, oldValue);
						this.fireEvent("passed", this, record.get(valueField), record);
					}else {
						this.fireEvent("unpassed", this, value, valueField);
						this.applyEmptyText();
					}
				}, this);
			} else if(value!==undefined && value.length == 0){
                this.lastValue = value;
                Rs.ext.form.GridLoaderField.superclass.setValue.call(this,value);
            } else {
				this.fireEvent("unpassed", this, value, valueField);
				this.applyEmptyText();
			}
		},
		
		//private
		//重写父类方法, 显示trigger
		updateEditState: function(){
	        if(this.rendered){
	            if (this.readOnly) {
	                this.el.dom.readOnly = true;
	                this.el.addClass('x-trigger-noedit');
	                //this.mun(this.el, 'click', this.onTriggerClick, this);
	                //this.trigger.setDisplayed(false);
	            } else {
	                if (!this.editable) {
	                    this.el.dom.readOnly = true;
	                    this.el.addClass('x-trigger-noedit');
	                    this.mon(this.el, 'click', this.onTriggerClick, this);
	                } else {
	                    this.el.dom.readOnly = false;
	                    this.el.removeClass('x-trigger-noedit');
	                    this.mun(this.el, 'click', this.onTriggerClick, this);
	                }
	                this.trigger.setDisplayed(!this.hideTrigger);
	            }
	            this.onResize(this.width || this.wrap.getWidth());
	        }
	    },
	    
	    /**
	     * 设置该控件是否只读，如果为true表示
	     * @param {Boolean} readOnly 
	     */
	    setReadOnly: function(readOnly){
	    	Rs.ext.form.GridLoaderField.superclass.setReadOnly.apply(this, arguments);
	    	this.generalselPanel.setQueryPanelDisable(readOnly == true);
	    },
	    
		//private
		focus : function() {
			Rs.ext.form.GridLoaderField.superclass.focus.defer(25, this);
		}, 
		
		
	    /**
	     * 重写{@link Ext.form.Field#isValid}方法, 取真是的值进行验证,
	     * 而不是显示的值.
	     * Returns whether or not the field value is currently valid by
	     * {@link #validateValue validating} the {@link #processValue processed value}
	     * of the field. <b>Note</b>: {@link #disabled} fields are ignored.
	     * @param {Boolean} preventMark True to disable marking the field invalid
	     * @return {Boolean} True if the value is valid, else false
	     */
	    isValid : function(preventMark){
	        if(this.disabled){
	            return true;
	        }
	        var restore = this.preventMark;
	        this.preventMark = preventMark === true;
	        var v = this.validateValue(this.processValue(this.getValue()));
	        this.preventMark = restore;
	        return v;
	    },

	    /**
	     * Validates the field value 
	     * 重写{@link Ext.form.Field#validate}的validate方法，取真实的值进行验证,
	     * 而不是显示的值
	     * @return {Boolean} True if the value is valid, else false,
	     */
	    validate : function(){
	        if(this.disabled || this.validateValue(this.processValue(this.getValue()))){
	            this.clearInvalid();
	            return true;
	        }
	        return false;
	    },
		
		/**
		 * 获取错误信息
		 * @param {String} value
		 * @return {Array}
		 */
		getErrors: function(value) {
			var errors = Rs.ext.form.GridLoaderField.superclass.getErrors.apply(this, arguments);
			value = Ext.isDefined(value) ? value : this.processValue(this.getRawValue());
			var valueError = this.getValueError(value);
			valueError != undefined ? errors.push(valueError):null;
			return errors;
		},
		
		//private
		getValueError : function(value){
			if(this.selectedRecord != undefined){
				var valueField = this.getValueField(),	
	        		value1 = this.selectedRecord.get(valueField);
	        	if(value1 != value){
					return this.errorValueText;
				}
	        }
		},
		
		//private
		onDestroy : function(){
			if(this.quikTask){
				this.quikTask.cancel();
				this.quikTask = null;
			}
			var grid = this.generalselPanel.getGrid();
			if(grid){
				grid.un("rowclick", this.rowClick, this);
			}
			this.un('specialkey', this.tabKeyCollapse, this);
			Rs.ext.form.GridLoaderField.superclass.onDestroy.call(this);
		} ,
		
		/**
		 * 动态修改望远镜编码以及查询条件
		 */
		setProgCode : function(progCode , progCondition){
            this.progCode = progCode ;  
            this.progCondition = progCondition ;
            this.generalselPanel.setProgCode(this.progCode , this.progCondition) ;
        }
		
	});

	Ext.ComponentMgr.registerType("rs-ext-gridloaderfield", Rs.ext.form.GridLoaderField);

})();
Ext.ns("Rs.ext.form");

(function() {
    
    /**
     * @class Rs.ext.form.Telescope 
     * 望远镜,既可多选也可以单选.
     * @extends Rs.ext.form.GridLoaderField
     */
    Rs.ext.form.Telescope = function(config) {
        config = config ||{};
        Rs.ext.form.Telescope.superclass.constructor.call(this, config);
        if(this.singleSelect == false){
            this.setEditable(false);
        }
        this.cache = {};
    };
    
    Ext.extend(Rs.ext.form.Telescope, Rs.ext.form.GridLoaderField, {
        
        /**
         * @cfg {String} separator 
         * 显示多个值的时的值间隔标识.
         */
        separator : ",",
        
        /**
         * @cfg {Boolean} singleSelect true to allow selection of only one row 
         * at a time (defaults to false allowing multiple selections)
         */
        singleSelect : false,
        
        //Override
        initGeneralselPanel : function(config){
            if(this.singleSelect == false){
                config = Ext.apply(config, {
                    gridConfig : Ext.applyIf(config.gridConfig || {} , {
                        sm : new Ext.grid.CheckboxSelectionModel()
                    })
                });
            }
            var generalselPanel = Rs.ext.form.Telescope
                .superclass.initGeneralselPanel.call(this, config);
            var bbar = generalselPanel.getBottomToolbar();
            bbar.add("->");
            bbar.add("-");
            bbar.addButton({
                text:"清空",
                iconCls:"rs-action-clear",
                handler:this.clear,
                scope:this
            });
            //多选望远镜通过点击确定按钮提交数据
            if(this.singleSelect == false){
                bbar.addButton({
                    text:"确定",
                    iconCls:"rs-action-submit",
                    handler:this.submit,
                    scope:this
                });
            }
            bbar.addButton({
                text:"取消",
                iconCls:"rs-action-cancel",
                handler:this.cancel,
                scope:this
            });
            return generalselPanel;
        },
        
        //override
        initEvents : function() {
            Rs.ext.form.Telescope.superclass.initEvents.call(this);
            var grid = this.generalselPanel.getGrid(),
                store = grid ? grid.getStore() : undefined;
            if(store){
                store.on('load', this.checkSelected, this, {
                    delay : 20,
                    scope : this
                });
            }
        },
        
        //override
        initLayerEvents : function() { 
            Rs.ext.form.Telescope.superclass.initLayerEvents.call(this);
            var grid = this.generalselPanel.getGrid();
            if(grid){
                grid.on('headerclick', this.selectModelHeaderClick, this, {
                    delay : 100,
                    scope : this
                });
            }
        },
        
        //private
        //如果点击的是表头上的全选chackbox,则调用rowClick方法将选中的或未选中的数据
        //更新到cache中.
        selectModelHeaderClick : function(g, c){
            if(this.singleSelect == false){
                var cm = g.getColumnModel();
                if(cm && cm.getColumnAt(c) instanceof Ext.grid.AbstractSelectionModel){
                    this.rowClick(g);
                }
            }
        },
        
        /**
         * 查询数据, 如果该控件为只读readOnly = true, 且当前有值，
         * 则查询出该值的详细信息。如果当前控件并非只读readOnly = false, 则进行模糊查询。
         */
        doQuery : function() {
            if(this.singleSelect == true){
                return Rs.ext.form.Telescope.superclass.doQuery.call(this);
            }else {
                var df = this.getDisplayField(),
                    vf = this.getValueField(),
                    separator = this.separator,
                    ds = [], d, vs = [], v, 
                    progcs = [], value, progCondition;
                if(this.readOnly == true){
                    value = this.getValue();
                    if(!Ext.isEmpty(vf, false) && !Ext.isEmpty(value, false)){
                        vs = value.split(separator);
                        for(var i = 0, l = vs.length; i < l; i++){
                            v = vs[i];
                            progcs.push('(' + vf + ' = \''+ v + '\')');
                        }
                        if(progcs.length > 0){
                            progCondition = '(' + progcs.join(' OR ') + ')';
                        }else {
                            progCondition = '1 <> 1';
                        }
                    }else {
                        progCondition = '1 <> 1';
                    }
                }else {
                    value = this.getRawValue();
                    if(!Ext.isEmpty(df, false) && !Ext.isEmpty(value, false)){
                        ds = value.split(separator);
                        for(var i = 0, l = ds.length; i < l; i++){
                            d = ds[i];
                            progcs.push('(' + df + ' like \''+ d + '%\')');
                        }
                        if(progcs.length > 0){
                            progCondition = '(' + progcs.join(' OR ') + ')';
                        }
                    }
                }
                progCondition = this.buildProgCondtion(progCondition);
                if(this.fireEvent('beforequery', this, progCondition) !== false){
                    this.generalselPanel.query(progCondition, function(store, records, options){
                        this.fireEvent('query', this, records, progCondition);
                    }, this);
                }
            }
        },
        
        //override
        setValue : function(value) {
            if(this.singleSelect == true){
                return Rs.ext.form.Telescope.superclass.setValue.apply(this, arguments);
            }else {
                delete this.selectedRecord;
                var vf = this.getValueField(), df = this.getDisplayField(),
                    separator = this.separator, display, value2, 
                    ds = [], d, vs, vs2 = [], rs2 = [], 
                    v, r, progcs = [], progCondition;
                if(!Ext.isEmpty(vf, false) && !Ext.isEmpty(value, false)){
                    //为了完成望远镜重置问题
                    this.lastValue = value ;
                    Rs.ext.form.GridLoaderField.superclass.setValue.call(this,value);
                    
                    vs = value.split(separator);
                    for(var i = 0, l = vs.length; i < l; i++){
                        v = vs[i];
                        progcs.push('(' + vf + ' = \''+ v + '\')');
                    }
                    if(progcs.length > 0){
                        progCondition = '(' + progcs.join(' OR ') + ')';
                    }
                    progCondition = this.buildProgCondtion(progCondition);
                    this.generalselPanel.query(progCondition, function(store, records){
                        var rs = store.query(vf, new RegExp("^" + vs.join('|') + "$"));
                        if(rs && rs.length > 0){
                            for(var i = 0, l = rs.length; i < l; i++){
                                r = rs.get(i); v = r.get(vf); d = r.get(df);
                                vs2.push(v); ds.push(d);
                                rs2.push(r);
                            }
                            display = ds.join(separator);
                            value2 = vs2.join(separator);
                            this.el.dom.value = display;
                            var oldValue = this.lastValue;
                            this.lastValue = value2;
                            this.selectedRecord = rs;
                            this.fireEvent('change', this, this.lastValue, oldValue);
                            this.fireEvent("passed", this, value2, rs, vf);
                            
                            this.rowSelect(rs2);
                        }else if(value!==undefined && value.length == 0){
                            this.lastValue = value;
                            Rs.ext.form.GridLoaderField.superclass.setValue.call(this,value);
                        } else {
                            this.fireEvent("unpassed", this, value, vf);
                            this.applyEmptyText();
                        }//lulu 0627
                    }, this);
                }else {
                    this.fireEvent("unpassed", this, value, vf);
                    this.applyEmptyText();
                }
            }
        },
        
        /**
         * 清除所选
         */
        clear : function(){
            var g = this.generalselPanel.getGrid(),
                sm = g ? g.getSelectionModel() : undefined;
            if(sm){
                sm.clearSelections();
            }
            this.cache = {};
            this.clearValue();
            this.collapse();
            this.focus();
        },
        
        /**
         * 确定所选数据
         */
        submit : function(){
            var cache = this.cache,
                vs = [], ds = [], rs = [], r,
                df = this.getDisplayField(),
                vf = this.getValueField(),
                separator = this.separator;
            for(var k in cache){
                r = cache[k];
                if(r){
                    vs.push(r.get(vf));
                    ds.push(r.get(df));
                    rs.push(r);
                }
            }
            if(this.fireEvent('beforeselect', this, rs)) {
                var display = ds.join(separator),
                    value = vs.join(separator);
                this.el.dom.value = display;
                if(String(this.lastValue) != String(value)){
                    this.fireEvent('change', this, value, this.lastValue);
                }
                this.lastValue = value;
                this.selectedRecord = rs;
                this.collapse();
                this.fireEvent('select', this, rs, value, display);
            }
        },
        
        /**
         * 取消操作
         */
        cancel : function(){
            this.collapse();
            this.focus();
        },
        
        //private
        checkSelected : function(s, rs){
            var cache = this.cache, r, v, k, selrs = [],
                g = this.generalselPanel.getGrid();
            if(g && g.rendered){
                if((sm = g.getSelectionModel())
                    && sm instanceof Ext.grid.CheckboxSelectionModel){
                    rs = rs || [];
                    for(var i = 0, l = rs.length; i < l; i++){
                        r = rs[i]; v = r && r.data ? r.data : undefined;
                        if(v){
                            k = Rs.hashCode(v);
                            if(cache[k] != undefined){
                                selrs.push(r);
                            }
                        }
                    }
                    if(selrs.length > 0){
                        sm.selectRecords(selrs, true);
                    }
                }
            }
        },
        
        //Override 将选中的放入cache
        rowSelect : function(records) {
            if(this.singleSelect == true){ //单选
                return Rs.ext.form.Telescope.superclass.rowSelect.apply(this, arguments);
            }else { //多选
                var cache = this.cache, rs = records || [], r, v, k;
                for(var i = 0, l = rs.length; i < l; i++){
                    r = rs[i];
                    v = r && r.data ? r.data : undefined;
                    if(v){
                        k = Rs.hashCode(v);
                        cache[k] = r;
                    }
                }
            }
        },
        
        //Override  将未选中的从cache删除 
        rowDeSelect : function(records){
            if(this.singleSelect == true){ //单选
                return Rs.ext.form.Telescope.superclass.rowDeSelect.apply(this, arguments);
            }else { //多选
                var rs = records || [], r, v, k;
                for(var i = 0, l = rs.length; i < l; i++){
                    r = rs[i];
                    v = r && r.data ? r.data : undefined;
                    if(v){
                        k = Rs.hashCode(v);
                        delete this.cache[k];
                    }
                }
            }
        }, 
        
        //override
        getValueError : function(){},
        
        //private
        onDestroy : function(){
            Rs.ext.form.Telescope.superclass.onDestroy.apply(this, arguments);
            var store = this.generalselPanel.getStore();
            if(store){
                store.un('load', this.checkSelected, this);
            }
            var grid = this.generalselPanel.getGrid();
            if(grid){
                grid.un('headerclick', this.selectModelHeaderClick, this);
            }
        }
        
    });
    
    Ext.ComponentMgr.registerType("rs-ext-telescope", Rs.ext.form.Telescope);
})();

Ext.ns('Rs.ext.form');

/**
 * @class Rs.ext.form.SingleUploadField
 * @extends Ext.form.TextField
 * Creates a file upload field.
 * @xtype rs-ext-singleuploadfield
 */
(function(){
	Rs.ext.form.SingleUploadField = Ext.extend(Ext.form.TextField,  {
	    /**
	     * @cfg {String} buttonText The button text to display on the upload button (defaults to
	     * 'Browse...').  Note that if you supply a value for {@link #buttonCfg}, the buttonCfg.text
	     * value will be used instead if available.
	     */
	    buttonText: '上传文件',
	    /**
	     * @cfg {Boolean} buttonOnly True to display the file upload field as a button with no visible
	     * text field (defaults to false).  If true, all inherited TextField members will still be available.
	     */
	    buttonOnly: false,
	    /**
	     * @cfg {Number} buttonOffset The number of pixels of space reserved between the button and the text field
	     * (defaults to 3).  Note that this only applies if {@link #buttonOnly} = false.
	     */
	    buttonOffset: 3,
	
	    // private
	    readOnly: true,
	
	    /**
	     * @hide
	     * @method autoSize
	     */
	    autoSize: Ext.emptyFn,
	
	    // private
	    initComponent: function(){
			Rs.ext.form.SingleUploadField.superclass.initComponent.call(this);
	
	        this.addEvents(
	            /**
	             * @event fileselected
	             * Fires when the underlying file input field's value has changed from the user
	             * selecting a new file from the system file selection dialog.
	             * @param {Rs.ext.form.SingleUploadField} this
	             * @param {String} value The file value returned by the underlying file input field
	             */
	            'fileselected' ,
				
				/**
				 * @param {Rs.ext.form.SingleUploadField} this
				 */
				'beforeclick' 
	        );
	    },
	
	    // private
	    onRender : function(ct, position){
	    	Rs.ext.form.SingleUploadField.superclass.onRender.call(this, ct, position);
	
	        this.wrap = this.el.wrap({cls:'x-form-field-wrap x-form-file-wrap'});
	        this.el.addClass('x-form-file-text');
	        this.el.dom.removeAttribute('name');
	        this.createFileInput();
	
	        var btnCfg = Ext.applyIf(this.buttonCfg || {}, {
	            text: this.buttonText
	        });
	        this.button = new Ext.Button(Ext.apply(btnCfg, {
	            renderTo: this.wrap,
	            cls: 'x-form-file-btn' + (btnCfg.iconCls ? ' x-btn-icon' : '')
	        }));
	
	        if(this.buttonOnly){
	            this.el.hide();
	            this.wrap.setWidth(this.button.getEl().getWidth());
	        }
	
	        this.bindListeners();
	        this.resizeEl = this.positionEl = this.wrap;
	    },
	    
	    bindListeners: function(){
	        this.fileInput.on({
	            scope: this,
	            mouseenter: function() {
	                this.button.addClass(['x-btn-over','x-btn-focus']);
	            },
	            mouseleave: function(){
	                this.button.removeClass(['x-btn-over','x-btn-focus','x-btn-click']);
	            },
	            mousedown: function(){
	                this.button.addClass('x-btn-click');
	            },
	            mouseup: function(){
	                this.button.removeClass(['x-btn-over','x-btn-focus','x-btn-click']);
	            },
	            change: function(){
	                var v = this.fileInput.dom.value;
					if(v){
    	                this.setValue(v);
	                    this.fireEvent('fileselected', this, v);    
					}
	            }
	        });
			
			this.wrap.on('click' , function(){
                this.fireEvent('beforeclick' , this);
            } , this);
	    },
	    
	    createFileInput : function() {
	        this.fileInput = this.wrap.createChild({
	            id: this.getFileInputId(),
	            name: this.name||this.getId(),
	            cls: 'x-form-file',
	            tag: 'input',
	            type: 'file',
	            size: 1
	        });
	    },
	    
	    reset : function(){
	        this.fileInput.remove();
	        this.createFileInput();
	        this.bindListeners();
	        Rs.ext.form.SingleUploadField.superclass.reset.call(this);
	    },
	
	    // private
	    getFileInputId: function(){
	        return this.id + '-file';
	    },
	
	    // private
	    onResize : function(w, h){
	    	Rs.ext.form.SingleUploadField.superclass.onResize.call(this, w, h);
	
	        this.wrap.setWidth(w);
	
	        if(!this.buttonOnly){
	            var w = this.wrap.getWidth() - this.button.getEl().getWidth() - this.buttonOffset;
	            this.el.setWidth(w);
	        }
	    },
	
	    // private
	    onDestroy: function(){
	    	Rs.ext.form.SingleUploadField.superclass.onDestroy.call(this);
	        Ext.destroy(this.fileInput, this.button, this.wrap);
	    },
	    
	    onDisable: function(){
	    	Rs.ext.form.SingleUploadField.superclass.onDisable.call(this);
	        this.doDisable(true);
	    },
	    
	    onEnable: function(){
	    	Rs.ext.form.SingleUploadField.superclass.onEnable.call(this);
	        this.doDisable(false);
	    },
	    
	    // private
	    doDisable: function(disabled){
	        this.fileInput.dom.disabled = disabled;
	        this.button.setDisabled(disabled);
	    },
	
	
	    // private
	    preFocus : Ext.emptyFn,
	
	    // private
	    alignErrorIcon : function(){
	        this.errorIcon.alignTo(this.wrap, 'tl-tr', [2, 0]);
	    } ,
	    
		getUploadPanel : function(){
            return this.uppanel ;			
		}
	});
	Ext.reg('rs-ext-singleuploadfield', Rs.ext.form.SingleUploadField);
})();

Ext.ns("Rs.ext.form");

(function(){
	
	/**
	 * 树下拉框
	 * 
	 * @class Rs.ext.form.TreeComboBox
	 * @extends Ext.form.TriggerField
	 */
	Rs.ext.form.TreeComboBox = Ext.extend(Ext.form.TriggerField, {

			width : 120,
		
			initComponent : function() {
				this.addEvents( [ 'select' ]);
				Rs.ext.form.TreeComboBox.superclass.initComponent.call(this);
				this.emptyText = '选择' + (this.name || '');
			},

			onRender : function(ct, pos) {
				Rs.ext.form.TreeComboBox.superclass.onRender.call(this, ct, pos);
				this.el.dom.readOnly = true;
				this.el.setStyle( { 
					'cursor' : 'pointer'
				});
				this.el.on('click', this.onTriggerClick, this);
			},
			
			onTriggerClick : function() {
				if(this.disabled)
					return;
				if(!this.view)
					this.initLayer();
				if(this.expanded) {
					this.collapse();
				} else {
					this.tree.collapseAll();
					this.expand();
				}
			},

			initLayer : function() {
				this.view = new Ext.Layer( {
					constrain : false,
					shadow : "sides",
					cls : " x-combo-list "
				});
				this.view.swallowEvent("mousewheel");
				this.view.swallowEvent("mousedown");
				this.resizer = new Ext.Resizable(this.view, {
					pinned : true,
					handles : 'se'
				});
				this.tree.render(this.view);
				this.resizer.on('resize', function(r, w, h) {
					this.tree.setWidth(w - 2);
					this.tree.setHeight(h - 2);
				}, this);
				this.on("blur", this.collapse, this);
				this.tree.getSelectionModel().on('selectionchange', this.onSelect, this);
			},

			expand : function() {
				this.view.alignTo(this.wrap, "tl-bl?");
				this.view.show();
				this.expanded = true;
				Ext.getDoc().on('mousewheel', this.collapseIf, this);
				Ext.getDoc().on('mousedown', this.collapseIf, this);
			},

			collapse : function() {
				this.view.hide();
				this.expanded = false;
				Ext.getDoc().un('mousewheel', this.collapseIf, this);
				Ext.getDoc().un('mousedown', this.collapseIf, this);
			},

			collapseIf : function(e) {
				if(!e.within(this.wrap) && !e.within(this.view)) {
					this.collapse();
				}
			},

			onSelect : function(sm, node) {
				var member = node.attributes;
				this.member = member;
				this.collapse();
				this.fireEvent('submit', this, member);
			},

			getValue : function() {
				return this.member;
			},

			setValue : function(member) {
				this.member = member;
				this.fireEvent('submit', this, member);
			},
			
			onDestroy : function() {
				Rs.ext.form.TreeComboBox.superclass.onDestroy.call(this);
				if(this.tree)
					this.tree.destroy();
				if(this.view)
					this.view.remove();
			}

		});

		Ext.ComponentMgr.registerType("rs-ext-treecombobox", Rs.ext.form.TreeComboBox);
	
})();