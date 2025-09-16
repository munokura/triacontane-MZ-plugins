/*=============================================================================
 ItemUseCommand.js
----------------------------------------------------------------------------
 (C)2022 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.1.1 2024/07/03 プラグインコマンドを使用する旨をヘルプに追記
 1.1.0 2024/02/12 スキル使用コマンドを追加
 1.0.1 2022/03/31 効果範囲が「味方」以外のアイテムを使用できない問題を修正
 1.0.0 2022/01/15 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/ItemUseCommand.js
@plugindesc Item Use Command Plugin
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

ItemUseCommand.js

Provides a command to use the item or skill with the specified ID.
After executing the command, items and costs will be consumed as necessary.
The command cannot be used unless certain conditions are met.
Please execute it from the plugin command.

Only items usable on the menu screen are affected; combat items cannot be
used. Enemy characters are not affected.

Terms of Use:
You may modify and redistribute this without permission from the author, and
there are no restrictions on its use (commercial, 18+, etc.).
This plugin is now yours.

@param unusableSwitch
@text Disabled Trigger
@desc This switch turns ON when an item cannot be used.
@type switch
@default 0

@param playSe
@text Sound effects performance
@desc Plays a sound effect when an item is used.
@type boolean
@default true

@command ITEM_USE
@text Item Use
@desc Uses an item on the specified target.
@arg itemId
@text Item ID
@desc The ID of the item to use.
@type item
@default 1
@arg itemIdVariable
@text Item ID (obtained from a variable)
@desc Specify this if you want to obtain the ID of the item to be used from a variable value.
@type variable
@default 0
@arg targetIndex
@text Use for
@desc The index (sort order) of the target of the item. 1 is the first. There is no need to specify this for items that affect all allies.
@type number
@default 1
@arg targetActor
@text Target of use (direct specification)
@desc Select this if you want to specify the target of the item directly from the actor. It will be ignored if the actor is not in the party.
@type actor
@default 0

@command SKILL_USE
@text Skill Use
@desc Uses a skill on the specified target.
@arg skillId
@text Skill ID
@desc The ID of the skill to use.
@type skill
@default 1
@arg skillIdVariable
@text Skill ID (obtained from a variable)
@desc Specify this if you want to obtain the skill ID to use from a variable value.
@type variable
@default 0
@arg targetIndex
@text Use for
@desc The index (sort order) of the skill's target. 1 is the first. There is no need to specify this for skills that affect all allies.
@type number
@default 1
@arg targetActor
@text Target of use (direct specification)
@desc Select this if you want to specify the target of the skill directly from the actor. It will be ignored if the actor is not in the party.
@type actor
@default 0
@arg userIndex
@text user
@desc The index (sort order) of the skill user. 1 is the first. There is no need to specify this for skills that affect all allies.
@type number
@default 1
@arg userActor
@text User (directly specified)
@desc Select this if you want to specify the skill user directly from the actor. It will be ignored if the actor is not in the party.
@type actor
@default 0
*/

/*:ja
@plugindesc アイテム使用コマンドプラグイン
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/ItemUseCommand.js
@base PluginCommonBase
@orderAfter PluginCommonBase
@author トリアコンタン

@param unusableSwitch
@text 使用不可トリガー
@desc アイテムを使用できなかった場合にONになるスイッチです。
@default 0
@type switch

@param playSe
@text 効果音演奏
@desc アイテム使用時に効果音を演奏します。
@default true
@type boolean

@command ITEM_USE
@text アイテム使用
@desc 指定した対象にアイテムを使用します。

@arg itemId
@text アイテムID
@desc 使用するアイテムのIDです。
@default 1
@type item

@arg itemIdVariable
@text アイテムID(変数から取得)
@desc 使用するアイテムのIDを変数値から取得する場合こちらを指定します。
@default 0
@type variable

@arg targetIndex
@text 使用対象
@desc アイテムの対象者のインデックス(並び順)です。1が先頭です。味方全体のアイテムなどでは指定不要です。
@default 1
@type number

@arg targetActor
@text 使用対象(直接指定)
@desc アイテムの対象者をアクターから直接指定する場合に選択します。パーティにいないアクター場合は無視されます。
@default 0
@type actor

@command SKILL_USE
@text スキル使用
@desc 指定した対象にスキルを使用します。

@arg skillId
@text スキルID
@desc 使用するスキルのIDです。
@default 1
@type skill

@arg skillIdVariable
@text スキルID(変数から取得)
@desc 使用するスキルのIDを変数値から取得する場合こちらを指定します。
@default 0
@type variable

@arg targetIndex
@text 使用対象
@desc スキルの対象者のインデックス(並び順)です。1が先頭です。味方全体のスキルなどでは指定不要です。
@default 1
@type number

@arg targetActor
@text 使用対象(直接指定)
@desc スキルの対象者をアクターから直接指定する場合に選択します。パーティにいないアクター場合は無視されます。
@default 0
@type actor

@arg userIndex
@text 使用者
@desc スキルの使用者のインデックス(並び順)です。1が先頭です。味方全体のスキルなどでは指定不要です。
@default 1
@type number

@arg userActor
@text 使用者(直接指定)
@desc スキルの使用者をアクターから直接指定する場合に選択します。パーティにいないアクター場合は無視されます。
@default 0
@type actor

@help ItemUseCommand.js

指定したIDのアイテムもしくはスキルを使用するコマンドを提供します。
コマンド実行後は必要に応じてアイテムやコストを消費し、
条件を満たさなければ使用はできません。
プラグインコマンドから実行してください。

メニュー画面で使用可能なアイテムのみが対象で戦闘用の
アイテムは使用できず、敵キャラは効果の適用外です。

利用規約：
 作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 についても制限はありません。
 このプラグインはもうあなたのものです。
*/

