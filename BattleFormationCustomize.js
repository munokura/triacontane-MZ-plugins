//=============================================================================
// BattleFormationCustomize.js
// ----------------------------------------------------------------------------
// (C)2017 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.1.1 2024/02/12 座標と相対座標の両方を指定したときに相対座標が正しく反映されない問題を修正
// 1.1.0 2021/03/14 MZで動作するよう修正
// 1.0.0 2017/08/26 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/BattleFormationCustomize.js
@plugindesc Battle formation adjustment plugin
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

BattleFormationCustomize.js

Adjusts the formation position during battle.

Specify the following in the memo field for actor and other characteristics.

<BFC_Coordinates:100,200> # Set the formation coordinates to X [100] and Y
[200].
<BFC_Pos:10,20> # Same as above.
<BFC_RelativeCoordinates:10,20> # Shift the formation coordinates from the
original position by [10] in the X direction and [20] in the Y direction.
<BFC_DeltaPos:10,20> # Same as above.

Specify both the X and Y coordinates.

Terms of Use:
You may modify and redistribute this plugin without permission, and there are
no restrictions on its use (commercial, 18+, etc.).

This plugin is now yours.
*/

/*:ja
@plugindesc 戦闘隊列調整プラグイン
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/BattleFormationCustomize.js
@base PluginCommonBase
@author トリアコンタン

@help BattleFormationCustomize.js

戦闘における隊列の位置を調整します。
アクターなど特徴を有するメモ欄に以下の通り指定してください。

<BFC_座標:100,200>   # 隊列座標をX座標を[100]に、Y座標を[200]に設定
<BFC_Pos:10,20>      # 同上
<BFC_相対座標:10,20> # 隊列座標を元位置からX方向に[10]、Y方向に[20]ずらす
<BFC_DeltaPos:10,20> # 同上

X座標とY座標は両方指定してください。

利用規約：
 作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 についても制限はありません。
 このプラグインはもうあなたのものです。
*/

(function() {
    'use strict';

    //=============================================================================
    // Sprite_Battler
    //  カスタマイズされた位置情報を反映します。
    //=============================================================================
    const _Sprite_Battler_initMembers = Sprite_Battler.prototype.initMembers;
    Sprite_Battler.prototype.initMembers = function() {
        _Sprite_Battler_initMembers.apply(this, arguments);
        this._homeDx = 0;
        this._homeDy = 0;
    };

    const _Sprite_Battler_setBattler = Sprite_Battler.prototype.setBattler;
    Sprite_Battler.prototype.setBattler = function(battler) {
        _Sprite_Battler_setBattler.apply(this, arguments);
        if (this._battler) {
            this.setCustomHome();
            this.setCustomDeltaHome();
        }
    };

    Sprite_Battler.prototype.setCustomHome = function() {
        const customPosition = this.getCustomHomePosition(['BFC_座標', 'BFC_Pos']);
        if (customPosition) {
            this.setHome(customPosition[0], customPosition[1]);
            this._homeDx = 0;
            this._homeDy = 0;
        }
    };

    Sprite_Battler.prototype.setCustomDeltaHome = function() {
        const customPosition = this.getCustomHomePosition(['BFC_相対座標', 'BFC_DeltaPos']);
        if (customPosition) {
            this.setHome(this._homeX + customPosition[0] - this._homeDx, this._homeY + customPosition[1] - this._homeDy);
            this._homeDx = customPosition[0];
            this._homeDy = customPosition[1];
        }
    };

    Sprite_Battler.prototype.getCustomHomePosition = function(types) {
        let position = null;
        this._battler.traitObjects().some(function(traitObject) {
            const metaValue = PluginManagerEx.findMetaValue(traitObject, types);
            if (metaValue !== undefined) {
                position = metaValue.split(',').map(value => parseInt(value));
                return true;
            }
            return false;
        });
        return position;
    };

    const _Sprite_Actor_setActorHome = Sprite_Actor.prototype.setActorHome;
    Sprite_Actor.prototype.setActorHome = function(index) {
        _Sprite_Actor_setActorHome.apply(this, arguments);
        this._homeDx = 0;
        this._homeDy = 0;
    };
})();