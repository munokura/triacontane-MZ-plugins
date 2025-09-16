/*=============================================================================
 ReflectionAnimation.js
----------------------------------------------------------------------------
 (C)2020 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 2.1.0 2024/04/20 反射された側にアニメーションを表示しない設定を追加
 2.0.1 2021/03/28 MVで廃止されたメソッド呼び出しが含まれていた問題を修正
 2.0.0 2020/12/28 MZ向けに実装を修正
 1.1.3 2020/05/24 反射したときのステータスウィンドウへのダメージ反映を、反射エフェクト後に変更
 1.1.2 2020/05/24 魔法攻撃扱いの通常攻撃を反射するとエラーになる問題を修正
 1.1.1 2020/05/24 ヘルプとコードを微修正
 1.1.0 2020/05/24 反射された側にアニメーションを表示する機能を追加
 1.0.0 2020/05/24 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
@target MZ
@url https://github.com/triacontane/RPGMakerMV/blob/mz_master/ReflectionAnimation.js
@plugindesc Reflection Animation Plugin
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

ReflectionAnimation.js

Plays the magic reflection animation when a magic reflection occurs.

Also displays an attack animation on the side that is reflected.

This plugin requires the base plugin "PluginCommonBase.js."
"PluginCommonBase.js" is located in the following folder under the RPG Maker
MZ installation folder:

dlc/BasicResources/plugins/official

Terms of Use:
You may modify and redistribute this plugin without permission, and there are
no restrictions on its use (commercial, R18+, etc.).
This plugin is now yours.

@param animationId
@text Animation Number
@desc This is the animation that plays when reflected.
@type animation
@default 0

@param wait
@text Wait until completion
@desc Waits for reflection animation to complete.
@type boolean
@default true

@param noAttackAnimation
@text Attack animations are not displayed
@desc The reflected side will not see the attack animation.
@type boolean
@default false
*/

/*:ja
@plugindesc 反射アニメーションプラグイン
@target MZ
@url https://github.com/triacontane/RPGMakerMV/blob/mz_master/ReflectionAnimation.js
@base PluginCommonBase
@author トリアコンタン

@param animationId
@text アニメーション番号
@desc 反射時に再生するアニメーションです。
@default 0
@type animation

@param wait
@text 完了までウェイト
@desc 反射アニメーションが完了するまで待機します。
@default true
@type boolean

@param noAttackAnimation
@text 攻撃アニメは表示しない
@desc 反射された側に攻撃アニメーションを表示しません。
@default false
@type boolean

@help ReflectionAnimation.js

魔法反射が発生した際に魔法反射用のアニメーションを再生します。
また、反射された側に攻撃アニメーションを表示します。

このプラグインの利用にはベースプラグイン『PluginCommonBase.js』が必要です。
『PluginCommonBase.js』は、RPGツクールMZのインストールフォルダ配下の
以下のフォルダに格納されています。
dlc/BasicResources/plugins/official

利用規約：
 作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 についても制限はありません。
 このプラグインはもうあなたのものです。
*/

(function() {
    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);

    /**
     * Window_BattleLog
     * 反射時のアニメーションを再生します。
     */
    const _Window_BattleLog_displayReflection = Window_BattleLog.prototype.displayReflection;
    Window_BattleLog.prototype.displayReflection = function(target) {
        $gameTemp.requestFreezeGauge();
        if (param.animationId > 0) {
            this.push('showAnimation', this._relectionTarget, [target], param.animationId);
            if (param.wait) {
                this.push('waitForAnimation');
            }
        }
        _Window_BattleLog_displayReflection.apply(this, arguments);
        if (!param.noAttackAnimation) {
            this.push('showAnimation', target, [this._relectionTarget], this._relectionItem.animationId);
            this.push('waitForAnimation');
        }
        this.push('restoreGaugeStop');
    };

    const _Window_BattleLog_startAction = Window_BattleLog.prototype.startAction;
    Window_BattleLog.prototype.startAction = function(subject, action, targets) {
        this._relectionItem = action.item();
        this._relectionTarget = subject;
        _Window_BattleLog_startAction.apply(this, arguments);
    };

    const _Window_BattleLog_updateWaitMode      = Window_BattleLog.prototype.updateWaitMode;
    Window_BattleLog.prototype.updateWaitMode = function() {
        let waiting = false;
        if (this._waitMode === 'animation') {
            waiting = this._spriteset.isAnimationPlaying();
        }
        if (!waiting) {
            waiting = _Window_BattleLog_updateWaitMode.apply(this, arguments);
        }
        return waiting;
    };

    Window_BattleLog.prototype.waitForAnimation = function() {
        this.setWaitMode('animation');
    };

    Window_BattleLog.prototype.restoreGaugeStop = function() {
        $gameTemp.clearFreezeGauge();
    };

    /**
     * Game_Temp
     * ゲージ更新停止フラグを管理
     */
    Game_Temp.prototype.requestFreezeGauge = function() {
        this._freezeGauge = true;
    };

    Game_Temp.prototype.clearFreezeGauge = function() {
        this._freezeGauge = false;
    };

    Game_Temp.prototype.isFreezeGauge = function() {
        return this._freezeGauge;
    };

    /**
     * Sprite_Gauge
     * ゲージの更新を止めます。
     */
    const _Sprite_Gauge_updateBitmap = Sprite_Gauge.prototype.updateBitmap;
    Sprite_Gauge.prototype.updateBitmap = function() {
        if ($gameTemp.isFreezeGauge()) {
            return;
        }
        _Sprite_Gauge_updateBitmap.apply(this, arguments);
    };
})();