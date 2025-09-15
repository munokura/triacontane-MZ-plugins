/*=============================================================================
 StateEnchanter.js
----------------------------------------------------------------------------
 (C)2024 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.2.1 2024/07/16 1.2.0で付与者に対して付与したステートについて、ターゲットからステート解除されたときに付与者へのステートも解除されるよう修正
 1.2.0 2024/07/08 ステートの付与者自身に対して別のステートを付与できる機能を追加
 1.1.0 2024/06/12 ダメージのパラメータ型を数値に変更し、一定以上のダメージによって解除される機能を追加
 1.0.0 2024/06/06 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/StateEnchanter.js
@plugindesc Grantor State Plugin
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

StateEnchanter.js

You can define states that have an enchanter.
In addition to the standard release conditions, you can create states that are
released when the enchanter is incapacitated or receives a certain amount of
damage.

States enchanted through events or other means are invalid (as the enchanter
cannot be identified).
Also, states can only be released during battle.

This plugin requires the base plugin "PluginCommonBase.js."
"PluginCommonBase.js" is located in the following folder under the RPG Maker
MZ installation folder:
dlc/BasicResources/plugins/official

Terms of Use:
You may modify and redistribute this plugin without permission, and there are
no restrictions on its use (commercial, R18, etc.).
This plugin is now yours.

@param states
@text State List
@desc A list of grantor states. Duplicate state IDs cannot be specified.
@type struct<State>[]
@default []
*/

/*~struct~State:
@param stateId
@text State ID
@desc The state ID.
@type state
@default 1

@param condition
@text Cancellation conditions
@desc This is the condition for canceling the state. If you try to grant a state when the conditions for canceling are met from the beginning, the state will be immediately canceled.

@param dead
@text Incapacitated
@desc The effect will be removed if the grantor is incapacitated.
@type boolean
@default false
@parent condition

@param hpRate
@text HP ratio
@desc The effect will be removed when the grantor's HP falls below the specified percentage (percentage). If you specify 0, it will be invalid.
@type number
@default 0
@parent condition

@param mpRate
@text MP ratio
@desc The effect will be removed when the grantor's MP falls below the specified percentage. If you specify 0, it will be invalid.
@type number
@default 0
@parent condition

@param damage
@text damage
@desc The effect will be removed if the grantor receives damage equal to or greater than the specified value. This does not include damage caused by events or traits.
@type number
@default 0
@parent condition

@param validStates
@text State Granting
@desc The grantor will be removed if they enter one of the specified states.
@type state[]
@default []
@parent condition

@param invalidStates
@text Cancel state
@desc The state will be removed if the grantor removes any of the specified states (including if they were never enabled to begin with).
@type state[]
@default []
@parent condition

@param script
@text script
@desc The permission will be released if the specified script returns true. e can refer to the grantor.
@type multiline_string
@parent condition

@param addState
@text Granting state to grantor
@desc You can specify a state to grant to the grantor of the state. If the state is released, this state will also be released.
@type state[]
@default []
*/

/*:ja
@plugindesc 付与者付きステートプラグイン
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/StateEnchanter.js
@base PluginCommonBase
@orderAfter PluginCommonBase
@author トリアコンタン

@param states
@text ステート一覧
@desc 付与者付きステートのリストです。重複するステートIDは指定できません。
@default []
@type struct<State>[]

@help StateEnchanter.js

付与者が存在するステートを定義できます。
通常の解除条件に加えて、付与者が戦闘不能になった場合や一定以上のダメージを
受けた場合にも解除されるようなステートを作成できます。

イベントなどでステートを付与した場合は（付与者を特定できないので）無効です。
また、解除は戦闘画面でのみ行われます。

このプラグインの利用にはベースプラグイン『PluginCommonBase.js』が必要です。
『PluginCommonBase.js』は、RPGツクールMZのインストールフォルダ配下の
以下のフォルダに格納されています。
dlc/BasicResources/plugins/official

利用規約：
 作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 についても制限はありません。
 このプラグインはもうあなたのものです。
*/

