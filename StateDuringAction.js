/*=============================================================================
 StateDuringAction.js
----------------------------------------------------------------------------
 (C)2022 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.1 2022/10/20 スキル使用者の解除メッセージが正しく表示されていなかった問題を修正
 1.0.0 2022/01/25 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/StateDuringAction.js
@plugindesc Action state granting plugin
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

StateDuringAction.js

You can create skills that grant states to yourself or your opponents only
during an action.
The state is granted immediately before the action and removed immediately
after.
Because the process is instantaneous, no icons or effects are displayed.
A message indicating the state is removed will also be displayed after the
action.

Please specify the following in the skill or item's memo field.

Grant State [2] to the skill user only during the action.
<StateDuringActionSubject:2>
<Grant State to User During Action:2>

Grant State [3] to the skill target only during the action.
<StateDuringActionTarget:3>
<Grant State to Target During Action:3>

This plugin requires the base plugin "PluginCommonBase.js."
"PluginCommonBase.js" is located in the following folder
under the RPG Maker MZ installation folder.
dlc/BasicResources/plugins/official

Terms of Use:
You may modify and redistribute this plugin without permission from the
author, and there are no restrictions on its use (commercial, 18+, etc.).
This plugin is now yours.
*/

/*:ja
@plugindesc 行動中ステート付与プラグイン
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/StateDuringAction.js
@base PluginCommonBase
@orderAfter PluginCommonBase
@author トリアコンタン

@help StateDuringAction.js

行動中のみ自分か相手にステートを付与するスキルを作成できます。
ステートは行動直前に付与され、行動直後に解除されます。
処理上は一瞬なのでアイコンやエフェクト等は表示されません。
また、行動後ステート解除メッセージが表示されます。

スキル、アイテムのメモ欄に以下の通り指定してください。

行動中のみスキル使用者にステート[2]を付与
<StateDuringActionSubject:2>
<行動中使用者ステート付与:2>

行動中のみスキル対象者にステート[3]を付与
<StateDuringActionTarget:3>
<行動中対象者ステート付与:3>

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

    const _Game_Action_apply = Game_Action.prototype.apply;
    Game_Action.prototype.apply = function(target) {
        this.addDuringActionState(target);
        _Game_Action_apply.apply(this, arguments);
        this.removeDuringActionState(target);
    };

    Game_Action.prototype.addDuringActionState = function(target) {
        const subjectStateId = PluginManagerEx.findMetaValue(this.item(),
            ['StateDuringActionSubject', '行動中使用者ステート付与']);
        if (subjectStateId) {
            this.subject().addState(subjectStateId);
        }
        const targetStateId = PluginManagerEx.findMetaValue(this.item(),
            ['StateDuringActionTarget', '行動中対象者ステート付与']);
        if (targetStateId) {
            target.addState(targetStateId);
        }
    };

    Game_Action.prototype.removeDuringActionState = function(target) {
        const subjectStateId = PluginManagerEx.findMetaValue(this.item(),
            ['StateDuringActionSubject', '行動中使用者ステート付与']);
        if (subjectStateId) {
            this.subject().removeState(subjectStateId);
            BattleManager._logWindow.displayRemovedStates(this.subject());
        }
        const targetStateId = PluginManagerEx.findMetaValue(this.item(),
            ['StateDuringActionTarget', '行動中対象者ステート付与']);
        if (targetStateId) {
            target.removeState(targetStateId);
        }
    };
})();