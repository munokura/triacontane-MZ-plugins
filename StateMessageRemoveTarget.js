/*=============================================================================
 StateMessageRemoveTarget.js
----------------------------------------------------------------------------
 (C)2019 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.1.0 2023/12/10 MZで動作するよう修正
 1.0.1 2023/12/08 マップ上でステート付与した場合に名前が消されていなかった問題を修正
 1.0.0 2019/09/23 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/StateMessageRemoveTarget.js
@plugindesc Remove subject name from state message
@author Triacontane
@license MIT License

@help
English Help Translator: munokura
Please check the URL below for the latest version of the plugin.
URL https://triacontane.blogspot.com
-----

StateMessageRemoveBattler.js

Removes the "recipient's name" that is automatically added to the beginning of
state messages.

Terms of Use:
You may modify and redistribute this plugin without permission from the
author, and there are no restrictions on its use (commercial, R18+, etc.).
This plugin is now yours.
*/

/*:ja
@plugindesc ステートメッセージから対象者名を消去
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/StateMessageRemoveTarget.js
@author トリアコンタン

@help StateMessageRemoveBattler.js

ステートメッセージの先頭に自動付与される「対象者の名前」を消去します。

利用規約：
 作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 についても制限はありません。
 このプラグインはもうあなたのものです。
*/

(()=> {
    'use strict';

    /**
     * Game_Battler
     * 名称を返却する際に空文字を返します。
     */
    Game_Battler.prototype.hiddenNameOnlyTargetProcess = function(process) {
        const prevName = this._name;
        this._name = ''
        this._nameHidden = true;
        process();
        this._name = prevName;
        this._nameHidden = false;
    };

    const _Game_Actor_showAddedStates = Game_Actor.prototype.showAddedStates;
    Game_Actor.prototype.showAddedStates = function() {
        this.hiddenNameOnlyTargetProcess(_Game_Actor_showAddedStates.bind(this));
    };

    const _Game_Enemy_name = Game_Enemy.prototype.name;
    Game_Enemy.prototype.name = function() {
        const name = _Game_Enemy_name.apply(this, arguments);
        return this._nameHidden ? '' : name;
    };

    const _Game_Actor_showRemovedStates = Game_Actor.prototype.showRemovedStates;
    Game_Actor.prototype.showRemovedStates = function() {
        this.hiddenNameOnlyTargetProcess(_Game_Actor_showRemovedStates.bind(this));
    };

    /**
     * Window_BattleLog ステートメッセージから対象者名を除去します。
     */
    const _Window_BattleLog_displayCurrentState = Window_BattleLog.prototype.displayCurrentState;
    Window_BattleLog.prototype.displayCurrentState = function(subject) {
        subject.hiddenNameOnlyTargetProcess(_Window_BattleLog_displayCurrentState.bind(this, subject));
    };

    const _Window_BattleLog_displayChangedStates = Window_BattleLog.prototype.displayChangedStates;
    Window_BattleLog.prototype.displayChangedStates = function(target) {
        target.hiddenNameOnlyTargetProcess(_Window_BattleLog_displayChangedStates.bind(this, target));
    };
})();