/*=============================================================================
 SlipDeathCustomize.js
----------------------------------------------------------------------------
 (C)2022 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2022/11/22 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/SlipDeathCustomize.js
@plugindesc Slip Incapacitated Customization Plugin
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

SlipDeathCustomize.js

Allows you to control whether or not slip damage can be incapacitated
depending on the situation.
Determination is made in the following order: 1. 2. 3.

1. Control by Memo Field
Battlers with the following memo fields set in the database (※)
are allowed to be incapacitated by slip.
<SlipDeath:true>

Slip death is prohibited.
<SlipDeath:false>

※ Actor, Class, Weapon, Armor, State, Enemy Character

2. Control by In-Combat Status
If the "In-Combat Status" parameter is set,
slip death is permitted under that condition.

3. Default Settings
Determination is made according to the database setting for "Slip Damage
Incapacitated."

This plugin requires the base plugin "PluginCommonBase.js."
"PluginCommonBase.js" is located in the following folder
under the RPG Maker MZ installation folder.
dlc/BasicResources/plugins/official

Terms of Use:
You may modify and redistribute this plugin without permission from the
author, and there are no restrictions on its use (commercial, 18+, etc.).
This plugin is now yours.

@param battleCondition
@text Conditions for whether or not you are in combat
@desc You can control whether or not you are in combat by slipping.
@type select
@default none
@option Do not set
@value none
@option Permission to be unable to fight only when not in combat
@value noBattle
@option Permission to be unable to fight only during battle
@value battle
*/

/*:ja
@plugindesc スリップ戦闘不能カスタマイズプラグイン
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/SlipDeathCustomize.js
@base PluginCommonBase
@orderAfter PluginCommonBase
@author トリアコンタン

@param battleCondition
@text 戦闘中かどうかの条件
@desc スリップによる戦闘不能を戦闘中かどうかで制御できます。
@default none
@type select
@option 設定しない
@value none
@option 戦闘中以外のみ戦闘不能許可
@value noBattle
@option 戦闘中のみ戦闘不能許可
@value battle

@help SlipDeathCustomize.js

スリップダメージによる戦闘不能許可を状況に応じて制御できます。
下記の1. 2. 3.の順番で判定を行います。

1. メモ欄による制御
以下のメモ欄がデータベース(※)に設定されているバトラーは
スリップによる戦闘不能が許可されます。
<SlipDeath:true>

スリップによる戦闘不能が禁止されます。
<SlipDeath:false>

※ アクター、職業、武器、防具、ステート、敵キャラ

2. 戦闘中かどうかによる制御
パラメータ『戦闘中かどうかの条件』を設定している場合は、
その条件でスリップによる戦闘不能が許可されます。

3. デフォルト設定
データベース『スリップダメージで戦闘不能』の設定値にしたがい判定します。

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
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);

    const _Game_Battler_maxSlipDamage = Game_Battler.prototype.maxSlipDamage;
    Game_Battler.prototype.maxSlipDamage = function() {
        const result = _Game_Battler_maxSlipDamage.apply(this, arguments);
        const customResult = this.isSlipDeathCustomize();
        if (customResult !== undefined) {
            return customResult ? this.hp : Math.max(this.hp - 1, 0);
        } else {
            return result;
        }
    };

    Game_Battler.prototype.isSlipDeathCustomize = function() {
        const trait = this.traitObjects()
            .map(obj => PluginManagerEx.findMetaValue(obj, 'SlipDeath'))
            .find(value => value !== undefined);
        if (trait !== undefined) {
            return trait;
        } else if (param.battleCondition === 'noBattle') {
            return !$gameParty.inBattle();
        } else if (param.battleCondition === 'battle') {
            return $gameParty.inBattle();
        } else {
            return undefined;
        }
    };
})();