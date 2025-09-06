//=============================================================================
// EventItemCondition.js
// ----------------------------------------------------------------------------
// (C)2016 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.1 2024/02/07 競合対策
// 1.0.0 2024/02/07 MZ向けに仕様を再検討
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/EventItemCondition.js
@plugindesc Item selection display condition plugin
@author Triacontane
@license MIT License

@help
English Help Translator: munokura
Please check the URL below for the latest version of the plugin.
URL https://triacontane.blogspot.com
-----

EventItemCondition.js

You can set display conditions for each item in the "Item Selection" event
command.

This plugin requires the base plugin "PluginCommonBase.js."
"PluginCommonBase.js" is located in the following folder under the RPG Maker
MZ installation folder:

dlc/BasicResources/plugins/official

Terms of Use:
You may modify and redistribute this plugin without permission, and there are
no restrictions on its use (commercial, 18+, etc.).
This plugin is now yours.

@param DefaultVisible
@text Default display availability
@desc Whether to display items that do not have parameters set. If disabled, all items that do not have settings will not be displayed.
@type boolean
@default true

@param RefreshSwitchId
@text Redraw Switch ID
@desc When the switch with the specified ID is turned ON, the window will be redrawn. After drawing, the switch will automatically be turned OFF.
@type switch
@default 0

@param ConditionList
@text Display Condition List
@desc Set the display conditions for each item.
@type struct<Condition>[]
@default []
*/

/*~struct~Condition:
@param itemId
@text Item ID
@desc The ID of the item for which you want to set the condition.
@type item
@default 1

@param switchId
@text Switch ID
@desc The ID of the switch that will be the condition.
@type switch
@default 0

@param script
@text script
@desc The condition script.
@type multiline_string
*/

/*:ja
@plugindesc アイテム選択の表示条件プラグイン
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/EventItemCondition.js
@base PluginCommonBase
@orderAfter PluginCommonBase
@author トリアコンタン

@param DefaultVisible
@text デフォルト表示可否
@desc パラメータが設定されていないアイテムの表示可否です。無効にすると設定がないアイテムはすべて表示されません。
@default true
@type boolean

@param RefreshSwitchId
@text 再描画スイッチID
@desc 指定したIDのスイッチがONになるとウィンドウを再描画します。描画後、スイッチは自動でOFFになります。
@default 0
@type switch

@param ConditionList
@text 表示条件リスト
@desc アイテムごとの表示条件を設定します。
@default []
@type struct<Condition>[]

@help EventItemCondition.js

イベントコマンド「アイテム選択の処理」において
表示可否の条件をアイテムごとに設定できます。

このプラグインの利用にはベースプラグイン『PluginCommonBase.js』が必要です。
『PluginCommonBase.js』は、RPGツクールMZのインストールフォルダ配下の
以下のフォルダに格納されています。
dlc/BasicResources/plugins/official

利用規約：
 作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 についても制限はありません。
 このプラグインはもうあなたのものです。
*/

/*~struct~Condition:ja
@param itemId
@text アイテムID
@desc 条件を設定するアイテムのIDです。
@default 1
@type item

@param switchId
@text スイッチID
@desc 条件となるスイッチのIDです。
@default 0
@type switch

@param script
@text スクリプト
@desc 条件となるスクリプトです。
@default
@type multiline_string
*/

(()=> {
    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);

    const _Window_EventItem_includes      = Window_EventItem.prototype.includes;
    Window_EventItem.prototype.includes = function(item) {
        return _Window_EventItem_includes.apply(this, arguments) && this.isOkEventItem(item);
    };

    Window_EventItem.prototype.findEventItemCondition = function(item) {
        return DataManager.isItem(item) && param.ConditionList.find(condition => condition.itemId === item.id);
    };

    Window_EventItem.prototype.isOkEventItem = function(item) {
        const condition = this.findEventItemCondition(item);
        if (condition) {
            return this.isOkEventItemSwitch(condition) && this.isOkEventItemScript(condition);
        } else {
            return param.DefaultVisible;
        }
    };

    Window_EventItem.prototype.isOkEventItemSwitch = function(condition) {
        return !condition.switchId || $gameSwitches.value(condition.switchId);

    };

    Window_EventItem.prototype.isOkEventItemScript = function(condition) {
        return !condition.script || eval(condition.script);
    };

    const _Window_EventItem_update      = Window_EventItem.prototype.update;
    Window_EventItem.prototype.update = function() {
        _Window_EventItem_update.apply(this, arguments);
        this.updateAutoRefresh();
    };

    Window_EventItem.prototype.updateAutoRefresh = function() {
        if ($gameSwitches.value(param.RefreshSwitchId) && this.openness === 255) {
            $gameSwitches.setValue(param.RefreshSwitchId, false);
            this.refresh();
            this.select(0);
        }
    };
})();