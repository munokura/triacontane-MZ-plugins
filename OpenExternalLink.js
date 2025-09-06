/*=============================================================================
 OpenExternalLink.js
----------------------------------------------------------------------------
 (C)2023 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2023/05/08 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/OpenExternalLink.js
@plugindesc Plugins that open external links
@author Triacontane
@license MIT License

@help
English Help Translator: munokura
Please check the URL below for the latest version of the plugin.
URL https://triacontane.blogspot.com
-----

OpenExternalLink.js

Opens the specified URL in the default browser.
Please run this from the plugin command.

This plugin requires the base plugin "PluginCommonBase.js."
"PluginCommonBase.js" is located in the following folder under the RPG Maker
MZ installation folder:

dlc/BasicResources/plugins/official

Terms of Use:
You may modify and redistribute this plugin without permission, and there are
no restrictions on its use (commercial, 18+, etc.).
This plugin is now yours.

@command OPEN
@text Open the link
@desc Opens the specified URL in the default browser.
@arg url
@text URL
@desc The URL to open.
@type string
*/

/*:ja
@plugindesc 外部リンクを開くプラグイン
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/OpenExternalLink.js
@base PluginCommonBase
@orderAfter PluginCommonBase
@author トリアコンタン

@command OPEN
@text リンクを開く
@desc 指定したURLを既定のブラウザで開きます。

@arg url
@text URL
@desc 開くURLです。
@default
@type string

@help OpenExternalLink.js

指定したURLを既定のブラウザで開きます。
プラグインコマンドから実行してください。

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

    PluginManagerEx.registerCommand(script, 'OPEN', function(args) {
        this.openExternalLink(args.url);
    });

    Game_Interpreter.prototype.openExternalLink = function(url) {
        if (!Utils.isNwjs()) {
            window.open(url);
        } else {
            const exec = require('child_process').exec;
            if (process.platform === 'darwin') {
                exec('open "" "' + url + '"' );
            } else {
                exec('start "" "' + url + '"');
            }
        }
    };
})();