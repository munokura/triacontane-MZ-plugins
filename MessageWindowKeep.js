/*=============================================================================
 MessageWindowKeep.js
----------------------------------------------------------------------------
 (C)2022 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2022/01/18 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/MessageWindowKeep.js
@plugindesc Message Window Persistence Plugin
@author Triacontane
@license MIT License

@help
English Help Translator: munokura
This is an unofficial English translation of the plugin help,
created to support global RPG Maker users.
Original plugin by Triacontane.
Please check the latest official version at:
https://triacontane.blogspot.com
-----

MessageWindowKeep.js

Keeps the message window open while the specified switch is ON.
It closes when the switch is OFF.
It also closes when the menu screen is opened or closed, so it's generally
controlled during events.

This plugin requires the base plugin "PluginCommonBase.js."
"PluginCommonBase.js" is located in the following folder under the RPG Maker
MZ installation folder:

dlc/BasicResources/plugins/official

Terms of Use:
You may modify and redistribute this plugin without permission, and there are
no restrictions on its use (commercial, 18+, etc.).
This plugin is now yours.

@param keepSwitch
@text Maintain Switch Number
@desc The message window will remain open while the specified switch is ON.
@type switch
@default 1
*/

/*:ja
@plugindesc メッセージウィンドウの維持プラグイン
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/MessageWindowKeep.js
@base PluginCommonBase
@orderAfter PluginCommonBase
@author トリアコンタン

@param keepSwitch
@text 維持スイッチ番号
@desc 指定したスイッチがONのあいだ、メッセージウィンドウを閉じずに残します。
@default 1
@type switch

@help MessageWindowKeep.js

指定したスイッチがONのあいだ、メッセージウィンドウを閉じずに残します。
スイッチがOFFになると閉じられます。
その他、メニュー画面の開閉でも閉じるので基本的にはイベント中に制御します。

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

    const _Window_Message_checkToNotClose = Window_Message.prototype.checkToNotClose;
    Window_Message.prototype.checkToNotClose = function() {
        _Window_Message_checkToNotClose.apply(this, arguments);
        if (!this.doesContinue() && this.isOpen()) {
            this.close();
        }
    };

    const _Window_Message_doesContinue = Window_Message.prototype.doesContinue;
    Window_Message.prototype.doesContinue = function() {
        const result = _Window_Message_doesContinue.apply(this, arguments);
        return result || $gameSwitches.value(param.keepSwitch);
    };
})();