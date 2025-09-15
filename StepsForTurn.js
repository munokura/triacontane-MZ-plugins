/*=============================================================================
 StepsForTurn.js
----------------------------------------------------------------------------
 (C)2021 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.1.0 2023/07/27 MZ版を作成
 1.0.0 2021/05/20 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/StepsForTurn.js
@plugindesc Turn progress step count change plugin
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

StepsForTurn.js

Allows you to change the number of steps recognized as one turn (usually 20
steps).
This primarily affects the frequency of slip damage depending on the state.
Adjust the parameters.

This plugin requires the base plugin "PluginCommonBase.js."
"PluginCommonBase.js" is located in the following folder under the RPG Maker
MZ installation folder:
dlc/BasicResources/plugins/official

Terms of Use:
You may modify and redistribute this plugin without permission, and there are
no restrictions on its use (commercial, 18+, etc.).
This plugin is now yours.

@param turn
@text Steps per turn
@desc The number of steps taken in one turn.
@type number
@default 20
@min 1

@param turnVariable
@text Turn progress variable
@desc This is the variable number that stores the number of steps elapsed in one turn. If specified, it will take priority over direct specification.
@type variable
@default 0
*/

/*:ja
@plugindesc ターン経過歩数変更プラグイン
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/StepsForTurn.js
@base PluginCommonBase
@orderAfter PluginCommonBase
@author トリアコンタン

@param turn
@text ターン経過歩数
@desc 1ターン経過歩数です。
@default 20
@type number
@min 1

@param turnVariable
@text ターン経過歩数変数
@desc 1ターン経過歩数を格納する変数番号です。指定した場合、直接指定より優先されます。
@default 0
@type variable

@help StepsForTurn.js

1ターン経過と認識される歩数(通常20歩)を変更できます。
主にステートによるスリップダメージの頻度が変わります。
パラメータから調整してください。

このプラグインの利用にはベースプラグイン『PluginCommonBase.js』が必要です。
『PluginCommonBase.js』は、RPGツクールMZのインストールフォルダ配下の
以下のフォルダに格納されています。
dlc/BasicResources/plugins/official

利用規約：
 作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 についても制限はありません。
 このプラグインはもうあなたのものです。
*/

(()=> {
    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);

    const _Game_Actor_stepsForTurn = Game_Actor.prototype.stepsForTurn;
    Game_Actor.prototype.stepsForTurn = function() {
        const originalTurn = _Game_Actor_stepsForTurn.apply(this, arguments);
        return this.findStepsForTurnCustom() || originalTurn;
    };

    Game_Actor.prototype.findStepsForTurnCustom = function() {
        if (param.turnVariable > 0) {
            return $gameVariables.value(param.turnVariable);
        } else {
            return param.turn;
        }
    };
})();