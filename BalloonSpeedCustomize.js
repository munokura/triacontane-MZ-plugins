/*=============================================================================
 BalloonSpeedCustomize.js
----------------------------------------------------------------------------
 (C)2022 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2022/07/30 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/BalloonSppedCustomize.js
@plugindesc Balloon speed change plugin
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

BalloonSpeedCustomize.js

Adjusts the balloon animation speed and number of wait frames.
By specifying a variable number in the plugin parameters, the variable value
will
determine the speed and wait frames.

This plugin requires the base plugin "PluginCommonBase.js."
"PluginCommonBase.js" is located in the following folder
in the RPG Maker MZ installation folder:
dlc/BasicResources/plugins/official

Terms of Use:
You may modify and redistribute this plugin without permission, and there are
no restrictions on its use (commercial, 18+, etc.).
This plugin is now yours.

@param speedVariable
@text Balloon speed variable
@desc The animation speed of the balloon will be the specified variable value. If it is 0, it will be set to the default value (8). Smaller values are faster.
@type variable
@default 0

@param waitVariable
@text Balloon Wait Variable
@desc The waiting frame of the balloon will be the specified variable value. If it is 0, it will be set to the default value (12).
@type variable
@default 0
*/

/*:ja
@plugindesc フキダシ速度変更プラグイン
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/BalloonSppedCustomize.js
@base PluginCommonBase
@orderAfter PluginCommonBase
@author トリアコンタン

@param speedVariable
@text フキダシ速度変数
@desc フキダシのアニメ速度が指定した変数値になります。0だった場合はデフォルト値(8)になります。小さい値の方が速いです。
@default 0
@type variable

@param waitVariable
@text フキダシ待機変数
@desc フキダシの待機フレームが指定した変数値になります。0だった場合はデフォルト値(12)になります。
@default 0
@type variable

@help BalloonSpeedCustomize.js

フキダシのアニメーション速度および待機フレーム数を調整できます。
プラグインパラメータから変数番号を指定すれば、その番号の変数値が
速度や待機フレームになります。

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
    const param = PluginManagerEx.createParameter(script);

    const _Sprite_Balloon_speed = Sprite_Balloon.prototype.speed;
    Sprite_Balloon.prototype.speed = function() {
        const speed = _Sprite_Balloon_speed.apply(this, arguments);
        return $gameVariables.value(param.speedVariable) || speed;
    };

    const _Sprite_Balloon_waitTime = Sprite_Balloon.prototype.waitTime;
    Sprite_Balloon.prototype.waitTime = function() {
        const waitTime = _Sprite_Balloon_waitTime.apply(this, arguments);
        return $gameVariables.value(param.waitVariable) || waitTime;
    };
})();