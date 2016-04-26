
var DAMain;

function DHTMLAdventure () {
    this.layouts    = {};
    this.components = {};
    this.objects    = {};
    this.roomURIs   = {};
    this.roomCache  = [0];
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
        heightStyle: "content",
        collapsible: true
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

DHTMLAdventure.prototype.debugObj = function ( obj ) {
    return this.debug( "<pre>" + JSON.stringify( obj, null, " " )+"</pre>" );
}

DHTMLAdventure.prototype.err = function ( html ) {
    var obj = this.objectSection( 'DAErrors', 'Code Errors!', 'DHTML Adventure is having problems. They are listed below:');
    obj.append( '<div class="errMsg">'+html+"</div>" );
}

DHTMLAdventure.prototype.init = function () {
    var startDoc = "AdventureList.md";
    var dl = document.location;
    if (dl.search) {
        var m = dl.search.match(/^\?(.+\.md)$/)
        if (m) startDoc = m[1];
    }
    // this.debug(startDoc);
    var room = this.roomAction( startDoc, 'show' );
    if (room) room.show();
    // this.parseMarkdownURI( startDoc );
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

DHTMLAdventure.prototype.normalizeURI = function ( uri ) {
    if (/^(\/|http|file)/.test(uri)) {
        // Just tidy absolute URIs
    } else if (this.rootPath) {
        uri = uri.replace(/\/{2,}/g, '/');
        uri = uri.replace(/\/\.\//g, '/');
        uri = uri.replace(/^\.\//, '');
        uri = this.rootPath + uri;
    }
    return uri;
}

DHTMLAdventure.prototype.getCachedRoom = function ( uri  ) {
    uri = this.normalizeURI( uri );
    if (!uri) return 0;
    var ind = this.roomURIs[ uri ];
    if (ind) {
        var room = this.roomCache[ ind ];
        if (!room) this.err("Index '"+ind+"' failed to recover room for '"+uri+"'");
        return room;
    }
    return null;
}

DHTMLAdventure.prototype.createRoom = function ( text, uri, action  ) {
    var room = this.getCachedRoom( uri );
    if (room) {
        this.err("Room '"+uri+"' already exists at index "+ind)
        return room;
    }
    uri  = this.normalizeURI( uri );
    room = new DARoom( this );
    this.roomCache.push( room );
    room.markdown = text;
    room.rawTree  = markdown.toHTMLTree( text );
    room.uri      = uri;
    room.cache    = this.roomURIs[ uri ] = this.roomCache.length - 1;
    if (action) return room[ action ]();
    return room;
    // this.debug( JSON.stringify( tree ) );
}

DHTMLAdventure.prototype.roomAction = function ( uri, action ) {
    uri = this.normalizeURI( uri );
    var cacheInd = this.roomURIs[ uri ];
    if (cacheInd) {
        var room = this.roomCache[ cacheInd ];
        return room[ action ]();
    }
    this.retrieveURI( uri, "createRoom", action );
    return 0;
}

DHTMLAdventure.prototype.retrieveURI = function ( uri, action, afterAction ) {
    var self = this;
    if (!action) action = "createRoom";
    if (!this.rootPath) {
        // https://stackoverflow.com/a/6644749
        var temp = document.createElement('a');
        temp.href = uri;
        var root = uri = temp.href;
        root = root.replace(/[^\/]+$/,"");
        this.rootPath = root;
        // this.debugObj( "Root set: "+root );
    }
    uri = this.normalizeURI(uri);
    // alert(uri);
    $.ajax({url: uri,
            dataType: "text",
            beforeSend: function(xhr){
                // Silence "not well-formed" messages
                // https://stackoverflow.com/a/4234006
                if (xhr.overrideMimeType) xhr.overrideMimeType("text/text");
            },
            success: function(result) {
                self[ action ]( result, uri, afterAction );
            },
            error: function(jqXHR, errType, errTxt) {
                self.err("<b>"+errType+"</b> : While recovering '"+uri+
                         "': <i>"+errTxt+"</i>");
            }
           });
}


function DAdocReady () {
    DAMain = new DHTMLAdventure();
    DAMain.initLayout();
    DAMain.init();
}

// = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = //

function DARoom ( da ) {
    this.DA = da;
    this.idCnt = 0;
}

DARoom.prototype.type = function () {
    var t = this.roomType;
    if (!t) {
        t = "Unknown";
        var uri = this.uri;
        if (/AdventureList\.md$/.test(uri)) {
            t = "AdventureList";
        } else if (/\.md$/.test(uri)) {
            t = "RoomFile";
        }
        this.roomType = t;
    }
    return t;
}

DARoom.prototype.noOp = function () {
    // Empty function used for precaching
}

DARoom.prototype.show = function () {
    var type = this.type();
    var func = "show"+type
    if (this[func]) {
        return this[func]();
    } else {
        this.err("No mechanism to show() rooms of type '"+type+"'");
        return null;
    }
}

DARoom.prototype._showMarkdown = function ( ) {
    // Should we try to manipulate the tree in HTML or jsonML?
    var jsonML = this.processJsonML();
    // this.DA.debugObj( jsonML );
    var html = markdown.renderJsonML( jsonML );
    $("#main-pane").html( html )
    this.addExtras();
    // this.debug( "<pre>" + this.escXML( html) +"</pre>" );
}

DARoom.prototype.showAdventureList = DARoom.prototype._showMarkdown;
DARoom.prototype.showRoomFile = DARoom.prototype._showMarkdown;

DARoom.prototype.addExtras = function ( ) {
    var nt = this.newTree;
    var mImg = nt.mainImage;
    var self = this;
    if (mImg) {
        $("#image-pane").html("<img src='"+mImg.src+"' />");
        this._creditButton( "#image-pane", mImg.title, mImg.alt)
    } else {
        $("#image-pane").html("");
    }
    for (var i = 0; i < nt.images.length; i++) {
        // Deal with inline images
        var id   = nt.images[i];
        var pSel = "#"+id;
        var img  = $(pSel + " > img");
        var orig = img.attr('title');
        this._creditButton( pSel, orig, img.attr('alt'))
        img.attr("title", "");
    }
    for (var r = 0; r < nt.rLinks.length; r++) {
        // Deal with room links
        var rId  = nt.rLinks[r];
        var anc  = $('#'+rId);
        anc.addClass('room-button')
            .click(function( event ) {
                event.preventDefault();
                var uri = event.target.getAttribute('href');
                // alert(uri);
                self.DA.roomAction( uri, 'show' );
            });
        // Let's make sure that room is precached while we're here
        try {
            self.DA.roomAction( anc.attr('href'), 'noOp' );
        } catch (e) {
        }
    }
}

DARoom.prototype._creditButton = function ( obj, orig, cred) {
    if (!obj) return;  // No parent object
    if (!orig) return; // No original URL
    if (!(/^http/.test(orig))) {
        this.DA.err("Image credit '"+orig+"' appears malformed");
        return 0;
    }
    var imgID = 'imgCredit' + ++this.idCnt;
    if (!cred) cred = 'Image Source';
    $(obj).append("<a id='"+imgID+"' target='_blank' href='"+
                  orig+"'>"+cred+"</a>");
    $('#'+imgID).button().addClass('cred-button');
    $('#'+imgID).hide();
    // https://stackoverflow.com/a/20563834
    $(document).on('mouseenter', obj, function () {
        $(this).find(".ui-button").show();
    }).on('mouseleave', obj, function () {
        $(this).find(".ui-button").hide();
    });
}


DARoom.prototype.processJsonML = function ( ) {
    this.newTree = { 
        images: [],
        rLinks: [],
    };
    return this.newTree.tree = this._parse( this.rawTree );
}

DARoom.prototype._parse = function ( node, parent ) {
    if (!(node instanceof Array)) return node; // String
    var tag     = node[0]; // First entry is tag name, eg "ul" or "p"
    var newNode = [ tag ];
    var nt = this.newTree;
    var nl = node.length;
    var i  = 1;
    if (nl) {
        /* There are additional 'things' defined for this node. They
         * can be:
           "A string"  (raw text)
           {An object} (attributes)
           [] (One or more child nodes
           The attributes must be handled specially
         */
         if ( typeof node[ i ] === "object" && 
              !( node[ i ] instanceof Array ) ) {
             // Attributes hash
             newNode.push( node[i] );
             i++;
         }
    }
    // Not having attributes on all nodes can be irritating
    // Make sure every node has an attribute hash in the second position:
    if (i == 1) newNode.push( {} );
    var attr = newNode[1];
    // Loop over the remaining parts, if any
    var childCount = 0;
    for (var j = i; j < nl; j++) {
        var kid = this._parse( node[j], newNode );
        if (kid) {
            newNode.push(kid);
            childCount++;
        }
    }
    if (tag == 'img') {
        // Normalize image URLs
        attr.src = this.DA.normalizeURI( attr.src );
        if (!nt.mainImage) {
            // The first image should go in the image pane
            nt.mainImage = attr;
            return null;
        }
        // Inline image. We will class the parent <p> object and
        // anchor credit buttons on that.
        nt.images.push( parent[1].id = "Image" + ++this.idCnt );
        parent[1].class = "cred-p";
        // parent[0] = 'div';
        childCount++;
    } else if (tag == 'a') {
        var href = attr.href = this.DA.normalizeURI( attr.href );
        if (/\.md$/.test(href) && !(/^(\/|http)/.test(href))) {
            // This appears to be another room file
            nt.rLinks.push(attr.id = "RoomLink" + ++this.idCnt);
        } else {
            // External link
            attr.class='ext-lnk'
            attr['_target'] = 'blank'
        }
        // this.DA.debugObj( newNode );
       
    }
    
    return childCount ? newNode : null;
}
