/*=============================================================================
 SaveLoadConfirm.js
----------------------------------------------------------------------------
 (C)2022 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.1.1 2023/01/30 選択不可能なファイルを指定したときもダイアログが出てしまう問題を修正
 1.1.0 2022/11/08 カーソル初期位置を「しない」にできる機能を追加
 1.0.2 2022/08/24 ファイルリスト選択時に決定効果音が演奏されない問題を修正
 1.0.1 2022/08/24 Windowクラスを外向けに参照できるよう修正
 1.0.0 2022/08/23 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/SaveLoadConfirm.js
@plugindesc Save confirmation dialog plugin
@author Triacontane
@license MIT License

@help
English Help Translator: munokura
Please check the URL below for the latest version of the plugin.
URL https://triacontane.blogspot.com
-----

SaveLoadConfirm.js

After selecting the target file on the save or load screen, a confirmation
window appears before the actual save or load.

This plugin requires the base plugin "PluginCommonBase.js."
"PluginCommonBase.js" is located in the following folder under the RPG Maker
MZ installation folder:
dlc/BasicResources/plugins/official

Terms of Use:
You may modify and redistribute this plugin without permission, and there are
no restrictions on its use (commercial, R18+, etc.).
This plugin is now yours.

@param saveConfirm
@text Confirmation displayed on the save screen
@desc Adds a confirmation dialog to the save screen.
@type boolean
@default true

@param loadConfirm
@text Confirmation on loading screen
@desc Adds a confirmation dialog to the loading screen.
@type boolean
@default true

@param termSave
@text Term [save]
@desc This is the term for [Save] used in confirmation windows and help.
@default セーブ

@param termLoad
@text Term [Load]
@desc This is the term for [Load] used in confirmation windows and help.
@default ロード

@param confirmOk
@text Confirmation screen OK message
@desc The text equivalent of OK in the confirmation window. %1 is replaced by the term (save or load).
@default %1する

@param confirmNg
@text Verification screen prohibited words
@desc This is the text equivalent to NG in the confirmation window.
@default しない

@param helpText
@text Confirmation help text
@desc Text to display in the help window when the confirmation window is displayed. %1 will be replaced with the term (save or load).
@default %1してもよろしいですか？

@param confirmWidth
@text Confirmation window width
@desc Adds a confirmation dialog to the save screen.
@type number
@default 320

@param windowThrough
@text Window Transparency
@desc Makes the confirmation window transparent so that you can see what's behind it.
@type boolean
@default false

@param defaultCancelSave
@text Initial Cancel (Save)
@desc The initial setting of the cursor in the confirmation window on the save screen will be "No."
@type boolean
@default false

@param defaultCancelLoad
@text Initial Cancellation (Load)
@desc The cursor in the loading screen confirmation window will now default to "No."
@type boolean
@default false
*/

