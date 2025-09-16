//=============================================================================
// DynamicEquipParam.js
// ----------------------------------------------------------------------------
// (C)2017 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 2.0.3 2023/12/21 specialメソッドが正常に機能しない問題を修正
// 2.0.2 2023/12/06 ヘルプに注意書きを追加
// 2.0.1 2023/10/19 変数v[n]を使う場合の注意点をヘルプに記載
// 2.0.0 2023/07/19 パフォーマンス維持のため、制御文字の変換処理を撤廃し、変数はv[n]で指定するよう変更
// 1.1.0 2021/05/03 MZで動作するよう修正
// 1.0.2 2021/05/03 動的パラメータがお店のパラメータ増減に反映されていなかった問題を修正
// 1.0.1 2017/07/23 ヘルプにアクターのレベルやIDを参照する計算式を追記
// 1.0.0 2017/07/18 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/DynamicEquipParam.js
@plugindesc Dynamic equipment parameter setting plugin
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

Dynamically changes equipment parameters based on the actor's current state.
Specify the following in the weapon and armor memo fields.
Use JavaScript formulas to set these.

<DEP_Attack:[Formula]> # Apply formula to attack power
<DEP_Defense:[Formula]> # Apply formula to defense power
<DEP_Magic:[Formula]> # Apply formula to magic power
<DEP_Magic Defense:[Formula]> # Apply formula to magic defense
<DEP_Agility:[Formula]> # Apply formula to agility
<DEP_Luck:[Formula]> # Apply formula to luck
<DEP_Max HP:[Formula]> # Apply formula to max HP
<DEP_Max MP:[Formula]> # Apply formula to max MP

The following elements can be used in formulas.
A certain level of understanding of the core script is required to use this
function.
The values of each parameter do not include any changes made by this plugin.
Please note that they also include increases or decreases due to equipment.
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
a.paramBase(id) # Stats excluding gains and losses from equipment
a.hpRate() # HP Rate (0.0 - 1.0)
a.mpRate() # MP Rate (0.0 - 1.0)
a.tpRate() # TP Rate (0.0 - 1.0)
a.special('aaa') # Value of [aaa] in the memo field (※)
a.level # Level
a.actorId() # Actor ID
a._classId # Class ID
a.currentExp() # Experience Points
v[1] # Value of variable [1]
The variable setting specifications are the same as the damage calculation
formula.
To use, explicitly assign 0 to the variable at the start of the game, etc.

*Gets the value corresponding to the specified content from the special memo
field.
<aaa:100> # a.special('aaa') returns [100].

When equipped by a specific character, it can be strengthened.
It can also be strengthened by combinations and states.

This plugin does not have plugin commands.

Terms of Use:
You may modify and redistribute it without permission from the author, and
there are no restrictions on its use (commercial, R18, etc.).
This plugin is now yours.
*/

/*:ja
@plugindesc 装備品パラメータの動的設定プラグイン
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/DynamicEquipParam.js
@base PluginCommonBase
@orderAfter PluginCommonBase
@author トリアコンタン

@help 装備品のパラメータを現在のアクターの状態に応じて動的に変更します。
武器と防具のメモ欄に以下の通り指定してください。
設定にはJavaScript計算式を使用します。

<DEP_攻撃力:[計算式]>   # 攻撃力に計算式を適用
<DEP_防御力:[計算式]>   # 防御力に計算式を適用
<DEP_魔法力:[計算式]>   # 魔法力に計算式を適用
<DEP_魔法防御:[計算式]> # 魔法防御に計算式を適用
<DEP_敏捷性:[計算式]>   # 敏捷性に計算式を適用
<DEP_運:[計算式]>       # 運に計算式を適用
<DEP_最大HP:[計算式]>   # 最大HPに計算式を適用
<DEP_最大MP:[計算式]>   # 最大MPに計算式を適用

計算式に使用できる要素は以下の通りです。
利用にはコアスクリプトに対する一定の理解が必要です。
各パラメータの値は本プラグインによる変動分は含みません。
装備品による増減も含まれるので注意してください。
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
a.paramBase(id) # 装備品による増減を含まない能力値
a.hpRate() # HPレート(0.0 - 1.0)
a.mpRate() # MPレート(0.0 - 1.0)
a.tpRate() # TPレート(0.0 - 1.0)
a.special('aaa') # メモ欄の[aaa]の値(※)
a.level        # レベル
a.actorId()    # アクターID
a._classId     # 職業ID
a.currentExp() # 経験値
v[1] # 変数[1]の値
変数の設定仕様は、ダメージ計算式と同じです。
使用する場合は、ゲーム開始時などに明示的に変数に0を代入してください。

※特徴を有するメモ欄から指定した内容に対応する数値を取得
<aaa:100> # a.special('aaa')で[100]を返す。

特定のキャラクターが装備すると強化されたり
組み合わせによる強化やステートによる強化が可能になります。

このプラグインにはプラグインコマンドはありません。

利用規約：
 作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 についても制限はありません。
 このプラグインはもうあなたのものです。
*/

(()=> {
    'use strict';

    //=============================================================================
    // Game_Actor
    //  装備品パラメータの動的設定を追加します。
    //=============================================================================
    Game_Actor._paramNames = [
        ['DEP_最大HP', 'DEP_Mhp'],
        ['DEP_最大MP', 'DEP_Mmp'],
        ['DEP_攻撃力', 'DEP_Atk'],
        ['DEP_防御力', 'DEP_Def'],
        ['DEP_魔法力', 'DEP_Mat'],
        ['DEP_魔法防御', 'DEP_Mdf'],
        ['DEP_敏捷性', 'DEP_Agi'],
        ['DEP_運', 'DEP_Luk']
    ];

    const _Game_Actor_paramPlus = Game_Actor.prototype.paramPlus;
    Game_Actor.prototype.paramPlus = function (paramId) {
        let value = _Game_Actor_paramPlus.apply(this, arguments);
        if (this._calcParam) return value;
        this._calcParam = true;
        this.equips().forEach(item => {
            if (item) value += this.paramPlusDynamic(paramId, item);
        }, this);
        this._calcParam = false;
        return value;
    };

    Game_Actor.prototype.paramPlusDynamic = function (paramId, item) {
        const names = Game_Actor._paramNames[paramId];
        const paramFormula = item.meta[names[0]] || item.meta[names[1]];
        let value = 0;
        if (paramFormula) {
            const param = item.params[paramId];
            const a = this;
            const v = $gameVariables._data;
            value = Math.round(eval(paramFormula) || 0) - param;
        }
        return value;
    };

    Game_Actor.prototype.special = function (tagName) {
        let value = 0;
        this.traitObjects().forEach(function (traitObject) {
            if (traitObject.meta.hasOwnProperty(tagName)) {
                value += parseInt(traitObject.meta[tagName]);
            }
        });
        return Math.round(value);
    };

    // override
    Window_ShopStatus.prototype.drawActorParamChange = function (x, y, actor, item1) {
        const width = this.innerWidth - this.itemPadding() - x;
        const paramId = this.paramId();
        const targetParam = actor.paramPlusDynamic(paramId, this._item) + this._item.params[paramId];
        const equipParam = item1 ? actor.paramPlusDynamic(paramId, item1) + item1.params[paramId] : 0;
        const change = targetParam - equipParam;
        this.changeTextColor(ColorManager.paramchangeTextColor(change));
        this.drawText((change > 0 ? "+" : "") + change, x, y, width, "right");
    };
})();