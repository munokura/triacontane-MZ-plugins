//=============================================================================
// SaveFileLoadOnly.js
// ----------------------------------------------------------------------------
// (C)2017 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.1.1 2023/08/05 ファイル10以上のときロード専用アイコンの表示位置が一部重なってしまう現象を修正
// 1.1.0 2021/10/22 MZで動作するよう修正
// 1.0.0 2017/08/09 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/SaveFileLoadOnly.js
@plugindesc Save file loading plugin
@author Triacontane
@license MIT License

@help
English Help Translator: munokura
Please check the URL below for the latest version of the plugin.
URL https://triacontane.blogspot.com
-----

SaveFileLoadOnly.js

Makes a specific save file read-only.
Specify the load-only conditions as parameters. You can use a calculation
formula to specify them.

This plugin requires the base plugin "PluginCommonBase.js."
"PluginCommonBase.js" is located in the following folder under the RPG Maker
MZ installation folder:
dlc/BasicResources/plugins/official

Terms of Use:
You may modify and redistribute this plugin without permission, and there are
no restrictions on its use (commercial, 18+, etc.).
This plugin is now yours.

@param condition
@text Load-only conditions
@desc This is the expression to determine whether the file is loaded. You can use the local variable [fileId] and the control character \v[n].
@type combo
@option fileId === 1; // Make file ID [1] read-only.
@option fileId === \v[1]; // Make the file ID [value of variable [1]] read-only.
@option fileId >= 1 && fileId <= 3; // Make file IDs [1-3] read-only.

@param iconId
@text Road-specific icon ID
@desc The icon ID that will be drawn only for load-only files in the save file window.
@type number
@default 195
*/

/*:ja
@plugindesc セーブファイルのロード専用化プラグイン
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/SaveFileLoadOnly.js
@base PluginCommonBase
@orderAfter PluginCommonBase
@author トリアコンタン

@param condition
@text ロード専用条件
@desc ロード専用対象の判定式です。ローカル変数[fileId]および制御文字\v[n]が使えます。
@default 
@type combo
@option fileId === 1; // ファイルID[1]を読み取り専用にします。
@option fileId === \v[1]; // ファイルID[変数[1]の値]を読み取り専用にします。
@option fileId >= 1 && fileId <= 3; // ファイルID[1-3]を読み取り専用にします。

@param iconId
@text ロード専用アイコンID
@desc セーブファイルウィンドウで、ロード専用ファイルにのみ描画されるアイコンIDです。
@default 195
@type number

@help SaveFileLoadOnly.js

特定のセーブファイルを読み取り専用にできます。
パラメータでロード専用条件を指定してください。指定には計算式が使えます。

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
    //  ロード専用ファイルの判定を追加定義します。
    //=============================================================================
    const _Window_SavefileList_isEnabled      = Window_SavefileList.prototype.isEnabled;
    Window_SavefileList.prototype.isEnabled = function(savefileId) {
        return _Window_SavefileList_isEnabled.apply(this, arguments) &&
            !(this.isModeSave() && this.isLoadOnly(savefileId));
    };

    Window_SavefileList.prototype.isLoadOnly = function(fileId) {
        return !!eval(param.condition);
    };

    const _Window_SavefileList_drawTitle      = Window_SavefileList.prototype.drawTitle;
    Window_SavefileList.prototype.drawTitle = function(id, x, y) {
        _Window_SavefileList_drawTitle.apply(this, arguments);
        if (this.isLoadOnly(id) && param.iconId > 0) {
            const offset = id >= 10 ? 204 : 188;
            this.drawIcon(param.iconId, x + offset - ImageManager.iconWidth, y + 2);
        }
    };

    Window_SavefileList.prototype.isModeSave = function() {
        return this._mode === 'save';
    };
})();