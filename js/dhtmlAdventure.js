
var DAMain;

function DHTMLAdventure () {
    this.layouts = {};
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
            minSize:     400
        }
    });
    $( "#object-pane" ).tabs()
        .addClass( "ui-tabs-vertical ui-helper-clearfix" );
    $( "#object-pane li" )
        .removeClass( "ui-corner-top" ).addClass( "ui-corner-left" );
}

DHTMLAdventure.prototype.msg = function ( txt ) {
    // console.log(this.layouts.main)
    $.layout.msg( txt, true );
    
}

DHTMLAdventure.prototype.err = function ( txt ) {
    
}

DHTMLAdventure.prototype.init = function () {
    var startDoc = "AdventureList.md";
    this.parseMarkdownURI( startDoc );
    // this.msg( startDoc );
}

DHTMLAdventure.prototype.parseMarkdown = function ( text ) {
    var tree = markdown.parse( text );
}

DHTMLAdventure.prototype.parseMarkdownAJAX = function ( text, context ) {
    this.msg( JSON.stringify( text ) );
}

DHTMLAdventure.prototype.parseMarkdownURI = function ( request ) {
    var self = this;
    var context = "foo";
    $.ajax({url: request,
            success: function(result) {
                self.parseMarkdownAJAX( result, context );
            }});
}


function DAdocReady () {
    DAMain = new DHTMLAdventure();
    DAMain.initLayout();
    DAMain.init();
}

