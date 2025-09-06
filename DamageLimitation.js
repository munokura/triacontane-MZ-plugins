/*=============================================================================
 DamageLimitation.js
----------------------------------------------------------------------------
 (C)2023 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2023/08/23 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/DamageLimitation.js
@plugindesc Damage limit setting plugin
@author Triacontane
@license MIT License

@help
English Help Translator: munokura
Please check the URL below for the latest version of the plugin.
URL https://triacontane.blogspot.com
-----

DamageLimitation.js

Sets limits on damage dealt and damage received.
Enter the following in the memo field for the actor, enemy character, state,
equipment, or job.

<MaxInflicted:9999> # Sets the damage dealt limit to 9999
<Max Damage Dealt:9999> # Same as above
<MaxReceived:9999> # Sets the damage received limit to 9999
<Max Damage Received:9999> # Same as above

This plugin requires the base plugin "PluginCommonBase.js."
"PluginCommonBase.js" is located in the following folder under the RPG Maker
MZ installation folder:

dlc/BasicResources/plugins/official

Terms of Use:
You may modify and redistribute this plugin without permission, and there are
no restrictions on its use (commercial, 18+, etc.).
This plugin is now yours.
*/

/*:ja
@plugindesc ダメージ上限設定プラグイン
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/DamageLimitation.js
@base PluginCommonBase
@orderAfter PluginCommonBase
@author トリアコンタン

@help DamageLimitation.js

与えるダメージ、受けるダメージに上限を設けます。
アクター、敵キャラ、ステート、装備、職業のメモ欄に以下を入力します。

<MaxInflicted:9999> # 与えるダメージの上限を9999に設定
<最大与ダメージ:9999>  # 同上
<MaxReceived:9999>  # 受けるダメージの上限を9999に設定
<最大被ダメージ:9999>  # 同上

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

    const _Game_Action_makeDamageValue = Game_Action.prototype.makeDamageValue;
    Game_Action.prototype.makeDamageValue = function(target, critical) {
        const damage = _Game_Action_makeDamageValue.apply(this, arguments);
        return this.applyDamageLimitation(target, damage);
    };

    Game_Action.prototype.applyDamageLimitation = function(target, damage) {
        const inflictedLimit = this.subject().findDamageLimitationMeta(['MaxInflicted', '最大与ダメージ']);
        const receivedLimit = target.findDamageLimitationMeta(['MaxReceived', '最大被ダメージ']);
        return Math.min(damage, inflictedLimit, receivedLimit);
    };

    Game_BattlerBase.prototype.findDamageLimitationMeta = function(nameList) {
        return this.traitObjects()
            .map(object => PluginManagerEx.findMetaValue(object, nameList) || Infinity)
            .sort((a, b) => a - b)
            .shift();
    };
})();