//=============================================================================
// ConditionalState.js
// ----------------------------------------------------------------------------
// (C)2017 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.3.0 2025/07/16 ステート付与の条件をレートではなく直接値にできるタグを追加
// 1.2.1 2024/05/39 1.2.0の修正で戦闘画面に入るとエラーになっていた問題を修正
// 1.2.0 2024/05/30 装備品にタグを付けていたとき、その装備品を外したときにステートが解除されない問題を修正
// 1.1.1 2023/02/26 1.1.0の修正が一部不完全だった問題を修正
// 1.1.0 2023/02/20 戦闘開始時に自動付与の再チェックを実施するよう仕様変更
// 1.0.4 2023/02/20 全回復や初期化の操作の時に自動付与が解除されてしまう問題を修正
// 1.0.3 2021/07/23 上回った場合の判定処理が正常に機能していなかった問題を修正
// 1.0.2 2020/09/06 条件付きステートが付与されている状態で装備変更するとエラーになる問題を修正
// 1.0.1 2020/08/16 戦闘不能から復帰したときに正常にステートが付与されない問題を修正
// 1.0.0 2017/04/22 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/ConditionalState.js
@plugindesc Conditional State Grant Plugin
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

A state will be granted when the remaining HP or MP conditions are met.
Enter the following in the memo field with the characteristic (※1).
※1 However, behavior when assigning tags to states has not been confirmed.

<CS_UpperHP:30,4> # When current HP exceeds 30%, grants State [4].
<CS_UpperHp:30,4> # Same as above.
<CS_LowerHP:40,5> # When current HP falls below 40%, grants State [5].
<CS_LowerHp:40,5> # Same as above.
<CS_UpperMP:30,4> # When current MP exceeds 30%, grants State [4].
<CS_UpperMp:30,4> # Same as above.
<CS_LowerMP:40,5> # When current MP falls below 40%, grants State [5].
<CS_LowerMp:40,5> # Same as above.
<CS_UpperTP:30,4> # When current TP exceeds 30%, grants State [4].
<CS_UpperTp:30,4> # Same as above.
<CS_LowerTP:40,5> # Grants State [5] when current TP falls below 40%.
<CS_LowerTp:40,5> # Same as above.

You can also specify the condition directly as a value instead of a
percentage.
<CS_UpperHPValue:30,4> # When current HP exceeds 30, grants State [4].
<CS_UpperHpValue:30,4> # Same as above.
<CS_LowerHPValue:40,5> # When current HP falls below 40, grants State [5].
<CS_LowerHpValue:40,5> # Same as above.
<CS_UpperMPValue:30,4> # When current MP exceeds 30, grants State [4].
<CS_UpperMpValue:30,4> # Same as above.
<CS_LowerMPValue:40,5> # When current MP falls below 40, grants State [5].
<CS_LowerMpValue:40,5> # Same as above.
<CS_UpperTPValue:30,4> # When current TP exceeds 30, grants State [4].
<CS_UpperTpValue:30,4> # Same as above.
<CS_LowerTPValue:40,5> # Grants State [5] when current TP falls below 40.
<CS_LowerTpValue:40,5> # Same as above

While the similar plugin "AutomaticState.js" sets it on a per-state basis,
this plugin sets it on a per-battler basis.

States specified by this plugin can be canceled by specifying a cancellation
condition or using an event command, but they are not intended to be canceled
by design. Please note.

This plugin does not have a plugin command.

Terms of Use:
You may modify and redistribute this plugin without permission, and there are
no restrictions on its use (commercial, R18+, etc.).
This plugin is now yours.
*/

