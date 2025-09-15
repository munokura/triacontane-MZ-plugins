//=============================================================================
// DestImageCustomize.js
// ----------------------------------------------------------------------------
// (C)2017 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.3.0 2025/04/08 独自画像を設定したとき、メニュー画面を開いて戻ったときに画像が初期化されてしまう問題を修正
// 1.2.0 2023/08/26 点滅速度のパラメータを追加
// 1.1.0 2021/08/05 MZ向けにリファクタリング
// 1.0.0 2017/02/24 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/DestImageCustomize.js
@plugindesc Destination Image Customization Plugin
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

Customize the destination image (the destination that appears when you click
on the map). You can change the color and opacity, or set your own image.

This plugin requires the base plugin "PluginCommonBase.js."
"PluginCommonBase.js" is located in the following folder under the RPG Maker
MZ installation folder:

dlc/BasicResources/plugins/official

Terms of Use:
You may modify and redistribute this plugin without permission, and there are
no restrictions on its use (commercial, R18+, etc.).
This plugin is now yours.

@param opacity
@text Opacity
@desc Opacity of the destination image. Set it to 0 to make it invisible.
@default 255

@param blinkSpeed
@text Blinking Rate
@desc The blinking speed. The lower the number, the faster the blinking. The default value is 20.
@type number
@default 0

@param blendMode
@text Synthesis method
@desc This is the method for compositing the destination image.
@type select
@default 1
@option usually
@value 0
@option Addition
@value 1
@option Multiplication
@value 2
@option screen
@value 3
@option Subtract
@value 28

@param color
@text Display color
@desc This is the display color of the destination image. If you set a custom image, this will be disabled. Select from the text color or enter CSS color information directly.
@type color
@default 0

@param originalImage
@text Original image
@desc You can specify your own image as the destination image (img/pictures).
@type file
@dir img/pictures/
*/

/*:ja
@plugindesc 目的地画像カスタマイズプラグイン
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/DestImageCustomize.js
@base PluginCommonBase
@orderAfter PluginCommonBase
@author トリアコンタン

@param opacity
@text 不透明度
@desc 目的地画像の不透明度です。0にすると見えなくなります。
@default 255

@param blinkSpeed
@text 点滅速度
@desc 点滅速度です。数字が小さいほど速くなります。デフォルト値は20です。
@default 0
@type number

@param blendMode
@text 合成方法
@desc 目的地画像の合成方法です。
@default 1
@type select
@option 通常
@value 0
@option 加算
@value 1
@option 乗算
@value 2
@option スクリーン
@value 3
@option 減算
@value 28

@param color
@text 表示色
@desc 目的地画像の表示色です。独自画像を設定した場合は無効です。テキストカラーから選択するか、CSS色情報を直接入力します。
@default 0
@type color

@param originalImage
@text 独自画像
@desc 目的地画像に独自の画像を指定できます。(img/pictures)
@default
@dir img/pictures/
@type file

@help 目的地画像（マップをクリックしたときの目的地）の表示内容を
カスタマイズします。色や不透明度を変更したり独自画像を設定したりできます。

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
    const param = PluginManagerEx.createParameter(script);

    const _Sprite_Destination_createBitmap = Sprite_Destination.prototype.createBitmap;
    Sprite_Destination.prototype.createBitmap = function() {
        _Sprite_Destination_createBitmap.apply(this, arguments);
        if (param.originalImage) {
            this.createOriginalBitmap();
        } else if (param.color) {
            const color = isFinite(param.color) ? ColorManager.textColor(param.color) : param.color;
            this.bitmap.fillAll(color);
        }
        this.blendMode = param.blendMode;
    };

    Sprite_Destination.prototype.createOriginalBitmap = function() {
        this.bitmap = ImageManager.loadPicture(param.originalImage);
    };

    const _Sprite_Destination_destroy = Sprite_Destination.prototype.destroy;
    Sprite_Destination.prototype.destroy = function(options) {
        if (param.originalImage && this.bitmap) {
            Sprite.prototype.destroy.call(this, options);
        } else {
            _Sprite_Destination_destroy.apply(this, arguments);
        }
    };

    const _Sprite_Destination_updateAnimation = Sprite_Destination.prototype.updateAnimation;
    Sprite_Destination.prototype.updateAnimation = function() {
        if (param.blinkSpeed > 0) {
            this._frameCount++;
            this._frameCount %= param.blinkSpeed;
            this.opacity = (param.blinkSpeed - this._frameCount) * 6;
            this.scale.x = 1 + this._frameCount / param.blinkSpeed;
            this.scale.y = this.scale.x;
        } else {
            _Sprite_Destination_updateAnimation.apply(this, arguments);
        }
        this.opacity *= (param.opacity / 255);
    };
})();