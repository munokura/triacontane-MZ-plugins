/*=============================================================================
 NameInputNg.js
----------------------------------------------------------------------------
 (C)2024 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2024/06/29 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/NameInputNg.js
@plugindesc Name input NG plugin
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

NameInputNg.js

Specifies the strings that cannot be entered on the name input screen.
Control characters \V[n] and \N[n] can also be set.

This plugin requires the base plugin "PluginCommonBase.js."
"PluginCommonBase.js" is located in the following folder under the RPG Maker
MZ installation folder:
dlc/BasicResources/plugins/official

Terms of Use:
You may modify and redistribute this plugin without permission, and there are
no restrictions on its use (commercial, 18+, etc.).
This plugin is now yours.

@param ngNames
@text Forbidden Name List
@desc This is a list of name strings that will be rejected when entered.
@type struct<Name>[]
@default []

@param partialMatch
@text partial match
@desc When enabled, partial matches to actor names will be rejected.
@type boolean
@default false
*/

/*~struct~Name:
@param name
@text name
@desc The name string that will be rejected. Control characters can be used.
@type string

@param disabledSwitch
@text Disable Switch
@desc The specified string will be NG only when the specified switch is ON. If you specify 0, it will always be NG.
@type switch
@default 0
*/

/*:ja
@plugindesc 名前入力NGプラグイン
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/NameInputNg.js
@base PluginCommonBase
@orderAfter PluginCommonBase
@author トリアコンタン

@param ngNames
@text NG名前リスト
@desc 名前入力NGにする名前文字列のリストです。
@default []
@type struct<Name>[]

@param partialMatch
@text 部分一致
@desc 有効にするとアクター名に対する部分一致でNG判定を行います。
@default false
@type boolean

@help NameInputNg.js

名前入力画面で入力できない文字列を設定します。
制御文字\V[n]や\N[n]も設定できます。

このプラグインの利用にはベースプラグイン『PluginCommonBase.js』が必要です。
『PluginCommonBase.js』は、RPGツクールMZのインストールフォルダ配下の
以下のフォルダに格納されています。
dlc/BasicResources/plugins/official

利用規約：
 作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 についても制限はありません。
 このプラグインはもうあなたのものです。
*/

/*~struct~Name:ja
@param name
@text 名前
@desc 入力NGにする名前文字列です。制御文字が使えます。
@default
@type string

@param disabledSwitch
@text 無効スイッチ
@desc 指定したスイッチがONのときだけ指定文字列がNGになります。0を指定すると常にNGになります。
@default 0
@type switch
*/

(() => {
    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);

    const _Window_NameInput_onNameOk = Window_NameInput.prototype.onNameOk;
    Window_NameInput.prototype.onNameOk = function() {
        if (this._editWindow.isNgName()) {
            SoundManager.playBuzzer();
            return;
        }
        _Window_NameInput_onNameOk.apply(this, arguments);
    };

    Window_NameEdit.prototype.isNgName = function(name = this._name) {
        return this.findNgNames().some(ngName => {
            ngName = PluginManagerEx.convertEscapeCharacters(ngName);
            return param.partialMatch ? name.includes(ngName) : name === ngName
        });
    };

    Window_NameEdit.prototype.findNgNames = function() {
        return param.ngNames.filter(data => data.disabledSwitch === 0 || $gameSwitches.value(data.disabledSwitch))
            .map(data => data.name);
    };
})();