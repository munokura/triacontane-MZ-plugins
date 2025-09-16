/*=============================================================================
 BuffExtend.js
----------------------------------------------------------------------------
 (C)2023 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.1.0 2023/08/16 複数回のバフを適用するメモ欄「BuffLevel」を撤廃しました。（デフォルト機能で実現できたため）
 1.0.0 2023/08/13 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/BuffExtend.js
@plugindesc Buff Extension Plugin
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

BuffExtend.js

This plugin allows you to increase the number of stacks of buffs and debuffs
and their multipliers.
You can also apply buffs and debuffs via plugin commands.
The icon will not change even if stacked three or more times.

To apply two or more levels of buffs or debuffs,
set two "Enhance" skills or item features.

You can also set special messages for when two or more levels of buffs or
debuffs are applied, and when they have no effect.

This plugin requires the base plugin "PluginCommonBase.js."
"PluginCommonBase.js" is located in the following folder under the RPG Maker
MZ installation folder:
dlc/BasicResources/plugins/official

Terms of Use:
You may modify and redistribute this plugin without permission from the
author, and there are no restrictions on its use (commercial, 18+, etc.).
This plugin is now yours.

@param maxBuffCount
@text Maximum buff count
@desc The maximum number of times the buff can be stacked. If you specify 0, it will default to 2.
@type number
@default 0

@param maxDebuffCount
@text Maximum number of debuffs
@desc The maximum number of times the debuff can be stacked. If you specify 0, it will default to 2 times.
@type number
@default 0

@param buffRate
@text Buff multiplier
@desc This is the multiplier for increasing the effect of buffs/debuffs. It is specified as a percentage (%). If you specify 0, it will default to 25%.
@type number
@default 0

@param multiBuffMessage
@text Multi-buff message
@desc This message is displayed when a buff of two or more levels is applied.
@type string
@default %1の%2がぐーんと上がった！

@param multiDebuffMessage
@text Multi-debuff message
@desc This message is displayed when a debuff of two or more levels is applied.
@type string
@default %1の%2ががくっと下がった！

@param noEffectBuffMessage
@text No effect buff message
@desc Message to display when a buff is applied but has no effect.
@type string
@default %1の%2はこれ以上上がらない！

@param noEffectDebuffMessage
@text No effect debuff message
@desc This is the message displayed when a debuff is applied but has no effect.
@type string
@default %1の%2はこれ以上下がらない！

@command INCREASE_BUFF
@text Buff Progression
@desc The buff will progress by the specified amount.
@arg actorId
@text Actor ID
@desc The actor ID of the buff to progress.
@type actor
@default 0
@arg enemyIndex
@text Enemy Character Index
@desc The enemy character index for the buff to progress. If an actor ID is specified, that will take priority.
@type number
@default -1
@min -1
@arg paramId
@text Parameter ID
@desc The parameter ID of the buff to progress.
@type select
@default 0
@option Max HP
@value 0
@option Max MP
@value 1
@option Attack Power
@value 2
@option Defense power
@value 3
@option magic power
@value 4
@option magic defense
@value 5
@option agility
@value 6
@option luck
@value 7
@arg count
@text Progress Value
@desc The buff value to progress. A negative value will result in a debuff.
@type number
@default 1
@min -999
@max 999
@arg turn
@text Sustained Turn
@desc The duration of the buff you are progressing.
@type number
@default 1
*/

