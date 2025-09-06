/*=============================================================================
 FixWindowPageUp.js
----------------------------------------------------------------------------
 (C)2023 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.1.1 2023/07/01 1.1.0でウィンドウが1ページに収まっているかどうかの判定が誤っていた問題を修正
 1.1.0 2023/07/01 ページダウンボタンを押したときにウィンドウが1ページに収まっていてもカーソルが一番下まで移動するよう修正
 1.0.0 2023/06/29 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/FixWindowPageUp.js
@plugindesc Window page up behavior correction plugin
@author Triacontane
@license MIT License

@help
English Help Translator: munokura
Please check the URL below for the latest version of the plugin.
URL https://triacontane.blogspot.com
-----

FixWindowPageUp.js

Pressing the page up button in a window will move the cursor to the top.
Pressing the page down button will also move the cursor to the bottom, even if
the window is only one page.

Terms of Use:
You may modify and redistribute this plugin without permission, and there are
no restrictions on its use (commercial, 18+, etc.).
This plugin is now yours.
*/

/*:ja
@plugindesc ウィンドウのページアップ挙動修正プラグイン
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/FixWindowPageUp.js
@author トリアコンタン

@help FixWindowPageUp.js

ウィンドウでページアップボタンを押したときにカーソルが一番上まで
移動するようになります。
また、ページダウンボタンを押したときにウィンドウが1ページに収まっていても
カーソルが一番下まで移動するようになります。

利用規約：
 作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 についても制限はありません。
 このプラグインはもうあなたのものです。
*/

(() => {
    'use strict';

    const _Window_Selectable_cursorPageup = Window_Selectable.prototype.cursorPageup;
    Window_Selectable.prototype.cursorPageup = function() {
        _Window_Selectable_cursorPageup.apply(this, arguments);
        if (this.topRow() === 0) {
            this.smoothScrollUp(this.maxPageRows());
            this.select(0);
        }
    };

    const _Window_Selectable_cursorPagedown = Window_Selectable.prototype.cursorPagedown;
    Window_Selectable.prototype.cursorPagedown = function() {
        _Window_Selectable_cursorPagedown.apply(this, arguments);
        if (this.topRow() === this.maxTopRow()) {
            const index = this.index();
            const maxItems = this.maxItems();
            this.select(Math.min(index + this.maxPageItems(), maxItems - 1));
        }
    };
})();