/*=============================================================================
 NameBoxNoUse.js
----------------------------------------------------------------------------
 (C)2023 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.1.1 2023/12/18 名前表示時のみ字下げ機能が有効になるよう修正
 1.1.0 2023/12/10 メッセージの字下げをする機能を追加しました。
 1.0.0 2023/07/20 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/NameBoxNoUse.js
@plugindesc Name window not used plug-in
@author Triacontane
@license MIT License

@help
English Help Translator: munokura
Please check the URL below for the latest version of the plugin.
URL https://triacontane.blogspot.com
-----

NameBoxNoUse.js

Displays the specified name at the top of the message window without using the
name window.
You can also change the name display format.

This plugin requires the base plugin "PluginCommonBase.js."
"PluginCommonBase.js" is located in the following folder under the RPG Maker
MZ installation folder:

dlc/BasicResources/plugins/official

Terms of Use:
You may modify and redistribute this plugin without permission, and there are
no restrictions on its use (commercial, 18+, etc.).
This plugin is now yours.

@param speakerFormat
@text Name Display Format
@desc The display format for the name, where %1 is replaced with the actual name.
@type string
@default \c[2]【%1】\c[0]

@param wrap
@text Turn around
@desc After displaying the name format, a new line is displayed followed by the actual text.
@type boolean
@default true

@param messageOffsetX
@text X coordinate offset
@desc The X offset for the second and subsequent lines of the message. Indented only if name display is enabled.
@type number
@default 0
*/

/*:ja
@plugindesc 名前ウィンドウ不使用プラグイン
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/NameBoxNoUse.js
@base PluginCommonBase
@orderAfter PluginCommonBase
@author トリアコンタン

@param speakerFormat
@text 名前表示フォーマット
@desc 名前の表示フォーマットです。%1が実際の名前に置き換わります。
@default \c[2]【%1】\c[0]
@type string

@param wrap
@text 折り返し
@desc 名前フォーマットを表示したあと改行してから本来のテキストを表示します。
@default true
@type boolean

@param messageOffsetX
@text X座標オフセット
@desc 2行目以降のメッセージのX座標オフセットです。名前表示が有効の場合のみ字下げされます。
@default 0
@type number

@help NameBoxNoUse.js

名前ウィンドウを使用せず、メッセージウィンドウの先頭に指定した名前を表示します。
また、名前の表示フォーマットを変更できます。

このプラグインの利用にはベースプラグイン『PluginCommonBase.js』が必要です。
『PluginCommonBase.js』は、RPGツクールMZのインストールフォルダ配下の
以下のフォルダに格納されています。
dlc/BasicResources/plugins/official

利用規約：
 作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 についても制限はありません。
 このプラグインはもうあなたのものです。
*/

(() => {
    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);

    const _Window_Message_synchronizeNameBox = Window_Message.prototype.synchronizeNameBox;
    Window_Message.prototype.synchronizeNameBox = function() {
        _Window_Message_synchronizeNameBox.apply(this, arguments);
        this._nameBoxWindow.hide();
    };

    const _Window_Message_processNewLine = Window_Message.prototype.processNewLine;
    Window_Message.prototype.processNewLine = function(textState) {
        _Window_Message_processNewLine.apply(this, arguments);
        if (!!$gameMessage.speakerName() && !this.needsNewPage(textState)) {
            textState.x += param.messageOffsetX;
        }
    }

    const _Game_Message_allText = Game_Message.prototype.allText;
    Game_Message.prototype.allText = function() {
        const text = _Game_Message_allText.apply(this, arguments);
        const speakerName = this.speakerName();
        if (speakerName) {
            const speakerText = param.speakerFormat ? param.speakerFormat.format(speakerName) : speakerName;
            return speakerText + (param.wrap ? '\n' : '') + text;
        } else {
            return text;
        }
    };
})();