(()=> {
    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);

    PluginManagerEx.registerCommand(script, 'ITEM_USE', args => {
        const id = args.itemIdVariable ? $gameVariables.value(args.itemIdVariable) : args.itemId;
        const targetIndex = $gameTemp.findCallItemTarget(args);
        $gameTemp.callItemUse($dataItems[id], targetIndex, null);
    });

    PluginManagerEx.registerCommand(script, 'SKILL_USE', args => {
        const id = args.skillIdVariable ? $gameVariables.value(args.skillIdVariable) : args.skillId;
        const targetIndex = $gameTemp.findCallItemTarget(args);
        const userIndex = $gameTemp.findCallItemUser(args);
        $gameTemp.callItemUse($dataSkills[id], targetIndex, userIndex);
    });

    Game_Temp.prototype.callItemUse = function(item, targetIndex, userIndex) {
        if (item) {
            const itemUse = new Game_ItemUse(item, targetIndex, userIndex);
            itemUse.execute();
        }
    };

    Game_Temp.prototype.findCallItemTarget = function(targetArgs) {
        const targetIndex = $gameParty.members().findIndex(actor => actor.actorId() === targetArgs.targetActor);
        if (targetIndex < 0) {
            return targetArgs.targetIndex - 1;
        } else {
            return targetIndex;
        }
    };

    Game_Temp.prototype.findCallItemUser = function(targetArgs) {
        const userIndex = $gameParty.members().findIndex(actor => actor.actorId() === targetArgs.userActor);
        if (userIndex < 0) {
            return targetArgs.userIndex - 1;
        } else {
            return userIndex;
        }
    };


    /**
     * Game_ItemUse
     */
    class Game_ItemUse {
        constructor(item, targetIndex, userIndex) {
            this._user = DataManager.isSkill(item) ? $gameParty.members()[userIndex] : this.findUser();
            if (!this._user) {
                return;
            }
            this._item = item;
            this._targetIndex = targetIndex || 0;
            this._action = new Game_Action(this._user);
            this._action.setItemObject(item);
        }

        canUse() {
            return this._user && this._user.canUse(this._item) && this.isEffectsValid();
        }

        execute() {
            if (!this.canUse()) {
                if (param.unusableSwitch) {
                    $gameSwitches.setValue(param.unusableSwitch, true);
                }
                return;
            }
            if (param.playSe) {
                SoundManager.playUseItem();
            }
            this._user.useItem(this._item);
            const action = this._action;
            this.findTarget().forEach(target => {
                const repeats = action.numRepeats();
                for (let i = 0; i < repeats; i++) {
                    action.apply(target);
                }
            });
            action.applyGlobal();
        }

        isEffectsValid() {
            const action = this._action;
            if (!action.isForFriend()) {
                return true;
            }
            return this.findTarget().some(target => action.testApply(target));
        }

        findTarget() {
            const action = this._action;
            if (!action.isForFriend()) {
                return [];
            } else if (action.isForAll()) {
                return $gameParty.members();
            } else {
                return [$gameParty.members()[this._targetIndex]];
            }
        }

        findUser() {
            const members = $gameParty.movableMembers();
            const bestPha = Math.max(...members.map(member => member.pha));
            return members.find(member => member.pha === bestPha);
        }
    }
})();