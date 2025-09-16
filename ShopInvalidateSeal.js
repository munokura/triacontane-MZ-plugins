/*=============================================================================
 ShopInvalidateSeal.js
----------------------------------------------------------------------------
 (C)2024 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2024/03/24 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/ShopInvalidateSeal.js
@plugindesc Plugin to disable equipment seals on the shop screen
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

ShopInvalidateSeal.js

Invalidates an actor's equipment seal on the shop screen.
You can now view stat differences for sealed equipment.

Terms of Use:
You may modify and redistribute this plugin without permission from the
author, and there are no restrictions on its use (commercial, 18+, etc.).
This plugin is now yours.
*/

/*:ja
@plugindesc ショップ画面での装備封印無効化プラグイン
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/ShopInvalidateSeal.js
@author トリアコンタン

@help ShopInvalidateSeal.js

ショップ画面においてアクターの装備封印を無効化します。
封印された装備でもステータス差分を確認できるようになります。

利用規約：
 作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 についても制限はありません。
 このプラグインはもうあなたのものです。
*/

(() => {
    'use strict';

    const _Game_BattlerBase_isEquipTypeSealed = Game_BattlerBase.prototype.isEquipTypeSealed;
    Game_BattlerBase.prototype.isEquipTypeSealed = function(etypeId) {
        const result = _Game_BattlerBase_isEquipTypeSealed.apply(this, arguments);
        if (SceneManager._scene instanceof Scene_Shop) {
            return false;
        } else {
            return result;
        }
    };
})();