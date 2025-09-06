/*=============================================================================
 FixChoiceListWindowY.js
----------------------------------------------------------------------------
 (C)2020 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.1 2020/10/18 数値入力ウィンドウも同様の仕様に変更
 1.0.0 2020/10/18 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/FixChoiceListWindowY.js
@plugindesc Selection window Y coordinate fixed patch
@author Triacontane
@license MIT License

@help
English Help Translator: munokura
Please check the URL below for the latest version of the plugin.
URL https://triacontane.blogspot.com
-----

FixChoiceListWindowY.js

Fixes the Y coordinate of the choice list window to the value set by the
parameter when the message window is not displayed.

This plugin does not have any plugin commands.

Terms of Use:
You may modify and redistribute it without permission from the author, and
there are no restrictions on its use (commercial, R18+, etc.).
This plugin is now yours.

@param y
@text Y coordinate
@desc The Y coordinate of the selection window when the message window is not displayed (the origin is the center)
@type number
@default 312
*/

/*:ja
@plugindesc 選択肢ウィンドウのY座標固定パッチ
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/FixChoiceListWindowY.js
@author トリアコンタン

@param y
@text Y座標
@desc メッセージウィンドウが表示されていない状態での選択肢ウィンドウのY座標(原点は中央)
@default 312
@type number

@help FixChoiceListWindowY.js

メッセージウィンドウが表示されていない状態での
選択肢ウィンドウのY座標をパラメータで設定した値に固定します。

このプラグインにはプラグインコマンドはありません。

利用規約：
 作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 についても制限はありません。
 このプラグインはもうあなたのものです。
*/

(()=> {
    'use strict';

    const paramY = parseInt(PluginManager.parameters('FixChoiceListWindowY').y);

    const _Window_ChoiceList_updatePlacement = Window_ChoiceList.prototype.updatePlacement;
    Window_ChoiceList.prototype.updatePlacement = function() {
        _Window_ChoiceList_updatePlacement.apply(this, arguments);
        if (this._messageWindow.isClosed()) {
            this.y = paramY - this.height / 2;
        }
    };

    const _Window_NumberInput_updatePlacement = Window_NumberInput.prototype.updatePlacement;
    Window_NumberInput.prototype.updatePlacement = function() {
        _Window_NumberInput_updatePlacement.apply(this, arguments);
        if (this._messageWindow.isClosed()) {
            this.y = paramY - this.height / 2;
        }
    };
})();