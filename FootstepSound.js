//=============================================================================
// FootstepSound.js
// ----------------------------------------------------------------------------
// (C) 2016 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 3.2.0 2025/03/15 足音が演奏されるタイミングを選択できる設定を追加
// 3.1.0 2024/10/13 足音が演奏されるタイミングを変更
// 3.0.8 2023/12/13 intervalの説明が間違っていたので修正
// 3.0.7 2022/02/13 足音の優先度に関するヘルプを追記
// 3.0.6 2021/12/30 FootStepのタグを指定していないイベントの足音が演奏されない問題を修正
// 3.0.5 2020/09/26 パラメータ「位相」のデフォルト値が100になっていたので0に修正
// 3.0.3 2020/09/15 イベントの足音を初期状態でプレイヤーと同じにできるメモ欄を追加
// 3.0.2 2020/09/01 インターバルを2以上にしたとき、他の足音条件を満たしていても通常の足音が演奏されてしまう問題を修正
// 3.0.1 2020/08/26 MZ向けにプラグインコマンドの記述などを修正
// 3.0.0 2020/08/09 足音データをプラグインパラメータで設定する仕様に変更しリファクタリング
//                  足音の間隔を歩行、ダッシュで別々に設定できる機能を追加
// 2.1.0 2019/02/02 イベントごとの足音を固有に設定できる機能を追加
// 2.0.0 2018/09/05 プレイヤーの足音を無効化するスイッチを指定できる機能を追加
//                  パラメータの型指定機能に対応
// 1.1.0 2017/06/23 立ち止まったときに足音演奏間隔をリセットする機能を追加
// 1.0.0 2016/02/18 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/FootstepSound.js
@plugindesc Footstep Plugin
@author Triacontane
@license MIT License

@help
English Help Translator: munokura
Please check the URL below for the latest version of the plugin.
URL https://triacontane.blogspot.com
-----

The specified footstep sound effect will be played under the following
circumstances.
Lower numbers indicate higher priority.
1. When boarding an airship
2. When boarding a large ship
3. When boarding a small ship
4. When passing through a specified region
5. When passing through a damage floor
6. When passing through brush
7. When passing through a counter
8. When passing through a ladder
9. When passing through a specified terrain tag
10. Always

If you want lower-priority footsteps to be played first,
delete the higher-priority footstep sound parameter.

Footsteps are only played for players, but
by executing the following from the "Script" menu under "Specify Movement
Route,"
footsteps will also be played for events.

Play footsteps: this.setStepSoundFlg(true);
Do not play footsteps: this.setStepSoundFlg(false);

To set unique footstep sounds for each event, specify them as follows:
<FootStep:Absorb1> // Sets the footstep sound to "Absorb1."
<Footstep:Absorb1> // Same as above
<FootStep> // Plays the footstep sound set in the parameter.
<Footstep> // Same as above
Setting this memo field enables footsteps by default without running the
script "this.setStepSoundFlg(true);."

This plugin requires the base plugin "PluginCommonBase.js."
"PluginCommonBase.js" is located in the following folder under the RPG Maker
MZ installation folder:

dlc/BasicResources/plugins/official

Terms of Use:
You may modify and redistribute this plugin without permission, and there are
no restrictions on its use (commercial, R18, etc.).
This plugin is now yours.

@param EventRunningInvalid
@text Disabled during event execution
@desc Disable footsteps during the event. (ON/OFF)
@type boolean
@default false

@param ResetIfStop
@text Stop and reset
@desc If a performance interval is set, it will be reset by standing still. (ON/OFF)
@type boolean
@default false

@param InvalidSwitchId
@text Disabled Switch ID
@desc When the specified switch is ON, the player's footsteps will be disabled. If not specified, they will always be enabled.
@type switch
@default 0

@param airship
@text Airship Footsteps Set
@desc This is a set of footsteps when boarding an airship.
@type struct<SoundSet>
@default {"interval":"1","walk1":"","walk2":"","dash1":"","dash2":""}

@param ship
@text Large Ship Footsteps Set
@desc This is a set of footsteps when boarding a large ship.
@type struct<SoundSet>
@default {"interval":"1","walk1":"","walk2":"","dash1":"","dash2":""}

@param boat
@text Small Boat Footsteps Set
@desc This is a set of footsteps when boarding a small boat.
@type struct<SoundSet>
@default {"interval":"1","walk1":"","walk2":"","dash1":"","dash2":""}

