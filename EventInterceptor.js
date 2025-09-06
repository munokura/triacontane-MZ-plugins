/*=============================================================================
 EventInterceptor.js
----------------------------------------------------------------------------
 (C)2022 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.2.0 2024/01/29 イベントグラフィックが指定されているときだけ割り込み実行する機能を追加
 1.1.0 2022/11/04 特定のページ番号にのみ割り込みする機能を追加
                  並列処理のイベントを割り込み対象外にできる機能を追加
                  選択肢や条件分岐の分岐終了のタイミングで終了後の割り込み処理が走ってしまう問題を修正
 1.0.0 2022/11/03 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/EventInterceptor.js
@plugindesc Event processing interrupt plugin
@author Triacontane
@license MIT License

@help
English Help Translator: munokura
Please check the URL below for the latest version of the plugin.
URL https://triacontane.blogspot.com
-----

EventInterceptor.js

This plugin automatically interrupts a specified common event at the start or
end of an event. This applies to map events.
Use this when you want to execute some common processing.
Enter the tag specified in the parameter in the event's memo field.

<EvTp:aaa>

You can also omit the tag to interrupt the event unconditionally.
In this case, set the following tag in the memo field for events you do not
want to interrupt:
<EvTp:none>

If you "move location" during an event, the event will not be interrupted at
the end.
This is a restriction.

This plugin requires the base plugin "PluginCommonBase.js."
"PluginCommonBase.js" is located in the following folder under the RPG Maker
MZ installation folder:

dlc/BasicResources/plugins/official

Terms of Use:
You may modify and redistribute this plugin without permission from the
author, and there are no restrictions on its use (commercial, 18+, etc.).
This plugin is now yours.

@param interceptorList
@text Interrupt Settings List
@desc A list of common events that can be executed. Only one with a matching tag will be executed.
@type struct<Interceptor>[]
@default []

@param tagName
@text Tag Name
@desc The tag name used to determine the event type.
@default EvTp
*/

/*~struct~Interceptor:
@param id
@text identifier
@desc It is a name for identification purposes and has no particular use.

@param tagValue
@text Tag setting value
@desc If the specified tag (<EvTp:aaa>) is entered in the event memo field, the interrupt will be executed. If not specified, the interrupt will be executed unconditionally.
@default aaa

@param timing
@text timing
@desc The timing of the interruption. You can select before or after the event starts.
@type select
@default start
@option Before starting
@value start
@option After the end
@value finish

@param pageIndex
@text Page Index
@desc Executes only when the event page matches the specified value.
@type number
@default 0

@param graphicExist
@text Graphic existence check
@desc Executes only when an event graphic (not including tiles) is specified.
@type boolean
@default false

@param invalidParallel
@text Parallel processing disabled
@desc It does not interrupt parallel map events.
@type boolean
@default false

@param commonEventId
@text Common Event ID
@desc The ID of the common event to execute.
@type common_event
@default 1
*/

/*:ja
@plugindesc イベント処理の割り込みプラグイン
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/EventInterceptor.js
@base PluginCommonBase
@orderAfter PluginCommonBase
@author トリアコンタン

@param interceptorList
@text 割り込み設定リスト
@desc 割り込んで実行できるコモンイベントのリストです。実行されるのはタグが一致したひとつだけです。
@default []
@type struct<Interceptor>[]

@param tagName
@text タグ名
@desc イベントタイプを判定するためのタグ名称です。
@default EvTp

@help EventInterceptor.js

イベントの開始もしくは終了時に指定したコモンイベントを自動で
割り込み実行できます。マップイベントが対象です。
何らかの共通処理を実行したいときに使用します。
パラメータで指定したタグをイベントのメモ欄に記述して使います。

<EvTp:aaa>

タグの指定を無しにして無条件で割り込みすることに可能です。
その場合、割り込み不要なイベントには以下のタグをメモ欄に設定します。　
<EvTp:none>

イベント中で『場所移動』した場合、終了の割り込みは行われません。
こちらは制約事項となります。

このプラグインの利用にはベースプラグイン『PluginCommonBase.js』が必要です。
『PluginCommonBase.js』は、RPGツクールMZのインストールフォルダ配下の
以下のフォルダに格納されています。
dlc/BasicResources/plugins/official

利用規約：
 作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 についても制限はありません。
 このプラグインはもうあなたのものです。
*/

