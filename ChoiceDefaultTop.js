/*=============================================================================
 ChoiceDefaultTop.js
----------------------------------------------------------------------------
 (C)2024 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2024/12/17 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/ChoiceDefaultTop.js
@plugindesc Fixed plugin for initial display of options
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

ChoiceDefaultTop.js

If the default option for displaying choices is set to "None,"
this fixes the cursor position to the beginning after directional button
input.
(By default, pressing the Up button selects the end.)

Terms of Use:
You may modify and redistribute this plugin without permission, and there are
no restrictions on its use (commercial, R18+, etc.).
This plugin is now yours.
*/

/*:ja
@plugindesc 選択肢の初期表示の先頭固定プラグイン
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/ChoiceDefaultTop.js
@author トリアコンタン

@help ChoiceDefaultTop.js

選択肢の表示でデフォルトを「なし」にした場合に
方向ボタン入力後のカーソル位置を先頭に固定します。
（デフォルト動作では上ボタンを押すと末尾が選択されます）

利用規約：
 作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 についても制限はありません。
 このプラグインはもうあなたのものです。
*/

(() => {
    'use strict';

    const _Window_ChoiceList_select = Window_ChoiceList.prototype.select;
    Window_ChoiceList.prototype.select = function(index) {
        if (this.index() === -1 && index >= 0) {
            arguments[0] = 0;
        }
        _Window_ChoiceList_select.apply(this, arguments);
    };
})();