/*=============================================================================
 EventTouchCheck.js
----------------------------------------------------------------------------
 (C)2024 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2024/03/13 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/EventTouchCheck.js
@plugindesc Event Contact Detection Plugin
@author Triacontane
@license MIT License

@help
English Help Translator: munokura
Please check the URL below for the latest version of the plugin.
URL https://triacontane.blogspot.com
-----

EventTouchCheck.js

Determines whether the currently running event was triggered by "touch from an
event."
It determines whether contact actually occurred from an event, not the value
of a configured trigger.

Execute the following script using a conditional branch, or use the plugin
command to store the result in a switch of your choice.
this.character(0).isStartByTouch();

This plugin requires the base plugin "PluginCommonBase.js."
"PluginCommonBase.js" is located in the following folder under the RPG Maker
MZ installation folder:
dlc/BasicResources/plugins/official

Terms of Use:
You may modify and redistribute this plugin without permission, and there are
no restrictions on its use (commercial, 18+, etc.).
This plugin is now yours.

@command SET_SWITCH
@text Switch Settings
@desc Sets whether the running event was triggered by "Contact from Event" on the switch.
@arg switchId
@text Switch Number
@desc This is the switch number to turn ON when activated by "Contact from Event".
@type switch
@default 1
*/

/*:ja
@plugindesc イベント接触判定プラグイン
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/EventTouchCheck.js
@base PluginCommonBase
@orderAfter PluginCommonBase
@author トリアコンタン

@command SET_SWITCH
@text スイッチ設定
@desc 実行中のイベントが『イベントから接触』で起動したかどうかをスイッチに設定します。

@arg switchId
@text スイッチ番号
@desc 『イベントから接触』で起動した場合にONにするスイッチ番号です。
@default 1
@type switch

@help EventTouchCheck.js

実行中のイベントが『イベントから接触』で起動したかどうかを判定します。
設定したトリガーの値ではなく、実際にイベントから接触してきたかどうかを
判定します。

条件分岐で以下のスクリプトを実行するか、プラグインコマンドで判定結果を
任意のスイッチに格納してください。
this.character(0).isStartByTouch();

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

    PluginManagerEx.registerCommand(script, 'SET_SWITCH', function (args) {
        $gameSwitches.setValue(args.switchId, this.character(0).isStartByTouch());
    });

    const _Game_Event_checkEventTriggerTouch = Game_Event.prototype.checkEventTriggerTouch;
    Game_Event.prototype.checkEventTriggerTouch = function(x, y) {
        _Game_Event_checkEventTriggerTouch.apply(this, arguments);
        if (this.isStarting()) {
            this._startByTouch = true;
        }
    };

    Game_Event.prototype.clearStartByTouch = function() {
        this._startByTouch = false;
    };

    Game_Event.prototype.isStartByTouch = function() {
        return this._startByTouch;
    };

    const _Game_Interpreter_terminate = Game_Interpreter.prototype.terminate;
    Game_Interpreter.prototype.terminate = function() {
        _Game_Interpreter_terminate.apply(this, arguments);
        if (this._eventId > 0 && this._depth === 0) {
            this.character(0).clearStartByTouch();
        }
    };
})();