/*=============================================================================
 ScreenAdjustForAspect.js
----------------------------------------------------------------------------
 (C)2025 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2025/03/16 初版
----------------------------------------------------------------------------
 [X]      : https://x.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/ScreenAdjustForAspect.js
@plugindesc Aspect ratio consideration plugin for window reduction
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

ScreenAdjustForAspect.js

When the screen size specified by the game exceeds the display's available
area,
it shrinks the window while maintaining the aspect ratio.

This plugin requires the base plugin "PluginCommonBase.js."
"PluginCommonBase.js" is located in the following folder
in the RPG Maker MZ installation folder:
dlc/BasicResources/plugins/official

Terms of Use:
You may modify and redistribute this plugin without permission from the
author, and there are no restrictions on its use (commercial, R18+, etc.).
This plugin is now yours.
*/

/*:ja
@plugindesc ウィンドウ縮小のアスペクト比考慮プラグイン
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/ScreenAdjustForAspect.js
@base PluginCommonBase
@orderAfter PluginCommonBase
@author トリアコンタン

@help ScreenAdjustForAspect.js

ゲーム側で指定した画面サイズがディスプレイの表示可能領域サイズを超えるとき
アスペクト比を保った状態でウィンドウを縮小します。

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

    Scene_Boot.prototype.adjustWindow = function() {
        if (!Utils.isNwjs()) {
            return;
        }
        const scale = this.screenScale();
        const xScale = window.innerWidth / Graphics.width * scale;
        const yScale = window.innerHeight / Graphics.height * scale;
        const minScale = Math.min(xScale, yScale);
        if (minScale < 1) {
            const gameWindow = nw.Window.get();
            const winWidth = Math.floor(Graphics.width * minScale);
            const winHeight = Math.floor(Graphics.height * minScale);
            const deltaX = Math.floor((window.innerWidth - winWidth) / 2);
            const deltaY = Math.floor((window.innerHeight - winHeight) / 2);
            gameWindow.moveBy(deltaX, deltaY);
            gameWindow.resizeTo(winWidth, winHeight);
        }
    };
})();