//=============================================================================
// MessageActorFace.js
// ----------------------------------------------------------------------------
// (C)2017 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.1.0 2021/06/05 MZで動作するよう修正
// 1.0.0 2017/07/24 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/MessageActorFace.js
@plugindesc Message actor face display plugin
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

MessageActorFace.js

This plugin allows you to easily specify the actor's face graphic and name
when displaying text.

If the variable specified as a parameter contains a value, the face graphic
and name of the actor with that variable's ID will be displayed in the message
window.

If the variable's value is 0, the face graphic and name specified in "Display
Text" will be used as usual.

This plugin requires the base plugin "PluginCommonBase.js."
"PluginCommonBase.js" is located in the following folder under the RPG Maker
MZ installation folder:
dlc/BasicResources/plugins/official

Terms of Use:
You may modify and redistribute this plugin without permission from the
author, and there are no restrictions on its use (commercial, R18, etc.).
This plugin is now yours.

@param actorIdVariable
@text Actor ID variable number
@desc The variable number to get the actor ID.
@type variable
@default 0

@param speakerNameActor
@text Display actor names
@desc Also displays actor names in the Name window.
@type boolean
@default true
*/

/*:ja
@plugindesc メッセージのアクターフェイス表示プラグイン
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/MessageActorFace.js
@base PluginCommonBase
@orderAfter PluginCommonBase
@author トリアコンタン

@param actorIdVariable
@text アクターID変数番号
@desc アクターIDを取得するための変数番号です。
@default 0
@type variable

@param speakerNameActor
@text アクター名を名前表示
@desc 名前ウィンドウにもアクター名を表示します。
@default true
@type boolean

@help MessageActorFace.js

文章の表示をする際にアクターのフェイスグラフィックや名前を
簡単に指定できるようになります。

パラメータで指定した変数に値が入っている場合、その変数値のIDのアクターの
フェイスグラフィックや名前がメッセージウィンドウに指定されます。

変数の値が0の場合は、通常通り「文章の表示」で指定したフェイスになります。

このプラグインの利用にはベースプラグイン『PluginCommonBase.js』が必要です。
『PluginCommonBase.js』は、RPGツクールMZのインストールフォルダ配下の
以下のフォルダに格納されています。
dlc/BasicResources/plugins/official

利用規約：
 作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 についても制限はありません。
 このプラグインはもうあなたのものです。
*/

(function() {
    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);

    const _Game_Interpreter_command101 = Game_Interpreter.prototype.command101;
    Game_Interpreter.prototype.command101 = function() {
        const index = this._index;
        const result = _Game_Interpreter_command101.apply(this, arguments);
        if (index !== this._index) {
            this.setActorFaceImage();
        }
        return result;
    };

    Game_Interpreter.prototype.setActorFaceImage = function() {
        const actorId = $gameVariables.value(param.actorIdVariable);
        const actor = $gameActors.actor(actorId);
        if (!actor) {
            return;
        }
        $gameMessage.setFaceImage(actor.faceName(), actor.faceIndex());
        if (param.speakerNameActor) {
            $gameMessage.setSpeakerName(actor.name());
        }
    };
})();