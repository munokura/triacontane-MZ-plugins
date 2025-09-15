/*=============================================================================
 FixEnemyClickOverlapCancel.js
----------------------------------------------------------------------------
 (C)2023 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2023/08/23 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/FixEnemyClickOverlapCancel.js
@plugindesc Enemy character click cancel overwrite correction plugin
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

FixEnemyClickOverlapCancel.js

Fixes an issue where clicking the Cancel button while selecting an enemy
character in the battle screen would prioritize the click on the enemy
character if the character was overlapping the enemy character.

Terms of Use:
You may modify and redistribute this plugin without permission from the
author, and there are no restrictions on its use (commercial, 18+, etc.).
This plugin is now yours.
*/

/*:ja
@plugindesc 敵キャラクリックのキャンセル上書き修正プラグイン
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/FixEnemyClickOverlapCancel.js
@author トリアコンタン

@help FixEnemyClickOverlapCancel.js

戦闘画面で敵キャラの選択でキャンセルボタンをクリックしたとき
敵キャラと重なっていると敵キャラのクリックが優先されてしまう問題を修正します。

利用規約：
 作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 についても制限はありません。
 このプラグインはもうあなたのものです。
*/

(() => {
    'use strict';
    let preventEnemyClick = false;

    const _Scene_Battle_update = Scene_Battle.prototype.update;
    Scene_Battle.prototype.update = function() {
        if (this._cancelButton && this._cancelButton.isBeingTouched()) {
            preventEnemyClick = true;
        }
        _Scene_Battle_update.apply(this, arguments);
        preventEnemyClick = false;
    };

    const _Window_BattleEnemy_processTouch = Window_BattleEnemy.prototype.processTouch;
    Window_BattleEnemy.prototype.processTouch = function() {
        if (preventEnemyClick) {
            return;
        }
        _Window_BattleEnemy_processTouch.apply(this, arguments);
    };
})();