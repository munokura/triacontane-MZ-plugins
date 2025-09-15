/*=============================================================================
 BattleToneTemporary.js
----------------------------------------------------------------------------
 (C)2020 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.1.0 2022/08/19 戦闘開始時の初期色調(複数指定可能)を指定できる機能を追加
 1.0.1 2022/08/19 MZでの動作を確認しリファクタリング
 1.0.0 2020/05/11 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/BattleToneTemporary.js
@plugindesc A plugin that temporarily changes the color tone during battle
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

BattleToneTemporary.js

Temporarily sets the battle tone separately from the map.
It is initialized at the start of battle and returns to the color tone
specified on the map when the battle ends.

This plugin does not have any plugin commands.

Terms of Use:
You may modify and redistribute it without permission from the author, and
there are no restrictions on its use (commercial, R18+, etc.).
This plugin is now yours.

@param toneList
@text Color List
@desc The color tone is automatically applied at the start of battle. Multiple settings are possible. If multiple conditions are met, the one defined below will take priority.
@type struct<TONE>[]
@default []
*/

/*~struct~TONE:
@param red
@text red
@desc The red component of the color.
@type number
@default 0
@min -255
@max 255

@param green
@text green
@desc The green component of the color.
@type number
@default 0
@min -255
@max 255

@param blue
@text blue
@desc The blue component of the color.
@type number
@default 0
@min -255
@max 255

@param gray
@text Grayscale
@desc It is a grayscale of color.
@type number
@default 0
@min 0
@max 255

@param switch
@text Applicable condition switch
@desc The color tone will be applied only when the specified switch is ON. If not specified, it will be applied always.
@type switch
@default 0
*/

/*:ja
@plugindesc 戦闘時の色調の一時化プラグイン
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/BattleToneTemporary.js
@author トリアコンタン

@param toneList
@text 色調リスト
@desc 戦闘開始時に色調を自動で適用します。複数指定可能。複数の条件を満たした場合は、下に定義したものが優先されます。
@default []
@type struct<TONE>[]

@help BattleToneTemporary.js

戦闘中の色調をマップと切り離して一時化します。
戦闘開始時に初期化され、戦闘が終了すると
マップ上で指定していた色調に戻ります。

このプラグインにはプラグインコマンドはありません。

利用規約：
 作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 についても制限はありません。
 このプラグインはもうあなたのものです。
*/

/*~struct~TONE:ja

@param red
@text 赤
@desc 色調の赤成分です。
@default 0
@type number
@min -255
@max 255

@param green
@text 緑
@desc 色調の緑成分です。
@default 0
@type number
@min -255
@max 255

@param blue
@text 青
@desc 色調の青成分です。
@default 0
@type number
@min -255
@max 255

@param gray
@text グレースケール
@desc 色調のグレースケールです。
@default 0
@type number
@min 0
@max 255

@param switch
@text 適用条件スイッチ
@desc 指定したスイッチがONのときだけ色調を適用します。指定が無い場合、常に適用します。
@default 0
@type switch
*/

(()=> {
    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);

    //=============================================================================
    // Game_Screen
    //  色調を保持、復帰する機能を実装します。
    //=============================================================================
    Game_Screen.prototype.saveTone = function() {
        this._prevTone = this._tone;
        this._tone = [0, 0, 0, 0];
        this.applyInitialTone();
    };

    Game_Screen.prototype.applyInitialTone = function() {
        if (!param.toneList) {
            return;
        }
        param.toneList
            .filter(tone => $gameSwitches.value(tone.switch) || !tone.switch)
            .forEach(tone => this._tone = [tone.red, tone.green, tone.blue, tone.gray]);
    };

    Game_Screen.prototype.restoreTone = function() {
        if (this._prevTone) {
            this._tone = this._prevTone;
        }
    };

    //=============================================================================
    // Scene_Battle
    //  戦闘中にマップの色調変更が反映されなくなります。
    //=============================================================================
    const _Scene_Battle_start = Scene_Battle.prototype.start;
    Scene_Battle.prototype.start = function() {
        $gameScreen.saveTone();
        _Scene_Battle_start.apply(this, arguments);
    };

    const _Scene_Battle_terminate = Scene_Battle.prototype.terminate;
    Scene_Battle.prototype.terminate = function() {
        $gameScreen.restoreTone();
        _Scene_Battle_terminate.apply(this, arguments);
    };
})();