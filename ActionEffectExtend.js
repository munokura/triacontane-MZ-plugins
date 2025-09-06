/*=============================================================================
 ActionEffectExtend.js
----------------------------------------------------------------------------
 (C)2023 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2023/12/28 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/ActionEffectExtend.js
@plugindesc Use effect extension plug-in
@author Triacontane
@license MIT License

@help
English Help Translator: munokura
Please check the URL below for the latest version of the plugin.
URL https://triacontane.blogspot.com
-----

ActionEffectExtend.js

Allows you to specify the effects of skill and item use more flexibly.
Use this when the default effects are not sufficient.
Set the effect information in the plugin parameters, then enter the following
in the skill or item's memo field.

<effect:id01> # The effect of identifier [id01] will be applied when used.

This plugin requires the base plugin "PluginCommonBase.js."
"PluginCommonBase.js" is located in the following folder under the RPG Maker
MZ installation folder:
dlc/BasicResources/plugins/official

Terms of Use:
You may modify and redistribute this plugin without permission, and there are
no restrictions on its use (commercial, 18+, etc.).
This plugin is now yours.

@param effects
@text Use effect list
@desc A list of usage effects. Defines the additional effects when using skills or items.
@type struct<Effects>[]
@default []
*/

/*~struct~Effects:
@param id
@text identifier
@desc This is the ID to specify in the memo field of a skill or item. <effect:id01>
@type string
@default id01

@param itemList
@text Effect Item List
@desc This is a list of effects that will be applied. All of the listed effects will be applied.
@type struct<EffectItem>[]
@default []

@param target
@text subject
@desc The target to which the usage effect is applied.
@type select
@default target
@option Target Audience
@value target
@option user
@value user
@option Target audience and users
@value both
@option All allies of the target
@value targetAll
@option Random ally of the target
@value targetRandom
@option All of the user's allies
@value userAll
@option User's ally is random
@value userRandom
@option All allies and enemies
@value all

@param animation
@text animation
@desc This is the animation that plays when the effect is used.
@type animation
@default 0

@param message
@text message
@desc This is the message that will be displayed when the effect is used.
@type string
*/

/*~struct~EffectItem:
@param stateType
@text State Type
@desc The type of state to assign or remove. Multiple states can be assigned or removed at the same time.
@type select
@option none
@value
@option Grant
@value add
@option Cancellation
@value remove
@option One given at random
@value addRandom
@option Full release
@value removeAll

@param states
@text State
@desc This is a list of states to be granted or cancelled. If you select "Cancel all", all states will be cancelled regardless of this setting.
@type state[]
@default []
@parent stateType

@param damageType
@text Damage Type
@desc The type of damage
@type select
@option none
@value
@option HP
@value hp
@option MP
@value mp
@option TP
@value tp

@param damageValue
@text Damage Amount
@desc The amount of damage, negative values result in healing.
@type number
@default 0
@min -9999999
@max 9999999
@parent damageType

@param levelUp
@text Level Up
@desc Level up.
@type boolean
@default false

@param exp
@text Experience points gained
@desc Gain experience points. The amount gained is not affected by the Experience Gain Rate trait.
@type number
@default 0

@param showLevelUpMessage
@text Message display
@desc Displays a message when you level up. If used on the menu screen, it will be displayed after returning to the map screen.
@type boolean
@default false

@param disarmament
@text disarm
@desc Removes any equipped weapons or armor. This has no effect if the equipment is locked.
@type boolean
@default false

@param equipType
@text Equipment Type
@desc The equipment type to remove. If 0 is specified, all equipment will be removed.
@type number
@default 0
@parent disarmament

@param switchId
@text Switch operation
@desc Operates the switch with the specified number.
@type switch
@default 0

@param switchValue
@text Switch Value
@desc The switch value to operate.
@type boolean
@default true
@parent switchId

@param script
@text script
@desc Executes the script. You can use this to refer to the target of the effect and subject to refer to the user.
@type multiline_string

@param probability
@text Probability
@desc The probability that the effect will occur. If you specify 100, it will always occur.
@type number
@default 100
@min 0
@max 100
*/

