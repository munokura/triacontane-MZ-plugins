//=============================================================================
// FacePicture.js
// ----------------------------------------------------------------------------
// (C) 2017 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 2.0.1 2023/03/01 インデックスの指定値によっては正常なフェイスグラフィックが表示されない問題を修正
// 2.0.0 2023/02/24 MZ向けに実装を一新
// 1.2.1 2019/06/27 最新のコアスクリプトでもbltで正常表示できるよう修正
// 1.2.0 2017/03/08 ピクチャのファイル名に制御文字を使っていた場合にリフレッシュで再表示できる機能を追加
// 1.1.3 2017/03/03 引数に制御文字を使ってピクチャを表示してからメニューを開閉するとエラーになる不具合を修正
// 1.1.2 2017/02/07 端末依存の記述を削除
// 1.1.0 2017/02/05 任意のアクターの顔グラフィックをピクチャとして表示する機能を追加
// 1.0.1 2017/02/05 顔グラフィックのインデックスが4以上の場合に正しく表示されない問題を修正
// 1.0.0 2017/02/02 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/FacePicture.js
@plugindesc Face Gra picture display plug-in
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

FacePicture.js

Displays face graphics as pictures.
After specifying a face graphic or actor ID in the plugin command,
if you set the picture display to an empty file, the corresponding face
graphic
will be displayed as a picture.

This plugin requires the base plugin "PluginCommonBase.js."
"PluginCommonBase.js" is located in the following folder
in the RPG Maker MZ installation folder:
dlc/BasicResources/plugins/official

Terms of Use:
You may modify and redistribute this plugin without permission, and there are
no restrictions on its use (commercial, 18+, etc.).
This plugin is now yours.

@command SET_FACE_PICTURE
@text Face picture specification
@desc Displays the specified face graphic as a picture.
@arg imageFile
@text file
@desc The file path of the face graphic.
@type file
@dir img/faces
@arg index
@text Index
@desc The file index of the face graphic (0-7).
@type number
@default 0
@max 7

@command SET_ACTOR_FACE_PICTURE
@text Actor face picture specification
@desc Displays the face graphic of the specified actor in a picture.
@arg actorId
@text Actor ID
@desc Displays the face graphic of the actor with the specified ID in a picture.
@type actor
@default 1
*/

/*:ja
@plugindesc 顔グラのピクチャ表示プラグイン
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/FacePicture.js
@base PluginCommonBase
@orderAfter PluginCommonBase
@author トリアコンタン

@command SET_FACE_PICTURE
@text フェイスピクチャ指定
@desc 指定したフェイスグラフィックをピクチャ表示します。

@arg imageFile
@text ファイル
@desc フェイスグラフィックのファイルパスです。
@default
@type file
@dir img/faces

@arg index
@text インデックス
@desc フェイスグラフィックのファイルインデックスです。(0-7)
@default 0
@type number
@max 7

@command SET_ACTOR_FACE_PICTURE
@text アクターフェイスピクチャ指定
@desc 指定したアクターのフェイスグラフィックをピクチャ表示します。

@arg actorId
@text アクターID
@desc 指定したIDのアクターのフェイスグラフィックをピクチャ表示します。
@default 1
@type actor

@help FacePicture.js

フェイスグラフィックをピクチャとして表示できます。
プラグインコマンドからフェイスグラフィックもしくはアクターIDを指定後
ピクチャの表示を空ファイルで表示すると対応するフェイスグラフィックが
ピクチャとして表示されます。

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

    PluginManagerEx.registerCommand(script, 'SET_FACE_PICTURE', args => {
        $gameScreen.setFacePicture(args.imageFile, args.index);
    });

    PluginManagerEx.registerCommand(script, 'SET_ACTOR_FACE_PICTURE', args => {
        const actor = $gameActors.actor(args.actorId);
        if (actor) {
            $gameScreen.setFacePicture(actor.faceName(), actor.faceIndex());
        } else {
            PluginManagerEx.throwError(`Invalid Actor ID:${args.actorId}`, script);
        }
    });

    //=============================================================================
    // Game_Screen
    //  事前設定ピクチャ名を保持します。
    //=============================================================================
    Game_Screen.prototype.setFacePicture = function(imageFile, index) {
        this._facePicture = {
            imageFile: imageFile, index: index
        }
    };

    Game_Screen.prototype.getFacePicture = function() {
        const picture = this._facePicture;
        this._facePicture = null;
        return picture;
    };

    //=============================================================================
    // Game_Picture
    //  事前設定ピクチャ名を取得します。
    //=============================================================================
    const _Game_Picture_show      = Game_Picture.prototype.show;
    Game_Picture.prototype.show = function(name, origin, x, y, scaleX,
                                           scaleY, opacity, blendMode) {
        this._faceInto = null;
        if (!name) {
            const faceInfo = $gameScreen.getFacePicture();
            if (faceInfo) {
                this._faceInto = faceInfo;
                arguments[0] = `FACE[${faceInfo.imageFile}:${faceInfo.index}]`;
            }
        }
        _Game_Picture_show.apply(this, arguments);
    };

    Game_Picture.prototype.faceInfo = function() {
        return this._faceInto;
    };

    const _Sprite_Picture_loadBitmap = Sprite_Picture.prototype.loadBitmap;
    Sprite_Picture.prototype.loadBitmap = function() {
        const picture = this.picture();
        if (picture && picture.faceInfo()) {
            this.bitmap = ImageManager.loadFace(picture.faceInfo().imageFile);
            this.updateFaceFrame();
        } else {
            this.setFrame(0, 0, 0, 0);
            _Sprite_Picture_loadBitmap.apply(this, arguments);
        }
    };

    Sprite_Picture.prototype.updateFaceFrame = function() {
        const picture = this.picture();
        if (picture && picture.faceInfo()) {
            const w = ImageManager.faceWidth;
            const h = ImageManager.faceHeight;
            const index = picture.faceInfo().index;
            const sx = index % 4 * w;
            const sy = Math.floor(index / 4) * h;
            this.setFrame(sx, sy, w, h);
        }
    };
})();