/*:ja
@plugindesc 条件付きステート付与プラグイン
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/ConditionalState.js
@author トリアコンタン

@help HPやMPの残量の条件を満たしたときにステートを付与します。
特徴(※1)を有するメモ欄に以下の通り入力してください。
※1 ただし、ステートにタグを付与した場合の動作は未確認です。

<CS_上限HP:30,4>  # 現在のHPが30%を上回るとステート[4]を付与
<CS_UpperHp:30,4> # 同上
<CS_下限HP:40,5>  # 現在のHPが40%を下回るとステート[5]を付与
<CS_LowerHp:40,5> # 同上
<CS_上限MP:30,4>  # 現在のMPが30%を上回るとステート[4]を付与
<CS_UpperMp:30,4> # 同上
<CS_下限MP:40,5>  # 現在のMPが40%を下回るとステート[5]を付与
<CS_LowerMp:40,5> # 同上
<CS_上限TP:30,4>  # 現在のTPが30%を上回るとステート[4]を付与
<CS_UpperTp:30,4> # 同上
<CS_下限TP:40,5>  # 現在のTPが40%を下回るとステート[5]を付与
<CS_LowerTp:40,5> # 同上

条件を割合ではなく直接値で指定することもできます。
<CS_上限HP値:30,4>  # 現在のHPが30を上回るとステート[4]を付与
<CS_UpperHpValue:30,4> # 同上
<CS_下限HP値:40,5>  # 現在のHPが40を下回るとステート[5]を付与
<CS_LowerHpValue:40,5> # 同上
<CS_上限MP値:30,4>  # 現在のMPが30を上回るとステート[4]を付与
<CS_UpperMpValue:30,4> # 同上
<CS_下限MP値:40,5>  # 現在のMPが40を下回るとステート[5]を付与
<CS_LowerMpValue:40,5> # 同上
<CS_上限TP値:30,4>  # 現在のTPが30を上回るとステート[4]を付与
<CS_UpperTpValue:30,4> # 同上
<CS_下限TP値:40,5>  # 現在のTPが40を下回るとステート[5]を付与
<CS_LowerTpValue:40,5> # 同上

類似プラグイン「AutomaticState.js」はステート単位で設定しますが
こちらはバトラー単位で設定します。

本プラグインで指定したステートは解除条件の指定や
イベントコマンドから解除できますが、解除されることは仕様上
想定していません。ご注意ください。

このプラグインにはプラグインコマンドはありません。

利用規約：
 作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 についても制限はありません。
 このプラグインはもうあなたのものです。
*/