/*:ja
@plugindesc 使用効果拡張プラグイン
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/ActionEffectExtend.js
@base PluginCommonBase
@orderAfter PluginCommonBase
@author トリアコンタン

@param effects
@text 使用効果リスト
@desc 使用効果の一覧です。スキルやアイテム使用時の追加効果を定義します。
@default []
@type struct<Effects>[]

@help ActionEffectExtend.js

スキルやアイテムの使用効果をより柔軟に指定できます。
デフォルトの使用効果では表現しきれない場合に使用します。
プラグインパラメータから効果情報を設定のうえ
スキル、アイテムのメモ欄に以下の通り記述してください。

<effect:id01> # 識別子[id01]の効果が使用時に適用されます。

このプラグインの利用にはベースプラグイン『PluginCommonBase.js』が必要です。
『PluginCommonBase.js』は、RPGツクールMZのインストールフォルダ配下の
以下のフォルダに格納されています。
dlc/BasicResources/plugins/official

利用規約：
 作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 についても制限はありません。
 このプラグインはもうあなたのものです。
*/

/*~struct~Effects:ja
@param id
@text 識別子
@desc スキルやアイテムのメモ欄で指定するIDです。<effect:id01>
@default id01
@type string

@param itemList
@text 効果項目リスト
@desc 適用される効果の一覧です。記載した効果がすべて適用されます。
@default []
@type struct<EffectItem>[]

@param target
@text 対象
@desc 使用効果が適用される対象です。
@default target
@type select
@option 対象者
@value target
@option 使用者
@value user
@option 対象者と使用者
@value both
@option 対象者の味方全員
@value targetAll
@option 対象者の味方ランダム
@value targetRandom
@option 使用者の味方全員
@value userAll
@option 使用者の味方ランダム
@value userRandom
@option 敵味方全員
@value all

@param animation
@text アニメーション
@desc 使用効果の際に再生されるアニメーションです。
@default 0
@type animation

@param message
@text メッセージ
@desc 使用効果の際に表示されるメッセージです。
@default
@type string
*/

/*~struct~EffectItem:ja

@param stateType
@text ステート種別
@desc ステートの付与や解除の種別です。複数のステートに対して同時に付与や解除できます。
@default
@type select
@option なし
@value
@option 付与
@value add
@option 解除
@value remove
@option ランダムでひとつ付与
@value addRandom
@option 全解除
@value removeAll

@param states
@text ステート
@desc 付与や解除の対象となるステート一覧です。全解除を選択した場合は、本指定に拘わらず全てのステートが解除されます。
@default []
@type state[]
@parent stateType

@param damageType
@text ダメージ種別
@desc ダメージの種別です
@default
@type select
@option なし
@value
@option HP
@value hp
@option MP
@value mp
@option TP
@value tp

@param damageValue
@text ダメージ量
@desc ダメージの量です。負の値を指定すると回復になります。
@default 0
@type number
@min -9999999
@max 9999999
@parent damageType

@param levelUp
@text レベルアップ
@desc レベルアップします。
@default false
@type boolean

@param exp
@text 経験値獲得
@desc 経験値を獲得します。獲得量は、経験獲得率の特徴の影響を受けません。
@default 0
@type number

@param showLevelUpMessage
@text メッセージ表示
@desc レベルアップ時にメッセージを表示します。メニュー画面で使用するとマップ画面に戻ってから表示します。
@default false
@type boolean

@param disarmament
@text 武装解除
@desc 装備している武器や防具を解除します。装備固定されている場合は無効です。
@default false
@type boolean

@param equipType
@text 装備タイプ
@desc 解除する装備タイプです。0を指定した場合、全ての武具が解除されます。
@default 0
@type number
@parent disarmament

@param switchId
@text スイッチ操作
@desc 指定した番号のスイッチを操作します。
@default 0
@type switch

@param switchValue
@text スイッチ値
@desc 操作するスイッチの値です。
@default true
@type boolean
@parent switchId

@param script
@text スクリプト
@desc スクリプトを実行します。thisで効果の対象者を、subjectで使用者を参照できます。
@default
@type multiline_string

@param probability
@text 発生確率
@desc 効果が発生する確率です。100を指定すると必ず発生します。
@default 100
@type number
@min 0
@max 100
*/

