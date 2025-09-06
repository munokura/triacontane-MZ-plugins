/*=============================================================================
 EventTouchStrictly.js
----------------------------------------------------------------------------
 (C)2024 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.1 2024/07/10 通常キャラの下かつ決定ボタンのイベントが起動しない問題を修正
 1.0.0 2024/03/20 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/EventTouchStrictly.js
@plugindesc Event Contact Strictness Plugin
@author Triacontane
@license MIT License

@help
English Help Translator: munokura
Please check the URL below for the latest version of the plugin.
URL https://triacontane.blogspot.com
-----

EventTouchStrictly.js

Limits the "Event to Touch" trigger condition to only when an event actually
touches the object.
It will not be triggered by pressing the Confirm button or by touching the
object itself.
This feature can be enabled or disabled using the switch specified in the
plugin parameters.

This plugin requires the base plugin "PluginCommonBase.js."
"PluginCommonBase.js" is located in the following folder under the RPG Maker
MZ installation folder:
dlc/BasicResources/plugins/official

Terms of Use:
You may modify and redistribute this plugin without permission from the
author, and there are no restrictions on its use (commercial, 18+, etc.).
This plugin is now yours.

@param disableSwitchId
@text Invalid Switch Number
@desc When the specified switch is ON, the plugin function will be disabled.
@type switch
@default 0
*/

/*:ja
@plugindesc イベント接触の厳格化プラグイン
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/EventTouchStrictly.js
@base PluginCommonBase
@orderAfter PluginCommonBase
@author トリアコンタン

@param disableSwitchId
@text 無効スイッチ番号
@desc 指定したスイッチがONのとき、プラグインの機能を無効化します。
@default 0
@type switch

@help EventTouchStrictly.js

『イベントから接触』の起動条件を実際にイベントが接触した場合のみに限定します。
決定ボタンやプレイヤーからの接触では起動しなくなります。
プラグインパラメータで指定したスイッチで本機能の有効無効を切り替えられます。

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

    const _Game_Player_startMapEvent = Game_Player.prototype.startMapEvent;
    Game_Player.prototype.startMapEvent = function(x, y, triggers, normal) {
        if (!$gameSwitches.value(param.disableSwitchId) && triggers.includes(2)) {
            triggers.splice(triggers.indexOf(2), 1);
        }
        _Game_Player_startMapEvent.apply(this, arguments);
    };
})();