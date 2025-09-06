/*=============================================================================
 EventTouchHere.js
----------------------------------------------------------------------------
 (C)2024 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2024/04/15 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/EventTouchHere.js
@plugindesc Instant touch event plugin
@author Triacontane
@license MIT License

@help
English Help Translator: munokura
Please check the URL below for the latest version of the plugin.
URL https://triacontane.blogspot.com
-----

EventTouchHere.js

Events triggered by "contact from player" or "contact from event" and with a
priority of "below normal characters" can now be triggered by pressing the
Confirm button.

Terms of Use:
You may modify and redistribute this plugin without permission, and there are
no restrictions on its use (commercial, 18+, etc.).
This plugin is now yours.
*/

/*:ja
@plugindesc 接触イベントのその場起動プラグイン
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/EventTouchHere.js
@author トリアコンタン

@help EventTouchHere.js

トリガーが『プレイヤーからの接触』『イベントから接触』かつ
プライオリティが『通常キャラの下』のイベントが決定ボタンで
起動するようになります。

利用規約：
 作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 についても制限はありません。
 このプラグインはもうあなたのものです。
*/

(() => {
    'use strict';

    const _Game_Player_checkEventTriggerHere = Game_Player.prototype.checkEventTriggerHere;
    Game_Player.prototype.checkEventTriggerHere = function(triggers) {
        if (triggers.length === 1 && triggers[0] === 0) {
            triggers.push(1, 2);
        }
        _Game_Player_checkEventTriggerHere.apply(this, arguments);
    };
})();