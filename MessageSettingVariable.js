/*=============================================================================
 MessageSettingVariable.js
----------------------------------------------------------------------------
 (C)2025 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2025/01/23 初版
----------------------------------------------------------------------------
 [X]      : https://x.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/MessageSettingVariable.js
@plugindesc Message setting variable acquisition plugin
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

MessageSettingVariable.js

Sets the background and position settings for "Display Text" from variables.
The settings specified in the "Display Text" command are ignored.
By specifying a switch to disable this plugin's functionality as a parameter,
the settings specified in the "Display Text" command will be active while the
switch is ON.

This plugin requires the base plugin "PluginCommonBase.js."
"PluginCommonBase.js" is located in the following folder
in the RPG Maker MZ installation folder:
dlc/BasicResources/plugins/official

Terms of Use:
You may modify and redistribute this plugin without permission, and there are
no restrictions on its use (commercial, 18+, etc.).
This plugin is now yours.

@param backGroundVariable
@text Background variables
@desc Specify the variable to get the message background (0: window 1: darken 2: transparent). Be careful not to set an out-of-range value.
@type variable
@default 0

@param positionVariable
@text Position Variables
@desc Specify the variable to obtain the message position (0: top, 1: center, 2: bottom). Be careful not to set an out-of-range value.
@type variable
@default 0

@param invalidSwitch
@text Disable Switch
@desc When the specified switch is ON, obtaining settings from variables will be disabled.
@type switch
@default 0
*/

/*:ja
@plugindesc メッセージ設定の変数取得プラグイン
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/MessageSettingVariable.js
@base PluginCommonBase
@orderAfter PluginCommonBase
@author トリアコンタン

@param backGroundVariable
@text 背景変数
@desc メッセージ背景(0:ウィンドウ 1:暗くする 2:透明)を取得する変数を指定します。範囲外の値が設定されないよう注意してください。
@default 0
@type variable

@param positionVariable
@text 位置変数
@desc メッセージ位置(0:上 1:中央 2:下)を取得する変数を指定します。範囲外の値が設定されないよう注意してください。
@default 0
@type variable

@param invalidSwitch
@text 無効スイッチ
@desc 指定したスイッチがONのときは変数からの設定取得を無効にします。
@default 0
@type switch

@help MessageSettingVariable.js

「文章の表示」における設定の背景と位置を変数から取得して設定します。
「文章の表示」コマンドで指定した設定は無視されます。
パラメータから本プラグインの機能を無効にするスイッチを指定することで
スイッチがONのあいだは「文章の表示」コマンドで指定した設定が有効になります。

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


    const _Game_Message_background = Game_Message.prototype.background;
    Game_Message.prototype.background = function() {
        const background = _Game_Message_background.apply(this, arguments);
        if (this.isValidVariableSetting() && param.backGroundVariable > 0) {
            return $gameVariables.value(param.backGroundVariable);
        } else {
            return background;
        }
    };

    const _Game_Message_positionType = Game_Message.prototype.positionType;
    Game_Message.prototype.positionType = function() {
        const positionType = _Game_Message_positionType.apply(this, arguments);
        if (this.isValidVariableSetting() && param.positionVariable > 0) {
            return $gameVariables.value(param.positionVariable);
        } else {
            return positionType;
        }
    };

    Game_Message.prototype.isValidVariableSetting = function() {
        return !param.invalidSwitch || !$gameSwitches.value(param.invalidSwitch);
    };
})();