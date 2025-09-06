//=============================================================================
// ForegroundToParallax.js
// ----------------------------------------------------------------------------
// (C)2017 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.1.0 2021/07/12 MZ版を作成
//                  指定したマップのみ遠景化する機能を追加
// 1.0.0 2017/06/19 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/ForegroundToParallax.js
@plugindesc Foreground distant view plugin
@author Triacontane
@license MIT License

@help
English Help Translator: munokura
Please check the URL below for the latest version of the plugin.
URL https://triacontane.blogspot.com
-----

The launch plugin "Foreground.js" switches the foreground view to a background
view.

It will be displayed behind the original background view.

Use this when you want to display two different background views
simultaneously.

If you turn on the parameter "Enabled only if specified," only maps with the
following tag will be displayed in background view.

<fgToParallax>

Terms of Use:
You may modify and redistribute this plugin without permission, and there are
no restrictions on its use (commercial, 18+, etc.).

This plugin is now yours.

@param validNoteTag
@text Only valid if specified
@desc When set to ON, the perspective will be enabled only on maps that have the tag <fgToParallax>.
@type boolean
@default false
*/

/*:ja
@plugindesc Foregroundの遠景化プラグイン
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/ForegroundToParallax.js
@base PluginCommonBase
@orderAfter PluginCommonBase
@base Foreground
@orderAfter Foreground
@author トリアコンタン

@param validNoteTag
@text 指定した場合のみ有効
@desc ONにするとタグ<fgToParallax>を記載したマップでのみ遠景化が有効になります。
@default false
@type boolean

@help ロンチプラグイン「Foreground.js」で表示する近景を遠景に切り替えます。
もともとの遠景の後ろ側に表示されるようになります。
二種類の遠景を同時に表示させたい場合などにご使用ください。

パラメータ「指定した場合のみ有効」をONにすると、以下のタグを記載したマップのみ
遠景化されます。
<fgToParallax>

利用規約：
 作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 についても制限はありません。
 このプラグインはもうあなたのものです。
*/

(function() {
    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);

    const _Spriteset_Map_createForeground = Spriteset_Map.prototype.createForeground;
    Spriteset_Map.prototype.createForeground = function() {
        _Spriteset_Map_createForeground.apply(this, arguments);
        if (param.validNoteTag && $dataMap && !PluginManagerEx.findMetaValue($dataMap, 'fgToParallax')) {
            return;
        }
        this._baseSprite.removeChild(this._foreground);
        const newIndex = this._baseSprite.getChildIndex(this._parallax);
        this._baseSprite.addChildAt(this._foreground, newIndex);
    };
})();