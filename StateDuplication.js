/*=============================================================================
 StateDuplication.js
----------------------------------------------------------------------------
 (C)2024 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2024/02/01 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/StateDuplication.js
@plugindesc State Layering Plugin
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

StateDuplication.js

When a state is enabled, if the same state is already in effect, it can be
converted to a different state.

This plugin requires the base plugin "PluginCommonBase.js."
"PluginCommonBase.js" is located in the following folder under the RPG Maker
MZ installation folder:

dlc/BasicResources/plugins/official

Terms of Use:
You may modify and redistribute this plugin without permission, and there are
no restrictions on its use (commercial, R18+, etc.).
This plugin is now yours.

@param states
@text State Transformation List
@desc State transformation list.
@type struct<State>[]
@default []
*/

/*~struct~State:
@param srcStateId
@text Original State ID
@desc The original state ID of the overlap.
@type state
@default 1

@param destStateId
@text Transformation State ID
@desc The layered transformation state ID.
@type state
@default 1

@param removeSrcState
@text Cancel original state
@desc After conversion, the original state is cleared.
@type boolean
@default true

@param suppressRemoveMessage
@text Cancel message suppression
@desc Suppresses messages when the original state is released.
@type boolean
@default true
*/

/*:ja
@plugindesc ステート重ね掛けプラグイン
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/StateDuplication.js
@base PluginCommonBase
@orderAfter PluginCommonBase
@author トリアコンタン

@param states
@text ステート変換リスト
@desc ステート変換リストです。
@default []
@type struct<State>[]

@help StateDuplication.js

ステートが有効になったとき、すでに同じステートに掛かっている場合
別のステートに変換できます。

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
@param srcStateId
@text 元ステートID
@desc 重ね掛けの元ステートIDです。
@default 1
@type state

@param destStateId
@text 変換ステートID
@desc 重ね掛けの変換ステートIDです。
@default 1
@type state

@param removeSrcState
@text 元ステート解除
@desc 変換後に元ステートを解除します。
@default true
@type boolean

@param suppressRemoveMessage
@text 解除メッセージ抑制
@desc 元ステート解除の際にメッセージを抑制します。
@default true
@type boolean
*/

(() => {
    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);
    if (!param.states) {
        param.states = [];
    }

    const _Game_Battler_addNewState = Game_Battler.prototype.addState;
    Game_Battler.prototype.addState = function(stateId) {
        if (this.isStateAffected(stateId)) {
            _Game_Battler_addNewState.apply(this, arguments);
            this.convertState(stateId);
        } else {
            _Game_Battler_addNewState.apply(this, arguments);
        }
    };

    Game_Battler.prototype.convertState = function(stateId) {
        const state = param.states.find(state => state.srcStateId === stateId);
        if (!state || stateId === state.destStateId) {
            return;
        }
        this.addState(state.destStateId);
        if (state.removeSrcState) {
            this.removeState(stateId);
            if (state.suppressRemoveMessage) {
                const removedState = this._result.removedStates;
                removedState.splice(removedState.indexOf(stateId), 1);
                const addedState = this._result.addedStates;
                addedState.splice(addedState.indexOf(stateId), 1);
            }
        }
    };
})();