/*=============================================================================
 LeaderSelectMenu.js
----------------------------------------------------------------------------
 (C)2025 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2025/08/30 初版
----------------------------------------------------------------------------
 [X]      : https://x.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/LeaderSelectMenu.js
@plugindesc First Actor Direct Selection Menu Plugin
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

LeaderSelectMenu.js

On the main menu screen, skip actor selection and always select the leading
actor.

This will transition to the skill screen or status screen.

You can also disable the actor change function on the skill screen, etc.

This plugin requires the base plugin "PluginCommonBase.js."
"PluginCommonBase.js" is located in the following folder under the RPG Maker
MZ installation folder:

dlc/BasicResources/plugins/official

Terms of Use:
You may modify and redistribute this plugin without permission, and there are
no restrictions on its use (commercial, R18+, etc.).

This plugin is now yours.

@param disableActorChange
@text Actor Change Disabled
@desc Disables actor changes using the PageUp/Down keys on status screens, etc.
@type boolean
@default false
*/

/*:ja
@plugindesc 先頭アクター直接選択メニュープラグイン
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/LeaderSelectMenu.js
@base PluginCommonBase
@orderAfter PluginCommonBase
@author トリアコンタン

@param disableActorChange
@text アクター変更無効
@desc ステータス画面などでPageUp/Downキーによるアクター変更を無効にします。
@default false
@type boolean

@help LeaderSelectMenu.js

メインメニュー画面で、アクター選択を省略し、常に先頭アクターを対象に
スキル画面やステータス画面に遷移します。
また、スキル画面などでアクター変更機能を無効にできます。

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

    const _Scene_Menu_commandPersonal = Scene_Menu.prototype.commandPersonal;
    Scene_Menu.prototype.commandPersonal = function() {
        _Scene_Menu_commandPersonal.apply(this, arguments);
        $gameParty.setMenuActor($gameParty.leader());
        this.onPersonalOk();
        this._statusWindow.select(-1);
    };

    Window_Selectable.prototype.removePageUpDownHandle = function() {
        delete this._handlers["pagedown"];
        delete this._handlers["pageup"];
    };

    Scene_MenuBase.prototype.removeActorChangeIfNeed = function(windowObject) {
        if (this.isDisableActorChange()) {
            windowObject.removePageUpDownHandle();
        }
    };

    Scene_MenuBase.prototype.isDisableActorChange = function() {
        return param.disableActorChange;
    };

    const _Scene_Skill_createSkillTypeWindow = Scene_Skill.prototype.createSkillTypeWindow;
    Scene_Skill.prototype.createSkillTypeWindow = function() {
        _Scene_Skill_createSkillTypeWindow.apply(this, arguments);
        this.removeActorChangeIfNeed(this._skillTypeWindow);
    };

    const _Scene_Status_createStatusWindow = Scene_Status.prototype.createStatusWindow;
    Scene_Status.prototype.createStatusWindow = function() {
        _Scene_Status_createStatusWindow.apply(this, arguments);
        this.removeActorChangeIfNeed(this._statusWindow);
    };

    const _Scene_Equip_createCommandWindow = Scene_Equip.prototype.createCommandWindow;
    Scene_Equip.prototype.createCommandWindow = function() {
        _Scene_Equip_createCommandWindow.apply(this, arguments);
        this.removeActorChangeIfNeed(this._commandWindow);
    };

    const _Scene_Skill_needsPageButtons = Scene_Skill.prototype.needsPageButtons;
    Scene_Skill.prototype.needsPageButtons = function() {
        return _Scene_Skill_needsPageButtons.apply(this, arguments) && !this.isDisableActorChange();
    };

    const _Scene_Status_needsPageButtons = Scene_Status.prototype.needsPageButtons;
    Scene_Status.prototype.needsPageButtons = function() {
        return _Scene_Status_needsPageButtons.apply(this, arguments) && !this.isDisableActorChange();
    };

    const _Scene_Equip_needsPageButtons = Scene_Equip.prototype.needsPageButtons;
    Scene_Equip.prototype.needsPageButtons = function() {
        return _Scene_Equip_needsPageButtons.apply(this, arguments) && !this.isDisableActorChange();
    };
})();