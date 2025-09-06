//=============================================================================
// TraitConditions.js
// ----------------------------------------------------------------------------
// (C)2016 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.3.1 2023/10/15 スクリプトを指定する場合の注意事項をヘルプに記載
// 1.3.0 2023/03/07 MZで動作するよう修正
// 1.2.2 2018/04/03 ヘルプの記載が誤っていたので、ヘルプに合わせて実装を修正
// 1.2.1 2018/03/29 処理の軽量化
// 1.2.0 2017/04/23 ランダム要素を簡単に扱える関数を追加
// 1.1.2 2017/01/12 メモ欄の値が空で設定された場合にエラーが発生するかもしれない問題を修正
// 1.1.0 2016/06/15 スクリプト「data」で対象のオブジェクトを参照できる機能を追加
//                  スクリプト評価時にエラーになった場合に異常終了しないよう修正
// 1.0.1 2016/05/25 スクリプトに「>」「<」を使えるように修正
// 1.0.0 2016/05/18 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/TraitConditions.js
@plugindesc Feature Condition Application Plugin
@author Triacontane
@license MIT License

@help
English Help Translator: munokura
Please check the URL below for the latest version of the plugin.
URL https://triacontane.blogspot.com
-----

TraitConditions.js

Set application conditions for each trait.
Traits that do not meet the conditions will be disabled.
Enter the following in the database memo field to describe the traits.

<TC1 Switch: 10> // When switch [10] is ON, the first trait is enabled.
<TC1 State: 4> // When state [4] is enabled, the first trait is enabled.
<TC1 Script: JS Expression> // When [Expression] evaluates to true, the first
trait is enabled.

By writing "data" in a script,
you can reference the target actor or enemy object.
A certain level of scripting knowledge is required to use this effectively.

Also, the ">" symbol cannot be used in scripts.
(It will be interpreted as a closing tag.)
Instead, replace it with an expression using "<".

Also, specifying scripts may affect performance depending on the combination
with other plugins.
We recommend minimizing their use.

Example 1: This is only enabled if the target is the actor with ID [1].
<TC1 Script: data.isActor() && data.actorId() === 1>

The second and subsequent features can be set in the same way.

This plugin requires the base plugin "PluginCommonBase.js."
"PluginCommonBase.js" is located in the following folder under the RPG Maker
MZ installation folder:

dlc/BasicResources/plugins/official

Terms of Use:
You may modify and redistribute this plugin without permission from the
author, and there are no restrictions on its use (commercial, R18+, etc.).
This plugin is now yours.
*/

/*:ja
@plugindesc 特徴の条件適用プラグイン
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/TraitConditions.js
@base PluginCommonBase
@orderAfter PluginCommonBase
@author トリアコンタン

@help TraitConditions.js

特徴のひとつひとつに適用条件を設定します。
条件を満たさない特徴は無効になります。
特徴を記述するデータベースのメモ欄に以下の通り入力してください。

<TC1スイッチ:10>     // スイッチ[10]がONの場合、1番目の特徴が有効になる
<TC1ステート:4>      // ステート[4]が有効な場合、1番目の特徴が有効になる
<TC1スクリプト:JS式> // [式]の評価結果がtrueの場合、1番目の特徴が有効になる

スクリプト中で「data」と記述すると
対象のアクター・エネミーオブジェクトを参照できます。
使いこなすにはスクリプトに関する一定の知識が必要です。

また、スクリプト中では記号「>」は使用できません。
(閉じタグとして解釈されるため)
代わりに「<」を使用した式に置き換えてください。

またスクリプトの指定は、他プラグインとの組み合わせによっては
パフォーマンスに影響を及ぼす可能性があります。
使用は最小限に留めることを推奨します。

例1:対象がID[1]のアクターの場合のみ有効になります。
<TC1スクリプト:data.isActor() && data.actorId() === 1>

2番目以降の特徴も同様に設定可能です。

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

    //=============================================================================
    // Game_BattlerBase
    //  特徴に条件を設定します。
    //=============================================================================
    Game_BattlerBase.prototype.allTraits = function() {
        return this.traitObjects().reduce(function(r, obj) {
            for (let i = 0, n = obj.traits.length; i < n; i++) {
                if (this.isValidTrait(i, obj)) r.push(obj.traits[i]);
            }
            return r;
        }.bind(this), []);
    };

    Game_BattlerBase.prototype.isValidTrait = function(i, obj) {
        const id = 'TC' + String(i + 1);
        if (!this.isValidTraitSwitch(id , obj)) {
            return false;
        }
        if (!this.isValidTraitState(id , obj)) {
            return false;
        }
        if (!this.isValidTraitScript(id , obj)) {
            return false;
        }
        return true;
    };

    Game_BattlerBase.prototype.isValidTraitSwitch = function(id, obj) {
        const metaValue = PluginManagerEx.findMetaValue(obj, [id + 'スイッチ', id + 'Switch']);
        if (!metaValue) return true;
        return $gameSwitches.value(metaValue);
    };

    Game_BattlerBase.prototype.isValidTraitState = function(id, obj) {
        const metaValue = PluginManagerEx.findMetaValue(obj, [id + 'ステート', id + 'State']);
        if (!metaValue) return true;
        return this.isStateAffected(metaValue);
    };

    Game_BattlerBase.prototype.isValidTraitScript = function(id, obj) {
        if (this._calcScript) {
            return false;
        }
        const metaValue = PluginManagerEx.findMetaValue(obj, [id + 'スクリプト', id + 'Script']);
        if (!metaValue) {
            return true;
        }
        this._calcScript = true;
        const data = this;
        const result = eval(metaValue);
        this._calcScript = false;
        return result;
    };
})();