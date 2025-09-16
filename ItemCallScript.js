/*=============================================================================
 ItemCallScript.js
----------------------------------------------------------------------------
 (C)2018 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.1.0 2021/11/14 MZで動作するようリファクタリング
 1.0.0 2018/09/16 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/ItemCallScript.js
@plugindesc Script Call Item Plugin
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

ItemCallScript.js

You can create items and skills that execute a script when used.
JavaScript knowledge is required to use this plugin. Specify the following in
the memo field:
<SCRIPT: (script to execute)>

Setting the effect range to all allies or all enemies will execute the script
for all targets.

The following variables and functions can be used in scripts:
user: Item user
target: Item target
v(n): Gets the value of variable [n]
sv(n, m): Sets variable [n] to value [m]
s(n): Gets the value of switch [n]
ss(n, m): Sets switch [n] to value [m]

This plugin requires the base plugin "PluginCommonBase.js."
"PluginCommonBase.js" is located in the following folder under the RPG Maker
MZ installation folder.
dlc/BasicResources/plugins/official

Terms of Use:
You may modify and redistribute this plugin without permission from the
author, and there are no restrictions on its use (commercial, 18+, etc.).
This plugin is now yours.

@param scriptTagName
@text Script tag name
@desc The name of the tag that retrieves the script. Change this if there is a conflict with other plugins.
@default SCRIPT
*/

/*:ja
@plugindesc スクリプト呼び出しアイテムプラグイン
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/ItemCallScript.js
@base PluginCommonBase
@orderAfter PluginCommonBase
@author トリアコンタン

@param scriptTagName
@text スクリプトタグ名称
@desc スクリプトを取得するタグの名称です。他プラグインとの競合がある場合などに変更します。
@default SCRIPT

@help ItemCallScript.js

使用したときに任意のスクリプトを実行するアイテム、スキルを作成できます。
活用にはJavaScriptの知識が必要です。メモ欄に以下の通り指定します。
<SCRIPT:（実行したいスクリプト）>

効果範囲を味方全体、敵全体にすると対象の全員分だけスクリプトが実行されます。

スクリプト中では以下の変数、関数が使用できます。
user     : アイテムの使用者
target   : アイテムの対象
v(n)     : 変数[n]の値を取得
sv(n, m) : 変数[n]に値[m]を設定
s(n)     : スイッチ[n]の値を取得
ss(n, m) : スイッチ[n]に値[m]を設定

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

    const _Game_Action_applyItemUserEffect = Game_Action.prototype.applyItemUserEffect;
    Game_Action.prototype.applyItemUserEffect = function(target) {
        _Game_Action_applyItemUserEffect.apply(this, arguments);
        this.applyItemScript(target);
    };

    const _Game_Action_applyGlobal = Game_Action.prototype.applyGlobal;
    Game_Action.prototype.applyGlobal = function() {
        _Game_Action_applyGlobal.apply(this, arguments);
        if (this.isForNone()) {
            this.applyItemScript(null);
        }
    };

    Game_Action.prototype.isForNone = function() {
        return this.checkItemScope([0]);
    };

    const _Game_Action_testApply = Game_Action.prototype.testApply;
    Game_Action.prototype.testApply = function(target) {
        return _Game_Action_testApply.apply(this, arguments) || !!this.getItemScript();
    };

    Game_Action.prototype.applyItemScript = function(target) {
        const script = this.getItemScript();
        const user = this.subject();
        if (script) {
            const v = $gameVariables.value.bind($gameVariables);
            const sv = $gameVariables.setValue.bind($gameVariables);
            const s = $gameSwitches.value.bind($gameSwitches);
            const ss = $gameSwitches.setValue.bind($gameSwitches);
            eval(script);
        }
    };

    Game_Action.prototype.getItemScript = function() {
        return PluginManagerEx.findMetaValue(this.item(), param.scriptTagName || 'SCRIPT');
    };
})();