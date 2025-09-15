/*=============================================================================
 AnimationBySubject.js
----------------------------------------------------------------------------
 (C)2024 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2024/02/19 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/AnimationBySubject.js
@plugindesc Skill User Animation Plugin
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

AnimationBySubject.js

Displays an animation for the user of a skill or item.
Specify the skill ID directly or a notetag as a parameter.
If you specify "xxx" as the notetag parameter,
write the following in the skill or item's memo field:
<xxx>

If you specify a user tag parameter,
in addition to the above conditions,
the animation will only be displayed if the user has the specified tag.
This applies to the memo fields of actors, classes, weapons, armor, and
states.

This plugin requires the base plugin "PluginCommonBase.js."
"PluginCommonBase.js" is located in the following folder
under the RPG Maker MZ installation folder:
dlc/BasicResources/plugins/official

Terms of Use:
You may modify and redistribute this plugin without permission, and there are
no restrictions on its use (commercial, 18+, etc.).
This plugin is now yours.

@param animationList
@text Animation List
@desc Skill user animation settings.
@type struct<Animation>[]
@default []

@param timing
@text timing
@desc The timing of the animation.
@type select
@default performAction
@option Before activation
@value performActionStart
@option When activated
@value performAction
@option Before animation
@value showAnimation

@param wait
@text Weight
@desc Whether or not to wait while displaying animation.
@type boolean
@default true
*/

/*~struct~Animation:
@param skillId
@text Skill ID
@desc The skill ID that plays the user animation.
@type skill
@default 0

@param itemId
@text Item ID
@desc The item ID that will play the user animation.
@type item
@default 0

@param skillTag
@text Skill Tags
@desc The notetag <aaa> of the skill or item that will play the user animation. Specify this if you want to apply it to multiple skills or items at once.
@default xxx

@param userTag
@text User Tag
@desc This is a notetag that specifies the user, state, etc. Use this if you want to play different animations for each user.

@param animationId
@text Animation ID
@desc The animation ID to play as the user animation.
@type animation
@default 1
*/

/*:ja
@plugindesc スキル使用者アニメーションプラグイン
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/AnimationBySubject.js
@base PluginCommonBase
@orderAfter PluginCommonBase
@author トリアコンタン

@param animationList
@text アニメーションリスト
@desc スキル使用者アニメーションの設定です。
@default []
@type struct<Animation>[]

@param timing
@text タイミング
@desc アニメーション表示のタイミングです。
@default performAction
@type select
@option 発動前
@value performActionStart
@option 発動時
@value performAction
@option アニメーション表示前
@value showAnimation

@param wait
@text ウェイト
@desc アニメーション表示中のウェイト有無です。
@default true
@type boolean

@help AnimationBySubject.js

スキルやアイテムの使用者にアニメーションを表示します。
パラメータから直接スキルIDを指定するか、メモタグを指定してください。
メモタグのパラメータに「xxx」と指定した場合、
スキルやアイテムのメモ欄に以下の通り記述してください。
<xxx>

使用者タグのパラメータを指定すると、上記の条件に加えて
使用者が指定したタグを持っている場合のみアニメーションを表示します。　
対象はアクター、職業、武器、防具、ステートのメモ欄です。

このプラグインの利用にはベースプラグイン『PluginCommonBase.js』が必要です。
『PluginCommonBase.js』は、RPGツクールMZのインストールフォルダ配下の
以下のフォルダに格納されています。
dlc/BasicResources/plugins/official

利用規約：
 作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 についても制限はありません。
 このプラグインはもうあなたのものです。
*/

/*~struct~Animation:ja
@param skillId
@text スキルID
@desc 使用者アニメーションを再生するスキルIDです。
@default 0
@type skill

@param itemId
@text アイテムID
@desc 使用者アニメーションを再生するアイテムIDです。
@default 0
@type item

@param skillTag
@text スキルタグ
@desc 使用者アニメーションを再生するスキルやアイテムのメモタグ<aaa>です。複数のスキルやアイテムで一括設定したい場合に指定してください。
@default xxx

@param userTag
@text 使用者タグ
@desc 使用者やステートなどで指定するメモタグです。使用者ごとに異なるアニメーションを再生する場合に指定してください。
@default

@param animationId
@text アニメーションID
@desc 使用者アニメーションとして再生するアニメーションIDです。
@default 1
@type animation
*/

(() => {
    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);
    if (!param.animationList) {
        param.animationList = [];
    }

    Game_Action.prototype.findSkillUserAnimation = function() {
        const item = this.item();
        const subject = this.subject();
        return param.animationList.find(animation => {
            const conditions = [];
            conditions.push(!animation.skillId || DataManager.isSkill(item) && animation.skillId === item.id);
            conditions.push(!animation.itemId || DataManager.isItem(item) && animation.itemId === item.id);
            conditions.push(!animation.skillTag || item.meta[animation.skillTag]);
            conditions.push(!animation.userTag || subject.traitObjects().some(obj => obj.meta[animation.userTag]));
            return conditions.every(condition => condition);
        });
    };

    const _Window_BattleLog_startAction = Window_BattleLog.prototype.startAction;
    Window_BattleLog.prototype.startAction = function(subject, action, targets) {
        _Window_BattleLog_startAction.apply(this, arguments);
        this.showSkillUserAnimation(subject, action, param.timing);
    };

    Window_BattleLog.prototype.showSkillUserAnimation = function(subject, action, timing) {
        const animation = action.findSkillUserAnimation();
        if (animation) {
            const index = this._methods.findIndex(method => method.name === timing);
            if (index >= 0) {
                this._methods.splice(index, 0, {name: 'showAnimation', params: [subject, [subject], animation.animationId]});
                if (param.wait) {
                    this._methods.splice(index + 1, 0, {name: 'setWaitMode', params: ['animation']});
                }
            } else {
                this.push('showAnimation', subject, [subject], animation.animationId);
                if (param.wait) {
                    this.push('setWaitMode', 'animation');
                }
            }
        }
    };

    const _Window_BattleLog_updateWaitMode      = Window_BattleLog.prototype.updateWaitMode;
    Window_BattleLog.prototype.updateWaitMode = function() {
        let waiting = false;
        if (this._waitMode === 'animation') {
            waiting = this._spriteset.isAnimationPlaying();
        }
        if (!waiting) {
            waiting = _Window_BattleLog_updateWaitMode.apply(this, arguments);
        }
        return waiting;
    };
})();