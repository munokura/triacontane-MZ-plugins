/*=============================================================================
 EncounterWeightVariable.js
----------------------------------------------------------------------------
 (C)2024 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2024/03/09 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/EncounterWeightVariable.js
@plugindesc Encounter Weight Variable Plugin
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

EncounterWeightVariable.js

You can change the encounter weight setting in the map settings to a variable
instead of a fixed value.
The weight value you set becomes the variable number.
If the variable value returns 0, that group will not appear.

Terms of Use:
You may modify and redistribute this plugin without permission, and there are
no restrictions on its use (commercial, 18+, etc.).
This plugin is now yours.
*/

/*:ja
@plugindesc エンカウント重み変数プラグイン
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/EncounterWeightVariable.js
@author トリアコンタン

@help EncounterWeightVariable.js

マップ設定から設定するエンカウントの重み設定を固定値ではなく
変数値からの取得に変更できます。
重みで設定した値が変数番号になります。
変数値が0を返却した場合、そのグループは出現しなくなります。

利用規約：
 作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 についても制限はありません。
 このプラグインはもうあなたのものです。
*/

(() => {
    'use strict';

    const _Game_Map_encounterList = Game_Map.prototype.encounterList;
    Game_Map.prototype.encounterList = function() {
        const list = _Game_Map_encounterList.apply(this, arguments);
        list.forEach(encounter => encounter.weight = $gameVariables.value(encounter.weight));
        return list;
    };
})();