Rs.define('com.riambsoft.home.SystemHierarchyPanel', {

	extend : Ext.tree.TreePanel,

	mixins : [ Rs.app.Main ],

	constructor : function(config) {
		
		Rs.Service.call({
	    		url : '../hierarchy',
	    		accept : 'json'
	    	}, function(success, result, ec, em, data) {
	    		this.nodeData = data.hierarchy;        
	    	}, this);

		//查询条件
        this.queryFiled = new Ext.form.TextField({
            width : 90,
            enableKeyEvents : true,
            listeners : {
                keydown : {
                    scope : this,
                    buffer: 350,
                    fn : function(f, e) {
                        if (e && e.keyCode == 13) {
                            this.doSearch();
                        }
                    }
                }
            }
        });

        //工具条
        this.toolBar = [this.queryFiled,{
                iconCls : 'rs-action-query',
                handler : this.doSearch,
                scope : this
            }, '-', {
	            iconCls: 'icon-expand-all',
	            tooltip: '全部展开',
	            handler: function() {
	                var selectedNode = this.getSelectionModel().getSelectedNode(); // 得到选中的节点
	                if (selectedNode) {
	                    selectedNode.expand(true);
	                    selectedNode.unselect();
	                } else {
	                    this.getRootNode().expand(true);
	                }
	            },
	            scope: this
	        }, '-', {
	            iconCls: 'icon-collapse-all',
	            tooltip: '全部收缩',
	            handler: function() {
	                var selectedNode = this.getSelectionModel().getSelectedNode(); // 得到选中的节点
	                if (selectedNode) {
	                    selectedNode.collapse(true);
	                    selectedNode.unselect();
	                } else {
	                    this.getRootNode().collapse(true);
	                }
	            },
	            scope: this
        }];
        
        this.treeloader = new Ext.tree.TreeLoader({
        	preloadChildren: true
        });
        
        var root = new Ext.tree.AsyncTreeNode({
        	id : 'root',
			path : 'root' ,
			name : 'root',
			text : '全部',
            leaf : false,
			checked : false,
            expanded : false,
            children : this.nodeData
        });
        
        config = Rs.apply(config || {}, {
            border : true,
            autoLoad : false,
            autoScroll : true,
            animate : false,
            containerScroll : true, 
            enableDD : false,
            lines : true,
            rootVisible: true,      
            bodyStyle: 'background-color:#FFFFFF',
            tbar : this.toolBar,
            //树的根节点
            root: root,
            loader: this.treeloader,
            listeners: {
                'checkchange': this.onCheckChange,
                'expandnode': this.onNodeExpand
            }
        });
        
        com.riambsoft.home.SystemHierarchyPanel.superclass.constructor.call(this, config);

    	this.selections = [];
	},
    
    onCheckChange : function(node, checked){
    	if(!checked && this.root.getUI().isChecked){
    		this.root.getUI().checkbox.checked = false;
    		this.root.checked = false;
    	}
    	node.checked = checked;
        node.eachChild(function(cnode){
        	if(cnode.getUI().checkbox){
        		cnode.getUI().checkbox.checked = checked;
        	}
        	this.onCheckChange(cnode, checked);
        }, this);
    },
    
    onNodeExpand : function(node){
    	node.eachChild(function(cnode){
    		if(cnode.checked != null){
    			cnode.getUI().checkbox.checked = cnode.checked;
    		} else{
    			cnode.getUI().checkbox.checked = cnode.parentNode.getUI().checkbox.checked;
    			cnode.checked = cnode.getUI().checkbox.checked;
    		}
        }, this);
    },
    
    doSearch : function() {
        Rs.Service.call({
            params : {
                keyWord : this.keyWorkEl.getValue()
            }
        }, this.loadOrgTreeNode, this);
    },
    
    loadOrgTreeNode : function(list){
        var root = this.getRootNode(), node = root.firstChild;
        this.pathList = list;
        this.handlerType = 'SEARCH';
        this.lastPrentNode;
        this.tempList = [] ;
        for(var i=0;i<list.length;i++){
            this.tempList.push(list[i].path);
        }
        while (node) {
            root.removeChild(node, true);
            node = root.firstChild;
        }
        
        if (list && list.length > 0) {
            this.on('beforeappend', this.checkPath, this);
            root.expanded = false ;
            root.loaded = false;
            for(var i = 0, len = list.length; i < len; i++){
                var p = list[i].path;
                p = p.substr(0, p.lastIndexOf('/'));
                this.expandPath(p , 'path');
            }
        }else {
            this.un('beforeappend', this.checkPath, this);
            root.loaded = false;
            root.expand(false);
        }
        this.getRootNode().expand(true);
    },

    //验证节点路径
    checkPath : function(t, p, n) {
        var list = this.pathList, path = n['attributes']['path'];
        if(this.handlerType == 'CLICK' && this.lastPrentNode != p){
            return true ;
        }
        //匹配节点路径，生成有效的节点
        for ( var i = 0, len = list.length; i < len; i++) {
            var nodePath = list[i].path;
        	if (nodePath.indexOf(path) == 0){
                if(nodePath == path){
                    this.tempList.remove(path);
                    if(this.tempList.length == 0){
                        this.lastPrentNode = p ;
                        this.handlerType = 'CLICK' ;
                    }
                }
                return true;
            }
        }
        return false;
    },
    
    lockBulletinNode : function(path, fromNode){
        fromNode.eachChild(function(n){
            this.path = path;
            n.expanded = false;
            n.loaded = false;
            if(path.indexOf(n.attributes['path'])>-1){
                if(path==n.attributes['path']){
                    n.select();
                    return;
                }else{
                    n.expand(false, false, function(node){
                        node.ownerTree.lockBulletinNode(node.ownerTree.path, node);
                    });
                }
            }
        }, this);
    },
    
    getSelections : function(node){
    	if(this.root.getUI().isChecked()){
    		return ['all'];
    	}
    	var flag = false;
    	if(node==null){
    		node=this.root;
    	}
    	if(node.hasChildNodes()){
    		node.eachChild(function(node){
    			this.getSelections(node);
    		}, this);
    	}
    	if(node.checked){
	    	for(var i=0; i<this.selections.length; i++){
	    		if(this.selections[i].indexOf(node.attributes.path)>-1){
	    			flag = true;
	    		}
	    	}
	    	if(!flag){
	    		this.selections.push(node.attributes.path);
	    	}
	    	if(!node.clicked && node.attributes.services){
	    		for(var i=0; i<node.attributes.services.length; i++){
	    			this.selections.push(node.attributes.path + "/" + node.attributes.services[i].id);
	    		}
	    	}
    	}
    	return this.selections;
    },
    
    deselectRoot : function(){
    	if(this.root.getUI().isChecked()){
    		this.root.getUI().checkbox.checked = false;
    	}
    },
    
    showSelectedNodes : function(){
    	this.cascadeSelectedNodes(this.root, false);
    }
});