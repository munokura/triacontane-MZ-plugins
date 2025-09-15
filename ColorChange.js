/*=============================================================================
 ColorChange.js
----------------------------------------------------------------------------
 (C)2025 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2025/05/07 初版
----------------------------------------------------------------------------
 [X]      : https://x.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/ColorChange.js
@plugindesc System Color Change Plugin
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

ColorChange.js

Changes various system colors.
Try out different colors without changing your window skin.

This plugin requires the base plugin "PluginCommonBase.js."
"PluginCommonBase.js" is located in the following folder under the RPG Maker
MZ installation folder:

dlc/BasicResources/plugins/official

Terms of Use:
You may modify and redistribute this plugin without permission, and there are
no restrictions on its use (commercial, 18+, etc.).
This plugin is now yours.

@param normalColor
@text Normal color
@desc Specify the color number of the normal color.
@type color
@default 0

@param systemColor
@text System Colors
@desc Specifies the color number of a system color.
@type color
@default 16

@param crisisColor
@text Dying Color
@desc Specifies the color number of the dying color.
@type color
@default 16

@param deathColor
@text Incapacitated Color
@desc Specify the color number of the incapacitated color.
@type color
@default 17

@param gaugeBackColor
@text Gauge Background Color
@desc Specifies the color number for the gauge background color.
@type color
@default 19

@param hpGaugeColor1
@text HP Gauge Color 1
@desc Specifies the color number for HP gauge color 1.
@type color
@default 20

@param hpGaugeColor2
@text HP Gauge Color 2
@desc Specifies the color number for HP gauge color 2.
@type color
@default 21

@param mpGaugeColor1
@text MP Gauge Color 1
@desc Specifies the color number for MP gauge color 1.
@type color
@default 22

@param mpGaugeColor2
@text MP Gauge Color 2
@desc Specifies the color number for MP gauge color 2.
@type color
@default 23

@param mpCostColor
@text MP Cost Color
@desc Specifies the color number of the MP cost color.
@type color
@default 23

@param powerUpColor
@text Ability score up color
@desc Specifies the color number of the ability value increase color. It is used when ability values increase due to equipment changes, etc.
@type color
@default 24

@param powerDownColor
@text Ability score down color
@desc Specifies the color number of the ability value down color. It is used when ability values are reduced due to equipment changes, etc.
@type color
@default 25

@param ctGaugeColor1
@text CT Gauge Color 1
@desc Specifies the color number for CT gauge color 1.
@type color
@default 26

@param ctGaugeColor2
@text CT Gauge Color 2
@desc Specify the color number for CT gauge color 2.
@type color
@default 27

@param tpGaugeColor1
@text TP Gauge Color 1
@desc Specify the color number for TP gauge color 1.
@type color
@default 28

@param tpGaugeColor2
@text TP Gauge Color 2
@desc Specify the color number for TP gauge color 2.
@type color
@default 29

@param tpCostColor
@text TP Cost Color
@desc Specify the color number of the TP cost color.
@type color
@default 29

@param mpColor
@text MP Color
@desc Specifies the MP color number.
@type color
@default 0

@param tpColor
@text TP color
@desc Specify the color number of the TP color.
@type color
@default 0
*/

/*:ja
@plugindesc システムカラー変更プラグイン
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/ColorChange.js
@base PluginCommonBase
@orderAfter PluginCommonBase
@author トリアコンタン

@param normalColor
@text 通常カラー
@desc 通常カラーの色番号を指定します。
@default 0
@type color

@param systemColor
@text システムカラー
@desc システムカラーの色番号を指定します。
@default 16
@type color

@param crisisColor
@text 瀕死カラー
@desc 瀕死カラーの色番号を指定します。
@default 16
@type color

@param deathColor
@text 戦闘不能カラー
@desc 戦闘不能カラーの色番号を指定します。
@default 17
@type color

@param gaugeBackColor
@text ゲージ背景カラー
@desc ゲージ背景カラーの色番号を指定します。
@default 19
@type color

@param hpGaugeColor1
@text HPゲージカラー1
@desc HPゲージカラー1の色番号を指定します。
@default 20
@type color

@param hpGaugeColor2
@text HPゲージカラー2
@desc HPゲージカラー2の色番号を指定します。
@default 21
@type color

@param mpGaugeColor1
@text MPゲージカラー1
@desc MPゲージカラー1の色番号を指定します。
@default 22
@type color

@param mpGaugeColor2
@text MPゲージカラー2
@desc MPゲージカラー2の色番号を指定します。
@default 23
@type color

@param mpCostColor
@text MPコストカラー
@desc MPコストカラーの色番号を指定します。
@default 23
@type color

@param powerUpColor
@text 能力値アップカラー
@desc 能力値アップカラーの色番号を指定します。装備変更などで能力値が上昇した際に使われます。
@default 24
@type color

@param powerDownColor
@text 能力値ダウンカラー
@desc 能力値ダウンカラーの色番号を指定します。装備変更などで能力値が減少した際に使われます。
@default 25
@type color

@param ctGaugeColor1
@text CTゲージカラー1
@desc CTゲージカラー1の色番号を指定します。
@default 26
@type color

@param ctGaugeColor2
@text CTゲージカラー2
@desc CTゲージカラー2の色番号を指定します。
@default 27
@type color

@param tpGaugeColor1
@text TPゲージカラー1
@desc TPゲージカラー1の色番号を指定します。
@default 28
@type color

@param tpGaugeColor2
@text TPゲージカラー2
@desc TPゲージカラー2の色番号を指定します。
@default 29
@type color

@param tpCostColor
@text TPコストカラー
@desc TPコストカラーの色番号を指定します。
@default 29
@type color

@param mpColor
@text MPカラー
@desc MPカラーの色番号を指定します。
@default 0
@type color

@param tpColor
@text TPカラー
@desc TPカラーの色番号を指定します。
@default 0
@type color

@help ColorChange.js

各種システムカラーを変更します。
ウィンドウスキンを変更することなく、様々な色を試行錯誤できます。

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

    Object.keys(param._parameter).forEach(methodName => {
        const color = param[methodName];
        if (isNaN(color)) {
            return;
        }
        ColorManager[methodName] = function() {
            return this.textColor(color);
        };
    });
})();