(function() {
    'use strict';
    const metaTagPrefix = 'CS_';

    //=============================================================================
    // ローカル関数
    //  プラグインパラメータやプラグインコマンドパラメータの整形やチェックをします
    //=============================================================================
    const getMetaValue = function(object, name) {
        const metaTagName = metaTagPrefix + name;
        return object.meta.hasOwnProperty(metaTagName) ? convertEscapeCharacters(object.meta[metaTagName]) : undefined;
    };

    const getMetaValues = function(object, names) {
        for (let i = 0, n = names.length; i < n; i++) {
            const value = getMetaValue(object, names[i]);
            if (value !== undefined) return value;
        }
        return undefined;
    };

    const convertEscapeCharacters = function(text) {
        if (!isString(text)) text = '';
        text = text.replace(/\\/g, "\x1b");
        text = text.replace(/\x1b\x1b/g, "\\");
        text = text.replace(/\x1bV\[(\d+)\]/gi, (_, p1) =>
            $gameVariables.value(parseInt(p1))
        );
        text = text.replace(/\x1bV\[(\d+)\]/gi, (_, p1) =>
            $gameVariables.value(parseInt(p1))
        );
        text = text.replace(/\x1bN\[(\d+)\]/gi, (_, p1) =>
            this.actorName(parseInt(p1))
        );
        text = text.replace(/\x1bP\[(\d+)\]/gi, (_, p1) =>
            this.partyMemberName(parseInt(p1))
        );
        text = text.replace(/\x1bG/gi, TextManager.currencyUnit);
        return text;
    };

    const isString = function(args) {
        return String(args) === args;
    };

    const getArgArrayString = function(args) {
        const values = args.split(',');
        for (let i = 0; i < values.length; i++) {
            values[i] = values[i].trim();
        }
        return values;
    };

    const getArgArrayNumber = function(args, min, max) {
        const values = getArgArrayString(args, false);
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        for (let i = 0; i < values.length; i++) {
            values[i] = (parseFloat(values[i]) || 0).clamp(min, max);
        }
        return values;
    };

    const _BattleManager_setup = BattleManager.setup;
    BattleManager.setup = function(troopId, canEscape, canLose) {
        _BattleManager_setup.apply(this, arguments);
        $gameParty.members().forEach(actor => actor.refreshConditionalState());
    };

    //=============================================================================
    // Game_BattlerBase
    //  オートステートをチェックします。
    //=============================================================================
    const _Game_BattlerBase_refresh = Game_BattlerBase.prototype.refresh;
    Game_BattlerBase.prototype.refresh = function() {
        _Game_BattlerBase_refresh.apply(this, arguments);
        this.refreshConditionalState();
    };

    const _Game_BattlerBase_recoverAll = Game_BattlerBase.prototype.recoverAll;
    Game_BattlerBase.prototype.recoverAll = function() {
        _Game_BattlerBase_recoverAll.apply(this, arguments);
        this.refreshConditionalState();
    };

    Game_BattlerBase.prototype.refreshConditionalState = function() {};

    Game_Battler.prototype.refreshConditionalState = function() {
        if (this.isDead()) {
            return;
        }
        const prevConditionalStates = this._conditionalStates || [];
        this._conditionalStates = [];
        this.updateConditionalStateUpper(this.hpRate() * 100, ['UpperHp', '上限HP']);
        this.updateConditionalStateUpper(this.mpRate() * 100, ['UpperMp', '上限MP']);
        this.updateConditionalStateUpper(this.tpRate() * 100, ['UpperTp', '上限TP']);
        this.updateConditionalStateLower(this.hpRate() * 100, ['LowerHp', '下限HP']);
        this.updateConditionalStateLower(this.mpRate() * 100, ['LowerMp', '下限MP']);
        this.updateConditionalStateLower(this.tpRate() * 100, ['LowerTp', '下限TP']);
        this.updateConditionalStateUpper(this.hp, ['UpperHpValue', '上限HP値']);
        this.updateConditionalStateUpper(this.mp, ['UpperMpValue', '上限MP値']);
        this.updateConditionalStateUpper(this.tp, ['UpperTpValue', '上限TP値']);
        this.updateConditionalStateLower(this.hp, ['LowerHpValue', '下限HP値']);
        this.updateConditionalStateLower(this.mp, ['LowerMpValue', '下限MP値']);
        this.updateConditionalStateLower(this.tp, ['LowerTpValue', '下限TP値']);
        prevConditionalStates.forEach(stateId => {
            if (!this._conditionalStates.includes(stateId)) {
                this.removeState(stateId);
            }
        });
    };

    Game_Battler.prototype.addConditionalState = function(stateId) {
        this.addState(stateId);
        this._conditionalStates.push(stateId);
    };

    Game_Battler.prototype.updateConditionalStateUpper = function(value, names) {
        const stateCondition = this.getMetaInfoConditionalState(names);
        if (!stateCondition) return;
        if (stateCondition[0] < value) {
            this.addConditionalState(stateCondition[1]);
        }
    };

    Game_Battler.prototype.updateConditionalStateLower = function(value, names) {
        const stateCondition = this.getMetaInfoConditionalState(names);
        if (!stateCondition) return;
        if (value < stateCondition[0]) {
            this.addConditionalState(stateCondition[1]);
        }
    };

    Game_BattlerBase.prototype.getMetaInfoConditionalState = function(names) {
        let stateCondition = null;
        this.traitObjects().some(function(traitObject) {
            stateCondition = getMetaValues(traitObject, names);
            return !!stateCondition;
        });
        return (isString(stateCondition) ? getArgArrayNumber(stateCondition) : null);
    };
})();