//=============================================================================
// WaitInterpreterCondition.js
// ----------------------------------------------------------------------------
// (C)2017 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.1.0 2025/05/23 MZ版として再作成
// 1.0.0 2017/10/14 初版
// ----------------------------------------------------------------------------
// [Twitter]: https://x.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/WaitInterpreterCondition.js
@plugindesc Conditional Weight Plugin
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

WaitInterpreterCondition.js

Provides a plugin command that waits until a condition is met before executing
an event.

Conditions that can be specified are switches and scripts.

Control characters such as \v[n] and \s[n] can be used in scripts.
The event will not proceed until the condition is met, so be careful not to
interrupt the game.

Terms of Use:
You may modify and redistribute this plugin without permission from the
author, and there are no restrictions on its use (commercial, 18+, etc.).
This plugin is now yours.

@command wait_switch
@text Switch Weight
@desc Waits until the specified switch is turned ON.
@arg switchId
@text Switch ID
@desc The switch number to wait until it turns ON.
@type switch
@default 1

@command wait_script
@text Script Weight
@desc Waits until the specified script becomes true.
@arg script
@text script
@desc This script waits until the return value is true. It is executed every frame.
@type multiline_string
*/

/*:ja
@plugindesc 条件付きウェイトプラグイン
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/WaitInterpreterCondition.js
@base PluginCommonBase
@orderAfter PluginCommonBase
@author トリアコンタン

@command wait_switch
@text スイッチウェイト
@desc 指定したスイッチがONになるまでウェイトします。

@arg switchId
@text スイッチID
@desc ONになるまでウェイトするスイッチ番号です。
@default 1
@type switch

@command wait_script
@text スクリプトウェイト
@desc 指定したスクリプトがtrueになるまでウェイトします。

@arg script
@text スクリプト
@desc 戻り値がtrueを返すまでウェイトするスクリプトです。毎フレーム実行されます。
@default
@type multiline_string

@help WaitInterpreterCondition.js

イベント実行で条件を満たすまでウェイトするプラグインコマンドを提供します。
指定可能な条件はスイッチとスクリプトです。

スクリプトでは制御文字\v[n]や\s[n]などが使用できます。
条件を満たすまでイベントが進まなくなるのでゲーム進行が
止まらないように注意してください。

利用規約：
 作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 についても制限はありません。
 このプラグインはもうあなたのものです。
*/

(()=> {
    'use strict';
    const script = document.currentScript;

    PluginManagerEx.registerCommand(script, 'wait_switch', function(args) {
        this.execWaitSwitch(args.switchId);
    });

    PluginManagerEx.registerCommand(script, 'wait_script', function(args) {
        this.execWaitScript(args.script);
    });

    Game_Interpreter._waitModeCondition = 'condition';

    Game_Interpreter.prototype.execWaitSwitch = function(id) {
        this._waitSwitchId = id;
        this.setWaitMode(Game_Interpreter._waitModeCondition);
    };

    Game_Interpreter.prototype.execWaitScript = function(script) {
        this._waitScript = script;
        this.setWaitMode(Game_Interpreter._waitModeCondition);
    };

    var _Game_Interpreter_updateWaitMode      = Game_Interpreter.prototype.updateWaitMode;
    Game_Interpreter.prototype.updateWaitMode = function() {
        if (this._waitMode === Game_Interpreter._waitModeCondition) {
            if (this.isValidWaitSwitch()) {
                return true;
            }
            this._waitSwitchId = 0;
            if (this.isValidWaitScript()) {
                return true;
            }
            this._waitScript = '';
            this._waitMode   = '';
            return false;
        } else {
            return _Game_Interpreter_updateWaitMode.apply(this, arguments);
        }
    };

    Game_Interpreter.prototype.isValidWaitSwitch = function() {
        return this._waitSwitchId > 0 && !$gameSwitches.value(this._waitSwitchId);
    };

    Game_Interpreter.prototype.isValidWaitScript = function() {
        return this._waitScript && !eval(PluginManagerEx.convertEscapeCharacters(this._waitScript));
    };
})();