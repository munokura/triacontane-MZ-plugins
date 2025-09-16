/*=============================================================================
 DyingRateChange.js
----------------------------------------------------------------------------
 (C)2024 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2024/03/18 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/DyingRateChange.js
@plugindesc Dying Rate Change Plugin
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

DyingRateChange.js

Changes the percentage of HP that will cause a player to die.
Affects HP display color, actor motion, and the substitute condition.

This plugin requires the base plugin "PluginCommonBase.js."
"PluginCommonBase.js" is located in the following folder under the RPG Maker
MZ installation folder:

dlc/BasicResources/plugins/official

Terms of Use:
You may modify and redistribute this plugin without permission, and there are
no restrictions on its use (commercial, 18+, etc.).
This plugin is now yours.

@param dyingRate
@text Dying Rate
@desc The rate when near death. Please specify as a percentage.
@type number
@default 25
@min 0
@max 100
*/

/*:ja
@plugindesc 瀕死レート変更プラグイン
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/DyingRateChange.js
@base PluginCommonBase
@orderAfter PluginCommonBase
@author トリアコンタン

@param dyingRate
@text 瀕死レート
@desc 瀕死時のレートです。百分率で指定してください。
@default 25
@type number
@min 0
@max 100

@help DyingRateChange.js

瀕死となるHPの割合を変更します。
HPの表示色やアクターモーション、身代わり条件などに影響します。

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

    const _Game_BattlerBase_isDying = Game_BattlerBase.prototype.isDying;
    Game_BattlerBase.prototype.isDying = function() {
        const result = _Game_BattlerBase_isDying.apply(this, arguments);
        if (param.dyingRate) {
            return this.isAlive() && this.hpRate() <= param.dyingRate / 100;
        } else {
            return result;
        }
    };
})();