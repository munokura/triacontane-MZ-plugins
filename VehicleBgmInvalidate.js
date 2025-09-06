/*=============================================================================
 VehicleBgmInvalidate.js
----------------------------------------------------------------------------
 (C)2022 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2022/09/06 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/VehicleBgmInvalidate.js
@plugindesc Vehicle BGM disable plugin
@author Triacontane
@license MIT License

@help
English Help Translator: munokura
Please check the URL below for the latest version of the plugin.
URL https://triacontane.blogspot.com
-----

VehicleBgmInvalidate.js

Disables the background music that plays when boarding a vehicle, and
continues playing the original music.
Individual control is possible for small ships, large ships, and airships.

This plugin requires the base plugin "PluginCommonBase.js."
"PluginCommonBase.js" is located in the following folder under the RPG Maker
MZ installation folder:
dlc/BasicResources/plugins/official

Terms of Use:
You may modify and redistribute this plugin without permission, and there are
no restrictions on its use (commercial, 18+, etc.).
This plugin is now yours.

@param boatInvalid
@text Disable background music on small ships
@desc Disable background music when on a small ship. Use the control character \s[n] to control it dynamically.
@type boolean
@default true

@param shipInvalid
@text Disable BGM on large ships
@desc Disable background music when on a large ship. Use the control character \s[n] to control it dynamically.
@type boolean
@default true

@param airShipInvalid
@text Disable BGM on the airship
@desc Disable background music when on board the airship. Use the control character \s[n] to control it dynamically.
@type boolean
@default true
*/

/*:ja
@plugindesc 乗り物BGMの無効化プラグイン
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/VehicleBgmInvalidate.js
@base PluginCommonBase
@orderAfter PluginCommonBase
@author トリアコンタン

@param boatInvalid
@text 小型船でBGM無効化
@desc 小型船に乗船しているとき、BGMを無効にします。動的に制御したい場合は制御文字\s[n]を使用します。
@default true
@type boolean

@param shipInvalid
@text 大型船でBGM無効化
@desc 大型船に乗船しているとき、BGMを無効にします。動的に制御したい場合は制御文字\s[n]を使用します。
@default true
@type boolean

@param airShipInvalid
@text 飛行船でBGM無効化
@desc 飛行船に乗船しているとき、BGMを無効にします。動的に制御したい場合は制御文字\s[n]を使用します。
@default true
@type boolean

@help VehicleBgmInvalidate.js

乗り物に搭乗したときのBGM演奏を無効化し、もとのBGMを演奏しつづけます。
小型船、大型船、飛行船ごとに個別制御が可能です。

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

    const _Game_Vehicle_playBgm = Game_Vehicle.prototype.playBgm;
    Game_Vehicle.prototype.playBgm = function() {
        if (this.isBgmInvalid()) {
            return;
        }
        _Game_Vehicle_playBgm.apply(this, arguments);
    };

    Game_Vehicle.prototype.isBgmInvalid = function() {
        if (this.isBoat()) {
            return param.boatInvalid;
        } else if (this.isShip()) {
            return param.shipInvalid;
        } else if (this.isAirship()) {
            return param.airShipInvalid;
        } else {
            return false;
        }
    };

    const _Game_Map_autoplay = Game_Map.prototype.autoplay;
    Game_Map.prototype.autoplay = function() {
        _Game_Map_autoplay.apply(this, arguments);
        if ($dataMap.autoplayBgm && $gamePlayer.isInVehicle() && $gamePlayer.vehicle().isBgmInvalid()) {
            AudioManager.playBgm($dataMap.bgm);
        }
    };
})();