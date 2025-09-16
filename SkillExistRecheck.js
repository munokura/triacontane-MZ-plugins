/*=============================================================================
 SkillExistRecheck.js
----------------------------------------------------------------------------
 (C)2024 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.1 2024/08/29 プラグインを適用すると攻撃と防御が使えなくなっていた問題を修正
 1.0.0 2024/08/24 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/SkillExistRecheck.js
@plugindesc Existence check plugin when using skills
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

SkillExistRecheck.js

This plugin rechecks whether you have the skill when you try to use it. If you
don't have the skill, the skill will fail.

Terms of Use:
You may modify and redistribute this plugin without permission from the
author, and there are no restrictions on its use (commercial, 18+, etc.).
This plugin is now yours.
*/

/*:ja
@plugindesc スキル使用時の存在チェックプラグイン
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/SkillExistRecheck.js
@author トリアコンタン

@help SkillExistRecheck.js

スキルを使用するタイミングでスキルを保持しているかどうかを
再度チェックします。保持していない場合、スキルは不発となります。

利用規約：
 作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 についても制限はありません。
 このプラグインはもうあなたのものです。
*/

(() => {
    'use strict';

    const _Game_BattlerBase_meetsSkillConditionsExistRecheck = Game_BattlerBase.prototype.meetsSkillConditions;
    Game_BattlerBase.prototype.meetsSkillConditions = function(skill) {
        return _Game_BattlerBase_meetsSkillConditionsExistRecheck.apply(this, arguments) &&
            this.hasSkillForUsing(skill.id);
    };

    Game_BattlerBase.prototype.hasSkillForUsing = function(skillId) {
        return true;
    };

    Game_Actor.prototype.hasSkillForUsing = function(skillId) {
        if (skillId === this.attackSkillId() || skillId === this.guardSkillId()) {
            return true;
        }
        return this.hasSkill(skillId);
    };
})();