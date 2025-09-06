/*=============================================================================
 GoldWindowPosition.js
----------------------------------------------------------------------------
 (C)2022 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2022/05/12 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/GoldWindowPosition.js
@plugindesc Money window position adjustment plugin
@author Triacontane
@license MIT License

@help
English Help Translator: munokura
Please check the URL below for the latest version of the plugin.
URL https://triacontane.blogspot.com
-----

GoldWindowPosition.js

This changes the display coordinates of the Gold window to be obtained from
the variable value specified by the parameter.
It displays regardless of the message window's position, so you need to adjust
it so that it doesn't overlap with the message window.

This plugin does not have any plugin commands.

Terms of Use:
You may modify and redistribute it without permission from the author, and
there are no restrictions on its use (commercial, 18+, etc.).
This plugin is now yours.

@param switchId
@text Valid Switch Number
@desc Position adjustment is enabled only when the specified switch is ON. If not specified, it will always be enabled.
@type switch
@default 0

@param xVariableId
@text X coordinate variable
@desc The variable number that receives the window's X coordinate.
@type variable
@default 1

@param yVariableId
@text Y coordinate variable
@desc The variable number that receives the window's Y coordinate.
@type variable
@default 1
*/

/*:ja
@plugindesc 所持金ウィンドウ位置調整プラグイン
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/GoldWindowPosition.js
@base PluginCommonBase
@orderAfter PluginCommonBase
@author トリアコンタン

@param switchId
@text 有効スイッチ番号
@desc 指定したスイッチがONのときだけ位置調整を有効にします。指定がない場合、常に有効になります。
@default 0
@type switch

@param xVariableId
@text X座標の変数
@desc ウィンドウのX座標を取得する変数番号です。
@default 1
@type variable

@param yVariableId
@text Y座標の変数
@desc ウィンドウのY座標を取得する変数番号です。
@default 1
@type variable

@help GoldWindowPosition.js

所持金ウィンドウの表示座標をパラメータで指定した変数値から
取得するよう変更します。
メッセージウィンドウの位置とは無関係に表示されるので
メッセージウィンドウと重ならないように調整する必要があります。

このプラグインにはプラグインコマンドはありません。

利用規約：
 作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 についても制限はありません。
 このプラグインはもうあなたのものです。
*/

(()=> {
    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);

    const _Window_Message_updatePlacement = Window_Message.prototype.updatePlacement;
    Window_Message.prototype.updatePlacement = function() {
        _Window_Message_updatePlacement.apply(this, arguments);
        console.log('updatePlacement');
        if (param.switchId && !$gameSwitches.value(param.switchId)) {
            return;
        }
        this._goldWindow.x = $gameVariables.value(param.xVariableId);
        this._goldWindow.y = $gameVariables.value(param.yVariableId);
    };
})();