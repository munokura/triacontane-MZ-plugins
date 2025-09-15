/*=============================================================================
 BugFixEquipItemCursor.js
----------------------------------------------------------------------------
 (C)2024 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.1 2024/10/11 コアスクリプトの修正を確認したのでヘルプに追記
 1.0.0 2024/04/23 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/BugFixEquipItemCursor.js
@plugindesc Cursor bug fix patch for equipment item window
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

BugFixEquipItemCursor.js

This issue has been fixed in Core Script v1.8.1.

Fixes an issue where the scroll position of the equipment item window would
not return to its original position if you scrolled the equipment item window
on the equipment screen, then returned to the slot window and selected the
same slot again.

Terms of Use:
You may modify and redistribute this plugin without permission from the
author, and there are no restrictions on its use (commercial, 18+, etc.).
This plugin is now yours.
*/

/*:ja
@plugindesc 装備アイテムウィンドウのカーソルバグ修正パッチ
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/BugFixEquipItemCursor.js
@author トリアコンタン

@help BugFixEquipItemCursor.js

※本現象はコアスクリプトv1.8.1で修正されました。※
装備画面で装備アイテムウィンドウをスクロールさせたあとでスロットウィンドウに
戻り再度、同じスロットを選択すると、装備アイテムウィンドウのスクロール位置が
元に戻らない問題を修正します。

利用規約：
 作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 についても制限はありません。
 このプラグインはもうあなたのものです。
*/

(() => {
    'use strict';

    const _Scene_Equip_onSlotOk = Scene_Equip.prototype.onSlotOk;
    Scene_Equip.prototype.onSlotOk = function() {
        _Scene_Equip_onSlotOk.apply(this, arguments);
        this._itemWindow.setTopRow(0);
    };
})();