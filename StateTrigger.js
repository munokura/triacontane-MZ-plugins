/*=============================================================================
 StateTrigger.js
----------------------------------------------------------------------------
 (C)2024 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.1.0 2024/07/26 トリガー有効時にスイッチをOFFにできる機能を追加
 1.0.0 2024/07/23 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/StateTrigger.js
@plugindesc State Trigger Plugin
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

StateTrigger.js

The application or removal of a state can trigger the application or removal
of another state or buff.
You can also toggle switches and execute custom scripts.

By specifying a condition, the trigger will only be executed if a tag is
entered in the memo field (※1).
For example, if you specify "aaa" as the condition, the trigger will only be
executed if the tag is entered in the memo field.

※1 Actors, classes, weapons, armor, states, and enemy characters are targeted.

This plugin requires the base plugin "PluginCommonBase.js."
"PluginCommonBase.js" is located in the following folder under the RPG Maker
MZ installation folder:
dlc/BasicResources/plugins/official

Terms of Use:
You may modify and redistribute this plugin without permission, and there are
no restrictions on its use (commercial, 18+, etc.).
This plugin is now yours.

@param stateList
@text State List
@desc A list of state triggers.
@type struct<Trigger>[]
@default []
*/

/*~struct~Trigger:
@param stateId
@text State ID
@desc The trigger state ID.
@type state
@default 1

@param type
@text Trigger Type
@desc The type of trigger (on or off).
@type select
@default add
@option Grant
@value add
@option Cancellation
@value remove

@param affectedOnly
@text Only when enabled
@desc The trigger will not be executed if the state is released when it is not granted, or if it is re-granted when it is granted.
@type boolean
@default true

@param removeStates
@text List of Cancelled State IDs
@desc A list of state IDs that will be released when the trigger state is enabled.
@type state[]
@default []

@param addStates
@text List of granted state IDs
@desc A list of state IDs that are assigned when the trigger state is enabled.
@type state[]
@default []

@param removeBuff
@text List of buffs removed
@desc A list of buffs that will be removed when the trigger state is activated.
@type struct<Buff>[]
@default []

@param addBuff
@text List of granted buffs
@desc This is a list of buffs that are granted when the trigger state is active.
@type struct<Buff>[]
@default []

@param removeDebuff
@text List of debuffs to remove
@desc This is a list of debuffs that are removed when the trigger state is active.
@type struct<Buff>[]
@default []

@param addDebuff
@text List of debuffs applied
@desc This is a list of debuffs that are applied when the trigger state is active.
@type struct<Buff>[]
@default []

@param switchId
@text Switch ID
@desc The switch ID to switch when the trigger state is enabled.
@type switch
@default 0

@param switchValue
@text Switch setting value
@desc This is the setting value (ON/OFF) of the switch that turns ON when the trigger state is enabled.
@type boolean
@default true

@param script
@text script
@desc The script that is executed when the trigger state is enabled.
@type multiline_string

@param conditionTag
@text Condition tag
@desc This tag specifies the conditions under which the trigger will be applied. If you specify "aaa", it will only be applied to battlers who have "<aaa>" in their memo field.
@type string

@param conditionReverse
@text Reverse application conditions
@desc The application conditions are reversed and applied to battlers who do not meet the conditions.
@type boolean
@default false
*/

/*~struct~Buff:
@param id
@text Buff Type
@desc The type of buff being targeted.
@type select
@default 0
@option Max HP
@value 0
@option Max MP
@value 1
@option Attack Power
@value 2
@option Defense power
@value 3
@option magic power
@value 4
@option magic defense
@value 5
@option agility
@value 6
@option luck
@value 7

@param turn
@text Number of turns
@desc The number of turns for the buff (debuff). No need to enter this if you are canceling it.
@type number
@default 5
*/

/*:ja
@plugindesc ステートトリガープラグイン
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/StateTrigger.js
@base PluginCommonBase
@orderAfter PluginCommonBase
@author トリアコンタン

@param stateList
@text ステートリスト
@desc ステートトリガーの一覧です。
@default []
@type struct<Trigger>[]

@help StateTrigger.js

ステートの付与、解除をトリガーに別のステートやバフを付与、解除できます。
スイッチの切替や任意スクリプトの実行も可能です。

適用条件を指定するとメモ欄(※1)に任意のタグが記述されていた場合のみ
トリガーを実行できます。
例えば、条件にaaaと指定した場合メモ欄に<aaa>を含むバトラーが対象です。

※1 アクター、職業、武器、防具、ステート、敵キャラが対象

このプラグインの利用にはベースプラグイン『PluginCommonBase.js』が必要です。
『PluginCommonBase.js』は、RPGツクールMZのインストールフォルダ配下の
以下のフォルダに格納されています。
dlc/BasicResources/plugins/official

利用規約：
 作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 についても制限はありません。
 このプラグインはもうあなたのものです。
*/

