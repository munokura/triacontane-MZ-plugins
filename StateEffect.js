/*=============================================================================
 StateEffect.js
----------------------------------------------------------------------------
 (C)2022 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.1.0 2022/09/25 ステート効果をポップアップやメッセージの表示対象外にできる機能を追加
 1.0.0 2022/04/10 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/StateEffect.js
@plugindesc State Effect Plug-ins
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

StateEffect.js

Applies the effect of the specified skill to the target when the state is
activated.
This allows you to create an effect that occurs only at the moment the state
is activated, rather than a continuous effect.

Applies the damage and effect of skill [3] to the target when the state is
activated.
<StateEffect:3>
<StateEffect:3>

Skill content other than the effect (damage, animation, etc.) is not
referenced.

This plugin requires the base plugin "PluginCommonBase.js."
"PluginCommonBase.js" is located in the following folder under the RPG Maker
MZ installation folder:
dlc/BasicResources/plugins/official

Terms of Use:
You may modify and redistribute this plugin without permission from the
author, and there are no restrictions on its use (commercial, R18, etc.).
This plugin is now yours.

@param noDisplay
@text Hide state effects
@desc The state effects applied by this plugin will not be displayed as popups or messages.
@type boolean
@default false
*/

/*:ja
@plugindesc ステートエフェクトプラグイン
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/StateEffect.js
@base PluginCommonBase
@orderAfter PluginCommonBase
@author トリアコンタン

@param noDisplay
@text ステート効果非表示
@desc 本プラグインで適用されたステート効果をポップアップやメッセージの表示対象外にします。
@default false
@type boolean

@help StateEffect.js

ステートが有効になったとき、対象者に指定スキルの使用効果を適用します。
継続的な効果ではなく有効になった瞬間にだけ発現する効果を表現できます。

ステートが有効になったときにスキル[3]のダメージと効果を
対象者に適用します。
<StateEffect:3>
<ステート効果:3>

使用効果以外のスキル内容(ダメージやアニメーション等)は参照されません。

このプラグインの利用にはベースプラグイン『PluginCommonBase.js』が必要です。
『PluginCommonBase.js』は、RPGツクールMZのインストールフォルダ配下の
以下のフォルダに格納されています。
dlc/BasicResources/plugins/official

利用規約：
 作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 についても制限はありません。
 このプラグインはもうあなたのものです。
*/

(()=> {
    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);

    const _Game_BattlerBase_addNewState = Game_BattlerBase.prototype.addNewState;
    Game_BattlerBase.prototype.addNewState = function(stateId) {
        _Game_BattlerBase_addNewState.apply(this, arguments);
        const skillId = PluginManagerEx.findMetaValue($dataStates[stateId] || {}, ['ステート効果', 'StateEffect']);
        if (skillId) {
            this.applyStateEffect(skillId);
        }
    };

    Game_BattlerBase.prototype.applyStateEffect = function(skillId) {
        if (!$dataSkills[skillId]) {
            return;
        }
        const action = new Game_Action(this);
        action.setSkill(skillId);
        action.applyStateEffect(this);
    };

    Game_Battler.prototype.setDummyResult = function() {
        this._realResult = this._result;
        this._result = new Game_ActionResult();
    };

    Game_Battler.prototype.restoreResult = function() {
        if (this._realResult) {
            this._result = this._realResult;
            this._realResult = null;
        }
    };

    Game_Action.prototype.applyStateEffect = function(target) {
        if (param.noDisplay) {
            target.setDummyResult();
        }
        this.item().effects.forEach(function(effect) {
            this.applyItemEffect(target, effect);
        }, this);
        this.applyGlobal();
        target.restoreResult();
    };
})();