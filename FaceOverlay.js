/*=============================================================================
 FaceOverlay.js
----------------------------------------------------------------------------
 (C)2024 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.1 2024/11/16 重ね合わせ画像の表示優先度を変更
 1.1.0 2024/11/16 元のフェイス画像を非表示にする設定を追加
                  重ね合わせ画像の原点を変更できる機能を追加
 1.0.0 2024/02/01 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/FaceOverlay.js
@plugindesc Face image overlay plugin
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

FaceOverlay.js

Overlays a face image with another image.
You can specify switch and face image display conditions.
The image can also be displayed outside the window frame, making it useful for
common decorative borders.

This plugin requires the base plugin "PluginCommonBase.js."
"PluginCommonBase.js" is located in the following folder under the RPG Maker
MZ installation folder:
dlc/BasicResources/plugins/official

Terms of Use:
You may modify and redistribute this plugin without permission, and there are
no restrictions on its use (commercial, 18+, etc.).
This plugin is now yours.

@param overlayList
@text Overlay List
@desc A list of face images to be overlaid. Multiple images can be specified.
@type struct<Overlay>[]
@default []

@param defaultFaceHide
@text Hide original face
@desc Hides the original face image when displaying the overlaid image.
@type boolean
@default false
*/

/*~struct~Overlay:
@param picture
@text Picture image
@desc This is a picture image that is displayed over the face image. The origin is the top left.
@type file
@dir img/pictures

@param x
@text X coordinate correction
@desc Corrects the display X coordinate of the overlaid image.
@type number
@default 0
@min -2000
@max 2000

@param y
@text Y coordinate correction
@desc Corrects the display Y coordinate of the overlaid image.
@type number
@default 0
@min -2000
@max 2000

@param scaleX
@text X Magnification
@desc The display magnification ratio of the overlaid image in the X direction.
@type number
@default 100
@min -2000
@max 2000

@param scaleY
@text Y Magnification
@desc The Y-direction display magnification of the overlaid image.
@type number
@default 100
@min -2000
@max 2000

@param originX
@text X origin
@desc The origin of the X direction of the overlaid image.
@type select
@default 0
@option Left edge
@value 0
@option center
@value 0.5
@option Right edge
@value 1

@param originY
@text Y origin
@desc The origin of the Y direction of the overlapping image.
@type select
@default 0
@option top end
@value 0
@option center
@value 0.5
@option lower end
@value 1

@param opacity
@text Opacity
@desc The opacity of the overlay image.
@type number
@default 255
@min 0
@max 255

@param switchId
@text Condition Switch ID
@desc The switch ID that is the display condition for the overlay image. It is displayed only when ON.
@type switch
@default 0

@param faceImage
@text Condition Face Image
@desc This is the face image that will be the display condition for the overlay image.
@type file
@dir img/faces

@param faceIndex
@text Condition Index
@desc The face index (1-8) that determines the display conditions for the overlay image.
@type number
@default 0
@min 0
@max 8
*/

/*:ja
@plugindesc フェイス画像重ね合わせプラグイン
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/FaceOverlay.js
@base PluginCommonBase
@orderAfter PluginCommonBase
@author トリアコンタン

@param overlayList
@text 重ね合わせリスト
@desc 重ね合わせるフェイス画像のリストです。複数指定可能です。
@default []
@type struct<Overlay>[]

@param defaultFaceHide
@text 元フェイス非表示
@desc 重ね合わせ画像表示時に元のフェイス画像を非表示にします。
@default false
@type boolean

@help FaceOverlay.js

フェイス画像に別の画像を重ね合わせて表示できます。
スイッチやフェイス画像を表示条件に指定できます。
画像はウィンドウの枠外にも表示されるので共通の装飾枠などに使えます。

このプラグインの利用にはベースプラグイン『PluginCommonBase.js』が必要です。
『PluginCommonBase.js』は、RPGツクールMZのインストールフォルダ配下の
以下のフォルダに格納されています。
dlc/BasicResources/plugins/official

利用規約：
 作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 についても制限はありません。
 このプラグインはもうあなたのものです。
*/