(() => {
    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);
    if (!param.effects) {
        param.effects = [];
    }

    const _Game_ActionResult_clear = Game_ActionResult.prototype.clear;
    Game_ActionResult.prototype.clear = function() {
        _Game_ActionResult_clear.apply(this, arguments);
        this.extendMassage = null;
        this.extendAnimation = null;
    };

    Game_ActionResult.prototype.setEffectExtend = function(effect) {
        this.extendMassage = effect.message;
        this.extendAnimation = effect.animation;
        this.used = true;
    };

    const _BattleManager_setup = BattleManager.setup;
    BattleManager.setup = function(troopId, canEscape, canLose) {
        _BattleManager_setup.apply(this, arguments);
        this.clearActionExtendBattler();
    };

    BattleManager.clearActionExtendBattler = function() {
        this._actionExtendBattlers = [];
    };

    BattleManager.appendActionExtendBattler = function(battler) {
        this._actionExtendBattlers.push(battler);
    };

    const _BattleManager_invokeNormalAction = BattleManager.invokeNormalAction;
    BattleManager.invokeNormalAction = function(subject, target) {
        _BattleManager_invokeNormalAction.apply(this, arguments);
        const battlers = this._actionExtendBattlers;
        if (battlers.length > 0) {
            battlers.filter(battler => battler !== target)
                .forEach(battler => this._logWindow.displayActionResults(subject, battler));
            this._logWindow.setupEffectExtend(battlers);
            this.clearActionExtendBattler();
        }
    };

    Window_BattleLog.prototype.setupEffectExtend = function(battlers) {
        this._damagePopupBattlers = battlers;
        const animationId = battlers[0].result().extendAnimation;
        if (animationId > 0) {
            this._methods.unshift({name: 'showAnimation', params: [null, battlers, animationId]});
        }
    };

    const _Window_BattleLog_popupDamage = Window_BattleLog.prototype.popupDamage;
    Window_BattleLog.prototype.popupDamage = function(target) {
        _Window_BattleLog_popupDamage.apply(this, arguments);
        if (this._damagePopupBattlers) {
            this._damagePopupBattlers.forEach(battler => {
                if (battler.shouldPopupDamage()) {
                    battler.startDamagePopup();
                }
            });
            this._damagePopupBattlers = null;
        }
    };

    const _Window_BattleLog_displayFailure = Window_BattleLog.prototype.displayFailure;
    Window_BattleLog.prototype.displayFailure = function(target) {
        _Window_BattleLog_displayFailure.apply(this, arguments);
        this.displayActionExtendResults(target);
    };

    Window_BattleLog.prototype.displayActionExtendResults = function(target) {
        const result = target.result();
        if (result.extendMassage) {
            this.push('addText', result.extendMassage.format(target.name()));
        }
    };

    const _Game_Action_applyItemUserEffect = Game_Action.prototype.applyItemUserEffect;
    Game_Action.prototype.applyItemUserEffect = function(target) {
        _Game_Action_applyItemUserEffect.apply(this, arguments);
        this.applyItemEffectExtend(target);
    };

    Game_Action.prototype.applyItemEffectExtend = function(target) {
        const effect = this.findItemEffectExtend();
        if (!effect) {
            return;
        }
        this.findEffectExtendTargets(effect.target, target).forEach(target => {
            target.applyItemEffectExtend(effect, this.subject());
            if ($gameParty.inBattle()) {
                BattleManager.appendActionExtendBattler(target);
            }
        });
    };

    Game_Action.prototype.findItemEffectExtend = function() {
        const tagName = this.item().meta.effect;
        return param.effects.find(e => e.id === tagName);
    };

    const _Game_Action_hasItemAnyValidEffects = Game_Action.prototype.hasItemAnyValidEffects;
    Game_Action.prototype.hasItemAnyValidEffects = function(target) {
        const result = _Game_Action_hasItemAnyValidEffects.apply(this, arguments);
        return result || !!this.findItemEffectExtend();
    };

    Game_Action.prototype.findEffectExtendTargets = function(effectTarget, actionTarget) {
        switch (effectTarget) {
            case 'target':
                return [actionTarget];
            case 'user':
                return [this.subject()];
            case 'both':
                return [actionTarget, this.subject()];
            case 'targetAll':
                return actionTarget.friendsUnit().members();
            case 'targetRandom':
                return [actionTarget.friendsUnit().randomTarget()];
            case 'userAll':
                return this.subject().friendsUnit().members();
            case 'userRandom':
                return [this.subject().friendsUnit().randomTarget()];
            case 'all':
                return $gameParty.members().concat($gameTroop.members());
            default:
                return [];
        }
    };

    Game_Battler.prototype.applyItemEffectExtend = function(effect, actionSubject) {
        effect.itemList
            .filter(item => Math.randomInt(100) < item.probability)
            .forEach(item => this.applyEffectExtendItem(item, actionSubject));
        this.result().setEffectExtend(effect);
    };

    Game_Battler.prototype.applyEffectExtendItem = function(item, subject) {
        if (item.stateType) {
            this.applyEffectExtendState(item.stateType, item.states);
        }
        if (item.damageType) {
            this.applyEffectExtendDamage(item.damageType, item.damageValue);
        }
        if (item.switchId) {
            $gameSwitches.setValue(item.switchId, item.switchValue);
        }
        if (item.script) {
            eval(item.script);
        }
        this.result().success = true;
    };

    Game_Actor.prototype.applyEffectExtendItem = function(item) {
        this._itemLevelUp = true;
        if (item.levelUp) {
            this.changeExp(this.nextLevelExp() - this.currentExp(), item.showLevelUpMessage);
        }
        if (item.exp) {
            const newExp = this.currentExp() + item.exp;
            this.changeExp(newExp, item.showLevelUpMessage);
        }
        this._itemLevelUp = false;
        if (item.disarmament) {
            if (item.equipType) {
                this.clearEquipmentsByEType(item.equipType);
            } else {
                this.clearEquipments();
            }
        }
        Game_Battler.prototype.applyEffectExtendItem.apply(this, arguments);
    };

    const _Game_Actor_displayLevelUp = Game_Actor.prototype.displayLevelUp;
    Game_Actor.prototype.displayLevelUp = function(newSkills) {
        _Game_Actor_displayLevelUp.apply(this, arguments);
        if (this._itemLevelUp && !$gameParty.inBattle()) {
            SceneManager.goto(Scene_Map);
        }
    };

    Game_Actor.prototype.clearEquipmentsByEType = function(eType) {
        const slots = this.equipSlots();
        for (let i = 0; i < slots.length; i++) {
            if (this.isEquipChangeOk(i) && slots[i] === eType) {
                this.changeEquip(i, null);
            }
        }
    };

    Game_Battler.prototype.applyEffectExtendState = function(stateType, states) {
        switch (stateType) {
            case 'add':
                states.forEach(state => this.addState(state));
                break;
            case 'remove':
                states.forEach(state => this.removeState(state));
                break;
            case 'addRandom':
                this.addNewState(states[Math.randomInt(states.length)]);
                break;
            case 'removeAll':
                this.clearStates();
                break;
        }
    };

    Game_Battler.prototype.applyEffectExtendDamage = function(damageType, damageValue) {
        switch (damageType) {
            case 'hp':
                this.gainHp(-damageValue);
                if (damageValue > 0) {
                    this.onDamage(damageValue);
                }
                break;
            case 'mp':
                this.gainMp(-damageValue);
                break;
            case 'tp':
                this.gainTp(-damageValue);
                break;
        }
    };
})();