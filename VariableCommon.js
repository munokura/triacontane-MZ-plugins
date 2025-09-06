/*=============================================================================
 VariableCommon.js
----------------------------------------------------------------------------
 (C)2024 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.1.0 2025/08/23 共有変数、共有スイッチの個別指定機能を追加
 1.0.0 2024/04/30 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/VariableCommon.js
@plugindesc Shared Variable Switch Plugin
@author Triacontane
@license MIT License

@help
English Help Translator: munokura
Please check the URL below for the latest version of the plugin.
URL https://triacontane.blogspot.com
-----

VariableCommon.js

You can define variables and switches that can be shared between different
save data.
Variables and switches within the specified range will retain their values
even when loading another save data or returning to the title screen.
To maintain performance, please execute the command explicitly when saving.

Shared variable data is saved in config.rmmzsave.
Deleting this file will also erase the shared variable data.

This plugin requires the base plugin "PluginCommonBase.js."
"PluginCommonBase.js" is located in the following folder
in the RPG Maker MZ installation folder:
dlc/BasicResources/plugins/official

Terms of Use:
You may modify and redistribute this plugin without permission from the
author, and there are no restrictions on its use (commercial, R18+, etc.).
This plugin is now yours.

@param startVariableId
@text Shared Variable ID (Start)
@desc Variables within the specified range will be treated as shared variables.
@type variable
@default 0

@param endVariableId
@text Shared variable ID (end)
@desc Variables within the specified range will be treated as shared variables.
@type variable
@default 0

@param variableList
@text Shared Variables List
@desc This is a list of IDs for variables to be treated as shared variables. Set this when you want to specify variables individually.
@type variable[]
@default []

@param startSwitchId
@text Shared Switch ID (Start)
@desc Switches within the specified range will be treated as shared switches.
@type switch
@default 0

@param endSwitchId
@text Shared Switch ID (End)
@desc Switches within the specified range will be treated as shared switches.
@type switch
@default 0

@param switchList
@text Shared Switch List
@desc This is a list of switch IDs to be treated as shared switches. Set this when you want to specify individual switches.
@type switch[]
@default []

@command SAVE_COMMON_VARIABLE
@text Saving Shared Variables
@desc Save the modified shared variable.
*/

/*:ja
@plugindesc 共有変数スイッチプラグイン
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/VariableCommon.js
@base PluginCommonBase
@orderAfter PluginCommonBase
@author トリアコンタン

@param startVariableId
@text 共有変数ID(開始)
@desc 指定した範囲内の変数が共有変数として扱われます。
@default 0
@type variable

@param endVariableId
@text 共有変数ID(終了)
@desc 指定した範囲内の変数が共有変数として扱われます。
@default 0
@type variable

@param variableList
@text 共有変数リスト
@desc 共有変数として扱う変数のIDリストです。個別で変数を指定したいときに設定します。
@default []
@type variable[]

@param startSwitchId
@text 共有スイッチID(開始)
@desc 指定した範囲内のスイッチが共有スイッチとして扱われます。
@default 0
@type switch

@param endSwitchId
@text 共有スイッチID(終了)
@desc 指定した範囲内のスイッチが共有スイッチとして扱われます。
@default 0
@type switch

@param switchList
@text 共有スイッチリスト
@desc 共有スイッチとして扱うスイッチのIDリストです。個別でスイッチを指定したいときに設定します。
@default []
@type switch[]

@command SAVE_COMMON_VARIABLE
@text 共有変数の保存
@desc 変更した共有変数を保存します。

@help VariableCommon.js

異なるセーブデータ間で共有できる変数とスイッチを定義できます。
指定した範囲内の変数、スイッチは別のデータをロードしたり、
タイトルに戻っても値が引き継がれます。
パフォーマンス維持のため、保存の際は明示的にコマンドを実行してください。

共有変数のデータはconfig.rmmzsaveに保存されます。
当該ファイルを削除すると共有変数のデータも消失します。

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
    if (!param.variableList) {
        param.variableList = [];
    }
    if (!param.switchList) {
        param.switchList = [];
    }

    PluginManagerEx.registerCommand(script, 'SAVE_COMMON_VARIABLE', () => {
        ConfigManager.saveCommonVariables();
    });

    Game_Variables.prototype.findCommonVariables = function() {
        const map = {};
        for (let i = param.startVariableId; i <= param.endVariableId; i++) {
            map[i] = this.value(i);
        }
        param.variableList.forEach(id => map[id] = this.value(id));
        return map;
    };

    Game_Variables.prototype.applyCommonVariables = function(map = {}) {
        for (const key in map) {
            if (key >= param.startVariableId && key <= param.endVariableId) {
                this.setValue(key, map[key]);
            }
        }
        param.variableList.forEach(id => this.setValue(id, map[id]));
    };

    Game_Switches.prototype.findCommonSwitches = function() {
        const map = {};
        for (let i = param.startSwitchId; i <= param.endSwitchId; i++) {
            map[i] = this.value(i);
        }
        param.switchList.forEach(id => map[id] = this.value(id));
        return map;
    };

    Game_Switches.prototype.applyCommonSwitches = function(map = {}) {
        for (const key in map) {
            if (key >= param.startSwitchId && key <= param.endSwitchId) {
                this.setValue(key, map[key]);
            }
        }
        param.switchList.forEach(id => this.setValue(id, map[id]));
    };

    const _ConfigManager_makeData = ConfigManager.makeData;
    ConfigManager.makeData = function() {
        const config = _ConfigManager_makeData.apply(this, arguments);
        config.commonVariables = this._commonVariables;
        config.commonSwitches = this._commonSwitches;
        return config;
    };

    const _ConfigManager_applyData = ConfigManager.applyData;
    ConfigManager.applyData = function(config) {
        _ConfigManager_applyData.apply(this, arguments);
        this._commonVariables = config.commonVariables;
        this._commonSwitches = config.commonSwitches;
    };

    ConfigManager.saveCommonVariables = function() {
        this._commonVariables = $gameVariables.findCommonVariables();
        this._commonSwitches = $gameSwitches.findCommonSwitches();
        this.save();
    };

    ConfigManager.loadCommonVariables = function() {
        $gameVariables.applyCommonVariables(this._commonVariables);
        $gameSwitches.applyCommonSwitches(this._commonSwitches);
    };

    const _DataManager_createGameObjects = DataManager.createGameObjects;
    DataManager.createGameObjects = function() {
        _DataManager_createGameObjects.apply(this, arguments);
        ConfigManager.loadCommonVariables();
    };

    const _DataManager_extractSaveContents = DataManager.extractSaveContents;
    DataManager.extractSaveContents = function(contents) {
        _DataManager_extractSaveContents.apply(this, arguments);
        ConfigManager.loadCommonVariables();
    };
})();