/*:ja
@plugindesc セーブ確認ダイアログプラグイン
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/SaveLoadConfirm.js
@base PluginCommonBase
@orderAfter PluginCommonBase
@author トリアコンタン

@param saveConfirm
@text セーブ画面に確認表示
@desc セーブ画面に確認ダイアログを追加します。
@default true
@type boolean

@param loadConfirm
@text ロード画面に確認表示
@desc ロード画面に確認ダイアログを追加します。
@default true
@type boolean

@param termSave
@text 用語[セーブ]
@desc 確認ウィンドウやヘルプで使用する[セーブ]に該当する用語です。
@default セーブ

@param termLoad
@text 用語[ロード]
@desc 確認ウィンドウやヘルプで使用する[ロード]に該当する用語です。
@default ロード

@param confirmOk
@text 確認画面OK文言
@desc 確認ウィンドウのOKに相当するテキストです。%1で用語（セーブ or ロード）に置き換えられます。
@default %1する

@param confirmNg
@text 確認画面NG文言
@desc 確認ウィンドウのNGに相当するテキストです。
@default しない

@param helpText
@text 確認ヘルプ文言
@desc 確認ウィンドウ表示時にヘルプウィンドウに表示するテキストです。%1で用語（セーブ or ロード）に置き換えられます。
@default %1してもよろしいですか？

@param confirmWidth
@text 確認ウィンドウ横幅
@desc セーブ画面に確認ダイアログを追加します。
@default 320
@type number

@param windowThrough
@text ウィンドウ透過
@desc 確認ウィンドウを透過し背後が見えるようにします。
@default false
@type boolean

@param defaultCancelSave
@text 初期キャンセル(セーブ)
@desc セーブ画面の確認ウィンドウのカーソル初期値が「しない」になります。
@default false
@type boolean

@param defaultCancelLoad
@text 初期キャンセル(ロード)
@desc ロード画面の確認ウィンドウのカーソル初期値が「しない」になります。
@default false
@type boolean

@help SaveLoadConfirm.js

セーブ画面、ロード画面で対象ファイル選択後に
実際にセーブ、ロードする前に確認ウィンドウを挟みます。

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

    /**
     * Scene_Save
     */
    const _Scene_Save_onSavefileOk = Scene_Save.prototype.onSavefileOk;
    Scene_Save.prototype.onSavefileOk = function() {
        this.createConfirmWindowIfNeed();
        if (this._confirmWindow) {
            this._confirmHandler = _Scene_Save_onSavefileOk.bind(this);
        } else {
            _Scene_Save_onSavefileOk.apply(this, arguments);
        }
    };

    Scene_Save.prototype.isNeedConfirm = function() {
        return Scene_File.prototype.isNeedConfirm.call(this) && param.saveConfirm;
    };

    Scene_Save.prototype.findTerm = function() {
        return param.termSave;
    };

    Scene_Save.prototype.isDefaultCancel = function() {
        return param.defaultCancelSave;
    };

    /**
     * Scene_Load
     */
    const _Scene_Load_onSavefileOk = Scene_Load.prototype.onSavefileOk;
    Scene_Load.prototype.onSavefileOk = function() {
        this.createConfirmWindowIfNeed();
        if (this._confirmWindow) {
            this._confirmHandler = _Scene_Load_onSavefileOk.bind(this);
        } else {
            _Scene_Load_onSavefileOk.apply(this, arguments);
        }
    };

    Scene_Load.prototype.isNeedConfirm = function() {
        return Scene_File.prototype.isNeedConfirm.call(this) && param.loadConfirm;
    };

    Scene_Load.prototype.findTerm = function() {
        return param.termLoad;
    };

    Scene_Load.prototype.isDefaultCancel = function() {
        return param.defaultCancelLoad;
    };

    const _Window_SavefileList_playOkSound = Window_SavefileList.prototype.playOkSound;
    Window_SavefileList.prototype.playOkSound = function() {
        _Window_SavefileList_playOkSound.apply(this, arguments);
        if (SceneManager._scene.isNeedConfirm()) {
            Window_Base.prototype.playOkSound.call(this);
        }
    };

    /**
     * Scene_File
     */
    Scene_File.prototype.createConfirmWindowIfNeed = function() {
        if (this._confirmWindow) {
            this._windowLayer.removeChild(this._confirmWindow);
        }
        this._confirmWindow = null;
        if (!this.isNeedConfirm()) {
            return;
        }
        const confirm = new Window_SaveFileConfirm(this.confirmWindowRect());
        confirm.setHandler("ok", this.onConfirmOk.bind(this));
        confirm.setHandler("cancel", this.onConfirmNg.bind(this));
        confirm.setTerm(this.findTerm());
        confirm.refresh();
        confirm.open();
        confirm.activate();
        if (this.isDefaultCancel()) {
            confirm.select(1);
        }
        this._confirmWindow = confirm;
        this._confirmHandler = null;
        this._helpWindow.setText(param.helpText.format(this.findTerm()));
        this.addWindow(this._confirmWindow);
    };

    Scene_File.prototype.confirmWindowRect = function() {
        const ww = param.confirmWidth || 320;
        const wh = this.calcWindowHeight(2, true);
        const wx = (Graphics.boxWidth - ww) / 2;
        const wy = (Graphics.boxHeight - wh) / 2;
        return new Rectangle(wx, wy, ww, wh);
    };

    Scene_File.prototype.isNeedConfirm = function() {
        const savefileId = this.savefileId();
        return this.isSavefileEnabled(savefileId);
    };

    Scene_File.prototype.findTerm = function() {
        return '';
    };

    Scene_File.prototype.isDefaultCancel = function() {
        return false;
    };

    Scene_File.prototype.onConfirmOk = function() {
        if (this._confirmWindow.index() === 0) {
            this._confirmHandler();
        } else {
            this.onConfirmNg();
        }
    }

    Scene_File.prototype.onConfirmNg = function() {
        this._confirmWindow.deactivate();
        this._confirmWindow.close();
        this._listWindow.activate();
        this._helpWindow.setText(this.helpWindowText());
    }

    /**
     * Window_Confirm
     * 確認ウィンドウ
     */
    class Window_SaveFileConfirm extends Window_Command {
        constructor(rect) {
            super(rect);
            this.openness = 0;
            this._isWindow = !param.windowThrough
        }

        setTerm(term) {
            this._term = term;
        }

        makeCommandList() {
            this.addCommand(param.confirmOk.format(this._term), 'ok');
            this.addCommand(param.confirmNg.format(this._term), 'ng');
        }

        playOkSound() {
            if (this.index() !== 0) {
                super.playOkSound();
            }
        }
    }
    window.Window_SaveFileConfirm = Window_SaveFileConfirm;
})();