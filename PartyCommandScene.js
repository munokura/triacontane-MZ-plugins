/*=============================================================================
 PartyCommandScene.js
----------------------------------------------------------------------------
 (C)2022 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.1.1 2023/01/01 カスタムメニューシーンから戻ると、戦闘終了処理が正しく行われない不具合を修正
 1.1.0 2022/08/06 遷移対象画面にステータス画面、装備画面を追加
                  遷移時に任意のスクリプトを実行できる機能を追加
 1.0.1 2022/04/29 別シーンから戻ってきたあと、アクターコマンドに進んでからキャンセルして戻ると『戦う』が選択できなくなる場合がある問題を修正
 1.0.0 2022/04/10 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/PartyCommandScene.js
@plugindesc Party Command Scene Plugin
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

PartyCommandScene.js

Transitions to any specified scene from a party command during battle.
It may work with scenes added by other plugins, but we cannot guarantee its
operation.

Using it in non-turn-based modes (especially time-progression (active)) is
generally not recommended (as it may have unknown side effects).

To transition to a scene created with the Custom Menu Creation Plugin,
Please enter the scene identifier directly.

If you transition to the menu screen, you will not be able to select save or
quit the game.
Also, items that trigger common events will not be available.

This plugin requires the base plugin "PluginCommonBase.js."
"PluginCommonBase.js" is located in the following folder under the RPG Maker
MZ installation folder:
dlc/BasicResources/plugins/official

Terms of Use:
You may modify and redistribute this plugin without permission, and there are
no restrictions on its use (commercial, R18, etc.).
This plugin is now yours.

@param SceneList
@text Scene List
@desc This is a list of scenes that can be transitioned to using party commands.
@type struct<Scene>[]
@default []
*/

/*~struct~Scene:
@param SceneType
@text Scene Type
@desc The destination scene class. If it is not in the list, enter the class name directly.
@type select
@default Scene_Options
@option Options screen
@value Scene_Options
@option Shop screen
@value Scene_Shop
@option Name input screen
@value Scene_Name
@option Title screen
@value Scene_Title
@option Game Over screen
@value Scene_Gameover
@option Menu screen
@value Scene_Menu
@option Status Screen
@value Scene_Status
@option Equipment Screen
@value Scene_Equip
@option Glossary screen (requires plug-in)
@value Scene_Glossary
@option Sound test screen (requires plugin)
@value Scene_SoundTest

@param CommandName
@text Command name
@desc This is the command name displayed in the party command.
@default コマンド

@param ConditionSwitch
@text Condition Switch
@desc If specified, the command will only appear when the switch is ON.
@type switch
@default 0

@param ActorId
@text Name Input Actor
@desc This is the target actor when you select the name input screen.
@type actor
@default 1

@param MaxNameLength
@text Maximum name length
@desc This is the maximum number of characters that can be entered when the name entry screen is selected.
@type number
@default 8

@param ShopItems
@text Item List
@desc This is a list of items available for purchase when you select the shop screen.
@type item[]
@default []

@param ShopWeapons
@text Weapon List
@desc This is a list of weapons available for purchase when you select the shop screen.
@type weapon[]
@default []

@param ShopArmors
@text Armor List
@desc This is a list of armor available for purchase when you select the shop screen.
@type armor[]
@default []

@param BuyOnly
@text Purchase only
@desc When enabled, items cannot be sold when you select the shop screen.
@type boolean
@default false

@param Script
@text script
@desc If you specify this, you can run any script before the screen transition.
@type multiline_string

@param GlossaryType
@text Term Type
@desc This is the term type when the glossary screen is selected.
@default 1
*/

/*:ja
@plugindesc パーティコマンドシーンプラグイン
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/PartyCommandScene.js
@base PluginCommonBase
@orderAfter PluginCommonBase
@author トリアコンタン

@param SceneList
@text シーンリスト
@desc パーティコマンドから遷移できるシーンのリストです。
@type struct<Scene>[]
@default []

@help PartyCommandScene.js

戦闘中のパーティコマンドから指定した任意のシーンに遷移できます。
他プラグインで追加したシーンにも使える可能性がありますが、
動作は保証できません。

ターン制以外（特にタイムプログレス（アクティブ））での利用は
基本的に非推奨です。(未知の副作用を与える可能性があります)

カスタムメニュー作成プラグインで作成したシーンに遷移する場合
シーン識別子を直接入力してください。

メニュー画面に遷移した場合、セーブとゲーム終了は選択できません。
また、コモンイベントを実行するアイテムも使用できません。

このプラグインの利用にはベースプラグイン『PluginCommonBase.js』が必要です。
『PluginCommonBase.js』は、RPGツクールMZのインストールフォルダ配下の
以下のフォルダに格納されています。
dlc/BasicResources/plugins/official

利用規約：
 作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 についても制限はありません。
 このプラグインはもうあなたのものです。
*/

