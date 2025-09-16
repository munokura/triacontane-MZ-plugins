//=============================================================================
// SaveFileDrawFace.js
// ----------------------------------------------------------------------------
// (C)2017 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.3.0 2022/12/04 フェイスグラフィックをトリミングできる機能を追加
// 1.2.0 2021/11/27 MZで動作するよう修正
// 1.1.1 2017/03/28 既存のタイトルを非表示にする機能を追加
// 1.1.0 2017/03/26 マップ名表示機能を追加
// 1.0.0 2017/03/26 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/SaveFileDrawFace.js
@plugindesc Save file face display plugin
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

SaveFileDrawFace.js

Displays a face graphic instead of walking graphics in the save file window.

This plugin requires the base plugin "PluginCommonBase.js."
"PluginCommonBase.js" is located in the following folder under the RPG Maker
MZ installation folder:

dlc/BasicResources/plugins/official

Terms of Use:
You may modify and redistribute this plugin without permission, and there are
no restrictions on its use (commercial, R18+, etc.).
This plugin is now yours.

@param visibleItems
@text Number of displayed lines
@desc This is the number of lines that can be displayed in the save file window. If you are using the default resolution, leaving this at 3 is fine.
@default 3

@param hiddenGameTitle
@text Game title not displayed
@desc Hides the area that originally displays the game title. (ON/OFF)
@type boolean
@default false

@param trimmingX
@text Trimming X coordinate
@desc The X coordinate for cropping the face image.
@type number
@default 0

@param trimmingY
@text Cropping Y coordinate
@desc The Y coordinate for cropping the face image.
@type number
@default 0

@param trimmingWidth
@text Trimming width
@desc The width when cropping the face image.
@type number
@default 0

@param trimmingHeight
@text Trimming Height
@desc The height to crop the face image to.
@type number
@default 0

@param drawX
@text Drawing X coordinate
@desc The X coordinate for drawing the face image.
@type number
@default 0

@param drawY
@text Drawing Y coordinate
@desc The Y coordinate for drawing the face image.
@type number
@default 0
*/

/*:ja
@plugindesc セーブファイルのフェイス表示プラグイン
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/SaveFileDrawFace.js
@base PluginCommonBase
@orderAfter PluginCommonBase
@author トリアコンタン

@param visibleItems
@text 表示行数
@desc セーブファイルウィンドウに表示可能な行数です。デフォルト解像度の場合、3のままで問題ありません。
@default 3
@number

@param hiddenGameTitle
@text ゲームタイトル非表示
@desc もともとゲームタイトルを表示している箇所を非表示にします。(ON/OFF)
@default false
@type boolean

@param trimmingX
@text トリミングX座標
@desc フェイス画像をトリミングする場合のX座標です。
@default 0
@type number

@param trimmingY
@text トリミングY座標
@desc フェイス画像をトリミングする場合のY座標です。
@default 0
@type number

@param trimmingWidth
@text トリミング横幅
@desc フェイス画像をトリミングする場合の横幅です。
@default 0
@type number

@param trimmingHeight
@text トリミング高さ
@desc フェイス画像をトリミングする場合の高さです。
@default 0
@type number

@param drawX
@text 描画X座標
@desc フェイス画像の描画X座標です。
@default 0
@type number

@param drawY
@text 描画Y座標
@desc フェイス画像の描画Y座標です。
@default 0
@type number

@help SaveFileDrawFace.js

セーブファイルウィンドウで歩行フラフィックの代わりに
顔グラフィックを表示します。

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

    //=============================================================================
    // Window_SavefileList
    //  歩行グラフィックを非表示にして顔グラフィックを表示します。
    //=============================================================================
    Window_SavefileList.prototype.drawPartyCharacters = function(info, x, y) {};

    if (param.hiddenGameTitle) {
        Window_SavefileList.prototype.drawGameTitle = function(info, x, y, width) {};
    }

    Window_SavefileList.prototype.drawPartyFaces = function(info, x, y) {
        if (!info.faces) {
            return;
        }
        info.faces.forEach((faceData, index)=> {
            this.drawFaceForSave(faceData[0], faceData[1], x + index * this.drawFaceWidth() + 4, y);
        });
    };

    Window_SavefileList.prototype.isTrimming = function() {
        return param.trimmingX || param.trimmingY || param.trimmingWidth ||
            param.trimmingHeight || param.drawX || param.drawY;
    };

    Window_SavefileList.prototype.drawFaceWidth = function() {
        return param.trimmingWidth || ImageManager.faceWidth;
    }

    Window_SavefileList.prototype.drawFaceHeight = function() {
        return param.trimmingHeight || ImageManager.faceHeight;
    }

    Window_SavefileList.prototype.drawFaceForSave = function(faceName, faceIndex, x, y, width, height) {
        if (!this.isTrimming()) {
            this.drawFace(faceName, faceIndex, x, y, width, height);
            return;
        }
        width = width || this.drawFaceWidth();
        height = height || this.drawFaceHeight();
        const bitmap = ImageManager.loadFace(faceName);
        const pw = ImageManager.faceWidth;
        const ph = ImageManager.faceHeight;
        const sw = Math.min(width, pw);
        const sh = Math.min(height, ph);
        const tx = (param.trimmingX || 0);
        const ty = (param.trimmingY || 0)
        const dx = Math.floor(x + Math.max(width - pw, 0) / 2) + (param.drawX || 0);
        const dy = Math.floor(y + Math.max(height - ph, 0) / 2) + (param.drawY || 0);
        const sx = Math.floor((faceIndex % 4) * pw + (pw - sw) / 2) + tx;
        const sy = Math.floor(Math.floor(faceIndex / 4) * ph + (ph - sh) / 2) + ty;
        this.contents.blt(bitmap, sx, sy, sw, sh, dx, dy);
    };

    const _Window_SavefileList_drawItem = Window_SavefileList.prototype.drawItem;
    Window_SavefileList.prototype.drawItem = function(index) {
        const savefileId = this.indexToSavefileId(index);
        const info = DataManager.savefileInfo(savefileId);
        if (info) {
            const rect = this.itemRectWithPadding(index);
            const faceY    = rect.y + this.itemHeight() / 2 - ImageManager.faceHeight / 2 + this.lineHeight() / 2;
            const faceMaxY = rect.y + rect.height - ImageManager.faceHeight;
            this.resetTextColor();
            this.changePaintOpacity(this.isEnabled(savefileId));
            this.drawPartyFaces(info, rect.x, Math.min(faceY, faceMaxY));
        }
        _Window_SavefileList_drawItem.apply(this, arguments);
    };

    const _Window_SavefileList_numVisibleRows = Window_SavefileList.prototype.numVisibleRows;
    Window_SavefileList.prototype.numVisibleRows = function() {
        return param.visibleItems || _Window_SavefileList_numVisibleRows.apply(this, arguments);
    };
})();