/*=============================================================================
 MaintainingImageChangePage.js
----------------------------------------------------------------------------
 (C)2020 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.1 2020/10/06 MZ向けにリファクタリング
 1.0.0 2020/10/01 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/MaintainingImageChangePage.js
@plugindesc Image retention plugin when switching pages
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

MaintainingImageChangePage.js

When the event page changes, if the image specified on the new page is "None,"
the image will not be changed and the original image will be displayed as is.

This is only valid for events with the following tag:
<MImage>

Only the image will be maintained. Other settings, such as priority, will
follow the settings of the new page.

This plugin requires the base plugin "PluginCommonBase.js."
"PluginCommonBase.js" is located in the following folder under the RPG Maker
MZ installation folder:
dlc/BasicResources/plugins/official

Terms of Use:
You may modify and redistribute this plugin without permission from the
author, and there are no restrictions on its use (commercial, R18+, etc.).
This plugin is now yours.

@param TagReverse
@text Tag Reversal
@desc Inverts the function of the tag, maintaining the image when MaintainingImage is "off".
@default false
*/

/*:ja
@plugindesc ページ切り替え時の画像維持プラグイン
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/MaintainingImageChangePage.js
@base PluginCommonBase
@author トリアコンタン

@param TagReverse
@text タグ反転
@desc タグの機能を反転させ、MaintainingImageが『ついていない』ときに画像を維持します。
@default false

@help MaintainingImageChangePage.js

イベントページが切り替わったとき、新しいページで指定された画像が『なし』
であれば画像を変更せず、もともと表示していた画像をそのまま表示します。
以下のタグが付いているイベントのみ有効です。
<MImage>

維持するのは画像のみです。プライオリティなど他の設定は新しいページの
設定に従います。

このプラグインの利用にはベースプラグイン『PluginCommonBase.js』が必要です。
『PluginCommonBase.js』は、RPGツクールMZのインストールフォルダ配下の
以下のフォルダに格納されています。
dlc/BasicResources/plugins/official

利用規約：
 作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 についても制限はありません。
 このプラグインはもうあなたのものです。
*/

(function() {
    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);

    const _Game_Event_initialize = Game_Event.prototype.initialize;
    Game_Event.prototype.initialize = function(mapId, eventId) {
        _Game_Event_initialize.apply(this, arguments);
        this._maintainingImage = this.isMaintainingImage();
    }

    Game_Event.prototype.isMaintainingImage = function() {
        return this.event().meta.MImage ^ param.TagReverse;
    };

    const _Game_Event_setupPageSettings = Game_Event.prototype.setupPageSettings;
    Game_Event.prototype.setupPageSettings = function() {
        if (this._maintainingImage) {
            this.saveMaintainingImage();
        }
        _Game_Event_setupPageSettings.apply(this, arguments);
        if (this._maintainingImage) {
            const image = this.page().image;
            if (!image.tileId && !image.characterName) {
                this.restoreMaintainingImage();
            }
        }
    };

    Game_Event.prototype.saveMaintainingImage = function() {
        this._prevTileId = this._tileId;
        this._prevCharacterName = this._characterName;
        this._prevCharacterIndex = this._characterIndex;
        this._prevIsObjectCharacter = this._isObjectCharacter;
    };

    Game_Event.prototype.restoreMaintainingImage = function() {
        this._tileId = this._prevTileId;
        this._characterName = this._prevCharacterName;
        this._characterIndex = this._prevCharacterIndex;
        this._isObjectCharacter = this._prevIsObjectCharacter;
    };
})();