/*~struct~Scene:ja

@param SceneType
@text シーンタイプ
@desc 遷移先のシーンクラスです。一覧にないものは直接クラス名を入力します。
@default Scene_Options
@type select
@option オプション画面
@value Scene_Options
@option ショップ画面
@value Scene_Shop
@option 名前入力画面
@value Scene_Name
@option タイトル画面
@value Scene_Title
@option ゲームオーバー画面
@value Scene_Gameover
@option メニュー画面
@value Scene_Menu
@option ステータス画面
@value Scene_Status
@option 装備画面
@value Scene_Equip
@option 用語辞典画面(要プラグイン)
@value Scene_Glossary
@option サウンドテスト画面(要プラグイン)
@value Scene_SoundTest

@param CommandName
@text コマンド名
@desc パーティコマンドに表示されるコマンド名称です。
@default コマンド

@param ConditionSwitch
@text 条件スイッチ
@desc 指定した場合、スイッチがONのときだけコマンドに表示されます。
@default 0
@type switch

@param ActorId
@text 名前入力アクター
@desc 名前入力画面を選択したときの対象アクターです。
@default 1
@type actor

@param MaxNameLength
@text 最大名前文字数
@desc 名前入力画面を選択したときの入力可能な最大文字数です。
@default 8
@type number

@param ShopItems
@text アイテムリスト
@desc ショップ画面を選択したときの購入可能アイテム一覧です。
@default []
@type item[]

@param ShopWeapons
@text 武器リスト
@desc ショップ画面を選択したときの購入可能武器一覧です。
@default []
@type weapon[]

@param ShopArmors
@text 防具リスト
@desc ショップ画面を選択したときの購入可能防具一覧です。
@default []
@type armor[]

@param BuyOnly
@text 購入のみ
@desc 有効にすると、ショップ画面を選択したときに売却不可となります。
@default false
@type boolean

@param Script
@text スクリプト
@desc 指定しておくと画面遷移前に任意のスクリプトを実行できます。
@default
@type multiline_string

@param GlossaryType
@text 用語種別
@desc 用語集画面を選択したときの用語種別です。
@default 1
*/

