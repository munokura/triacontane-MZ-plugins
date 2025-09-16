/*=============================================================================
 MotionCustomize.js
----------------------------------------------------------------------------
 (C)2023 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2023/12/14 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/MotionCustomize.js
@plugindesc Motion Customization Plug-in
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

MotionCustomize.js

Replace specific actor motions with any other motion you like.
You can change defensive motions when in a specific state, or attack motions
when equipped with a specific weapon.

Enter the following in the memo field for the actor, class, weapon, armor, or
state:
<motion:id> # Changes to the motion with identifier [id].
<motion:id> # Same as above

This plugin requires the base plugin "PluginCommonBase.js."
"PluginCommonBase.js" is located in the following folder under the RPG Maker
MZ installation folder:
dlc/BasicResources/plugins/official

Terms of Use:
You may modify and redistribute this plugin without permission, and there are
no restrictions on its use (commercial, 18+, etc.).
This plugin is now yours.

@param motions
@text Motion Settings
@desc This is the motion change setting. Specify it in the memo field in the format <motion:id>.
@type struct<Motion>[]
@default []
*/

/*~struct~Motion:
@param id
@text identifier
@desc This is the identifier for the motion change. Specify it in the memo field in the format <motion:id>.
@default id

@param srcMotion
@text Original motion
@desc The original motion, which corresponds to the cell-by-cell values in the Butler image.
@type select
@default walk
@option walking
@value walk
@option stand-by
@value wait
@option chant
@value chant
@option defense
@value guard
@option damage
@value damage
@option Avoid
@value evade
@option thrust
@value thrust
@option Swing
@value swing
@option Projectile
@value missile
@option skill
@value skill
@option magic
@value spell
@option item
@value item
@option escape
@value escape
@option victory
@value victory
@option dying
@value dying
@option abnormal status
@value abnormal
@option sleep
@value sleep
@option Incapacitated
@value dead

@param dstMotion
@text Changed motion
@desc This is the motion after the change. It corresponds to the value of each cell in the Butler image.
@type select
@default walk
@option walking
@value walk
@option stand-by
@value wait
@option chant
@value chant
@option defense
@value guard
@option damage
@value damage
@option Avoid
@value evade
@option thrust
@value thrust
@option Swing
@value swing
@option Projectile
@value missile
@option skill
@value skill
@option magic
@value spell
@option item
@value item
@option escape
@value escape
@option victory
@value victory
@option dying
@value dying
@option abnormal status
@value abnormal
@option sleep
@value sleep
@option Incapacitated
@value dead
*/

/*:ja
@plugindesc モーションカスタマイズプラグイン
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/MotionCustomize.js
@base PluginCommonBase
@orderAfter PluginCommonBase
@author トリアコンタン

@param motions
@text モーション設定
@desc モーションの変更設定です。メモ欄に<motion:id>の形式で指定します。
@default []
@type struct<Motion>[]

@help MotionCustomize.js

アクターの特定のモーションを任意の別のモーションに差し替えられます。
特定ステートの時に防御モーションを変更したり、
特定の武器を装備した時に攻撃モーションを変更したりできます。

アクター、職業、武器、防具、ステートのメモ欄に以下の通り記述してください。
<motion:id> # 識別子[id]のモーションに変更されます。
<モーション:id> # 同上

このプラグインの利用にはベースプラグイン『PluginCommonBase.js』が必要です。
『PluginCommonBase.js』は、RPGツクールMZのインストールフォルダ配下の
以下のフォルダに格納されています。
dlc/BasicResources/plugins/official

利用規約：
 作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 についても制限はありません。
 このプラグインはもうあなたのものです。
*/

/*~struct~Motion:ja
@param id
@text 識別子
@desc モーション変更を行う識別子です。メモ欄に<motion:id>の形式で指定します。
@default id

@param srcMotion
@text 元モーション
@desc 元のモーションです。バトラー画像のセル毎の値に対応します。
@default walk
@type select
@option 歩行
@value walk
@option 待機
@value wait
@option 詠唱
@value chant
@option 防御
@value guard
@option ダメージ
@value damage
@option 回避
@value evade
@option 突き
@value thrust
@option 振り
@value swing
@option 飛び道具
@value missile
@option スキル
@value skill
@option 魔法
@value spell
@option アイテム
@value item
@option 逃走
@value escape
@option 勝利
@value victory
@option 瀕死
@value dying
@option 状態異常
@value abnormal
@option 睡眠
@value sleep
@option 戦闘不能
@value dead

@param dstMotion
@text 変更後モーション
@desc 変更後のモーションです。バトラー画像のセル毎の値に対応します。
@default walk
@type select
@option 歩行
@value walk
@option 待機
@value wait
@option 詠唱
@value chant
@option 防御
@value guard
@option ダメージ
@value damage
@option 回避
@value evade
@option 突き
@value thrust
@option 振り
@value swing
@option 飛び道具
@value missile
@option スキル
@value skill
@option 魔法
@value spell
@option アイテム
@value item
@option 逃走
@value escape
@option 勝利
@value victory
@option 瀕死
@value dying
@option 状態異常
@value abnormal
@option 睡眠
@value sleep
@option 戦闘不能
@value dead
*/

(() => {
    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);
    if (!param.motions) {
        param.motions = [];
    }

    const _Sprite_Actor_startMotion = Sprite_Actor.prototype.startMotion;
    Sprite_Actor.prototype.startMotion = function(motionType) {
        const newMotion = this.findNewMotion(motionType);
        if (newMotion) {
            arguments[0] = newMotion;
        }
        _Sprite_Actor_startMotion.apply(this, arguments);
    }

    Sprite_Actor.prototype.findNewMotion = function (motionType) {
        if (!this._actor) {
            return null;
        }
        const motion = this._actor.traitObjects()
            .map(trait => this.findNewMotionData(trait, motionType))
            .find(motionData => !!motionData);
        return motion ? motion.dstMotion : null;
    };

    Sprite_Actor.prototype.findNewMotionData = function (trait, motionType) {
        const id = PluginManagerEx.findMetaValue(trait, ['motion', 'モーション']);
        return id ? param.motions.find(motion => motion.id === id && motion.srcMotion === motionType) : null;
    };
})();