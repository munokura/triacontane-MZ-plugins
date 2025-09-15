//=============================================================================
// EffectConditions.js
// ----------------------------------------------------------------------------
// (C)2017 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.4.0 2024/03/31 メモタグの有無を適用条件に追加
// 1.3.0 2023/05/07 適用条件スクリプトの凡例「subject.isActor();」を選択するとエラーになっていた問題を修正
// 1.2.0 2022/09/27 適用条件に「戦闘中かどうか」を追加
// 1.1.0 2022/09/25 MZ用に再作成
// 1.0.3 2017/02/07 端末依存の記述を削除
// 1.0.2 2017/01/12 メモ欄の値が空で設定された場合にエラーが発生するかもしれない問題を修正
// 1.0.1 2017/01/01 YEP_BattleEngineCore.js用の対策コードを追記
// 1.0.0 2017/01/01 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/EffectConditions.js
@plugindesc Effect conditional application plugin
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

EffectConditions.js

Sets the conditions for skill and item effects.
By entering the following in the database memo field, the effect set in [1]
will be applied only when the condition set by the identifier [cond01] is met.
<EffectCondition_1:cond01>
<EffectCond_1:cond01>

User and target tags are enabled when the specified tag is entered in the
database memo field (※1) with the feature.
If you enter "aaa" as the parameter, enter "<aaa>" in the memo field.

※1 Actor, Class, Weapon, Armor, State, Enemy Character

The following local variables can be used in scripts.
subject: User (Game_Battler)
target: Target (Game_Battler)
damage: Damage value (Number)

This plugin requires the base plugin "PluginCommonBase.js."
"PluginCommonBase.js" is located in the following folder under the RPG Maker
MZ installation folder:

dlc/BasicResources/plugins/official

Terms of Use:
You may modify and redistribute this plugin without permission from the
author, and there are no restrictions on its use (commercial, R18+, etc.).
This plugin is now yours.

@param conditionList
@text Condition List
@desc This is a list of settings for the conditions under which the effect is applied.
@type struct<Condition>[]
@default []
*/

/*~struct~Condition:
@param id
@text identifier
@desc This is the identifier to be entered in the memo field. Set a value that does not overlap with other identifiers.
@default cond01

@param switch
@text switch
@desc This condition is considered valid when the specified switch is ON.
@type switch
@default 0

@param probability
@text probability
@desc This is a condition that is judged to be valid with the specified probability. (Specifying 100 means 100% success)
@type number
@default 0
@max 100

@param battleOnly
@text Only during combat
@desc If it is set to ON, it will only be effective during battle. (If it is set to OFF, it will be effective both during battle and in the menu.)
@type boolean
@default false

@param subjectTag
@text User tag
@desc The condition is that the skill is considered valid if the specified tag is in the memo field of the feature held by the user.
@type string

@param targetTag
@text Target audience tag
@desc This condition is considered valid if the specified tag is in the memo field of the characteristics held by the target person.
@type string

@param script
@text script
@desc This condition is considered valid when the execution result of the specified script is true.
@type combo
@option target.hpRate() === 1.0; // When the opponent's HP is at maximum
@option damage > 100; // If the damage exceeds 100
@option subject.isActor(); // If the user is an actor
*/

/*:ja
@plugindesc 効果の条件適用プラグイン
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/EffectConditions.js
@base PluginCommonBase
@orderAfter PluginCommonBase

@param conditionList
@text 条件リスト
@desc 効果の適用条件の設定リストです。
@default []
@type struct<Condition>[]

@help EffectConditions.js

スキル、アイテムの使用効果に適用条件を設定します。
データベースのメモ欄に以下の通り記述すると、識別子[cond01]で設定した条件を
満たしたときだけ[1]番目に設定した効果が適用されます。
<効果条件_1:cond01>
<EffectCond_1:cond01>

使用者、対象者タグは特徴を有するデータベースのメモ欄(※1)に指定したタグが
記載されている場合に有効になります。
パラメータにaaaと入力した場合、メモ欄には<aaa>と記述します。

※1 アクター、職業、武器、防具、ステート、敵キャラ

スクリプトでは以下のローカル変数が使えます。
subject : 使用者(Game_Battler)
target : 対象者(Game_Battler)
damage : ダメージ値(Number)

このプラグインの利用にはベースプラグイン『PluginCommonBase.js』が必要です。
『PluginCommonBase.js』は、RPGツクールMZのインストールフォルダ配下の
以下のフォルダに格納されています。
dlc/BasicResources/plugins/official

利用規約：
 作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 についても制限はありません。
 このプラグインはもうあなたのものです。
*/

