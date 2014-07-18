/*
The MIT License (MIT)

Copyright (c) 2014 Ting-Kuan Wu (gintau2000@gmail.com)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global define, $, brackets, window */

/** Simple extension that adds a "File > Hello World" menu item */
define(function (require, exports, module) {
    "use strict";

    var CommandManager  = brackets.getModule("command/CommandManager"),
        CodeMirror      = brackets.getModule("thirdparty/CodeMirror2/lib/codemirror"),
        Highlight       = brackets.getModule("thirdparty/CodeMirror2/addon/search/match-highlighter"),
        EditorManager   = brackets.getModule("editor/EditorManager"),
        DocumentManager = brackets.getModule("document/DocumentManager"),
        Menus           = brackets.getModule("command/Menus"),
        ExtensionUtils  = brackets.getModule("utils/ExtensionUtils"),
        PreferencesManager = brackets.getModule("preferences/PreferencesManager");
             
    var COMMAND_ID      = "net.gintau.matchhighlighter",
        extensionName   = "bracket-match-highlighter",
        prefs = PreferencesManager.getExtensionPrefs(extensionName);
    
    prefs.definePreference("enabled", "boolean", false);
    var isEnabled = prefs.get("enabled");
    
    function appendDefaultStyle(){
        // Insert default overlay style at the beginning of head, so any custom style can overwrite it.
        var styleUrl = ExtensionUtils.getModulePath(module, "default.css");
        var style = $('<link rel="stylesheet" type="text/css" />');
        $(document.head).prepend(style);
        $(style).attr('href', styleUrl);
    }
    
    function attachHighlighter(){        
        $(EditorManager).on("activeEditorChange", function(e, activeEditor, prevEditor){              
            setEditorHighlighted(activeEditor, true);
            setEditorHighlighted(prevEditor, false);
        });
    }
    
    function setEditorHighlighted(editor, enabled){
        if (!editor) {
            return;
        }
        
        // TODO: Direct access to _codeMirror is deprecated, needs to set option via editor.
        var codeMirror = editor._codeMirror;
        codeMirror.setOption("highlightSelectionMatches", (isEnabled && enabled) ? {showToken:true}: false);
    }
     
    function toggleHighlighter(){
        var editor = EditorManager.getActiveEditor();
        
        isEnabled = !isEnabled;
        prefs.set("enabled", isEnabled);
        prefs.save();
        
        setEditorHighlighted(editor, true);
        this.setChecked(isEnabled);
    }
    
    function registerCommand(){
        var CommandManager  = brackets.getModule("command/CommandManager");
        var command = CommandManager.register("Highlight Selection", COMMAND_ID, toggleHighlighter);
        command.setChecked(isEnabled);
    
        var menu = Menus.getMenu(Menus.AppMenuBar.VIEW_MENU);
        menu.addMenuItem(Menus.DIVIDER);
        menu.addMenuItem(COMMAND_ID);
    }
    
    appendDefaultStyle();
    attachHighlighter();
    registerCommand();
});