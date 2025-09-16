/*=============================================================================
 FlexibleBattleBgm.js
----------------------------------------------------------------------------
 (C)2024 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.1.1 2025/08/30 マップから戦闘開始したとき、BGMの冒頭が重複して再生される問題を修正
 1.1.0 2024/01/12 敵グループIDの範囲指定機能を追加
 1.0.0 2024/01/06 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/FlexibleBattleBgm.js
@plugindesc Battle BGM setting plugin for each enemy group
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

FlexibleBattleBgm.js

You can set battle BGM for each enemy group.
This setting overrides the system battle BGM setting.
You can automatically play boss BGM for boss enemy groups, for example.

This plugin requires the base plugin "PluginCommonBase.js."
"PluginCommonBase.js" is located in the following folder under the RPG Maker
MZ installation folder:
dlc/BasicResources/plugins/official

Terms of Use:
You may modify and redistribute this plugin without permission, and there are
no restrictions on its use (commercial, 18+, etc.).
This plugin is now yours.

@param bgmList
@text BGM list
@desc This is a list of background music settings to be played.
@type struct<AudioBgm>[]
@default []
*/

/*~struct~AudioBgm:
@param label
@text label
@desc Label. This is a setting value for identification purposes and is not referenced by the plugin.

@param troopList
@text Enemy Group List
@desc A list of enemy groups that play the target BGM.
@type troop[]
@default []

@param startTroopId
@text Enemy Group ID (Start)
@desc This is the starting ID value when you want to specify a range of enemy groups to play the target BGM.
@type troop
@default 0

@param endTroopId
@text Enemy Group ID (End)
@desc This is the end value of the ID when you want to specify a range of enemy groups to play the target BGM.
@type troop
@default 0

@param name
@text File Name
@desc The file name.
@type file
@dir audio/bgm/

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
@plugindesc 敵グループごとの戦闘BGM設定プラグイン
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/FlexibleBattleBgm.js
@base PluginCommonBase
@orderAfter PluginCommonBase
@author トリアコンタン

@param bgmList
@text BGMリスト
@desc 演奏するBGMの設定リストです。
@default []
@type struct<AudioBgm>[]

@help FlexibleBattleBgm.js

戦闘BGMを敵グループごとに設定できます。
この設定はシステムの戦闘BGM設定より優先されます。
ボス用の敵グループにはボス用のBGMを自動で演奏する等の使い方ができます。

このプラグインの利用にはベースプラグイン『PluginCommonBase.js』が必要です。
『PluginCommonBase.js』は、RPGツクールMZのインストールフォルダ配下の
以下のフォルダに格納されています。
dlc/BasicResources/plugins/official

利用規約：
 作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 についても制限はありません。
 このプラグインはもうあなたのものです。
*/

/*~struct~AudioBgm:ja

@param label
@text ラベル
@desc ラベルです。識別用の設定値でありプラグインからは参照されません。

@param troopList
@text 敵グループリスト
@desc 対象のBGMを演奏する敵グループの一覧です。
@default []
@type troop[]

@param startTroopId
@text 敵グループID(開始)
@desc 対象のBGMを演奏する敵グループを範囲指定したいときのIDの開始値です。
@default 0
@type troop

@param endTroopId
@text 敵グループID(終了)
@desc 対象のBGMを演奏する敵グループを範囲指定したいときのIDの終了値です。
@default 0
@type troop

@param name
@text ファイル名称
@desc ファイル名称です。
@default
@dir audio/bgm/
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
    if (!param.bgmList) {
        param.bgmList = [];
    }

    const _Game_System_battleBgm = Game_System.prototype.battleBgm;
    Game_System.prototype.battleBgm = function() {
        const bgm = _Game_System_battleBgm.apply(this, arguments);
        const flexibleBgm = param.bgmList.find(bgm => $gameTroop.isFlexibleBattleBgm(bgm));
        return flexibleBgm || bgm;
    };

    Game_Troop.prototype.isFlexibleBattleBgm = function(bgm) {
        return bgm.troopList.includes(this._troopId) ||
            (bgm.startTroopId <= this._troopId && bgm.endTroopId >= this._troopId);
    };
})();