/*~struct~Condition:ja

@param id
@text 識別子
@desc メモ欄に記述する識別子です。他の識別子と重複しない値を設定します。
@default cond01

@param switch
@text スイッチ
@desc 指定したスイッチがONのときに有効と判定される条件です。
@default 0
@type switch

@param probability
@text 確率
@desc 指定した確率で有効と判定される条件です。(100を指定すると100%成功)
@default 0
@type number
@max 100

@param battleOnly
@text 戦闘中のみ
@desc ONにすると戦闘中のみ有効な効果と判断されます。(OFFにすると戦闘中、メニュー中どちらでも有効)
@default false
@type boolean

@param subjectTag
@text 使用者タグ
@desc 使用者が保持する特徴のメモ欄に指定したタグがある場合に有効と判定される条件です。
@default
@type string

@param targetTag
@text 対象者タグ
@desc 対象者が保持する特徴のメモ欄に指定したタグがある場合に有効と判定される条件です。
@default
@type string

@param script
@text スクリプト
@desc 指定したスクリプトの実行結果がtrueのときに有効と判定される条件です。
@default 
@type combo
@option target.hpRate() === 1.0; // 相手のHPが最大の場合
@option damage > 100; // ダメージが100を超えた場合
@option subject.isActor(); // 使用者がアクターの場合
*/

(()=> {
    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);

    //=============================================================================
    // Game_Temp
    //  IDを指定してコモンイベントを予約キャンセル
    //=============================================================================
    Game_Temp.prototype.clearCommonEventReservationById = function(commonEventId) {
        this._commonEventQueue = this._commonEventQueue.filter(id => id !== commonEventId);
    };

    //=============================================================================
    // Game_Battler
    //  指定したメモタグの保持を判定します。
    //=============================================================================
    Game_Battler.prototype.hasMemoTag = function(tagName) {
        return this.traitObjects().some(object => object.meta[tagName]);
    }

    //=============================================================================
    // Game_Action
    //  効果の条件適用を実装します。
    //=============================================================================
    const _Game_Action_executeDamage =Game_Action.prototype.executeDamage;
    Game_Action.prototype.executeDamage = function(target, value) {
        this._damageValue = value;
        _Game_Action_executeDamage.apply(this, arguments);
    };

    const _Game_Action_testItemEffect = Game_Action.prototype.testItemEffect;
    Game_Action.prototype.testItemEffect = function(target, effect) {
        if (this.isValidEffect(target, effect)) {
            return _Game_Action_testItemEffect.apply(this, arguments);
        } else {
            return false;
        }
    };

    const _Game_Action_applyItemEffect = Game_Action.prototype.applyItemEffect;
    Game_Action.prototype.applyItemEffect = function(target, effect) {
        if (this.isValidEffect(target, effect)) {
            _Game_Action_applyItemEffect.apply(this, arguments);
        }
    };

    const _Game_Action_applyGlobal = Game_Action.prototype.applyGlobal;
    Game_Action.prototype.applyGlobal = function() {
        _Game_Action_applyGlobal.apply(this, arguments);
        this.cancelEffectCommonEvent();
    };

    Game_Action.prototype.cancelEffectCommonEvent = function() {
        this.item().effects.forEach(effect => {
            if (effect.code === Game_Action.EFFECT_COMMON_EVENT && !this.isValidEffect(null, effect)) {
                $gameTemp.clearCommonEventReservationById(effect.dataId);
            }
        });
    };

    Game_Action.prototype.isValidEffect = function(target, effect) {
        const condParam = this.findEffectCondition(effect);
        if (!condParam) {
            return true;
        }
        const conditions = [];
        const damage = this._damageValue; // Use in eval
        const subject = this.subject();
        conditions.push(() => !condParam.switch || $gameSwitches.value(condParam.switch));
        conditions.push(() => !condParam.probability || Math.randomInt(100) < condParam.probability);
        conditions.push(() => !condParam.script || eval(condParam.script));
        conditions.push(() => !condParam.battleOnly || $gameParty.inBattle());
        conditions.push(() => !condParam.subjectTag || subject.hasMemoTag(condParam.subjectTag));
        conditions.push(() => !condParam.targetTag || target.hasMemoTag(condParam.targetTag));
        return !conditions.some(condition => !condition());
    };

    Game_Action.prototype.findEffectCondition = function(effect) {
        const index = this.getEffectIndex(effect);
        const id = PluginManagerEx.findMetaValue(this.item(), [`EffectCond_${index}`, `効果条件_${index}`]);
        return id ? param.conditionList?.find(item => item.id === id) : null;
    };

    Game_Action.prototype.getEffectIndex = function(effect) {
        return this.item().effects.indexOf(effect) + 1;
    };
})();