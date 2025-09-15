/*=============================================================================
 TouchActionThere.js
----------------------------------------------------------------------------
 (C)2021 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2021/07/15 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/TouchActionThere.js
@plugindesc Touch-to-move decision trigger plugin
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

TouchActionThere.js

This changes the specifications so that touch movement activates the confirm
button trigger for the preceding event.

This plugin does not have any plugin commands.

Terms of Use:
You may modify and redistribute it without permission from the author, and
there are no restrictions on its use (commercial, 18+, etc.).
This plugin is now yours.
*/

/*:ja
@plugindesc タッチ移動による決定トリガープラグイン
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/TouchActionThere.js
@author トリアコンタン

@help TouchActionThere.js

タッチ移動時に前方のイベントの決定ボタントリガーを作動するよう
仕様変更します。

このプラグインにはプラグインコマンドはありません。

利用規約：
 作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 についても制限はありません。
 このプラグインはもうあなたのものです。
*/

(()=> {
    'use strict';

    const _Game_Player_triggerTouchAction = Game_Player.prototype.triggerTouchAction;
    Game_Player.prototype.triggerTouchAction = function() {
        const result = _Game_Player_triggerTouchAction.apply(this, arguments);
        if ($gameTemp.isDestinationValid() && !result) {
            this.checkEventTriggerThere([0,1,2]);
            if ($gameMap.setupStartingEvent()) {
                return true;
            }
        }
        return result;
    }
})();