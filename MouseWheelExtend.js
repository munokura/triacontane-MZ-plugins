//=============================================================================
// MouseWheelExtend.js
// ----------------------------------------------------------------------------
// (C)2016 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.3.0 2023/07/05 MZで動作するよう修正
// 1.2.0 2017/05/18 ホイールクリックしたときにスイッチを切り替えられる機能を追加
// 1.1.0 2016/07/04 マウスホイールの状態をスイッチや変数に格納する機能など4種類の機能を追加
// 1.0.0 2016/07/03 初版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/MouseWheelExtend.js
@plugindesc Mouse Wheel Extension Plugin
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

MouseWheelExtend.js

Extends the rarely used mouse wheel functionality.
You can enable or disable it individually.
Please note that this feature is useless in environments without a mouse wheel
(smartphones, some PCs).

Some mice may not have left/right scrolling or may not function properly.

- Send Message
Rotate the mouse wheel toward you to send a message. It cannot be reverted.

- Move Cursor
Move the mouse wheel to move the window cursor.

- Click to Confirm/Cancel
Gives mouse wheel clicks the same functionality as the Confirm and Cancel
buttons.
If both are specified, the Confirm button takes priority.

- Click to Switch/Toggle
Clicking the mouse wheel turns on any switch. Only valid on the map screen.
Can be used to trigger common events, etc.
When toggled, the switch will toggle on/off with each click.

- Scroll as D-pad
Gives mouse wheel scrolling the same functionality as the D-pad.

Scrolling Variables
Set the value of any variable by scrolling the mouse wheel.
Down: 2, Left: 4, Right: 6, Up: 8. Valid only on the map screen.

This plugin does not have any plugin commands.

Terms of Use:
You may modify and redistribute it without permission from the author, and
there are no restrictions on its use (commercial, R18+, etc.).
This plugin is now yours.

@param scrollMessage
@text Scroll to send a message
@desc Roll the mouse wheel forward to send a message. There is no undo.
@type boolean
@default true

@param scrollCursor
@text Scroll to move the cursor
@desc Move the mouse wheel to move the cursor in the window.
@type boolean
@default true

@param scrollDirection
@text Scroll and use directional buttons
@desc Makes scrolling the mouse wheel function the same as the directional buttons.
@type boolean
@default false

@param scrollVariable
@text Assign variables by scrolling
@desc Scrolling the mouse wheel sets the value of any variable.
@type variable
@default 0

@param click
@text Click operation
@desc Select the action to be performed when you click the mouse wheel.
@type select
@default ok
@option なし
@option decision
@value ok
@option cancel
@value cancel
@option Switch (Switch with specified number ON)
@value switch
@option Toggle (switch the specified number)
@value toggle

@param clickSwitch
@text Click Switch Number
@desc This is the target switch number when the click operation is specified as a switch or toggle.
@type switch
@default 0

@param sensitivityY
@text Sensitivity Y
@desc This is the sensitivity of the vertical rotation of the mouse wheel. Normally, this setting is OK.
@default 4

@param sensitivityX
@text Sensitivity X
@desc This is the sensitivity of the horizontal rotation of the mouse wheel. Normally, this setting is OK.
@default 4
*/

