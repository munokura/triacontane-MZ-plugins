//=============================================================================
// PlayerPointerTurn.js
// ----------------------------------------------------------------------------
// (C)2016 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.5.0 2023/05/11 クリック時のみポインタの方を向く機能を追加
// 1.4.0 2021/08/26 プラグインの機能を一時無効化するスイッチを追加
// 1.3.0 2021/06/20 MZで動作するよう修正
// 1.2.0 2021/06/20 移動中も常にポインタの方を向く機能を追加
// 1.1.0 2018/02/10 PD_8DirDash.jsと連携した場合、8方向に対応する機能を追加しました。
// 1.0.0 2016/02/23 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/PlayerPointerTurn.js
@plugindesc Pointer Tracking Plugin
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

The player will face the mouse pointer when movement is possible.

This plugin does not have any plugin commands.

Terms of Use:
You may modify and redistribute it without permission from the author, and
there are no restrictions on its use (commercial use, 18+ use, etc.).
This plugin is now yours.

@param validMoving
@text Valid while moving
@desc Always face the pointer while moving.
@type boolean
@default false

@param invalidSwitch
@text Disable Switch
@desc When the specified switch is ON, the plug-in function will be disabled.
@type switch
@default 0

@param clickOnly
@text Only on click
@desc It only faces the pointer when the mouse is clicked. If you enable this feature, we recommend disabling map touch movement in some way.
@type boolean
@default false
*/

/*:ja
@plugindesc ポインタ追跡プラグイン
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/PlayerPointerTurn.js
@base PluginCommonBase
@orderAfter PluginCommonBase
@author トリアコンタン

@param validMoving
@text 移動中も有効
@desc 移動中も常にポインタの方を向きます。
@default false
@type boolean

@param invalidSwitch
@text 無効スイッチ
@desc 指定したスイッチがONのときプラグインの機能が無効になります。
@default 0
@type switch

@param clickOnly
@text クリック時のみ
@desc マウスクリック時のみポインタの方を向きます。この機能を有効にする場合、何らかの方法でマップタッチ移動の無効化を推奨します。
@default false
@type boolean

@help 移動可能な場合にプレイヤーが
マウスポインタの方を向きます。

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

    //=============================================================================
    // Game_Player
    //  ポインタの方を向く
    //=============================================================================
    const _Game_Player_moveByInput      = Game_Player.prototype.moveByInput;
    Game_Player.prototype.moveByInput = function() {
        if (!this.isMoving() && this.canMove() && (TouchInput.isHovered() || TouchInput.isTriggered())) {
            this.turnToPointer();
        }
        _Game_Player_moveByInput.apply(this, arguments);
    };

    const _Game_Player_update = Game_Player.prototype.update;
    Game_Player.prototype.update = function(sceneActive) {
        _Game_Player_update.apply(this, arguments);
        if (param.validMoving) {
            this.turnToPointer();
        }
    };

    Game_Player.prototype.turnToPointer = function() {
        if ($gameSwitches.value(param.invalidSwitch)) {
            return;
        }
        if (param.clickOnly && !TouchInput.isTriggered()) {
            return;
        }
        const tx = TouchInput.x, ty = TouchInput.y, sx = this.screenX(), sy = this.screenY();
        const dir = Math.abs(tx - sx) > Math.abs(ty - sy) ? (tx > sx ? 6 : 4) : (ty > sy ? 2 : 8);
        this.setDirection(dir);
    };
})();