//=============================================================================
// ParallelParty.js
// ----------------------------------------------------------------------------
// (C) 2017 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 3.0.0 2023/09/02 別プラグインと組み合わせて別パーティをマップ上に表示できる機能を追加
//                  別パーティの位置設定やメンバー入れ替えをプラグインコマンドから実行できる機能を追加
// 2.0.2 2021/05/12 初期パーティから変更後、セーブ、ロードを介することで正常に初期パーティに戻らなくなる場合がある問題を修正
// 2.0.1 2020/09/17 英語版のヘルプ作成とバグ修正
// 2.0.0 2020/09/17 MZ版向けに修正
// 1.3.0 2019/01/02 用語辞典プラグイン使用時に用語履歴を常に継承できるよう修正
// 1.2.1 2017/12/08 SceneGlossary.jsとの間で発生する可能性のある競合を解消
// 1.2.0 2017/05/15 パーティを切り替えた際にリソースを統合できる機能を追加
// 1.1.0 2017/05/13 パーティ間でリソースを共有する設定を追加、各パーティのマップ座標を記憶して自働で場所移動する機能を追加
// 1.0.0 2017/05/09 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/ParallelParty.js
@plugindesc Parallel Party Plugin
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

ParallelParty.js

Manage multiple parties simultaneously.
Each party is managed by a "party ID," with the initial party ID being "0."
Each party's money and items are managed separately, and you can switch to a
different party using a plugin command.

Immediately after switching to a new party, there will be zero members, so
add an actor using the "Swap Members" event.

Actor information is shared, so if you add an actor currently in another party
to a new party, their status will be inherited.

Party swaps cannot be performed during battle.

By specifying the "Party Event ID" parameter,
you can display parallel parties that are not currently being controlled as
events.

The following additional plugins are required to use this feature:

Template Event Plugin
Dynamic Event Generation Plugin

The following scripts can be used in template events for other parties.
this.character(0).partyId; // Get the party ID
this.character(0).leaderActorId; // Get the leader actor ID

Terms of Use:
You may modify and redistribute this plugin without permission from the
author, and there are no restrictions on its use (commercial, R18+, etc.).
This plugin is now yours.

@param shareResource
@text Resource Sharing
@desc Different parties share resources (items, weapons, armor, money, steps).
@type boolean
@default false

@param savePosition
@text Hold Party Position
@desc When you switch parties, your original location will be saved, and when you switch back to the original party, you will automatically move to that location.
@type boolean
@default false

@param partyIdVariable
@text Party ID variable
@desc This variable stores the party ID. Please refer to the help for details about the party ID.
@type variable
@default 0

@param partyEventId
@text Party Event ID
@desc Template event ID for displaying parallel parties that are not currently operating as events.
@type number
@default 0

@command CHANGE_PARTY
@text Party Change
@desc Changes the current party to the party with the specified ID.
@arg partyId
@text Party ID
@desc This is your party ID. Please check the help for details about your party ID.
@type number
@default 0
@arg resourceCombine
@text Resource Integration
@desc Merges items and money with the party you join. If resource sharing is enabled, no merging will occur.
@type boolean
@default false

@command CHANGE_PARTY_POSITION
@text Party position change
@desc Sets the position of the party with the specified ID. The operation is invalid for the current party.
@arg partyId
@text Party ID
@desc This is your party ID. Please check the help for details about your party ID.
@type number
@default 0
@arg mapId
@text Map ID
@desc The destination map ID.
@type number
@default 0
@arg x
@text X coordinate
@desc The X coordinate of the destination.
@type number
@default 0
@arg y
@text Y coordinate
@desc The Y coordinate of the destination.
@type number
@default 0
@arg direction
@text direction
@desc The direction of the destination.
@type select
@default 2
@option under
@value 2
@option left
@value 4
@option right
@value 6
@option above
@value 8

@command CHANGE_PARTY_MEMBER
@text Party member change
@desc Changes the member of the party with the specified ID. The operation is invalid for the current party.
@arg partyId
@text Party ID
@desc This is your party ID. Please check the help for details about your party ID.
@type number
@default 0
@arg actorId
@text Actor ID
@desc The actor ID to join the party.
@type actor
@default 0
@arg type
@text Operation Type
@desc Specify whether to add or remove the character from your party.
@type select
@default 0
@option Add
@value 0
@option remove
@value 1
*/

