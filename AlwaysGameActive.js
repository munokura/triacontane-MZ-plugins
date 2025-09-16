/*=============================================================================
 AlwaysGameActive.js
----------------------------------------------------------------------------
 (C)2022 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2022/01/26 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/AlwaysGameActive.js
@plugindesc Always-on Game Plugin
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

AlwaysGameActive.js

This plugin eliminates the MZ feature that stops the game when the window
loses focus.
The game now continues running even when the focus is lost.

Terms of Use:
You may modify and redistribute this plugin without permission from the
author, and there are no restrictions on its use (commercial, 18+, etc.).
This plugin is now yours.
*/

/*:ja
@plugindesc 常時ゲームアクティブプラグイン
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/AlwaysGameActive.js
@author トリアコンタン

@help AlwaysGameActive.js

ウィンドウからフォーカスが外れたときにゲームが停止するMZの仕様を廃止し
フォーカスが外れてもゲームが動き続けるようになります。

利用規約：
 作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 についても制限はありません。
 このプラグインはもうあなたのものです。
*/

(() => {
    'use strict';
    SceneManager.isGameActive = function() {
        return true;
    };
})();