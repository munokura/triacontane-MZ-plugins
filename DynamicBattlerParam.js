//=============================================================================
// DynamicBattlerParam.js
// ----------------------------------------------------------------------------
// (C)2017 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 3.0.1 2024/04/13 パフォーマンス対策とヘルプの記述修正
// 3.0.0 2024/04/13 MZ向けに全面的なリファクタリング
// 2.0.0 2018/07/11 計算式の対象が追加能力値もしくは特殊能力値、計算式で参照する能力値を装備品やバフを適用した能力値になるよう仕様変更しました
// 1.2.1 2017/10/31 1.2.0でデバッグ用のコードが混入していたので修正
// 1.2.0 2017/10/28 追加能力値および特殊能力値についても計算式を適用できる機能を追加
// 1.1.0 2017/08/14 計算式でパラメータを取得する際に装備品による変動分を含まないよう修正
// 1.0.0 2017/07/27 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/DynamicBattlerParam.js
@plugindesc Butler parameter dynamic configuration plugin
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

DynamicBattlerParameter.js

Replaces the battler's stats with the result of evaluating the specified
JavaScript formula.
You can also apply the formula only if the battler has a specific notetag.
By specifying "aaa" as the notetag name parameter, the formula will only be
applied to battlers with the tag <aaa>. (*1)

*1 This plugin references the actor, class, weapon, armor, state, and enemy
character memo fields.

Due to the nature of this plugin, performance may decrease when combined with
other plugins.
In addition, since this plugin makes heavy use of eval, performance may also
decrease if the Developer Tools are open.

The values of each parameter follow the specifications below.

- If the formula targets standard stats (max HP to luck),
The battler's original parameters are used, without taking into account
fluctuations due to equipment or buffs.
This is to prevent the effects of equipment or buffs from being applied twice.
The results of the formula are also rounded to integers.

・If the calculation formula targets additional stats or special stats (from
hit rate to experience gain rate),
The parameters will take into account fluctuations due to equipment and buffs.
The result of the calculation formula will be a real number including decimal
points, with 100% = 1.0.

Furthermore, fluctuations due to this plugin will not be included in any of
the stats.
This is to avoid loops and significant performance degradation caused by
applying a formula to the source of the formula.

param # Original value specified in the database
a.hp # HP
a.mp # MP
a.tp # TP
a.mhp # Max HP
a.mmp # Max MP
a.atk # Attack Power
a.def # Defense Power
a.mat # Magic Power
a.mdf # Magic Defense
a.agi # Agility
a.luk # Luck
a.hpRate() # HP Rate (0.0 - 1.0)
a.mpRate() # MP Rate (0.0 - 1.0)
a.tpRate() # TP Rate (0.0 - 1.0)
a.special('aaa') # Value of [aaa] in the memo field (※)
a.level # Level
a.actorId() # Actor ID
a._classId # Class ID
a.currentExp() # Experience Points

※Retrieves the value corresponding to the specified content from the memo
field with the specified feature.
<aaa:100> # a.special('aaa') returns [100].

Terms of Use:
You may modify and redistribute this plugin without permission from the
author, and there are no restrictions on its use (commercial, R18+, etc.).
This plugin is now yours.

@param formulaList
@text Formula List
@desc A list of parameter calculation formulas.
@type struct<Param>[]
@default []
*/

/*~struct~Param:
@param paramId
@text Parameter ID
@desc The parameter ID to which the formula applies.
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
@option Hit rate
@value 8
@option Evasion rate
@value 9
@option Attention rate
@value 10
@option Critical Hit Avoidance
@value 11
@option Magic Evasion
@value 12
@option Magic Reflection
@value 13
@option Counterattack
@value 14
@option HP regeneration
@value 15
@option MP playback
@value 16
@option TP playback
@value 17
@option Target rate
@value 18
@option Defense Effectiveness Rate
@value 19
@option Recovery Effect Rate
@value 20
@option Medicine knowledge
@value 21
@option MP consumption rate
@value 22
@option TP Charge Rate
@value 23
@option Physical Damage Rate
@value 24
@option Magic Damage Rate
@value 25
@option Floor Damage Rate
@value 26
@option Experience Gain Rate
@value 27

@param formula
@text calculation formula
@desc This is a JavaScript expression to calculate the parameters. Please refer to the help to set the expression. The Butler object can be referenced as [a].
@type multiline_string

@param tagName
@text Notetag Name
@desc The formula will only be applied if the battler has the specified memo field.
*/

