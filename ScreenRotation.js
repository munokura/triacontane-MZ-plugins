//=============================================================================
// ScreenRotation.js
// ----------------------------------------------------------------------------
// (C)2017 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.1.1 2024/09/20 対象角度に負の値を設定できるよう修正
// 1.1.0 2024/05/09 MZ対応版を作成
// 1.0.0 2017/01/08 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/ScreenRotation.js
@plugindesc Screen rotation plugin
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

ScreenRotation.js

This plugin rotates the entire map screen.

Execute it via the plugin command.

Note that while rotating the screen, window contents such as message and
option displays may not display correctly.

Also, character graphics outside the screen will be temporarily hidden during
rotation.

Terms of Use:
You may modify and redistribute this plugin without permission from the
author, and there are no restrictions on its use (commercial, R18+, etc.).

This plugin is now yours.

@command startRotation
@text Screen rotation
@desc Rotate the screen.
@arg speed
@text Speed
@desc Rotation speed. Positive value rotates clockwise, negative value rotates counterclockwise. Specifying 0 will reset.
@type number
@default 1
@min -20
@max 20
@arg angle
@text Target Angle
@desc The angle after rotation. If omitted, the rotation will continue infinitely. If you set a negative value for the speed, you should generally set a negative value for the angle as well.
@type number
@min -3600
@max 3600

@command stopRotation
@text Stop screen rotation
@desc Stops screen rotation.

@command startZoom
@text Screen zoom
@desc Change the display magnification of the screen and zoom in and out.
@arg scale
@text Magnification
@desc Magnification ratio. 100 is actual size.
@type number
@default 100
@min 1
@arg duration
@text time
@desc The time it takes to change the magnification. If you specify 0, the magnification will change immediately.
@type number
@default 60
@arg x
@text X coordinate
@desc The X coordinate of the reference point for enlargement. If left blank, it will be set to the center of the screen.
@type number
@arg y
@text Y coordinate
@desc The Y coordinate that will be the reference point for enlargement. If left blank, it will be set to the center of the screen.
@type number
*/

/*:ja
@plugindesc 画面回転プラグイン
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/ScreenRotation.js
@base PluginCommonBase
@orderAfter PluginCommonBase
@author トリアコンタン

@command startRotation
@text 画面の回転
@desc 画面を回転させます。

@arg speed
@text 速さ
@desc 回転速度です。正の値で右回り、負の値で左回りします。0を指定するとリセットされます。
@default 1
@type number
@min -20
@max 20

@arg angle
@text 対象角度
@desc 回転後の角度です。省略すると無限に回転を続けます。速さに負の値を設定した場合、角度も原則として負の値を設定してください。
@default
@type number
@min -3600
@max 3600

@command stopRotation
@text 画面の回転停止
@desc 画面の回転を停止します。

@command startZoom
@text 画面のズーム
@desc 画面の表示倍率を変更し、拡大縮小します。

@arg scale
@text 拡大率
@desc 拡大率です。100で等倍です。
@default 100
@type number
@min 1

@arg duration
@text 時間
@desc 倍率変更にかかる時間です。0を指定すると即座に拡大率が変更されます。
@default 60
@type number

@arg x
@text X座標
@desc 拡大の基準点となるX座標です。未入力の場合、画面の中心になります。
@default
@type number

@arg y
@text Y座標
@desc 拡大の基準点となるY座標です。未入力の場合、画面の中心になります。
@default
@type number

@help ScreenRotation.js

マップ画面全体を回転させる演出ができます。
プラグインコマンドから実行してください。

なお、画面を回転中はメッセージ表示や選択肢表示などのウィンドウの中身が
正常に表示されない場合があります。
また、回転時は、画面外のキャラクターグラフィックを一時的に非表示にします。

利用規約：
 作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 についても制限はありません。
 このプラグインはもうあなたのものです。
*/

