/*=============================================================================
 HitAndEvasionExtend.js
----------------------------------------------------------------------------
 (C)2018 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.3.0 2024/07/21 命中しなかった場合のメッセージ種別を物理魔法ごとに変更できる機能を追加
 1.2.1 2021/08/08 計算式の間違いを修正
 1.2.0 2021/08/08 MZ向けにリファクタリング
 1.1.0 2021/08/08 デフォルトの計算式をプラグインパラメータのデフォルト値に設定
 1.0.1 2020/04/23 計算式で使用者[a]と対象者[b]のローカル変数が正常に機能していなかった問題を修正
 1.0.0 2018/07/08 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/HitAndEvasionExtend.js
@plugindesc Hit Avoidance Extension Plugin
@author Triacontane
@license MIT License

@help
English Help Translator: munokura
Please check the URL below for the latest version of the plugin.
URL https://triacontane.blogspot.com
-----

HitAndEvasionExtend.js

Extends the hit and evasion calculation formulas.
You can specify hit and evasion calculation formulas for physical and magical
attacks via parameters.
As a general rule, the result of the formula should be between "0" and "1."
Values below "0" are treated as 0%, and values above "1" are treated as 100%.

The formula specifies a JavaScript formula, so please be careful of syntax
errors.
As with the damage formula, the user is referenced as "a" and the target as
"b."
For details, see the tooltip for the damage formula in the database.
(Example)
a.atk: User's attack power
b.agi: Target's agility
You can also reference the default hit and evasion results with "d."
You can reference the skill success rate with "r."
Game variable values can be referenced using the control character "\v[n]."

[Reference] The default calculation formula is as follows.
If either the hit or evasion check fails, the action will fail.
・Physical Hit
Skill Success Rate * User Hit Rate

・Magic Hit
Skill Success Rate

・Physical Evasion
Target Evasion Rate

・Magic Evasion
Target Magic Evasion Rate

This plugin requires the base plugin "PluginCommonBase.js."
"PluginCommonBase.js" is located in the following folder under the RPG Maker
MZ installation folder:
dlc/BasicResources/plugins/official

Terms of Use:
You may modify and redistribute this plugin without permission, and there are
no restrictions on its use (commercial, 18+, etc.).
This plugin is now yours.

@param formulaPhysicalHit
@text Physical hit calculation formula
@desc Set the physical hit calculation formula. If left blank, the default result will be returned.
@default r * a.hit

@param formulaMagicalHit
@text Magic hit calculation formula
@desc Set the magic hit calculation formula. If left blank, the default result will be returned.
@default r

@param formulaPhysicalEvasion
@text Physical avoidance formula
@desc Set the physical avoidance calculation formula. If left blank, the default result will be returned.
@default b.eva

@param formulaMagicalEvasion
@text Magic avoidance formula
@desc Set the magic evasion formula. If left blank, the default result will be returned.
@default b.mev

@param physicalFailureMessageType
@text Physical failure message type
@desc Message type when physical attack fails (miss or action failure)
@type select
@default miss
@option Miss
@value miss
@option failure of action
@value failure

@param magicalFailureMessageType
@text Spell failure message type
@desc Message type when a magic attack fails (miss or action failure)
@type select
@default failure
@option Miss
@value miss
@option failure of action
@value failure
*/

