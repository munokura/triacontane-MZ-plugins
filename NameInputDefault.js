/*=============================================================================
 NameInputDefault.js
----------------------------------------------------------------------------
 (C)2024 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.3.0 2024/06/29 名前入力NGプラグインで指定したNG文字列を候補から除外する機能を追加
 1.2.0 2024/03/24 デフォルト名の候補アクターをタグで指定できる機能を追加
 1.1.0 2024/03/19 初期値を適用するボタンを選択できる機能を追加
 1.0.0 2024/02/27 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/NameInputDefault.js
@plugindesc Name input default name setting plugin
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

NameInputDefault.js

You can set a default name for the actor on the name input screen.
If you leave the name field blank, the default name will be applied.
You can also select a name randomly from multiple options.

This plugin requires the base plugin "PluginCommonBase.js."
"PluginCommonBase.js" is located in the following folder under the RPG Maker
MZ installation folder:
dlc/BasicResources/plugins/official

Terms of Use:
You may modify and redistribute this plugin without permission, and there are
no restrictions on its use (commercial, 18+, etc.).
This plugin is now yours.

@param nameList
@text Name List
@desc The default list of names.
@type struct<Name>[]
@default []

@param defaultEmpty
@text Set initial value to empty
@desc The initial value on the name input screen will be left blank regardless of the actor name.
@type boolean
@default false

@param defaultButton
@text Apply default value button
@desc When you press the specified button, the default name will be applied.
@type select
@option shift
@option control
@option tab

@param ngFilter
@text NG filter
@desc The NG strings specified by the separately released "Name Input NG Plugin" will be excluded from the candidates.
@type boolean
@default false
*/

/*~struct~Name:
@param actorId
@text Actor ID
@desc The ID of the actor to set the name for. If 0 is specified, all actors will be candidates.
@type actor
@default 0

@param actorTag
@text Actor Tags
@desc This is the memotag of the actor whose name you want to set. If you specify "aaa", actors with "<aaa>" in the memo field will be candidates.

@param name
@text name
@desc The default name of the actor.
*/

/*:ja
@plugindesc 名前入力のデフォルト名設定プラグイン
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/NameInputDefault.js
@base PluginCommonBase
@orderAfter PluginCommonBase
@author トリアコンタン

@param nameList
@text 名前リスト
@desc 名前のデフォルト候補リストです。
@default []
@type struct<Name>[]

@param defaultEmpty
@text 初期値を空にする
@desc 名前入力画面の初期値をアクター名に拘わらず空欄にします。
@default false
@type boolean

@param defaultButton
@text 初期値適用ボタン
@desc 指定したボタンを押下するとデフォルト名称が適用されます。
@default
@type select
@option
@option shift
@option control
@option tab

@param ngFilter
@text NGフィルター
@desc 別途公開している『名前入力NGプラグイン』で指定されたNG文字列を候補から除外します。
@default false
@type boolean

@help NameInputDefault.js

名前入力画面でアクターのデフォルト名を設定できます。
名称を空欄のまま決定しようとすると、デフォルト名が適用されます。
複数の候補の中からランダムで選出することも可能です。

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

@param actorId
@text アクターID
@desc 名前を設定するアクターのIDです。0を指定した場合、全てのアクターで候補になります。
@default 0
@type actor

@param actorTag
@text アクタータグ
@desc 名前を設定するアクターのメモタグです。aaaと指定するとメモ欄に<aaa>と記載されたアクターが候補になります。
@default

@param name
@text 名称
@desc アクターのデフォルト名称です。
@default
*/

(() => {
    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);

    const _Window_NameEdit_setup = Window_NameEdit.prototype.setup;
    Window_NameEdit.prototype.setup = function(actor, maxLength) {
        _Window_NameEdit_setup.apply(this, arguments);
        if (param.defaultEmpty) {
            this._name = '';
            this._index = 0;
        }
    };

    const _Window_NameEdit_restoreDefault = Window_NameEdit.prototype.restoreDefault;
    Window_NameEdit.prototype.restoreDefault = function() {
        const names = param.nameList.filter(data => this.isDefaultNameTargetActor(data));
        if (names.length > 0) {
            this._defaultName = names[Math.randomInt(names.length)].name;
        }
        return _Window_NameEdit_restoreDefault.apply(this, arguments);
    };

    Window_NameEdit.prototype.isDefaultNameTargetActor = function(data) {
        if (!data.actorId && !data.actorTag) {
            return true;
        }
        if (param.ngFilter && this.isNgName && this.isNgName(data.name)) {
            return false;
        }
        return data.actorId === this._actor.actorId() ||
            PluginManagerEx.findMetaValue(this._actor.actor(), data.actorTag);
    };

    const _Window_NameInput_processHandling = Window_NameInput.prototype.processHandling;
    Window_NameInput.prototype.processHandling = function() {
        _Window_NameInput_processHandling.apply(this, arguments);
        if (param.defaultButton && Input.isTriggered(param.defaultButton)) {
            this._editWindow.restoreDefault();
            this.processJump();
            this.playCursorSound();
        }
    };
})();