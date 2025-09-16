/*=============================================================================
 TitleHelp.js
----------------------------------------------------------------------------
 (C)2024 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2024/11/24 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/TitleHelp.js
@plugindesc Title Help Plug-in
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

TitleHelp.js

A help window can be displayed on the title screen.
Help text for each command can be displayed by specifying a symbol.
If the symbol can be specified, it can be used for commands added by plug-ins.

newGame : New Game
continue : continue
options : options
The following are commands added by plug-ins.
nameGame2_0 : Another New Game (1st)
nameGame2_1 : another new game (second)
shutdown : Game shutdown
soundTest : sound test

To adjust the appearance of help, you can use "Window Background Image
Plug-in".

The base plugin "PluginCommonBase.js" is required to use this plugin.
PluginCommonBase.js" is stored in the following folder under the RPG Tool MZ
installation folder.
under the RPG Tool MZ installation folder.
dlc/BasicResources/plugins/official

Terms of Use:
You may modify and redistribute the software without permission of the author.
There are no restrictions on the type of use (commercial, 18-content use,
etc.).
This plugin is now yours.

@param descriptionList
@text help list
@desc Here is a list of help for each command. Check the symbols for any commands added by the plug-in.
@type struct<TitleHelp>[]
@default []

@param helpWindowX
@text Help Window X Coordinate
@desc X coordinate of the help window.
@type number
@default 0

@param helpWindowY
@text Help Window Y Coordinate
@desc Y coordinate of the help window.
@type number
@default 0

@param helpWindowLines
@text Help Window Lines
@desc The number of lines in the help window.
@type number
@default 1

@param helpButton
@text help button
@desc This button displays the help window. If not specified, it is always displayed.
@type combo
@option cancel
@option shift
@option control
@option tab
@option pageup
@option pagedown
@option menu

@param helpButtonTrigger
@text help button trigger
@desc Triggers a button to display a help window.
@type select
@default toggle
@option switching (to)
@value toggle
@option (something) held in one's pressed hands
@value press
*/

/*~struct~TitleHelp:
@param symbol
@text symbol
@desc A symbol that is unique for each command.
@type combo
@option newGame
@option continue
@option options
@option nameGame2_0
@option nameGame2_1
@option shutdown
@option soundTest

@param description
@text Description.
@desc Command Description.
@type multiline_string

@param enableOnly
@text Displayed only when available
@desc Help is displayed only if the command is selectable.
@type boolean
@default false

@param disableOnly
@text Displayed only when not selectable
@desc Help is displayed only if the command is not selectable.
@type boolean
@default false
*/

/*:ja
@plugindesc タイトルヘルププラグイン
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/TitleHelp.js
@base PluginCommonBase
@orderAfter PluginCommonBase
@author トリアコンタン

@param descriptionList
@text ヘルプリスト
@desc コマンドごとのヘルプ一覧です。プラグインで追加されたコマンドがある場合はシンボルを確認してください。
@default []
@type struct<TitleHelp>[]

@param helpWindowX
@text ヘルプウィンドウX座標
@desc ヘルプウィンドウのX座標です。
@default 0
@type number

@param helpWindowY
@text ヘルプウィンドウY座標
@desc ヘルプウィンドウのY座標です。
@default 0
@type number

@param helpWindowLines
@text ヘルプウィンドウ行数
@desc ヘルプウィンドウの行数です。
@default 1
@type number

@param helpButton
@text ヘルプボタン
@desc ヘルプウィンドウを表示するボタンです。指定しない場合、常に表示されます。
@default
@type combo
@option cancel
@option shift
@option control
@option tab
@option pageup
@option pagedown
@option menu

@param helpButtonTrigger
@text ヘルプボタントリガー
@desc ヘルプウィンドウを表示するボタンのトリガーです。
@default toggle
@type select
@option 切り替え
@value toggle
@option 押し続け
@value press

@help TitleHelp.js

タイトル画面にヘルプウィンドウを表示できます。
シンボルを指定することでコマンドごとのヘルプテキストを表示できます。
シンボルが特定できれば、プラグインで追加されたコマンドにも対応できます。

newGame : ニューゲーム
continue : コンティニュー
options : オプション
以下はプラグインで追加されるコマンドです。
nameGame2_0 : アナザーニューゲーム(1番目)
nameGame2_1 : アナザーニューゲーム(2番目)
shutdown : ゲーム終了
soundTest : サウンドテスト

ヘルプの外観の調整は「ウィンドウ背景画像指定プラグイン」などが使えます。

このプラグインの利用にはベースプラグイン『PluginCommonBase.js』が必要です。
『PluginCommonBase.js』は、RPGツクールMZのインストールフォルダ配下の
以下のフォルダに格納されています。
dlc/BasicResources/plugins/official

利用規約：
 作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 についても制限はありません。
 このプラグインはもうあなたのものです。
*/

/*~struct~TitleHelp:ja
@param symbol
@text シンボル
@desc コマンドごとに一意になるシンボルです。
@default
@type combo
@option newGame
@option continue
@option options
@option nameGame2_0
@option nameGame2_1
@option shutdown
@option soundTest

@param description
@text 説明
@desc コマンドの説明文です。
@default
@type multiline_string

@param enableOnly
@text 選択可能時のみ表示
@desc コマンドが選択可能な場合のみヘルプを表示します。
@default false
@type boolean

@param disableOnly
@text 選択不可時のみ表示
@desc コマンドが選択不可な場合のみヘルプを表示します。
@default false
@type boolean
*/

(() => {
    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);

    const _Scene_Title_create = Scene_Title.prototype.create;
    Scene_Title.prototype.create = function() {
        _Scene_Title_create.apply(this, arguments);
        this.createHelpWindow();
        this._commandWindow.setHelpWindow(this._helpWindow);
    };

    Scene_Title.prototype.createHelpWindow = function() {
        const rect = this.helpWindowRect();
        this._helpWindow = new Window_TitleHelp(rect);
        this.addWindow(this._helpWindow);
    };

    Scene_Title.prototype.helpWindowRect = function() {
        const ww = Graphics.boxWidth;
        const wh = this.calcWindowHeight(param.helpWindowLines || 1, false);
        const wx = param.helpWindowX || 0;
        const wy = param.helpWindowY || 0;
        return new Rectangle(wx, wy, ww, wh);
    };

    Window_TitleCommand.prototype.updateHelp = function() {
        const help = this.findHelpDescription();
        this._helpWindow.setText(help ? help.description : '');
    };

    Window_TitleCommand.prototype.findHelpDescription = function() {
        const symbol = this.currentSymbol();
        const enable = this.isCurrentItemEnabled();
        return param.descriptionList.find(data => {
            return data.symbol === symbol && !(data.enableOnly && !enable || data.disableOnly && enable);
        });
    };

    class Window_TitleHelp extends Window_Help {
        constructor(rect) {
            super(rect);
            this.hide();
            this.update();
        }

        update() {
            super.update();
            this.updateHelpButton(param.helpButton);
        }

        updateHelpButton(button) {
            if (this.isHelpVisible(button)) {
                this.show();
            } else {
                this.hide();
            }
        }

        isHelpVisible(button) {
            if (!button) {
                return true;
            }
            if (param.helpButtonTrigger === 'toggle') {
                return Input.isTriggered(button) ? !this.visible : this.visible;
            } else {
                return Input.isPressed(button);
            }
        }
    }
    window.Window_TitleHelp = Window_TitleHelp;
})();