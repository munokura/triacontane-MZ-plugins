/*=============================================================================
 MessageBetweenLines.js
----------------------------------------------------------------------------
 (C)2022 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2022/08/24 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/MessageRowBetween.js
@plugindesc Message Line Spacing Plugin
@author Triacontane
@license MIT License

@help
English Help Translator: munokura
Please check the URL below for the latest version of the plugin.
URL https://triacontane.blogspot.com
-----

MessageBetweenLines.js

Adjusts the line spacing and window height in the message window.

This plugin requires the base plugin "PluginCommonBase.js."
"PluginCommonBase.js" is located in the following folder under the RPG Maker
MZ installation folder:

dlc/BasicResources/plugins/official

Terms of Use:
You may modify and redistribute this plugin without permission from the
author, and there are no restrictions on its use (commercial, R18+, etc.).
This plugin is now yours.

@param AddBetweenLines
@text Additional line spacing pixels
@desc The line spacing of your message will be increased by the number of pixels you specify.
@type number
@default 0
@min -100

@param AddHeight
@text Additional height
@desc The window height will increase by the specified number of pixels.
@type number
@default 0
@min -1000
*/

/*:ja
@plugindesc メッセージの行間設定プラグイン
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/MessageRowBetween.js
@base PluginCommonBase
@orderAfter PluginCommonBase
@author トリアコンタン

@param AddBetweenLines
@text 追加行間ピクセル
@desc 指定したピクセル数だけメッセージの行間が大きくなります。
@default 0
@type number
@min -100

@param AddHeight
@text 追加高さ
@desc 指定したピクセル数だけウィンドウ高さが大きくなります。
@default 0
@type number
@min -1000

@help MessageBetweenLines.js

メッセージウィンドウにおける行間とウィンドウ自体の高さを調整します。

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

    const _Window_Base_processNewLine = Window_Base.prototype.processNewLine;
    Window_Base.prototype.processNewLine = function(textState) {
        _Window_Base_processNewLine.apply(this, arguments);
        if (this instanceof Window_Message) {
            textState.y += param.AddBetweenLines || 0;
        }
    };

    const _Scene_Message_messageWindowRect = Scene_Message.prototype.messageWindowRect;
    Scene_Message.prototype.messageWindowRect = function() {
        const rect = _Scene_Message_messageWindowRect.apply(this, arguments);
        rect.height += param.AddHeight || 0;
        return rect;
    };
})();