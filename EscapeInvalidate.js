/*=============================================================================
 EscapeInvalidate.js
----------------------------------------------------------------------------
 (C)2025 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.1.2 2025/04/19 引数を削除しない設定を追加
 1.1.1 2025/04/19 制御文字の入れ子に対応
 1.1.0 2025/04/19 制御文字をコンボボックスから指定できる機能を追加、記号の制御文字を自動でエスケープするよう修正
 1.0.0 2025/04/19 初版
----------------------------------------------------------------------------
 [X]      : https://x.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/EscapeInvalidate.js
@plugindesc Control Character Conditional Disable Plugin
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

EscapeInvalidate.js

When the specified switch is ON, it removes control characters from text.
You can set the invalidation status for each control character.

It may be possible to disable control characters added by other plugins or
control characters supported by plugins other than messages, but this may not
necessarily result in the desired behavior.

This plugin requires the base plugin "PluginCommonBase.js."
"PluginCommonBase.js" is located in the following folder
in the RPG Maker MZ installation folder:
dlc/BasicResources/plugins/official

Terms of Use:
You may modify and redistribute this plugin without permission from the
author, and there are no restrictions on its use (commercial, R18+, etc.).
This plugin is now yours.

@param escapeList
@text Control Character Disable List
@desc Sets the list of control characters to disable.
@type struct<InvalidEscape>[]
@default []
*/

/*~struct~InvalidEscape:
@param escapeCode
@text Control characters
@desc Set the code of the control character to be disabled. To disable \v[n], specify v.
@type combo
@option v
@option n
@option c
@option i
@option g
@option !
@option fs
@option px
@option py
@option {
@option }
@option <
@option >
@option $
@option |
@option ^
@option .

@param switchId
@text Switch ID
@desc When the specified switch is ON, the control characters will be disabled. If no switch is specified, they will always be disabled.
@type switch
@default 0

@param noArgument
@text Do not clear arguments
@desc Characters following control characters such as [n] and <aaa> will not be deleted. Enable this only if unexpected characters are deleted.
@type boolean
@default false
*/

/*:ja
@plugindesc 制御文字の条件付き無効化プラグイン
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/EscapeInvalidate.js
@base PluginCommonBase
@orderAfter PluginCommonBase
@author トリアコンタン

@param escapeList
@text 制御文字無効化リスト
@desc 無効化する制御文字のリストを設定します。
@default []
@type struct<InvalidEscape>[]

@help EscapeInvalidate.js

指定したスイッチがONのとき、制御文字をテキストから除去します。
制御文字ごとに無効化状況を設定できます。

他のプラグインで追加された制御文字や
メッセージ以外のプラグインの機能で制御文字をサポートしているケースでも
無効化できる可能性はありますが、希望する挙動になるとは限りません。

このプラグインの利用にはベースプラグイン『PluginCommonBase.js』が必要です。
『PluginCommonBase.js』は、RPGツクールMZのインストールフォルダ配下の
以下のフォルダに格納されています。
dlc/BasicResources/plugins/official

利用規約：
 作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 についても制限はありません。
 このプラグインはもうあなたのものです。
*/

/*~struct~InvalidEscape:ja
@param escapeCode
@text 制御文字
@desc 無効化する制御文字のコードを設定します。\v[n]を無効化する場合は、vを指定してください。
@default
@type combo
@option v
@option n
@option c
@option i
@option g
@option !
@option fs
@option px
@option py
@option {
@option }
@option <
@option >
@option $
@option |
@option ^
@option .

@param switchId
@text スイッチID
@desc 指定したスイッチがONの時、制御文字を無効化します。指定が無い場合は、常に無効化します。
@default 0
@type switch

@param noArgument
@text 引数を消去しない
@desc 制御文字に続く[n]や<aaa>などが削除対象になりません。想定外の文字が削除された場合のみ有効にします。
@default false
@type boolean
*/

(() => {
    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);
    if (!param.escapeList) {
        param.escapeList = [];
    }

    const _Window_Base_convertEscapeCharacters = Window_Base.prototype.convertEscapeCharacters;
    Window_Base.prototype.convertEscapeCharacters = function(text) {
        param.escapeList.filter(item => {
            return !item.switchId || $gameSwitches.value(item.switchId);
        }).forEach(item => {
            const code = item.escapeCode;
            const escapedCode = code.match(/^\W$/) ? '\\' + code : code;
            if (item.noArgument) {
                arguments[0] =  arguments[0]
                    .replace(new RegExp('\\\\' + escapedCode, 'mgi'), '');
            } else {
                arguments[0] =  arguments[0]
                    .replace(new RegExp('\\\\' + escapedCode + '[\\<\\[][0-9]+[\\]\\>]', 'mgi'), '')
                    .replace(new RegExp('\\\\' + escapedCode + '[\\<\\[].*?[\\]\\>]', 'mgi'), '')
                    .replace(new RegExp('\\\\' + escapedCode, 'mgi'), '');
            }
        });
        return _Window_Base_convertEscapeCharacters.apply(this, arguments);
    };
})();