/*~struct~Trigger:ja
@param stateId
@text ステートID
@desc トリガーとなるステートIDです。
@default 1
@type state

@param type
@text トリガータイプ
@desc トリガーの種類（付与 or 解除）です。
@default add
@type select
@option 付与
@value add
@option 解除
@value remove

@param affectedOnly
@text 有効時のみ
@desc ステートが付与されていない状態での解除や、付与された状態での再付与ではトリガーを実行しません。
@default true
@type boolean

@param removeStates
@text 解除ステートID一覧
@desc トリガーステート有効時に解除されるステートIDのリストです。
@default []
@type state[]

@param addStates
@text 付与ステートID一覧
@desc トリガーステート有効時に付与されるステートIDのリストです。
@default []
@type state[]

@param removeBuff
@text 解除バフ一覧
@desc トリガーステート有効時に解除されるバフのリストです。
@default []
@type struct<Buff>[]

@param addBuff
@text 付与バフ一覧
@desc トリガーステート有効時に付与されるバフのリストです。
@default []
@type struct<Buff>[]

@param removeDebuff
@text 解除デバフ一覧
@desc トリガーステート有効時に解除されるデバフのリストです。
@default []
@type struct<Buff>[]

@param addDebuff
@text 付与デバフ一覧
@desc トリガーステート有効時に付与されるデバフのリストです。
@default []
@type struct<Buff>[]

@param switchId
@text スイッチID
@desc トリガーステート有効時に切り替えるスイッチIDです。
@default 0
@type switch

@param switchValue
@text スイッチ設定値
@desc トリガーステート有効時にONになるスイッチの設定値(ON/OFF)です。
@default true
@type boolean

@param script
@text スクリプト
@desc トリガーステート有効時に実行されるスクリプトです。
@default
@type multiline_string

@param conditionTag
@text 適用条件タグ
@desc トリガーの適用条件を指定するタグです。aaaと指定するとメモ欄に<aaa>を保つバトラーにのみ適用されます。
@default
@type string

@param conditionReverse
@text 適用条件反転
@desc 適用条件を反転し、条件を満たさないバトラーに適用されます。
@default false
@type boolean
*/

/*~struct~Buff:ja
@param id
@text バフ種別
@desc 対象となるバフの種別です。
@default 0
@type select
@option 最大HP
@value 0
@option 最大MP
@value 1
@option 攻撃力
@value 2
@option 防御力
@value 3
@option 魔法力
@value 4
@option 魔法防御
@value 5
@option 敏捷性
@value 6
@option 運
@value 7

@param turn
@text ターン数
@desc バフ(デバフ)のターン数です。解除の場合は入力不要です。
@default 5
@type number
*/

(() => {
    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);
    if (!param.stateList) {
        return;
    }

    const _Game_Battler_addState = Game_Battler.prototype.addState;
    Game_Battler.prototype.addState = function(stateId) {
        const addable = this.isStateAddable(stateId);
        const effectValid = !this.isStateAffected(stateId);
        _Game_Battler_addState.apply(this, arguments);
        if (addable) {
            this.executeStateTrigger(stateId, 'add', effectValid);
        }
    };

    const _Game_Battler_removeState = Game_Battler.prototype.removeState;
    Game_Battler.prototype.removeState = function(stateId) {
        const effectValid = this.isStateAffected(stateId);
        _Game_Battler_removeState.apply(this, arguments);
        this.executeStateTrigger(stateId, 'remove', effectValid);
    };

    Game_Battler.prototype.executeStateTrigger = function(stateId, type, effectValid) {
        this._stateTriggerDepth = this._stateTriggerDepth || 0;
        if (this._stateTriggerDepth > 10) {
            return;
        }
        this._stateTriggerDepth++;
        const triggers = param.stateList.filter(trigger => trigger.stateId === stateId && trigger.type === type);
        triggers.forEach(trigger => {
            if (this.isStateTriggerValid(trigger, effectValid)) {
                this.executeStateTriggerEffect(trigger);
            }
        });
        this._stateTriggerDepth--;
    };

    Game_Battler.prototype.isStateTriggerValid = function(trigger, effectValid) {
        if (!effectValid && trigger.affectedOnly) {
            return false;
        }
        if (!trigger.conditionTag) {
            return true;
        }
        const result = this.traitObjects().some(traitObject => {
            return PluginManagerEx.findMetaValue(traitObject, trigger.conditionTag);
        });
        return trigger.conditionReverse ? !result : result;
    };

    Game_Battler.prototype.executeStateTriggerEffect = function(trigger) {
        trigger.removeStates.forEach(stateId => this.removeState(stateId));
        trigger.addStates.forEach(stateId => this.addState(stateId));
        this.executeBuffEffect(trigger.removeBuff, 'removeBuff');
        this.executeBuffEffect(trigger.addBuff, 'addBuff');
        this.executeBuffEffect(trigger.removeDebuff, 'removeBuff');
        this.executeBuffEffect(trigger.addDebuff, 'addDebuff');
        if (trigger.switchId > 0) {
            $gameSwitches.setValue(trigger.switchId, !!trigger.switchValue);
        }
        if (trigger.script) {
            eval(trigger.script);
        }
    };

    Game_Battler.prototype.executeBuffEffect = function(buffList, method) {
        if (!buffList) {
            return;
        }
        buffList.forEach(buff => this[method](buff.id, buff.turn));
    };
})();