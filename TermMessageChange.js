/*=============================================================================
 TermMessageChange.js
----------------------------------------------------------------------------
 (C)2023 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2023/06/25 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/TermMessageChange.js
@plugindesc Terminology Message Change Plugin
@author Triacontane
@license MIT License

@help
English Help Translator: munokura
Please check the URL below for the latest version of the plugin.
URL https://triacontane.blogspot.com
-----

TermMessageChange.js

Dynamically replaces database term messages with other messages.
You can specify conditions such as switches, targets, and actors.

This plugin requires the base plugin "PluginCommonBase.js."
"PluginCommonBase.js" is located in the following folder under the RPG Maker
MZ installation folder:
dlc/BasicResources/plugins/official

Terms of Use:
You may modify and redistribute this plugin without permission, and there are
no restrictions on its use (commercial, 18+, etc.).
This plugin is now yours.

@param messageList
@text Terminology Message List
@desc A list of term messages.
@type struct<MESSAGE>[]
@default []
*/

/*~struct~MESSAGE:
@param type
@text Message Type
@desc Message type. Select the type that matches the term you want to change.
@type select
@default alwaysDash
@option Constant dash
@value alwaysDash
@option Command Memory
@value commandRemember
@option BGM volume
@value bgmVolume
@option BGS volume
@value bgsVolume
@option ME volume
@value meVolume
@option Sound Effects Volume
@value seVolume
@option Number of possessions
@value possession
@option Current Experience Points
@value expTotal
@option To the next level
@value expNext
@option Save Message
@value saveMessage
@option Loading Messages
@value loadMessage
@option file
@value file
@option Autosave
@value autosave
@option Party Name
@value partyName
@option Appearance
@value emerge
@option Preemptive attack
@value preemptive
@option sucker punch
@value surprise
@option Start of escape
@value escapeStart
@option Failed escape
@value escapeFailure
@option victory
@value victory
@option defeat
@value defeat
@option Experience points gained
@value obtainExp
@option Earn money
@value obtainGold
@option Item Acquisition
@value obtainItem
@option Level Up
@value levelUp
@option Skill Acquisition
@value obtainSkill
@option Item Use
@value useItem
@option Critical hit on enemy
@value criticalToEnemy
@option Critical hit on an ally
@value criticalToActor
@option Ally Damage
@value actorDamage
@option Ally recovery
@value actorRecovery
@option Increased ally points
@value actorGain
@option Ally points decrease
@value actorLoss
@option Absorb Ally Points
@value actorDrain
@option No damage to allies
@value actorNoDamage
@option No hit to ally
@value actorNoHit
@option Enemy Damage
@value enemyDamage
@option Enemy recovery
@value enemyRecovery
@option Enemy points increase
@value enemyGain
@option Enemy points decrease
@value enemyLoss
@option Absorb enemy points
@value enemyDrain
@option No damage to enemies
@value enemyNoDamage
@option No hit to the enemy
@value enemyNoHit
@option Avoid
@value evasion
@option Magic Evasion
@value magicEvasion
@option Magic Reflection
@value magicReflection
@option Counterattack
@value counterAttack
@option Substitute
@value substitute
@option reinforcement
@value buffAdd
@option Weakened
@value debuffAdd
@option Removal of reinforcement
@value buffRemove
@option failure of action
@value actionFailure

@param message
@text message
@desc This is the message that will be replaced with the default message when the conditions are met. Depending on the message, special characters such as %1 can be used.
@type multiline_string

@param switchId
@text Condition Switch
@desc The message will change when the specified switch is ON.
@type switch
@default 0

@param targetActorId
@text Target Actor Conditions
@desc The message will change when the target is the specified actor.
@type actor
@default 0

@param targetEnemyId
@text Target Enemy Character Conditions
@desc The message will change when the target is the specified enemy character.
@type enemy
@default 0

@param subjectActorId
@text Actor Condition
@desc The message will change when the actor is the specified actor.
@type actor
@default 0

@param subjectEnemyId
@text Action Enemy Character Conditions
@desc The message will change when the actor is a specified enemy character.
@type enemy
@default 0
*/

/*:ja
@plugindesc 用語メッセージ変更プラグイン
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/TermMessageChange.js
@base PluginCommonBase
@orderAfter PluginCommonBase
@author トリアコンタン

@param messageList
@text 用語メッセージリスト
@desc 用語メッセージのリストです。
@default []
@type struct<MESSAGE>[]

@help TermMessageChange.js

データベースの用語メッセージを、別のメッセージに動的に置き換えられます。
スイッチや対象者、行動者を条件に指定できます。

このプラグインの利用にはベースプラグイン『PluginCommonBase.js』が必要です。
『PluginCommonBase.js』は、RPGツクールMZのインストールフォルダ配下の
以下のフォルダに格納されています。
dlc/BasicResources/plugins/official

利用規約：
 作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 についても制限はありません。
 このプラグインはもうあなたのものです。
*/

