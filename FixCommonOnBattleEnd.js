/*=============================================================================
 FixCommonOnBattleEnd.js
----------------------------------------------------------------------------
 (C)2020 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.1.1 2023/06/18 実装ミス修正
 1.1.0 2023/06/17 MZ用にリファクタリング
 1.0.0 2020/04/05 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/FixCommonOnBattleEnd.js
@plugindesc Common event execution correction plugin at the end of battle
@author Triacontane
@license MIT License

@help
English Help Translator: munokura
Please check the URL below for the latest version of the plugin.
URL https://triacontane.blogspot.com
-----

FixCommonOnBattleEnd.js

This changes the specifications so that the common event specified by the
skill will be executed even when the battle ends after delivering the final
blow.

Terms of Use:
You may modify and redistribute this plugin without permission from the
author, and there are no restrictions on its use (commercial, 18+, etc.).
This plugin is now yours.
*/

/*:ja
@plugindesc 戦闘終了時のコモンイベント実行修正プラグイン
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/FixCommonOnBattleEnd.js
@author トリアコンタン

@help FixCommonOnBattleEnd.js

相手にトドメを刺して戦闘終了したときもスキルで指定した
コモンイベントが実行されるように仕様変更します。

利用規約：
 作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 についても制限はありません。
 このプラグインはもうあなたのものです。
*/

(() => {
    'use strict';

    const _BattleManager_checkBattleEnd = BattleManager.checkBattleEnd;
    BattleManager.checkBattleEnd = function() {
        if ($gameTemp.isCommonEventReserved()) {
            return false;
        } else {
            return _BattleManager_checkBattleEnd.apply(this, arguments);
        }
    }
})();