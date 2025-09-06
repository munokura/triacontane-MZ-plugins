/*=============================================================================
 CastInterruption.js
----------------------------------------------------------------------------
 (C)2021 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.1.0 2021/05/25 キャスト中以外はステート付与しないよう仕様変更
 1.0.0 2021/05/24 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/CastInterruption.js
@plugindesc Cast Interference Plugin
@author Triacontane
@license MIT License

@help
English Help Translator: munokura
Please check the URL below for the latest version of the plugin.
URL https://triacontane.blogspot.com
-----

CastInterruption.js

Cancels the cast charge of a target currently casting.
The canceled target will start charging normally again.
This occurs when a state corresponding to the Cast Interruption parameter is
enabled.

Conversely, it can also assist the target's cast.
The assisted target's cast gauge will be filled and they can immediately
activate the skill.
This occurs when a state corresponding to the Cast Assist parameter is
enabled.

This plugin requires the base plugin "PluginCommonBase.js."
"PluginCommonBase.js" is located in the following folder under the RPG Maker
MZ installation folder:
dlc/BasicResources/plugins/official

Terms of Use:
You may modify and redistribute this plugin without permission, and there are
no restrictions on its use (commercial, 18+, etc.).
This plugin is now yours.

@param interruptionState
@text Cast-blocking state
@desc This state will prevent the target from casting. This state will be automatically canceled after the effect is activated.
@type state
@default 0

@param assistState
@text Cast Assist State
@desc This state will automatically cancel once the effect is activated.
@type state
@default 0

@param fullCharge
@text Fully charged when disrupted
@desc When your cast is interrupted, the time gauge will be charged and you will be able to enter commands immediately.
@type boolean
@default false
*/

/*:ja
@plugindesc キャスト妨害プラグイン
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/CastInterruption.js
@base PluginCommonBase
@orderAfter PluginCommonBase
@author トリアコンタン

@param interruptionState
@text キャスト妨害ステート
@desc このステートが有効になった対象はキャスト妨害されます。このステートは効果発現後、自動解除されます。
@default 0
@type state

@param assistState
@text キャスト補助ステート
@desc このステートが有効になった対象はキャスト補助されます。このステートは効果発現後、自動解除されます。
@default 0
@type state

@param fullCharge
@text 妨害時フルチャージ
@desc キャスト妨害を受けたとき、タイムゲージがチャージされた状態になり、すぐにコマンド入力できます。
@default false
@type boolean

@help CastInterruption.js

キャスト中の対象のキャストチャージをキャンセルできます。
キャンセルされた相手は、通常のチャージから溜め直しとなります。
パラメータのキャスト妨害に該当するステートを有効にすると発生します。

逆に相手のキャスト補助もできます。
補助された相手はキャストゲージが満タンになり即スキルを発動できます。
パラメータのキャスト補助に該当するステートを有効にすると発生します。

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

    const _Game_Battler_addState = Game_Battler.prototype.addState;
    Game_Battler.prototype.addState = function(stateId) {
        _Game_Battler_addState.apply(this, arguments);
        if (this.isStateAffected(stateId)) {
            this.addCastEffect(stateId);
        }
    }

    const _Game_Battler_isStateAddable = Game_Battler.prototype.isStateAddable;
    Game_Battler.prototype.isStateAddable = function(stateId) {
        const result = _Game_Battler_isStateAddable.apply(this, arguments);
        return result && !this.isCastEffectInvalid(stateId);
    };

    Game_Battler.prototype.isCastEffectInvalid = function(stateId) {
        return (stateId === param.interruptionState || stateId === param.assistState) &&
            this._tpbState !== 'casting';
    };

    Game_Battler.prototype.addCastEffect = function(stateId) {
        if (stateId === param.interruptionState) {
            this.interruptCast();
            this.eraseState(stateId);
        }
        if (stateId === param.assistState) {
            this.assistCast();
            this.eraseState(stateId);
        }
    };

    Game_Battler.prototype.interruptCast = function() {
        this.clearTpbChargeTime();
        this.clearActions();
        if (param.fullCharge) {
            this._tpbChargeTime = 1;
            this.updateTpbChargeTime();
        }
    };

    Game_Battler.prototype.assistCast = function() {
        this._tpbCastTime = this.tpbRequiredCastTime();
        this.updateTpbCastTime();
    };
})();