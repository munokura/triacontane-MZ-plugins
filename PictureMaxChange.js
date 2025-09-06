/*=============================================================================
 PictureMaxChange.js
----------------------------------------------------------------------------
 (C)2024 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2024/03/25 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/PictureMaxChange.js
@plugindesc Picture display maximum number change plugin
@author Triacontane
@license MIT License

@help
English Help Translator: munokura
Please check the URL below for the latest version of the plugin.
URL https://triacontane.blogspot.com
-----

PictureMaxChange.js

Changes the maximum number of pictures displayed.
However, if you want to specify a picture number greater than 100,
use it in conjunction with another plugin or specify it in a script.

PictureControlExtend.js
A plugin that lets you specify the picture to be controlled via command.

EventParamReplace.js
A plugin that lets you replace the event parameter to be executed next.

Also, if you specify a value greater than 100, be sure to pay close attention
to the performance of your game.

This plugin requires the base plugin "PluginCommonBase.js."
"PluginCommonBase.js" is located in the following folder
in the RPG Maker MZ installation folder:
dlc/BasicResources/plugins/official

Terms of Use:
You may modify and redistribute this plugin without permission from the
author, and there are no restrictions on its use (commercial, R18+, etc.).
This plugin is now yours.

@param maxPicture
@text Maximum Number of Pictures
@desc The maximum number of pictures that can be displayed simultaneously (default 100).
@type number
@default 100
*/

/*:ja
@plugindesc ピクチャ表示最大数変更プラグイン
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/PictureMaxChange.js
@base PluginCommonBase
@orderAfter PluginCommonBase
@author トリアコンタン

@param maxPicture
@text ピクチャ最大数
@desc 同時に表示できるピクチャの最大数(デフォルト100)です。
@default 100
@type number

@help PictureMaxChange.js

ピクチャの最大表示数を変更します。
ただし、100より大きい値をピクチャ番号として指定したい場合は、
別のプラグインと併用するかスクリプトで指定してください。

PictureControlExtend.js
操作対象のピクチャをコマンドから指定するプラグイン

EventParamReplace.js
次に実行するイベントパラメータを差し替えられるプラグイン

また、100より大きい値を指定する場合は、制作するゲームの
パフォーマンスには十分注意してください。

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

    const _Game_Screen_maxPictures = Game_Screen.prototype.maxPictures;
    Game_Screen.prototype.maxPictures = function() {
        const size = _Game_Screen_maxPictures.apply(this, arguments);
        return param.maxPicture | size;
    };
})();