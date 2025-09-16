/*=============================================================================
 TpCostZeroInMap.js
----------------------------------------------------------------------------
 (C)2023 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2023/03/08 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/TpCostZeroInMap.js
@plugindesc A plugin that reduces the TP cost of skills outside of battle to 0
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

TpCostZeroInMap.js

This changes the specifications so that TP cost is 0 when using skills outside
of combat.

Terms of Use:
You may modify and redistribute this plugin without permission from the
author, and there are no restrictions on its use (commercial, 18+, etc.).
This plugin is now yours.
*/

/*:ja
@plugindesc 戦闘中以外でのスキルのTPコストを0にするプラグイン
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/TpCostZeroInMap.js
@base PluginCommonBase
@orderAfter PluginCommonBase
@author トリアコンタン

@help TpCostZeroInMap.js

戦闘中以外でスキルを使用するとき、TPのコストが0になるよう
仕様変更します。

利用規約：
 作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 についても制限はありません。
 このプラグインはもうあなたのものです。
*/

(() => {
    'use strict';

    const _Game_BattlerBase_skillTpCost = Game_BattlerBase.prototype.skillTpCost;
    Game_BattlerBase.prototype.skillTpCost = function(skill) {
        if ($gameParty.inBattle()) {
            return _Game_BattlerBase_skillTpCost.apply(this, arguments);
        } else {
            return 0;
        }
    };
})();