/*=============================================================================
 NumberInputLimitation.js
----------------------------------------------------------------------------
 (C)2022 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2022/01/20 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/NumberInputLimitation.js
@plugindesc Numerical input upper limit setting plugin
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

NumberInputLimitation.js

You can set upper and lower limits for the "Number Input Processing" event
command.
This plugin executes the plugin command immediately before "Number Input
Processing."
After "Number Input Processing" is processed, the set upper and lower limits
will be cleared.

To use this plugin, you need the base plugin "PluginCommonBase.js."
"PluginCommonBase.js" is located in the following folder under the RPG Maker
MZ installation folder:
dlc/BasicResources/plugins/official

Terms of Use:
You may modify and redistribute this plugin without permission from the
author, and there are no restrictions on its use (commercial, 18+, etc.).
This plugin is now yours.

@command NUMBER_INPUT_LIMITATION
@text Setting upper and lower limits for numeric input
@desc Set the upper and lower limits for the event command "Numeric Input Processing." Specify this immediately before the command.
@arg upperValue
@text Upper limit
@desc This is the upper limit for numeric input. It will not exceed the number of digits specified in the command.
@type number
@default 99999999
@arg lowerValue
@text Lower limit
@desc The lower limit of the numeric input.
@type number
@default 0
*/

/*:ja
@plugindesc 数値入力の上限設定プラグイン
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/NumberInputLimitation.js
@base PluginCommonBase
@orderAfter PluginCommonBase
@author トリアコンタン

@command NUMBER_INPUT_LIMITATION
@text 数値入力の上限下限設定
@desc イベントコマンド『数値入力の処理』に上限値と下限値を設定します。コマンドの直前に指定してください。

@arg upperValue
@text 上限値
@desc 数値入力の上限値です。コマンドで指定した桁数以上にはなりません。
@default 99999999
@type number

@arg lowerValue
@text 下限値
@desc 数値入力の下限値です。
@default 0
@type number

@help NumberInputLimitation.js

イベントコマンド『数値入力の処理』に上限値、下限値を設定できます。
『数値入力の処理』の処理の直前にプラグインコマンドを実行します。
『数値入力の処理』の処理後、設定した上限値、下限値は解除されます。

このプラグインの利用にはベースプラグイン『PluginCommonBase.js』が必要です。
『PluginCommonBase.js』は、RPGツクールMZのインストールフォルダ配下の
以下のフォルダに格納されています。
dlc/BasicResources/plugins/official

利用規約：
 作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 についても制限はありません。
 このプラグインはもうあなたのものです。
*/

(() => {
    'use strict';
    const script = document.currentScript;

    PluginManagerEx.registerCommand(script, 'NUMBER_INPUT_LIMITATION', args => {
        $gameSystem.setNumberInputLimitation(args.lowerValue, args.upperValue);
    });

    Game_System.prototype.setNumberInputLimitation = function(lower, upper) {
        this._numberInputLimitation = {
            lower: lower,
            upper: upper
        };
    };

    Game_System.prototype.getNumberInputLimitation = function() {
        return this._numberInputLimitation;
    };

    Game_System.prototype.clearNumberInputLimitation = function() {
        this._numberInputLimitation = null;
    };

    const _Window_NumberInput_start = Window_NumberInput.prototype.start;
    Window_NumberInput.prototype.start = function() {
        _Window_NumberInput_start.apply(this, arguments);
        this.applyLimitation();
    };

    const _Window_NumberInput_changeDigit = Window_NumberInput.prototype.changeDigit;
    Window_NumberInput.prototype.changeDigit = function(up) {
        _Window_NumberInput_changeDigit.apply(this, arguments);
        this.applyLimitation();
    };

    Window_NumberInput.prototype.applyLimitation = function() {
        const limitation = $gameSystem.getNumberInputLimitation();
        if (!limitation) {
            return;
        }
        const newNumber = this._number.clamp(limitation.lower, limitation.upper);
        if (this._number !== newNumber) {
            this._number = newNumber;
            this.refresh();
        }
    };

    const _Window_NumberInput_processOk = Window_NumberInput.prototype.processOk;
    Window_NumberInput.prototype.processOk = function() {
        _Window_NumberInput_processOk.apply(this, arguments);
        $gameSystem.clearNumberInputLimitation();
    };
})();