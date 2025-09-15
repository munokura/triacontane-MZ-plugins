/*=============================================================================
 EquipRemoveUi.js
----------------------------------------------------------------------------
 (C)2024 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2024/01/16 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/EquipRemoveUi.js
@plugindesc Unequip UI adjustment plugin
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

EquipRemoveUi.js

Adjusts the UI and display content for the command to remove equipment in the
Equipment screen.
You can move the display position to the top and display the command name.

This plugin requires the base plugin "PluginCommonBase.js."
"PluginCommonBase.js" is located in the following folder under the RPG Maker
MZ installation folder:
dlc/BasicResources/plugins/official

Terms of Use:
You may modify and redistribute this plugin without permission, and there are
no restrictions on its use (commercial, R18+, etc.).
This plugin is now yours.

@param removeText
@text Release text
@desc The text to display for the unequip command.
@type string

@param removeDesc
@text Cancellation Instructions
@desc Help text to display for the unequip command.
@type multiline_string

@param commandTop
@text Cancel command placed at the beginning
@desc Place the unequip command at the beginning instead of the end.
@type boolean
@default false
*/

/*:ja
@plugindesc 装備解除UI調整プラグイン
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/EquipRemoveUi.js
@base PluginCommonBase
@orderAfter PluginCommonBase
@author トリアコンタン

@param removeText
@text 解除テキスト
@desc 装備解除するコマンドに表示するテキストです。
@default
@type string

@param removeDesc
@text 解除説明
@desc 装備解除するコマンドに表示するヘルプに表示するテキストです。
@default
@type multiline_string

@param commandTop
@text 解除コマンド先頭配置
@desc 装備解除コマンドを末尾ではなく先頭に配置します。
@default false
@type boolean

@help EquipRemoveUi.js

装備画面で装備を外すコマンドのUIや表示内容を調整します。
表示位置を先頭に移したり、コマンド名を表示したりできます。

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

    const _Window_ItemList_makeItemList = Window_ItemList.prototype.makeItemList;
    Window_ItemList.prototype.makeItemList = function() {
        _Window_ItemList_makeItemList.apply(this, arguments);
        if (this.isEquipItem() && param.commandTop) {
            this._data.pop();
            this._data.unshift(null);
        }
    };

    const _Window_ItemList_drawItem = Window_ItemList.prototype.drawItem;
    Window_ItemList.prototype.drawItem = function(index) {
        _Window_ItemList_drawItem.apply(this, arguments);
        const item = this.itemAt(index);
        if (!item && this.isEquipItem() && param.removeText) {
            const rect = this.itemLineRect(index);
            this.drawTextEx(param.removeText, rect.x, rect.y, rect.width);
        }
    };

    const _Window_ItemList_updateHelp = Window_ItemList.prototype.updateHelp;
    Window_ItemList.prototype.updateHelp = function() {
        _Window_ItemList_updateHelp.apply(this, arguments);
        if (this.isEquipItem() && !this.item() && param.removeDesc) {
            this._helpWindow.setText(param.removeDesc);
        }
    };

    Window_ItemList.prototype.isEquipItem = function() {
        return false;
    };

    Window_EquipItem.prototype.isEquipItem = function() {
        return true;
    };
})();