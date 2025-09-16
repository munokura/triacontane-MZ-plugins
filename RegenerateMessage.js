/*=============================================================================
 RegenerateMessage.js
----------------------------------------------------------------------------
 (C)2025 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2025/08/02 初版
----------------------------------------------------------------------------
 [X]      : https://x.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/RegenerateMessage.js
@plugindesc Play Message Plugin
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

RegenerateMessage.js

Displays a message when HP or MP changes during battle due to the regeneration
rate of a trait.
Messages can be set separately for damage and recovery, but cannot be set for
individual states.

This plugin requires the base plugin "PluginCommonBase.js."
"PluginCommonBase.js" is located in the following folder under the RPG Maker
MZ installation folder:
dlc/BasicResources/plugins/official

Terms of Use:
You may modify and redistribute this plugin without permission, and there are
no restrictions on its use (commercial, 18+, etc.).
This plugin is now yours.

@param hpDamageMessage
@text HP damage message
@desc This message appears when HP is reduced due to the regeneration rate setting. %1 is the target's name, and %2 is the damage value.
@type string
@default %1のHPが %2 減少した！

@param mpDamageMessage
@text MP Damage Message
@desc This message appears when MP is reduced due to the regeneration rate setting. %1 is the target's name, and %2 is the damage value.
@type string
@default %1のMPが %2 減少した！

@param tpDamageMessage
@text TP Damage Message
@desc This message appears when TP is reduced due to the regeneration rate setting. %1 is the target's name, and %2 is the damage value.
@default %1のTPが %2 減少した！

@param hpRecoverMessage
@text HP recovery message
@desc This message appears when HP is recovered according to the regeneration rate setting. %1 is the target's name, and %2 is the amount recovered.
@type string
@default %1のHPが %2 回復した！

@param mpRecoverMessage
@text MP recovery message
@desc This message appears when MP is recovered due to the regeneration rate setting. %1 is the target's name, and %2 is the amount recovered.
@type string
@default %1のMPが %2 回復した！

@param tpRecoverMessage
@text TP recovery message
@desc This message appears when TP is recovered due to the regeneration rate setting. %1 is the target's name, and %2 is the amount recovered.
@type string
@default %1のTPが %2 回復した！
*/

/*:ja
@plugindesc 再生メッセージプラグイン
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/RegenerateMessage.js
@base PluginCommonBase
@orderAfter PluginCommonBase
@author トリアコンタン

@param hpDamageMessage
@text HPダメージメッセージ
@desc 再生率の設定によりHPが減少したときのメッセージです。%1で対象の名前、%2でダメージ値になります。
@default %1のHPが %2 減少した！
@type string

@param mpDamageMessage
@text MPダメージメッセージ
@desc 再生率の設定によりMPが減少したときのメッセージです。%1で対象の名前、%2でダメージ値になります。
@default %1のMPが %2 減少した！
@type string

@param tpDamageMessage
@text TPダメージメッセージ
@desc 再生率の設定によりTPが減少したときのメッセージです。%1で対象の名前、%2でダメージ値になります。
@default %1のTPが %2 減少した！

@param hpRecoverMessage
@text HP回復メッセージ
@desc 再生率の設定によりHPが回復したときのメッセージです。%1で対象の名前、%2で回復値になります。
@default %1のHPが %2 回復した！
@type string

@param mpRecoverMessage
@text MP回復メッセージ
@desc 再生率の設定によりMPが回復したときのメッセージです。%1で対象の名前、%2で回復値になります。
@default %1のMPが %2 回復した！
@type string

@param tpRecoverMessage
@text TP回復メッセージ
@desc 再生率の設定によりTPが回復したときのメッセージです。%1で対象の名前、%2で回復値になります。
@default %1のTPが %2 回復した！
@type string

@help RegenerateMessage.js

戦闘中に特徴の再生率によってHPやMPが変動したときメッセージを表示します。
メッセージはダメージと回復で分けて設定できますが、ステートごとなどの設定は
できません。

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

    const _Game_Battler_regenerateTp = Game_Battler.prototype.regenerateTp;
    Game_Battler.prototype.regenerateTp = function() {
        this._invalidateSlientTp = true;
        _Game_Battler_regenerateTp.apply(this, arguments);
        this._invalidateSlientTp = false;
    };

    const _Game_Battler_gainSilentHp = Game_Battler.prototype.gainSilentTp;
    Game_Battler.prototype.gainSilentTp = function(value) {
        if (this._invalidateSlientTp) {
            this._result.tpDamage = -value;
        }
        _Game_Battler_gainSilentHp.apply(this, arguments);
    };

    const _Window_BattleLog_displayRegeneration = Window_BattleLog.prototype.displayRegeneration;
    Window_BattleLog.prototype.displayRegeneration = function(subject) {
        _Window_BattleLog_displayRegeneration.apply(this, arguments);
        if (subject.isAlive()) {
            this.displayRegenerationMessage(subject);
        }
    };

    Window_BattleLog.prototype.displayRegenerationMessage = function(target) {
        const result = target.result();
        let format = result.hpDamage > 0 ? param.hpDamageMessage : param.hpRecoverMessage;
        this.pushRegenerationMessage(format, target, result.hpDamage);
        format = result.mpDamage > 0 ? param.mpDamageMessage : param.mpRecoverMessage;
        this.pushRegenerationMessage(format, target, result.mpDamage);
        format = result.tpDamage > 0 ? param.tpDamageMessage : param.tpRecoverMessage;
        this.pushRegenerationMessage(format, target, result.tpDamage);
    };

    Window_BattleLog.prototype.pushRegenerationMessage = function(format, target, value) {
        if (!format || value === 0) {
            return;
        }
        this.push("addText", format.format(target.name(), Math.abs(value)));
        this.push("wait");
        this.push("clear");
    };
})();