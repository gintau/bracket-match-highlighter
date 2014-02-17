/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global define, $, brackets, window */

/** Simple extension that adds a "File > Hello World" menu item */
define(function (require, exports, module) {
    "use strict";

    var CommandManager  = brackets.getModule("command/CommandManager"),
        EditorManager   = brackets.getModule("editor/EditorManager"),
        DocumentManager = brackets.getModule("document/DocumentManager"),
        Menus           = brackets.getModule("command/Menus"),
        ExtensionUtils  = brackets.getModule("utils/ExtensionUtils"),
        COMMAND_ID      = "net.gintau.matchhighlighter";
    
    // Insert default overlay style at the beginning of head, so any custom style can overwrite it.
    var styleUrl = ExtensionUtils.getModulePath(module, "default.css");
    var style = $('<link rel="stylesheet" type="text/css" />');
    $(document.head).prepend(style);
    $(style).attr('href', styleUrl);
    
    // Enable match-highlighter plugin of CodeMirror2 (this plugin is default contained in sprint 37) 
    var script = document.createElement("script");
    script.src = "thirdparty/CodeMirror2/addon/search/match-highlighter.js";
    document.head.appendChild(script);
              
    $(EditorManager).on("activeEditorChange", function(e, activeEditor, prevEditor){   
        activateHighlight(activeEditor);
        deactivateHighlight(prevEditor);
    });           
    
    function activateHighlight(editor) {       
        if (!editor) {
            return;
        }        
        
        // TODO: Direct access to _codeMirror is deprecated, needs to set option via editor.
        var codeMirror = editor._codeMirror;
        codeMirror.setOption("highlightSelectionMatches", {showToken:true});
    }
    
    function deactivateHighlight(editor){
        if (!editor) {
            return;
        }
        
        // TODO: Direct access to _codeMirror is deprecated, needs to set option via editor.
        var codeMirror = editor._codeMirror;
        codeMirror.setOption("highlightSelectionMatches", false);
    }   
});