/*~struct~Overlay:ja
@param picture
@text ピクチャ画像
@desc フェイス画像に重ね合わせて表示されるピクチャ画像です。原点は左上になります。
@default
@type file
@dir img/pictures

@param x
@text X座標補正
@desc 重ね合わせ画像の表示X座標を補正します。
@default 0
@type number
@min -2000
@max 2000

@param y
@text Y座標補正
@desc 重ね合わせ画像の表示Y座標を補正します。
@default 0
@type number
@min -2000
@max 2000

@param scaleX
@text X拡大率
@desc 重ね合わせ画像のX方向の表示拡大率です。
@default 100
@type number
@min -2000
@max 2000

@param scaleY
@text Y拡大率
@desc 重ね合わせ画像のY方向の表示拡大率です。
@default 100
@type number
@min -2000
@max 2000

@param originX
@text X原点
@desc 重ね合わせ画像のX方向の原点です。
@default 0
@type select
@option 左端
@value 0
@option 中央
@value 0.5
@option 右端
@value 1

@param originY
@text Y原点
@desc 重ね合わせ画像のY方向の原点です。
@default 0
@type select
@option 上端
@value 0
@option 中央
@value 0.5
@option 下端
@value 1

@param opacity
@text 不透明度
@desc 重ね合わせ画像の不透明度です。
@default 255
@type number
@min 0
@max 255

@param switchId
@text 条件スイッチID
@desc 重ね合わせ画像の表示条件となるスイッチIDです。ONのときのみ表示されます。
@default 0
@type switch

@param faceImage
@text 条件フェイス画像
@desc 重ね合わせ画像の表示条件となるフェイス画像です。
@default
@type file
@dir img/faces

@param faceIndex
@text 条件インデックス
@desc 重ね合わせ画像の表示条件となるフェイスインデックス(1-8)です。
@default 0
@type number
@min 0
@max 8
*/

(() => {
    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);

    const _Scene_Message_associateWindows = Scene_Message.prototype.associateWindows;
    Scene_Message.prototype.associateWindows = function() {
        _Scene_Message_associateWindows.apply(this, arguments);
        this.addChild(this._messageWindow.getFaceOverlaySprite());
    };

    const _Window_Message_initMembers = Window_Message.prototype.initMembers;
    Window_Message.prototype.initMembers = function() {
        _Window_Message_initMembers.apply(this, arguments);
        this._faceOverlaySprite = new Sprite();
    };

    Window_Message.prototype.getFaceOverlaySprite = function() {
        return this._faceOverlaySprite;
    };

    const _Window_Message_drawMessageFace = Window_Message.prototype.drawMessageFace;
    Window_Message.prototype.drawMessageFace = function() {
        const overlay = this.findFaceOverlay();
        if (!overlay || !param.defaultFaceHide) {
            _Window_Message_drawMessageFace.apply(this, arguments);
        }
        this.drawFaceOverlay(overlay);
    };

    const _Window_Message_checkToNotClose = Window_Message.prototype.checkToNotClose;
    Window_Message.prototype.checkToNotClose = function() {
        _Window_Message_checkToNotClose.apply(this, arguments);
        if (!this.isOpen() && this.isClosing()) {
            this._faceOverlaySprite.bitmap = null;
        }
    };

    Window_Message.prototype.findFaceOverlay = function() {
        const faceImage = $gameMessage.faceName();
        const faceIndex = $gameMessage.faceIndex() + 1;
        return param.overlayList.find(overlay => {
            return (!overlay.faceImage || overlay.faceImage === faceImage) &&
                (!overlay.faceIndex || overlay.faceIndex === faceIndex) &&
                (!overlay.switchId || $gameSwitches.value(overlay.switchId));
        });
    };

    Window_Message.prototype.drawFaceOverlay = function(overlay) {
        const sprite = this._faceOverlaySprite;
        if (overlay) {
            sprite.bitmap = ImageManager.loadPicture(overlay.picture);
            sprite.x = overlay.x + this.x;
            sprite.y = overlay.y + this.y;
            sprite.scale.x = overlay.scaleX / 100;
            sprite.scale.y = overlay.scaleY / 100;
            sprite.opacity = overlay.opacity;
            sprite.anchor.x = overlay.originX || 0;
            sprite.anchor.y = overlay.originY || 0;
        } else {
            sprite.bitmap = null;
        }
    };
})();