/*:ja
@plugindesc 命中回避拡張プラグイン
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/HitAndEvasionExtend.js
@base PluginCommonBase
@orderAfter PluginCommonBase
@author トリアコンタン

@param formulaPhysicalHit
@text 物理命中計算式
@desc 物理命中の計算式を設定します。空欄の場合、デフォルトの結果がそのまま返ります。
@default r * a.hit

@param formulaMagicalHit
@text 魔法命中計算式
@desc 魔法命中の計算式を設定します。空欄の場合、デフォルトの結果がそのまま返ります。
@default r

@param formulaPhysicalEvasion
@text 物理回避計算式
@desc 物理回避の計算式を設定します。空欄の場合、デフォルトの結果がそのまま返ります。
@default b.eva

@param formulaMagicalEvasion
@text 魔法回避計算式
@desc 魔法回避の計算式を設定します。空欄の場合、デフォルトの結果がそのまま返ります。
@default b.mev

@param physicalFailureMessageType
@text 物理失敗メッセージ種別
@desc 物理攻撃が失敗した場合のメッセージ種別(ミス or 行動失敗)
@default miss
@type select
@option ミス
@value miss
@option 行動失敗
@value failure

@param magicalFailureMessageType
@text 魔法失敗メッセージ種別
@desc 魔法攻撃が失敗した場合のメッセージ種別(ミス or 行動失敗)
@default failure
@type select
@option ミス
@value miss
@option 行動失敗
@value failure

@help HitAndEvasionExtend.js

命中と回避の計算式を拡張します。
パラメータにて物理、魔法ごとに命中計算式、回避計算式を指定できます。
計算式の結果は原則「0」～「1」の範囲に収まるように設定してください。
「0」以下だと0%、「1」以上だと100%として扱われます。

計算式はJavaScript計算式を指定しますので文法エラーにはご注意ください。
ダメージ計算式と同様に、使用者を「a」、対象者を「b」で参照します。
詳細はデータベースのダメージ計算式のtooltipを参照してください。
(例)
a.atk : 使用者の攻撃力
b.agi : 対象者の敏捷性
またデフォルトの判定結果を「d」で参照できます。
スキルの成功率を「r」で参照できます。
ゲーム変数の値は制御文字「\v[n]」で参照できます。

【参考】デフォルトの計算式は以下の通りです。
命中判定もしくは回避判定のいずれかで失敗すると行動は失敗となります。
・物理命中
スキルの成功率 * 実行者の命中率

・魔法命中
スキルの成功率

・物理回避
対象者の回避率

・魔法回避
対象者の魔法回避率

このプラグインの利用にはベースプラグイン『PluginCommonBase.js』が必要です。
『PluginCommonBase.js』は、RPGツクールMZのインストールフォルダ配下の
以下のフォルダに格納されています。
dlc/BasicResources/plugins/official

利用規約：
 作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 についても制限はありません。
 このプラグインはもうあなたのものです。
*/

(()=> {
    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);

    const _Game_Action_itemHit = Game_Action.prototype.itemHit;
    Game_Action.prototype.itemHit = function(target) {
        const a = this.subject();
        const b = target;
        const d = _Game_Action_itemHit.apply(this, arguments);
        const r = this.item().successRate * 0.01;
        if (this.isPhysical() && param.formulaPhysicalHit !== '') {
            return eval(param.formulaPhysicalHit);
        } else if (this.isMagical() && param.formulaMagicalHit !== '') {
            return eval(param.formulaMagicalHit);
        }
        return d;
    };

    const _Game_Action_itemEva = Game_Action.prototype.itemEva;
    Game_Action.prototype.itemEva = function(target) {
        const a = this.subject();
        const b = target;
        const d = _Game_Action_itemEva.apply(this, arguments);
        const r = this.item().successRate * 0.01;
        if (this.isPhysical() && param.formulaPhysicalEvasion !== '') {
            return eval(param.formulaPhysicalEvasion);
        } else if (this.isMagical() && param.formulaMagicalEvasion !== '') {
            return eval(param.formulaMagicalEvasion);
        }
        return d;
    };

    const _Window_BattleLog_displayMiss = Window_BattleLog.prototype.displayMiss;
    Window_BattleLog.prototype.displayMiss = function(target) {
        const result = target.result();
        const isPhysical = result.physical;
        if (isPhysical) {
            if (param.physicalFailureMessageType === 'failure') {
                result.physical = false;
            }
        } else {
            if (param.magicalFailureMessageType === 'miss') {
                result.physical = true;
            }
        }
        _Window_BattleLog_displayMiss.apply(this, arguments);
        result.physical = isPhysical;
    };
})();