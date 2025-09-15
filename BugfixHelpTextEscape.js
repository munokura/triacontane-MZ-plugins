/*=============================================================================
 BugfixHelpTextEscape.js
----------------------------------------------------------------------------
 (C)2023 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2023/07/09 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/BugfixHelpTextEscape.js
@plugindesc Help text control character drawing correction plugin
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

BugfixHelpTextEscape.js

Fixes an issue where the control character "\V[n]" would not render correctly
when the variable was changed after displaying it in the help window.

Terms of Use:
You may modify and redistribute this plugin without permission from the
author, and there are no restrictions on its use (commercial, 18+, etc.).
This plugin is now yours.
*/

/*:ja
@plugindesc ヘルプテキストの制御文字描画修正プラグイン
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/BugfixHelpTextEscape.js
@author トリアコンタン

@help BugfixHelpTextEscape.js

ヘルプウィンドウで制御文字「\V[n]」を表示するとき
一度、表示された後で変数が変更されたときに正しく描画されない問題を修正します。

利用規約：
 作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 についても制限はありません。
 このプラグインはもうあなたのものです。
*/

(() => {
    'use strict';

    const _Window_Help_setText = Window_Help.prototype.setText;
    Window_Help.prototype.setText = function(text) {
        if (this._text === text) {
            this.refresh();
        }
        _Window_Help_setText.apply(this, arguments);
    };
})();