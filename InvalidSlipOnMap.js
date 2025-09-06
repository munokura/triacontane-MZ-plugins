/*=============================================================================
 InvalidSlipOnMap.js
----------------------------------------------------------------------------
 (C)2022 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.1 2022/02/06 戦闘中も無効になってしまっていた問題を修正
 1.0.0 2022/02/06 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/InvalidSlipOnMap.js
@plugindesc Plugin to disable slip damage on maps
@author Triacontane
@license MIT License

@help
English Help Translator: munokura
Please check the URL below for the latest version of the plugin.
URL https://triacontane.blogspot.com
-----

InvalidSlipOnMap.js

Disables slip damage and recovery due to map states.
HP, MP, and TP are all disabled.

Terms of Use:
You may modify and redistribute this plugin without permission, and there are
no restrictions on its use (commercial, 18+, etc.).
This plugin is now yours.
*/

/*:ja
@plugindesc マップ上でのスリップダメージ無効プラグイン
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/InvalidSlipOnMap.js
@author トリアコンタン

@help InvalidSlipOnMap.js

マップ上でのステートによるスリップダメージや回復を無効にします。
HP、MP、TPすべて無効化されます。

利用規約：
 作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 についても制限はありません。
 このプラグインはもうあなたのものです。
*/

(() => {
    'use strict';

    const _Game_Battler_regenerateAll = Game_Battler.prototype.regenerateAll;
    Game_Battler.prototype.regenerateAll = function() {
        if (!$gameParty.inBattle()) {
            return;
        }
        _Game_Battler_regenerateAll.apply(this, arguments);
    }
})();