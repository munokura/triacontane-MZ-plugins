//=============================================================================
// PictureSpriteSheet.js
// ----------------------------------------------------------------------------
// (C)2016 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.1.1 2024/02/27 スプライトシートを設定したピクチャを消去後に同じ番号で別のピクチャを再表示したとき、表示がおかしくなる問題を修正
// 1.1.0 2021/10/24 MZで動作するよう修正
// 1.0.1 2017/02/07 端末依存の記述を削除
// 1.0.0 2016/12/31 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/PictureSpriteSheet.js
@plugindesc Picture Sprite Sheet Plugin
@author Triacontane
@license MIT License

@help
English Help Translator: munokura
Please check the URL below for the latest version of the plugin.
URL https://triacontane.blogspot.com
-----

PictureSpriteSheet.js

Treats pictures as a sprite sheet with a width * height dimension.
This improves performance when switching cel images for animations and
eliminates asynchronous flickering.

Concatenated images that are too large (over 4096 pixels in either dimension)
may not display correctly.
The cel number is specified via the plugin command.

Please specify cel numbers starting from [0] according to the following
legend:
[0] [1] [2]
[3] [4] [5]
[6] [7] [8]

This plugin requires the base plugin "PluginCommonBase.js."
"PluginCommonBase.js" is located in the following folder under the RPG Maker
MZ installation folder:
dlc/BasicResources/plugins/official

Terms of Use:
Modification and redistribution are permitted without permission from the
author, and there are no restrictions on usage (commercial, R18, etc.).
This plugin is now yours.

@command SET_CELL_SIZE
@text Cell Size Settings
@desc This specifies the number of cells in the next picture to be displayed. Please execute this immediately before "Display Picture."
@arg row
@text Number of vertical cells
@desc The number of cells vertically.
@type number
@default 1
@min 1
@arg column
@text Number of cells horizontally
@desc The number of cells horizontally.
@type number
@default 1
@min 1

@command SET_CELL
@text Cell number specification
@desc Sets the cell number for the specified picture number.
@arg pictureId
@text Picture Number
@desc The picture number to operate on.
@type number
@default 1
@min 1
@arg cellNumber
@text Cell Number
@desc This is the cell number you want to set. Please refer to the help for how to specify it.
@type number
@default 0
@min 0

@command ADD_CELL
@text Cell number addition
@desc Adds one to the cell number of the specified picture number.
@arg pictureId
@text Picture Number
@desc The picture number to operate on.
@type number
@default 1
@min 1
*/

