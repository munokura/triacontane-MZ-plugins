/*=============================================================================
 BackgroundBase.js
----------------------------------------------------------------------------
 (C)2023 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.1.1 2024/01/04 画像の暗号化機能への非対応をヘルプに明記
 1.1.0 2023/12/10 複数の背景を条件によって使い分けられる機能を追加
 1.0.0 2023/12/07 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/BackgroundBase.js
@plugindesc Back Area Image Plugin
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

BackgroundBase.js

You can specify a background image that will be displayed off-screen instead
of a black background when the window is resized or in full screen mode.

This plugin does not support image encryption.

The base plugin "PluginCommonBase.js" is required to use this plugin.
"PluginCommonBase.js" is located in the following folder under the RPG Maker
MZ installation folder:

dlc/BasicResources/plugins/official

Terms of Use:
You may modify and redistribute this plugin without permission from the
author, and there are no restrictions on its use (commercial, R18+, etc.).
This plugin is now yours.

@param backgroundImage
@text background image
@desc The image file to display in the background.
@type file
@dir img/parallaxes

@param backgroundList
@text Background List
@desc This is an image file to be displayed in the background. It is useful when you want to use multiple files depending on the conditions.
@type struct<Background>[]
@default []

@param method
@text Repeat display method
@desc How to display the background image.
@type select
@default repeat
@option Loop Display
@value repeat
@option Fit to screen size
@value cover
@option Do nothing
@value none
*/

/*~struct~Background:
@param backgroundImage
@text background image
@desc The image file to display in the background.
@type file
@dir img/parallaxes

@param switchId
@text Switch ID
@desc The background image will be displayed only when the specified switch is ON.
@type switch
@default 0
*/

/*:ja
@plugindesc バックエリア画像プラグイン
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/BackgroundBase.js
@base PluginCommonBase
@orderAfter PluginCommonBase
@author トリアコンタン

@param backgroundImage
@text 背景画像
@desc 背景に表示する画像ファイルです。
@default
@type file
@dir img/parallaxes

@param backgroundList
@text 背景リスト
@desc 背景に表示する画像ファイルです。条件によって複数のファイルを使い分けたいときに利用します。
@default []
@type struct<Background>[]

@param method
@text 繰り返し表示方法
@desc 背景画像の表示方法です。
@default repeat
@type select
@option ループ表示
@value repeat
@option 画面サイズに合わせる
@value cover
@option 何もしない
@value none

@help BackgroundBase.js

ウィンドウサイズを変えたり、全画面にしたときに
黒塗りの代わりに画面外に表示される背景画像を指定できます。

本プラグインは画像の暗号化機能には対応していません。

このプラグインの利用にはベースプラグイン『PluginCommonBase.js』が必要です。
『PluginCommonBase.js』は、RPGツクールMZのインストールフォルダ配下の
以下のフォルダに格納されています。
dlc/BasicResources/plugins/official

利用規約：
 作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 についても制限はありません。
 このプラグインはもうあなたのものです。
*/

/*~struct~Background:ja
@param backgroundImage
@text 背景画像
@desc 背景に表示する画像ファイルです。
@default
@type file
@dir img/parallaxes

@param switchId
@text スイッチID
@desc 指定したスイッチがONのときのみ背景画像を表示します。
@default 0
@type switch
*/

(() => {
    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);
    if (!param.backgroundList) {
        param.backgroundList = [];
    }

    const _Scene_Boot_start = Scene_Boot.prototype.start;
    Scene_Boot.prototype.start = function() {
        _Scene_Boot_start.apply(this, arguments);
        Graphics.updateBackAreaImage();
    };

    const _Scene_Base_update = Scene_Base.prototype.update;
    Scene_Base.prototype.update = function() {
        _Scene_Base_update.apply(this, arguments);
        if (this.isActive() && Graphics.frameCount % 10 === 0) {
            Graphics.updateBackAreaImage();
        }
    };

    Graphics.updateBackAreaImage = function() {
        const back = param.backgroundList.find(item => item.switchId === 0 || $gameSwitches.value(item.switchId));
        if (back) {
            this.setBackAreaImage(back.backgroundImage);
        } else {
            this.setBackAreaImage(param.backgroundImage);
        }
    };

    Graphics.setBackAreaImage = function(fileName) {
        const style = this._back.style;
        if (!fileName) {
            style.backgroundImage = "";
            return;
        }
        style.backgroundImage = `url(img/parallaxes/${fileName}.png)`;
        switch (param.method) {
            case 'repeat':
                style.backgroundRepeat = "repeat";
                break;
            case 'cover':
                style.backgroundRepeat = "no-repeat";
                style.backgroundPosition = "center";
                style.backgroundSize = "cover";
                break;
            case 'none':
                style.backgroundRepeat = "no-repeat";
                style.backgroundSize = "auto";
                break;
        }
    };

    const _Graphics__createAllElements = Graphics._createAllElements;
    Graphics._createAllElements = function() {
        _Graphics__createAllElements.apply(this, arguments);
        this.createBackArea();
    };

    const _Graphics__updateAllElements = Graphics._updateAllElements;
    Graphics._updateAllElements = function() {
        _Graphics__updateAllElements.apply(this, arguments);
        this.updateBackArea();
    };

    Graphics.createBackArea = function() {
        this._back = document.createElement("div");
        this._back.id = "backArea";
        this.updateBackArea();
        document.body.appendChild(this._back);
    };

    Graphics.updateBackArea = function() {
        this._back.width = '100%';
        this._back.height = '100%';
        this._back.style.zIndex = 0;
        this._centerElement(this._back);
    };
})();