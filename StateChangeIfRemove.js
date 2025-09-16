//=============================================================================
// StateChangeIfRemove.js
// ----------------------------------------------------------------------------
// (C)2015 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 2.1.0 2024/05/02 戦闘不能によるステート解除、全回復によるステート解除でもステート変化を行えるよう修正
// 2.0.0 2021/10/08 MZで動作するよう全面的に修正
// 1.2.0 2018/08/05 ステート解除でスイッチを操作する機能を追加
// 1.1.2 2017/07/12 YEP_BattleEngineCore.jsと組み合わせたときに戦闘不能へのステート変化ができない競合を解消
// 1.1.1 2017/05/27 競合の可能性のある記述（Objectクラスへのプロパティ追加）をリファクタリング
// 1.1.0 2016/02/07 解除条件によって様々なステートIDを付与できる機能を追加
// 1.0.0 2016/02/04 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/StateChangeIfRemove.js
@plugindesc Change plugin when state is released
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

Automatically transitions to a different state when the current state is
released.
Please set the information in the plugin parameters.

This plugin requires the base plugin "PluginCommonBase.js."
"PluginCommonBase.js" is located in the following folder under the RPG Maker
MZ installation folder:

dlc/BasicResources/plugins/official

Terms of Use:
You may modify and redistribute this plugin without permission, and there are
no restrictions on its use (commercial, R18+, etc.).
This plugin is now yours.

@param list
@text State List
@desc Set the list of change states when the state is released.
@type struct<STATE>[]
@default []
*/

/*~struct~STATE:
@param targetStateId
@text Target state ID
@desc The state ID that triggers the release. Information for the same state ID cannot be defined multiple times.
@type state
@default 1

@param changeStateId
@text Change State ID
@desc This is the state ID that is assigned when the target state is released. If you want to specify the ID as a variable, use control characters.
@type state
@default 1

@param condition
@text Cancellation conditions
@desc Specifies whether the state change is enabled depending on the situation when the target state is cleared. If not specified, the state will always change.
@type select[]
@default []
@option アイテムやスキルの効果で解除
@value item
@option 歩数で解除
@value step
@option 行動制約で解除
@value restrict
@option ダメージで解除
@value damage
@option 戦闘終了時に解除
@value battleEnd
@option ターン経過等で自動解除
@value auto

@param includeDie
@text Including termination due to death
@desc The changed state will be applied even if the state is canceled due to being incapacitated.
@type boolean
@default false

@param includeRecoverAll
@text Including removal by full recovery
@desc The changed state will be applied even if the state is removed by full recovery.
@type boolean
@default false

@param triggerSwitch
@text Change Trigger Switch
@desc When the target state changes, the specified switch turns ON.
@type switch
@default 0

@param noRemoveMessage
@text Cancel message not displayed
@desc The original state cancellation message will no longer be displayed when the state changes.
@type boolean
@default false

@param noAddedMessage
@text Hide grant message
@desc The original state change message will no longer be displayed when the state changes.
@type boolean
@default false
*/

/*:ja
@plugindesc ステート解除時の変化プラグイン
@target MZ 
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/StateChangeIfRemove.js
@base PluginCommonBase
@orderAfter PluginCommonBase
@author トリアコンタン

@param list
@text ステートリスト
@desc ステート解除時の変化ステートの一覧を設定します。
@default []
@type struct<STATE>[]

@help ステートが解除されたタイミングで、自動的に別のステートに変化させます。
プラグインパラメータから情報を設定してください。

このプラグインの利用にはベースプラグイン『PluginCommonBase.js』が必要です。
『PluginCommonBase.js』は、RPGツクールMZのインストールフォルダ配下の
以下のフォルダに格納されています。
dlc/BasicResources/plugins/official

利用規約：
 作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 についても制限はありません。
 このプラグインはもうあなたのものです。
*/

/*~struct~STATE:ja
@param targetStateId
@text 対象ステートID
@desc 解除のトリガーとなるステートIDです。同一のステートIDの情報は複数定義できません。
@default 1
@type state

@param changeStateId
@text 変化ステートID
@desc 対象ステートが解除されたときに付与されるステートIDです。IDを変数で指定したい場合は制御文字を使用してください。
@default 1
@type state

@param condition
@text 解除条件
@desc 対象ステートが解除された状況によってステート変化が有効になるかどうかを指定します。未指定の場合、常に変化します。
@default []
@type select[]
@option アイテムやスキルの効果で解除
@value item
@option 歩数で解除
@value step
@option 行動制約で解除
@value restrict
@option ダメージで解除
@value damage
@option 戦闘終了時に解除
@value battleEnd
@option ターン経過等で自動解除
@value auto

@param includeDie
@text 死亡による解除を含む
@desc 戦闘不能になることでステート解除された場合も変化ステートを付与します。
@default false
@type boolean

@param includeRecoverAll
@text 全回復による解除を含む
@desc 全回復によるステート解除された場合も変化ステートを付与します。
@default false
@type boolean

@param triggerSwitch
@text 変化トリガースイッチ
@desc 対象ステートが変化したとき、指定したスイッチがONになります。
@default 0
@type switch

@param noRemoveMessage
@text 解除メッセージ非表示
@desc ステート変化時に本来のステート解除メッセージが表示されなくなります。
@default false
@type boolean

@param noAddedMessage
@text 付与メッセージ非表示
@desc ステート変化時に本来のステート付与メッセージが表示されなくなります。
@default false
@type boolean
*/