/*:ja
@plugindesc 並列パーティプラグイン
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/ParallelParty.js
@base PluginCommonBase
@orderAfter PluginCommonBase
@orderAfter EventReSpawn
@author トリアコンタン

@param shareResource
@text リソース共有
@desc 異なるパーティでもリソース(アイテム、武器、防具、お金、歩数)を共有します。
@default false
@type boolean

@param savePosition
@text パーティ位置を保持
@desc パーティを切り替えたときに元の位置を保存し、元のパーティに戻したときに自働で場所移動します。
@default false
@type boolean

@param partyIdVariable
@text パーティID変数
@desc パーティIDを格納する変数です。パーティIDについてはヘルプをご確認ください。
@default 0
@type variable

@param partyEventId
@text パーティイベントID
@desc 操作中でない並列パーティをイベントとして表示するときのテンプレートイベントIDです。
@default 0
@type number

@command CHANGE_PARTY
@text パーティ変更
@desc 現在のパーティを指定したIDのパーティに変更します。

@arg partyId
@text パーティID
@desc パーティIDです。パーティIDについてはヘルプをご確認ください。
@default 0
@type number

@arg resourceCombine
@text リソース統合
@desc 所持アイテムやお金を合流先のパーティと統合します。リソース共有のパラメータが有効な場合、統合は行われません。
@default false
@type boolean

@command CHANGE_PARTY_POSITION
@text パーティ位置変更
@desc 指定したIDのパーティの位置を設定します。現在のパーティに対する操作は無効です。

@arg partyId
@text パーティID
@desc パーティIDです。パーティIDについてはヘルプをご確認ください。
@default 0
@type number

@arg mapId
@text マップID
@desc 移動先のマップIDです。
@default 0
@type number

@arg x
@text X座標
@desc 移動先のX座標です。
@default 0
@type number

@arg y
@text Y座標
@desc 移動先のY座標です。
@default 0
@type number

@arg direction
@text 向き
@desc 移動先の向きです。
@default 2
@type select
@option 下
@value 2
@option 左
@value 4
@option 右
@value 6
@option 上
@value 8

@command CHANGE_PARTY_MEMBER
@text パーティメンバー変更
@desc 指定したIDのパーティのメンバーを変更します。現在のパーティに対する操作は無効です。

@arg partyId
@text パーティID
@desc パーティIDです。パーティIDについてはヘルプをご確認ください。
@default 0
@type number

@arg actorId
@text アクターID
@desc パーティに加入させるアクターIDです。
@default 0
@type actor

@arg type
@text 操作タイプ
@desc パーティに加入させるか外すかを指定します。
@default 0
@type select
@option 加える
@value 0
@option 外す
@value 1

@help ParallelParty.js

複数のパーティを同時に管理できます。
各パーティは「パーティID」で管理され、初期状態のパーティIDは「0」です。
それぞれ所持金やアイテムが別々に管理され、プラグインコマンドで
別のパーティに交代できます。

新しいパーティに移った直後はメンバーが0人の状態なので
イベント「メンバーの入れ替え」でアクターを追加してください。

アクターの情報は共有しているので、他のパーティに加入しているアクターを
別のパーティに入れた場合、状態を引き継ぎます。

戦闘中のパーティの入れ替えはできません。

パラメータ「パーティイベントID」を指定すると
操作中でない並列パーティをイベントとして表示できます。
この機能を使うためには以下のプラグインが追加で必要です。

テンプレートイベントプラグイン
イベント動的生成プラグイン

別パーティのテンプレートイベントでは以下のスクリプトが使えます。
this.character(0).partyId; // パーティIDを取得
this.character(0).leaderActorId; // リーダーのアクターIDを取得

利用規約：
 作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 についても制限はありません。
 このプラグインはもうあなたのものです。
*/

function Game_Parties() {
    this.initialize.apply(this, arguments);
}

