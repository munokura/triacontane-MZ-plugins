//=============================================================================
// ParallaxLayerMap.js
// ----------------------------------------------------------------------------
// (C) 2017 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.3.2 2023/12/24 簡易的な競合対策
// 1.3.1 2023/09/08 不透明度の0指定が無効になる問題を修正
// 1.3.0 2023/05/14 キャラクターグラフィック表示拡張プラグインと連携可能なように修正
// 1.2.0 2022/11/23 レイヤーマップのプライオリティを細かく9段階で指定できる機能を追加
// 1.1.9 2022/03/23 MZ向けにリファクタリング
// 1.1.8 2020/04/20 EventEffects.jsとの競合を解消
// 1.1.7 2020/08/30 YEP_CoreEngine.jsと併用したとき解像度次第でレイヤーマップのピクセルがずれる場合がある競合を修正
// 1.1.6 2020/08/21 英語版のヘルプ作成
// 1.1.5 2020/08/21 MZ向けにヘルプ修正
// 1.1.4 2020/07/05 MOG_ChronoEngine.jsと併用したときマップの一部がちらつく場合がある競合を修正
// 1.1.3 2020/05/09 競合対策コードを追加
// 1.1.2 2018/12/22 HalfMove.jsによる減速斜め移動など特定の条件下でマップの描画位置がずれる場合がある現象を修正
// 1.1.1 2017/11/19 MOG_ChronoEngine.js等との競合を解消
// 1.1.0 2017/09/20 ヘルプにサンプルマップの旨を記載
// 1.1.0 2017/09/14 合成方法や不透明度の初期値を設定できるメモ欄を追加
// 1.0.0 2017/08/20 初版
// 0.9.0 2017/08/19 プロトタイプ版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/ParallaxLayerMap.js
@plugindesc Multi-layer single image map plugin
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

ParallaxLayerMap.js

Allows you to create multi-layered, single-image maps using multiple layers.
Layers are created by events, so the number of layers is unlimited.

Create an event and fill in the memo field as shown below. The specified image
will
be displayed on the map, and the top left corner of the image will be aligned
with the top left corner of the map, regardless of the event location.

<PLM:file> # Displays "img/parallaxes/file" as a single image.
<PLM_Blend:1> # Sets the default blending method to "Additive."
<PLM Blend:1> # Same as above
<PLM_Opacity:128> # Sets the default opacity to "128."
<PLM Opacity:128> # Same as above
<PLM_Z:1> # Sets the display priority to "1." (※1)

※1 The standard priority settings are as follows, but you can specify a range
from 1 to 9 for more precise settings.
1: Below the normal character
3: Same as the normal character
5: Above the normal character

The "Image" and "Options" options within the event will be ignored, but all
other options
will function the same as normal events.

If you want to change the blending method, opacity, etc. later, specify them
during autonomous movement or
use the "Character Graphics Display Extension Plugin" below.
https://raw.githubusercontent.com/triacontane/RPGMakerMV/master/CharacterGraphicExtend.js

Script (run from "Movement Route Settings")
this.shiftPosition(10, 20); # Shifts the display position by X[10] and Y[20].

Note!
This plugin does not support map loops.

The base plugin "PluginCommonBase.js" is required to use this plugin.
"PluginCommonBase.js" is located in the following folder
under the RPG Maker MZ installation folder.
dlc/BasicResources/plugins/official

Drapika kindly provided us with a sample map that can be used with this
plugin.
We would like to take this opportunity to express our gratitude.

You can download it by clicking the "Download" button at the following URL.
You are free to use it without crediting us.
https://github.com/triacontane/RPGMakerMV/blob/master/Sample/sample_parallax.zip

PIKA's GAME GALLERY
https://mashimarohb252d6.wixsite.com/pikasgame

Terms of Use:
You may modify and redistribute this plugin without permission, and there are
no restrictions on its use (commercial, 18+, etc.).
This plugin is now yours.
*/

