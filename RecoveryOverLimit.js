/*=============================================================================
 RecoveryOverLimit.js
----------------------------------------------------------------------------
 (C)2020 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.2.0 2024/12/31 限界突破が有効なとき、HP吸収でも反映されるよう修正
 1.1.0 2024/12/29 MZ対応版を作成
 1.0.0 2020/04/26 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/RecoveryOverLimit.js
@plugindesc Recovery Limit Breakthrough Plugin
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

RecoveryOverLimit.js

You can create active and passive skills that can recover HP beyond the
original maximum.
Specify the following in the memo field of the target database (※).
<Recovery Limit Break: 50> // Recovers HP beyond 50% of maximum HP.
<RecoveryOverLimit: 50> // Same as above.

※ Actor, Job, Skill, Item, Weapon, Armor, Enemy, State

This plugin does not have plugin commands.

Terms of Use:
You may modify and redistribute this plugin without permission from the
author, and there are no restrictions on its use (commercial, 18+, etc.).
This plugin is now yours.

@param OverLimitHpColor
@text Limit Break HP Text Color
@desc This is the text color when HP is above its limit.
@type color
@default 0
*/

/*:ja
@plugindesc 回復限界突破プラグイン
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/RecoveryOverLimit.js
@base PluginCommonBase
@orderAfter PluginCommonBase
@author トリアコンタン

@param OverLimitHpColor
@text 限界突破HP文字色
@desc HPが限界突破しているときの文字色です。
@default 0
@type color

@help RecoveryOverLimit.js

本来の最大HPを超えてHP回復できるアクティブ・パッシブスキルを作成できます。
対象データベース(※)のメモ欄に以下を指定します。
<回復限界突破:50>       // 最大HPを50%超えて回復できます。
<RecoveryOverLimit:50> // 同上

※アクター、職業、スキル、アイテム、武器、防具、敵キャラ、ステート

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

    /**
     * Game_BattlerBase
     * 回復限界突破時にHPの上限を引き上げます。
     */
    const _Game_BattlerBase_hpRate = Game_BattlerBase.prototype.hpRate;
    Game_BattlerBase.prototype.hpRate = function() {
        return Math.min(_Game_BattlerBase_hpRate.apply(this, arguments), 1.0);
    };

    Game_BattlerBase.prototype.isHpOverLimit = function() {
        return this.hp > this.mhp;
    };

    Game_BattlerBase.prototype.findRecoveryOverLimitRate = function(skill) {
        const traitObjects = this.traitObjects();
        traitObjects.push(skill);
        return traitObjects.reduce((prev, obj) =>
            Math.max(prev, PluginManagerEx.findMetaValue(obj,['RecoveryOverLimit', '回復限界突破']) || 0), 0);
    };

    Game_BattlerBase.prototype.setOverLimitMaxHp = function(rate) {
        if (rate > 0) {
            this._overLimitMaxHp = this.mhp * (rate + 100) / 100;
        }
    };

    const _Game_BattlerBase_refresh = Game_BattlerBase.prototype.refresh;
    Game_BattlerBase.prototype.refresh = function() {
        const realHp = this.findOverLimitHp();
        _Game_BattlerBase_refresh.apply(this, arguments);
        if (realHp > 0) {
            this._hp = realHp;
        }
    };

    Game_BattlerBase.prototype.findOverLimitHp = function() {
        if (!$gameParty.inBattle() || this.mhp >= this._overLimitMaxHp) {
            this._overLimitMaxHp = 0;
            return 0;
        } else {
            const hp = Math.min(this._overLimitMaxHp, this._hp);
            this._overLimitMaxHp = hp;
            return hp;
        }
    };

    /**
     * Game_Action
     * 回復限界突破スキルを使用した場合に限界突破HPを設定します。
     */
    const _Game_Action_executeHpDamage = Game_Action.prototype.executeHpDamage;
    Game_Action.prototype.executeHpDamage = function(target, value) {
        target.setOverLimitMaxHp(this.findRecoveryOverLimitRate(value));
        _Game_Action_executeHpDamage.apply(this, arguments);
    };

    Game_Action.prototype.findRecoveryOverLimitRate = function(damageValue) {
        if (damageValue >= 0) {
            return 0;
        }
        const subject = this.subject();
        return subject ? subject.findRecoveryOverLimitRate(this.item()) : 0;
    };

    const _Game_Action_gainDrainedHp = Game_Action.prototype.gainDrainedHp;
    Game_Action.prototype.gainDrainedHp = function(value) {
        if (this.isDrain()) {
            let gainTarget = this.subject();
            if (this._reflectionTarget) {
                gainTarget = this._reflectionTarget;
            }
            gainTarget.setOverLimitMaxHp(this.findRecoveryOverLimitRate(-value));
        }
        _Game_Action_gainDrainedHp.apply(this, arguments);
    };

    /**
     * ColorManager
     * HP限界突破時の文字色を取得します。
     */
    const _ColorManager_hpColor = ColorManager.hpColor;
    ColorManager.hpColor = function(actor) {
        const color = param.OverLimitHpColor;
        if (color && actor.isHpOverLimit()) {
            return this.textColor(color);
        } else {
            return _ColorManager_hpColor.apply(this, arguments);
        }
    };
})();