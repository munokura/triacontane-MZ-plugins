/*=============================================================================
 ActionSe.js
----------------------------------------------------------------------------
 (C)2024 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2024/04/29 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/ActionSe.js
@plugindesc Behavioral SE Plugin
@author Triacontane
@license MIT License

@help
English Help Translator: munokura
Please check the URL below for the latest version of the plugin.
URL https://triacontane.blogspot.com
-----

ActionSe.js

Plays a sound effect under specified conditions when an action begins.
You can specify conditions such as skill type, skill ID, and whether the
character is an enemy or ally.

This plugin requires the base plugin "PluginCommonBase.js."
"PluginCommonBase.js" is located in the following folder under the RPG Maker
MZ installation folder:
dlc/BasicResources/plugins/official

Terms of Use:
You may modify and redistribute this plugin without permission from the
author, and there are no restrictions on its use (commercial, 18+, etc.).
This plugin is now yours.

@param seList
@text Sound Effects List
@desc A list of sound effects to play when an action is performed. If multiple conditions are met, the one defined above takes priority.
@type struct<AudioSe>[]
@default []
*/

/*~struct~AudioSe:
@param name
@text File Name
@desc The file name of the SE to play.
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

@param condition
@text conditions
@desc Play conditions. Plays when all specified conditions are met.
@type struct<Condition>
@default {}
*/

/*~struct~Condition:
@param skillId
@text Skill ID
@desc It will be played when the skill matches the specified ID. If not specified, it will be played unconditionally.
@type skill[]
@default []

@param itemId
@text Item ID
@desc It will play when the item matches the specified ID. If not specified, it will play unconditionally.
@type item[]
@default []

@param skillType
@text Skill Type
@desc It will be played when the specified type of skill is active. If you specify 0, it will be played unconditionally.
@type number
@default 0

@param subject
@text User information
@desc Plays when the user is an ally or enemy.
@type select
@default 0
@option Both
@value 0
@option Allies only
@value 1
@option Enemy only
@value 2
*/

/*:ja
@plugindesc 行動SEプラグイン
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/ActionSe.js
@base PluginCommonBase
@orderAfter PluginCommonBase
@author トリアコンタン

@param seList
@text 効果音リスト
@desc 行動時に演奏する効果音のリストです。複数の条件を満たすものがあれば上に定義されたものが優先されます。
@default []
@type struct<AudioSe>[]

@help ActionSe.js

行動開始時に、指定した条件のもとで効果音を演奏します。
スキルタイプやスキルID、敵味方などの条件を指定できます。

このプラグインの利用にはベースプラグイン『PluginCommonBase.js』が必要です。
『PluginCommonBase.js』は、RPGツクールMZのインストールフォルダ配下の
以下のフォルダに格納されています。
dlc/BasicResources/plugins/official

利用規約：
 作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 についても制限はありません。
 このプラグインはもうあなたのものです。
*/

/*~struct~AudioSe:ja
@param name
@text ファイル名称
@desc 演奏するSEのファイル名です。
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

@param condition
@text 条件
@desc 演奏条件です。指定した条件をすべて満たしたときに演奏します。
@default {}
@type struct<Condition>
*/

/*~struct~Condition:ja
@param skillId
@text スキルID
@desc 指定したIDと一致するスキルのときに演奏します。指定しない場合は無条件となります。
@default []
@type skill[]

@param itemId
@text アイテムID
@desc 指定したIDと一致するアイテムのときに演奏します。指定しない場合は無条件となります。
@default []
@type item[]

@param skillType
@text スキルタイプ
@desc 指定したタイプのスキルのときに演奏します。0を指定すると無条件となります。
@default 0
@type number

@param subject
@text 使用者情報
@desc 使用者が味方もしくは敵の場合に演奏します。
@default 0
@type select
@option どちらも
@value 0
@option 味方のみ
@value 1
@option 敵のみ
@value 2
*/

(() => {
    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);
    if (!param.seList) {
        param.seList = [];
    }

    const _BattleManager_startAction = BattleManager.startAction;
    BattleManager.startAction = function() {
        _BattleManager_startAction.apply(this, arguments);
        if (this._action) {
            const se = this._action.findActionSe();
            if (se) {
                AudioManager.playSe(se);
            }
        }
    };

    Game_Action.prototype.findActionSe = function() {
        return param.seList.find(se => this.isValidActionSe(se.condition));
    };

    Game_Action.prototype.isValidActionSe = function(condition) {
        const subject = this.subject();
        const conditions = [
            condition.skillId.length === 0 || condition.skillId.includes(this.item().id),
            condition.itemId.length === 0 || condition.itemId.includes(this.item().id),
            condition.skillType === 0 || condition.skillType === this.item().stypeId,
            condition.subject === 0 || (condition.subject === 1 && subject.isActor()) || (condition.subject === 2 && subject.isEnemy())
        ];
        return conditions.every(condition => condition);
    };
})();