/*~struct~MESSAGE:ja
@param type
@text メッセージ種別
@desc メッセージ種別です。変更したい用語に合わせて選択してください。
@default alwaysDash
@type select
@option 常時ダッシュ
@value alwaysDash
@option コマンド記憶
@value commandRemember
@option BGM音量
@value bgmVolume
@option BGS音量
@value bgsVolume
@option ME音量
@value meVolume
@option SE音量
@value seVolume
@option 持っている数
@value possession
@option 現在の経験値
@value expTotal
@option 次のレベルまで
@value expNext
@option セーブメッセージ
@value saveMessage
@option ロードメッセージ
@value loadMessage
@option ファイル
@value file
@option オートセーブ
@value autosave
@option パーティ名
@value partyName
@option 出現
@value emerge
@option 先制攻撃
@value preemptive
@option 不意打ち
@value surprise
@option 逃走開始
@value escapeStart
@option 逃走失敗
@value escapeFailure
@option 勝利
@value victory
@option 敗北
@value defeat
@option 経験値獲得
@value obtainExp
@option お金獲得
@value obtainGold
@option アイテム獲得
@value obtainItem
@option レベルアップ
@value levelUp
@option スキル習得
@value obtainSkill
@option アイテム使用
@value useItem
@option 敵に会心
@value criticalToEnemy
@option 味方に会心
@value criticalToActor
@option 味方ダメージ
@value actorDamage
@option 味方回復
@value actorRecovery
@option 味方ポイント増加
@value actorGain
@option 味方ポイント減少
@value actorLoss
@option 味方ポイント吸収
@value actorDrain
@option 味方ノーダメージ
@value actorNoDamage
@option 味方に命中せず
@value actorNoHit
@option 敵ダメージ
@value enemyDamage
@option 敵回復
@value enemyRecovery
@option 敵ポイント増加
@value enemyGain
@option 敵ポイント減少
@value enemyLoss
@option 敵ポイント吸収
@value enemyDrain
@option 敵ノーダメージ
@value enemyNoDamage
@option 敵に命中せず
@value enemyNoHit
@option 回避
@value evasion
@option 魔法回避
@value magicEvasion
@option 魔法反射
@value magicReflection
@option 反撃
@value counterAttack
@option 身代わり
@value substitute
@option 強化
@value buffAdd
@option 弱体
@value debuffAdd
@option 強化解除
@value buffRemove
@option 行動失敗
@value actionFailure

@param message
@text メッセージ
@desc 条件を満たしたときにデフォルトから置き換わるメッセージです。メッセージによっては%1などの特殊文字が使えます。
@default
@type multiline_string

@param switchId
@text 条件スイッチ
@desc 指定したスイッチがONのときにメッセージが切り替わります。
@default 0
@type switch

@param targetActorId
@text 対象者アクター条件
@desc 対象者が指定したアクターのときメッセージが切り替わります。
@default 0
@type actor

@param targetEnemyId
@text 対象者敵キャラ条件
@desc 対象者が指定した敵キャラのときメッセージが切り替わります。
@default 0
@type enemy

@param subjectActorId
@text 行動者アクター条件
@desc 行動者が指定したアクターのときメッセージが切り替わります。
@default 0
@type actor

@param subjectEnemyId
@text 行動者敵キャラ条件
@desc 行動者が指定した敵キャラのときメッセージが切り替わります。
@default 0
@type enemy
*/

(() => {
    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);
    if (!param.messageList) {
        param.messageList = [];
    }

    const _TextManager_message = TextManager.message
    TextManager.message = function(messageId) {
        const customData = this.findCustomMessage(messageId);
        if (customData) {
            return customData.message;
        } else {
            return _TextManager_message.apply(this, arguments);
        }
    };

    TextManager._targetActorId = 0;
    TextManager._subjectActorId = 0;
    TextManager._targetEnemyId = 0;
    TextManager._subjectEnemyId = 0;

    TextManager.findCustomMessage = function(messageId) {
        return param.messageList.find(message => messageId === message.type && this.isValidMessage(message));
    };

    TextManager.setMessageSubject = function (battler) {
        if (battler.isActor()) {
            this._subjectActorId = battler.actorId();
            this._subjectEnemyId = 0;
        } else if (battler.isEnemy()) {
            this._subjectActorId = 0;
            this._subjectEnemyId = battler.enemyId();
        } else {
            this._subjectActorId = 0;
            this._subjectEnemyId = 0;
        }
    }

    TextManager.setMessageTarget = function (battler) {
        if (battler.isActor()) {
            this._targetActorId = battler.actorId();
            this._targetEnemyId = 0;
        } else if (battler.isEnemy()) {
            this._targetActorId = 0;
            this._targetEnemyId = battler.enemyId();
        } else {
            this._targetActorId = 0;
            this._targetEnemyId = 0;
        }
    }

    TextManager.clearMessageBattler = function () {
        this._subjectActorId = 0;
        this._subjectEnemyId = 0;
        this._targetActorId = 0;
        this._targetEnemyId = 0;
    }

    TextManager.isValidMessage = function(message) {
        const conditions = [];
        conditions.push(() => !message.switchId || $gameSwitches.value(message.switchId));
        conditions.push(() => !message.targetActorId || this._targetActorId === message.targetActorId);
        conditions.push(() => !message.targetEnemyId || this._targetEnemyId === message.targetEnemyId);
        conditions.push(() => !message.subjectActorId || this._subjectActorId === message.subjectActorId);
        conditions.push(() => !message.subjectEnemyId || this._subjectEnemyId === message.subjectEnemyId);
        return conditions.every(condition => condition());
    };

    const _BattleManager_startAction = BattleManager.startAction;
    BattleManager.startAction = function() {
        TextManager.setMessageSubject(this._subject);
        _BattleManager_startAction.apply(this, arguments);
    };

    const _BattleManager_invokeAction = BattleManager.invokeAction;
    BattleManager.invokeAction = function(subject, target) {
        TextManager.setMessageTarget(target);
        _BattleManager_invokeAction.apply(this, arguments);
    };

    const _BattleManager_endAction = BattleManager.endAction;
    BattleManager.endAction = function() {
        TextManager.clearMessageBattler();
        _BattleManager_endAction.apply(this, arguments);
    }

})();