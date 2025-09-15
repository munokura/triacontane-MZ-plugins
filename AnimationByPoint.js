/*=============================================================================
 AnimationByPoint.js
----------------------------------------------------------------------------
 (C)2020 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 2.3.0 2024/06/16 MV方式のアニメーションに角度を設定できる機能を追加
 2.2.1 2024/03/16 戦闘中にマップ座標のアニメーションを表示したとき専用エラーになるよう修正
 2.2.0 2024/03/16 アニメーションやフキダシをループ再生する機能を追加
 2.1.1 2024/01/16 戦闘中にアニメーションを表示したとき、完了までウェイトを無効にしていてもイベント実行が止まってしまう場合がある問題を修正
 2.1.0 2023/03/27 RemoveAnimation.jsと組み合わせて表示中のアニメーションやフキダシを即時消去できる機能を追加
 2.0.0 2022/10/16 フキダシもアニメーションと同様に表示できる機能を追加
 1.2.1 2022/06/30 ヘルプ文言修正
 1.2.0 2022/06/30 アニメーションをマップのスクロールに合わせる機能を追加
 1.1.0 2021/01/03 マップ座標にアニメーションを表示できるコマンドを追加
 1.0.0 2020/12/29 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/AnimationByPoint.js
@plugindesc Animation display plugin for specified coordinates
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

AnimationByPoint.js

Provides commands to display animations or speech bubbles at specified
coordinates (pixels) on the screen.
Since there is no animation target, flashing to the target is disabled.
Also, due to the plugin's structure, priority change functionality cannot be
added.

If you want to display speech bubbles on the battle screen, you will need the
separate "BattleBalloon.js" plugin.
It is distributed in the same location as this plugin.

To immediately remove currently displayed animations or speech bubbles, apply
the separate "RemoveAnimation.js" plugin and execute the remove command.

This plugin requires the base plugin "PluginCommonBase.js."
"PluginCommonBase.js" is located in the following folder under the RPG Maker
MZ installation folder:
dlc/BasicResources/plugins/official

Terms of Use:
You may modify and redistribute this plugin without permission, and there are
no restrictions on its use (commercial, R18, etc.).
This plugin is now yours.

@command SHOW_ANIMATION
@text Animation display
@desc Displays animations and speech bubbles at specified coordinates (pixels) on the screen.
@arg label
@text label
@desc This is the label of the animation to be displayed. Specify this in advance if you want to erase the animation midway.
@arg id
@text Animation ID
@desc The animation ID to display.
@type animation
@default 1
@arg balloonId
@text Speech bubble ID
@desc The balloon ID to display. Specify this if you want to display a balloon instead of an animation.
@type select
@default 0
@option none
@value 0
@option Surprise
@value 1
@option Hatena
@value 2
@option note
@value 3
@option heart
@value 4
@option anger
@value 5
@option sweat
@value 6
@option crumpled
@value 7
@option silence
@value 8
@option light bulb
@value 9
@option Zzz
@value 10
@option User-defined 1
@value 11
@option User-defined 2
@value 12
@option User-defined 3
@value 13
@option User-defined 4
@value 14
@option User-defined 5
@value 15
@arg positionType
@text Coordinate Type
@desc Select the coordinate determination type from Screen Coordinates or Map Coordinates.
@type select
@default screen
@option Screen coordinates
@value screen
@option Map Coordinates
@value map
@arg x
@text X coordinate
@desc The X coordinate to display the animation.
@type number
@default 0
@arg y
@text Y coordinate
@desc The Y coordinate to display the animation.
@type number
@default 0
@arg wait
@text Wait until completion
@desc Waits for the event to finish animating.
@type boolean
@default false
@arg scroll
@text Linked to scrolling
@desc The animation coordinates change as you scroll the map.
@type boolean
@default false
@arg loop
@text Loop Playback
@desc The animation will be played in a loop. To stop it, clear the animation.
@type boolean
@default false
@arg angle
@text angle
@desc The angle of the animation (0-360). Only valid for MV animations.
@type number
@default 0
@min 0
@max 360

@command REMOVE_ANIMATION
@text Clear Animation
@desc Specify a label to immediately remove any animations or balloons currently being displayed. RemoveAnimation.js is required for use.
@arg label
@text label
@desc Specifies the label to display when animating.
*/