@param regionList
@text Regional Attribute Footstep Set
@desc A set of footstep sounds that are played when passing through tiles in the specified region.
@type struct<SoundSet>[]
@default []

@param damageFloor
@text Damage Floor Attribute Footstep Set
@desc This is a set of footstep sounds when passing through tiles with damage floor attributes.
@type struct<SoundSet>
@default {"interval":"1","walk1":"","walk2":"","dash1":"","dash2":""}

@param bush
@text Bush attribute footstep set
@desc This is a set of footstep sounds when passing through bush-type tiles.
@type struct<SoundSet>
@default {"interval":"1","walk1":"","walk2":"","dash1":"","dash2":""}

@param counter
@text Counter attribute footstep set
@desc This is a set of footstep sounds when passing through a counter attribute tile.
@type struct<SoundSet>
@default {"interval":"1","walk1":"","walk2":"","dash1":"","dash2":""}

@param ladder
@text Ladder attribute footstep set
@desc This is a set of footstep sounds when passing through ladder-type tiles.
@type struct<SoundSet>
@default {"interval":"1","walk1":"","walk2":"","dash1":"","dash2":""}

@param terrainTagList
@text Terrain tag footstep set
@desc A set of footstep sounds that are played when passing over tiles with the specified terrain tag.
@type struct<SoundSet>[]
@default []

@param always
@text Normal footstep set
@desc This is the set of footsteps that will be played when no other conditions are met.
@type struct<SoundSet>
@default {"interval":"1","walk1":"","walk2":"","dash1":"","dash2":""}

