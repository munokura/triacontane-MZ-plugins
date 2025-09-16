/*=============================================================================
 StateExcludeRecoverAll.js
----------------------------------------------------------------------------
 (C)2023 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.1.0 2023/06/18 戦闘不能ステートが対象外に含まれいた場合、戦闘不能者は全回復でHPやMPが回復しなくなるよう修正
 1.0.0 2023/06/17 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/StateExcludeRecoverAll.js
@plugindesc Full recovery excluded state plugin
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

StateExcludeRecoverAll.js

The state specified in the parameter will not be canceled by events such as
the "Full Recovery" event.

It will be canceled normally when the character is KO'd or when the state's
cancellation conditions are met.

This plugin requires the base plugin "PluginCommonBase.js."
"PluginCommonBase.js" is located in the following folder under the RPG Maker
MZ installation folder:
dlc/BasicResources/plugins/official

Terms of Use:
You may modify and redistribute this plugin without permission, and there are
no restrictions on its use (commercial, 18+, etc.).
This plugin is now yours.

@param states
@text List of states
@desc A list of states that cannot be removed by full recovery.
@type state[]
@default []
*/

/*:ja
@plugindesc 全回復の対象外ステートプラグイン
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/StateExcludeRecoverAll.js
@base PluginCommonBase
@orderAfter PluginCommonBase
@author トリアコンタン

@param states
@text ステートのリスト
@desc 全回復によって解除されないステートのリストです。
@default []
@type state[]

@help StateExcludeRecoverAll.js

パラメータで指定したステートがイベントコマンド「全回復」などで
解除されなくなります。
戦闘不能時やステートで設定した解除条件を満たした場合は
通常通り解除されます。

このプラグインの利用にはベースプラグイン『PluginCommonBase.js』が必要です。
『PluginCommonBase.js』は、RPGツクールMZのインストールフォルダ配下の
以下のフォルダに格納されています。
dlc/BasicResources/plugins/official

利用規約：
 作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 についても制限はありません。
 このプラグインはもうあなたのものです。
*/

(() => {
    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);
    if (!param.states) {
        param.states = [];
    }

    const _Game_BattlerBase_recoverAll = Game_BattlerBase.prototype.recoverAll
    Game_BattlerBase.prototype.recoverAll = function() {
        if (!this._states) {
            _Game_BattlerBase_recoverAll.apply(this, arguments);
            return;
        }
        const states = param.states;
        const stillStates = this._states.filter(stateId => states.includes(stateId));
        if (stillStates.includes(this.deathStateId()) && !this.isAlive()) {
            return;
        }
        const stillStateTurns = {};
        stillStates.forEach(stateId => stillStateTurns[stateId] = this._stateTurns[stateId]);
        _Game_BattlerBase_recoverAll.apply(this, arguments);
        this._states     = this._states.concat(stillStates);
        this._stateTurns = stillStateTurns;
    };
})();