/*:ja
@plugindesc 多層レイヤー一枚絵マッププラグイン
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/ParallaxLayerMap.js
@base PluginCommonBase
@orderAfter PluginCommonBase
@author トリアコンタン

@help ParallaxLayerMap.js

複数のレイヤーを使った多層一枚絵マップを作成可能にします。
イベントでレイヤーを作成するので、レイヤー数は無制限です。

イベントを作成してメモ欄を以下の通り記述すると、指定した画像が
マップに表示され、かつイベント位置とは無関係に画像の左上が
マップの左上に合わせられます。

<PLM:file>        # 「img/parallaxes/file」を一枚絵として表示します。
<PLM_Blend:1>     # 合成方法の初期値を「加算」にします。
<PLM合成:1>       # 同上
<PLM_Opacity:128> # 不透明度の初期値を「128」にします。
<PLM不透明度:128> # 同上
<PLM_Z:1>        # 表示優先度を「1」にします。(※1)

※1 通常のプライオリティ設定は以下ですが、より細かく指定した場合に
1～9の範囲内で指定できます。
1:通常キャラの下
3:通常キャラと同じ
5:通常キャラの上

イベント内の「画像」「オプション」項目は無視されますが、その他の項目は
通常のイベントと同じように機能します。

合成方法や不透明度などを後から変更したい場合は、自律移動で指定するか
以下の「キャラクターグラフィック表示拡張プラグイン」と併用してください。
https://raw.githubusercontent.com/triacontane/RPGMakerMV/master/CharacterGraphicExtend.js

スクリプト（「移動ルートの設定」から実行）
this.shiftPosition(10, 20); # 表示位置をX[10] Y[20]ずらします。

注意！
当プラグインはマップのループには対応していません。

このプラグインの利用にはベースプラグイン『PluginCommonBase.js』が必要です。
『PluginCommonBase.js』は、RPGツクールMZのインストールフォルダ配下の
以下のフォルダに格納されています。
dlc/BasicResources/plugins/official

当プラグインで使用できるサンプルマップをどらぴか様よりご提供いただきました。
この場を借りて御礼申し上げます。

以下のURLから「Download」ボタンでダウンロードできます。
クレジット表記なしでご自由にお使い頂けるご許可を頂いています。
https://github.com/triacontane/RPGMakerMV/blob/master/Sample/sample_parallax.zip

PIKA's GAME GALLERY
https://mashimarohb252d6.wixsite.com/pikasgame

利用規約：
 作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 についても制限はありません。
 このプラグインはもうあなたのものです。

@noteParam PLM
@noteRequire 1
@noteDir img/parallaxes
@noteType file
@noteData events
*/

