//=============================================================================
// EventStartupTouch.js
// ----------------------------------------------------------------------------
// (C)2016 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.4.0 2023/10/11 タッチ起動のトリガーを左クリック以外にも指定可能になる機能を追加
// 1.3.0 2023/10/01 タッチ起動の判定をマスではなくイベント画像自体に変更できる機能を追加
// 1.2.2 2022/05/10 ヘルプ修正
// 1.2.1 2022/05/10 タッチイベントが終了した同一フレームでタッチイベントを開始できなくなるよう修正
// 1.2.0 2021/03/09 MZ向けにリファクタリング
// 1.1.3 2017/11/20 ヘルプのスクリプトの記述を追加
// 1.1.2 2017/02/07 端末依存の記述を削除
// 1.1.0 2016/12/29 スクリプトで通常モードと調査モードを切り替えられる機能を追加
// 1.0.0 2016/12/21 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/EventStartupTouch.js
@plugindesc Touch event triggering plugin
@author Triacontane
@license MIT License

@help
English Help Translator: munokura
Please check the URL below for the latest version of the plugin.
URL https://triacontane.blogspot.com
-----

EventStartupTouch.js

Triggers an event with a mouse click or touch.
While the currently active page is triggered, you can turn on any switch to
branch the process. When the event ends, the switch will automatically return
to OFF.

When a touch event is triggered, the default touch movement is forcibly
disabled.

This plugin requires the base plugin "PluginCommonBase.js."
"PluginCommonBase.js" is located in the following folder under the RPG Maker
MZ installation folder:
dlc/BasicResources/plugins/official

Terms of Use:
You may modify and redistribute this plugin without permission, and there are
no restrictions on its use (commercial, 18+, etc.).
This plugin is now yours.

@param InvalidSwitchId
@text Disable switch
@desc If the specified switch is ON, touch activation will be disabled.
@type switch
@default 0

@param TouchTriggerTypes
@text Touch trigger type
@desc This is the trigger type for touch activation. Multiple triggers can be specified. Depending on how you specify them, they may interfere with touch movement or the menu screen.
@type select[]
@default []
@option 左クリック
@value isTriggered
@option 右クリック
@value isCancelled
@option 左長押し
@value isLongPressed
@option 重ね合わせ
@value isHovered
@option 左リリース
@value isReleased

@param StartupSwitchId
@text Start-up trigger switch
@desc This switch turns ON when an event is started by touching it. It automatically turns OFF when the event ends.
@type switch
@default 0

@param ImageClick
@text Click on the image to launch
@desc The event trigger will be determined by the image itself, not the event square.
@type boolean
@default false

@param ValidTriggers
@text Enabled Triggers
@desc The trigger that enables touch activation.
@type select[]
@default ["0","1","2"]
@option 決定ボタン[0]
@value 0
@option プレイヤーから接触[1]
@value 1
@option イベントから接触[2]
@value 2
@option 自動実行[3]
@value 3
@option 並列処理[4]
@value 4
*/