/*~struct~Interceptor:ja

@param id
@text 識別子
@desc 識別用の名称です。特に用途はありません。
@default

@param tagValue
@text タグ設定値
@desc 指定したタグ(<EvTp:aaa>)がイベントのメモ欄に記載されていれば割り込みを実行します。指定がない場合は無条件で実行します。
@default aaa

@param timing
@text タイミング
@desc 割り込みのタイミングです。イベント開始前と終了後を選択できます。
@default start
@type select
@option 開始前
@value start
@option 終了後
@value finish

@param pageIndex
@text ページインデックス
@desc イベントのページが指定値と一致するときだけ実行します。
@default 0
@type number

@param graphicExist
@text グラフィック存在判定
@desc イベントグラフィック(タイルは含まない)が指定されているときだけ実行します。
@default false
@type boolean

@param invalidParallel
@text 並列処理は無効
@desc 並列処理のマップイベントには割り込みしません。
@default false
@type boolean

@param commonEventId
@text コモンイベントID
@desc 実行するコモンイベントのIDです。
@default 1
@type common_event
*/

(() => {
    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);
    if (!param.interceptorList) {
        param.interceptorList = [];
    }

    const _Game_Event_initialize = Game_Event.prototype.initialize;
    Game_Event.prototype.initialize = function(mapId, eventId) {
        _Game_Event_initialize.apply(this, arguments);
        this._eventType = PluginManagerEx.findMetaValue(this.event(), param.tagName);
    };

    Game_Event.prototype.findEventType = function() {
        return this._eventType;
    };

    const _Game_Interpreter_setup = Game_Interpreter.prototype.setup;
    Game_Interpreter.prototype.setup = function(list, eventId) {
        _Game_Interpreter_setup.apply(this, arguments);
        this.setupInterceptor(eventId, 'start');
    };

    const _Game_Interpreter_command0 = Game_Interpreter.prototype.command0;
    Game_Interpreter.prototype.command0 = function() {
        if (_Game_Interpreter_command0) {
            _Game_Interpreter_command0.apply(this, arguments);
        }
        if (this._list[this._index + 1]) {
            return true;
        }
        this.setupInterceptor(this.eventId(), 'finish');
        return true;
    };

    Game_Interpreter.prototype.setupInterceptor = function(eventId, timing) {
        const event = $gameMap.event(eventId);
        if (this._depth > 0 || !this.isOnCurrentMap() || !event) {
            return;
        }
        const interceptor = param.interceptorList.find(item => this.isInterceptorValid(item, event, timing));
        if (!interceptor) {
            return;
        }
        const commonEvent = $dataCommonEvents[interceptor.commonEventId];
        if (!commonEvent) {
            return;
        }
        this.setupChild(commonEvent.list, eventId);
    };

    Game_Interpreter.prototype.isInterceptorValid = function(item, event, timing) {
        const type = event.findEventType();
        const pageIndex = event._pageIndex + 1;
        if (item.timing !== timing) {
            return false;
        } else if (item.invalidParallel && !($gameMap.isInterpreterOf(this))) {
            return false;
        } else if (item.pageIndex > 0 && pageIndex !== item.pageIndex) {
            return false;
        } else if (item.graphicExist && !event.characterName()) {
            return false;
        } else if (!item.tagValue && type !== 'none') {
            return true;
        } else if (item.tagValue === type) {
            return true;
        } else {
            return false;
        }
    };
})();