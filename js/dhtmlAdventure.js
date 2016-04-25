
var DAMain;

function DHTMLAdventure () {
    this.layouts    = {};
    this.components = {};
    this.objects    = {};
}

DHTMLAdventure.prototype.initLayout = function () {
    /* Define the pane arangement for the main UI
     * http://layout.jquery-dev.com/documentation.cfm
     */
    this.layouts.main = $('body').layout({
        defaults: {
            initClosed:            false
        },
        west: {
            // Image and inventory parent pane
            minSize:     400
        }
    });
    this.layouts.sidebar = $("body > .ui-layout-west").layout({
        defaults: {
            initClosed:            false
        },
        north: {
            // Image
            minSize:     300
        }
    });
    // https://jqueryui.com/accordion/#sortable
    this.layouts.objects = $( "#object-pane" ).accordion({
        header: "> div > h3",
        heightStyle: "content"
    })
        .sortable({
            axis: "y",
            handle: "h3",
            stop: function( event, ui ) {
          // IE doesn't register the blur when sorting
          // so trigger focusout handlers to remove .ui-state-focus
          ui.item.children( "h3" ).triggerHandler( "focusout" );
 
          // Refresh accordion to handle new order
          $( this ).accordion( "refresh" );
        }
      });

    /* Tabs:
    $( "#object-pane" ).tabs()
        .addClass( "ui-tabs-vertical ui-helper-clearfix" );
    $( "#object-pane li" )
        .removeClass( "ui-corner-top" ).addClass( "ui-corner-left" );
    */
}

DHTMLAdventure.prototype.msg = function ( txt ) {
    // console.log(this.layouts.main)
    $.layout.msg( txt, true );
    
}

DHTMLAdventure.prototype.objectSection = function ( id, header, text ) {
    if (!id) return null;
    if (this.objects[ id ]) return this.objects[ id ];
    if (!header) header = id;
    html = '<div class="group"><h3>' + header + '</h3><div id="'+id+'">';
    if (text) html += text;
    html += '</div>'; 
    $( "#object-pane" ).append( html );
    this.layouts.objects.accordion( "refresh" );
    return this.objects[ id ] = $('#'+id);
}

DHTMLAdventure.prototype.debug = function ( html ) {
    var obj = this.objectSection( 'DADebug', 'Code Debugging', 'Debugging messages:');
    obj.append( '<div class="dbgMsg">'+html+"</div>" );
}

DHTMLAdventure.prototype.err = function ( html ) {
    var obj = this.objectSection( 'DAErrors', 'Code Errors!', 'DHTML Adventure is having problems. They are listed below:');
    obj.append( '<div class="errMsg">'+html+"</div>" );
}

DHTMLAdventure.prototype.init = function () {
    var startDoc = "AdventureList.md";
    // this.debug(startDoc);
    this.parseMarkdownURI( startDoc );
}

var entityMap = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': '&quot;',
    "'": '&#39;',
    "/": '&#x2F;'
};
DHTMLAdventure.prototype.escXML = function ( xml ) {
    // https://stackoverflow.com/a/12034334
    return String(xml).replace(/[&<>"'\/]/g, function (s) {
        return entityMap[s];
    });
}

DHTMLAdventure.prototype.parseMarkdown = function ( text ) {
    // https://github.com/evilstreak/markdown-js
    var tree = markdown.parse( text );
    return tree;
}

DHTMLAdventure.prototype.parseMarkdownAJAX = function ( text, reqType ) {
    var tree = this.parseMarkdown(text);
    if (reqType == "AdventureList") {
        return this.renderAdventureList(tree);
    }
    // this.debug( JSON.stringify( tree ) );
}

DHTMLAdventure.prototype.renderAdventureList = function ( tree ) {
    // Should we try to manipulate the tree in 
    var jsonML = markdown.toHTMLTree( tree );
    this.debug( "<pre>" + JSON.stringify( jsonML, null, "  " )+"</pre>" );
    var html = markdown.toHTML( tree );
    $("#main-pane").html( html )
    // this.debug( "<pre>" + this.escXML( html) +"</pre>" );
}

DHTMLAdventure.prototype.parseMarkdownURI = function ( request ) {
    var self = this;
    var reqType = "foo";
    if (/AdventureList\.md/.test(request)) {
        reqType = "AdventureList";
    }
    $.ajax({url: request,
            dataType: "text",
            beforeSend: function(xhr){
                // Silence "not well-formed" messages
                // https://stackoverflow.com/a/4234006
                if (xhr.overrideMimeType) xhr.overrideMimeType("text/text");
            },
            success: function(result) {
                self.parseMarkdownAJAX( result, reqType );
            },
            error: function(jqXHR, errType, errTxt) {
                self.err("<b>"+reqType+"</b> : <i>"+errType+"</i> = "+errTxt);
            }
           });
}


function DAdocReady () {
    DAMain = new DHTMLAdventure();
    DAMain.initLayout();
    DAMain.init();
}