/*:ja
@plugindesc マウスホイール拡張プラグイン
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/MouseWheelExtend.js
@base PluginCommonBase
@orderAfter PluginCommonBase
@author トリアコンタン

@param scrollMessage
@text スクロールでメッセージ送り
@desc マウスホイールを手前に回転させてメッセージ送りをします。戻すことはできません。
@default true
@type boolean

@param scrollCursor
@text スクロールでカーソル移動
@desc マウスホイールを動かしてウィンドウのカーソルを移動します。
@default true
@type boolean

@param scrollDirection
@text スクロールで方向ボタン操作
@desc マウスホイールのスクロールに方向ボタンと同等の機能を持たせます。
@default false
@type boolean

@param scrollVariable
@text スクロールで変数代入
@desc マウスホイールのスクロールで任意の変数に値を設定します。
下:2 左:4 右:6 上:8　マップ画面でのみ有効です。
@default 0
@type variable

@param click
@text クリック操作
@desc マウスホイールをクリックしたときの操作を選択します。
@default ok
@type select
@option なし
@value
@option 決定
@value ok
@option キャンセル
@value cancel
@option スイッチ(指定した番号のスイッチON)
@value switch
@option トグル(指定した番号のスイッチ切り替え)
@value toggle

@param clickSwitch
@text クリックスイッチ番号
@desc クリック操作をスイッチ、トグルに指定した場合の対象スイッチ番号です。
@default 0
@type switch

@param sensitivityY
@text 感度Y
@desc マウスホイールの縦回転の感度です。通常はこのままでOKです。
@default 4

@param sensitivityX
@text 感度X
@desc マウスホイールの横回転の感度です。通常はこのままでOKです。
@default 4

@help MouseWheelExtend.js

あまり使用されていないマウスホイールの機能を拡張します。
個別に使用可否を設定できます。
マウスホイールのない環境（スマートフォン、一部のPC）では意味がないので
注意してください。マウスによっては左右スクロールがない or 正しく取得できない
場合があります。

・メッセージ送り
マウスホイールを手前に回転させてメッセージ送りをします。戻すことはできません。

・カーソル移動
マウスホイールを動かしてウィンドウのカーソルを移動します。

・クリックで決定、キャンセル
マウスホイールのクリックに決定、キャンセルボタンと同等の機能を持たせます。
両方指定すると決定ボタンが優先されます。

・クリックでスイッチ、トグル
マウスホイールのクリックで任意のスイッチをONにします。マップ画面でのみ有効です。
コモンイベントのトリガー等に使用できます。
トグルの場合はクリックするたびにスイッチのON/OFFが切り替わります。

・スクロールで十字キー
マウスホイールのスクロールに十字キーと同等の機能を持たせます。

・スクロールで変数
マウスホイールのスクロールで任意の変数に値を設定します。
下:2 左:4 右:6 上:8　マップ画面でのみ有効です。

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
    const ButtonName = {
        OK: 'ok',
        CANCEL: 'escape',
        UP: 'up',
        DOWN: 'down',
        RIGHT: 'right',
        LEFT: 'left'
    }

    const _Game_Map_update = Game_Map.prototype.update;
    Game_Map.prototype.update = function(sceneActive) {
        _Game_Map_update.apply(this, arguments);
        this.updateWheelTrigger();
    };

    Game_Map.prototype.updateWheelTrigger = function() {
        if (TouchInput.isMiddleTriggered()) {
            if (param.click === 'switch') {
                $gameSwitches.setValue(param.clickSwitch, true);
            } else if (param.click === 'toggle') {
                $gameSwitches.setValue(param.clickSwitch, !$gameSwitches.value(param.clickSwitch));
            }
        }
        if (param.scrollVariable) {
            const prevValue = $gameVariables.value(param.scrollVariable);
            let value = 0;
            if (TouchInput.isValidWheelX(false)) {
                value = 4;
            }
            if (TouchInput.isValidWheelX(true)) {
                value = 6;
            }
            if (TouchInput.isValidWheelY(false)) {
                value = 2;
            }
            if (TouchInput.isValidWheelY(true)) {
                value = 8;
            }
            if (prevValue !== value) {
                $gameVariables.setValue(param.scrollVariable, value);
            }
        }
    };
    
    if (param.scrollMessage) {
        //=============================================================================
        // Window_Message
        //  ホイールでメッセージ送りをします。
        //=============================================================================
        const _Window_Message_isTriggered      = Window_Message.prototype.isTriggered;
        Window_Message.prototype.isTriggered = function() {
            return _Window_Message_isTriggered.apply(this, arguments) || TouchInput.isValidWheelY(false);
        };
    }

    if (param.scrollCursor) {
        //=============================================================================
        // Window_Selectable
        //  ホイールでカーソル移動をします。
        //=============================================================================
        const _Window_Selectable_processCursorMove      = Window_Selectable.prototype.processCursorMove;
        Window_Selectable.prototype.processCursorMove = function() {
            const lastIndex = this.index();
            _Window_Selectable_processCursorMove.apply(this, arguments);
            if (this.index() !== lastIndex) return;
            if (this.isCursorMovable()) {
                if (TouchInput.isValidWheelY(false)) {
                    this.cursorDown(false);
                }
                if (TouchInput.isValidWheelY(true)) {
                    this.cursorUp(false);
                }
                if (TouchInput.isValidWheelX(true)) {
                    this.cursorLeft(false);
                }
                if (TouchInput.isValidWheelX(false)) {
                    this.cursorRight(false);
                }
                if (this.index() !== lastIndex) {
                    SoundManager.playCursor();
                }
            }
        };
    }


    //=============================================================================
    // TouchInput
    //  ホイールクリックを決定ボタンにリンクします。
    //=============================================================================
    const _TouchInput_update = TouchInput.update;
    TouchInput.update = function() {
        _TouchInput_update.apply(this, arguments);
        this._middleTriggered = this._onMiddleTriggered;
        this._onMiddleTriggered = false;
    };

    TouchInput.isValidWheelX = function(minus) {
        return minus ? this.wheelX <= -param.sensitivityX : this.wheelX >= param.sensitivityX;
    }

    TouchInput.isValidWheelY = function(minus) {
        return minus ? this.wheelY <= -param.sensitivityY : this.wheelY >= param.sensitivityY;
    }

    const _TouchInput__onMiddleButtonDown = TouchInput._onMiddleButtonDown;
    TouchInput._onMiddleButtonDown      = function(event) {
        _TouchInput__onMiddleButtonDown.apply(this, arguments);
        if (param.click === 'ok') {
            Input.setCurrentState(ButtonName.OK, true);
        } else if (param.click === 'cancel') {
            Input.setCurrentState(ButtonName.CANCEL, true);
        }
        this._onMiddleTriggered = true;
    };

    const _TouchInput__onMouseUp = TouchInput._onMouseUp;
    TouchInput._onMouseUp      = function(event) {
        _TouchInput__onMouseUp.apply(this, arguments);
        if (event.button === 1) {
            if (param.click === 'ok') {
                Input.setCurrentState(ButtonName.OK, false);
            } else if (param.click === 'cancel') {
                Input.setCurrentState(ButtonName.CANCEL, false);
            }
        }
    };

    TouchInput.isMiddleTriggered = function() {
        return this._middleTriggered;
    };

    if (param.scrollDirection) {
        TouchInput._wheelValidFrame = 12;
        
        const _TouchInput__onWheel = TouchInput._onWheel;
        TouchInput._onWheel      = function(event) {
            _TouchInput__onWheel.apply(this, arguments);
            if (event.deltaY <= -param.sensitivityY) {
                this._wheelUp = TouchInput._wheelValidFrame;
                Input.setCurrentState(ButtonName.UP, true);
            }
            if (event.deltaY >= param.sensitivityY) {
                this._wheelDown = TouchInput._wheelValidFrame;
                Input.setCurrentState(ButtonName.DOWN, true);
            }
            if (event.deltaX <= -param.sensitivityX) {
                this._wheelRight = TouchInput._wheelValidFrame;
                Input.setCurrentState(ButtonName.RIGHT, true);
            }
            if (event.deltaX >= param.sensitivityX) {
                this._wheelLeft = TouchInput._wheelValidFrame;
                Input.setCurrentState(ButtonName.LEFT, true);
            }
        };

        const _TouchInput_update2 = TouchInput.update;
        TouchInput.update = function() {
            _TouchInput_update2.apply(this, arguments);
            this.updateWheelDirection();
        };

        TouchInput.updateWheelDirection = function() {
            if (this._wheelUp > 0) {
                this._wheelUp--;
                if (this._wheelUp <= 0) {
                    Input.setCurrentState(ButtonName.UP, false);
                }
            }
            if (this._wheelDown > 0) {
                this._wheelDown--;
                if (this._wheelDown <= 0) {
                    Input.setCurrentState(ButtonName.DOWN, false);
                }
            }
            if (this._wheelRight > 0) {
                this._wheelRight--;
                if (this._wheelRight <= 0) {
                    Input.setCurrentState(ButtonName.RIGHT, false);
                }
            }
            if (this._wheelLeft > 0) {
                this._wheelLeft--;
                if (this._wheelLeft <= 0) {
                    Input.setCurrentState(ButtonName.LEFT, false);
                }
            }
        };
    }

    //=============================================================================
    // Input
    //  マウスホイールの情報をキー入力に変換します。
    //=============================================================================
    Input.setCurrentState = function(name, value) {
        this._currentState[name] = !!value;
    };
})();