/*=============================================================================
 TextScriptBaseFormulaAttachment.js
----------------------------------------------------------------------------
 (C)2023 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.1 2023/07/18 注意書き追加
 1.0.0 2023/07/16 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/TextScriptBaseFormulaAttachment.js
@plugindesc TextScriptBase formula attachment
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

TextScriptBaseFormulaAttachment.js

This attachment applies the effects of the official "TextScriptBase" plugin to
skill and item formulas.

When using this plugin, please use the control characters \tx[aaa].
\js[aaa] cannot be used as a general rule.

The base plugin "TextScriptBase.js" is required to use this plugin.
"TextScriptBase.js" is located in the following folder under the RPG Maker MZ
installation folder:
dlc/BasicResources/plugins/official

Terms of Use:
You may modify and redistribute this plugin without permission, and there are
no restrictions on its use (commercial, 18+, etc.).
This plugin is now yours.
*/

/*:ja
@plugindesc TextScriptBaseの計算式アタッチメント
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/TextScriptBaseFormulaAttachment.js
@base TextScriptBase
@orderAfter TextScriptBase
@author トリアコンタン

@help TextScriptBaseFormulaAttachment.js

公式プラグイン『TextScriptBase』の効果を
スキルやアイテムの計算式にも適用するアタッチメントです。

使用する場合は制御文字\tx[aaa]を使ってください。
\js[aaa]は原則として使用できません。

このプラグインの利用にはベースプラグイン『TextScriptBase.js』が必要です。
『TextScriptBase.js』は、RPGツクールMZのインストールフォルダ配下の
以下のフォルダに格納されています。
dlc/BasicResources/plugins/official

利用規約：
 作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 についても制限はありません。
 このプラグインはもうあなたのものです。
*/

(() => {
    'use strict';

    const _Game_Action_evalDamageFormula = Game_Action.prototype.evalDamageFormula;
    Game_Action.prototype.evalDamageFormula = function(target) {
        const item = this.item();
        const formula = item.damage.formula;
        item.damage.formula = PluginManagerEx.convertEscapeCharacters(formula);
        const result = _Game_Action_evalDamageFormula.apply(this, arguments);
        item.damage.formula = formula;
        return result;
    };
})();