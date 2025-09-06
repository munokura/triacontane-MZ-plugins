/*=============================================================================
 ShopWelcome.js
----------------------------------------------------------------------------
 (C)2024 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.1 2024/06/05 優先順について追記
 1.0.0 2024/04/18 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/ShopWelcome.js
@plugindesc Visitor Message Plugin
@author Triacontane
@license MIT License

@help
English Help Translator: munokura
Please check the URL below for the latest version of the plugin.
URL https://triacontane.blogspot.com
-----

ShopWelcome.js

Displays a welcome message on the shop screen.
The message appears in the help window when selecting "Buy" or "Sell."

This plugin requires the base plugin "PluginCommonBase.js."
"PluginCommonBase.js" is located in the following folder under the RPG Maker
MZ installation folder:

dlc/BasicResources/plugins/official

Terms of Use:
You may modify and redistribute this plugin without permission, and there are
no restrictions on its use (commercial, 18+, etc.).
This plugin is now yours.

@param messageList
@text Message List
@desc This is a list of messages displayed on the shop screen. If you want to send different messages based on switch conditions, register multiple messages. (The top of the list takes priority.)
@type struct<Message>[]
@default []
*/

/*~struct~Message:
@param messageText
@text Message text
@desc This is the message displayed on the shop screen.
@type multiline_string

@param switchId
@text Valid Switch ID
@desc The message will only be displayed when the specified switch is ON.
@type switch
@default 0

@param commandIndex
@text Target command
@desc The command for which the message is to be displayed. If specified, the message will only be displayed when the cursor is on the command.
@type select
@default -1
@option none
@value -1
@option purchase
@value 0
@option sale
@value 1
@option stop
@value 2
*/

/*:ja
@plugindesc 来店メッセージプラグイン
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/ShopWelcome.js
@base PluginCommonBase
@orderAfter PluginCommonBase
@author トリアコンタン

@param messageList
@text メッセージリスト
@desc ショップ画面で表示される来店メッセージのリストです。スイッチ条件で出し分けたいときは複数件登録します。（リストの上が優先）
@default []
@type struct<Message>[]

@help ShopWelcome.js

ショップ画面で来店メッセージを表示します。
メッセージは『購入』『売却』選択時にヘルプウィンドウに表示されます。

このプラグインの利用にはベースプラグイン『PluginCommonBase.js』が必要です。
『PluginCommonBase.js』は、RPGツクールMZのインストールフォルダ配下の
以下のフォルダに格納されています。
dlc/BasicResources/plugins/official

利用規約：
 作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 についても制限はありません。
 このプラグインはもうあなたのものです。
*/

/*~struct~Message:ja
@param messageText
@text メッセージテキスト
@desc ショップ画面で表示される来店メッセージです。
@default
@type multiline_string

@param switchId
@text 有効スイッチID
@desc 指定したスイッチがONのときのみメッセージが表示されます。
@default 0
@type switch

@param commandIndex
@text 対象コマンド
@desc メッセージが表示される対象のコマンドです。指定するとカーソルが対象コマンドにあるときだけ表示されます。
@default -1
@type select
@option なし
@value -1
@option 購入
@value 0
@option 売却
@value 1
@option やめる
@value 2
*/

(() => {
    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);

    const _Scene_Shop_initialize = Scene_Shop.prototype.createCommandWindow;
    Scene_Shop.prototype.createCommandWindow = function() {
        _Scene_Shop_initialize.apply(this, arguments);
        this._commandWindow.setHelpWindow(this._helpWindow);
    };

    const _Scene_Shop_create = Scene_Shop.prototype.create;
    Scene_Shop.prototype.create = function() {
        _Scene_Shop_create.apply(this, arguments);
        this._commandWindow.callUpdateHelp();
    };

    const _Scene_Shop_onBuyCancel = Scene_Shop.prototype.onBuyCancel;
    Scene_Shop.prototype.onBuyCancel = function() {
        _Scene_Shop_onBuyCancel.apply(this, arguments);
        this._commandWindow.callUpdateHelp();
    };

    const _Scene_Shop_onSellCancel = Scene_Shop.prototype.onSellCancel;
    Scene_Shop.prototype.onSellCancel = function() {
        _Scene_Shop_onSellCancel.apply(this, arguments);
        this._commandWindow.callUpdateHelp();
    };

    const _Window_ShopCommand_updateHelp = Window_ShopCommand.prototype.updateHelp;
    Window_ShopCommand.prototype.updateHelp = function() {
        _Window_ShopCommand_updateHelp.apply(this, arguments);
        const message = this.findHelpMessage();
        if (message) {
            this._helpWindow.setText(message.messageText);
        }
    };

    Window_ShopCommand.prototype.findHelpMessage = function() {
        return param.messageList.find(message => {
            if (message.switchId > 0 && !$gameSwitches.value(message.switchId)) {
                return false;
            }
            return [this._index, -1].includes(message.commandIndex);
        });
    };
})();