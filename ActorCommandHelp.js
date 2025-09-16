/*=============================================================================
 ActorCommandHelp.js
----------------------------------------------------------------------------
 (C)2022 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.2.0 2023/10/15 プラグイン等で追加されたパーティコマンド、アクターコマンドのヘルプを表示できる機能を追加
 1.1.0 2022/10/08 共通のコマンドヘルプを指定できる機能を追加
                  ヘルプ中に%1を記述すると選択中のアクター名称に置き換わる機能を追加
 1.0.0 2022/08/28 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/ActorCommandHelp.js
@plugindesc Actor Command Help Plugin
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

ActorCommandHelp.js

Displays help defined for each actor command and party command.
Attack and defense display descriptions of the assigned skills.
Other commands are defined via plugin parameters.
The actor command help is replaced with the name of the actor selected in %1.

This plugin requires the base plugin "PluginCommonBase.js."
"PluginCommonBase.js" is located in the following folder under the RPG Maker
MZ installation folder:

dlc/BasicResources/plugins/official

Terms of Use:
You may modify and redistribute this plugin without permission, and there are
no restrictions on its use (commercial, 18+, etc.).
This plugin is now yours.

@param invalidSwitch
@text Disable Switch
@desc When the specified switch is ON, the help will not be displayed.
@type switch
@default 0

@param fightDesc
@text Fighting Command Description
@desc Explanation of the "Fight" command.
@type multiline_string

@param escapeDesc
@text Escape command explanation
@desc Explanation of the "escape" command.
@type multiline_string

@param itemDesc
@text Item Command Description
@desc Explanation of the ``Item'' command.
@type multiline_string

@param skillTypeDescList
@text Skill Type Description
@desc This is a description for each skill type. Define it as an array in the order defined by the skill type.
@type multiline_string[]
@default []

@param actorCommonDesc
@text Actor General Explanation
@desc These are messages commonly used by actor commands. Use them when an explanation for each command is not necessary.
@type multiline_string

@param partyCommonDesc
@text Party General Explanation
@desc These are messages commonly used by party commands. Use them when an explanation for each command is not necessary.
@type multiline_string

@param customPartyDescList
@text Custom Party Description List
@desc This is a description of each custom command added by a plugin, etc. It is uniquely identified by a symbol and index.
@type struct<CustomDesc>[]
@default []

@param customActorDescList
@text Custom Actor Description List
@desc This is a description of each custom command added by a plugin, etc. It is uniquely identified by a symbol and index.
@type struct<CustomDesc>[]
@default []
*/

/*~struct~CustomDesc:
@param symbol
@text symbol
@desc The symbol of the command. It may not be possible to identify it without looking at the plugin code. If you are unsure, specify only the index.

@param index
@text Index
@desc The command index. If the command can be uniquely identified by a symbol, no need to specify it.
@type number
@default 0

@param desc
@text explanation
@desc A description of the command.
@type multiline_string
*/

/*:ja
@plugindesc アクターコマンドヘルププラグイン
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/ActorCommandHelp.js
@base PluginCommonBase
@orderAfter PluginCommonBase
@author トリアコンタン

@param invalidSwitch
@text 無効スイッチ
@desc 指定したスイッチがONのときヘルプは表示されなくなります。
@default 0
@type switch

@param fightDesc
@text 戦うコマンド説明
@desc 『戦う』コマンドの説明です。
@default
@type multiline_string

@param escapeDesc
@text 逃げるコマンド説明
@desc 『逃げる』コマンドの説明です。
@default
@type multiline_string

@param itemDesc
@text アイテムコマンド説明
@desc 『アイテム』コマンドの説明です。
@default
@type multiline_string

@param skillTypeDescList
@text スキルタイプ説明
@desc スキルタイプごとの説明です。スキルタイプで定義した順番に配列として定義します。
@default []
@type multiline_string[]

@param actorCommonDesc
@text アクター共通説明
@desc アクターコマンドで共通使用されるメッセージです。コマンド毎の説明が不要な場合に使います。
@default
@type multiline_string

@param partyCommonDesc
@text パーティ共通説明
@desc パーティコマンドで共通使用されるメッセージです。コマンド毎の説明が不要な場合に使います。
@default
@type multiline_string

@param customPartyDescList
@text カスタムパーティ説明リスト
@desc プラグイン等で追加されたカスタムコマンドごとの説明です。シンボルとインデックスで一意に特定します。
@default []
@type struct<CustomDesc>[]

@param customActorDescList
@text カスタムアクター説明リスト
@desc プラグイン等で追加されたカスタムコマンドごとの説明です。シンボルとインデックスで一意に特定します。
@default []
@type struct<CustomDesc>[]

@help ActorCommandHelp.js

アクターコマンドやパーティコマンドにコマンドごとに定義したヘルプを表示します。
攻撃や防御は、それぞれ割り当てられたスキルの説明が表示され
それ以外のコマンドはプラグインパラメータから定義します。
アクターコマンドのヘルプは%1で選択中のアクター名称に置き換わります。

このプラグインの利用にはベースプラグイン『PluginCommonBase.js』が必要です。
『PluginCommonBase.js』は、RPGツクールMZのインストールフォルダ配下の
以下のフォルダに格納されています。
dlc/BasicResources/plugins/official

利用規約：
 作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 についても制限はありません。
 このプラグインはもうあなたのものです。
*/

