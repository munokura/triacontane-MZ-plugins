//=============================================================================
// WindowBlinkStop.js
// ----------------------------------------------------------------------------
// (C)2017 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.2.0 2024/04/18 本プラグインの機能をシーン毎に無効にできる機能を追加
// 1.1.1 2022/02/05 メッセージウィンドウなどに表示されるページ送り画像のアニメーションが止まってしまう問題を修正
// 1.1.0 2021/08/08 MZ向けにリファクタリング
// 1.0.0 2017/12/09 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/WindowBlinkStop.js
@plugindesc Window blinking stop plugin
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

WindowBlinkStop.js

Stops the blinking of the cursor in the selected window.

This plugin requires the base plugin "PluginCommonBase.js."
"PluginCommonBase.js" is located in the following folder under the RPG Maker
MZ installation folder:

dlc/BasicResources/plugins/official

Terms of Use:
You may modify and redistribute this plugin without permission from the
author, and there are no restrictions on its use (commercial, 18+, etc.).
This plugin is now yours.

@param blinkScenes
@text Window flashing scene
@desc The plug-in function will be disabled in the specified scene, and the window will resume flashing.
@type select[]
@default []
@option title
@value Scene_Title
@option map
@value Scene_Map
@option game over
@value Scene_Gameover
@option Battle
@value Scene_Battle
@option Main Menu
@value Scene_Menu
@option item
@value Scene_Item
@option skill
@value Scene_Skill
@option Equipment
@value Scene_Equip
@option status
@value Scene_Status
@option option
@value Scene_Options
@option save
@value Scene_Save
@option load
@value Scene_Load
@option Game End
@value Scene_End
@option shop
@value Scene_Shop
@option Enter your name
@value Scene_Name
@option debug
@value Scene_Debug
*/

/*:ja
@plugindesc ウィンドウ点滅停止プラグイン
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/WindowBlinkStop.js
@author トリアコンタン

@param blinkScenes
@text ウィンドウ点滅シーン
@desc 指定したシーンで本プラグインの機能が無効になり、ウィンドウの点滅が再開します。
@default []
@type select[]
@option タイトル
@value Scene_Title
@option マップ
@value Scene_Map
@option ゲームオーバー
@value Scene_Gameover
@option バトル
@value Scene_Battle
@option メインメニュー
@value Scene_Menu
@option アイテム
@value Scene_Item
@option スキル
@value Scene_Skill
@option 装備
@value Scene_Equip
@option ステータス
@value Scene_Status
@option オプション
@value Scene_Options
@option セーブ
@value Scene_Save
@option ロード
@value Scene_Load
@option ゲーム終了
@value Scene_End
@option ショップ
@value Scene_Shop
@option 名前入力
@value Scene_Name
@option デバッグ
@value Scene_Debug

@help WindowBlinkStop.js

選択中のウィンドウカーソルの点滅を停止します。

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
    if (!param.blinkScenes) {
        param.blinkScenes = [];
    }

    const _Window__initialize = Window.prototype.initialize;
    Window.prototype.initialize = function() {
        _Window__initialize.apply(this, arguments);
        if (SceneManager.isWindowBlinkScene()) {
            this._needBlink = true;
        }
    };

    SceneManager.isWindowBlinkScene = function() {
        return param.blinkScenes.includes(this._scene.constructor.name);
    };

    const _Window__updateCursor = Window.prototype._updateCursor;
    Window.prototype._updateCursor = function() {
        if (this._needBlink) {
            _Window__updateCursor.apply(this, arguments);
            return;
        }
        const prevCount = this._animationCount;
        this._animationCount = 0;
        _Window__updateCursor.apply(this, arguments);
        this._animationCount = prevCount;
    };
})();