/*=============================================================================
 FixAutosaveFromTitle.js
----------------------------------------------------------------------------
 (C)2023 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.1 2023/12/27 タイトルスキップ機能に対応
 1.0.0 2023/08/24 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/FixAutosaveFromTitle.js
@plugindesc Plugin that does not autosave immediately after title transition
@author Triacontane
@license MIT License

@help
English Help Translator: munokura
Please check the URL below for the latest version of the plugin.
URL https://triacontane.blogspot.com
-----

FixAutosaveFromTitle.js

Fixes the autosave that occurs immediately after starting a new game or
continuing after returning to the title screen from the map screen.

Terms of Use:
You may modify and redistribute this plugin without permission from the
author, and there are no restrictions on its use (commercial, 18+, etc.).
This plugin is now yours.
*/

/*:ja
@plugindesc タイトル遷移直後はオートセーブしないプラグイン
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/FixAutosaveFromTitle.js
@author トリアコンタン

@help FixAutosaveFromTitle.js

マップ画面からタイトル画面に戻ったあとで
ニューゲームやコンティニューした直後にオートセーブされる仕様を修正します。

利用規約：
 作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 についても制限はありません。
 このプラグインはもうあなたのものです。
*/

(() => {
    'use strict';

    const _Scene_Map_shouldAutosave = Scene_Map.prototype.shouldAutosave;
    Scene_Map.prototype.shouldAutosave = function() {
        const result = _Scene_Map_shouldAutosave.apply(this, arguments);
        return result && !SceneManager.isFromTitle();
    };

    SceneManager.isFromTitle = function() {
        return this._previousClass === Scene_Title || this._previousClass === Scene_Boot;
    };
})();