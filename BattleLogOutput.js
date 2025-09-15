/*=============================================================================
 BattleLogOutput.js
----------------------------------------------------------------------------
 (C)2023 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2023/08/11 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/BattleLogOutput.js
@plugindesc Battlelog Output Plugin
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

BattleLogOutput.js

You can output the battle log using the plugin command.
This command is only valid on the battle screen.

This plugin requires the base plugin "PluginCommonBase.js."
"PluginCommonBase.js" is located in the following folder under the RPG Maker
MZ installation folder:
dlc/BasicResources/plugins/official

Terms of Use:
You may modify and redistribute this plugin without permission, and there are
no restrictions on its use (commercial, 18+, etc.).
This plugin is now yours.

@command OUTPUT_LOG
@text Battle log output
@desc Prints the battle log.
@arg message
@text Output message
@desc This is the message to be output as a battle log.
@type multiline_string
@arg pushBaseLine
@text Add a baseline
@desc The log displayed before the battle log output will be erased and the log will be output from the beginning.
@type boolean
@default true
@arg waitCount
@text Weight
@desc Deletes all logs after the specified number of frames have passed. If you specify 0, no logs will be deleted.
@type number
@default 0
*/

/*:ja
@plugindesc バトルログ出力プラグイン
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/BattleLogOutput.js
@base PluginCommonBase
@orderAfter PluginCommonBase
@author トリアコンタン

@command OUTPUT_LOG
@text バトルログ出力
@desc バトルログを出力します。

@arg message
@text 出力メッセージ
@desc バトルログとして出力するメッセージです。
@default
@type multiline_string

@arg pushBaseLine
@text ベースライン追加
@desc バトルログ出力前に表示していたログを消去し、先頭からログ出力します。
@default true
@type boolean

@arg waitCount
@text ウェイト
@desc 指定したフレームが経過したのち、すべてのログを削除します。0を指定するとログは削除されません。
@default 0
@type number

@help BattleLogOutput.js

プラグインコマンドからバトルログを出力できます。
このコマンドは戦闘画面でのみ有効です。

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

    PluginManagerEx.registerCommand(script, 'OUTPUT_LOG', args => {
        BattleManager.displayCustomLog(args.message, args.pushBaseLine, args.waitCount);
    });

    BattleManager.displayCustomLog = function(text, pushBaseLine, waitCount) {
        this._logWindow.displayCustomLog(text, pushBaseLine, waitCount);
    };

    Window_BattleLog.prototype.displayCustomLog = function(text, pushBaseLine, waitCount) {
        if (pushBaseLine) {
            this.push("pushBaseLine");
        }
        const textList = text.split('\n');
        textList.forEach(text => this.push('addText', text));
        if (waitCount > 0) {
            this.push('waitForCount', waitCount);
            this.push("clear");
        }
    };

    Window_BattleLog.prototype.waitForCount = function(count) {
        this._waitCount = count;
    };
})();