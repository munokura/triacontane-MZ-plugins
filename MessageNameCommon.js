/*=============================================================================
 MessageNameCommon.js
----------------------------------------------------------------------------
 (C)2023 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.3.1 2024/05/04 ゲームスタート直後にメッセージウィンドウを一度も表示せずに
                  選択肢の表示を使用した場合にエラーが発生する不具合の修正
 1.3.0 2024/04/06 名前欄に制御文字\v[n]などが含まれていた場合は、変換後の値で一致するコモンイベントの呼び出しを行うよう修正
 1.2.0 2024/02/15 タイミングにメッセージ終了待機時を追加
 1.1.0 2024/02/14 メッセージ終了時にもコモンイベントを呼べるよう修正
 1.0.0 2023/09/23 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/MessageNameCommon.js
@plugindesc Message Name Common Plugin
@author Triacontane
@license MIT License

@help
English Help Translator: munokura
Please check the URL below for the latest version of the plugin.
URL https://triacontane.blogspot.com
-----

MessageNameCommon.js

Automatically calls a common event when a name is specified in a message
display.
Specify the name and common event ID in the plugin parameters.
This event call is only valid on the map screen.

If the name field contains control characters such as \v[n], the converted
value will be used to call the matching common event.

This plugin requires the base plugin "PluginCommonBase.js."
"PluginCommonBase.js" is located in the following folder
under the RPG Maker MZ installation folder:
dlc/BasicResources/plugins/official

Terms of Use:
You may modify and redistribute this plugin without permission, and there are
no restrictions on its use (commercial, 18+, etc.).
This plugin is now yours.

@param commonList
@text Common Event List
@desc A list of common events that can be called by name.
@type struct<COMMON>[]
@default []
*/

/*~struct~COMMON:
@param commonEventId
@text Common Event ID
@desc The ID of the common event to call.
@type common_event
@default 1

@param SpeakerName
@text name
@desc Calls a common event when the "name" of the text display matches the specified value. (Regular expressions can be used.)
@type string

@param timing
@text Message Timing
@desc Select the timing for calling the common event.
@type select
@default start
@option At the start
@value start
@option Waiting for completion
@value waiting
@option At the end
@value end
@option At the end (only if there are no continuation messages)
@value all_end
*/

/*:ja
@plugindesc メッセージ名前コモンプラグイン
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/MessageNameCommon.js
@base PluginCommonBase
@orderAfter PluginCommonBase
@author トリアコンタン

@param commonList
@text コモンイベントリスト
@desc 名前指定で呼び出すコモンイベントのリストです。
@default []
@type struct<COMMON>[]

@help MessageNameCommon.js

メッセージの表示で名前を指定したときに自動でコモンイベントを呼び出します。
名前とコモンイベントのIDをプラグインパラメータから指定してください。
このイベント呼び出しは、マップ画面でのみ有効です。

名前欄に制御文字\v[n]などが含まれていた場合は、変換後の値で
一致するコモンイベントの呼び出しを行います。

このプラグインの利用にはベースプラグイン『PluginCommonBase.js』が必要です。
『PluginCommonBase.js』は、RPGツクールMZのインストールフォルダ配下の
以下のフォルダに格納されています。
dlc/BasicResources/plugins/official

利用規約：
 作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 についても制限はありません。
 このプラグインはもうあなたのものです。
*/

/*~struct~COMMON:ja
@param commonEventId
@text コモンイベントID
@desc 呼び出すコモンイベントのIDです。
@default 1
@type common_event

@param SpeakerName
@text 名前
@desc 文章の表示の「名前」が指定値と一致するときにコモンイベントを呼び出します。（正規表現が使えます）
@default
@type string

@param timing
@text メッセージタイミング
@desc コモンイベントの呼び出しタイミングを選択します。
@default start
@type select
@option 開始時
@value start
@option 終了待機時
@value waiting
@option 終了時
@value end
@option 終了時(継続メッセージがない場合のみ)
@value all_end
*/

(() => {
    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);

    const _Window_Message_startMessage = Window_Message.prototype.startMessage;
    Window_Message.prototype.startMessage = function() {
        _Window_Message_startMessage.apply(this, arguments);
        if ($gameParty.inBattle()) {
            return;
        }
        this.callSpeakerCommon('start');
    };

    const _Window_Message_terminateMessage = Window_Message.prototype.terminateMessage;
    Window_Message.prototype.terminateMessage = function() {
        _Window_Message_terminateMessage.apply(this, arguments);
        if ($gameParty.inBattle()) {
            return;
        }
        this.callSpeakerCommon('end');
    };

    const _Window_Message_checkToNotClose = Window_Message.prototype.checkToNotClose;
    Window_Message.prototype.checkToNotClose = function() {
        _Window_Message_checkToNotClose.apply(this, arguments);
        if ($gameParty.inBattle()) {
            return;
        }
        if (this.isOpen() && this.isClosing() && !this.doesContinue()) {
            this.callSpeakerCommon('all_end');
        }
    };

    const _Window_Message_onEndOfText = Window_Message.prototype.onEndOfText;
    Window_Message.prototype.onEndOfText = function() {
        _Window_Message_onEndOfText.apply(this, arguments);
        if ($gameParty.inBattle()) {
            return;
        }
        this.callSpeakerCommon('waiting');
    };

    Window_Message.prototype.callSpeakerCommon = function(timing) {
        const speakerName = PluginManagerEx.convertEscapeCharacters($gameMessage.getLastSpeakerName());
        const commonEvents = param.commonList.filter(common => {
            return speakerName.match(new RegExp(common.SpeakerName)) && timing === (common.timing || 'start');
        });
        commonEvents.forEach(common => $gameMap.setupDynamicCommon(common.commonEventId));
    };

    const _Game_Message_setSpeakerName = Game_Message.prototype.setSpeakerName;
    Game_Message.prototype.setSpeakerName = function(speakerName) {
        _Game_Message_setSpeakerName.apply(this, arguments);
        this._lastSpakerName = speakerName;
    };

    Game_Message.prototype.getLastSpeakerName = function() {
        return this._lastSpakerName || '';
    };
})();