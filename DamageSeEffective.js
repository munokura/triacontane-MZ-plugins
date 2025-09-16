/*=============================================================================
 DamageSeEffective.js
----------------------------------------------------------------------------
 (C)2023 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.1.0 2024/02/07 ダメージ効果音が変更されたときに専用メッセージを表示する機能を追加
 1.0.1 2023/12/21 スクリプトの条件を追加
 1.0.0 2023/12/20 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/DamageSeEffective.js
@plugindesc Weakness Resistance Damage Sound Effect Plugin
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

DamageSeEffective.js

You can change the damage sound effect based on the skill damage result.
For example, you can play a special sound effect under the following
conditions:

- Weakness damage

- Resistance damage

- 0 damage

- Critical hit

- Switch ON

This plugin requires the base plugin "PluginCommonBase.js."
"PluginCommonBase.js" is located in the following folder under the RPG Maker
MZ installation folder:

dlc/BasicResources/plugins/official

Terms of Use:
You may modify and redistribute this plugin without permission, and there are
no restrictions on its use (commercial, 18+, etc.).

This plugin is now yours.

@param damageSeList
@text Damage Sound Effects List
@desc This is a list of damage SEs. Specify the performance conditions and SE. If there are multiple SEs that meet the conditions, the ones at the top of the list will take priority.
@type struct<DamageSe>[]
@default []
*/

/*~struct~DamageSe:
@param label
@text label
@desc A label to identify the sound effect. This is a management value that is not used specifically.

@param message
@text message
@desc The battle log will be output at the same time as the SE plays.

@param name
@text File name
@desc The file name of the sound effect.
@type file
@dir audio/se/

@param volume
@text volume
@desc The volume of the sound effect.
@type number
@default 90
@min 0
@max 100

@param pitch
@text pitch
@desc The pitch of the sound effect.
@type number
@default 100
@min 50
@max 150

@param pan
@text phase
@desc The phase (position) of the sound effect.
@type number
@default 0
@min -100
@max 100

@param condition
@text conditions
@desc Sound effect playing conditions. Conditions that are not entered will be ignored.
@type struct<Condition>
@default {}
*/

/*~struct~Condition:
@param elementRateUpper
@text Attribute magnification upper limit
@desc It will be played when the damage multiplier (percentage) due to the attribute is below the specified value. Specify this if you want to play a resistance sound effect.
@type number

@param elementRateLower
@text Attribute magnification lower limit
@desc This will be played when the damage multiplier (percentage) due to the attribute is equal to or greater than the specified value. Specify this to play the weak point sound effect.
@type number

@param elementId
@text Attribute ID
@desc It will be played if the specified attribute ID is included. Specify this if you want to play a sound effect for each attribute.
@type number

@param damageUpper
@text Damage Limit
@desc Plays when damage is below the specified value.
@type number

@param damageLower
@text Damage Limit
@desc Plays when damage is greater than or equal to the specified value.
@type number

@param critical
@text critical
@desc It plays if a critical hit occurs.
@type boolean

@param switchId
@text Switch ID
@desc It will be played when the specified switch is ON.
@type number

@param script
@text script
@desc It will be played if the specified script returns true.
@type multiline_string
*/

/*:ja
@plugindesc 弱点耐性ダメージSEプラグイン
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/DamageSeEffective.js
@base PluginCommonBase
@orderAfter PluginCommonBase
@author トリアコンタン

@param damageSeList
@text ダメージSEリスト
@desc ダメージSEのリストです。演奏条件とSEを指定します。条件を満たすSEが複数あるときはリストの上が優先されます。
@default []
@type struct<DamageSe>[]

@help DamageSeEffective.js

スキルのダメージ結果によってダメージ効果音を変更できます。
例えば以下のような条件で専用の効果音を演奏できます。
・弱点ダメージだった場合
・耐性ダメージだった場合
・ダメージが0だった場合
・クリティカルヒットだった場合
・スイッチがONだった場合

このプラグインの利用にはベースプラグイン『PluginCommonBase.js』が必要です。
『PluginCommonBase.js』は、RPGツクールMZのインストールフォルダ配下の
以下のフォルダに格納されています。
dlc/BasicResources/plugins/official

利用規約：
 作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 についても制限はありません。
 このプラグインはもうあなたのものです。
*/

/*~struct~DamageSe:ja

@param label
@text ラベル
@desc 効果音を識別するためのラベルです。特に使用されない管理用の値です。

@param message
@text メッセージ
@desc SE演奏と同時にバトルログを出力します。

@param name
@text ファイル名
@desc 効果音のファイル名です。
@default
@dir audio/se/
@type file

@param volume
@text 音量
@desc 効果音の音量です。
@default 90
@type number
@max 100
@min 0

@param pitch
@text ピッチ
@desc 効果音のピッチです。
@default 100
@type number
@max 150
@min 50

@param pan
@text 位相
@desc 効果音の位相(定位)です。
@default 0
@type number
@max 100
@min -100

@param condition
@text 条件
@desc 効果音の演奏条件です。未入力の条件は無視されます。
@default {}
@type struct<Condition>
*/

