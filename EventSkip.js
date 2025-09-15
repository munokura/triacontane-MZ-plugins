/*=============================================================================
 EventSkip.js
----------------------------------------------------------------------------
 (C)2024 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.2.2 2025/01/03 フキダシアイコンの表示など一部コマンドの一部処理がスキップ時も等速で実行される問題を修正
 1.2.1 2024/01/21 場所移動後にローディングスピナーが消えてしまう問題を修正
 1.2.0 2024/01/20 フェードアウト中にローディングスピナーを表示できる機能を追加
 1.1.0 2024/01/20 フェードアウト時に暗転の代わりに画像を表示できる機能を追加
 1.0.0 2024/01/18 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/EventSkip.js
@plugindesc Event Skip Plugin
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

EventSkip.js

When the specified switch is turned ON during an event, the screen fades out.
While the screen is dark, the event will be executed at 32 times the normal
speed (adjustable).
Messages will also be automatically skipped. Parallel processing and battle
events are not affected.

The skip switch will turn OFF and fast execution will end when the following
conditions are met:
- When the event is executed to the end (if there is an auto-execution event
immediately after, the skip will continue).
- When transitioning to another screen, such as a battle screen.
- When a choice is displayed or a numerical input process is waiting for
input.
- When the skip switch is turned OFF.

Sound effects will be ignored during skipping.

This plugin requires the base plugin "PluginCommonBase.js."
"PluginCommonBase.js" is located in the following folder under the RPG Maker
MZ installation folder:

dlc/BasicResources/plugins/official

Terms of Use:
Modification and redistribution are permitted without the author's permission,
and there are no restrictions on usage (commercial, R18, etc.).

This plugin is now yours.

@param skipSwitchId
@text Skip Switch ID
@desc The event will be skipped when the specified switch is turned ON. Once the skip is complete, it will automatically turn OFF.
@type switch
@default 1
@min 1

@param skipSpeed
@text Skip Speed
@desc The update speed when skipping. Normal speedup is doubled. Setting a value that is too large may cause slowdowns.
@type number
@default 32
@min 2

@param fadeFrame
@text Fade Frame
@desc The number of frames it takes to fade out at the start of a skip and fade in at the end.
@type number
@default 8

@param pictureFadeImage
@text Picture Fade Image
@desc This is the image that will be displayed instead of going dark when fading out. Select it from the Background folder.
@type file
@dir img/parallaxes

@param loadingSpinner
@text Loading Spinner
@desc Shows a loading spinner while skipping.
@type boolean
@default false
*/