/*:ja
@plugindesc ピクチャのスプライトシートプラグイン
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/PictureSpriteSheet.js
@base PluginCommonBase
@orderAfter PluginCommonBase
@author トリアコンタン

@command SET_CELL_SIZE
@text セルサイズ設定
@desc 次の表示するピクチャのセル数を指定してます。「ピクチャの表示」直前に実行してください。

@arg row
@text 縦のセル数
@desc 縦方向のセルの数です。
@default 1
@type number
@min 1

@arg column
@text 横のセル数
@desc 横方向のセルの数です。
@default 1
@type number
@min 1

@command SET_CELL
@text セル番号指定
@desc 指定したピクチャ番号のセル番号を設定します。

@arg pictureId
@text ピクチャ番号
@desc 操作対象のピクチャ番号です。
@default 1
@type number
@min 1

@arg cellNumber
@text セル番号
@desc 設定したいセル番号です。指定の仕方はヘルプを参照してください。
@default 0
@type number
@min 0

@command ADD_CELL
@text セル番号加算
@desc 指定したピクチャ番号のセル番号をひとつ加算します。

@arg pictureId
@text ピクチャ番号
@desc 操作対象のピクチャ番号です。
@default 1
@type number
@min 1

@help PictureSpriteSheet.js

ピクチャを横 * 縦のスプライトシートとして扱います。
セル画像を切り替えてアニメーションを行う場合に、パフォーマンスを改善して
かつ非同期によるチラつきが発生しなくなります。

連結した画像があまりに大きい(縦横いずれかが4096ピクセル以上)場合は
正常に表示されない可能性があります。
プラグインコマンドからセル番号を指定してます。

セル番号は[0]から開始で以下の凡例に従って指定してください。
[0] [1] [2]
[3] [4] [5]
[6] [7] [8]

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

    PluginManagerEx.registerCommand(script, 'SET_CELL_SIZE', args => {
        $gameScreen.setPictureSpriteSheetSize(args.column, args.row);
    });

    PluginManagerEx.registerCommand(script, 'SET_CELL', args => {
        const picture = $gameScreen.picture(args.pictureId);
        if (picture) {
            picture.setSheetCellIndex(args.cellNumber);
        }
    });

    PluginManagerEx.registerCommand(script, 'ADD_CELL', args => {
        const picture = $gameScreen.picture(args.pictureId);
        if (picture) {
            picture.addSheetCellIndex();
        }
    });

    //=============================================================================
    // Game_Screen
    //  セル数を保持します。
    //=============================================================================
    Game_Screen.prototype.setPictureSpriteSheetSize = function(col, row) {
        this._pictureSpriteSheetSize = [col, row];
    };

    Game_Screen.prototype.getPictureSpriteSheetSize = function() {
        const result = this._pictureSpriteSheetSize;
        if (result) {
            this._pictureSpriteSheetSize = undefined;
        }
        return result;
    };

    //=============================================================================
    // Game_Picture
    //  セルサイズを取得して、スプライトシート化します。
    //=============================================================================
    const _Game_Picture_show    = Game_Picture.prototype.show;
    Game_Picture.prototype.show = function(name, origin, x, y, scaleX,
                                           scaleY, opacity, blendMode) {
        _Game_Picture_show.apply(this, arguments);
        const spriteSheetSize = $gameScreen.getPictureSpriteSheetSize();
        if (spriteSheetSize) {
            this._sheetCol = spriteSheetSize[0];
            this._sheetRow = spriteSheetSize[1];
        } else {
            this._sheetCol = null;
            this._sheetRow = null;
        }
    };

    Game_Picture.prototype.isUsingSpriteSheet = function() {
        return this._sheetCol && this._sheetRow;
    };

    Game_Picture.prototype.getSheetCol = function() {
        return this._sheetCol;
    };

    Game_Picture.prototype.getSheetRow = function() {
        return this._sheetRow;
    };

    Game_Picture.prototype.getSheetMaxIndex = function() {
        return this._sheetCol * this._sheetRow;
    };

    Game_Picture.prototype.setSheetCellIndex = function(value) {
        this._sheetCellIndex = value % this.getSheetMaxIndex();
    };

    Game_Picture.prototype.getSheetCellIndex = function() {
        return this._sheetCellIndex || 0;
    };

    Game_Picture.prototype.addSheetCellIndex = function() {
        this.setSheetCellIndex(this.getSheetCellIndex() + 1);
    };

    Game_Picture.prototype.getSheetCellPosition = function() {
        const index = this.getSheetCellIndex();
        const colIndex = index % this._sheetCol;
        const rowIndex = Math.floor(index / this._sheetCol);
        return [colIndex, rowIndex];
    };

    //=============================================================================
    // Sprite_Picture
    //  スプライトシート化を実装します。
    //=============================================================================
    const _Sprite_Picture_update    = Sprite_Picture.prototype.update;
    Sprite_Picture.prototype.update = function() {
        _Sprite_Picture_update.apply(this, arguments);
        if (this.visible && this.picture().isUsingSpriteSheet()) {
            this.updateFrameForPss();
        } else if (this._spriteSheet) {
            this._spriteSheet = false;
            const w = this.bitmap?.width || 0;
            const h = this.bitmap?.height || 0;
            this.setFrame(0, 0, w, h);
        }
    };

    Sprite_Picture.prototype.updateFrameForPss = function() {
        const position = this.picture().getSheetCellPosition();
        const width    = this.getCellWidth();
        const height   = this.getCellHeight();
        this.setFrame(position[0] * width, position[1] * height, width, height);
        this._spriteSheet = true;
    };

    Sprite_Picture.prototype.getCellWidth = function() {
        return this.bitmap.width / this.picture().getSheetCol();
    };

    Sprite_Picture.prototype.getCellHeight = function() {
        return this.bitmap.height / this.picture().getSheetRow();
    };
})();