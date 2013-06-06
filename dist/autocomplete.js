define("arale/autocomplete/1.2.1/autocomplete",["$","arale/overlay/1.1.0/overlay","arale/position/1.0.1/position","arale/iframe-shim/1.0.2/iframe-shim","arale/widget/1.1.0/widget","arale/base/1.1.0/base","arale/class/1.1.0/class","arale/events/1.1.0/events","arale/templatable/0.9.0/templatable","gallery/handlebars/1.0.2/handlebars","./data-source","./filter","./autocomplete.handlebars"],function(t,e,i){function s(t){return"[object String]"===Object.prototype.toString.call(t)}function a(t,e){if(!t)return e;if(n.isFunction(t))return t.call(this,e);if(s(t)){for(var i=t.split("."),a=e;i.length;){var r=i.shift();if(!a[r])break;a=a[r]}return a}return e}function r(t,e){var i=this.highlightIndex,s=0,a=e||this.matchKey||"",r="";if(n.isArray(i)){for(var l=0,h=i.length;h>l;l++){var u,o,c=i[l];if(n.isArray(c)?(u=c[0],o=c[1]-c[0]):(u=c,o=1),u>s&&(r+=a.substring(s,u)),a.length>u&&(r+='<span class="'+t+'-item-hl">'+a.substr(u,o)+"</span>"),s=u+o,s>=a.length)break}return a.length>s&&(r+=a.substring(s,a.length)),r}return a}var n=t("$"),l=t("arale/overlay/1.1.0/overlay"),h=t("arale/templatable/0.9.0/templatable"),u=t("./data-source"),o=t("./filter"),c=t("./autocomplete.handlebars"),d={UP:38,DOWN:40,LEFT:37,RIGHT:39,ENTER:13,ESC:27,BACKSPACE:8},f=l.extend({Implements:h,attrs:{trigger:{value:null,getter:function(t){return n(t)}},classPrefix:"ui-autocomplete",align:{baseXY:[0,"100%"]},template:c,submitOnEnter:!0,dataSource:[],locator:"data",filter:void 0,inputFilter:function(t){return t},disabled:!1,selectFirst:!1,delay:100,selectedIndex:void 0,inputValue:null,data:null},events:{"mousedown [data-role=item]":function(t){var e=this.items.index(t.currentTarget);this.set("selectedIndex",e),this.selectItem(),this._firstMousedown=!0},mousedown:function(){this._secondMousedown=!0},"mouseenter [data-role=item]":function(t){var e=this.get("classPrefix")+"-item-hover";this.currentItem&&this.currentItem.removeClass(e),n(t.currentTarget).addClass(e)},"mouseleave [data-role=item]":function(t){var e=this.get("classPrefix")+"-item-hover";n(t.currentTarget).removeClass(e)}},templateHelpers:{highlightItem:r},parseElement:function(){this.set("model",{classPrefix:this.get("classPrefix"),items:[]}),f.superclass.parseElement.call(this)},setup:function(){var t=this.get("trigger"),e=this;f.superclass.setup.call(this),this.dataSource=new u({source:this.get("dataSource")}).on("data",this._filterData,this),this._initFilter(),this._blurHide([t]),this._tweakAlignDefaultValue(),t.attr("autocomplete","off"),this.delegateEvents(t,"blur.autocomplete",n.proxy(this._blurEvent,this)),this.delegateEvents(t,"keydown.autocomplete",n.proxy(this._keydownEvent,this)),this.delegateEvents(t,"keyup.autocomplete",function(){clearTimeout(e._timeout),e._timeout=setTimeout(function(){e._timeout=null,e._keyupEvent.call(e)},e.get("delay"))})},destroy:function(){this._clear(),this.element.remove(),f.superclass.destroy.call(this)},hide:function(){this._timeout&&clearTimeout(this._timeout),this.dataSource.abort(),f.superclass.hide.call(this)},selectItem:function(){this.hide();var t=this.currentItem,e=this.get("selectedIndex"),i=this.get("data")[e];if(t){var s=t.attr("data-value");this.get("trigger").val(s),this.set("inputValue",s),this.trigger("itemSelect",i),this._clear()}},setInputValue:function(t){if(this.get("inputValue")!==t){this._start=!0,this.set("inputValue",t);var e=this.get("trigger");e.val()!==t&&e.val(t)}},_onRenderInputValue:function(t){if(this._start&&t){var e=this.queryValue;this.queryValue=this.get("inputFilter").call(this,t),this.queryValue&&this.queryValue!==e&&(this.dataSource.abort(),this.dataSource.getData(this.queryValue))}else this.queryValue="";""!==t&&this.queryValue||(this.set("data",[]),this.hide()),delete this._start},_filterData:function(t){var e=this.get("filter"),i=this.get("locator");t=a(i,t),t=e.func.call(this,t,this.queryValue,e.options),this.set("data",t)},_onRenderData:function(t){this._clear(),this.set("model",{items:t}),this.renderPartial("[data-role=items]"),this.items=this.$("[data-role=items]").children(),this.currentItem=null,this.get("selectFirst")&&this.set("selectedIndex",0),n.trim(this.$("[data-role=items]").text())?this.show():this.hide()},_onRenderSelectedIndex:function(t){if(-1!==t){var e=this.get("classPrefix")+"-item-hover";this.currentItem&&this.currentItem.removeClass(e),this.currentItem=this.items.eq(t).addClass(e),this.trigger("indexChange",t,this.lastIndex),this.lastIndex=t}},_initFilter:function(){var t=this.get("filter");t=void 0===t?"url"===this.dataSource.get("type")?null:{name:"startsWith",func:o.startsWith,options:{key:"value"}}:n.isPlainObject(t)?o[t.name]?{name:t.name,func:o[t.name],options:t.options}:null:n.isFunction(t)?{func:t}:o[t]?{name:t,func:o[t]}:null,t||(t={name:"default",func:o["default"]}),this.set("filter",t)},_blurEvent:function(){n.browser.msie||(this._secondMousedown?this._firstMousedown&&(this.get("trigger").focus(),this.hide()):this.hide(),delete this._firstMousedown,delete this._secondMousedown)},_keyupEvent:function(){if(!this.get("disabled")&&this._keyupStart){delete this._keyupStart;var t=this.get("trigger").val();this.setInputValue(t)}},_keydownEvent:function(t){if(!this.get("disabled"))switch(delete this._keyupStart,t.which){case d.ESC:this.hide();break;case d.UP:this._keyUp(t);break;case d.DOWN:this._keyDown(t);break;case d.LEFT:case d.RIGHT:break;case d.ENTER:this._keyEnter(t);break;default:this._keyupStart=!0}},_keyUp:function(t){if(t.preventDefault(),this.get("data").length){if(!this.get("visible"))return this.show(),void 0;this._step(-1)}},_keyDown:function(t){if(t.preventDefault(),this.get("data").length){if(!this.get("visible"))return this.show(),void 0;this._step(1)}},_keyEnter:function(t){this.get("visible")&&(this.selectItem(),this.get("submitOnEnter")||t.preventDefault())},_step:function(t){var e=this.get("selectedIndex");-1===t?e>0?this.set("selectedIndex",e-1):this.set("selectedIndex",this.items.length-1):1===t&&(this.items.length-1>e?this.set("selectedIndex",e+1):this.set("selectedIndex",0))},_clear:function(){this.$("[data-role=items]").empty(),this.set("selectedIndex",-1),delete this.items,delete this.lastIndex,delete this.currentItem},_tweakAlignDefaultValue:function(){var t=this.get("align");t.baseElement=this.get("trigger"),this.set("align",t)}});f._filter=o,i.exports=f}),define("arale/autocomplete/1.2.1/data-source",["arale/base/1.1.0/base","arale/class/1.1.0/class","arale/events/1.1.0/events","$"],function(t,e,i){function s(t){return"[object String]"===Object.prototype.toString.call(t)}function a(t){return t.replace(/^([a-z])/,function(t,e){return e.toUpperCase()})}var r=t("arale/base/1.1.0/base"),n=t("$"),l=r.extend({attrs:{source:null,type:"array"},initialize:function(t){l.superclass.initialize.call(this,t),this.id=0,this.callbacks=[];var e=this.get("source");if(s(e))this.set("type","url");else if(n.isArray(e))this.set("type","array");else if(n.isPlainObject(e))this.set("type","object");else{if(!n.isFunction(e))throw Error("Source Type Error");this.set("type","function")}},getData:function(t){return this["_get"+a(this.get("type")||"")+"Data"](t)},abort:function(){this.callbacks=[]},_done:function(t){this.trigger("data",t)},_getUrlData:function(t){var e,i=this,s={query:t?encodeURIComponent(t):"",timestamp:(new Date).getTime()},a=this.get("source").replace(/{{(.*?)}}/g,function(t,e){return s[e]}),r="callback_"+this.id++;this.callbacks.push(r),e=/^(https?:\/\/)/.test(a)?{dataType:"jsonp"}:{dataType:"json"},n.ajax(a,e).success(function(t){n.inArray(r,i.callbacks)>-1&&(delete i.callbacks[r],i._done(t))}).error(function(){n.inArray(r,i.callbacks)>-1&&(delete i.callbacks[r],i._done({}))})},_getArrayData:function(){var t=this.get("source");return this._done(t),t},_getObjectData:function(){var t=this.get("source");return this._done(t),t},_getFunctionData:function(t){function e(t){i._done(t)}var i=this,s=this.get("source"),a=s.call(this,t,e);a&&this._done(a)}});i.exports=l}),define("arale/autocomplete/1.2.1/filter",["$"],function(t,e,i){function s(t,e){if(n.isPlainObject(t)){var i=e&&e.key||"value";return t[i]||""}return t}function a(t,e){for(var i=[],s=t.split(""),a=0,r=e.split(""),n=0,l=s.length;l>n;n++){var h=s[n];if(h==r[a]){if(a===r.length-1){i.push([n-r.length+1,n+1]),a=0;continue}a++}else a=0}return i}function r(t){return(t||"").replace(h,"\\$1")}var n=t("$"),l={"default":function(t,e,i){var a=[];return n.each(t,function(t,e){var r={},l=s(e,i);n.isPlainObject(e)&&(r=n.extend({},e)),r.matchKey=l,a.push(r)}),a},startsWith:function(t,e,i){var a=[],l=e.length,h=RegExp("^"+r(e));return l?(n.each(t,function(t,e){var r={},u=s(e,i);n.isPlainObject(e)&&(r=n.extend({},e)),h.test(u)&&(r.matchKey=u,l>0&&(r.highlightIndex=[[0,l]]),a.push(r))}),a):[]},stringMatch:function(t,e,i){e=e||"";var r=[],l=e.length;return l?(n.each(t,function(t,l){var h={},u=s(l,i);n.isPlainObject(l)&&(h=n.extend({},l)),u.indexOf(e)>-1&&(h.matchKey=u,h.highlightIndex=a(u,e),r.push(h))}),r):[]}};i.exports=l;var h=/(\[|\[|\]|\^|\$|\||\(|\)|\{|\}|\+|\*|\?)/g}),define("arale/autocomplete/1.2.1/autocomplete.handlebars",["gallery/handlebars/1.0.2/runtime"],function(t,e,i){var s=t("gallery/handlebars/1.0.2/runtime"),a=s.template;i.exports=a(function(t,e,i,s,a){function r(t,e,s){var a,r,n,l="";return l+='\n            <li data-role="item" class="'+o((a=s.classPrefix,typeof a===u?a.apply(t):a))+'-item" data-value="',(r=i.matchKey)?r=r.call(t,{hash:{},data:e}):(r=t.matchKey,r=typeof r===u?r.apply(t):r),l+=o(r)+'">',n={hash:{},data:e},a=i.highlightItem,r=a?a.call(t,s.classPrefix,t.matchKey,n):c.call(t,"highlightItem",s.classPrefix,t.matchKey,n),(r||0===r)&&(l+=r),l+="</li>\n        "}this.compilerInfo=[3,">= 1.0.0-rc.4"],i=i||{};for(var n in t.helpers)i[n]=i[n]||t.helpers[n];a=a||{};var l,h="",u="function",o=this.escapeExpression,c=i.helperMissing,d=this;return h+='<div class="',(l=i.classPrefix)?l=l.call(e,{hash:{},data:a}):(l=e.classPrefix,l=typeof l===u?l.apply(e):l),h+=o(l)+'">\n    <ul class="',(l=i.classPrefix)?l=l.call(e,{hash:{},data:a}):(l=e.classPrefix,l=typeof l===u?l.apply(e):l),h+=o(l)+'-ctn" data-role="items">\n        ',l=i.each.call(e,e.items,{hash:{},inverse:d.noop,fn:d.programWithDepth(1,r,a,e),data:a}),(l||0===l)&&(h+=l),h+="\n    </ul>\n</div>\n"})});