/*:ja
@plugindesc イベントスキッププラグイン
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/EventSkip.js
@base PluginCommonBase
@orderAfter PluginCommonBase
@author トリアコンタン

@param skipSwitchId
@text スキップスイッチID
@desc 指定したスイッチがONになったときにイベントをスキップします。スキップが終わると自動でOFFになります。
@default 1
@type switch
@min 1

@param skipSpeed
@text スキップ速度
@desc スキップ時の更新速度です。通常の高速化処理は2倍です。あまりに大きすぎる値を設定すると処理落ちの可能性があります。
@default 32
@type number
@min 2

@param fadeFrame
@text フェードフレーム
@desc スキップ開始時のフェードアウトと終了時のフェードインにかかるフレーム数です。
@default 8
@type number

@param pictureFadeImage
@text ピクチャフェード画像
@desc フェードアウト時に暗転する代わりに表示する画像です。遠景フォルダから選択します。
@default
@dir img/parallaxes
@type file

@param loadingSpinner
@text ローディングスピナー
@desc スキップ中にローディングスピナーを表示します。
@default false
@type boolean

@help EventSkip.js

イベント実行中に指定したスイッチがONになると画面がフェードアウトして
暗転中に通常の32倍(調整可)の速度でイベントを高速実行します。
メッセージも自動でスキップされます。並列処理とバトルイベントは対象外です。

以下の条件を満たすとスキップスイッチがOFFになり、高速実行は終了します。
・イベントが最後まで実行されたとき(直後に自動実行イベントがあればスキップ継続)
・戦闘画面など別画面に遷移したとき
・選択肢の表示や数値入力の処理で入力待ちになったとき
・スキップスイッチがOFFになったとき

スキップ中、効果音の演奏は無視されます。

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
    const param = PluginManagerEx.createParameter(script);

    Game_Message.prototype.isAnyChoice = function() {
        return (
            this.isChoice() ||
            this.isNumberInput() ||
            this.isItemChoice()
        );
    };

    Game_Map.prototype.isNeedEventSkip = function() {
        if ($gameMessage.isAnyChoice()) {
            return false;
        } else if (SceneManager.isSceneChanging() && !$gamePlayer.isTransferring()) {
            return false;
        } else {
            return $gameMap.isEventRunning() && $gameSwitches.value(param.skipSwitchId);
        }
    };

    Game_Map.prototype.setEventSkip = function(value) {
        this._eventSkip = value;
    };

    Game_Map.prototype.isEventSkip = function() {
        return this._eventSkip;
    };

    const _Window_Message_isTriggered = Window_Message.prototype.isTriggered;
    Window_Message.prototype.isTriggered = function() {
        const result = _Window_Message_isTriggered.apply(this, arguments);
        if ($gameMap.isEventSkip()) {
            return true;
        } else {
            return result;
        }
    };

    const _Scene_Map_initialize = Scene_Map.prototype.initialize;
    Scene_Map.prototype.initialize = function() {
        _Scene_Map_initialize.apply(this, arguments);
        this._eventSkip = $gameMap.isNeedEventSkip() || false;
        this._skipSwitchId = param.skipSwitchId;
    };

    const _Scene_Map_isFastForward = Scene_Map.prototype.isFastForward;
    Scene_Map.prototype.isFastForward = function() {
        if (this.isEventSkip()) {
            return true;
        }
        return _Scene_Map_isFastForward.apply(this, arguments);
    };

    const _Scene_Map_updateMainMultiply = Scene_Map.prototype.updateMainMultiply;
    Scene_Map.prototype.updateMainMultiply = function() {
        _Scene_Map_updateMainMultiply.apply(this, arguments);
        if (this.isEventSkip()) {
            const speed = param.skipSpeed - 2;
            for (let i = 0; i < speed; i++) {
                this.updateMain();
                this.updateChildren();
            }
        }
        this.updateEventSkip();
    };

    Scene_Base.prototype.isEventSkip = function() {
        return false;
    };

    Scene_Map.prototype.isEventSkip = function() {
        return this._eventSkip && !this.isFading();
    };

    Scene_Map.prototype.updateEventSkip = function() {
        const skip = $gameMap.isNeedEventSkip();
        if (!skip && $gameSwitches.value(this._skipSwitchId)) {
            $gameSwitches.setValue(this._skipSwitchId, false);
        }
        if (this._eventSkip !== skip) {
            this._eventSkip = skip;
            if (skip) {
                this.startEventSkip();
            } else {
                this.endEventSkip();
            }
        }
        $gameMap.setEventSkip(this.isEventSkip());
    };

    Scene_Map.prototype.startEventSkip = function() {
        this.createPictureFadeIfNeed();
        if (param.loadingSpinner) {
            Graphics.startLoading();
        }
        this.startFadeOut(param.fadeFrame, false);
    };

    Scene_Map.prototype.endEventSkip = function() {
        if (param.loadingSpinner) {
            Graphics.endLoading();
        }
        this.startFadeIn(param.fadeFrame, false);
    };

    Scene_Map.prototype.continueEventSkip = function() {
        this._fadeWhite = false;
        this._fadeOpacity = 255;
        this.createPictureFadeIfNeed();
        this.updateColorFilter();
    };

    Scene_Map.prototype.createPictureFadeIfNeed = function() {
        if (!param.pictureFadeImage) {
            return;
        }
        this._pictureFadeSprite = new TilingSprite();
        this._pictureFadeSprite.move(0, 0, Graphics.width, Graphics.height);
        this._pictureFadeSprite.bitmap = ImageManager.loadParallax(param.pictureFadeImage);
        this.addChild(this._pictureFadeSprite);
    };

    const _Scene_Map_updateColorFilter = Scene_Map.prototype.updateColorFilter;
    Scene_Map.prototype.updateColorFilter = function() {
        if (this._pictureFadeSprite) {
            if (this._fadeDuration > 0 || this._fadeOpacity > 0) {
                this._pictureFadeSprite.opacity = this._fadeOpacity;
                return;
            } else {
                this.removeChild(this._pictureFadeSprite);
                this._pictureFadeSprite = null;
            }
        }
        _Scene_Map_updateColorFilter.apply(this, arguments);
    };

    const _Scene_Map_fadeInForTransfer = Scene_Map.prototype.fadeInForTransfer;
    Scene_Map.prototype.fadeInForTransfer = function() {
        if (this.isEventSkip()) {
            this.continueEventSkip();
            return;
        }
        _Scene_Map_fadeInForTransfer.apply(this, arguments);
    };

    const _Scene_Map_fadeOutForTransfer = Scene_Map.prototype.fadeOutForTransfer;
    Scene_Map.prototype.fadeOutForTransfer = function() {
        if (this.isEventSkip()) {
            return;
        }
        _Scene_Map_fadeOutForTransfer.apply(this, arguments);
    };

    const _AudioManager_playSe = AudioManager.playSe;
    AudioManager.playSe = function(se) {
        if ($gameMap.isEventSkip()) {
            return;
        }
        _AudioManager_playSe.apply(this, arguments);
    };

    const _SceneManager_onSceneStart = SceneManager.onSceneStart;
    SceneManager.onSceneStart = function() {
        _SceneManager_onSceneStart.apply(this, arguments);
        if (this._scene.isEventSkip() && param.loadingSpinner) {
            Graphics.startLoading();
        }
    };
})();