/*~struct~CustomDesc:ja

@param symbol
@text シンボル
@desc コマンドのシンボルです。プラグインのコードを見ないと特定できない場合があります。不明な場合はインデックスのみ指定してください。
@default

@param index
@text インデックス
@desc コマンドのインデックスです。シンボルで一意に特定できる場合は指定不要です。
@default 0
@type number

@param desc
@text 説明
@desc コマンドの説明です。
@default
@type multiline_string
*/

(() => {
    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);
    if (!param.skillTypeDescList) {
        param.skillTypeDescList = [];
    }

    const _Scene_Battle_createHelpWindow = Scene_Battle.prototype.createHelpWindow;
    Scene_Battle.prototype.createHelpWindow = function() {
        _Scene_Battle_createHelpWindow.apply(this, arguments);
        this._actorCommandWindow.setHelpWindow(this._helpWindow);
        this._partyCommandWindow.setHelpWindow(this._helpWindow);
    };

    const _Window_Selectable_updateHelp = Window_Selectable.prototype.updateHelp;
    Window_Selectable.prototype.updateHelp = function() {
        _Window_Selectable_updateHelp.apply(this, arguments);
        if ((this instanceof Window_ActorCommand) || (this instanceof Window_PartyCommand)) {
            this.updateActorCommandHelp();
        }
    };

    Window_Selectable.prototype.updateActorCommandHelp = function() {
        if ($gameSwitches.value(param.invalidSwitch)) {
            return;
        }
        const text = this.findActorCommandHelpText();
        if (text) {
            this._helpWindow.setText(text);
            this.showHelpWindow();
        }
        this._helpWindow.setText(this._actor ? text.format(this._actor.name()) : text);
        this.showHelpWindow();
    };

    Window_Selectable.prototype.findActorCommandHelpText = function() {}

    Window_Selectable.prototype.findCustomCommandHelpText = function(symbol, list) {
        if (!list) {
            return null;
        }
        const data = list.find(item => {
            if (item.symbol && item.symbol !== symbol) {
                return false;
            }
            return !(item.index && item.index !== this.index());
        });
        return data ? data.desc : null;
    };

    Window_PartyCommand.prototype.findActorCommandHelpText = function() {
        let text;
        const symbol = this.currentSymbol();
        switch (symbol) {
            case 'fight':
                text = param.fightDesc;
                break;
            case 'escape':
                text = param.escapeDesc;
                break;
            default :
                text = this.findCustomCommandHelpText(symbol, param.customPartyDescList);
        }
        return text || param.partyCommonDesc;
    };

    Window_ActorCommand.prototype.findActorCommandHelpText = function() {
        let text;
        const symbol = this.currentSymbol();
        switch (symbol) {
            case 'attack':
                text = $dataSkills[this._actor.attackSkillId()].description;
                break;
            case 'guard':
                text =  $dataSkills[this._actor.guardSkillId()].description;
                break;
            case 'skill':
                text = param.skillTypeDescList[this.currentExt() - 1];
                break;
            case 'item':
                text = param.itemDesc;
                break;
            default :
                text = this.findCustomCommandHelpText(symbol, param.customActorDescList);
        }
        return text || param.actorCommonDesc;
    };
})();