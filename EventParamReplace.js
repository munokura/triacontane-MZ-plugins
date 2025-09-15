/*=============================================================================
 EventParamReplace.js
----------------------------------------------------------------------------
 (C)2023 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2023/10/23 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
@target MZ
@url https://docs.google.com/spreadsheets/d/1aqY-xzFqT0vnZE-OkfsMYsP9Ud91vWTrBLU-uDkJ-Ls/edit#gid=2095105278
@plugindesc Event parameter replacement plugin
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

EventParamReplace.js

Replaces the parameters of the next event command to be executed.

This is primarily used when you want to set a parameter to a variable value,
the result of a script evaluation, or a value outside the allowable range.

Parameter indexes are listed in the reference specified in the URL field.

However, parameters of plugin commands (including this command) are not
subject to replacement.

This plugin requires the base plugin "PluginCommonBase.js."
"PluginCommonBase.js" is located in the following folder under the RPG Maker
MZ installation folder:

dlc/BasicResources/plugins/official

Terms of Use:
You may modify and redistribute this plugin without permission, and there are
no restrictions on its use (commercial, R18+, etc.).
This plugin is now yours.

@command REPLACE
@text replacement
@desc Replace the parameters of the next event command to be executed.
@arg index
@text Index
@desc The index of the parameter to replace.
@type number
@default 0
@arg param
@text Parameters
@desc The parameter value to be replaced. You can use the control character \v[n].
@type multiline_string
*/

/*:ja
@plugindesc イベントパラメータ差し替えプラグイン
@target MZ
@url https://docs.google.com/spreadsheets/d/1aqY-xzFqT0vnZE-OkfsMYsP9Ud91vWTrBLU-uDkJ-Ls/edit#gid=2095105278
@base PluginCommonBase
@orderAfter PluginCommonBase
@author トリアコンタン

@command REPLACE
@text 差し替え
@desc 次に実行するイベントコマンドのパラメータを差し替えます。

@arg index
@text インデックス
@desc 差し替えるパラメータのインデックスです。
@default 0
@type number

@arg param
@text パラメータ
@desc 差し替えるパラメータの値です。制御文字\v[n]が使えます。
@default
@type multiline_string

@help EventParamReplace.js

次に実行するイベントコマンドのパラメータを差し替えます。
主にパラメータに変数値やスクリプト評価結果、指定可能範囲外の値を
設定したいときに使います。

パラメータのインデックスはURL欄で指定したリファレンスでまとめています。

ただし（本コマンドを含む）プラグインコマンドのパラメータは
差し替えの対象外となります。

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

    PluginManagerEx.registerCommand(script, 'REPLACE', function(args) {
        if (!this._replaceParams) {
            this._replaceParams = [];
        }
        this._replaceParams.push({index: args.index, param: args.param});
    });

    const _Game_Interpreter_clear = Game_Interpreter.prototype.clear;
    Game_Interpreter.prototype.clear = function() {
        _Game_Interpreter_clear.apply(this, arguments);
        this.clearReplaceParam();
    };

    Game_Interpreter.prototype.clearReplaceParam = function() {
        this._replaceParams = null;
        this._originalParam = null;
        this._currentCommand = null;
    };

    const _Game_Interpreter_currentCommand = Game_Interpreter.prototype.currentCommand;
    Game_Interpreter.prototype.currentCommand = function() {
        const command = _Game_Interpreter_currentCommand.apply(this, arguments);
        if (this._replaceParams && command && command.code >= 101 && command.code <= 356) {
            this._originalParam = command.parameters;
            this._currentCommand = command;
            command.parameters = command.parameters.clone();
            this._replaceParams.forEach(param => command.parameters[param.index] = param.param);
        }
        return command;
    };

    const _Game_Interpreter_executeCommand = Game_Interpreter.prototype.executeCommand;
    Game_Interpreter.prototype.executeCommand = function() {
        const result = _Game_Interpreter_executeCommand.apply(this, arguments);
        if (this._currentCommand) {
            this._currentCommand.parameters = this._originalParam;
            this.clearReplaceParam();
        }
        return result;
    };
})();