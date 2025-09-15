/*=============================================================================
 MessageAutoReplace.js
----------------------------------------------------------------------------
 (C)2022 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.2.1 2023/12/03 1.2.0の機能で置換後に制御文字を指定したとき、変換が行われない問題を修正
 1.2.0 2023/12/02 データベースの説明文などにも置換を適用できる機能を追加
 1.1.0 2022/04/05 正規表現の凡例をヘルプに追加
 1.0.0 2022/04/05 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/MessageAutoReplace.js
@plugindesc Message Auto-Replacement Plug-in
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

MessageAutoReplace.js

Automatically replaces text in the "Sentence Display" section based on
specified parameters.
This can be used to batch-modify specific strings, such as by adding control
characters, changing font size, or making corrections.
You can also specify replacement condition switches, allowing you to use them
appropriately.

Advanced replacements using regular expressions are also possible.
To use backreferences, specify %1, %2... as the replacement text.

Commonly used regular expressions:
. : Matches any single character.
: Matches the preceding character 0 or more times.
+ : Matches the preceding character 1 or more times.
? : Matches the preceding character 0 or 1 time.
{n} : Matches the preceding character n times.
[abc] : Matches a, b, or c.
[a-z] : Matches any single character from a to z.
[^a-z]: Matches any single character except a through z.
\: Escapes special characters.
^: Matches the beginning of a sentence.
$: Matches the end of a sentence.
\d: Matches a digit.
\D: Matches a non-digit character.
\s: Matches a whitespace character.
\S: Matches a non-whitespace character.

This plugin requires the base plugin "PluginCommonBase.js."
"PluginCommonBase.js" is located in the following folder under the RPG Maker
MZ installation folder:
dlc/BasicResources/plugins/official

Terms of Use:
You may modify and redistribute this plugin without permission, and there are
no restrictions on its use (commercial, R18, etc.).
This plugin is now yours.

@param replaceList
@text Replacement List
@desc This is a list that automatically replaces the contents of all "Show Text".
@type struct<REPLACE>[]
@default []

@param applyDescription
@text Also applies to descriptions
@desc The replacement is also applied to the descriptions of items, etc. It affects all places where conversion processing by control characters is applied.
@type boolean
@default false
*/

/*~struct~REPLACE:
@param targetText
@text Replacement text
@desc Replaces occurrences of the specified text with the replacement text.
@type string

@param text
@text Replacement text
@desc The replacement text.
@type string

@param switchId
@text Condition Switch
@desc It will only be replaced when the specified switch is ON. If not specified, it will always be added.
@type switch
@default 0
*/

/*:ja
@plugindesc メッセージ自動置換プラグイン
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/MessageAutoReplace.js
@base PluginCommonBase
@orderAfter PluginCommonBase
@author トリアコンタン

@param replaceList
@text 置換リスト
@desc すべての『文章の表示』の内容を自動で置換するリストです。
@default []
@type struct<REPLACE>[]

@param applyDescription
@text 説明文にも適用
@desc アイテムなどの説明文にも置換を適用します。制御文字による変換処理が掛かる箇所すべてに影響します。
@default false
@type boolean

@help MessageAutoReplace.js

指定されたパラメータに基づいて『文章の表示』テキストを自動置換します。
特定の文字列に対して制御文字による装飾やフォントサイズの変更、修正などを
一括で行う場合などに使用できます。
置換条件スイッチも指定できるので状況に応じた使い分けも可能です。

正規表現を使った高度な置換も可能です。
後方参照を使う場合は、置換後のテキストに%1, %2...を指定します。

よく使う正規表現です。
. : 任意の一文字にマッチします。
* : 直前の文字の0回以上の繰り返しにマッチします。
+ : 直前の文字の1回以上の繰り返しにマッチします。
? : 直前の文字の0回か1回の出現にマッチします。
{n} : 直前の文字のn回の繰り返しにマッチします。
[abc] : aかbかcのいずれかの一文字にマッチします。
[a-z] : aからzまでの任意の一文字にマッチします。
[^a-z] : aからzまで以外の任意の一文字にマッチします。
\ : 特殊文字をエスケープします。
^ : 文章の始めにマッチします。
$ : 文章の終わりにマッチします。
\d : 数字にマッチします。
\D : 数字以外にマッチします。
\s : 空白文字にマッチします。
\S : 空白文字以外にマッチします。

このプラグインの利用にはベースプラグイン『PluginCommonBase.js』が必要です。
『PluginCommonBase.js』は、RPGツクールMZのインストールフォルダ配下の
以下のフォルダに格納されています。
dlc/BasicResources/plugins/official

利用規約：
 作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 についても制限はありません。
 このプラグインはもうあなたのものです。
*/

/*~struct~REPLACE:ja

@param targetText
@text 置換対象テキスト
@desc 指定したテキストに一致する文字列を置換後のテキストに置き換えます。
@default
@type string

@param text
@text 置換後のテキスト
@desc 置き換え後のテキストです。
@default
@type string

@param switchId
@text 条件スイッチ
@desc 指定したスイッチがONのときのみ置換されます。指定が無い場合、常に追加されます。
@default 0
@type switch
*/

(() => {
    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);
    if (!param.replaceList) {
        param.replaceList = [];
    }

    const _Game_Message_allText = Game_Message.prototype.allText;
    Game_Message.prototype.allText = function() {
        return this.applyTextReplace(_Game_Message_allText.apply(this, arguments))
    };

    Game_Message.prototype.applyTextReplace = function(text) {
        param.replaceList.forEach(item => {
            if (item.switchId && !$gameSwitches.value(item.switchId)) {
                return;
            }
            const regExp = new RegExp(item.targetText, 'g');
            text = text.replace(regExp, function() {
                const params = Array.from(arguments).slice(1);
                return item.text.format.apply(item.text, params);
            });
        });
        return text;
    };

    const _Window_Base_convertEscapeCharacters = Window_Base.prototype.convertEscapeCharacters;
    Window_Base.prototype.convertEscapeCharacters = function(text) {
        if (param.applyDescription) {
            arguments[0] = $gameMessage.applyTextReplace(text);
        }
        return _Window_Base_convertEscapeCharacters.apply(this, arguments);
    };
})();