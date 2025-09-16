/*=============================================================================
 ColorFadeOut.js
----------------------------------------------------------------------------
 (C)2023 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.1 2023/05/20 カラーフェードを指定しているとき、画面のフラッシュが機能しなくなる問題を修正
 1.0.0 2023/05/05 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/ColorFadeOut.js
@plugindesc Color Fade Out Plugin
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

ColorFadeOut.js

This plugin allows you to specify a color for the "Screen Fade In" and "Screen
Fade Out" event commands.

Please specify and clear the fade color in the plugin command before executing
the existing event command.

This plugin requires the base plugin "PluginCommonBase.js."
"PluginCommonBase.js" is located in the following folder under the RPG Maker
MZ installation folder:

dlc/BasicResources/plugins/official

Terms of Use:
You may modify and redistribute this plugin without permission from the
author, and there are no restrictions on its use (commercial, R18+, etc.).

This plugin is now yours.

@command SET_FADE_COLOR
@text Fade Color Settings
@desc Sets the fade color.
@arg red
@text red
@desc The red component of the fade out.
@type number
@default 0
@min 0
@max 255
@arg green
@text green
@desc The green component of the fade out.
@type number
@default 0
@min 0
@max 255
@arg blue
@text blue
@desc The blue component of the fade out.
@type number
@default 0
@min 0
@max 255

@command CLEAR_FADE_COLOR
@text Cancel Fade Color
@desc Removes faded color.
*/

/*:ja
@plugindesc カラーフェードアウトプラグイン
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/ColorFadeOut.js
@base PluginCommonBase
@orderAfter PluginCommonBase
@author トリアコンタン

@command SET_FADE_COLOR
@text フェードカラー設定
@desc フェードカラーを設定します。

@arg red
@text 赤
@desc フェードアウトの赤色成分です。
@default 0
@type number
@min 0
@max 255

@arg green
@text 緑
@desc フェードアウトの緑色成分です。
@default 0
@type number
@min 0
@max 255

@arg blue
@text 青
@desc フェードアウトの青色成分です。
@default 0
@type number
@min 0
@max 255

@command CLEAR_FADE_COLOR
@text フェードカラー解除
@desc フェードカラーを解除します。

@help ColorFadeOut.js

イベントコマンドの「画面のフェードイン」「画面のフェードアウト」の際に
色を指定できるようになります。
プラグインコマンドでフェードカラーを指定、解除してから
既存のイベントコマンドを実行してください。

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

    PluginManagerEx.registerCommand(script, 'SET_FADE_COLOR', args => {
        $gameScreen.setFadeColor(args.red, args.green, args.blue);
    });

    PluginManagerEx.registerCommand(script, 'CLEAR_FADE_COLOR', args => {
        $gameScreen.clearFadeColor();
    });

    Game_Screen.prototype.setFadeColor = function(red, blue, green) {
        this._fadeColor = [red, blue, green, 0];
    };

    Game_Screen.prototype.clearFadeColor = function() {
        this._fadeColor = null;
    };

    Game_Screen.prototype.isColorFade = function() {
        return !!this._fadeColor && this._fadeColor[3] > 0;
    };

    Game_Screen.prototype.fadeColor = function() {
        return this._fadeColor;
    };

    const _Game_Screen_updateFadeOut = Game_Screen.prototype.updateFadeOut;
    Game_Screen.prototype.updateFadeOut = function() {
        _Game_Screen_updateFadeOut.apply(this, arguments);
        if (this._fadeColor) {
            this._fadeColor[3] = 255 - this._brightness;
        }
    };

    const _Game_Screen_updateFadeIn = Game_Screen.prototype.updateFadeIn;
    Game_Screen.prototype.updateFadeIn = function() {
        _Game_Screen_updateFadeIn.apply(this, arguments);
        if (this._fadeColor) {
            this._fadeColor[3] = 255 - this._brightness;
        }
    };

    const _Spriteset_Base_updateOverallFilters = Spriteset_Base.prototype.updateOverallFilters;
    Spriteset_Base.prototype.updateOverallFilters = function() {
        if ($gameScreen.isColorFade()) {
            const filter = this._overallColorFilter;
            filter.setBlendColor($gameScreen.fadeColor());
            filter.setBrightness(255);
        } else {
            _Spriteset_Base_updateOverallFilters.apply(this, arguments);
        }
    };
})();