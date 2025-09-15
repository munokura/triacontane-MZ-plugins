/*=============================================================================
 StateFailedMessage.js
----------------------------------------------------------------------------
 (C)2023 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.1.0 2023/03/01 ステート解除の判定に失敗したパターンの失敗メッセージを表示できる機能を追加
 1.0.0 2023/02/10 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/StateFaildMessage.js
@plugindesc State Grant Failure Message Plugin
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

StateFailedMessage.js

You can set a special message to be displayed when a state assignment or
removal fails.
Please register the message using the parameters.
%1 will be converted to the target user's name.

This plugin requires the base plugin "PluginCommonBase.js."
"PluginCommonBase.js" is located in the following folder under the RPG Maker
MZ installation folder:
dlc/BasicResources/plugins/official

Terms of Use:
You may modify and redistribute this plugin without permission, and there are
no restrictions on its use (commercial, 18+, etc.).
This plugin is now yours.

@param messageList
@text Message List
@desc Registers state grant related failure messages.
@type struct<MESSAGE>[]
@default []
*/

/*~struct~MESSAGE:
@param stateId
@text Target state ID
@desc The state ID for which the message is to be posted.
@type state
@default 1

@param resistStates
@text Invalid Message
@desc Message when prevented by a state nullification feature (does not include state validity or failure of the action itself)

@param removedFailedStates
@text Unlock failure message
@desc Message displayed when the state reset fails. If the target state was not set in the first place.

@param removedJudgeFailedStates
@text Release determination failure message
@desc Message displayed when the state removal fails. If the success check for the state removal effect fails.
*/

/*:ja
@plugindesc ステート付与失敗メッセージプラグイン
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/StateFaildMessage.js
@base PluginCommonBase
@orderAfter PluginCommonBase
@author トリアコンタン

@param messageList
@text メッセージリスト
@desc ステート付与関連の失敗メッセージを登録します。
@default []
@type struct<MESSAGE>[]

@help StateFailedMessage.js

ステートの付与や解除に失敗した場合の専用メッセージを設定できます。
パラメータからメッセージを登録してください。
%1で対象者の名前に変換されます。

このプラグインの利用にはベースプラグイン『PluginCommonBase.js』が必要です。
『PluginCommonBase.js』は、RPGツクールMZのインストールフォルダ配下の
以下のフォルダに格納されています。
dlc/BasicResources/plugins/official

利用規約：
 作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 についても制限はありません。
 このプラグインはもうあなたのものです。
*/

/*~struct~MESSAGE:ja

@param stateId
@text 対象ステートID
@desc メッセージを登録する対象のステートIDです。
@default 1
@type state

@param resistStates
@text 無効メッセージ
@desc ステート無効化の特徴で防がれた場合のメッセージ（ステート有効度や行動自体の失敗は対象外）
@default

@param removedFailedStates
@text 解除失敗メッセージ
@desc ステート解除が失敗した場合のメッセージ。最初から対象ステートに掛かっていなかった場合
@default

@param removedJudgeFailedStates
@text 解除判定失敗メッセージ
@desc ステート解除が失敗した場合のメッセージ。ステート解除効果の成功判定に失敗した場合
@default
*/

(() => {
    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);
    if (!param.messageList) {
        param.messageList = [];
    }

    DataManager.findStateFailedMessage = function(stateId) {
        return param.messageList.find(item => item.stateId === stateId) || {};
    }

    const _Game_Action_itemEffectRemoveState = Game_Action.prototype.itemEffectRemoveState;
    Game_Action.prototype.itemEffectRemoveState = function(target, effect) {
        _Game_Action_itemEffectRemoveState.apply(this, arguments);
        if (target.isStateAffected(effect.dataId)) {
            target.result().pushRemovedJudgeFailedState(effect.dataId);
        }
    };

    const _Game_ActionResult_clear = Game_ActionResult.prototype.clear;
    Game_ActionResult.prototype.clear = function() {
        _Game_ActionResult_clear.apply(this, arguments);
        this.resistStates = [];
        this.removedFailedStates = [];
        this.removedJudgeFailedStates = [];
    };

    const _Game_ActionResult_isStatusAffected = Game_ActionResult.prototype.isStatusAffected;
    Game_ActionResult.prototype.isStatusAffected = function() {
        return _Game_ActionResult_isStatusAffected.apply(this, arguments) ||
            this.resistStates.length > 0 ||
            this.removedFailedStates.length > 0;
    };

    Game_ActionResult.prototype.pushResistState = function(stateId) {
        if (!this.resistStates.includes(stateId) && !this.isStateAdded(stateId)) {
            this.resistStates.push(stateId);
        }
    };

    Game_ActionResult.prototype.pushRemovedFailedState = function(stateId) {
        if (!this.removedFailedStates.includes(stateId) && !this.isStateRemoved(stateId)) {
            this.removedFailedStates.push(stateId);
        }
    };

    Game_ActionResult.prototype.pushRemovedJudgeFailedState = function(stateId) {
        if (!this.removedJudgeFailedStates.includes(stateId)) {
            this.removedJudgeFailedStates.push(stateId);
        }
    };

    const _Game_Battler_addState = Game_Battler.prototype.addState;
    Game_Battler.prototype.addState = function(stateId) {
        _Game_Battler_addState.apply(this, arguments);
        if (this.isStateResist(stateId)) {
            this._result.pushResistState(stateId);
        }
    };

    const _Game_Battler_removeState = Game_Battler.prototype.removeState;
    Game_Battler.prototype.removeState = function(stateId) {
        _Game_Battler_removeState.apply(this, arguments);
        this._result.pushRemovedFailedState(stateId);
    };

    const _Window_BattleLog_displayChangedStates = Window_BattleLog.prototype.displayChangedStates;
    Window_BattleLog.prototype.displayChangedStates = function(target) {
        _Window_BattleLog_displayChangedStates.apply(this, arguments);
        this.displayFailedStates(target, 'resistStates');
        this.displayFailedStates(target, 'removedFailedStates');
        this.displayFailedStates(target, 'removedJudgeFailedStates');
    };

    Window_BattleLog.prototype.displayFailedStates = function(target, property) {
        const states = target.result()[property];
        for (const stateId of states) {
            const stateText = DataManager.findStateFailedMessage(stateId)[property];
            if (stateText) {
                this.push("popBaseLine");
                this.push("pushBaseLine");
                this.push("addText", stateText.format(target.name()));
                this.push("waitForEffect");
            }
        }
    };
})();