(function() {
    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);

    PluginManagerEx.registerCommand(script, 'CHANGE_PARTY', function(args) {
        if ($gameParty.inBattle()) {
            return;
        }
        $gameSystem.changeParty(args.partyId, args.resourceCombine);
        if (!$gamePlayer.isTransferring()) {
            $gamePlayer.refresh();
            $gameMap.requestRefresh();
        } else {
            this.setWaitMode('transfer');
        }
        if (!param.savePosition) {
            $gameMap.refreshParallelParty(false);
        }
    });

    PluginManagerEx.registerCommand(script, 'CHANGE_PARTY_POSITION', function(args) {
        $gameSystem.changePartyPosition(args.partyId, args.mapId, args.x, args.y, args.direction);
        $gameMap.refreshParallelParty(false);
    });

    PluginManagerEx.registerCommand(script, 'CHANGE_PARTY_MEMBER', function(args) {
        $gameSystem.changePartyActor(args.partyId, args.actorId, args.type);
        $gameMap.refreshParallelParty(false);
    });

    //=============================================================================
    // Game_System
    //  Game_Partiesを生成します。
    //=============================================================================
    const _Game_System_initialize = Game_System.prototype.initialize;
    Game_System.prototype.initialize = function() {
        _Game_System_initialize.apply(this, arguments);
        this._parties = new Game_Parties();
    };

    const _Game_System_onAfterLoad = Game_System.prototype.onAfterLoad;
    Game_System.prototype.onAfterLoad = function() {
        _Game_System_onAfterLoad.apply(this, arguments);
        if (!this._parties) {
            this._parties = new Game_Parties();
        }
    };

    Game_System.prototype.changeParty = function(partyId, resourceCombine) {
        this._parties.change(partyId, resourceCombine);
    };

    Game_System.prototype.changePartyPosition = function(partyId, mapId, x, y, direction) {
        this._parties.setPosition(partyId, mapId, x, y, direction);
    };

    Game_System.prototype.changePartyActor = function(partyId, actorId, type) {
        this._parties.changeActor(partyId, actorId, type);
    };

    Game_System.prototype.findExistParallels = function() {
        return this._parties ? this._parties.findExistParallels() : [];
    };

    Game_System.prototype.findPartyId = function(party) {
        return this._parties ? this._parties.findPartyId(party) : -1;
    };

    //=============================================================================
    // Game_Party
    //  リソースの引き継ぎと位置の保存を追加定義します。
    //=============================================================================
    Game_Party.prototype.getAllResources = function() {
        return {
            items        : this._items,
            weapons      : this._weapons,
            armors       : this._armors,
            gold         : this._gold,
            steps        : this._steps,
            itemHistory  : this._itemHistory,
            weaponHistory: this._weaponHistory,
            armorHistory : this._armorHistory
        };
    };

    Game_Party.prototype.inheritAllResources = function(prevParty) {
        const resources = prevParty.getAllResources();
        this._items   = resources.items;
        this._weapons = resources.weapons;
        this._armors  = resources.armors;
        this._gold    = resources.gold;
        this._steps   = resources.steps;
        this.inheritItemHistory(prevParty);
    };

    Game_Party.prototype.combineAllResources = function(targetParty) {
        const resources = targetParty.getAllResources();
        Object.keys(resources.items).forEach(function(id) {
            this.gainItem($dataItems[id], resources.items[id], false);
        }, this);
        Object.keys(resources.weapons).forEach(function(id) {
            this.gainItem($dataWeapons[id], resources.weapons[id], false);
        }, this);
        Object.keys(resources.armors).forEach(function(id) {
            this.gainItem($dataArmors[id], resources.armors[id], false);
        }, this);
        this.gainGold(resources.gold);
        this._steps += resources.steps;
        $gameParty.initAllItems();
        $gameParty.loseGold($gameParty.maxGold());
        $gameParty._steps = 0;
    };

    // for SceneGlossary.js
    Game_Party.prototype.inheritItemHistory = function(prevParty) {
        const resources       = prevParty.getAllResources();
        this._itemHistory   = resources.itemHistory;
        this._weaponHistory = resources.weaponHistory;
        this._armorHistory  = resources.armorHistory;
    };

    Game_Party.prototype.moveSavedPosition = function() {
        $gamePlayer.reserveTransfer(this._savedMapId, this._savedX, this._savedY, this._savedDirection, 0);
    };

    Game_Party.prototype.savePosition = function() {
        this.setPosition($gameMap.mapId(), $gamePlayer.x, $gamePlayer.y, $gamePlayer.direction());
    };

    Game_Party.prototype.setPosition = function(mapId, x, y, direction) {
        this._savedMapId     = mapId;
        this._savedX         = x;
        this._savedY         = y;
        this._savedDirection = direction;
    };

    Game_Party.prototype.findPosition = function() {
        return {
            mapId    : this._savedMapId,
            x        : this._savedX,
            y        : this._savedY,
            direction: this._savedDirection
        }
    };

    Game_Party.prototype.isExistParallel = function() {
        return this._savedMapId === $gameMap.mapId() && this !== $gameParty;
    };

    //=============================================================================
    // Game_Parties
    //  複数のパーティを管理します。
    //=============================================================================
    Game_Parties.prototype.initialize = function() {
        this._data    = [$gameParty];
        this._partyId = 0;
    };

    Game_Parties.prototype.isExistParty = function() {
        return !!this.getCurrentParty();
    };

    Game_Parties.prototype.getCurrentParty = function() {
        return this._data[this._partyId];
    };

    Game_Parties.prototype.findPartyId = function(party) {
        return this._data.findIndex(date => date === party);
    };

    Game_Parties.prototype.change = function(partyId, resourceCombine) {
        if (this._partyId === partyId) {
            return;
        }
        this.changePartyId(partyId);
        const currentParty = this.getCurrentParty();
        if (param.shareResource) {
            currentParty.inheritAllResources($gameParty);
        } else if (resourceCombine) {
            currentParty.combineAllResources($gameParty);
        } else {
            currentParty.inheritItemHistory($gameParty);
        }
        if (param.savePosition) {
            this.moveSavedPosition();
        }
        $gameParty = currentParty;
    };

    Game_Parties.prototype.changePartyId = function(newPartyId) {
        $gameParty.savePosition();
        this._data[this._partyId] = $gameParty;
        this._partyId = newPartyId;
        this.createPartyIfNeed(newPartyId);
        if (param.partyIdVariable) {
            $gameVariables.setValue(param.partyIdVariable, this._partyId);
        }
    };

    Game_Parties.prototype.setPosition = function(partyId, mapId, x, y, direction) {
        if (this._partyId === partyId) {
            return;
        }
        this.createPartyIfNeed(partyId);
        this._data[partyId].setPosition(mapId, x, y, direction);
    };

    Game_Parties.prototype.changeActor = function(partyId, actorId, type) {
        this.createPartyIfNeed(partyId);
        const actor = $gameActors.actor(actorId);
        if (actor) {
            if (type === 0) {
                this._data[partyId].addActor(actorId);
            } else {
                this._data[partyId].removeActor(actorId);
            }
        }
    };

    Game_Parties.prototype.createPartyIfNeed = function(partyId) {
        if (!this._data[partyId]) {
            const party = new Game_Party();
            party.savePosition();
            this._data[partyId] = party;
        }
    };

    Game_Parties.prototype.moveSavedPosition = function() {
        const currentParty = this.getCurrentParty();
        currentParty.moveSavedPosition();
    };

    Game_Parties.prototype.findExistParallels = function() {
        return this._data.filter(party => party.isExistParallel());
    };

    const _Game_Map_setupInitialSpawnEvents = Game_Map.prototype.setupInitialSpawnEvents;
    Game_Map.prototype.setupInitialSpawnEvents = function() {
        _Game_Map_setupInitialSpawnEvents.apply(this, arguments);
        this._parallelPlayers = null;
        this.refreshParallelParty();
    };

    Game_Map.prototype.refreshParallelParty = function() {
        if (!param.partyEventId) {
            return;
        }
        if (this._parallelPlayers) {
            this._parallelPlayers.forEach(event => event.erase());
        }
        this._parallelPlayers = [];
        $gameSystem.findExistParallels().forEach(party => {
            this.spawnParallelPlayer(party);
        });
    };

    Game_Map.prototype.spawnParallelPlayer = function(party) {
        const position = party.findPosition();
        if (!this.spawnEvent) {
            PluginManagerEx.throwError('EventReSpawn.js is not installed. Please install it.', script);
        }
        this.spawnEvent(param.partyEventId, position.x, position.y, true);
        const event = this._events[this._lastSpawnEventId];
        event.setDirection(position.direction);
        event.setParty(party);
        this._parallelPlayers.push(event);
    };

    Game_Event.prototype.setParty = function(party) {
        const leader = party.leader();
        if (leader) {
            this.setImage(leader.characterName(), leader.characterIndex());
            this.leaderActorId = leader.actorId();
        }
        this.partyId = $gameSystem.findPartyId(party);
    };

    const _Game_Player_performTransfer = Game_Player.prototype.performTransfer;
    Game_Player.prototype.performTransfer = function() {
        _Game_Player_performTransfer.apply(this, arguments);
        if (param.savePosition) {
            $gameMap.refreshParallelParty();
        }
    };
})();