/*:ja
@plugindesc 指定座標へのアニメ表示プラグイン
@target MZ
@base PluginCommonBase
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/AnimationByPoint.js
@author トリアコンタン

@command SHOW_ANIMATION
@text アニメーション表示
@desc 画面上の指定座標(ピクセル指定)にアニメーションやフキダシを表示します。

@arg label
@text ラベル
@desc 表示するアニメーションのラベルです。途中消去する場合にあらかじめ指定しておきます。
@default

@arg id
@text アニメーションID
@desc 表示するアニメーションIDです。
@default 1
@type animation

@arg balloonId
@text フキダシID
@desc 表示するフキダシIDです。アニメーションではなくフキダシを表示したいときはこちらを指定します。
@default 0
@type select
@option なし
@value 0
@option びっくり
@value 1
@option はてな
@value 2
@option 音符
@value 3
@option ハート
@value 4
@option 怒り
@value 5
@option 汗
@value 6
@option くしゃくしゃ
@value 7
@option 沈黙
@value 8
@option 電球
@value 9
@option Zzz
@value 10
@option ユーザ定義1
@value 11
@option ユーザ定義2
@value 12
@option ユーザ定義3
@value 13
@option ユーザ定義4
@value 14
@option ユーザ定義5
@value 15

@arg positionType
@text 座標タイプ
@desc 座標の決定タイプを画面座標とマップ座標から選択します。
@default screen
@type select
@option 画面座標
@value screen
@option マップ座標
@value map

@arg x
@text X座標
@desc アニメーションを表示するX座標です。
@default 0
@type number

@arg y
@text Y座標
@desc アニメーションを表示するY座標です。
@default 0
@type number

@arg wait
@text 完了までウェイト
@desc アニメーション表示が終わるまでイベントの進行を待機します。
@default false
@type boolean

@arg scroll
@text スクロールに連動
@desc マップをスクロールに合わせてアニメーションの表示座標が変わります。
@default false
@type boolean

@arg loop
@text ループ再生
@desc アニメーションをループ再生します。止めるときはアニメーション消去から止めてください。
@default false
@type boolean

@arg angle
@text 角度
@desc アニメーションの角度(0-360)です。MV方式のアニメーションのみ有効です。
@default 0
@type number
@min 0
@max 360

@command REMOVE_ANIMATION
@text アニメーション消去
@desc ラベルを指定して表示中のアニメーションやフキダシを即時消去します。利用にはRemoveAnimation.jsが必要です。

@arg label
@text ラベル
@desc 表示する際に指定してアニメーションのラベルです。
@default

@help AnimationByPoint.js

画面上の指定座標(ピクセル指定)にアニメーションやフキダシをを表示する
コマンドを提供します。
アニメーションの対象が存在しないため、対象へのフラッシュは無効です。
またプラグインの構造上、プライオリティ変更の機能追加はできません。

フキダシを戦闘画面で表示したい場合、別途『BattleBalloon.js』が
必要です。本プラグインと同じ場所で配布しています。

表示中のアニメーションやフキダシを即時消去したいときは
別途『RemoveAnimation.js』を適用して消去コマンドを実行してください。

このプラグインの利用にはベースプラグイン『PluginCommonBase.js』が必要です。
『PluginCommonBase.js』は、RPGツクールMZのインストールフォルダ配下の
以下のフォルダに格納されています。
dlc/BasicResources/plugins/official

利用規約：
 作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 についても制限はありません。
 このプラグインはもうあなたのものです。
*/

