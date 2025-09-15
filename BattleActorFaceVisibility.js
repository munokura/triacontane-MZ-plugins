/*=============================================================================
 BattleActorFaceVisibility.js
----------------------------------------------------------------------------
 (C)2024 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.2.1 2024/06/07 前バージョンの修正内容に誤りがあったため修正
 1.2.0 2024/06/06 コマンド入力中にフェイスグラフィックが変わった場合、即座に更新するよう修正
 1.1.0 2024/02/10 ウィンドウの表示座標補正機能を追加
 1.0.0 2024/02/08 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/BattleActorFaceVisibility.js
@plugindesc Face graphic display plugin during battle
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

BattleActorFaceVisibility.js

This adds a window displaying the actor's face during battle while inputting
commands.

This plugin requires the base plugin "PluginCommonBase.js."
"PluginCommonBase.js" is located in the following folder under the RPG Maker
MZ installation folder:

dlc/BasicResources/plugins/official

Terms of Use:
You may modify and redistribute this plugin without permission, and there are
no restrictions on its use (commercial, R18+, etc.).
This plugin is now yours.

@param nameVisible
@text Name Display
@desc It also displays the actor name along with the face window.
@type boolean
@default true

@param position
@text Display position
@desc The display position of the face window.
@type select
@default left
@option left
@value left
@option right
@value right

@param offsetX
@text X coordinate correction
@desc X coordinate offset of the face window.
@type number
@default 0
@min -9999
@max 9999

@param offsetY
@text Y coordinate correction
@desc Y coordinate correction for the face window.
@type number
@default 0
@min -9999
@max 9999
*/

/*:ja
@plugindesc 戦闘中顔グラフィック表示プラグイン
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/BattleActorFaceVisibility.js
@base PluginCommonBase
@orderAfter PluginCommonBase
@author トリアコンタン

@param nameVisible
@text 名前表示
@desc フェイスウィンドウと一緒にアクター名も表示します。
@default true
@type boolean

@param position
@text 表示位置
@desc フェイスウィンドウの表示位置です。
@default left
@type select
@option 左
@value left
@option 右
@value right

@param offsetX
@text X座標補正
@desc フェイスウィンドウのX座標補正です。
@default 0
@type number
@min -9999
@max 9999

@param offsetY
@text Y座標補正
@desc フェイスウィンドウのY座標補正です。
@default 0
@type number
@min -9999
@max 9999

@help BattleActorFaceVisibility.js

戦闘中、コマンド入力中のアクターの顔グラフィックを表示する
ウィンドウを追加表示します。

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

    const _Scene_Battle_createAllWindows = Scene_Battle.prototype.createAllWindows;
    Scene_Battle.prototype.createAllWindows = function() {
        _Scene_Battle_createAllWindows.apply(this, arguments);
        this.createActorFaceWindow();
    };

    Scene_Battle.prototype.createActorFaceWindow = function() {
        const rect = this.actorFaceWindowRect();
        this._actorFaceWindow = new Window_BattleActorFace(rect);
        this.addWindow(this._actorFaceWindow);
    };

    Scene_Battle.prototype.actorFaceWindowRect = function() {
        const p = $gameSystem.windowPadding();
        const ww = ImageManager.faceWidth + p * 2;
        const wh = ImageManager.faceHeight + p * 2 + (param.nameVisible ? this._actorWindow.lineHeight() : 0);
        const wx = (param.position === 'left' ? 0 : Graphics.boxWidth - ww) + (param.offsetX || 0);
        const wy = this._actorWindow.y - wh + (param.offsetY || 0);
        return new Rectangle(wx, wy, ww, wh);
    };

    class Window_BattleActorFace extends Window_StatusBase {
        constructor(rect) {
            super(rect);
            this._actor = null;
            this.openness = 0;
        }

        setActor(actor) {
            this._actor = actor;
            this.refresh();
            if (actor) {
                this._faceName = actor.faceName();
                this._faceIndex = actor.faceIndex();
            } else {
                this._faceName = null;
                this._faceIndex = null;
            }
        }

        isFaceChanged() {
            if (!this._actor) {
                return false;
            }
            return this._faceName !== this._actor.faceName() || this._faceIndex !== this._actor.faceIndex();
        }

        refresh() {
            this.contents.clear();
            if (this._actor) {
                this.drawActorFace(this._actor, 0, 0, ImageManager.faceWidth, ImageManager.faceHeight);
                if (param.nameVisible) {
                    this.drawText(this._actor.name(), 0, ImageManager.faceHeight, this.innerWidth, 'center');
                }
                this.open();
            } else {
                this.close();
            }
        }

        update() {
            super.update();
            const actor = BattleManager.actor();
            if (actor !== this._actor || this.isFaceChanged()) {
                this.setActor(actor);
            }
        }
    }
    window.Window_BattleActorFace = Window_BattleActorFace;
})();