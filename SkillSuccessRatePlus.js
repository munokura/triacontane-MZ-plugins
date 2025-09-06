/*=============================================================================
 SkillSuccessRatePlus.js
----------------------------------------------------------------------------
 (C)2022 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2023/01/09 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/SkillSuccessRatePlus.js
@plugindesc Skill success rate addition plugin
@author Triacontane
@license MIT License

@help
English Help Translator: munokura
Please check the URL below for the latest version of the plugin.
URL https://triacontane.blogspot.com
-----

SkillSuccessRatePlus.js

Adds a feature that allows you to add or subtract a specified value to the
skill success rate.
Unlike hit rate, this is an addition or subtraction from the base success
rate, not a multiplication.
It also applies to attacks other than physical attacks.
The value is added or subtracted after the hit rate calculation.

Specify the following in the memo field for the actor, class, enemy character,
weapon, or state.

20% will be subtracted from the original success rate.
For a skill with a 50% success rate, it will be reduced to 30%.
<Success Rate Addition: -20>
<SuccessPlus: -20>

This plugin requires the base plugin "PluginCommonBase.js."
"PluginCommonBase.js" is located in the following folder
under the RPG Maker MZ installation folder.
dlc/BasicResources/plugins/official

Terms of Use:
You may modify and redistribute this plugin without permission from the
author, and there are no restrictions on its use (commercial, 18+, etc.).
This plugin is now yours.
*/

/*:ja
@plugindesc スキル成功率加算プラグイン
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/SkillSuccessRatePlus.js
@base PluginCommonBase
@orderAfter PluginCommonBase
@author トリアコンタン

@help SkillSuccessRatePlus.js

スキル成功率に指定値を加算、減算できる特徴を追加します。
命中率と異なり、基本成功率からの乗算ではなく加算、減算です。
また物理攻撃以外にも適用されます。
値の加減は命中率の計算のあとに行われます。

アクター、職業、敵キャラ、武具、ステートのメモ欄に
以下の通り指定してください。

もとの成功率から20%減算されます。
50%の成功率のスキルなら30%になります。
<成功率加算:-20>
<SuccessPlus:-20>

このプラグインの利用にはベースプラグイン『PluginCommonBase.js』が必要です。
『PluginCommonBase.js』は、RPGツクールMZのインストールフォルダ配下の
以下のフォルダに格納されています。
dlc/BasicResources/plugins/official

利用規約：
 作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 についても制限はありません。
 このプラグインはもうあなたのものです。
*/

(() => {
    'use strict';

    const _Game_Action_itemHit = Game_Action.prototype.itemHit;
    Game_Action.prototype.itemHit = function(target) {
        const hit = _Game_Action_itemHit.apply(this, arguments);
        return hit + this.subject().findSuccessRatePlus();
    };

    Game_BattlerBase.prototype.findSuccessRatePlus = function() {
        return this.traitObjects().reduce((prev, obj) => {
            const plus = PluginManagerEx.findMetaValue(obj, ['成功率加算', 'SuccessPlus']) || 0;
            return prev + plus;
        }, 0);
    };
})();