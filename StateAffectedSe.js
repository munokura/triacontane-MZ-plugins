/*=============================================================================
 StateAffectedSe.js
----------------------------------------------------------------------------
 (C)2022 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2022/08/17 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/StateAffectedSe.js
@plugindesc State SE Playback Plugin
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

StateAffectedSe.js

Plays a sound effect when a state is activated.
It will not play if the sound effect is already active in the target state.
Register the state and sound effect combination via the parameters.

This plugin requires the base plugin "PluginCommonBase.js."
"PluginCommonBase.js" is located in the following folder under the RPG Maker
MZ installation folder:

dlc/BasicResources/plugins/official

Terms of Use:
You may modify and redistribute this plugin without permission, and there are
no restrictions on its use (commercial, 18+, etc.).
This plugin is now yours.

@param stateSeList
@text State SE List
@desc A list of combinations of states and SEs to play.
@type struct<AUDIO>[]
@default []
*/

/*~struct~AUDIO:
@param stateId
@text State ID
@desc The state for which the SE will be played.
@type state
@default 1

@param name
@text File name
@desc The file name.
@type file
@dir audio/se/

@param volume
@text volume
@desc It's volume.
@type number
@default 90
@min 0
@max 100

@param pitch
@text pitch
@desc It's the pitch.
@type number
@default 100
@min 50
@max 150

@param pan
@text Left/right balance
@desc It's a balance between left and right.
@type number
@default 0
@min -100
@max 100
*/

/*:ja
@plugindesc ステートSE演奏プラグイン
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/StateAffectedSe.js
@base PluginCommonBase
@orderAfter PluginCommonBase
@author トリアコンタン

@param stateSeList
@text ステートSEリスト
@desc ステートと演奏するSEの組み合わせのリストです。
@default []
@type struct<AUDIO>[]

@help StateAffectedSe.js

ステートが有効になったタイミングでSEを演奏します。
すでに対象ステートに掛かっている場合は演奏されません。
パラメータからステートと演奏SEの組み合わせを登録してください。

このプラグインの利用にはベースプラグイン『PluginCommonBase.js』が必要です。
『PluginCommonBase.js』は、RPGツクールMZのインストールフォルダ配下の
以下のフォルダに格納されています。
dlc/BasicResources/plugins/official

利用規約：
 作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 についても制限はありません。
 このプラグインはもうあなたのものです。
*/

/*~struct~AUDIO:ja
@param stateId
@text ステートID
@desc SEを演奏する対象のステートです。
@default 1
@type state

@param name
@text ファイル名
@desc ファイル名称です。
@default
@dir audio/se/
@type file

@param volume
@text ボリューム
@desc ボリュームです。
@default 90
@type number
@min 0
@max 100

@param pitch
@text ピッチ
@desc ピッチです。
@default 100
@type number
@min 50
@max 150

@param pan
@text 左右バランス
@desc 左右バランスです。
@default 0
@type number
@min -100
@max 100
*/

(() => {
    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);
    if (!param.stateSeList) {
        return;
    }

    AudioManager.playStateSe = function (stateId) {
        param.stateSeList.filter(audio => audio.stateId === stateId).forEach(audio => this.playSe(audio));
    }

    const _Game_BattlerBase_addNewState = Game_BattlerBase.prototype.addNewState;
    Game_BattlerBase.prototype.addNewState = function(stateId) {
        _Game_BattlerBase_addNewState.apply(this, arguments);
        AudioManager.playStateSe(stateId);
    };
})();