/*:ja
@plugindesc バトラーパラメータの動的設定プラグイン
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/DynamicBattlerParam.js
@base PluginCommonBase
@orderAfter PluginCommonBase
@author トリアコンタン

@param formulaList
@text 計算式リスト
@desc パラメータ計算式のリストです。
@default []
@type struct<Param>[]

@help DynamicBattlerParameter.js

バトラーの能力値を指定したJavaScript計算式の評価結果に置き換えます。
バトラーが特定のメモタグを持つ場合のみ計算式を適用することも可能です。
メモタグ名のパラメータにaaaを指定するとタグ<aaa>を持つバトラーにのみ
計算式が適用されます。(※1)

※1 アクター、職業、武器、防具、ステート、敵キャラのメモ欄を参照します。

本プラグインはプラグインの特性上、他のプラグインと組み合わせた場合
パフォーマンスが低下する可能性があります。
また、evalを多用するのでデベロッパーツールを開いていると
同様にパフォーマンスが低下する場合があります。

各パラメータの値は以下の仕様に従います。

・計算式の対象が通常能力値(最大HP～運)の場合
装備品、バフによる変動を考慮しないバトラー本来のパラメータとなります。
これは装備品やバフの効果が二重に適用されてしまう現象を防ぐためです。
また、計算式の結果は整数に丸められます。

・計算式の対象が追加能力値もしくは特殊能力値(命中率～経験獲得率)の場合
装備品、バフによる変動を考慮したパラメータとなります。
計算式の結果は小数点以下を含む実数となり、100%=1.0となります。

また、いずれの能力値も本プラグインによる変動は含まれません。
これは計算式の参照元にさらに計算式を適用しようとして処理が循環したり
著しくパフォーマンスが低下するのを避けるためです。

param # データベースで指定した元々の値
a.hp  # HP
a.mp  # MP
a.tp  # TP
a.mhp # 最大HP
a.mmp # 最大MP
a.atk # 攻撃力
a.def # 防御力
a.mat # 魔法力
a.mdf # 魔法防御
a.agi # 敏捷性
a.luk # 運
a.hpRate() # HPレート(0.0 - 1.0)
a.mpRate() # MPレート(0.0 - 1.0)
a.tpRate() # TPレート(0.0 - 1.0)
a.special('aaa') # メモ欄の[aaa]の値(※)
a.level        # レベル
a.actorId()    # アクターID
a._classId     # 職業ID
a.currentExp() # 経験値

※特徴を有するメモ欄から指定した内容に対応する数値を取得
<aaa:100> # a.special('aaa')で[100]を返す。

利用規約：
 作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 についても制限はありません。
 このプラグインはもうあなたのものです。
*/

/*~struct~Param:ja
@param paramId
@text パラメータID
@desc 計算式を適用するパラメータIDです。
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
@option 命中率
@value 8
@option 回避率
@value 9
@option 会心率
@value 10
@option 会心回避
@value 11
@option 魔法回避
@value 12
@option 魔法反射
@value 13
@option 反撃
@value 14
@option HP再生
@value 15
@option MP再生
@value 16
@option TP再生
@value 17
@option 狙われ率
@value 18
@option 防御効果率
@value 19
@option 回復効果率
@value 20
@option 薬の知識
@value 21
@option MP消費率
@value 22
@option TPチャージ率
@value 23
@option 物理ダメージ率
@value 24
@option 魔法ダメージ率
@value 25
@option 床ダメージ率
@value 26
@option 経験獲得率
@value 27

@param formula
@text 計算式
@desc パラメータを計算するJavaScript式です。ヘルプを参考に式を設定してください。バトラーオブジェクトを[a]として参照可能です。
@default
@type multiline_string

@param tagName
@text メモタグ名
@desc バトラーが指定したメモ欄を持っている場合のみ計算式を適用します。
@default
*/

