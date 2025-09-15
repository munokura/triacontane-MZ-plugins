/*=============================================================================
 ItemSellableCategory.js
----------------------------------------------------------------------------
 (C)2024 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2024/03/04 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/ItemSellableCategory.js
@plugindesc Salable Item Categories Plugin
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

ItemSellableCategory.js

This plugin separates the content displayed in the category window on the item
screen from the content displayed in the category window on the shop screen.

You can set whether items can be sold for each category, regardless of the
categories displayed on the item screen.

This plugin requires the base plugin "PluginCommonBase.js."
"PluginCommonBase.js" is located in the following folder under the RPG Maker
MZ installation folder:

dlc/BasicResources/plugins/official

Terms of Use:
You may modify and redistribute this plugin without permission, and there are
no restrictions on its use (commercial, 18+, etc.).
This plugin is now yours.

@param item
@text item
@desc If enabled, the item will be available for sale.
@type boolean
@default true

@param weapon
@text weapon
@desc If enabled, the weapon will be available for sale.
@type boolean
@default true

@param armor
@text Armor
@desc If enabled, the armor will be available for sale.
@type boolean
@default true

@param keyItem
@text Important things
@desc If enabled, your valuable items will be available for sale.
@type boolean
@default true
*/

/*:ja
@plugindesc 売却可能アイテムカテゴリプラグイン
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/ItemSellableCategory.js
@base PluginCommonBase
@orderAfter PluginCommonBase
@author トリアコンタン

@param item
@text アイテム
@desc 有効にした場合、アイテムが売却可能になります。
@default true
@type boolean

@param weapon
@text 武器
@desc 有効にした場合、武器が売却可能になります。
@default true
@type boolean

@param armor
@text 防具
@desc 有効にした場合、防具が売却可能になります。
@default true
@type boolean

@param keyItem
@text 大事なもの
@desc 有効にした場合、大事なものが売却可能になります。
@default true
@type boolean

@help ItemSellableCategory.js

アイテム画面でのカテゴリウィンドウの表示内容と
ショップ画面でのカテゴリウィンドウの表示内容とを分けられます。

アイテム画面での表示カテゴリとは無関係にカテゴリごとに
売却可能かどうかの設定ができます。

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


    const _Window_ItemCategory_needsCommand = Window_ItemCategory.prototype.needsCommand;
    Window_ItemCategory.prototype.needsCommand = function(name) {
        if (SceneManager._scene instanceof Scene_Shop) {
            return !!param[name];
        } else {
            return _Window_ItemCategory_needsCommand.apply(this, arguments);
        }
    };
})();