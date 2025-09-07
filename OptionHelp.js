/*=============================================================================
 OptionHelp.js
----------------------------------------------------------------------------
 (C)2024 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.1.0 2024/04/03 ヘルプの行数を変更できる機能を追加
 1.0.1 2024/03/27 シンボルの型をコンボボックスに変更
 1.0.0 2024/03/27 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/OptionHelp.js
@plugindesc Optional Help Plugin
@author Triacontane
@license MIT License

@help
English Help Translator: munokura
Please check the URL below for the latest version of the plugin.
URL https://triacontane.blogspot.com
-----

OptionHelp.js

Adds and displays a help window to the Options screen.

If you want to display help for items added by other plugins,
you will need to know the symbols of the added items.

The symbols for the default items are as follows:

alwaysDash: Always dash

commandRemember: Command remember

touchUI: Touch UI

bgmVolume: BGM volume

bgsVolume: BGS volume

meVolume: ME volume

seVolume: SE volume

The symbols for items added with the Optional Item Creation Plugin are as
follows:

Number1: Number item [1] (Replace the number with 2 or higher)

Boolean1: Switch item [1]

String1: String item [1]

Volume1: Volume item [1]

This plugin requires the base plugin "PluginCommonBase.js."
"PluginCommonBase.js" is located in the following folder
under the RPG Maker MZ installation folder.
dlc/BasicResources/plugins/official

Terms of Use:
You may modify and redistribute this plugin without permission from the
author, and there are no restrictions on its use (commercial, 18+, etc.).
This plugin is now yours.

@param helpList
@text Help List
@desc This is the list of help displayed on the options screen.
@type struct<Help>[]
@default ["{\"symbol\":\"alwaysDash\",\"description\":\"You will automatically dash without holding down the Shift key.\"}","{\"symbol\":\"commandRemember\",\"description\":\"It remembers the command input you select during battle.\"}","{\"symbol\":\"touchUI\",\"description\":\"Displays touch buttons on the menu screen.\"}","{\"symbol\":\"bgmVolume\",\"description\":\"Adjust the volume of the background music.\"}","{\"symbol\":\"bgsVolume\",\"description\":\"Adjusts the volume of the background music.\"}","{\"symbol\":\"meVolume\",\"description\":\"Adjust the volume of the ME.\"}","{\"symbol\":\"seVolume\",\"description\":\"Adjusts the volume of the SE.\"}"]

@param helpLines
@text Help Lines
@desc Number of lines in the help window. Specifying 0 will default to 2.
@type number
@default 0
*/

/*~struct~Help:
@param symbol
@desc The symbolic string for the help topic.
@type combo
@option alwaysDash
@option commandRemember
@option touchUI
@option bgmVolume
@option bgsVolume
@option meVolume
@option seVolume
@option Number1
@option Boolean1
@option String1
@option Volume1
@option reset

@param description
@text explanation
@desc A description of the help topic.
@type multiline_string
*/

/*:ja
@plugindesc オプションヘルププラグイン
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/OptionHelp.js
@base PluginCommonBase
@orderAfter PluginCommonBase
@author トリアコンタン

@param helpList
@text ヘルプリスト
@desc オプション画面で表示するヘルプのリストです。
@default ["{\"symbol\":\"alwaysDash\",\"description\":\"Shiftキーを押さなくても自動でダッシュします。\"}","{\"symbol\":\"commandRemember\",\"description\":\"戦闘中に選択したコマンドの入力内容を記憶します。\"}","{\"symbol\":\"touchUI\",\"description\":\"メニュー画面にタッチ用のボタンを表示します。\"}","{\"symbol\":\"bgmVolume\",\"description\":\"BGMの音量を調整します。\"}","{\"symbol\":\"bgsVolume\",\"description\":\"BGSの音量を調整します。\"}","{\"symbol\":\"meVolume\",\"description\":\"MEの音量を調整します。\"}","{\"symbol\":\"seVolume\",\"description\":\"SEの音量を調整します。\"}"]
@type struct<Help>[]

@param helpLines
@text ヘルプ行数
@desc ヘルプウィンドウの行数です。0を指定するとデフォルト値の2になります。
@default 0
@type number

@help OptionHelp.js

オプション画面にヘルプウィンドウを追加し表示できます。
他のプラグインによって追加された項目にヘルプを表示したい場合、
追加項目のシンボルを把握する必要があります。

デフォルト項目のシンボルは以下です。
alwaysDash : 常時ダッシュ
commandRemember : コマンド記憶
touchUI : タッチUI
bgmVolume : BGM音量
bgsVolume : BGS音量
meVolume : ME音量
seVolume : SE音量

オプション任意項目作成プラグインで追加した項目のシンボルは以下です。
Number1 : 数値項目[1] (2以降の場合は数値を2に置き換える)
Boolean1 : スイッチ項目[1]
String1 : 文字列項目[1]
Volume1 : 音量項目[1]


このプラグインの利用にはベースプラグイン『PluginCommonBase.js』が必要です。
『PluginCommonBase.js』は、RPGツクールMZのインストールフォルダ配下の
以下のフォルダに格納されています。
dlc/BasicResources/plugins/official

利用規約：
 作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 についても制限はありません。
 このプラグインはもうあなたのものです。
*/

/*~struct~Help:ja
@param symbol
@text シンボル
@desc ヘルプ項目のシンボル文字列です。
@default
@type combo
@option alwaysDash
@option commandRemember
@option touchUI
@option bgmVolume
@option bgsVolume
@option meVolume
@option seVolume
@option Number1
@option Boolean1
@option String1
@option Volume1
@option reset

@param description
@text 説明
@desc ヘルプ項目の説明です。
@default
@type multiline_string
*/

(() => {
    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);
    if (!param.helpList) {
        param.helpList = [];
    }

    const _Scene_Options_create = Scene_Options.prototype.create;
    Scene_Options.prototype.create = function() {
        _Scene_Options_create.apply(this, arguments);
        this.createHelpWindow();
        this._optionsWindow.setHelpWindow(this._helpWindow);
    };

    const _Scene_Options_helpAreaHeight = Scene_Options.prototype.helpAreaHeight;
    Scene_Options.prototype.helpAreaHeight = function() {
        const result = _Scene_Options_helpAreaHeight.apply(this, arguments);
        return param.helpLines > 0 ?this.calcWindowHeight(param.helpLines, false) : result;
    };

    const _Window_Options_updateHelp = Window_Options.prototype.updateHelp;
    Window_Options.prototype.updateHelp = function() {
        _Window_Options_updateHelp.apply(this, arguments);
        const description = param.helpList.find(item => item.symbol === this.commandSymbol(this.index()));
        this._helpWindow.setText(description ? description.description : '');
    };
})();