/*~struct~State:ja

@param stateId
@text ステートID
@desc ステートIDです。
@default 1
@type state

@param condition
@text 解除条件
@desc ステートの解除条件です。解除条件を最初から満たした状態でステートを付与しようとすると即座に解除されます。

@param dead
@text 戦闘不能
@desc 付与者が戦闘不能になった場合に解除されます。
@default false
@type boolean
@parent condition

@param hpRate
@text HP割合
@desc 付与者のHPが指定した割合(100分率)より小さくなった場合に解除されます。0を指定した場合は無効です。
@default 0
@type number
@parent condition

@param mpRate
@text MP割合
@desc 付与者のMPが指定した割合(100分率)より小さくなった場合に解除されます。0を指定した場合は無効です。
@default 0
@type number
@parent condition

@param damage
@text ダメージ
@desc 付与者が指定値以上のダメージを受けた場合に解除されます。イベントや特徴による増減は含みません。
@default 0
@type number
@parent condition

@param validStates
@text ステート付与
@desc 付与者が、指定したいずれかのステートになった場合に解除されます。
@default []
@type state[]
@parent condition

@param invalidStates
@text ステート解除
@desc 付与者が、指定したいずれかのステートを解除された（最初から有効になっていない場合含む）場合に解除されます。
@default []
@type state[]
@parent condition

@param script
@text スクリプト
@desc 指定したスクリプトがtrueを返すと解除されます。eは付与者を参照できます。
@default
@type multiline_string
@parent condition

@param addState
@text 付与者へのステート付与
@desc ステートの付与者に対して付与するステートを指定できます。ステートが解除された場合、このステートも解除されます。
@default []
@type state[]
*/

(() => {
    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);
    if (!param.states) {
        return;
    }

    const _Game_Action_itemEffectAddState = Game_Action.prototype.itemEffectAddState;
    Game_Action.prototype.itemEffectAddState = function(target, effect) {
        BattleManager.setStateEnchanter(this.subject());
        _Game_Action_itemEffectAddState.apply(this, arguments);
        BattleManager.setStateEnchanter(null);
    };

    const _Game_Battler_onDamage = Game_Battler.prototype.onDamage;
    Game_Battler.prototype.onDamage = function(value) {
        _Game_Battler_onDamage.apply(this, arguments);
        BattleManager.setEnchanterDamaged(this, value);
    };

    const _Game_Battler_addState = Game_Battler.prototype.addState;
    Game_Battler.prototype.addState = function(stateId) {
        _Game_Battler_addState.apply(this, arguments);
        BattleManager.appendEnchanterState(stateId, this);
    };

    const _BattleManager_update = BattleManager.update;
    BattleManager.update = function(timeActive) {
        _BattleManager_update.apply(this, arguments);
        this.updateEnchanterStates();
    };

    BattleManager.updateEnchanterStates = function() {
        this._enchanterStates = this._enchanterStates.filter(state => state.update());
    };

    BattleManager._enchanterStates = [];
    BattleManager.setStateEnchanter = function(battler) {
        this._enchanter = battler;
    };

    BattleManager.appendEnchanterState = function(stateId, target) {
        if (!this._enchanter) {
            return;
        }
        const state = param.states.find(state => state.stateId === stateId);
        if (state) {
            this._enchanterStates.push(new Game_StateEnchanter(stateId, this._enchanter, target, state));
        }
    };

    BattleManager.setEnchanterDamaged = function(battler, value) {
        this._enchanterStates.forEach(state => state.setDamaged(battler, value));
    };

    class Game_StateEnchanter {
        constructor(stateId, enchanter, target, condition) {
            this._stateId = stateId;
            this._enchanter = enchanter;
            this._target = target;
            this._condition = condition;
            this._damageValue = 0;
            this.addStateForEnchanter();
        }

        addStateForEnchanter() {
            const c = this._condition;
            if (!c.addState) {
                return;
            }
            c.addState.forEach(stateId => this._enchanter.addState(stateId));
        }

        removeStateForEnchanter() {
            const c = this._condition;
            if (!c.addState) {
                return;
            }
            c.addState.forEach(stateId => this._enchanter.removeState(stateId));
        }

        isExpired() {
            if (!$gameParty.members().concat($gameTroop.members()).includes(this._enchanter)) {
                return true;
            } else {
                return !this._target.isStateAffected(this._stateId);
            }
        }

        setDamaged(battler, value) {
            if (battler === this._enchanter) {
                this._damageValue += value;
            }
        }

        update() {
            if (this._target.isStateAffected(this._stateId) && this.isRemovable()) {
                this._target.removeState(this._stateId);
                BattleManager._logWindow.displayRemovedStates(this._target);
            }
            const expired = this.isExpired();
            if (expired) {
                this.removeStateForEnchanter();
            }
            return !expired;
        }

        isRemovable() {
            if (this.isExpired()) {
                return true;
            }
            const c = this._condition;
            const e = this._enchanter;
            const conditions = [
                () => c.dead && e.isDead(),
                () => c.damage > 0 && this._damageValue >= c.damage,
                () => c.validStates && c.validStates.some(stateId => e.isStateAffected(stateId)),
                () => c.invalidStates && c.invalidStates.some(stateId => !e.isStateAffected(stateId)),
                () => c.hpRate > 0 && e.hpRate() < c.hpRate / 100,
                () => c.mpRate > 0 && e.mpRate() < c.mpRate / 100,
                () => c.script && eval(c.script)
            ];
            return conditions.some(func => func());
        }
    }
})();