/*:ja
@plugindesc バフ拡張プラグイン
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/BuffExtend.js
@base PluginCommonBase
@orderAfter PluginCommonBase
@author トリアコンタン

@param maxBuffCount
@text 最大バフ回数
@desc バフを重ね掛けできる最大回数です。0を指定するとデフォルトの2回となります。
@default 0
@type number

@param maxDebuffCount
@text 最大デバフ回数
@desc デバフを重ね掛けできる最大回数です。0を指定するとデフォルトの2回となります。
@default 0
@type number

@param buffRate
@text バフ倍率
@desc バフ/デバフの効果量を増加させる倍率です。百分率(%)で指定します。0を指定するとデフォルトの25%となります。
@default 0
@type number

@param multiBuffMessage
@text マルチバフメッセージ
@desc 2段階以上のバフが適用されたときに表示するメッセージです。
@default %1の%2がぐーんと上がった！
@type string

@param multiDebuffMessage
@text マルチデバフメッセージ
@desc 2段階以上のデバフが適用されたときに表示するメッセージです。
@default %1の%2ががくっと下がった！
@type string

@param noEffectBuffMessage
@text 効果なしバフメッセージ
@desc バフが適用されたが効果がなかったときに表示するメッセージです。
@default %1の%2はこれ以上上がらない！
@type string

@param noEffectDebuffMessage
@text 効果なしデバフメッセージ
@desc デバフが適用されたが効果がなかったときに表示するメッセージです。
@default %1の%2はこれ以上下がらない！
@type string

@command INCREASE_BUFF
@text バフ進行
@desc 指定したぶんだけバフを進行させます。

@arg actorId
@text アクターID
@desc 進行させるバフのアクターIDです。
@default 0
@type actor

@arg enemyIndex
@text 敵キャラインデックス
@desc 進行させるバフの敵キャラインデックスです。アクターIDを指定した場合、そちらが優先されます。
@default -1
@type number
@min -1

@arg paramId
@text パラメータID
@desc 進行させるバフのパラメータIDです。
@default 0
@type select
@option 最大HP
@value 0
@option 最大MP
@value 1
@option 攻撃力
@value 2
@option 防御力
@value 3
@option 魔法力
@value 4
@option 魔法防御
@value 5
@option 敏捷性
@value 6
@option 運
@value 7

@arg count
@text 進行値
@desc 進行させるバフの値です。負の値を設定するとデバフになります。
@default 1
@type number
@min -999
@max 999

@arg turn
@text 持続ターン
@desc 進行させるバフの持続ターンです。
@default 1
@type number

@help BuffExtend.js

バフ、デバフの重ね掛け回数を増やしたり、倍率を増加させたりできます。
また、プラグインコマンドからバフ、デバフ効果を適用できます。
3回以上、重ね掛けした場合もアイコンは変わりません。

2段階以上のバフ、デバフを適用したい場合は、
スキルやアイテムの特徴で「強化」を二つ設定してください。

2段階以上バフ、デバフが適用された場合の専用メッセージや
効果がなかった場合の専用メッセージも設定できます。

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

    PluginManagerEx.registerCommand(script, 'INCREASE_BUFF', args => {
        const actor = $gameActors.actor(args.actorId);
        const enemy = $gameTroop.members()[args.enemyIndex];
        const battler = actor || enemy;
        if (!battler) {
            PluginManagerEx.throwError(`INCREASE_BUFF:Invalid battler. 
            Actor ID:${args.actorId} Enemy index:${args.enemyIndex}`, script);
        }
        if (args.count > 0) {
            battler.addMultiBuff(args.paramId, args.turn, args.count);
        } else {
            battler.addMultiDebuff(args.paramId, args.turn, -args.count);
        }
    });

    const _Game_BattlerBase_paramBuffRate = Game_BattlerBase.prototype.paramBuffRate;
    Game_BattlerBase.prototype.paramBuffRate = function(paramId) {
        const rate = _Game_BattlerBase_paramBuffRate.apply(this, arguments);
        if (param.buffRate === 0) {
            return rate;
        }
        return this._buffs[paramId] * (param.buffRate / 100) + 1.0;
    };

    const _Game_BattlerBase_isMaxBuffAffected = Game_BattlerBase.prototype.isMaxBuffAffected;
    Game_BattlerBase.prototype.isMaxBuffAffected = function(paramId) {
        if (param.maxBuffCount === 0) {
            return _Game_BattlerBase_isMaxBuffAffected.apply(this, arguments);
        }
        return this._buffs[paramId] === param.maxBuffCount;
    };

    const _Game_BattlerBase_isMaxDebuffAffected = Game_BattlerBase.prototype.isMaxDebuffAffected;
    Game_BattlerBase.prototype.isMaxDebuffAffected = function(paramId) {
        if (param.maxDebuffCount === 0) {
            return _Game_BattlerBase_isMaxDebuffAffected.apply(this, arguments);
        }
        return this._buffs[paramId] === -param.maxDebuffCount;
    };

    const _Game_BattlerBase_buffIconIndex = Game_BattlerBase.prototype.buffIconIndex;
    Game_BattlerBase.prototype.buffIconIndex = function(buffLevel, paramId) {
        if (buffLevel > 2) {
            arguments[0] = 2;
        } else if (buffLevel < -2) {
            arguments[0] = -2;
        }
        return _Game_BattlerBase_buffIconIndex.apply(this, arguments);
    };

    Game_Battler.prototype.addMultiBuff = function(paramId, turns, count) {
        this.addBuff(paramId, turns);
        if (count > 1) {
            this.addMultiBuff(paramId, turns, count - 1);
        }
    };

    Game_Battler.prototype.addMultiDebuff = function(paramId, turns, count) {
        this.addDebuff(paramId, turns);
        if (count > 1) {
            this.addMultiDebuff(paramId, turns, count - 1);
        }
    };

    const _Game_Action_itemEffectAddBuff = Game_Action.prototype.itemEffectAddBuff;
    Game_Action.prototype.itemEffectAddBuff = function(target, effect) {
        if (target.isMaxBuffAffected(effect.dataId) && !target.result().addedBuffs.includes(effect.dataId)) {
            target.result().pushNoEffectBuff(effect.dataId);
        }
        _Game_Action_itemEffectAddBuff.apply(this, arguments);
    };

    const _Game_Action_itemEffectAddDebuff = Game_Action.prototype.itemEffectAddDebuff;
    Game_Action.prototype.itemEffectAddDebuff = function(target, effect) {
        if (target.isMaxDebuffAffected(effect.dataId) && !target.result().addedDebuffs.includes(effect.dataId)) {
            target.result().pushNoEffectDebuff(effect.dataId);
        }
        _Game_Action_itemEffectAddDebuff.apply(this, arguments);
    };

    const _Game_ActionResult_clear = Game_ActionResult.prototype.clear;
    Game_ActionResult.prototype.clear = function() {
        _Game_ActionResult_clear.apply(this, arguments);
        this.addedMultiBuffs = [];
        this.addedMultiDebuffs = [];
        this.addedNoEffectBuffs = [];
        this.addedNoEffectDebuffs = [];
    };

    const _Game_ActionResult_pushAddedBuff = Game_ActionResult.prototype.pushAddedBuff;
    Game_ActionResult.prototype.pushAddedBuff = function(paramId) {
        if (this.isBuffAdded(paramId) && !this.addedMultiBuffs.includes(paramId)) {
            this.addedMultiBuffs.push(paramId);
            return;
        }
        _Game_ActionResult_pushAddedBuff.apply(this, arguments);
    };

    const _Game_ActionResult_pushAddedDebuff = Game_ActionResult.prototype.pushAddedDebuff;
    Game_ActionResult.prototype.pushAddedDebuff = function(paramId) {
        if (this.isDebuffAdded(paramId) && !this.addedMultiDebuffs.includes(paramId)) {
            this.addedMultiDebuffs.push(paramId);
            return;
        }
        _Game_ActionResult_pushAddedDebuff.apply(this, arguments);
    };

    Game_ActionResult.prototype.pushNoEffectBuff = function(paramId) {
        if (!this.addedNoEffectBuffs.includes(paramId)) {
            this.addedNoEffectBuffs.push(paramId);
        }
    };

    Game_ActionResult.prototype.pushNoEffectDebuff = function(paramId) {
        if (!this.addedNoEffectDebuffs.includes(paramId)) {
            this.addedNoEffectDebuffs.push(paramId);
        }
    };

    Game_ActionResult.prototype.filterDuplicateBuffs = function() {
        this.addedBuffs = this.addedBuffs.filter(paramId =>
            !this.addedMultiBuffs.includes(paramId) &&
            !this.addedNoEffectBuffs.includes(paramId));
        this.addedDebuffs = this.addedDebuffs.filter(paramId =>
            !this.addedMultiDebuffs.includes(paramId) &&
            !this.addedNoEffectDebuffs.includes(paramId));
        this.addedMultiBuffs = this.addedMultiBuffs.filter(paramId =>
            !this.addedNoEffectBuffs.includes(paramId));
        this.addedMultiDebuffs = this.addedMultiDebuffs.filter(paramId =>
            !this.addedNoEffectDebuffs.includes(paramId));
    };

    const _Window_BattleLog_displayChangedBuffs = Window_BattleLog.prototype.displayChangedBuffs;
    Window_BattleLog.prototype.displayChangedBuffs = function(target) {
        const result = target.result();
        result.filterDuplicateBuffs();
        _Window_BattleLog_displayChangedBuffs.apply(this, arguments);
        this.displayBuffs(target, result.addedMultiBuffs, param.multiBuffMessage || TextManager.buffAdd);
        this.displayBuffs(target, result.addedMultiDebuffs, param.multiDebuffMessage || TextManager.debuffAdd);
        if (param.noEffectBuffMessage) {
            this.displayBuffs(target, result.addedNoEffectBuffs, param.noEffectBuffMessage);
        }
        if (param.noEffectDebuffMessage) {
            this.displayBuffs(target, result.addedNoEffectDebuffs, param.noEffectDebuffMessage);
        }
    };
})();