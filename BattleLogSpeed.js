/*=============================================================================
 BattleLogSpeed.js
----------------------------------------------------------------------------
 (C)2022 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2022/08/22 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/BattleLogSpeed.js
@plugindesc Battlelog Speed Adjustment Plugin
@author Triacontane
@license MIT License

@help
English Help Translator: munokura
Please check the URL below for the latest version of the plugin.
URL https://triacontane.blogspot.com
-----

BattleLogSpeed.js

Allows you to vary the speed of the battle log.
Specify the variable number to obtain the speed from the parameters.
A variable value of 0 or less will disable the plugin and use the default
value (16).

This plugin requires the base plugin "PluginCommonBase.js."
"PluginCommonBase.js" is located in the following folder under the RPG Maker
MZ installation folder:

dlc/BasicResources/plugins/official

Terms of Use:
You may modify and redistribute this plugin without permission, and there are
no restrictions on its use (commercial, 18+, etc.).
This plugin is now yours.

@param speedVariable
@text Speed Variable
@desc The specified variable value is treated as the log message speed (number of frames).
@type variable
@default 1
*/

/*:ja
@plugindesc バトルログ速度調整プラグイン
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/BattleLogSpeed.js
@base PluginCommonBase
@orderAfter PluginCommonBase
@author トリアコンタン

@param speedVariable
@text 速度変数
@desc 指定した変数値をログメッセージスピード(フレーム数)として扱います。
@default 1
@type variable

@help BattleLogSpeed.js

バトルログのスピードを可変にできます。
パラメータからスピードを取得する変数番号を指定してください。
変数値が0以下の場合は無効となり、デフォルト値(16)が採用されます。

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

    const _Window_BattleLog_messageSpeed = Window_BattleLog.prototype.messageSpeed;
    Window_BattleLog.prototype.messageSpeed = function() {
        const defaultSpeed = _Window_BattleLog_messageSpeed.apply(this, arguments);
        const speed = $gameVariables.value(param.speedVariable);
        return speed > 0 ? speed : defaultSpeed;
    };
})();