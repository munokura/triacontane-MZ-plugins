/*=============================================================================
 VariableLimitation.js
----------------------------------------------------------------------------
 (C)2021 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.1.0 2024/10/13 限界値に適用条件のスイッチを追加
 1.0.0 2021/12/31 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/VariableLimitation.js
@plugindesc Variable Limit Settings Plugin
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

VariableLimitation.js

You can set limits (minimum and maximum values) for variables.
Specifying these limits will prevent the variable value from being set to a
value less than the minimum or greater than the maximum.

This plugin requires the base plugin "PluginCommonBase.js."
"PluginCommonBase.js" is located in the following folder under the RPG Maker
MZ installation folder:
dlc/BasicResources/plugins/official

Terms of Use:
You may modify and redistribute this plugin without permission, and there are
no restrictions on its use (commercial, R18+, etc.).
This plugin is now yours.

@param list
@text Settings List
@desc A list of variables for which you want to set limits. You cannot specify multiple identical variables.
@type struct<Limitation>[]
@default []
*/

/*~struct~Limitation:
@param variableId
@text Variable Number
@desc The number of the variable for which you want to set the minimum and maximum values.
@type variable
@default 1

@param min
@text Minimum
@desc This is the minimum value.
@type number
@default 0
@min -9999999999

@param max
@text Maximum
@desc This is the maximum value.
@type number
@default 0
@min -9999999999

@param conditionSwitch
@text Condition Switch
@desc The limit value is applied only when the switch is ON. If you specify a value that exceeds the limit value when the switch is OFF, the value will remain the same even if you then turn it ON.
@type switch
@default 0
*/

/*:ja
@plugindesc 変数の限界値設定プラグイン
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/VariableLimitation.js
@base PluginCommonBase
@orderAfter PluginCommonBase
@author トリアコンタン

@param list
@text 設定リスト
@desc 限界値を設定したい変数の一覧です。同一の変数を複数指定することはできません。
@default []
@type struct<Limitation>[]

@help VariableLimitation.js

変数に限界値（最小値と最大値）を設定できます。
指定すると変数値が、最小値より小さい値あるいは最大値より大きい値に
設定されなくなります。

このプラグインの利用にはベースプラグイン『PluginCommonBase.js』が必要です。
『PluginCommonBase.js』は、RPGツクールMZのインストールフォルダ配下の
以下のフォルダに格納されています。
dlc/BasicResources/plugins/official

利用規約：
 作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 についても制限はありません。
 このプラグインはもうあなたのものです。
*/

/*~struct~Limitation:ja
@param variableId
@text 変数番号
@desc 最小値、最大値を設定したい変数の番号です。
@type variable
@default 1

@param min
@text 最小値
@desc 最小値です。
@type number
@default 0
@min -9999999999

@param max
@text 最大値
@desc 最大値です。
@type number
@default 0
@min -9999999999

@param conditionSwitch
@text 条件スイッチ
@desc スイッチがONのときのみ限界値を適用します。OFFにときに限界値を超える値を指定してからONにしても値はそのままです。
@default 0
@type switch
*/

(()=> {
    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);
    if (!Array.isArray(param.list)) {
        PluginManagerEx.throwError('Parameter invalid', script);
        return;
    }
    
    const variableMap = new Map();
    param.list.forEach(function(item) {
        variableMap.set(item.variableId, item);
    });

    const _DataManager_createGameObjects = DataManager.createGameObjects;
    DataManager.createGameObjects = function() {
        _DataManager_createGameObjects.apply(this, arguments);
        $gameVariables.applyLimitations();
    };

    const _DataManager_extractSaveContents = DataManager.extractSaveContents;
    DataManager.extractSaveContents = function(contents) {
        _DataManager_extractSaveContents.apply(this, arguments);
        $gameVariables.applyLimitations();
    };

    Game_Variables.prototype.applyLimitations = function() {
        param.list.forEach(function(item) {
            this.setValue(item.variableId, this.value(item.variableId));
        }, this);
    };

    const _Game_Variables_setValue = Game_Variables.prototype.setValue;
    Game_Variables.prototype.setValue = function(variableId, value) {
        arguments[1] = this.applyLimitation(variableId, value);
        _Game_Variables_setValue.apply(this, arguments);
    };

    Game_Variables.prototype.applyLimitation = function(variableId, value) {
        if (variableMap.has(variableId) && !isNaN(value)) {
            const item = variableMap.get(variableId);
            if (item.conditionSwitch > 0 && !$gameSwitches.value(item.conditionSwitch)) {
                return value;
            }
            return value.clamp(item.min, item.max);
        }
        return value;
    };
})();