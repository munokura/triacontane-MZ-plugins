/*=============================================================================
 HiddenItemNumberShow.js
----------------------------------------------------------------------------
 (C)2022 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2022/07/24 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/HiddenItemNumberShow.js
@plugindesc Hidden item count display plugin
@author Triacontane
@license MIT License

@help
English Help Translator: munokura
This is an unofficial English translation of the plugin help,
created to support global RPG Maker users.
Feedback is welcome to improve translation quality
(see: https://github.com/munokura/triacontane-MZ-plugins ).
Original plugin by Triacontane.
Please check the latest official version at:
https://triacontane.blogspot.com
-----

HiddenItemNumberShow.js

Modifies the "Item Selection" event command to display the number of hidden
items.

Terms of Use:
You may modify and redistribute this plugin without permission, and there are
no restrictions on its use (commercial, 18+, etc.).
This plugin is now yours.
*/

/*:ja
@plugindesc 隠しアイテムの個数表示プラグイン
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/HiddenItemNumberShow.js
@author トリアコンタン

@help HiddenItemNumberShow.js

イベントコマンド『アイテム選択の処理』で
隠しアイテムの個数を表示するよう仕様変更します。

利用規約：
 作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 についても制限はありません。
 このプラグインはもうあなたのものです。
*/

(() => {
    'use strict';

    const _Window_EventItem_needsNumber = Window_EventItem.prototype.needsNumber;
    Window_EventItem.prototype.needsNumber = function() {
        const result = _Window_EventItem_needsNumber.apply(this, arguments);
        const itypeId = $gameMessage.itemChoiceItypeId();
        if (itypeId >= 3) {
            return true;
        } else {
            return result;
        }
    };
})();