/*:ja
@plugindesc タッチでイベント起動プラグイン
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/EventStartupTouch.js
@base PluginCommonBase
@orderAfter PluginCommonBase
@author トリアコンタン

@param InvalidSwitchId
@text 無効化スイッチ
@desc 指定したスイッチがONになっているとタッチ起動が無効になります。
@default 0
@type switch

@param TouchTriggerTypes
@text タッチトリガー種別
@desc タッチ起動のトリガー種別です。複数指定可能。指定方法によってはタッチ移動やメニュー画面と干渉する場合があります。
@default []
@type select[]
@option 左クリック
@value isTriggered
@option 右クリック
@value isCancelled
@option 左長押し
@value isLongPressed
@option 重ね合わせ
@value isHovered
@option 左リリース
@value isReleased

@param StartupSwitchId
@text 起動トリガースイッチ
@desc タッチでイベントを起動したときにONになるスイッチです。イベントが終わると自動でOFFに戻ります。
@default 0
@type switch

@param ImageClick
@text 画像クリック起動
@desc イベントの起動判定をイベントのマスではなく画像そのものにします。
@default false
@type boolean

@param ValidTriggers
@text 有効トリガー
@desc タッチ起動が有効になるトリガーです。
@default ["0","1","2"]
@type select[]
@option 決定ボタン[0]
@value 0
@option プレイヤーから接触[1]
@value 1
@option イベントから接触[2]
@value 2
@option 自動実行[3]
@value 3
@option 並列処理[4]
@value 4

@help EventStartupTouch.js

マウスクリックおよびタッチでイベントを起動します。
起動されるのは現在の有効ページですが、任意のスイッチをONにできるので
処理を分岐できます。イベントが終了すると当該スイッチは自動でOFFに戻ります。

タッチイベント起動時、デフォルトのタッチ移動は強制的に無効化されます。

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
    let eventTouchFrame = 0;

    //=============================================================================
    // Game_Player
    //  タッチでイベントを起動する処理を追加します。
    //=============================================================================
    const _Game_Player_triggerTouchAction    = Game_Player.prototype.triggerTouchAction;
    Game_Player.prototype.triggerTouchAction = function() {
        const result = _Game_Player_triggerTouchAction.apply(this, arguments);
        if (!result && this.isTouchStartupValid()) {
            return this.triggerTouchActionStartupEvent();
        }
        return result;
    };

    Game_Player.prototype.isTouchStartupValid = function() {
        return !$gameSwitches.value(param.InvalidSwitchId) && TouchInput.isEventTouchTriggered() &&
            !$gameMap.isEventRunning() && eventTouchFrame !== Graphics.frameCount;
    };

    TouchInput.isEventTouchTriggered = function() {
        const methods = param.TouchTriggerTypes;
        if (methods && methods.length > 0) {
            return methods.some(method => this[method]());
        } else {
            return this.isTriggered();
        }
    };

    Game_Player.prototype.triggerTouchActionStartupEvent = function() {
        const event = this.getTouchStartupEvent();
        if (event) {
            $gameSwitches.setValue(param.StartupSwitchId, true);
            event.startForTouch();
        }
        return $gameMap.isAnyEventStarting();
    };

    Game_Player.prototype.getTouchStartupEvent = function() {
        let startupEvent = null;
        if (param.ImageClick) {
            $gameMap.events().forEach(function(event) {
                if (event.isImageClick() && event.isTriggerIn(param.ValidTriggers)) {
                    startupEvent = event;
                }
            });
        } else {
            const x = $gameMap.canvasToMapX(TouchInput.x);
            const y = $gameMap.canvasToMapY(TouchInput.y);
            $gameMap.eventsXy(x, y).some(function(event) {
                if (event.isTriggerIn(param.ValidTriggers)) {
                    startupEvent = event;
                }
                return startupEvent;
            });
        }
        return startupEvent;
    };

    //=============================================================================
    // Game_Event
    //  イベントロックを無効にします。
    //=============================================================================
    Game_Event.prototype.startForTouch = function() {
        this._noLock = true;
        this.start();
        this._noLock = false;
    };

    const _Game_Event_lock = Game_Event.prototype.lock;
    Game_Event.prototype.lock = function() {
        _Game_Event_lock.apply(this, arguments);
        if (this._noLock) {
            this.setDirection(this._prelockDirection);
        }
    };

    Game_CharacterBase.prototype.clearImageClick = function() {
        this._imageClick = false;
    };

    Game_CharacterBase.prototype.onImageClick = function() {
        this._imageClick = true;
    };

    Game_CharacterBase.prototype.isImageClick = function() {
        return this._imageClick;
    }

    //=============================================================================
    // Game_Interpreter
    //  マップイベント終了時にタッチスイッチをOFFにします。
    //=============================================================================
    const _Game_Interpreter_terminate    = Game_Interpreter.prototype.terminate;
    Game_Interpreter.prototype.terminate = function() {
        _Game_Interpreter_terminate.apply(this, arguments);
        if ($gameMap.isMapInterpreterOf(this) && this._depth === 0) {
            $gameSwitches.setValue(param.StartupSwitchId, false);
            eventTouchFrame = Graphics.frameCount;
        }
    };

    //=============================================================================
    // Game_Map
    //  指定されたインタプリタがマップイベントかどうかを返します。
    //=============================================================================
    Game_Map.prototype.isMapInterpreterOf = function(interpreter) {
        return this._interpreter === interpreter;
    };

    //=============================================================================
    // Scene_Map
    //  デフォルトのタッチ移動を無効化します。
    //=============================================================================
    const _Scene_Map_processMapTouch = Scene_Map.prototype.processMapTouch;
    Scene_Map.prototype.processMapTouch = function() {
        _Scene_Map_processMapTouch.apply(this, arguments);
        if ($gameTemp.isDestinationValid() && $gamePlayer.isTouchStartupValid() && $gamePlayer.getTouchStartupEvent()) {
            $gameTemp.clearDestination();
        }
    };

    const _Sprite_Character_update = Sprite_Character.prototype.update;
    Sprite_Character.prototype.update = function() {
        _Sprite_Character_update.apply(this, arguments);
        if (this._character && param.ImageClick && TouchInput.isTriggered()) {
            this.processTouch();
        }
    };

    Sprite_Character.prototype.processTouch = function() {
        this._character.clearImageClick();
        if (!this.bitmap || !this.bitmap.isReady()) {
            return;
        }
        const dx  = $gameScreen.disConvertPositionX(TouchInput.x) - this.x;
        const dy  = $gameScreen.disConvertPositionY(TouchInput.y) - this.y;
        const sin = Math.sin(-this.rotation);
        const cos = Math.cos(-this.rotation);
        const bx = this._frame.x + Math.floor(dx * cos + dy * -sin) / this.scale.x + this.anchor.x * this.width;
        const by = this._frame.y + Math.floor(dx * sin + dy * cos) / this.scale.y + this.anchor.y * this.height;
        if (this._frame.contains(bx, by) && this.bitmap.getAlphaPixel(bx, by) !== 0) {
            this._character.onImageClick();
        }
    };

    Game_Screen.prototype.disConvertPositionX = function(x) {
        const unshiftX = x - this.zoomX() * (1 - this.zoomScale());
        return Math.round(unshiftX / this.zoomScale());
    };

    Game_Screen.prototype.disConvertPositionY = function(y) {
        const unshiftY = y - this.zoomY() * (1 - this.zoomScale());
        return Math.round(unshiftY / this.zoomScale());
    };
})();