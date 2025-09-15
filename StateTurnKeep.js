/*=============================================================================
 StateTurnKeep.js
----------------------------------------------------------------------------
 (C)2022 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2022/09/09 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/StateTurnKeep.js
@plugindesc State remaining turn maintenance plugin
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

StateTurnKeep.js

This changes the specification so that the remaining turn count is maintained
without being reset when overlapping states.

This plugin requires the base plugin "PluginCommonBase.js."
"PluginCommonBase.js" is located in the following folder under the RPG Maker
MZ installation folder:

dlc/BasicResources/plugins/official

Terms of Use:
You may modify and redistribute this plugin without permission from the
author, and there are no restrictions on its use (commercial, 18+, etc.).
This plugin is now yours.

@param outOfTargets
@text Unsupported states
@desc This is a state that is not subject to maintaining the remaining number of turns. The state specified here will be initialized according to the normal specifications.
@type state[]
@default []
*/

/*:ja
@plugindesc ステート残りターン維持プラグイン
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/StateTurnKeep.js
@base PluginCommonBase
@orderAfter PluginCommonBase
@author トリアコンタン

@param outOfTargets
@text 対象外ステート
@desc 残りターン数維持の対象外となるステートです。ここで指定したステートは通常仕様通りに初期化されます。
@default []
@type state[]

@help StateTurnKeep.js

ステートを重ね掛けしたとき、残りターン数を初期化せず
維持するよう仕様変更します。

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
    if (!param.outOfTargets) {
        param.outOfTargets = [];
    }

    const _Game_BattlerBase_resetStateCounts = Game_BattlerBase.prototype.resetStateCounts;
    Game_BattlerBase.prototype.resetStateCounts = function(stateId) {
        const prevTurn = this._stateTurns[stateId];
        _Game_BattlerBase_resetStateCounts.apply(this, arguments);
        if (prevTurn && !param.outOfTargets.includes(stateId)) {
            this._stateTurns[stateId] = prevTurn;
        }
    };
})();