(()=> {
    'use strict';
    const script = document.currentScript;

    PluginManagerEx.registerCommand(script, 'startRotation', args => {
        const angle = args.angle === '' ? null : args.angle;
        $gameScreen.startRotation(args.speed / 2, angle);
    });

    PluginManagerEx.registerCommand(script, 'stopRotation', args => {
        $gameScreen.stopRotation();
    });

    PluginManagerEx.registerCommand(script, 'startZoom', args => {
        const x = args.x === '' ? Graphics.width / 2 : args.x;
        const y = args.y === '' ? Graphics.height / 2 : args.y;
        if (args.duration > 0) {
            $gameScreen.startZoom(x, y, args.scale / 100, args.duration);
        } else {
            $gameScreen.setZoom(x, y, args.scale / 100);
        }
    });

    //=============================================================================
    // Game_Map
    //  指定した座標が画面内かどうかを返します。
    //=============================================================================
    Game_Map.prototype.isInnerScreenPosition = function(x, y) {
        const ax = this.adjustX(x);
        const ay = this.adjustY(y);
        return ax >= -1 && ay >= -1 && ax < this.screenTileX() + 1 && ay < this.screenTileY() + 1;
    };

    //=============================================================================
    // Game_CharacterBase
    //  指定した座標が画面内かどうかを返します。
    //=============================================================================
    Game_CharacterBase.prototype.hideIfOuterScreen = function() {
        this._hiddenOuterScreen = !$gameMap.isInnerScreenPosition(this.x, this.y);
    };

    Game_CharacterBase.prototype.showIfOuterScreen = function() {
        this._hiddenOuterScreen = false;
    };

    const _Game_CharacterBase_isTransparent    = Game_CharacterBase.prototype.isTransparent;
    Game_CharacterBase.prototype.isTransparent = function() {
        return _Game_CharacterBase_isTransparent.apply(this, arguments) || this._hiddenOuterScreen;
    };

    //=============================================================================
    // Game_Screen
    //  画面を回転させます。
    //=============================================================================
    const _Game_Screen_clear    = Game_Screen.prototype.clear;
    Game_Screen.prototype.clear = function() {
        _Game_Screen_clear.apply(this, arguments);
        this.clearRotation();
    };

    Game_Screen.prototype.clearRotation = function() {
        this._angle         = undefined;
        this._rotationSpeed = 0;
        this._angleTarget   = 0;
    };

    Game_Screen.prototype.setAngle = function(angle) {
        this._angle         = angle || 0;
        this._rotationSpeed = 0;
        this._angleTarget   = 0;
        this.updateCharacterHide();
        this.stopRotation();
    };

    Game_Screen.prototype.startRotation = function(speed, angleTarget) {
        if (speed === 0) {
            this.setAngle(angleTarget);
            return;
        }
        this._rotationSpeed = speed;
        this._angle         = this._angle || 0;
        if (angleTarget === null) {
            this._angleTarget = (speed > 0 ? Infinity : -Infinity);
        } else {
            this._angleTarget = angleTarget;
        }
    };

    const _Game_Screen_onBattleStart = Game_Screen.prototype.onBattleStart;
    Game_Screen.prototype.onBattleStart = function() {
        _Game_Screen_onBattleStart.apply(this, arguments);
        this.clearRotation();
    };

    const _Game_Screen_update    = Game_Screen.prototype.update;
    Game_Screen.prototype.update = function() {
        _Game_Screen_update.apply(this, arguments);
        this.updateRotation();
    };

    Game_Screen.prototype.updateRotation = function() {
        if (this._rotationSpeed !== 0) {
            this._angle += this._rotationSpeed;
            if (this.isNeedStopRotation()) {
                this._angle = this._angleTarget;
                this.stopRotation();
            }
        }
        if (this._angle !== undefined) {
            SceneManager.rotateScene(this._angle);
            this.updateCharacterHide();
        }
    };

    Game_Screen.prototype.isNeedStopRotation = function() {
        return (this._angle >= this._angleTarget && this._rotationSpeed > 0) ||
            (this._angle <= this._angleTarget && this._rotationSpeed < 0);
    };

    Game_Screen.prototype.updateCharacterHide = function() {
        if (this.isValidRotation()) {
            this.iterateAllCharacters(Game_CharacterBase.prototype.hideIfOuterScreen);
            this._hideCharacterIfOuterScreen = true;
        } else if (this._hideCharacterIfOuterScreen) {
            this.iterateAllCharacters(Game_CharacterBase.prototype.showIfOuterScreen);
            this._hideCharacterIfOuterScreen = false;
        }
    };

    Game_Screen.prototype.iterateAllCharacters = function(callBackFund, args) {
        const characters = $gameMap.events().concat($gamePlayer);
        characters.forEach(function(character) {
            callBackFund.apply(character, args);
        });
    };

    Game_Screen.prototype.stopRotation = function() {
        this._rotationSpeed = 0;
        if (this._angle === 0) {
            this._angle = undefined;
            SceneManager.rotateScene(0);
        }
    };

    Game_Screen.prototype.isValidRotation = function() {
        return this._angle % 180 !== 0;
    };

    //=============================================================================
    // SceneManager
    //  画面の回転処理を実装します。
    //=============================================================================
    SceneManager.rotateScene = function(angle) {
        const radian = angle * Math.PI / 180;
        this._scene.rotate(radian, Graphics.width / 2, Graphics.height / 2);
    };

    //=============================================================================
    // Scene_Base
    //  画面の回転処理を実装します。
    //=============================================================================
    Scene_Base.prototype.rotate = function(radian, ox, oy) {
        if (this.rotation === radian) {
            return;
        }
        const sin     = Math.sin(-radian);
        const cos     = Math.cos(-radian);
        this.rotation = radian;
        this.x        = Math.floor(ox * -cos + oy * -sin) + ox;
        this.y        = Math.floor(ox * sin + oy * -cos) + oy;
    };
})();