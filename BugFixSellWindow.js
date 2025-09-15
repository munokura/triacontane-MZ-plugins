/*=============================================================================
 BugFixSellWindow.js
----------------------------------------------------------------------------
 (C)2024 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2024/10/11 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/BugFixSellWindow.js
@plugindesc Bug fix plugin for sale list window
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

BugFixSellWindow.js

Fixes several bugs in the sell list window on the shop screen.
This issue occurs when the sell list window scrolls.
- When limiting item categories to one, the last item in the sell list is not
rendered.
- When scrolling the sell list, canceling, and then attempting to sell again,
the scroll position does not return to its original position.

Terms of Use:
You may modify and redistribute this plugin without permission from the
author, and there are no restrictions on its use (commercial, 18+, etc.).
This plugin is now yours.
*/

/*:ja
@plugindesc 売却リストウィンドウのバグ修正プラグイン
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/BugFixSellWindow.js
@author トリアコンタン

@help BugFixSellWindow.js

ショップ画面の売却リストウィンドウにおける複数のバグを修正します。
本現象は売却リストウィンドウがスクロールする条件下で発生します。
・アイテムカテゴリをひとつに限定したとき、売却リストの最後の項目が描画されない
・売却リストをスクロールしてからキャンセルして再度、売却しようとすると
 スクロール位置が元に戻らない

利用規約：
 作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 についても制限はありません。
 このプラグインはもうあなたのものです。
*/

(() => {
    'use strict';

    const _Scene_Shop_createSellWindow = Scene_Shop.prototype.createSellWindow;
    Scene_Shop.prototype.createSellWindow = function() {
        _Scene_Shop_createSellWindow.apply(this, arguments);
        if (!this._categoryWindow.needsSelection()) {
            this._sellWindow.createContents();
        }
    };

    const _Scene_Shop_onCategoryOk = Scene_Shop.prototype.onCategoryOk;
    Scene_Shop.prototype.onCategoryOk = function() {
        _Scene_Shop_onCategoryOk.apply(this, arguments);
        this._sellWindow.setTopRow(0);
    };
})();