/*=============================================================================
 TimerExpireCustomize.js
----------------------------------------------------------------------------
 (C)2022 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2022/09/12 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/TimerExpireCustomize.js
@plugindesc Timer expiration customization plugin
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

TimerExpireCustomize.js

Changes the timer's settings when it expires.

- Prevents battle interruptions.
- Turns on any switch.

This plugin requires the base plugin "PluginCommonBase.js."
"PluginCommonBase.js" is located in the following folder under the RPG Maker
MZ installation folder:

dlc/BasicResources/plugins/official

Terms of Use:
You may modify and redistribute this plugin without permission, and there are
no restrictions on its use (commercial, 18+, etc.).
This plugin is now yours.

@param noAbortSwitch
@text Do not interrupt the battle
@desc When the specified switch is ON, the battle will not be interrupted even if the time runs out during battle.
@type switch
@default 0

@param triggerSwitch
@text Trigger switch
@desc When the time runs out, the specified switch will automatically turn ON.
@type switch
@default 0
*/

/*:ja
@plugindesc タイマー時間切れカスタマイズプラグイン
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/TimerExpireCustomize.js
@base PluginCommonBase
@orderAfter PluginCommonBase
@author トリアコンタン

@param noAbortSwitch
@text 戦闘中断しない
@desc 指定したスイッチがONのとき、戦闘中に時間切れになっても戦闘が中断されなくなります。
@default 0
@type switch

@param triggerSwitch
@text トリガースイッチ
@desc 時間切れになったとき、指定したスイッチが自動でONになります。
@default 0
@type switch

@help TimerExpireCustomize.js

タイマーが時間切れになったときに仕様を変更します。
・戦闘を中断させなくする
・任意のスイッチをONにする

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

    const _Game_Timer_onExpire = Game_Timer.prototype.onExpire;
    Game_Timer.prototype.onExpire = function() {
        if ($gameSwitches.value(param.noAbortSwitch)) {
            BattleManager.abortInvalid = true;
        }
        _Game_Timer_onExpire.apply(this, arguments);
        if (param.triggerSwitch) {
            $gameSwitches.setValue(param.triggerSwitch, true);
        }
    };

    BattleManager.abortInvalid = false;
    const _BattleManager_abort = BattleManager.abort;
    BattleManager.abort = function() {
        if (this.abortInvalid) {
            this.abortInvalid = false;
            return;
        }
        _BattleManager_abort.apply(this, arguments);
    };
})();