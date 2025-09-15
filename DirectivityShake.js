//=============================================================================
// DirectivityShake.js
// ----------------------------------------------------------------------------
// (C)2016 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.2.0 2022/01/08 ランダムシェイクするコマンドを追加
// 1.1.1 2021/07/10 SINカーブで始点が0でなくなる問題を修正
// 1.1.0 2021/01/10 MZで動作するよう修正
// 1.0.0 2016/11/03 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/DirectivityShake.js
@plugindesc Directional Shake Plugin
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

You can now make the "Screen Shake" event command directional.
You can specify an angle to vibrate vertically or diagonally.

You can also set the vibration method to a sinusoidal curve, rather than the
standard vibration, for a unique accent.

Execute the plugin command immediately before executing the "Screen Shake"
command.
The settings will automatically reset once the shake ends.

This plugin requires the base plugin "PluginCommonBase.js."
"PluginCommonBase.js" is located in the following folder under the RPG Maker
MZ installation folder:
dlc/BasicResources/plugins/official

Terms of Use:
You may modify and redistribute this plugin without permission, and there are
no restrictions on its use (commercial, R18+, etc.).
This plugin is now yours.

@command SHAKE_SETTING
@text Shake Orientation Settings
@desc Set the direction and SIN curve for the "Shake Screen" command.
@arg rotation
@text angle
@desc Shake at the specified angle (0-360).
@type number
@default 0
@min 0
@max 360
@arg sinWave
@text Sinusoidal curve
@desc When enabled, the vibration will follow a SIN curve.
@type boolean
@default false

@command RANDOM_SHAKE_SETTING
@text Random Shake Settings
@desc Randomizes the angle of the "Shake Screen" command.
@arg sinWave
@text Sinusoidal curve
@desc When enabled, the vibration will follow a SIN curve.
@type boolean
@default false
@arg interval
@text Update interval
@desc The interval at which the angle is updated during shaking. If you specify 0, it will not be updated.
@type number
@default 1
*/

/*:ja
@plugindesc 指向性シェイクプラグイン
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/DirectivityShake.js
@base PluginCommonBase
@orderAfter PluginCommonBase
@author トリアコンタン

@command SHAKE_SETTING
@text シェイク指向設定
@desc 「画面のシェイク」コマンドに方向やSINカーブを設定します。

@arg rotation
@text 角度
@desc 指定した角度でシェイクします。(0-360)
@default 0
@type number
@min 0
@max 360

@arg sinWave
@text SINカーブ
@desc 有効にすると振動がSINカーブを描くようになります。
@default false
@type boolean

@command RANDOM_SHAKE_SETTING
@text ランダムシェイク設定
@desc 「画面のシェイク」コマンドの角度をランダムにします。

@arg sinWave
@text SINカーブ
@desc 有効にすると振動がSINカーブを描くようになります。
@default false
@type boolean

@arg interval
@text 更新間隔
@desc シェイク中に角度が更新される間隔です。0を指定すると更新されなくなります。
@default 1
@type number

@help イベントコマンド「画面のシェイク」に指向性を持たせることができます。
角度を指定して縦や斜めに振動させることが可能です。

また振動方法を通常の方法以外にsinカーブに設定できます。独特の抑揚がつきます。

「画面のシェイク」を行う直前に、プラグインコマンドを実行してください。
シェイクが終了すると設定は自動でリセットされます。

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

    PluginManagerEx.registerCommand(script, 'SHAKE_SETTING', args => {
        $gameScreen.setShakeRotation(args.rotation, args.sinWave);
    });

    PluginManagerEx.registerCommand(script, 'RANDOM_SHAKE_SETTING', args => {
        $gameScreen.setShakeRandom(args.interval, args.sinWave);
    });

    //=============================================================================
    // Game_Screen
    //  シェイクの方向を保持します。
    //=============================================================================
    Game_Screen.prototype.getShakeRotation = function() {
        return this._shakeRotation;
    };

    Game_Screen.prototype.setShakeRotation = function(value, sin) {
        this._shakeRotation = value * Math.PI / 180;
        this._shakeSinWave = sin;
        this._shakeRandomInterval = 0;
    };

    Game_Screen.prototype.setShakeRandom = function(interval, sin) {
        this._shakeRotation = Math.randomInt(360) * Math.PI / 180;
        this._shakeSinWave = sin;
        this._shakeRandomInterval = interval;
    };

    const _Game_Screen_clearShake = Game_Screen.prototype.clearShake;
    Game_Screen.prototype.clearShake = function() {
        _Game_Screen_clearShake.apply(this, arguments);
        this.clearDirectivityShake();
    };

    Game_Screen.prototype.clearDirectivityShake = function() {
        this._shakeRotation = 0;
        this._shakeSinWave  = false;
    };

    const _Game_Screen_updateShake = Game_Screen.prototype.updateShake;
    Game_Screen.prototype.updateShake = function() {
        const wasShake = this.isNeedShakeUpdate();
        if (this._shakeRandomInterval > 0 && Graphics.frameCount % this._shakeRandomInterval === 0) {
            this._shakeRotation = Math.randomInt(360) * Math.PI / 180;
        }
        if (this._shakeSinWave && wasShake) {
            this.updateSinShake();
        } else {
            _Game_Screen_updateShake.apply(this, arguments);
        }
        if (wasShake && !this.isNeedShakeUpdate()) {
            this.clearDirectivityShake();
        }
    };

    const _Game_Screen_startShake = Game_Screen.prototype.startShake;
    Game_Screen.prototype.startShake = function(power, speed, duration) {
        _Game_Screen_startShake.apply(this, arguments);
        this._shakeDurationTarget = duration;
    };

    Game_Screen.prototype.updateSinShake = function() {
        const pos = this._shakeDurationTarget - this._shakeDuration;
        this._shake = Math.sin(3 * pos * this._shakeSpeed * Math.PI / 180) * this._shakePower * 3;
        this._shakeDuration--;
        if (this._shakeDuration === 0) {
            this._lastShake = this._shake;
        }
        if (this._lastShake * this._shake < 0) {
            this._shake = 0;
            this._lastShake = 0;
        }
    };

    Game_Screen.prototype.isNeedShakeUpdate = function() {
        return this._shakeDuration > 0 || this._shake !== 0;
    };

    //=============================================================================
    // Spriteset_Base
    //  シェイクの方向を反映します。
    //=============================================================================
    const _Spriteset_Base_updatePosition = Spriteset_Base.prototype.updatePosition;
    Spriteset_Base.prototype.updatePosition = function() {
        _Spriteset_Base_updatePosition.apply(this, arguments);
        const shakeRotation  = $gameScreen.getShakeRotation();
        if (shakeRotation) {
            const shakeDistance = Math.round($gameScreen.shake());
            this.x -= shakeDistance;
            this.x += Math.cos(shakeRotation) * shakeDistance;
            this.y += Math.sin(shakeRotation) * shakeDistance;
        }
    };
})();