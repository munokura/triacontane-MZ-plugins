/*=============================================================================
 BattlerNameEscape.js
----------------------------------------------------------------------------
 (C)2024 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2024/12/26 初版
----------------------------------------------------------------------------
 [X]      : https://x.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/BattlerNameEscape.js
@plugindesc Plugin for using control characters in butler names
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

BattlerNameEscape.js

This plugin allows you to use control characters in actor and enemy character
names.

However, it does not support control characters that change the appearance of
text, such as \i[n] and \c[n].

It is compatible with \v[n], \p[n], and the official "TextScriptBase" plugin.

This plugin requires the base plugin "PluginCommonBase.js."
"PluginCommonBase.js" is located in the following folder under the RPG Maker
MZ installation folder:

dlc/BasicResources/plugins/official

Terms of Use:
You may modify and redistribute this plugin without permission, and there are
no restrictions on its use (commercial, R18+, etc.).

This plugin is now yours.
*/

/*:ja
@plugindesc バトラー名に制御文字使用プラグイン
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/BattlerNameEscape.js
@base PluginCommonBase
@orderAfter PluginCommonBase
@author トリアコンタン

@help BattlerNameEscape.js

アクター名、敵キャラ名に制御文字が使えるようになります。
ただし、\i[n]や\c[n]などテキストの外観を変える制御文字には対応できません。

\v[n], \p[n]や公式プラグイン「TextScriptBase」との連携は可能です。

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

    const _Game_Actor_name = Game_Actor.prototype.name;
    Game_Actor.prototype.name = function() {
        return this.convertEscapeText(_Game_Actor_name.apply(this, arguments));
    };

    const _Game_Enemy_name = Game_Enemy.prototype.name;
    Game_Enemy.prototype.name = function() {
        return this.convertEscapeText(_Game_Enemy_name.apply(this, arguments));
    };

    Game_Battler.prototype.convertEscapeText = function(text) {
        return PluginManagerEx.convertEscapeCharacters(text, null);
    };
})();