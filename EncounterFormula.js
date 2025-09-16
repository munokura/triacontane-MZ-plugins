/*=============================================================================
 EncounterFormula.js
----------------------------------------------------------------------------
 (C)2024 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2024/05/25 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/EncounterFormula.js
@plugindesc Encounter Calculation Formula Plugin
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

EncounterFormula.js

You can set a formula to calculate the number of steps until an encounter.
The script execution result will be the number of steps until an encounter.
You can reference the "Enemy Steps" entered in the map settings with n.

This plugin requires the base plugin "PluginCommonBase.js."
"PluginCommonBase.js" is located in the following folder under the RPG Maker
MZ installation folder:

dlc/BasicResources/plugins/official

Terms of Use:
You may modify and redistribute this plugin without permission, and there are
no restrictions on its use (commercial, 18+, etc.).
This plugin is now yours.

@param formula
@text calculation formula
@desc This is a formula to calculate the number of steps until an encounter. You can refer to the "Number of steps until enemy appears" entered in the map settings with n.
@type multiline_string
@default Math.randomInt(n) + Math.randomInt(n) + 1;
*/

/*:ja
@plugindesc エンカウント計算式プラグイン
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/EncounterFormula.js
@base PluginCommonBase
@orderAfter PluginCommonBase
@author トリアコンタン

@param formula
@text 計算式
@desc エンカウントまでの歩数を計算する計算式です。nでマップ設定で入力した「敵出現歩数」を参照できます。
@default Math.randomInt(n) + Math.randomInt(n) + 1;
@type multiline_string

@help EncounterFormula.js

エンカウントまでの歩数を計算する計算式を設定できます。
スクリプトの実行結果が、エンカウントまでの歩数になります。
nでマップ設定で入力した「敵出現歩数」を参照できます。

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

    const _Game_Player_makeEncounterCount = Game_Player.prototype.makeEncounterCount;
    Game_Player.prototype.makeEncounterCount = function() {
        _Game_Player_makeEncounterCount.apply(this, arguments);
        const formula = param.formula;
        if (formula) {
            const n = $gameMap.encounterStep();
            this._encounterCount = eval(formula);
        }
    };
})();