(() => {
    'use strict';
    const script = document.currentScript;

    PluginManagerEx.registerCommand(script, 'SHOW_ANIMATION', function(args) {
        if (args.positionType === 'map') {
            if ($gameParty.inBattle()) {
                PluginManagerEx.throwError(
                    'In battle, you can\'t specify map coordinates. Please specify screen coordinates.', script);
            }
            args.x = $gameMap.convertToScreenX(args.x);
            args.y = $gameMap.convertToScreenY(args.y);
        }
        this.requestAnimationByPoint(args);
    });

    PluginManagerEx.registerCommand(script, 'REMOVE_ANIMATION', function(args) {
        $gameTemp.removePointAnimation(args.label);
    });

    Game_Map.prototype.convertToScreenX = function(mapX) {
        const tw = $gameMap.tileWidth();
        return Math.floor($gameMap.adjustX(mapX) * tw + tw / 2);
    };

    Game_Map.prototype.convertToScreenY = function(mapY) {
        const th = $gameMap.tileHeight();
        return Math.floor($gameMap.adjustY(mapY) * th + th / 2);
    };

    Game_Interpreter.prototype.requestAnimationByPoint = function(args) {
        const point = new Game_AnimationPoint(args);
        point.request();
        if (args.wait) {
            this.setWaitMode("pointAnimation");
        }
    };

    Game_Temp.prototype.pushPointAnimation = function(point) {
        if (!this._pointQueue) {
            this._pointQueue = [];
        }
        this._pointQueue.push(point);
    };

    Game_Temp.prototype.removePointAnimation = function(label) {
        if (!this._pointQueue) {
            return;
        }
        this._pointQueue
            .filter(target => target.getLabel() === label)
            .forEach(target => target.endLoop());
        this._pointQueue = this._pointQueue.filter(target => target.isAnimationPlaying());
    };

    Spriteset_Base.prototype.findPointTargetSprite = function(point) {
        if (point instanceof Point) {
            const sprite = new Sprite_AnimationPoint(point);
            this.addChild(sprite);
            return sprite;
        } else {
            return null;
        }
    };

    const _Spriteset_Base_removeAnimation = Spriteset_Base.prototype.removeAnimation;
    Spriteset_Base.prototype.removeAnimation = function(sprite) {
        _Spriteset_Base_removeAnimation.apply(this, arguments);
        sprite._targets.forEach(targetSprite => {
            if (targetSprite instanceof Sprite_AnimationPoint) {
                this.removeChild(targetSprite);
            }
        })
    };

    const _Spriteset_Map_removeBalloon = Spriteset_Map.prototype.removeBalloon;
    Spriteset_Map.prototype.removeBalloon = function(sprite) {
        _Spriteset_Map_removeBalloon.apply(this, arguments);
        const targetSprite = sprite._target;
        if (targetSprite instanceof Sprite_AnimationPoint) {
            this.removeChild(targetSprite);
        }
    };

    const _Spriteset_Map_findTargetSprite = Spriteset_Map.prototype.findTargetSprite
    Spriteset_Map.prototype.findTargetSprite = function(target) {
        const sprite = _Spriteset_Map_findTargetSprite.apply(this, arguments);
        return sprite ? sprite : this.findPointTargetSprite(target);
    };

    const _Spriteset_Battle_findTargetSprite = Spriteset_Battle.prototype.findTargetSprite
    Spriteset_Battle.prototype.findTargetSprite = function(target) {
        const sprite = _Spriteset_Battle_findTargetSprite.apply(this, arguments);
        return sprite ? sprite : this.findPointTargetSprite(target);
    };

    const _Spriteset_Base_isAnimationPlaying = Spriteset_Base.prototype.isAnimationPlaying;
    Spriteset_Base.prototype.isAnimationPlaying = function() {
        const result = _Spriteset_Base_isAnimationPlaying.apply(this, arguments);
        if (result) {
            if (this._animationSprites.every(sprite => sprite.targetObjects[0] instanceof Point)) {
                return false;
            }
        }
        return result;
    };

    let pointAnimationCount = 0;

    const _Game_Interpreter_updateWaitMode = Game_Interpreter.prototype.updateWaitMode;
    Game_Interpreter.prototype.updateWaitMode = function() {
        if (this._waitMode === 'pointAnimation') {
            if (pointAnimationCount === 0) {
                this._waitMode = '';
                return false;
            } else {
                return true;
            }
        } else {
            return _Game_Interpreter_updateWaitMode.apply(this, arguments);
        }
    };

    const _Spriteset_Base_createAnimationSprite = Spriteset_Base.prototype.createAnimationSprite;
    Spriteset_Base.prototype.createAnimationSprite = function(
        targets, animation, mirror, delay
    ) {
        _Spriteset_Base_createAnimationSprite.apply(this, arguments);
        const sprite = this._animationSprites[this._animationSprites.length - 1];
        const point = sprite.targetObjects[0];
        if (point instanceof Game_AnimationPoint) {
            sprite.rotation = point.getRotation();
        }
    }

    class Game_AnimationPoint extends Point {
        constructor(args) {
            super(args.x, args.y);
            this._wait = args.wait;
            this._scroll = args.scroll;
            this._label = args.label;
            this._loop = args.loop;
            this._animationId = args.id;
            this._balloonId = args.balloonId;
            this._rotation = (args.angle || 0) * Math.PI / 180;
        }

        request() {
            if (this._animationId > 0) {
                $gameTemp.requestAnimation([this], this._animationId);
            } else if (this._balloonId > 0) {
                $gameTemp.requestBalloon(this, this._balloonId);
            }
            if (this._label) {
                $gameTemp.pushPointAnimation(this);
            }
        }

        endLoop() {
            this._loop = false;
            if (this._animationId) {
                this.endAnimation();
            } else if (this._balloonId > 0) {
                this.endBalloon();
            }
        }

        startAnimation() {
            if (this._wait) {
                pointAnimationCount++;
            }
            this._playing = true;
        }

        endAnimation() {
            if (this._wait) {
                pointAnimationCount--;
            }
            this._playing = false;
            if (this._loop) {
                this._wait = false;
                this.request();
            }
        }

        startBalloon() {
            if (this._wait) {
                pointAnimationCount++;
            }
            this._playing = true;
        }

        endBalloon() {
            if (this._wait) {
                pointAnimationCount--;
            }
            this._playing = false;
            if (this._loop) {
                this._wait = false;
                this.request();
            }
        }

        isScroll() {
            return this._scroll;
        }

        isAnimationPlaying() {
            return this._playing;
        }

        isBalloonPlaying() {
            return this._playing;
        }

        getLabel() {
            return this._label;
        }

        getRotation() {
            return this._rotation;
        }
    }

    class Sprite_AnimationPoint extends Sprite {
        constructor(point) {
            super();
            this._point = point;
            this._dx = $gameMap.displayX();
            this._dy = $gameMap.displayY();
            this.rotation = this._point.getRotation();
            this.update();
        }

        update() {
            super.update();
            this.x = this._point.x;
            this.y = this._point.y;
            if (this._point.isScroll()) {
                this.x += (this._dx - $gameMap.displayX()) * $gameMap.tileWidth();
                this.y += (this._dy - $gameMap.displayY()) * $gameMap.tileWidth();
            }
        }
    }
})();