(()=> {
    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);
    if (!param.formulaList) {
        param.formulaList = [];
    }
    const formulas = [];
    param.formulaList.forEach(item => {
        if (!formulas[item.paramId]) {
            formulas[item.paramId] = [];
        }
        formulas[item.paramId].push({
            formula: item.formula,
            tagName: item.tagName
        });
    });

    Game_BattlerBase._paramNumber = 8;
    Game_BattlerBase._xParamNumber = 10;
    Game_BattlerBase._sParamNumber = 10;

    Game_BattlerBase.prototype.getParamFormula = function(paramId) {
        if (!formulas[paramId]) {
            return null;
        }
        return formulas[paramId].find(item =>
            item.tagName ? this.traitObjects().some(obj => obj.meta[item.tagName]) : true
        )?.formula;
    };

    Game_BattlerBase.prototype.getDynamicParam = function(paramId, param, baseFlag) {
        if (this._calcParameter) {
            return param;
        }
        this._calcParameter = true;
        this._baseFlag = baseFlag;
        const formula = this.getParamFormula(paramId);
        const a = this;
        const dynamicParam = formula ? this.roundParamIfNeed(paramId, eval(formula)) : param;
        this._calcParameter = false;
        this._baseFlag = false;
        if (isNaN(dynamicParam)) {
            PluginManagerEx.throwError(`Invalid value ${dynamicParam} paramId:${paramId} formula:${formula}`, script);
        }
        return dynamicParam;
    };

    Game_BattlerBase.prototype.roundParamIfNeed = function(paramId, formulaResult) {
        return paramId < Game_BattlerBase._paramNumber ? Math.round(formulaResult) : formulaResult;
    };

    Game_BattlerBase.prototype.special = function(tagName) {
        let value = 0;
        this.traitObjects().forEach(obj => {
            value += obj.meta[tagName] ? parseInt(obj.meta[tagName]) : 0;
        });
        return Math.round(value);
    };

    const _Game_BattlerBase_param = Game_BattlerBase.prototype.param;
    Game_BattlerBase.prototype.param = function(paramId) {
        if (this._calcParameter) {
            return this._baseFlag ? this.paramBase(paramId) : _Game_BattlerBase_param.apply(this, arguments);
        } else {
            return _Game_BattlerBase_param.apply(this, arguments);
        }
    };

    const _Game_BattlerBase_xparam = Game_BattlerBase.prototype.xparam;
    Game_BattlerBase.prototype.xparam = function(xparamId) {
        if (this._calcParameter) {
            return _Game_BattlerBase_xparam.apply(this, arguments);
        } else {
            const paramId = xparamId + Game_BattlerBase._paramNumber;
            return this.getDynamicParam(paramId, _Game_BattlerBase_xparam.apply(this, arguments), false);
        }
    };

    const _Game_BattlerBase_sparam = Game_BattlerBase.prototype.sparam;
    Game_BattlerBase.prototype.sparam = function(sparamId) {
        if (this._calcParameter) {
            return _Game_BattlerBase_sparam.apply(this, arguments);
        } else {
            const paramId = sparamId + Game_BattlerBase._paramNumber + Game_BattlerBase._xParamNumber;
            return this.getDynamicParam(paramId, _Game_BattlerBase_sparam.apply(this, arguments), false);
        }
    };

    const _Game_Actor_paramBase = Game_Actor.prototype.paramBase;
    Game_Actor.prototype.paramBase = function(paramId) {
        return this.getDynamicParam(paramId, _Game_Actor_paramBase.apply(this, arguments), true);
    };

    const _Game_Enemy_paramBase = Game_Enemy.prototype.paramBase;
    Game_Enemy.prototype.paramBase = function(paramId) {
        return this.getDynamicParam(paramId, _Game_Enemy_paramBase.apply(this, arguments), true);
    };
})();