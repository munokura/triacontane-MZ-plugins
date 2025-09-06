/*=============================================================================
 RegenerateVariance.js
----------------------------------------------------------------------------
 (C)2023 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2023/08/30 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/RegenerateVariance.js
@plugindesc Playback rate distribution setting plugin
@author Triacontane
@license MIT License

@help
English Help Translator: munokura
Please check the URL below for the latest version of the plugin.
URL https://triacontane.blogspot.com
-----

RegenerateVariance.js

You can set the variance of HP, MP, and TP auto-recovery, as well as damage.
The variance is set between 0 and 100, just like skill variance.

This plugin requires the base plugin "PluginCommonBase.js."
"PluginCommonBase.js" is located in the following folder under the RPG Maker
MZ installation folder:

dlc/BasicResources/plugins/official

Terms of Use:
You may modify and redistribute this plugin without permission, and there are
no restrictions on its use (commercial, 18+, etc.).
This plugin is now yours.

@param hpRegenerateVariance
@text HP recovery rate variance
@desc Sets the HP recovery rate dispersion (0-100).
@type number
@default 0
@min 0
@max 100

@param mpRegenerateVariance
@text MP recovery rate variance
@desc Sets the dispersion of MP recovery rate (0-100).
@type number
@default 0
@min 0
@max 100

@param tpRegenerateVariance
@text Variance of TP recovery rate
@desc Sets the variance of TP recovery rate (0-100).
@type number
@default 0
@min 0
@max 100

@param hpSlipVariance
@text HP reduction rate dispersion
@desc Sets the dispersion of HP reduction rate (0-100).
@type number
@default 0
@min 0
@max 100

@param mpSlipVariance
@text MP reduction rate dispersion
@desc Sets the dispersion of MP reduction rate (0-100).
@type number
@default 0
@min 0
@max 100

@param tpSlipVariance
@text Dispersion of TP reduction rate
@desc Set the variance of TP reduction rate (0-100).
@type number
@default 0
@min 0
@max 100
*/

/*:ja
@plugindesc 再生率の分散度設定プラグイン
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/RegenerateVariance.js
@base PluginCommonBase
@orderAfter PluginCommonBase
@author トリアコンタン

@param hpRegenerateVariance
@text HP回復率の分散度
@desc HP回復率の分散度を設定します。(0-100)
@default 0
@type number
@min 0
@max 100

@param mpRegenerateVariance
@text MP回復率の分散度
@desc MP回復率の分散度を設定します。(0-100)
@default 0
@type number
@min 0
@max 100

@param tpRegenerateVariance
@text TP回復率の分散度
@desc TP回復率の分散度を設定します。(0-100)
@default 0
@type number
@min 0
@max 100

@param hpSlipVariance
@text HP減少率の分散度
@desc HP減少率の分散度を設定します。(0-100)
@default 0
@type number
@min 0
@max 100

@param mpSlipVariance
@text MP減少率の分散度
@desc MP減少率の分散度を設定します。(0-100)
@default 0
@type number
@min 0
@max 100

@param tpSlipVariance
@text TP減少率の分散度
@desc TP減少率の分散度を設定します。(0-100)
@default 0
@type number
@min 0
@max 100

@help RegenerateVariance.js

HPやMP,TPの自動回復、ダメージ量の分散度を設定できます。
分散度はスキルの分散度と同様、0から100の間で設定します。

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

    const _Game_Battler_regenerateHp = Game_Battler.prototype.regenerateHp;
    Game_Battler.prototype.regenerateHp = function() {
        this._applyVariance = true;
        _Game_Battler_regenerateHp.apply(this, arguments);
        this._applyVariance = false;
    };

    const _Game_Battler_regenerateMp = Game_Battler.prototype.regenerateMp;
    Game_Battler.prototype.regenerateMp = function() {
        this._applyVariance = true;
        _Game_Battler_regenerateMp.apply(this, arguments);
        this._applyVariance = false;
    };

    const _Game_Battler_regenerateTp = Game_Battler.prototype.regenerateTp;
    Game_Battler.prototype.regenerateTp = function() {
        this._applyVariance = true;
        _Game_Battler_regenerateTp.apply(this, arguments);
        this._applyVariance = false;
    };

    Game_Battler.prototype.applyRegenerateVariance = function(value, variance) {
        return Math.floor(value * (1.0 - variance / 100 + Math.random() * variance / 50));
    };

    const _Game_Battler_gainHp = Game_Battler.prototype.gainHp;
    Game_Battler.prototype.gainHp = function(value) {
        if (this._applyVariance) {
            const variance = value <= 0 ? param.hpRegenerateVariance : param.hpSlipVariance;
            arguments[0] = this.applyRegenerateVariance(value, variance);
        }
        _Game_Battler_gainHp.apply(this, arguments);
    };

    const _Game_Battler_gainMp = Game_Battler.prototype.gainMp;
    Game_Battler.prototype.gainMp = function(value) {
        if (this._applyVariance) {
            const variance = value <= 0 ? param.mpRegenerateVariance : param.mpSlipVariance;
            arguments[0] = this.applyRegenerateVariance(value, variance);
        }
        _Game_Battler_gainMp.apply(this, arguments);
    };

    const _Game_Battler_gainSilentTp = Game_Battler.prototype.gainSilentTp;
    Game_Battler.prototype.gainSilentTp = function(value) {
        if (this._applyVariance) {
            const variance = value <= 0 ? param.tpRegenerateVariance : param.tpSlipVariance;
            arguments[0] = this.applyRegenerateVariance(value, variance);
        }
        _Game_Battler_gainSilentTp.apply(this, arguments);
    };
})();