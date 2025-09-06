/*=============================================================================
 AutoSaveDisable.js
----------------------------------------------------------------------------
 (C)2024 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.1 2024/04/28 オートセーブ禁止状態になっていると、セーブおよびロード画面でオートセーブの枠が表示されない問題を修正
 1.0.0 2024/04/27 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/AutoSaveDisable.js
@plugindesc Autosave prohibition plugin
@author Triacontane
@license MIT License

@help
English Help Translator: munokura
Please check the URL below for the latest version of the plugin.
URL https://triacontane.blogspot.com
-----

AutoSaveDisable.js

Disables auto-saving when the specified switch is ON.

This plugin requires the base plugin "PluginCommonBase.js."
"PluginCommonBase.js" is located in the following folder under the RPG Maker
MZ installation folder:

dlc/BasicResources/plugins/official

Terms of Use:
You may modify and redistribute this plugin without permission, and there are
no restrictions on its use (commercial, 18+, etc.).
This plugin is now yours.

@param switchId
@text Auto-save disable switch
@desc Disables auto-saving when the specified switch is ON.
@type switch
@default 1
*/

/*:ja
@plugindesc オートセーブ禁止プラグイン
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/AutoSaveDisable.js
@base PluginCommonBase
@orderAfter PluginCommonBase
@author トリアコンタン

@param switchId
@text オートセーブ禁止スイッチ
@desc 指定したスイッチがONのときオートセーブを禁止します。
@default 1
@type switch

@help AutoSaveDisable.js

指定したスイッチがONのときにオートセーブを禁止します。

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

    const _Game_System_isAutosaveEnabled = Game_System.prototype.isAutosaveEnabled;
    Game_System.prototype.isAutosaveEnabled = function() {
        const result = _Game_System_isAutosaveEnabled.apply(this, arguments);
        if (SceneManager._scene instanceof Scene_File) {
            return result;
        } else {
            return result && !this.isAutoSaveDisabled();
        }
    }

    Game_System.prototype.isAutoSaveDisabled = function() {
        return param.switchId && $gameSwitches.value(param.switchId);
    };
})();