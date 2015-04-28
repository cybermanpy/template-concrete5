!function(a){"use strict";"function"==typeof define&&define.amd?define(["jquery","jquery.ui.widget"],a):a(window.jQuery)}(function(a){"use strict";a.support.fileInput=!(new RegExp("(Android (1\\.[0156]|2\\.[01]))|(Windows Phone (OS 7|8\\.0))|(XBLWP)|(ZuneWP)|(WPDesktop)|(w(eb)?OSBrowser)|(webOS)|(Kindle/(1\\.0|2\\.[05]|3\\.0))").test(window.navigator.userAgent)||a('<input type="file">').prop("disabled")),a.support.xhrFileUpload=!(!window.ProgressEvent||!window.FileReader),a.support.xhrFormDataFileUpload=!!window.FormData,a.support.blobSlice=window.Blob&&(Blob.prototype.slice||Blob.prototype.webkitSlice||Blob.prototype.mozSlice),a.widget("blueimp.fileupload",{options:{dropZone:a(document),pasteZone:a(document),fileInput:void 0,replaceFileInput:!0,paramName:void 0,singleFileUploads:!0,limitMultiFileUploads:void 0,limitMultiFileUploadSize:void 0,limitMultiFileUploadSizeOverhead:512,sequentialUploads:!1,limitConcurrentUploads:void 0,forceIframeTransport:!1,redirect:void 0,redirectParamName:void 0,postMessage:void 0,multipart:!0,maxChunkSize:void 0,uploadedBytes:void 0,recalculateProgress:!0,progressInterval:100,bitrateInterval:500,autoUpload:!0,messages:{uploadedBytes:"Uploaded bytes exceed file size"},i18n:function(b,c){return b=this.messages[b]||b.toString(),c&&a.each(c,function(a,c){b=b.replace("{"+a+"}",c)}),b},formData:function(a){return a.serializeArray()},add:function(b,c){return b.isDefaultPrevented()?!1:void((c.autoUpload||c.autoUpload!==!1&&a(this).fileupload("option","autoUpload"))&&c.process().done(function(){c.submit()}))},processData:!1,contentType:!1,cache:!1},_specialOptions:["fileInput","dropZone","pasteZone","multipart","forceIframeTransport"],_blobSlice:a.support.blobSlice&&function(){var a=this.slice||this.webkitSlice||this.mozSlice;return a.apply(this,arguments)},_BitrateTimer:function(){this.timestamp=Date.now?Date.now():(new Date).getTime(),this.loaded=0,this.bitrate=0,this.getBitrate=function(a,b,c){var d=a-this.timestamp;return(!this.bitrate||!c||d>c)&&(this.bitrate=(b-this.loaded)*(1e3/d)*8,this.loaded=b,this.timestamp=a),this.bitrate}},_isXHRUpload:function(b){return!b.forceIframeTransport&&(!b.multipart&&a.support.xhrFileUpload||a.support.xhrFormDataFileUpload)},_getFormData:function(b){var c;return"function"===a.type(b.formData)?b.formData(b.form):a.isArray(b.formData)?b.formData:"object"===a.type(b.formData)?(c=[],a.each(b.formData,function(a,b){c.push({name:a,value:b})}),c):[]},_getTotal:function(b){var c=0;return a.each(b,function(a,b){c+=b.size||1}),c},_initProgressObject:function(b){var c={loaded:0,total:0,bitrate:0};b._progress?a.extend(b._progress,c):b._progress=c},_initResponseObject:function(a){var b;if(a._response)for(b in a._response)a._response.hasOwnProperty(b)&&delete a._response[b];else a._response={}},_onProgress:function(b,c){if(b.lengthComputable){var d,e=Date.now?Date.now():(new Date).getTime();if(c._time&&c.progressInterval&&e-c._time<c.progressInterval&&b.loaded!==b.total)return;c._time=e,d=Math.floor(b.loaded/b.total*(c.chunkSize||c._progress.total))+(c.uploadedBytes||0),this._progress.loaded+=d-c._progress.loaded,this._progress.bitrate=this._bitrateTimer.getBitrate(e,this._progress.loaded,c.bitrateInterval),c._progress.loaded=c.loaded=d,c._progress.bitrate=c.bitrate=c._bitrateTimer.getBitrate(e,d,c.bitrateInterval),this._trigger("progress",a.Event("progress",{delegatedEvent:b}),c),this._trigger("progressall",a.Event("progressall",{delegatedEvent:b}),this._progress)}},_initProgressListener:function(b){var c=this,d=b.xhr?b.xhr():a.ajaxSettings.xhr();d.upload&&(a(d.upload).bind("progress",function(a){var d=a.originalEvent;a.lengthComputable=d.lengthComputable,a.loaded=d.loaded,a.total=d.total,c._onProgress(a,b)}),b.xhr=function(){return d})},_isInstanceOf:function(a,b){return Object.prototype.toString.call(b)==="[object "+a+"]"},_initXHRData:function(b){var c,d=this,e=b.files[0],f=b.multipart||!a.support.xhrFileUpload,g=b.paramName[0];b.headers=a.extend({},b.headers),b.contentRange&&(b.headers["Content-Range"]=b.contentRange),f&&!b.blob&&this._isInstanceOf("File",e)||(b.headers["Content-Disposition"]='attachment; filename="'+encodeURI(e.name)+'"'),f?a.support.xhrFormDataFileUpload&&(b.postMessage?(c=this._getFormData(b),b.blob?c.push({name:g,value:b.blob}):a.each(b.files,function(a,d){c.push({name:b.paramName[a]||g,value:d})})):(d._isInstanceOf("FormData",b.formData)?c=b.formData:(c=new FormData,a.each(this._getFormData(b),function(a,b){c.append(b.name,b.value)})),b.blob?c.append(g,b.blob,e.name):a.each(b.files,function(a,e){(d._isInstanceOf("File",e)||d._isInstanceOf("Blob",e))&&c.append(b.paramName[a]||g,e,e.uploadName||e.name)})),b.data=c):(b.contentType=e.type,b.data=b.blob||e),b.blob=null},_initIframeSettings:function(b){var c=a("<a></a>").prop("href",b.url).prop("host");b.dataType="iframe "+(b.dataType||""),b.formData=this._getFormData(b),b.redirect&&c&&c!==location.host&&b.formData.push({name:b.redirectParamName||"redirect",value:b.redirect})},_initDataSettings:function(a){this._isXHRUpload(a)?(this._chunkedUpload(a,!0)||(a.data||this._initXHRData(a),this._initProgressListener(a)),a.postMessage&&(a.dataType="postmessage "+(a.dataType||""))):this._initIframeSettings(a)},_getParamName:function(b){var c=a(b.fileInput),d=b.paramName;return d?a.isArray(d)||(d=[d]):(d=[],c.each(function(){for(var b=a(this),c=b.prop("name")||"files[]",e=(b.prop("files")||[1]).length;e;)d.push(c),e-=1}),d.length||(d=[c.prop("name")||"files[]"])),d},_initFormSettings:function(b){b.form&&b.form.length||(b.form=a(b.fileInput.prop("form")),b.form.length||(b.form=a(this.options.fileInput.prop("form")))),b.paramName=this._getParamName(b),b.url||(b.url=b.form.prop("action")||location.href),b.type=(b.type||"string"===a.type(b.form.prop("method"))&&b.form.prop("method")||"").toUpperCase(),"POST"!==b.type&&"PUT"!==b.type&&"PATCH"!==b.type&&(b.type="POST"),b.formAcceptCharset||(b.formAcceptCharset=b.form.attr("accept-charset"))},_getAJAXSettings:function(b){var c=a.extend({},this.options,b);return this._initFormSettings(c),this._initDataSettings(c),c},_getDeferredState:function(a){return a.state?a.state():a.isResolved()?"resolved":a.isRejected()?"rejected":"pending"},_enhancePromise:function(a){return a.success=a.done,a.error=a.fail,a.complete=a.always,a},_getXHRPromise:function(b,c,d){var e=a.Deferred(),f=e.promise();return c=c||this.options.context||f,b===!0?e.resolveWith(c,d):b===!1&&e.rejectWith(c,d),f.abort=e.promise,this._enhancePromise(f)},_addConvenienceMethods:function(b,c){var d=this,e=function(b){return a.Deferred().resolveWith(d,b).promise()};c.process=function(b,f){return(b||f)&&(c._processQueue=this._processQueue=(this._processQueue||e([this])).pipe(function(){return c.errorThrown?a.Deferred().rejectWith(d,[c]).promise():e(arguments)}).pipe(b,f)),this._processQueue||e([this])},c.submit=function(){return"pending"!==this.state()&&(c.jqXHR=this.jqXHR=d._trigger("submit",a.Event("submit",{delegatedEvent:b}),this)!==!1&&d._onSend(b,this)),this.jqXHR||d._getXHRPromise()},c.abort=function(){return this.jqXHR?this.jqXHR.abort():(this.errorThrown="abort",d._trigger("fail",null,this),d._getXHRPromise(!1))},c.state=function(){return this.jqXHR?d._getDeferredState(this.jqXHR):this._processQueue?d._getDeferredState(this._processQueue):void 0},c.processing=function(){return!this.jqXHR&&this._processQueue&&"pending"===d._getDeferredState(this._processQueue)},c.progress=function(){return this._progress},c.response=function(){return this._response}},_getUploadedBytes:function(a){var b=a.getResponseHeader("Range"),c=b&&b.split("-"),d=c&&c.length>1&&parseInt(c[1],10);return d&&d+1},_chunkedUpload:function(b,c){b.uploadedBytes=b.uploadedBytes||0;var d,e,f=this,g=b.files[0],h=g.size,i=b.uploadedBytes,j=b.maxChunkSize||h,k=this._blobSlice,l=a.Deferred(),m=l.promise();return this._isXHRUpload(b)&&k&&(i||h>j)&&!b.data?c?!0:i>=h?(g.error=b.i18n("uploadedBytes"),this._getXHRPromise(!1,b.context,[null,"error",g.error])):(e=function(){var c=a.extend({},b),m=c._progress.loaded;c.blob=k.call(g,i,i+j,g.type),c.chunkSize=c.blob.size,c.contentRange="bytes "+i+"-"+(i+c.chunkSize-1)+"/"+h,f._initXHRData(c),f._initProgressListener(c),d=(f._trigger("chunksend",null,c)!==!1&&a.ajax(c)||f._getXHRPromise(!1,c.context)).done(function(d,g,j){i=f._getUploadedBytes(j)||i+c.chunkSize,m+c.chunkSize-c._progress.loaded&&f._onProgress(a.Event("progress",{lengthComputable:!0,loaded:i-c.uploadedBytes,total:i-c.uploadedBytes}),c),b.uploadedBytes=c.uploadedBytes=i,c.result=d,c.textStatus=g,c.jqXHR=j,f._trigger("chunkdone",null,c),f._trigger("chunkalways",null,c),h>i?e():l.resolveWith(c.context,[d,g,j])}).fail(function(a,b,d){c.jqXHR=a,c.textStatus=b,c.errorThrown=d,f._trigger("chunkfail",null,c),f._trigger("chunkalways",null,c),l.rejectWith(c.context,[a,b,d])})},this._enhancePromise(m),m.abort=function(){return d.abort()},e(),m):!1},_beforeSend:function(a,b){0===this._active&&(this._trigger("start"),this._bitrateTimer=new this._BitrateTimer,this._progress.loaded=this._progress.total=0,this._progress.bitrate=0),this._initResponseObject(b),this._initProgressObject(b),b._progress.loaded=b.loaded=b.uploadedBytes||0,b._progress.total=b.total=this._getTotal(b.files)||1,b._progress.bitrate=b.bitrate=0,this._active+=1,this._progress.loaded+=b.loaded,this._progress.total+=b.total},_onDone:function(b,c,d,e){var f=e._progress.total,g=e._response;e._progress.loaded<f&&this._onProgress(a.Event("progress",{lengthComputable:!0,loaded:f,total:f}),e),g.result=e.result=b,g.textStatus=e.textStatus=c,g.jqXHR=e.jqXHR=d,this._trigger("done",null,e)},_onFail:function(a,b,c,d){var e=d._response;d.recalculateProgress&&(this._progress.loaded-=d._progress.loaded,this._progress.total-=d._progress.total),e.jqXHR=d.jqXHR=a,e.textStatus=d.textStatus=b,e.errorThrown=d.errorThrown=c,this._trigger("fail",null,d)},_onAlways:function(a,b,c,d){this._trigger("always",null,d)},_onSend:function(b,c){c.submit||this._addConvenienceMethods(b,c);var d,e,f,g,h=this,i=h._getAJAXSettings(c),j=function(){return h._sending+=1,i._bitrateTimer=new h._BitrateTimer,d=d||((e||h._trigger("send",a.Event("send",{delegatedEvent:b}),i)===!1)&&h._getXHRPromise(!1,i.context,e)||h._chunkedUpload(i)||a.ajax(i)).done(function(a,b,c){h._onDone(a,b,c,i)}).fail(function(a,b,c){h._onFail(a,b,c,i)}).always(function(a,b,c){if(h._onAlways(a,b,c,i),h._sending-=1,h._active-=1,i.limitConcurrentUploads&&i.limitConcurrentUploads>h._sending)for(var d=h._slots.shift();d;){if("pending"===h._getDeferredState(d)){d.resolve();break}d=h._slots.shift()}0===h._active&&h._trigger("stop")})};return this._beforeSend(b,i),this.options.sequentialUploads||this.options.limitConcurrentUploads&&this.options.limitConcurrentUploads<=this._sending?(this.options.limitConcurrentUploads>1?(f=a.Deferred(),this._slots.push(f),g=f.pipe(j)):(this._sequence=this._sequence.pipe(j,j),g=this._sequence),g.abort=function(){return e=[void 0,"abort","abort"],d?d.abort():(f&&f.rejectWith(i.context,e),j())},this._enhancePromise(g)):j()},_onAdd:function(b,c){var d,e,f,g,h=this,i=!0,j=a.extend({},this.options,c),k=c.files,l=k.length,m=j.limitMultiFileUploads,n=j.limitMultiFileUploadSize,o=j.limitMultiFileUploadSizeOverhead,p=0,q=this._getParamName(j),r=0;if(!n||l&&void 0!==k[0].size||(n=void 0),(j.singleFileUploads||m||n)&&this._isXHRUpload(j))if(j.singleFileUploads||n||!m)if(!j.singleFileUploads&&n)for(f=[],d=[],g=0;l>g;g+=1)p+=k[g].size+o,(g+1===l||p+k[g+1].size+o>n)&&(f.push(k.slice(r,g+1)),e=q.slice(r,g+1),e.length||(e=q),d.push(e),r=g+1,p=0);else d=q;else for(f=[],d=[],g=0;l>g;g+=m)f.push(k.slice(g,g+m)),e=q.slice(g,g+m),e.length||(e=q),d.push(e);else f=[k],d=[q];return c.originalFiles=k,a.each(f||k,function(e,g){var j=a.extend({},c);return j.files=f?g:[g],j.paramName=d[e],h._initResponseObject(j),h._initProgressObject(j),h._addConvenienceMethods(b,j),i=h._trigger("add",a.Event("add",{delegatedEvent:b}),j)}),i},_replaceFileInput:function(b){var c=b.clone(!0);a("<form></form>").append(c)[0].reset(),b.after(c).detach(),a.cleanData(b.unbind("remove")),this.options.fileInput=this.options.fileInput.map(function(a,d){return d===b[0]?c[0]:d}),b[0]===this.element[0]&&(this.element=c)},_handleFileTreeEntry:function(b,c){var d,e=this,f=a.Deferred(),g=function(a){a&&!a.entry&&(a.entry=b),f.resolve([a])};return c=c||"",b.isFile?b._file?(b._file.relativePath=c,f.resolve(b._file)):b.file(function(a){a.relativePath=c,f.resolve(a)},g):b.isDirectory?(d=b.createReader(),d.readEntries(function(a){e._handleFileTreeEntries(a,c+b.name+"/").done(function(a){f.resolve(a)}).fail(g)},g)):f.resolve([]),f.promise()},_handleFileTreeEntries:function(b,c){var d=this;return a.when.apply(a,a.map(b,function(a){return d._handleFileTreeEntry(a,c)})).pipe(function(){return Array.prototype.concat.apply([],arguments)})},_getDroppedFiles:function(b){b=b||{};var c=b.items;return c&&c.length&&(c[0].webkitGetAsEntry||c[0].getAsEntry)?this._handleFileTreeEntries(a.map(c,function(a){var b;return a.webkitGetAsEntry?(b=a.webkitGetAsEntry(),b&&(b._file=a.getAsFile()),b):a.getAsEntry()})):a.Deferred().resolve(a.makeArray(b.files)).promise()},_getSingleFileInputFiles:function(b){b=a(b);var c,d,e=b.prop("webkitEntries")||b.prop("entries");if(e&&e.length)return this._handleFileTreeEntries(e);if(c=a.makeArray(b.prop("files")),c.length)void 0===c[0].name&&c[0].fileName&&a.each(c,function(a,b){b.name=b.fileName,b.size=b.fileSize});else{if(d=b.prop("value"),!d)return a.Deferred().resolve([]).promise();c=[{name:d.replace(/^.*\\/,"")}]}return a.Deferred().resolve(c).promise()},_getFileInputFiles:function(b){return b instanceof a&&1!==b.length?a.when.apply(a,a.map(b,this._getSingleFileInputFiles)).pipe(function(){return Array.prototype.concat.apply([],arguments)}):this._getSingleFileInputFiles(b)},_onChange:function(b){var c=this,d={fileInput:a(b.target),form:a(b.target.form)};this._getFileInputFiles(d.fileInput).always(function(e){d.files=e,c.options.replaceFileInput&&c._replaceFileInput(d.fileInput),c._trigger("change",a.Event("change",{delegatedEvent:b}),d)!==!1&&c._onAdd(b,d)})},_onPaste:function(b){var c=b.originalEvent&&b.originalEvent.clipboardData&&b.originalEvent.clipboardData.items,d={files:[]};c&&c.length&&(a.each(c,function(a,b){var c=b.getAsFile&&b.getAsFile();c&&d.files.push(c)}),this._trigger("paste",a.Event("paste",{delegatedEvent:b}),d)!==!1&&this._onAdd(b,d))},_onDrop:function(b){b.dataTransfer=b.originalEvent&&b.originalEvent.dataTransfer;var c=this,d=b.dataTransfer,e={};d&&d.files&&d.files.length&&(b.preventDefault(),this._getDroppedFiles(d).always(function(d){e.files=d,c._trigger("drop",a.Event("drop",{delegatedEvent:b}),e)!==!1&&c._onAdd(b,e)}))},_onDragOver:function(b){b.dataTransfer=b.originalEvent&&b.originalEvent.dataTransfer;var c=b.dataTransfer;c&&-1!==a.inArray("Files",c.types)&&this._trigger("dragover",a.Event("dragover",{delegatedEvent:b}))!==!1&&(b.preventDefault(),c.dropEffect="copy")},_initEventHandlers:function(){this._isXHRUpload(this.options)&&(this._on(this.options.dropZone,{dragover:this._onDragOver,drop:this._onDrop}),this._on(this.options.pasteZone,{paste:this._onPaste})),a.support.fileInput&&this._on(this.options.fileInput,{change:this._onChange})},_destroyEventHandlers:function(){this._off(this.options.dropZone,"dragover drop"),this._off(this.options.pasteZone,"paste"),this._off(this.options.fileInput,"change")},_setOption:function(b,c){var d=-1!==a.inArray(b,this._specialOptions);d&&this._destroyEventHandlers(),this._super(b,c),d&&(this._initSpecialOptions(),this._initEventHandlers())},_initSpecialOptions:function(){var b=this.options;void 0===b.fileInput?b.fileInput=this.element.is('input[type="file"]')?this.element:this.element.find('input[type="file"]'):b.fileInput instanceof a||(b.fileInput=a(b.fileInput)),b.dropZone instanceof a||(b.dropZone=a(b.dropZone)),b.pasteZone instanceof a||(b.pasteZone=a(b.pasteZone))},_getRegExp:function(a){var b=a.split("/"),c=b.pop();return b.shift(),new RegExp(b.join("/"),c)},_isRegExpOption:function(b,c){return"url"!==b&&"string"===a.type(c)&&/^\/.*\/[igm]{0,3}$/.test(c)},_initDataAttributes:function(){var b=this,c=this.options;a.each(a(this.element[0].cloneNode(!1)).data(),function(a,d){b._isRegExpOption(a,d)&&(d=b._getRegExp(d)),c[a]=d})},_create:function(){this._initDataAttributes(),this._initSpecialOptions(),this._slots=[],this._sequence=this._getXHRPromise(!0),this._sending=this._active=0,this._initProgressObject(this),this._initEventHandlers()},active:function(){return this._active},progress:function(){return this._progress},add:function(b){var c=this;b&&!this.options.disabled&&(b.fileInput&&!b.files?this._getFileInputFiles(b.fileInput).always(function(a){b.files=a,c._onAdd(null,b)}):(b.files=a.makeArray(b.files),this._onAdd(null,b)))},send:function(b){if(b&&!this.options.disabled){if(b.fileInput&&!b.files){var c,d,e=this,f=a.Deferred(),g=f.promise();return g.abort=function(){return d=!0,c?c.abort():(f.reject(null,"abort","abort"),g)},this._getFileInputFiles(b.fileInput).always(function(a){if(!d){if(!a.length)return void f.reject();b.files=a,c=e._onSend(null,b).then(function(a,b,c){f.resolve(a,b,c)},function(a,b,c){f.reject(a,b,c)})}}),this._enhancePromise(g)}if(b.files=a.makeArray(b.files),b.files.length)return this._onSend(null,b)}return this._getXHRPromise(!1,b&&b.context)}})}),!function(a,b){"use strict";function c(a,c){var e=this;c=b.extend({mode:"menu",uploadElement:"body",bulkParameterName:"fID"},c),e.options=c,e._templateFileProgress=_.template('<div id="ccm-file-upload-progress" class="ccm-ui"><div id="ccm-file-upload-progress-bar"><div class="progress progress-striped active"><div class="progress-bar" style="width: <%=progress%>%;"></div></div></div></div>'),e._templateSearchResultsMenu=_.template(d.get()),ConcreteAjaxSearch.call(e,a,c),e.setupFileDownloads(),e.setupFileUploads(),e.setupEvents()}c.prototype=Object.create(ConcreteAjaxSearch.prototype),c.prototype.setupFileDownloads=function(){var a=this;a.$downloadTarget=b("#ccm-file-manager-download-target").length?b("#ccm-file-manager-download-target"):b("<iframe />",{name:"ccm-file-manager-download-target",id:"ccm-file-manager-download-target"}).appendTo(document.body)},c.prototype.setupFileUploads=function(){var a=this,c=b(".ccm-file-manager-upload"),d={url:CCM_DISPATCHER_FILENAME+"/ccm/system/file/upload",dataType:"json",formData:{ccm_token:CCM_SECURITY_TOKEN},error:function(a){jQuery.fn.dialog.closeTop();var b=a.responseText;try{b=jQuery.parseJSON(b).errors.join("<br/>")}catch(c){}ConcreteAlert.dialog("Error",b)},progressall:function(c,d){var e=parseInt(d.loaded/d.total*100,10);b("#ccm-file-upload-progress-wrapper").html(a._templateFileProgress({progress:e}))},start:function(){b("#ccm-file-upload-progress-wrapper").remove(),b("<div />",{id:"ccm-file-upload-progress-wrapper"}).html(a._templateFileProgress({progress:100})).appendTo(document.body),b.fn.dialog.open({title:ccmi18n_filemanager.uploadProgress,width:400,height:50,element:b("#ccm-file-upload-progress-wrapper"),modal:!0})},stop:function(){jQuery.fn.dialog.closeTop(),a.refreshResults(),ConcreteAlert.notify({message:ccmi18n_filemanager.uploadComplete,title:ccmi18n_filemanager.title})}};c.on("click",function(){b(this).find("input").trigger("click")}),c.fileupload(d)},c.prototype.setupEvents=function(){var a=this;ConcreteEvent.subscribe("FileManagerUpdateRequestComplete",function(){a.refreshResults()})},c.prototype.setupStarredResults=function(){var a=this;a.$element.unbind(".concreteFileManagerStar").on("click.concreteFileManagerStar","a[data-search-toggle=star]",function(){var c=b(this),d={fID:b(this).attr("data-search-toggle-file-id")};return a.ajaxUpdate(c.attr("data-search-toggle-url"),d,function(a){a.star?c.parent().addClass("ccm-file-manager-search-results-star-active"):c.parent().removeClass("ccm-file-manager-search-results-star-active")}),!1})},c.prototype.updateResults=function(a){var c=this;ConcreteAjaxSearch.prototype.updateResults.call(c,a),c.setupStarredResults(),"choose"==c.options.mode&&(c.$element.unbind(".concreteFileManagerHoverFile"),c.$element.on("mouseover.concreteFileManagerHoverFile","tr[data-file-manager-file]",function(){b(this).addClass("ccm-search-select-hover")}),c.$element.on("mouseout.concreteFileManagerHoverFile","tr[data-file-manager-file]",function(){b(this).removeClass("ccm-search-select-hover")}),c.$element.unbind(".concreteFileManagerChooseFile").on("click.concreteFileManagerChooseFile","tr[data-file-manager-file]",function(){return ConcreteEvent.publish("FileManagerBeforeSelectFile",{fID:b(this).attr("data-file-manager-file")}),ConcreteEvent.publish("FileManagerSelectFile",{fID:b(this).attr("data-file-manager-file")}),!1}))},c.prototype.handleSelectedBulkAction=function(a,c,d,e){var f=this,g=[];b.each(e,function(a,c){g.push({name:"item[]",value:b(c).val()})}),"download"==a?f.$downloadTarget.get(0).src=CCM_TOOLS_PATH+"/files/download?"+jQuery.param(g):ConcreteAjaxSearch.prototype.handleSelectedBulkAction.call(this,a,c,d,e)},ConcreteAjaxSearch.prototype.createMenu=function(a){var c=this;a.concreteFileMenu({container:c,menu:b("[data-search-menu="+a.attr("data-launch-search-menu")+"]")})},c.launchDialog=function(a){var c=b(window).width()-53;b.fn.dialog.open({width:c,height:"100%",href:CCM_DISPATCHER_FILENAME+"/ccm/system/dialogs/file/search",modal:!0,title:ccmi18n_filemanager.title,onOpen:function(){ConcreteEvent.unsubscribe("FileManagerSelectFile"),ConcreteEvent.subscribe("FileManagerSelectFile",function(b,c){jQuery.fn.dialog.closeTop(),a(c)})}})},c.getFileDetails=function(a,c){b.ajax({type:"post",dataType:"json",url:CCM_DISPATCHER_FILENAME+"/ccm/system/file/get_json",data:{fID:a},error:function(a){ConcreteAlert.dialog("Error",a.responseText)},success:function(a){c(a)}})};var d={get:function(){return'<div class="ccm-ui"><div class="ccm-popover-file-menu popover fade" data-search-file-menu="<%=item.fID%>" data-search-menu="<%=item.fID%>"><div class="arrow"></div><div class="popover-inner"><ul class="dropdown-menu"><% if (typeof(displayClear) != \'undefined\' && displayClear) { %><li><a href="#" data-file-manager-action="clear">'+ccmi18n_filemanager.clear+'</a></li><li class="divider"></li><% } %><% if (item.canViewFile) { %><li><a class="dialog-launch" dialog-modal="false" dialog-append-buttons="true" dialog-width="90%" dialog-height="75%" dialog-title="'+ccmi18n_filemanager.view+'" href="'+CCM_TOOLS_PATH+'/files/view?fID=<%=item.fID%>">'+ccmi18n_filemanager.view+"</a></li><% } %><li><a href=\"#\" onclick=\"window.frames['ccm-file-manager-download-target'].location='"+CCM_TOOLS_PATH+"/files/download?fID=<%=item.fID%>'; return false\">"+ccmi18n_filemanager.download+'</a></li><% if (item.canEditFile) { %><li><a class="dialog-launch" dialog-modal="true" dialog-width="90%" dialog-height="70%" dialog-title="'+ccmi18n_filemanager.edit+'" href="'+CCM_TOOLS_PATH+'/files/edit?fID=<%=item.fID%>">'+ccmi18n_filemanager.edit+'</a></li><% } %><li><a class="dialog-launch" dialog-modal="true" dialog-width="680" dialog-height="450" dialog-title="'+ccmi18n_filemanager.properties+'" href="'+CCM_DISPATCHER_FILENAME+'/ccm/system/dialogs/file/properties?fID=<%=item.fID%>">'+ccmi18n_filemanager.properties+'</a></li><% if (item.canReplaceFile) { %><li><a class="dialog-launch" dialog-modal="true" dialog-width="300" dialog-height="320" dialog-title="'+ccmi18n_filemanager.replace+'" href="'+CCM_TOOLS_PATH+'/files/replace?fID=<%=item.fID%>">'+ccmi18n_filemanager.replace+'</a></li><% } %><% if (item.canCopyFile) { %><li><a href="#" data-file-manager-action="duplicate">'+ccmi18n_filemanager.duplicate+'</a></li><% } %><li><a class="dialog-launch" dialog-modal="true" dialog-width="500" dialog-height="400" dialog-title="'+ccmi18n_filemanager.sets+'" href="'+CCM_TOOLS_PATH+'/files/add_to?fID=<%=item.fID%>">'+ccmi18n_filemanager.sets+'</a></li><% if (item.canDeleteFile || item.canEditFilePermissions) { %><li class="divider"></li><% } %><% if (item.canEditFilePermissions) { %><li><a class="dialog-launch" dialog-modal="true" dialog-width="520" dialog-height="450" dialog-title="'+ccmi18n_filemanager.permissions+'" href="'+CCM_TOOLS_PATH+'/files/permissions?fID=<%=item.fID%>">'+ccmi18n_filemanager.permissions+'</a></li><% } %><% if (item.canDeleteFile) { %><li><a class="dialog-launch" dialog-modal="true" dialog-width="500" dialog-height="200" dialog-title="'+ccmi18n_filemanager.deleteFile+'" href="'+CCM_TOOLS_PATH+'/files/delete?fID=<%=item.fID%>">'+ccmi18n_filemanager.deleteFile+"</a></li><% } %></ul></div></div>"}};b.fn.concreteFileManager=function(a){return b.each(b(this),function(){new c(b(this),a)})},a.ConcreteFileManager=c,a.ConcreteFileManagerMenu=d}(window,$),!function(a,b){"use strict";function c(a,c){var d=this,c=b.extend({chooseText:ccmi18n_filemanager.chooseNew,inputName:"concreteFile",fID:!1},c);d.$element=a,d.options=c,d._chooseTemplate=_.template(d.chooseTemplate,{options:d.options}),d._loadingTemplate=_.template(d.loadingTemplate),d._fileLoadedTemplate=_.template(d.fileLoadedTemplate),d._fileMenuTemplate=_.template(ConcreteFileManagerMenu.get()),d.$element.append(d._chooseTemplate),d.$element.on("click","div.ccm-file-selector-choose-new",function(){return ConcreteFileManager.launchDialog(function(a){d.loadFile(a.fID)}),!1}),d.options.fID&&d.loadFile(d.options.fID)}c.prototype={chooseTemplate:'<div class="ccm-file-selector-choose-new"><input type="hidden" name="<%=options.inputName%>" value="0" /><%=options.chooseText%></div>',loadingTemplate:'<div class="ccm-file-selector-loading"><img src="'+CCM_IMAGE_PATH+'/throbber_white_16.gif" /></div>',fileLoadedTemplate:'<div class="ccm-file-selector-file-selected"><input type="hidden" name="<%=inputName%>" value="<%=file.fID%>" /><div class="ccm-file-selector-file-selected-thumbnail"><%=file.resultsThumbnailImg%></div><div class="ccm-file-selector-file-selected-title"><div><%=file.title%></div></div><div class="clearfix"></div></div>',loadFile:function(a){var c=this;c.$element.html(c._loadingTemplate),ConcreteFileManager.getFileDetails(a,function(a){var d=a.files[0];c.$element.html(c._fileLoadedTemplate({inputName:c.options.inputName,file:d})),c.$element.append(c._fileMenuTemplate({displayClear:!0,item:d})),c.$element.find(".ccm-file-selector-file-selected").concreteFileMenu({container:c,menu:b("[data-search-file-menu="+d.fID+"]"),menuLauncherHoverClass:"ccm-file-manager-menu-item-hover"})})}},b.fn.concreteFileSelector=function(a){return b.each(b(this),function(){new c(b(this),a)})},a.ConcreteFileSelector=c}(this,$),!function(a,b,c){"use strict";function d(a,c){var d=this,c=c||{};c=b.extend({container:!1},c),ConcreteMenu.call(d,a,c)}d.prototype=Object.create(ConcreteMenu.prototype),d.prototype.setupMenuOptions=function(a){var d=this,e=ConcreteMenu.prototype,f=a.attr("data-search-file-menu"),g=d.options.container;e.setupMenuOptions(a),a.find("a[data-file-manager-action=clear]").on("click",function(){var a=ConcreteMenuManager.getActiveMenu();return a&&a.hide(),c.defer(function(){g.$element.html(g._chooseTemplate)}),!1}),a.find("a[data-file-manager-action=duplicate]").on("click",function(){return b.concreteAjax({url:CCM_DISPATCHER_FILENAME+"/ccm/system/file/duplicate",data:{fID:f},success:function(){"undefined"!=typeof g.refreshResults&&g.refreshResults()}}),!1})},b.fn.concreteFileMenu=function(a){return b.each(b(this),function(){new d(b(this),a)})},a.ConcreteFileMenu=d}(this,$,_);

