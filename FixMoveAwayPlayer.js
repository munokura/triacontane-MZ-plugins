/*=============================================================================
 FixMoveAwayPlayer.js
----------------------------------------------------------------------------
 (C)2021 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2021/12/15 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/FixMoveAwayPlayer.js
@plugindesc Fixed behavior of moving away from the player
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

FixMoveAwayPlayer.js

Modifies the process of an event moving away from the player as follows:

1. If the player and event are at the same coordinates,
Do not move -> Move randomly

2. If the player and event are at the same X coordinate as the player and
cannot move forward,
Do not move -> Move randomly left or right

3. If the player and event are at the same Y coordinate as the player and
cannot move forward,
Do not move -> Move randomly up or down

Terms of Use:
You may modify and redistribute this plugin without permission, and there are
no restrictions on its use (commercial, R18, etc.).
This plugin is now yours.
*/

/*:ja
@plugindesc プレイヤーから遠ざかる挙動修正
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/FixMoveAwayPlayer.js
@author トリアコンタン

@help FixMoveAwayPlayer.js

イベントがプレイヤーから遠ざかる処理を以下の通り修正します。

1. プレイヤーとイベントが同座標にいる場合
移動しない -> ランダムに移動

2. プレイヤーと同一のX座標かつ前方に移動できなかった場合
移動しない -> 左右どちらかにランダム移動

3. プレイヤーと同一のY座標かつ前方に移動できなかった場合
移動しない -> 上下どちらかにランダム移動

利用規約：
 作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 についても制限はありません。
 このプラグインはもうあなたのものです。
*/

(()=> {

    const _Game_Character_moveAwayFromCharacter = Game_Character.prototype.moveAwayFromCharacter;
    Game_Character.prototype.moveAwayFromCharacter = function(character) {
        _Game_Character_moveAwayFromCharacter.apply(this, arguments);
        if (this.isMovementSucceeded()) {
            return;
        }
        const sx = this.deltaXFrom(character.x);
        const sy = this.deltaYFrom(character.y);
        if (sx === 0 && sy === 0) {
            this.moveRandom();
        } else if (sx === 0) {
            this.moveStraight(Math.random() > 0.5 ? 6 : 4);
        } else if (sy === 0) {
            this.moveStraight(Math.random() > 0.5 ? 2 : 8);
        }
    };
})();