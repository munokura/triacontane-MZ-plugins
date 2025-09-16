/*=============================================================================
 StepInvalidate.js
----------------------------------------------------------------------------
 (C)2023 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2023/10/08 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/StepInvalidate.js
@plugindesc Step count increase disable plugin
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

StepInvalidate.js

When the specified switch is ON, step count increments will be disabled.

This will also disable state resets and turn progression based on step counts.

This plugin requires the base plugin "PluginCommonBase.js."
"PluginCommonBase.js" is located in the following folder under the RPG Maker
MZ installation folder:

dlc/BasicResources/plugins/official

Terms of Use:
You may modify and redistribute this plugin without permission, and there are
no restrictions on its use (commercial, R18+, etc.).
This plugin is now yours.

@param switchId
@text Disable switch
@desc When the switch with the specified number is ON, step count increase will be disabled.
@type switch
@default 1
@min 1
*/

/*:ja
@plugindesc 歩数増加無効化プラグイン
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/StepInvalidate.js
@base PluginCommonBase
@orderAfter PluginCommonBase
@author トリアコンタン

@param switchId
@text 無効化スイッチ
@desc 指定した番号のスイッチがONのとき、歩数増加が無効化されます。
@default 1
@type switch
@min 1

@help StepInvalidate.js

指定したスイッチがONのとき歩数の増加が無効になります。
併せて歩数によるステート解除や歩数によるターン経過も無効になります。

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

    const _Game_Player_isNormal = Game_Player.prototype.isNormal;
    Game_Player.prototype.isNormal = function () {
        return _Game_Player_isNormal.apply(this, arguments) && !$gameSwitches.value(param.switchId);
    };
})();