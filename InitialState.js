//=============================================================================
// InitialState.js
// ----------------------------------------------------------------------------
// (C)2017 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.5.0 2025/03/20 隠れ状態(途中から出現)の敵キャラには初期ステートを適用せず、出現した時点で適用する設定を追加
// 1.4.0 2022/10/09 変身後の敵キャラにも初期ステートを適用できる機能を追加
// 1.3.0 2022/08/21 すべての敵キャラに適用できる初期ステートをパラメータで指定できる機能を追加
// 1.2.0 2022/01/07 MZで動作するよう修正
// 1.1.0 2018/07/08 複数の初期ステートを設定できる機能を追加
// 1.0.1 2017/02/07 端末依存の記述を削除
// 1.0.0 2017/01/12 初版
// ----------------------------------------------------------------------------
// [X]      : https://x.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/InitialState.js
@plugindesc Initial State Plugin
@author Triacontane
@license MIT License

@help
English Help Translator: munokura
Please check the URL below for the latest version of the plugin.
URL https://triacontane.blogspot.com
-----

InitialState.js

Assigns an initial state to an enemy character.
Enter the following in the enemy character's memo field.

<InitialState:3> # State ID [3] will be automatically assigned at the start of
battle.
<InitialState:3> # Same as above.

To set multiple states, specify the IDs separated by commas.
Example: <InitialState:3,4,5>

This plugin does not have a plugin command.

Terms of Use:
You may modify and redistribute this plugin without permission from the
author, and there are no restrictions on its use (commercial, 18+, etc.).
This plugin is now yours.

@param stateList
@text State List
@desc A list of initial states to apply to all enemy characters.
@type struct<STATE>[]
@default []

@param applyTransform
@text Apply to transformation
@desc Apply the initial state even after the enemy character transforms
@type boolean
@default false

@param noApplyHidden
@text Does not apply to hidden states
@desc The initial state is not applied to hidden enemy characters, but is applied when they appear.
@type boolean
@default false
*/

/*~struct~STATE:
@param stateId
@text State ID
@desc The ID of the initial state to apply.
@type state
@default 1

@param switchId
@text Condition Switch
@desc This is the initial state application condition switch. Specifying 0 will always apply.
@type switch
@default 0
*/

/*:ja
@plugindesc 初期ステートプラグイン
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/InitialState.js
@base PluginCommonBase
@orderAfter PluginCommonBase
@author トリアコンタン

@param stateList
@text ステートリスト
@desc すべての敵キャラに適用する初期ステートのリストです。
@default []
@type struct<STATE>[]

@param applyTransform
@text 変身に適用
@desc 敵キャラが変身したあとにも初期ステートを適用
@default false
@type boolean

@param noApplyHidden
@text 隠れ状態には適用しない
@desc 隠れ状態の敵キャラには初期ステートは適用せず、出現した時点で適用されます。
@default false
@type boolean

@help InitialState.js

敵キャラに初期状態でステートを付与します。
敵キャラのメモ欄に以下の通り記述してください。

<初期ステート:3>   # 戦闘開始時にステートID[3]が自動で付与されます。
<InitialState:3> # 同上

複数のステートを設定したい場合は、カンマ区切りでIDを指定してください。
例：<InitialState:3,4,5>

このプラグインにはプラグインコマンドはありません。

利用規約：
 作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 についても制限はありません。
 このプラグインはもうあなたのものです。
*/

/*~struct~STATE:ja

@param stateId
@text ステートID
@desc 適用する初期ステートのIDです。
@default 1
@type state

@param switchId
@text 条件スイッチ
@desc 初期ステートの適用条件スイッチです。0を指定すると常に適用します。
@default 0
@type switch
*/

(()=> {
    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);
    if (!param.stateList) {
        param.stateList = [];
    }

    const _Game_Enemy_setup = Game_Enemy.prototype.setup;
    Game_Enemy.prototype.setup = function(enemyId, x, y) {
        _Game_Enemy_setup.apply(this, arguments);
        this.setupInitialState();
    };

    const _Game_Enemy_transform = Game_Enemy.prototype.transform;
    Game_Enemy.prototype.transform = function(enemyId) {
        _Game_Enemy_transform.apply(this, arguments);
        if (param.applyTransform) {
            this.setupInitialState();
        }
    };

    const _Game_BattlerBase_hide = Game_BattlerBase.prototype.hide;
    Game_BattlerBase.prototype.hide = function() {
        _Game_BattlerBase_hide.apply(this, arguments);
        if (param.noApplyHidden && this.isEnemy()) {
            this.clearStates();
        }
    };

    const _Game_BattlerBase_appear = Game_BattlerBase.prototype.appear;
    Game_BattlerBase.prototype.appear = function() {
        _Game_BattlerBase_appear.apply(this, arguments);
        if (param.noApplyHidden && this.isEnemy()) {
            this.setupInitialState();
        }
    };

    Game_BattlerBase.prototype.setupInitialState = function() {
        // do nothing
    };

    Game_Enemy.prototype.setupInitialState = function() {
        this.setupAllInitialState();
        const stateList = PluginManagerEx.findMetaValue(this.enemy(), ['初期ステート', 'InitialState']);
        if (!stateList) {
            return;
        }
        String(stateList).split(',').forEach(state => this.addState(parseInt(state)));
    };

    Game_Enemy.prototype.setupAllInitialState = function() {
        param.stateList
            .filter(state => !state.switchId || $gameSwitches.value(state.switchId))
            .forEach(state => this.addState(state.stateId));
    };
})();