/*~struct~Condition:ja

@param elementRateUpper
@text 属性倍率上限
@desc 属性によるダメージ倍率(百分率)が指定値以下だった場合に演奏されます。耐性SEを演奏する場合に指定します。
@default
@type number

@param elementRateLower
@text 属性倍率下限
@desc 属性によるダメージ倍率(百分率)が指定値以上だった場合に演奏されます。弱点SEを演奏する場合に指定します。
@default
@type number

@param elementId
@text 属性ID
@desc 指定した属性IDが含まれていた場合に演奏されます。属性ごとにSEを演奏する場合に指定します。
@default
@type number

@param damageUpper
@text ダメージ上限
@desc ダメージが指定値以下だった場合に演奏されます。
@default
@type number

@param damageLower
@text ダメージ下限
@desc ダメージが指定値以上だった場合に演奏されます。
@default
@type number

@param critical
@text クリティカル
@desc クリティカルヒットだった場合に演奏されます。
@default
@type boolean

@param switchId
@text スイッチID
@desc 指定したスイッチがONの場合に演奏されます。
@default
@type number

@param script
@text スクリプト
@desc 指定したスクリプトがtrueを返した場合に演奏されます。
@default
@type multiline_string
*/

(()=> {
    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);
    if (!param.damageSeList) {
        param.damageSeList = [];
    }

    const _Game_ActionResult_clear = Game_ActionResult.prototype.clear;
    Game_ActionResult.prototype.clear = function() {
        _Game_ActionResult_clear.apply(this, arguments);
        this.elementRate = 0;
        this.elements = [];
    };

    const _Game_Action_calcElementRate = Game_Action.prototype.calcElementRate;
    Game_Action.prototype.calcElementRate = function(target) {
        const rate = _Game_Action_calcElementRate.apply(this, arguments);
        const result = target.result();
        result.elementRate = rate;
        const elementId = this.item().damage.elementId;
        result.elements = elementId < 0 ? this.subject().attackElements() : [elementId];
        return rate;
    };

    const _Window_BattleLog_displayHpDamage = Window_BattleLog.prototype.displayHpDamage;
    Window_BattleLog.prototype.displayHpDamage = function(target) {
        const message = SoundManager.setDamageSeEffective(target.result());
        this.push('performDamageSeEffective');
        _Window_BattleLog_displayHpDamage.apply(this, arguments);
        if (message) {
            this.push("addText", message);
        }
        this.push('clearDamageSeEffective');
    };

    Window_BattleLog.prototype.performDamageSeEffective = function() {
        SoundManager.playDamageSeEffective();
    };

    Window_BattleLog.prototype.clearDamageSeEffective = function() {
        SoundManager.clearDamageSeEffective();
    };

    SoundManager.setDamageSeEffective = function(result) {
        if (!result.hpAffected) {
            return;
        }
        this._damageSe = param.damageSeList.find(se => {
            const c = se.condition;
            const list = [];
            const elementRate = result.elementRate * 100;
            list.push(c.elementRateUpper === '' || elementRate <= c.elementRateUpper);
            list.push(c.elementRateLower === '' || elementRate >= c.elementRateLower);
            list.push(c.elementId === '' || result.elements.includes(c.elementId));
            list.push(c.damageUpper === '' || result.hpDamage <= c.damageUpper);
            list.push(c.damageLower === '' || result.hpDamage >= c.damageLower);
            list.push(c.critical === '' || result.critical === c.critical);
            list.push(c.switchId === '' || $gameSwitches.value(c.switchId));
            list.push(c.script === '' || eval(c.script));
            return list.every(c => c);
        });
        return this._damageSe ? this._damageSe.message : '';
    };

    SoundManager.playDamageSeEffective = function() {
        if (this._damageSe) {
            AudioManager.playSe(this._damageSe);
        }
    };

    SoundManager.clearDamageSeEffective = function() {
        this._damageSe = null;
    };

    const _SoundManager_playActorDamage = SoundManager.playActorDamage;
    SoundManager.playActorDamage = function() {
        if (!this._damageSe) {
            _SoundManager_playActorDamage.apply(this, arguments);
        }
    };

    const _SoundManager_playEnemyDamage = SoundManager.playEnemyDamage;
    SoundManager.playEnemyDamage = function() {
        if (!this._damageSe) {
            _SoundManager_playEnemyDamage.apply(this, arguments);
        }
    };
})();