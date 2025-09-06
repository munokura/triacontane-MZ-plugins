/*=============================================================================
 MpTpHidden.js
----------------------------------------------------------------------------
 (C)2023 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.2.0 2023/12/24 本プラグインの機能を無効にできるスイッチを追加
 1.1.0 2023/08/26 タイムプログレス戦闘でタイムゲージが非表示になっていた問題を修正し、パラメータで非表示にできる設定を追加
 1.0.0 2023/02/26 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/MpTpHidden.js
@plugindesc MP, TP hidden plugin
@author Triacontane
@license MIT License

@help
English Help Translator: munokura
Please check the URL below for the latest version of the plugin.
URL https://triacontane.blogspot.com
-----

MpTpHidden.js

HP, MP, and TP can be individually hidden for each actor.

This plugin requires the base plugin "PluginCommonBase.js."
"PluginCommonBase.js" is located in the following folder under the RPG Maker
MZ installation folder:

dlc/BasicResources/plugins/official

Terms of Use:
You may modify and redistribute this plugin without permission from the
author, and there are no restrictions on its use (commercial, 18+, etc.).
This plugin is now yours.

@param hpHiddenActors
@text HP hidden actor
@desc A list of actors whose HP will be hidden.
@type actor[]
@default []

@param mpHiddenActors
@text MP Hidden Actor
@desc A list of actors whose MP will be hidden.
@type actor[]
@default []

@param tpHiddenActors
@text TP Hidden Actor
@desc A list of actors who will hide TP.
@type actor[]
@default []

@param timeHiddenActors
@text Time Hiding Actor
@desc A list of actors who will hide the time gauge in time progress battles.
@type actor[]
@default []

@param invalidSwitchId
@text Disabled Switch ID
@desc When the specified switch is ON, the hide setting will be disabled.
@type switch
@default 0
*/

/*:ja
@plugindesc MP,TP非表示プラグイン
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/MpTpHidden.js
@base PluginCommonBase
@orderAfter PluginCommonBase
@author トリアコンタン

@param hpHiddenActors
@text HP非表示アクター
@desc HPを非表示にするアクターの一覧です。
@default []
@type actor[]

@param mpHiddenActors
@text MP非表示アクター
@desc MPを非表示にするアクターの一覧です。
@default []
@type actor[]

@param tpHiddenActors
@text TP非表示アクター
@desc TPを非表示にするアクターの一覧です。
@default []
@type actor[]

@param timeHiddenActors
@text タイム非表示アクター
@desc タイムプログレス戦闘で、タイムゲージを非表示にするアクターの一覧です。
@default []
@type actor[]

@param invalidSwitchId
@text 無効スイッチID
@desc 指定したスイッチがONのとき、非表示設定が無効になります。
@default 0
@type switch

@help MpTpHidden.js

HP, MP, TPをアクター毎に個別に非表示にできます。

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

    Game_Actor.prototype.isHiddenHp = function() {
        return param.hpHiddenActors?.includes(this.actorId());
    };

    Game_Actor.prototype.isHiddenMp = function() {
        return param.mpHiddenActors?.includes(this.actorId());
    };

    Game_Actor.prototype.isHiddenTp = function() {
        return param.tpHiddenActors?.includes(this.actorId());
    };

    Game_Actor.prototype.isHiddenTime = function() {
        return param.timeHiddenActors?.includes(this.actorId());
    };

    Game_Actor.prototype.isHiddenParam = function(type) {
        if (param.invalidSwitchId > 0 && $gameSwitches.value(param.invalidSwitchId)) {
            return false;
        }
        switch (type) {
            case 'hp':
                return this.isHiddenHp();
            case 'mp':
                return this.isHiddenMp();
            case 'tp':
                return this.isHiddenTp();
            case 'time':
                return this.isHiddenTime();
            default:
                return false;
        }
    };

    const _Window_StatusBase_placeGauge = Window_StatusBase.prototype.placeGauge;
    Window_StatusBase.prototype.placeGauge = function(actor, type, x, y) {
        if (actor.isHiddenParam(type)) {
            return;
        }
        _Window_StatusBase_placeGauge.apply(this, arguments);
    };
})();