(()=> {
    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);
    if (!param.SceneList) {
        param.SceneList = [];
    }

    SceneManager.pushPartyCommandScene = function(sceneData) {
        this._toPartyCommandScene = true;
        const scene = window[sceneData.SceneType];
        if (!scene) {
            // for SceneCustomMenu.js
            if (this.findSceneData && this.findSceneData(sceneData.SceneType)) {
                this.callCustomMenu(sceneData.SceneType);
            } else {
                throw new Error(`Scene data '${scene}' is not found`);
            }
        } else {
            this.push(scene);
        }
        this.snapForBackground();
        if (sceneData.Script) {
            eval(sceneData.Script);
        }
        switch (sceneData.SceneType) {
            case 'Scene_Name':
                this.prepareNextScene(sceneData.ActorId, sceneData.MaxNameLength);
                break;
            case 'Scene_Shop':
                this.prepareNextScene(this.findShopGoods(sceneData), sceneData.BuyOnly);
                break;
            case 'Scene_Glossary':
                $gameParty.clearGlossaryIndex();
                $gameParty.setSelectedGlossaryType(sceneData.GlossaryType);
                break;
        }
    };

    SceneManager.findShopGoods = function(sceneData) {
        let goods = [];
        if (sceneData.ShopItems) {
            goods = goods.concat(sceneData.ShopItems.map(id => [0, id, 0, 0]));
        }
        if (sceneData.ShopWeapons) {
            goods = goods.concat(sceneData.ShopWeapons.map(id => [1, id, 0, 0]));
        }
        if (sceneData.ShopArmors) {
            goods = goods.concat(sceneData.ShopArmors.map(id => [2, id, 0, 0]));
        }
        return goods;
    };

    SceneManager.isPartyCommandScene = function() {
        return this._toPartyCommandScene;
    };

    SceneManager.clearPartyCommandScene = function() {
        this._toPartyCommandScene = false;
    };

    const _Window_PartyCommand_makeCommandList = Window_PartyCommand.prototype.makeCommandList;
    Window_PartyCommand.prototype.makeCommandList = function() {
        _Window_PartyCommand_makeCommandList.apply(this, arguments);
        param.SceneList.forEach(scene => {
            if (scene.ConditionSwitch && !$gameSwitches.value(scene.ConditionSwitch)) {
                return;
            }
            this.addCommand(scene.CommandName, 'partyCommandScene', true, scene);
        });
    };

    const _Window_MenuCommand_isSaveEnabled      = Window_MenuCommand.prototype.isSaveEnabled;
    Window_MenuCommand.prototype.isSaveEnabled = function() {
        return _Window_MenuCommand_isSaveEnabled.apply(this, arguments) && !SceneManager.isPartyCommandScene();
    };

    const _Window_MenuCommand_isGameEndEnabled      = Window_MenuCommand.prototype.isGameEndEnabled;
    Window_MenuCommand.prototype.isGameEndEnabled = function() {
        return _Window_MenuCommand_isGameEndEnabled.apply(this, arguments) && !SceneManager.isPartyCommandScene();
    };

    const _Scene_Battle_createPartyCommandWindow = Scene_Battle.prototype.createPartyCommandWindow;
    Scene_Battle.prototype.createPartyCommandWindow = function() {
        _Scene_Battle_createPartyCommandWindow.call(this);
        this._partyCommandWindow.setHandler('partyCommandScene', ()=> {
            const sceneData = this._partyCommandWindow.currentExt();
            SceneManager.pushPartyCommandScene(sceneData);
            Scene_Battle._partyCommandIndex = this._partyCommandWindow.index();
        });
        if (SceneManager.isPartyCommandScene()) {
            this._partyCommandWindow.openness = 255;
        }
    };

    const _Scene_Battle_createStatusWindow = Scene_Battle.prototype.createStatusWindow;
    Scene_Battle.prototype.createStatusWindow = function() {
        _Scene_Battle_createStatusWindow.apply(this, arguments);
        if (SceneManager.isPartyCommandScene()) {
            this._statusWindow.openness = 255;
        }
    };

    const _Scene_Battle_start = Scene_Battle.prototype.start;
    Scene_Battle.prototype.start = function() {
        if (SceneManager.isPartyCommandScene()) {
            this.resetCallAnotherSceneFlags();
            Scene_Base.prototype.start.call(this);
        } else {
            _Scene_Battle_start.apply(this);
        }
    };

    const _Scene_Battle_resetCallAnotherSceneFlags = Scene_Battle.prototype.resetCallAnotherSceneFlags;
    Scene_Battle.prototype.resetCallAnotherSceneFlags = function () {
        if (_Scene_Battle_resetCallAnotherSceneFlags) {
            _Scene_Battle_resetCallAnotherSceneFlags.call(this);
        }
        SceneManager.clearPartyCommandScene();
    };

    const _Scene_Battle_startPartyCommandSelection = Scene_Battle.prototype.startPartyCommandSelection;
    Scene_Battle.prototype.startPartyCommandSelection = function() {
        _Scene_Battle_startPartyCommandSelection.apply(this, arguments);
        if (Scene_Battle._partyCommandIndex >= 0) {
            this._partyCommandWindow.forceSelect(Scene_Battle._partyCommandIndex);
            this.updateStatusWindowPosition();
            Scene_Battle._partyCommandIndex = -1;
        }
    };

    const _Scene_Battle_terminate = Scene_Battle.prototype.terminate;
    Scene_Battle.prototype.terminate = function() {
        if (SceneManager.isPartyCommandScene()) {
            Scene_Base.prototype.terminate.call(this);
        } else {
            _Scene_Battle_terminate.apply(this, arguments);
        }
    };

    const _Scene_Battle_stop = Scene_Battle.prototype.stop;
    Scene_Battle.prototype.stop = function() {
        if (SceneManager.isPartyCommandScene()) {
            Scene_Base.prototype.stop.call(this);
        } else {
            _Scene_Battle_stop.apply(this, arguments);
        }
    };

    const _Sprite_Actor_moveToStartPosition = Sprite_Actor.prototype.moveToStartPosition;
    Sprite_Actor.prototype.moveToStartPosition = function() {
        if (SceneManager.isPartyCommandScene()) {
            return;
        }
        _Sprite_Actor_moveToStartPosition.apply(this, arguments);
    };

    const _Game_BattlerBase_meetsUsableItemConditions        = Game_BattlerBase.prototype.meetsUsableItemConditions;
    Game_BattlerBase.prototype.meetsUsableItemConditions = function(item) {
        return _Game_BattlerBase_meetsUsableItemConditions.apply(this, arguments) &&
            this.meetsUsableItemConditionsForPartyCommandScene(item);
    };

    Game_BattlerBase.prototype.meetsUsableItemConditionsForPartyCommandScene = function(item) {
        return !(SceneManager.isPartyCommandScene() && this.isCommonEventItemOf(item));
    };

    Game_BattlerBase.prototype.isCommonEventItemOf = function(item) {
        return item.effects.some(function(effect) {
            return effect.code === Game_Action.EFFECT_COMMON_EVENT;
        });
    };
})();