@param timing
@text Timing of footsteps
@desc This is the timing at which the footsteps will be played.
@type select
@default step
@option Pattern change (the moment the character's pattern changes)
@value pattern
@option Increase in number of steps (the moment you start walking)
@value step

@command INVALID_SOUND
@text Footstep Disable
@desc Temporarily disables all footstep sounds.

@command VALID_SOUND
@text Enable footsteps
@desc Re-enable footsteps.
*/

/*~struct~SoundSet:
@param interval
@text interval
@desc The interval (number of steps) between footsteps. If you specify 0, the interval will not be used for determination.
@type number
@default 1
@min 0

@param id
@text Region, Terrain Tag
@desc The region or terrain tag number. Ignored for settings other than region or terrain tags.
@type number
@default 0

@param walk1
@text Footsteps when walking 1
@desc Footstep 1 when walking. Plays alternately with footstep 2.
@type struct<Sound>

@param walk2
@text Footsteps when walking 2
@desc Footstep 2 when walking. If not specified, only footstep 1 will be played.
@type struct<Sound>

@param dash1
@text Footsteps when dashing 1
@desc Footstep 1 when sprinting. Plays alternately with footstep 2. This setting is ignored for vehicles that do not have a sprint function.
@type struct<Sound>

@param dash2
@text Footsteps when dashing 2
@desc Footstep 2 when sprinting. If not specified, only footstep 1 will be played.
@type struct<Sound>
*/

/*~struct~Sound:
@param name
@text File name
@desc The file name of the footstep sound effect.
@type file
@require 1
@dir audio/se/

@param volume
@text volume
@desc This is the volume of the footstep sound effects.
@type number
@default 90
@max 100

@param pitch
@text pitch
@desc This is the pitch of the footstep sound effects.
@type number
@default 100
@min 50
@max 150

@param pan
@text phase
@desc This is the phase of the footstep sound effect.
@type number
@default 0
@min -100
@max 100

@param interval
@text interval
@desc This is the interval (number of steps) between footsteps. Use this if you want to specify the interval for each type of footstep.
@type number
@default 0
@min 0
*/

/*:ja
@plugindesc 足音プラグイン
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/FootstepSound.js
@base PluginCommonBase
@author トリアコンタン

@param EventRunningInvalid
@text イベント実行中無効
@desc イベント実行中は足音を無効にする。（ON/OFF）
@default false
@type boolean

@param ResetIfStop
@text 立ち止まるとリセット
@desc 演奏間隔が設定されている場合、立ち止まることでリセットされます。（ON/OFF）
@default false
@type boolean

@param InvalidSwitchId
@text 無効スイッチID
@desc 指定したスイッチがONのときプレイヤーの足音が無効になります。指定しない場合は常に有効になります。
@default 0
@type switch

@param airship
@text 飛行船の足音セット
@desc 飛行船乗船時の足音セットです。
@type struct<SoundSet>
@default {"interval":"1","walk1":"","walk2":"","dash1":"","dash2":""}

@param ship
@text 大型船の足音セット
@desc 大型船乗船時の足音セットです。
@type struct<SoundSet>
@default {"interval":"1","walk1":"","walk2":"","dash1":"","dash2":""}

@param boat
@text 小型船の足音セット
@desc 小型船乗船時の足音セットです。
@type struct<SoundSet>
@default {"interval":"1","walk1":"","walk2":"","dash1":"","dash2":""}

@param regionList
@text リージョン属性の足音セット
@desc 指定リージョンのタイルを通過したときの足音セットです。
@type struct<SoundSet>[]
@default []

@param damageFloor
@text ダメージ床属性の足音セット
@desc ダメージ床属性のタイルを通過したときの足音セットです。
@type struct<SoundSet>
@default {"interval":"1","walk1":"","walk2":"","dash1":"","dash2":""}

@param bush
@text 茂み属性の足音セット
@desc 茂み属性のタイルを通過したときの足音セットです。
@type struct<SoundSet>
@default {"interval":"1","walk1":"","walk2":"","dash1":"","dash2":""}

@param counter
@text カウンター属性の足音セット
@desc カウンター属性のタイルを通過したときの足音セットです。
@type struct<SoundSet>
@default {"interval":"1","walk1":"","walk2":"","dash1":"","dash2":""}

@param ladder
@text 梯子属性の足音セット
@desc 梯子属性のタイルを通過したときの足音セットです。
@type struct<SoundSet>
@default {"interval":"1","walk1":"","walk2":"","dash1":"","dash2":""}

@param terrainTagList
@text 地形タグの足音セット
@desc 指定地形タグのタイルを通過したときの足音セットです。
@type struct<SoundSet>[]
@default []

@param always
@text 通常時の足音セット
@desc 他の条件を満たしていないときの足音セットです。
@type struct<SoundSet>
@default {"interval":"1","walk1":"","walk2":"","dash1":"","dash2":""}

@param timing
@text 足音のタイミング
@desc 足音が演奏されるタイミングです。
@default step
@type select
@option パターン変更(キャラクターのパターンが変わった瞬間)
@value pattern
@option 歩数増加(歩き出した瞬間)
@value step

@command INVALID_SOUND
@text 足音無効化
@desc 一時的に全ての足音を無効にします。

@command VALID_SOUND
@text 足音有効化
@desc 足音を再度有効にします。

@help 以下の状況下で指定した足音効果音を演奏します。
数字の小さい方が優先度が高いです。
1.  飛行船乗船時
2.  大型船乗船時
3.  小型船乗船時
4.  指定リージョン通過時
5.  ダメージ床属性通過時
6.  茂み属性通過時
7.  カウンター属性通過時
8.  梯子属性通過時
9.  指定地形タグ通過時
10. 常に

優先度の低い足音を優先して演奏させたい場合は
優先度の高い足音のパラメータを削除してください。

足音が演奏されるのはプレイヤーのみですが、
「移動ルートの指定」の「スクリプト」から以下を実行すると
イベントにも足音が演奏されるようになります。

足音を演奏する　：this.setStepSoundFlg(true);
足音を演奏しない：this.setStepSoundFlg(false);

イベントごとに固有に足音を設定したい場合、以下の通り指定してください。
<FootStep:Absorb1> // 足音に「Absorb1」が設定されます。
<足音:Absorb1>     // 同上
<FootStep>        // パラメータで設定した足音が演奏されます。
<足音>             // 同上
このメモ欄を設定するとスクリプト「this.setStepSoundFlg(true);」
を実行しなくてもデフォルトで足音が有効になります。

このプラグインの利用にはベースプラグイン『PluginCommonBase.js』が必要です。
『PluginCommonBase.js』は、RPGツクールMZのインストールフォルダ配下の
以下のフォルダに格納されています。
dlc/BasicResources/plugins/official

利用規約：
 作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 についても制限はありません。
 このプラグインはもうあなたのものです。
*/

/*~struct~SoundSet:ja
@param interval
@text 間隔
@desc 足音SEの演奏間隔(歩数)です。0を指定した場合、間隔による判定をしなくなります。
@type number
@default 1
@min 0

@param id
@text リージョン、地形タグ
@desc リージョンもしくは地形タグの番号です。リージョンや地形タグ以外の設定では無視されます。
@type number
@default 0

@param walk1
@text 歩行時の足音1
@desc 歩行時の足音1です。足音2と交互に演奏されます。
@type struct<Sound>
@default

@param walk2
@text 歩行時の足音2
@desc 歩行時の足音2です。指定がない場合は足音1だけが演奏されます。
@type struct<Sound>
@default

@param dash1
@text ダッシュ時の足音1
@desc ダッシュ時の足音1です。足音2と交互に演奏されます。ダッシュがない乗り物等ではこの設定は無視されます。
@type struct<Sound>
@default

@param dash2
@text ダッシュ時の足音2
@desc ダッシュ時の足音2です。指定がない場合は足音1だけが演奏されます。
@type struct<Sound>
@default
*/

/*~struct~Sound:ja
@param name
@text ファイル名
@desc 足音SEのファイル名です。
@default
@require 1
@dir audio/se/
@type file

@param volume
@text 音量
@desc 足音SEの音量です。
@type number
@default 90
@max 100

@param pitch
@text ピッチ
@desc 足音SEのピッチです。
@type number
@default 100
@min 50
@max 150

@param pan
@text 位相
@desc 足音SEの位相です。
@type number
@default 0
@min -100
@max 100

@param interval
@text 間隔
@desc 足音SEの演奏間隔(歩数)です。足音の種別ごとに間隔を指定したい場合に使用します。
@type number
@default 0
@min 0
*/

(function () {
    'use strict'
    var script = document.currentScript;
    var param = PluginManagerEx.createParameter(script);

    PluginManagerEx.registerCommand(script, 'INVALID_SOUND', args => {
        $gameSystem.footstepDisable = true;
    });

    PluginManagerEx.registerCommand(script, 'VALID_SOUND', args => {
        $gameSystem.footstepDisable = false;
    });

    var findListItem = function (id, targetList) {
        if (!Array.isArray(targetList)) {
            return null;
        }
        return targetList.filter(listItem => listItem.id === id)[0];
    }

    //=============================================================================
    // Game_CharacterBase
    //  足音効果音の演奏処理を追加します。
    //=============================================================================
    var _Game_CharacterBase_initMembers = Game_CharacterBase.prototype.initMembers;
    Game_CharacterBase.prototype.initMembers = function () {
        _Game_CharacterBase_initMembers.apply(this, arguments);
        this.setStepSoundFlg(false);
        this._stepToggle = null;
        this.resetStepCountForSound();
    };

    Game_CharacterBase.prototype.resetStepCountForSound = function () {
        this._stepCountForSound = null;
    };

    var _Game_CharacterBase_increaseSteps = Game_CharacterBase.prototype.increaseSteps;
    Game_CharacterBase.prototype.increaseSteps = function () {
        _Game_CharacterBase_increaseSteps.apply(this, arguments);
        if (param.timing !== 'pattern') {
            this.callStepSound();
        }
    }

    var _Game_CharacterBase_updatePattern = Game_CharacterBase.prototype.updatePattern;
    Game_CharacterBase.prototype.updatePattern = function () {
        _Game_CharacterBase_updatePattern.apply(this, arguments);
        if (param.timing === 'pattern' && (this._pattern === 0 || this._pattern === 2)) {
            this.callStepSound();
        }
    };

    Game_CharacterBase.prototype.callStepSound = function () {
        if (this.isInvalidFootStepSound()) {
            return;
        }
        var soundsHash = [
            { key: 'airship', condition: this.isInAirship.bind(this) },
            { key: 'ship', condition: this.isInShip.bind(this) },
            { key: 'boat', condition: this.isInBoat.bind(this) },
            { key: 'regionList', condition: findListItem.bind(this, this.regionId()) },
            { key: 'damageFloor', condition: this.isOnDamageFloor.bind(this) },
            { key: 'bush', condition: this.isOnBush.bind(this) },
            { key: 'counter', condition: this.isOnCounter.bind(this) },
            { key: 'ladder', condition: this.isOnLadder.bind(this) },
            { key: 'terrainTagList', condition: findListItem.bind(this, this.terrainTag()) },
            { key: 'always', condition: this.noCondition.bind(this) }
        ];
        soundsHash.some(data => this.updateStepSound(data.key, data.condition));
    };

    Game_CharacterBase.prototype.isInvalidFootStepSound = function () {
        return (!this.isPlayStepSound() || $gameSystem.footstepDisable ||
            ($gameMap.isEventRunning() && param.EventRunningInvalid));
    };

    Game_CharacterBase.prototype.updateStepSound = function (typeKey, condition) {
        var soundParam = this.findSoundParam(typeKey, condition);
        if (!soundParam) {
            return false;
        }
        this._stepCountForSound++
        if (this.checkInterval(soundParam)) {
            var se = this.findStepSound(soundParam);
            if (se && se.hasOwnProperty('name') && this.checkInterval(se)) {
                this.playStepSound(se);
            }
        }
        return true;
    };

    Game_CharacterBase.prototype.playStepSound = function (se) {
        AudioManager.playSe(se);
        this._stepToggle = !this._stepToggle;
    };

    Game_CharacterBase.prototype.checkInterval = function (targetObject) {
        var interval = targetObject.interval
        if (!interval) {
            return true;
        }
        return this._stepCountForSound % interval === 0
    };

    Game_CharacterBase.prototype.findSoundParam = function (typeKey, condition) {
        var data = param[typeKey];
        if (!data) {
            return null;
        }
        var result = condition(data);
        if (!result) {
            return null;
        }
        return Array.isArray(data) ? result : data;
    };

    Game_CharacterBase.prototype.findStepSound = function (soundHash) {
        var soundBaseKey = this.isDashing() ? 'dash' : 'walk';
        var soundKey = soundBaseKey + (this._stepToggle ? '2' : '1');
        return soundHash[soundKey] || soundHash[soundBaseKey + '1'] || null;
    };

    Game_CharacterBase.prototype.noCondition = function () {
        return true;
    };

    Game_CharacterBase.prototype.isOnDamageFloor = function () {
        return $gameMap.isDamageFloor(this.x, this.y);
    };

    Game_CharacterBase.prototype.isOnCounter = function () {
        return $gameMap.isCounter(this.x, this.y);
    };

    Game_CharacterBase.prototype.isInBoat = function () {
        return false;
    };

    Game_CharacterBase.prototype.isInShip = function () {
        return false;
    };

    Game_CharacterBase.prototype.isInAirship = function () {
        return false;
    };

    Game_CharacterBase.prototype.isPlayStepSound = function () {
        return this._stepSoundFlg;
    };

    Game_CharacterBase.prototype.setStepSoundFlg = function (value) {
        this._stepSoundFlg = !!value;
    };

    //=============================================================================
    // Game_Player
    //  キャラクターごとの足音演奏取得
    //=============================================================================
    Game_Player.prototype.isPlayStepSound = function () {
        return !$gameSwitches.value(param.InvalidSwitchId);
    };

    var _Game_Player_updateNonmoving = Game_Player.prototype.updateNonmoving;
    Game_Player.prototype.updateNonmoving = function (wasMoving) {
        _Game_Player_updateNonmoving.apply(this, arguments);
        if (!wasMoving && param.ResetIfStop) {
            this.resetStepCountForSound();
        }
    };

    var _Game_Event_initialize = Game_Event.prototype.initialize;
    Game_Event.prototype.initialize = function () {
        _Game_Event_initialize.apply(this, arguments);
        this._footStepSeName = PluginManagerEx.findMetaValue(this.event(), ['FootStep', '足音']) || null;
        if (this._footStepSeName) {
            this.setStepSoundFlg(true);
        }
    };

    var _Game_Event_findStepSound = Game_Event.prototype.findStepSound;
    Game_Event.prototype.findStepSound = function (soundHash) {
        var se = _Game_Event_findStepSound.apply(this, arguments);
        if (se && this._footStepSeName && this._footStepSeName !== true) {
            return {
                name: this._footStepSeName,
                volume: se.volume,
                pitch: se.pitch,
                pan: se.pan
            };
        } else {
            return se;
        }
    };

    //=============================================================================
    // Game_System
    //  足音効果音の有効無効設定を追加定義します。
    //=============================================================================
    var _Game_System_initialize = Game_System.prototype.initialize;
    Game_System.prototype.initialize = function () {
        _Game_System_initialize.apply(this, arguments);
        this.footstepDisable = null;
    };
})();