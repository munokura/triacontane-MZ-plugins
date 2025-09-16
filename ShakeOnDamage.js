//=============================================================================
// ShakeOnDamage.js
// ----------------------------------------------------------------------------
// (C)2020 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.1.0 2024/06/09 振動を一時的に無効化するスイッチを追加
// 1.0.0 2020/06/15 MV版から流用作成
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/ShakeOnDamage.js
@plugindesc Vibration plugin when damaged
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

ShakeOnDamage.js

Vibrates the screen when an actor takes damage in battle.
You can vary the strength of the vibration between critical and normal damage.

You can apply a calculation formula to each parameter.

The following can also be used as local variables:

a: The actor that received the damage.

r: The remaining HP percentage of the actor that received the damage (0-100).

To enter a calculation formula, select the "Text" tab in the parameter
settings dialog.

This plugin does not have a plugin command.

Terms of Use:
You may modify and redistribute this plugin without permission from the
author, and there are no restrictions on its use (commercial, 18+, etc.).

This plugin is now yours.

@param shakePower
@text Shake Strength
@desc This is the strength of the shake when normal damage is received.
@type number
@default 5
@min 1
@max 9

@param criticalShakePower
@text Critical Shake Strength
@desc The strength of the shake when receiving critical damage.
@type number
@default 9
@min 1
@max 9

@param effectiveShakePower
@text Weakness Shake Strength
@desc The strength of the shake when receiving weak point damage.
@type number
@default 9
@min 1
@max 9

@param shakeSpeed
@text Shake speed
@desc It's the speed of the shake.
@type number
@default 9
@min 1
@max 9

@param shakeDuration
@text Shake Time
@desc Shake time (frames).
@type number
@default 30

@param applyActor
@text Applies to Actors
@desc Shake when actor takes damage.
@type boolean
@default true

@param applyEnemy
@text Applies to enemy characters
@desc Shake when enemy characters take damage.
@type boolean
@default false

@param disableSwitch
@text Disable Switch
@desc Disables vibration when the specified switch is ON.
@type switch
@default 0
*/

/*:ja
@plugindesc ダメージ時の振動プラグイン
@author トリアコンタン
@target MZ
@base PluginCommonBase
@orderAfter PluginCommonBase
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/ShakeOnDamage.js

@param shakePower
@text シェイク強さ
@desc 通常ダメージを受けたときのシェイク強さです。
@default 5
@type number
@min 1
@max 9

@param criticalShakePower
@text クリティカルシェイク強さ
@desc クリティカルダメージを受けたときのシェイク強さです。
@default 9
@type number
@min 1
@max 9

@param effectiveShakePower
@text 弱点シェイク強さ
@desc 弱点ダメージを受けたときのシェイク強さです。
@default 9
@type number
@min 1
@max 9

@param shakeSpeed
@text シェイク速さ
@desc シェイク速さです。
@default 9
@type number
@min 1
@max 9

@param shakeDuration
@text シェイク時間
@desc シェイク時間(フレーム)です。
@default 30
@type number

@param applyActor
@text アクターに適用
@desc アクターのダメージ時にシェイクします。
@default true
@type boolean

@param applyEnemy
@text 敵キャラに適用
@desc 敵キャラのダメージ時にシェイクします。
@default false
@type boolean

@param disableSwitch
@text 無効スイッチ
@desc 指定したスイッチがONのときは振動を無効にします。
@default 0
@type switch

@help ShakeOnDamage.js

戦闘でアクターがダメージを受けたときに画面を振動させます。
クリティカル時と通常時とで強さを変えることができます。

各パラメータには計算式を適用できます。
さらにローカル変数として以下が使用可能です。
a : ダメージを受けた対象のアクターです。
r : ダメージを受けた対象のアクターの残りHP率(0-100)です。

計算式を入力する場合はパラメータ設定ダイアログで「テキスト」タブを
選択してから入力してください。

このプラグインにはプラグインコマンドはありません。

利用規約：
 作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 についても制限はありません。
 このプラグインはもうあなたのものです。
*/

(()=> {
    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);

    //=============================================================================
    // Game_Battler
    //  クリティカル判定を記憶します。
    //=============================================================================
    Game_Battler.prototype.setCriticalForShake = function(value) {
        this._criticalForShake = value;
    };

    Game_Battler.prototype.isCriticalForShake = function() {
        return this._criticalForShake;
    };

    Game_Battler.prototype.setEffectiveForShake = function(value) {
        this._effectiveForShake = value;
    };

    Game_Battler.prototype.isEffectiveForShake = function() {
        return this._effectiveForShake;
    };

    const _Game_Battler_performDamage      = Game_Battler.prototype.performDamage;
    Game_Battler.prototype.performDamage = function() {
        _Game_Battler_performDamage.apply(this, arguments);
        if (this.isShakeOnDamage()) {
            this.shakeOnDamage();
        }
    };

    Game_Battler.prototype.shakeOnDamage = function() {
        const power    = this.getDamageShakePower();
        const speed    = this.convertShakeParameter(param.shakeSpeed);
        const duration = this.convertShakeParameter(param.shakeDuration);
        $gameScreen.startShake(power, speed, duration);
        this.setCriticalForShake(false);
    };

    Game_Battler.prototype.getDamageShakePower = function() {
        let power = param.shakePower;
        if (param.criticalShakePower && this.isCriticalForShake()) {
            power = param.criticalShakePower;
        } else if (param.effectiveShakePower && this.isEffectiveForShake()) {
            power = param.effectiveShakePower;
        }
        return this.convertShakeParameter(power);
    };

    Game_Battler.prototype.convertShakeParameter = function(value) {
        // use in eval
        const a= this;
        const r = a.hpRate() * 100;
        return isNaN(value) ? eval(value) : value;
    };

    Game_Battler.prototype.isShakeOnDamage = function() {
        return !$gameSwitches.value(param.disableSwitch);
    };

    const _Game_Actor_isShakeOnDamage = Game_Actor.prototype.isShakeOnDamage;
    Game_Actor.prototype.isShakeOnDamage = function() {
        return _Game_Actor_isShakeOnDamage.apply(this, arguments) && param.applyActor;
    };

    const _Game_Enemy_isShakeOnDamage = Game_Enemy.prototype.isShakeOnDamage;
    Game_Enemy.prototype.isShakeOnDamage = function() {
        return _Game_Enemy_isShakeOnDamage.apply(this, arguments) && param.applyEnemy;
    };

    //=============================================================================
    // Game_Action
    //  クリティカル判定を記憶します。
    //=============================================================================
    const _Game_Action_makeDamageValue      = Game_Action.prototype.makeDamageValue;
    Game_Action.prototype.makeDamageValue = function(target, critical) {
        target.setCriticalForShake(critical);
        return _Game_Action_makeDamageValue.apply(this, arguments);
    };

    const _Game_Action_calcElementRate = Game_Action.prototype.calcElementRate;
    Game_Action.prototype.calcElementRate = function(target) {
        const result = _Game_Action_calcElementRate.apply(this, arguments);
        target.setEffectiveForShake(result > 1.0);
        return result;
    };
})();