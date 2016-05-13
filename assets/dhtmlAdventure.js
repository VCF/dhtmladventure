
var DAMain;

function DHTMLAdventure () {
    this.layouts    = {};
    this.components = {};
    this.objects    = {};
    this.config     = {};
    this.roomURIs   = {};
    this.roomCache  = [0];
}

var DaDefaultConfig = {
    StartWithInventory: {
        desc: "The player begins with a generic inventory",
        val: 1
    },
    SourceButton: {
        desc: "Put a 'View Source' option in the settings menu. Useful for tutorial, but would allow 'cheating' in some cases.",
        val: 0
    }
};

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
    var startDoc = "README.md";
    var dl = document.location;
    var locPart;
    if (dl.search) {
        locPart = dl.search.match(/^\?(.+\.md)$/)
    } else if (dl.hash) {
        locPart = dl.hash.match(/^\#(.+\.md)$/)
    }
    if (locPart) startDoc = locPart[1];
    
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

DHTMLAdventure.prototype._noramlizeMarkedownNode = function ( node ) {
    /* Make sure all nodes have an attribute hash at index 1
     * First entry is tag name, eg "ul" or "p"
     * There are additional 'things' defined for this node. They
     * can be:
     "A string"  (raw text)
     {An object} (attributes)
     [] (One or more child nodes
     The attributes must be handled specially
    */
    if (node.length < 2 || 
        typeof node[ 1 ] != "object" ||
        node[ 1 ] instanceof Array) {
        // There is not an attribute hash at index 1
        node.splice(1, 0, {} );
    }
}

DHTMLAdventure.prototype.absoluteURI = function ( uri ) {
    var rv = uri;
    if (/^(\/|http|file)/.test(rv)) {
        // Just tidy absolute URIs
    } else if (this.rootPath) {
        rv = rv.replace(/\/{2,}/g, '/');
        rv = rv.replace(/\/\.\//g, '/');
        rv = rv.replace(/^\.\//, '');
        if (/\.md$/.test(rv)) {
            // Markdown files should always be at root level of root path
            // This helps launch adventures from the README.md page
            rv = rv.replace(/.+\//,'');
        }
        rv = this.rootPath + rv;
    }
    return rv;
}

DHTMLAdventure.prototype.relativeURI = function ( uri ) {
    if (!this.basePath) {
        var href = document.location.href;
        href = href.replace(/[\?\#].+$/, '');
        href = href.replace(/[^\/]+$/, '');
        this.basePath = href;
    }
    var rv = this.absoluteURI( uri );
    rv = rv.replace(this.basePath, '');
    return rv;
}

DHTMLAdventure.prototype.sameDomainURI = function ( uri ) {
    if (!uri) return null;
    // Relative links are always same domain
    if (!/:\/\//.test(uri)) return uri;
    if (!this.domain) {
        // hostname appears to be empty for file protocols
        this.domain = window.location.hostname || 'file://';
    }
    if (uri.indexOf(this.domain) > -1) return uri;
    return null;
}

DHTMLAdventure.prototype.getCachedRoom = function ( uri  ) {
    uri = this.absoluteURI( uri );
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
    uri  = this.absoluteURI( uri );
    room = new DARoom( this );
    this.roomCache.push( room );
    room.markdown = text;
    room.rawTree  = markdown.toHTMLTree( text );
    room.uri      = uri;
    room.relpath  = this.relativeURI( uri );
    room.cache    = this.roomURIs[ uri ] = this.roomCache.length - 1;
    if (action) return room[ action ]();
    return room;
}

DHTMLAdventure.prototype.createRoomFailed = function (uri, action, errType, errTxt ) {
    var md = "# Game error\n\n![Kendell Geers on Wikimedia][Error]\n\nThe previous room linked to a room file that could not be recovered. Chances are this is because there was a **typo in the link** (the room file was misspelled) or because the room file has **not yet been created**. It is also possible that the file exists, but has access permissions that prevent it from being displayed.\n\n";
    md += "* Requested Room: `"+this.relativeURI(uri)+"`\n";
    md += "* Error type: `"+errType+"`\n";
    md += "* Error text: `"+errTxt+"`\n";
    md += "* Room URI: ["+uri+"]("+uri+")\n";
    md += "\n[Return to the previous room]("+this.currentRoom+")\n\n";
    md += "[Error]: ../assets/Error.jpg 'https://commons.wikimedia.org/wiki/File:Kendell_Geers_-_T-error_%282003%29_sans_T.jpg'";
    var room = this.createRoom( md, uri, action);
    room.linkClass = 'error';
}

DHTMLAdventure.prototype.globalConfig = function( text, uri, action  ) {
    var tree = markdown.toHTMLTree( text );
    var nt   = this.newTree = {
        nodeHandler: '_configHandler',
        config: {}
    };
    nt.tree = this._parse( tree );
    this.config = nt.config;
    //this.debugObj( this.newTree );
    //this.debugObj( tree );
}

DHTMLAdventure.prototype.param = function ( tag ) {
    var rv = this.config[ tag ];
    if (rv === undefined && DaDefaultConfig[ tag ])
        rv = DaDefaultConfig[ tag ].val;
    return rv;
}

DHTMLAdventure.prototype._configHandler = function( newNode, parent ) {
    var nt      = this.newTree;
    var tag     = newNode[0]; // First entry is tag name, eg "ul" or "p"
    if (tag == 'strong') {
        // Conf tag names are stored as bold (strong) entries
        if (!parent[1].tagnames) parent[1].tagnames = [];
        parent[1].tagnames.push( newNode[2] );
        return null;
    }
    if (tag == 'li') {
        // Should have at least one tag set:
        var tags = newNode[1].tagnames;
        if (!tags) return null;
        if (tags.length != 1) {
            this.err("Multiple tag names set: "+tags.join(' + '));
            return null;
        }
        var tag = tags[0];
        var txt = newNode[2];
        if (!txt || typeof txt == "object") {
            this.err("Unrecognized value set for tag "+tag);
            return null;
        }
        var valRE = txt.match(/^\s*(?:=>?|\:)\s*(\S.*?)\s*$/);
        if (!valRE) {
            this.err("Apparent tag '"+tag+"' does not have recognizable value ( should have format ' = Some Value')");
            return null;
        }
        if (!nt.config[tag]) nt.config[tag] = [];
        var val = valRE[1];
        nt.config[tag].push(valRE[1]);
        return newNode;
    }
    if (tag == 'p') {
        // Intermediate <p> level
        newNode.shift(); // Discard tag
        parent[1] = newNode.shift(); // Give parent attributes
        for (var i = 0; i < newNode.length; i++) {
            parent.push( newNode[i] );
        }
        return null;
    }
    return newNode;
}


DHTMLAdventure.prototype.globalConfigFailed = function () {
    this.debug("No configuration");
}

DHTMLAdventure.prototype.roomAction = function ( uri, action ) {
    uri = this.absoluteURI( uri );
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
    if (this.rootPath) {
        uri = this.absoluteURI(uri);
    } else if (/\.md$/.test(uri) && !/README\.md$/.test(uri)) {
        // https://stackoverflow.com/a/6644749
        var temp = document.createElement('a');
        temp.href = uri;
        var root = uri = temp.href;
        root = root.replace(/[^\/]+$/,"");
        this.rootPath = root;
        this.retrieveURI( 'Configuration.md', 'globalConfig' );
    }
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
                var failMeth = action + "Failed";
                if (self[ failMeth ]) {
                    // There is a specific failure method for the action
                    self[ failMeth ]( uri, afterAction, errType, errTxt );
                } else {
                    self.err("<b>"+errType+"</b> : While recovering '"+uri+
                             "': <i>"+errTxt+"</i>");
                }
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
    this.DA    = da;
    this.idCnt = 0;
    this.config = {};
}

DARoom.prototype.param = function ( tag ) {
    var rv = this.config[ tag ];
    if (rv === undefined) rv = this.DA.param( tag );
    return rv;
}

DARoom.prototype.type = function () {
    var t = this.roomType;
    if (!t) {
        t = "Unknown";
        var uri = this.uri;
        if (/README\.md$/.test(uri)) {
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
    this.DA.currentRoom = this.relpath;
    var jsonML = this.processJsonML();
    this.newTree.showing = { ids: {} };
    var html = markdown.renderJsonML( jsonML );
    $("#main-pane").html( html )
    this.addExtras();
    var dl = document.location;
    // We will set the hash to the relative path, to prevent a
    // javascript-induced page reload while allowing a user-triggered
    // page reload (Ctrl-R) to load the appropriate room
    document.location.hash = this.relpath;
    if (document.location.search) document.location.search = "";
    // this.debug( "<pre>" + this.escXML( html) +"</pre>" );
}

DARoom.prototype.showAdventureList = DARoom.prototype._showMarkdown;
DARoom.prototype.showRoomFile = DARoom.prototype._showMarkdown;

DARoom.prototype.addExtras = function ( ) {
    var DA   = this.DA;
    var nt   = this.newTree;
    var show = nt.showing;
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
        if (show.ids[ id ]++) continue;
        var pSel = "#"+id;
        var img  = $(pSel + " > img");
        var orig = img.attr('title');
        this._creditButton( pSel, orig, img.attr('alt'))
        img.attr("title", "");
    }
    for (var r = 0; r < nt.rLinks.length; r++) {
        // Deal with room links
        var rId  = nt.rLinks[r];
        if (show.ids[ rId ]++) continue;
        var anc  = $('#'+rId);
        anc.addClass('room-button')
            .click(function( event ) {
                event.preventDefault();
                var uri = event.target.getAttribute('href');
                // alert(uri);
                DA.roomAction( uri, 'show' );
            });
        // Let's make sure that room is precached while we're here
        try {
            DA.roomAction( anc.attr('href'), 'noOp' );
        } catch (e) {
        }
    }
    if (this.param('SourceButton') && !show.ids.sourceButton++) {
        // Add a button to the menu that allows the source to be viewed
        var iId = this.menuItem("Show Page Source", 1);
        $("#main-pane").append("<div id='mdsource'><button id='mdsrcclose'>Close</button><b>Markdown Source</b> <a href='"+this.uri+"' target='_blank'>Open raw file</a><pre>"+this.markdown+"</pre></div>");
        $( "#mdsrcclose" ).button({
            icons: { primary: "ui-icon-close" },
            text: false }).click( function() {
                $( "#mdsource" ).hide();
            });
        $( "#"+iId ).click( function() { $( "#mdsource" ).show(); });
        $( "#mdsource" ).draggable();
    }
    // this.menu();
}

DARoom.prototype.menu = function ( ) {
    if (this.newTree.showing.menu) return this.newTree.showing.menu;
    var mId = "DAmenu";
    // https://commons.wikimedia.org/wiki/File:Ic_settings_48px.svg
    $("#main-pane").append("<image id='menugear' src='assets/images/Gear20x20.png' />");
    $("#main-pane").append("<ul id='"+mId+"'></ul>");
    $("#"+mId).menu().addClass('damenu');
    $("#"+mId).hide();
    $("#menugear").mouseenter( function() { $("#"+mId).show() } );
    // Not entirely happy with mouseleave() here ...
    $("#"+mId).mouseleave( function() { $("#"+mId).hide() });
    return this.newTree.showing.menu = mId;
}

DARoom.prototype.menuItem = function ( menuText, wiggle ) {
    var sKey = "MenuItem:"+menuText;
    var iId = this.newTree.showing[sKey];
    if (!iId) {
        var mId = this.menu();
        iId     = this.newTree.showing[sKey] = 'menu' + ++this.idCnt;
        $("#"+mId ).append("<li id='"+iId+"'>"+menuText+"</li>");
        $("#"+mId ).menu("refresh");
        // Highlight that something was added to the menu
        if (wiggle) $("#menugear").effect
        ("shake", { times: 1, direction: "right", distance: 5 }, "fast");
    }
    return iId;
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
        rLinks: []
    };
    return this.newTree.tree = this._parse( this.rawTree );
}

DARoom.prototype._parse = DHTMLAdventure.prototype._parse =
function ( node, parent ) {
    if (!(node instanceof Array)) return node; // String
    var DA      = this.DA || this;
    DA._noramlizeMarkedownNode( node );
    var nl      = node.length;
    var newNode = [ node[0], node[1] ];
    // Loop over the remaining parts, if any
    for (var j = 2; j < nl; j++) {
        var kid = this._parse( node[j], newNode );
        if (kid) newNode.push(kid);
    }
    // DA.debugObj(newNode);
    return this[this.newTree.nodeHandler || '_nodeHandler']( newNode, parent );
}

DARoom.prototype._nodeHandler = function ( newNode, parent ) {
    var DA      = this.DA;
    var nt      = this.newTree;
    var tag     = newNode[0]; // First entry is tag name, eg "ul" or "p"
    var attr    = newNode[1];
    var kidNum  = newNode.length - 2;
    if (tag == 'img') {
        // Normalize image URLs
        attr.src = DA.absoluteURI( attr.src );
        if (!nt.mainImage) {
            // The first image should go in the image pane
            nt.mainImage = attr;
            return null;
        }
        // Inline image. We will class the parent <p> object and
        // anchor credit buttons on that.
        nt.images.push( parent[1].id = "Image" + ++this.idCnt );
        parent[1].class = "cred-p";
        kidNum++;
    } else if (tag == 'hr') {
        kidNum++;
    } else if (tag == 'a') {
        var href = attr.href = DA.absoluteURI( attr.href );
        var docref = document.location.href;
        if (/\.md$/.test(href) && DA.sameDomainURI( href )) {
            // This appears to be another room file
            if (this.roomType == 'AdventureList') {
                // We are still on the initial list page. We want to
                // make URLs that will force a reload to start a new
                // adventure.
                attr.href = docref + '?' + attr.href;
                // DA.debugObj( href );
            } else {
                // Will post process in a later step
                nt.rLinks.push(attr.id = "RoomLink" + ++this.idCnt);
            }
        } else {
            // External link
            attr.class='ext-lnk'
            attr['_target'] = 'blank'
        }
        // DA.debugObj( newNode );
    }
    return kidNum ? newNode : null;
}

