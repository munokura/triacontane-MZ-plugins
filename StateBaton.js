/*=============================================================================
 StateBaton.js
----------------------------------------------------------------------------
 (C)2024 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2024/06/16 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/StateBaton.js
@plugindesc Baton State Plugin
@author Triacontane
@license MIT License

@help
English Help Translator: munokura
Please check the URL below for the latest version of the plugin.
URL https://triacontane.blogspot.com
-----

StateBaton.js

You can create a state that transfers a state to another member when a player
is KO'd.

It has the following features and specifications:

- The member range can be selected as all allies or all allies and enemies.
- When a player is KO'd, the state is automatically assigned to another
randomly selected member.
- If the removal conditions are met other than KO, the state is automatically
removed.
- When a Baton State is assigned, any members who already have it assigned
will be removed.

This plugin requires the base plugin "PluginCommonBase.js."
"PluginCommonBase.js" is located in the following folder under the RPG Maker
MZ installation folder:

dlc/BasicResources/plugins/official

Terms of Use:
You may modify and redistribute this plugin without permission, and there are
no restrictions on its use (commercial, 18+, etc.).

This plugin is now yours.

@param states
@text List of Baton States
@desc This is a list of baton state settings.
@type struct<State>[]
@default []
*/

/*~struct~State:
@param stateId
@text State ID
@desc Baton State target ID.
@type state
@default 1

@param target
@text subject
@desc The group of members to whom the baton state is passed.
@type select
@default friendAll
@option All allies
@value friendAll
@option All enemies and allies
@value all

@param removeIfAdded
@text Cancelled when state is granted
@desc When a Baton State is given to someone, if there are any members who already have the state enabled, it will be removed.
@type boolean
@default true
*/

/*:ja
@plugindesc バトンステートプラグイン
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/StateBaton.js
@base PluginCommonBase
@orderAfter PluginCommonBase
@author トリアコンタン

@param states
@text バトンステート一覧
@desc バトンステートの設定リストです。
@type struct<State>[]
@default []

@help StateBaton.js

戦闘不能時に別のメンバにステートが渡されるようなステートを作成できます。
以下の機能、仕様があります。
・メンバの範囲は味方全体と敵味方全体とを選択可能
・戦闘不能時にランダム選出の別メンバにステートが自動で付与される
・戦闘不能以外で解除条件を満たした場合は、そのまま解除される
・バトンステート付与時、すでに付与されていたメンバがいれば解除される

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
@desc バトンステートの対象IDです。
@default 1
@type state

@param target
@text 対象
@desc バトンステートの受け渡し対象となるメンバ群です。
@default friendAll
@type select
@option 味方全体
@value friendAll
@option 敵味方全体
@value all

@param removeIfAdded
@text ステート付与時に解除
@desc バトンステートが誰かに付与されたとき、メンバ内ですでにステートが有効になっているメンバがいたら解除されます。
@default true
@type boolean
*/

(() => {
    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);
    if (!param.states) {
        return;
    }

    const _Game_BattlerBase_die = Game_BattlerBase.prototype.die;
    Game_BattlerBase.prototype.die = function() {
        this.transferBatonState();
        _Game_BattlerBase_die.apply(this, arguments);
    };

    const _Game_BattlerBase_addNewState = Game_BattlerBase.prototype.addNewState;
    Game_BattlerBase.prototype.addNewState = function(stateId) {
        _Game_BattlerBase_addNewState.apply(this, arguments);
        const state = param.states.find(state => state.stateId === stateId);
        if (state && state.removeIfAdded) {
            this.removeBatonState(state);
        }
    };

    Game_BattlerBase.prototype.transferBatonState = function() {
        param.states.forEach(state => {
            const stateId = state.stateId;
            if (this.isStateAffected(stateId)) {
                this.transferBatonStateToMember(state);
            }
        });
    };

    Game_BattlerBase.prototype.transferBatonStateToMember = function(state) {
        const targetMembers = this.findBatonStateMembers(state);
        if (targetMembers.length === 0) {
            return;
        }
        const battler = targetMembers[Math.randomInt(targetMembers.length)];
        battler.addState(state.stateId);
        BattleManager._logWindow.displayAutoAffectedStatus(battler);
    };

    Game_BattlerBase.prototype.findBatonStateMembers = function(state) {
        const friends = this.friendsUnit().aliveMembers().filter(member => member !== this);
        if (state.target === 'all') {
            return friends.concat(this.opponentsUnit().aliveMembers());
        } else {
            return friends;
        }
    };

    Game_BattlerBase.prototype.removeBatonState = function(state) {
        const targetMembers = this.findBatonStateMembers(state);
        targetMembers.filter(member => member !== this)
            .forEach(member => member.removeState(state.stateId));
    };
})();