(()=> {
    'use strict';

    //=============================================================================
    // Game_Map
    //  画面上のピクセル座標を返します。
    //=============================================================================
    Game_Map.prototype.displayPixelX = function() {
        return this._displayX * this.tileWidth();
    };

    Game_Map.prototype.displayPixelY = function() {
        return this._displayY * this.tileHeight();
    };

    //=============================================================================
    // Game_Character
    //  マップレイヤー名を取得します。
    //=============================================================================
    Game_CharacterBase.prototype.getMapLayerName = function() {
        return this._mapLayerName;
    };

    Game_CharacterBase.prototype.isMapLayer = function() {
        return !!this._mapLayerName;
    };

    const _Game_CharacterBase_isNearTheScreen = Game_CharacterBase.prototype.isNearTheScreen;
    Game_CharacterBase.prototype.isNearTheScreen = function() {
        return this.isMapLayer() || _Game_CharacterBase_isNearTheScreen.apply(this, arguments);
    };

    Game_CharacterBase.prototype.shiftPosition = function(x, y) {
        this._additionalX = x;
        this._additionalY = y;
    };

    Game_CharacterBase.prototype.existPage = function() {
        return false;
    };

    //=============================================================================
    // Game_Event
    //  レイヤーイベントに関する機能を実装します。
    //=============================================================================
    const _Game_Event_initialize      = Game_Event.prototype.initialize;
    Game_Event.prototype.initialize = function(mapId, eventId) {
        _Game_Event_initialize.apply(this, arguments);
        this._mapLayerName = PluginManagerEx.findMetaValue(this.getOriginalEvent(), ['PLM']) || null;
        if (this._mapLayerName) {
            this.initBlendMode();
            this.initOpacity();
            this.initZ();
        }
    };

    Game_Event.prototype.initBlendMode = function() {
        const blendMode = PluginManagerEx.findMetaValue(this.getOriginalEvent(), ['PLM_Blend', 'PLM合成']);
        if (blendMode !== undefined) {
            this._blendMode = parseInt(blendMode);
        }
    };

    Game_Event.prototype.initOpacity = function() {
        const opacity = PluginManagerEx.findMetaValue(this.getOriginalEvent(), ['PLM_Opacity', 'PLM不透明度']);
        if (opacity !== undefined) {
            this._opacity = parseInt(opacity);
        }
    };

    Game_Event.prototype.initZ = function() {
        const z = PluginManagerEx.findMetaValue(this.getOriginalEvent(), 'PLM_Z');
        if (z) {
            this._layerZ = parseInt(z);
        }
    };

    // Resolve conflict for TemplateEvent
    Game_Event.prototype.getOriginalEvent = function() {
        return $dataMap.events[this._eventId];
    };

    Game_Event.prototype.existPage = function() {
        return this._pageIndex >= 0;
    };

    Game_Event.prototype.getLayerX = function() {
        return (this._additionalX || 0) - Math.round($gameMap.displayPixelX());
    };

    Game_Event.prototype.getLayerY = function() {
        return (this._additionalY || 0) - Math.round($gameMap.displayPixelY());
    };

    Game_Event.prototype.getLayerZ = function() {
        return this._layerZ || this.screenZ();
    };

    //=============================================================================
    // Spriteset_Map
    //  キャラクタースプライトをマップレイヤースプライトに差し替えます。
    //=============================================================================
    const _Spriteset_Map_createCharacters      = Spriteset_Map.prototype.createCharacters;
    Spriteset_Map.prototype.createCharacters = function() {
        _Spriteset_Map_createCharacters.apply(this, arguments);
        const layerSprites = this._characterSprites.filter(function(sprite) {
            return sprite.isLayer && sprite.isLayer();
        });
        layerSprites.forEach(function(oldSprite) {
            this.replaceLayerSprite(oldSprite);
        }, this);
    };

    Spriteset_Map.prototype.replaceLayerSprite = function(oldSprite) {
        const deleteIndex = this._characterSprites.indexOf(oldSprite);
        if (deleteIndex >= 0) {
            this._characterSprites.splice(deleteIndex, 1);
        }
        this._tilemap.removeChild(oldSprite);
        const newSprite = new Sprite_MapLayer(oldSprite.getCharacter());
        this._tilemap.addChild(newSprite);
    };

    //=============================================================================
    // Sprite_Character
    //  マップレイヤー判定を追加します。
    //=============================================================================
    const _Sprite_Character_character         = Sprite_Character.prototype.setCharacter;
    Sprite_Character.prototype.setCharacter = function(character) {
        _Sprite_Character_character.apply(this, arguments);
        this._layerName = character ? character.getMapLayerName() : undefined;
    };

    Sprite_Character.prototype.getCharacter = function() {
        return this._character;
    };

    Sprite_Character.prototype.isLayer = function() {
        return !!this._layerName;
    };

    //=============================================================================
    // Sprite_MapLayer
    //  マップレイヤーを扱うクラスです。
    //=============================================================================
    function Sprite_MapLayer() {
        this.initialize.apply(this, arguments);
    }

    Sprite_MapLayer.prototype             = Object.create(Sprite_Character.prototype);
    Sprite_MapLayer.prototype.constructor = Sprite_MapLayer;

    Sprite_MapLayer.prototype.setCharacter = function(character) {
        Sprite_Character.prototype.setCharacter.apply(this, arguments);
        this.loadLayerBitmap();
    };

    Sprite_MapLayer.prototype.initMembers = function() {
        Sprite_Character.prototype.initMembers.apply(this, arguments);
        this.anchor.x = 0;
        this.anchor.y = 0;
    };

    Sprite_MapLayer.prototype.loadLayerBitmap = function() {
        this.bitmap = ImageManager.loadParallax(this._layerName, 0);
    };

    Sprite_MapLayer.prototype.updateVisibility = function() {
        Sprite_Character.prototype.updateVisibility.apply(this, arguments);
        if (!this._character.existPage()) {
            this.visible = false;
        }
    };

    Sprite_MapLayer.prototype.updatePosition = function() {
        this.x = this._character.getLayerX();
        this.y = this._character.getLayerY();
        this.z = this._character.getLayerZ();
    };

    // for EventEffect.js
    Sprite_MapLayer.prototype.updateAngle = function() {}

    Sprite_MapLayer.prototype.updateBitmap = function() {
        this._characterName = '';
        if (this.updateExtend) {
            this.updateExtend();
        }
    };

    Sprite_MapLayer.prototype.updateFrame = function() {
        // do nothing
    };
})();