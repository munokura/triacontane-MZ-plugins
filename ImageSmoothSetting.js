//=============================================================================
// ImageSmoothSetting.js
// ----------------------------------------------------------------------------
// (C)2017 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 2.2.1 2024/12/04 視差ゼロ遠景用の設定がオブジェクトキャラクターにも適用されていた問題を修正
// 2.2.0 2022/10/07 視差ゼロ遠景に個別のぼかし設定ができる機能を追加
// 2.1.0 2021/03/10 システム画像に対するぼかし設定を追加
// 2.0.0 2021/01/23 MZで動作するよう修正
// 1.1.0 2017/06/24 テキストなど動的画像のぼかし設定を追加
// 1.0.0 2017/02/24 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/ImageSmoothSetting.js
@plugindesc Image Blur Individual Settings Plug-in
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

You can set whether to apply a "blur" (Scale Mode: LINEAR) when enlarging an
image for each image type.

Without blurring, images will appear clearly, but dots will be visible.

Also, if blurring is enabled, such as with character or system images,
if sprite sheets or multiple parts are combined into a single image,
and the borders of the parts are not transparent,
applying blurring may cause artifacts to appear at the edges of the image.

By default, all images in RPG Maker MZ are blurred.

Terms of Use:
You may modify and redistribute this plugin without permission from the
author, and there are no restrictions on its use (commercial, R18+, etc.).

This plugin is now yours.

@param BattleBack
@text Battle Background
@desc Blurs the battle background images (Battle Background 1, Battle Background 2).
@type boolean
@default true

@param Battler
@text Butler
@desc Blurs the battler images (actors, enemy characters).
@type boolean
@default true

@param Face
@text Face
@desc Blurs the face image.
@type boolean
@default true

@param Parallax
@text distant view
@desc Blurs the background image.
@type boolean
@default true

@param ZeroParallax
@text Zero parallax distant view
@desc Blurs a distant image with zero parallax.
@type boolean
@default true

@param Picture
@text Picture
@desc Blurs the picture image.
@type boolean
@default true

@param Title
@text title
@desc Blurs the title images (Title Image 1, Title Image 2).
@type boolean
@default true

@param Character
@text character
@desc Blurs the character image.
@type boolean
@default true

@param System
@text system
@desc Blurs the system image.
@type boolean
@default true

@param DynamicImage
@text Dynamic Images
@desc Blurs dynamically created images such as window text.
@type boolean
@default true
*/

/*:ja
@plugindesc 画像ぼかし個別設定プラグイン
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/ImageSmoothSetting.js
@base PluginCommonBase
@author トリアコンタン

@param BattleBack
@text 戦闘背景
@desc 戦闘背景画像(戦闘背景1、戦闘背景2)にぼかしをかけます。
@default true
@type boolean

@param Battler
@text バトラー
@desc バトラー画像(アクター、敵キャラ)にぼかしをかけます。
@default true
@type boolean

@param Face
@text フェイス
@desc フェイス画像にぼかしをかけます。
@default true
@type boolean

@param Parallax
@text 遠景
@desc 遠景画像にぼかしをかけます。
@default true
@type boolean

@param ZeroParallax
@text 視差ゼロ遠景
@desc 視差ゼロの遠景画像にぼかしをかけます。
@default true
@type boolean

@param Picture
@text ピクチャ
@desc ピクチャ画像にぼかしをかけます。
@default true
@type boolean

@param Title
@text タイトル
@desc タイトル画像(タイトル画像1、タイトル画像2)にぼかしをかけます。
@default true
@type boolean

@param Character
@text キャラクター
@desc キャラクター画像にぼかしをかけます。
@default true
@type boolean

@param System
@text システム
@desc システム画像にぼかしをかけます。
@default true
@type boolean

@param DynamicImage
@text 動的画像
@desc ウィンドウの文字など動的に作成した画像にぼかしをかけます。
@default true
@type boolean

@help 画像を拡大したときに「ぼかし」(Scale Mode:LINEAR)を入れて
表示するかどうかを画像種別ごとに設定できます。
「ぼかし」処理を行わないとくっきり映りますが、ドットが見えます。

また「ぼかし」が有効の場合、キャラクター画像やシステム画像のように
スプライトシートや複数のパーツをひとつの画像にまとめていて、
かつパーツの境界付近が透過色でない場合、
ぼかしを入れることで画像の端にゴミのようなものが表示される場合があります。

RPGツクールMZのデフォルトでは全ての画像に「ぼかし」が入ります。

利用規約：
 作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 についても制限はありません。
 このプラグインはもうあなたのものです。
*/

(function() {
    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);

    //=============================================================================
    // ImageManager
    //  画像種別ごとにぼかしを個別設定可能にします。
    //=============================================================================
    ImageManager._smoothMap = {
        'img/battlebacks1/': param.BattleBack,
        'img/battlebacks2/': param.BattleBack,
        'img/enemies/'     : param.Battler,
        'img/characters/'  : param.Character,
        'img/faces/'       : param.Face,
        'img/parallaxes/'  : param.Parallax,
        'img/pictures/'    : param.Picture,
        'img/sv_actors/'   : param.Battler,
        'img/sv_enemies/'  : param.Battler,
        'img/titles1/'     : param.Title,
        'img/titles2/'     : param.Title,
        'img/system/'      : param.System,
    };

    const _ImageManager_loadBitmap = ImageManager.loadBitmap;
    ImageManager.loadBitmap      = function(folder, filename) {
        const bitmap = _ImageManager_loadBitmap.apply(this, arguments);
        if (this._smoothMap.hasOwnProperty(folder)) {
            if (this.isZeroParallax(filename) && folder === 'img/parallaxes/') {
                bitmap.smooth = param.ZeroParallax;
            } else {
                bitmap.smooth = this._smoothMap[folder];
            }
        }
        return bitmap;
    };

    //=============================================================================
    // Bitmap
    //  動的作成画像にぼかしを設定可能にします。
    //=============================================================================
    const _Bitmap_initialize      = Bitmap.prototype.initialize;
    Bitmap.prototype.initialize = function(width, height) {
        _Bitmap_initialize.apply(this, arguments);
        this.smooth = param.DynamicImage;
    };
})();