(()=> {
    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);
    if (!param.list || param.list.length === 0) {
        console.warn('!!State list not found. by ' + PluginManagerEx.findPluginName(script));
        return;
    }

    //=============================================================================
    //  Game_Actor
    //   解除時のステート変更処理を追加
    //=============================================================================
    const _Game_Actor_updateStateSteps = Game_Actor.prototype.updateStateSteps;
    Game_Actor.prototype.updateStateSteps = function(state) {
        _Game_Actor_updateStateSteps.apply(this, arguments);
        this.changeState(state.id, 'step');
    };

    //=============================================================================
    //  Game_Action
    //   解除時のステート変更処理を追加
    //=============================================================================
    const _Game_Action_applyItemEffect = Game_Action.prototype.applyItemEffect;
    Game_Action.prototype.applyItemEffect = function(target, effect) {
        target.checkToRemoveStates(_Game_Action_applyItemEffect.bind(this), arguments, 'item');
    };

    //=============================================================================
    //  Game_Battler
    //   解除時のステート変更処理を追加
    //=============================================================================
    const _Game_BattlerBase_clearStates = Game_BattlerBase.prototype.clearStates;
    Game_BattlerBase.prototype.clearStates = function() {
        if (this._states) {
            const states = this._states.clone();
            _Game_BattlerBase_clearStates.apply(this, arguments);
            states.forEach(stateId => this.changeState(stateId, ''));
        } else {
            _Game_BattlerBase_clearStates.apply(this, arguments);
        }
    };

    const _Game_BattlerBase_recoverAll = Game_BattlerBase.prototype.recoverAll;
    Game_BattlerBase.prototype.recoverAll = function() {
        this._processRecoverAll = true;
        _Game_BattlerBase_recoverAll.apply(this, arguments);
        this._processRecoverAll = false;
    };

    const _Game_BattlerBase_die = Game_BattlerBase.prototype.die;
    Game_BattlerBase.prototype.die = function() {
        this._processDie = true;
        _Game_BattlerBase_die.apply(this, arguments);
        this._processDie = false;
    };

    Game_BattlerBase.prototype.changeState = function(stateId, condition) {}

    const _Game_Battler_removeState = Game_Battler.prototype.removeState;
    Game_Battler.prototype.removeState = function(stateId) {
        _Game_Battler_removeState.apply(this, arguments);
        this.changeState(stateId, '');
    };

    const _Game_Battler_onRestrict = Game_Battler.prototype.onRestrict;
    Game_Battler.prototype.onRestrict = function() {
        this.checkToRemoveStates(_Game_Battler_onRestrict.bind(this), arguments, 'restrict');
    };

    const _Game_Battler_removeStatesByDamage = Game_Battler.prototype.removeStatesByDamage;
    Game_Battler.prototype.removeStatesByDamage = function() {
        this.checkToRemoveStates(_Game_Battler_removeStatesByDamage.bind(this), arguments, 'damage');
    };

    const _Game_Battler_removeBattleStates = Game_Battler.prototype.removeBattleStates;
    Game_Battler.prototype.removeBattleStates = function() {
        this.checkToRemoveStates(_Game_Battler_removeBattleStates.bind(this), arguments, 'battleEnd');
    };

    const _Game_Battler_removeStatesAuto = Game_Battler.prototype.removeStatesAuto;
    Game_Battler.prototype.removeStatesAuto = function(timing) {
        this.checkToRemoveStates(_Game_Battler_removeStatesAuto.bind(this), arguments, 'auto');
    };

    const _Game_BattlerBase_updateStateTurnTiming = Game_BattlerBase.prototype.updateStateTurnTiming;
    Game_BattlerBase.prototype.updateStateTurnTiming = function(timing) {
        this.checkToRemoveStates(_Game_BattlerBase_updateStateTurnTiming.bind(this), arguments, 'auto');
    };

    Game_Battler.prototype.checkToRemoveStates = function(handler, args, tagName) {
        const prevStates = this.states();
        handler.apply(null, args);
        prevStates.forEach(state => this.changeState(state.id, tagName));
    };

    Game_Battler.prototype.changeState = function(stateId, condition) {
        const data = param.list.find(item => item.targetStateId === stateId);
        if (!data || this.hasState(stateId)) {
            return;
        } else if (data.condition && data.condition.length > 0 &&
            !data.condition.find(item => item === condition)) {
            return;
        } else if (!data.includeDie && this._processDie) {
            return;
        } else if (!data.includeRecoverAll && this._processRecoverAll) {
            return;
        }
        if (data.noRemoveMessage) {
            this._result.deleteRemovedStates(stateId);
        }
        if (data.changeStateId) {
            this.addState(data.changeStateId);
            if (data.noAddedMessage) {
                this._result.deleteAddedStates(data.changeStateId);
            }
        }
        if (data.triggerSwitch) {
            $gameSwitches.setValue(data.triggerSwitch, true);
        }
    };

    const _Game_Battler_addState = Game_Battler.prototype.addState;
    Game_Battler.prototype.addState = function(stateId) {
        if (stateId === this.deathStateId() && this._processDie) {
            return;
        }
        _Game_Battler_addState.apply(this, arguments);
    };

    Game_Battler.prototype.hasState = function(stateId) {
        return this._states.contains(stateId);
    };

    //=============================================================================
    // Game_ActionResult
    //  ステート付与、解除時のメッセージを抑制します。
    //=============================================================================
    Game_ActionResult.prototype.deleteRemovedStates = function(stateId) {
        this.removedStates.forEach((value, index) => {
            if (value === stateId) {
                this.removedStates.splice(index, 1);
            }
        });
    };

    Game_ActionResult.prototype.deleteAddedStates = function(stateId) {
        this.addedStates.forEach((value, index) => {
            if (value === stateId) {
                this.addedStates.splice(index, 1);
            }
        });
    };
})();