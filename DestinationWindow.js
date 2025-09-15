//=============================================================================
// DestinationWindow.js
// ----------------------------------------------------------------------------
// (C)2017 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 2.2.1 2025/09/03 2.2.0の修正で行動目標ウィンドウを通常表示にすると、マップ表示のタイミングで一瞬表示される問題を修正
// 2.2.0 2024/07/12 行動目標ウィンドウの背景タイプを設定できる機能を追加
// 2.1.0 2021/11/10 フェードインを有効にしているとメニュー画面のウィンドウでも適用される問題を修正
//                  一部のパラメータの初期値を修正、ヘルプを微修正
// 2.0.3 2020/12/13 非表示状態でメニューからマップへ戻ると1フレームだけ行動目標が表示される不具合を修正
// 2.0.2 2020/10/12 フォント設定が効かない不具合を修正
// 2.0.1 2020/10/11 言語設定によってアイコン設定の型が違う問題を修正
// 2.0.0 2020/10/11 MZ向けに実装を修正
// 1.6.0 2019/06/24 特定マップで非表示にする機能を追加
// 1.5.0 2018/07/20 行動目標ウィンドウの内容を複数行表示できる機能を追加
// 1.4.0 2017/11/15 行動目標ウィンドウの文字列揃えを中央揃え、右揃えにできる機能を追加
// 1.3.0 2017/11/11 マップ画面のウィンドウを一定時間で消去できる機能を追加
// 1.2.1 2017/05/22 専用ウィンドウスキンを指定した状態でセーブ＆ロードした際にテキスト色が黒くなる問題を修正
// 1.2.0 2017/05/03 アイコン表示機能、横幅自動調整機能を追加、別の目標を指定したときに重なって表示される問題を修正
// 1.1.0 2017/05/02 メニュー画面にも表示できる機能を追加
// 1.0.0 2017/05/02 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/DestinationWindow.js
@plugindesc Action Objective Window Plugin
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

Displays a destination window within the map.
You can display any text, including control characters, making it useful for a
variety of purposes.
The content displayed is determined by the plugin command, and its visibility
is controlled by a switch.

When auto-adjustment is enabled, the text will automatically adjust to fit
within the window.
However, the following control characters will be disabled:
\i[n], \c[n], \{, \}

The destination window will be hidden on maps that meet any of the following
conditions:
- The map has an ID specified by the plugin parameter
noDestinationWindowMapIds
- The map's memo field contains <noDestinationWindow>

This plugin requires the base plugin "PluginCommonBase.js."
"PluginCommonBase.js" is located in the following folder under the RPG Maker
MZ installation folder:

dlc/BasicResources/plugins/official

Terms of Use:
Modification and redistribution are permitted without permission from the
author, and there are no restrictions on usage (commercial, 18+, etc.)

This plugin is now yours.

@param showingSwitchId
@text Display Switch ID
@desc The switch ID for which the behavior goal window will be displayed. If 0 is specified, it will be displayed unconditionally.
@type switch
@default 0

@param closeEventRunning
@text Closed during the event
@desc Close the window while the event is running.
@type boolean
@default true

@param windowX
@text Window X coordinate
@desc The x-width of the window.
@type number
@default 24

@param windowY
@text Window Y coordinate
@desc The Y width of the window.
@type number
@default 24

@param windowWidth
@text Window Width
@desc The width of the window.
@type number
@default 320

@param windowOpacity
@text Window Opacity
@desc The window opacity.
@type number
@default 255

@param windowSkin
@text Window Skin Name
@desc The file name of the window skin (img/system). No extension needed.
@type file
@require 1
@dir img/system/

@param windowBack
@text Window Background
@desc The window background type.
@type select
@default 0
@option window
@value 0
@option Darken
@value 1
@option transparent
@value 2

@param windowBackMenu
@text Window background (menu)
@desc The background type of the window (for displaying the menu screen).
@type select
@default 0
@option window
@value 0
@option Darken
@value 1
@option transparent
@value 2

@param fadeFrame
@text Fade Time
@desc The window fade-in and fade-out time (in frames).
@type number
@default 8

@param fontSize
@text Font size
@desc The window font size.
@type number
@default 22

@param showingInMenu
@text Display on the menu screen
@desc The action goal window will also be displayed on the menu screen, but the coordinates and size will be adjusted automatically.
@type boolean
@default false

@param autoAdjust
@text automatic adjustment
@desc If the specified string does not fit in the window, it will be automatically adjusted. However, some control characters will not be available.
@type boolean
@default false

@param showingFrames
@text Number of display frames
@desc The number of frames the behavior goal window will be displayed in. If you specify 0, it will be displayed at all times.
@type icon
@default 0

@param textAlign
@text Text justification
@desc The alignment of the string.
@type select
@default 0
@option Left-justified
@value 0
@option Centered
@value 1
@option Right-justified
@value 2

@param noDestinationWindowMapIds
@text Hidden Map ID List
@desc A list of map IDs you want to hide
@type number[]
@default []

@command SET_DESTINATION
@text goal setting
@desc Set behavioral goals.
@arg destination
@text Behavioral goals
@desc It is a behavioral goal.
@type multiline_string
@arg icon
@text icon
@desc The icon number to be displayed at the beginning of the action goal.
@type icon
*/

/*:ja
@plugindesc 行動目標ウィンドウプラグイン
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/DestinationWindow.js
@base PluginCommonBase
@orderAfter PluginCommonBase
@author トリアコンタン

@param showingSwitchId
@text 表示スイッチID
@desc 行動目標ウィンドウが表示されるスイッチIDです。0を指定した場合、無条件で表示されます。
@default 0
@type switch

@param closeEventRunning
@text イベント中は閉じる
@desc イベントが実行されている間はウィンドウを閉じます。
@default true
@type boolean

@param windowX
@text ウィンドウX座標
@desc ウィンドウのX横幅です。
@default 24
@type number

@param windowY
@text ウィンドウY座標
@desc ウィンドウのY横幅です。
@default 24
@type number

@param windowWidth
@text ウィンドウ横幅
@desc ウィンドウの横幅です。
@default 320
@type number

@param windowOpacity
@text ウィンドウ不透明度
@desc ウィンドウの不透明度です。
@default 255
@type number

@param windowSkin
@text ウィンドウスキン名
@desc ウィンドウスキンのファイル名(img/system)です。拡張子不要。
@default
@require 1
@dir img/system/
@type file

@param windowBack
@text ウィンドウ背景
@desc ウィンドウの背景タイプです。
@default 0
@type select
@option ウィンドウ
@value 0
@option 暗くする
@value 1
@option 透明
@value 2

@param windowBackMenu
@text ウィンドウ背景(メニュー)
@desc ウィンドウの背景タイプ(メニュー画面表示用)です。
@default 0
@type select
@option ウィンドウ
@value 0
@option 暗くする
@value 1
@option 透明
@value 2

@param fadeFrame
@text フェード時間
@desc ウィンドウのフェードイン、フェードアウト時間(フレーム数)です。
@default 8
@type number

@param fontSize
@text フォントサイズ
@desc ウィンドウのフォントサイズです。
@default 22
@type number

@param showingInMenu
@text メニュー画面に表示
@desc 行動目標ウィンドウをメニュー画面にも表示します。ただし座標やサイズは自働で整形されます。
@default false
@type boolean

@param autoAdjust
@text 自動調整
@desc 指定した文字列がウィンドウに収まらない場合に自動で調整します。ただし一部の制御文字が使用不可となります。
@default false
@type boolean

@param showingFrames
@text 表示フレーム数
@desc 行動目標ウィンドウの表示フレーム数です。0を指定すると常時表示されます。
@default 0
@type icon

@param textAlign
@text 文字列揃え
@desc 文字列の揃えです。
@default 0
@type select
@option 左揃え
@value 0
@option 中央揃え
@value 1
@option 右揃え
@value 2

@param noDestinationWindowMapIds
@text 非表示マップIDリスト
@desc 非表示にしたいマップIDのリスト
@default []
@type number[]

@command SET_DESTINATION
@text 目標設定
@desc 行動目標を設定します。

@arg destination
@text 行動目標
@desc 行動目標です。
@type multiline_string
@default

@arg icon
@text アイコン
@desc 行動目標の先頭に表示するアイコン番号です。
@type icon
@default

@help マップ中に行動目標ウィンドウを表示します。
制御文字を含めた好きな文字列を表示できるので様々な用途に使えます。
表示する内容はプラグインコマンドで、表示可否はスイッチで制御します。

自動調整を有効にした場合、文字列がウィンドウに収まるよう自動調整します。
ただし、以下の制御文字が無効になります。
\i[n]、\c[n]、\{、\}

以下のいずれかの条件を満たすマップでは、行動目標は非表示になります。
- プラグインパラメータ noDestinationWindowMapIds で指定したIDを持つ
- マップのメモ欄に <noDestinationWindow> と記述されている

このプラグインの利用にはベースプラグイン『PluginCommonBase.js』が必要です。
『PluginCommonBase.js』は、RPGツクールMZのインストールフォルダ配下の
以下のフォルダに格納されています。
dlc/BasicResources/plugins/official

利用規約：
 作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 についても制限はありません。
 このプラグインはもうあなたのものです。
*/

(()=> {
    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);

    const _extractMetadata = DataManager.extractMetadata;
    DataManager.extractMetadata = function(data) {
        _extractMetadata.call(this, data);
        if (this.isMapObject(data)) {
            data.noDestinationWindow = data.meta.noDestinationWindow;
        }
    };

    PluginManagerEx.registerCommand(script, 'SET_DESTINATION', function(args) {
        if (args.icon > 0) {
            this.execSetDestinationWithIcon(args.destination, args.icon);
        } else {
            this.execSetDestination(args.destination);
        }
    });

    //=============================================================================
    // Game_Interpreter
    //  プラグインコマンドを追加定義します。
    //=============================================================================
    Game_Interpreter.prototype.execSetDestination = function(destination) {
        $gameSystem.setDestinationIcon(null);
        $gameSystem.setDestination(destination);
    };

    Game_Interpreter.prototype.execSetDestinationWithIcon = function(destination, icon) {
        $gameSystem.setDestinationIcon(icon);
        $gameSystem.setDestination(destination);
    };

    //=============================================================================
    // Game_System
    //  目標テキストを追加定義します。
    //=============================================================================
    Game_System.prototype.setDestination = function(value) {
        this._destinationTextList = value.split('\n');
        this.resetDestinationFrame();
    };

    Game_System.prototype.getDestination = function() {
        return this._destinationTextList || [];
    };

    Game_System.prototype.setDestinationIcon = function(value) {
        this._destinationIconIndex = value;
    };

    Game_System.prototype.getDestinationIcon = function() {
        return this._destinationIconIndex || 0;
    };

    Game_System.prototype.resetDestinationFrame = function() {
        this._destinationFrame = 0;
    };

    Game_System.prototype.isOverDestinationFrame = function() {
        this._destinationFrame++;
        return param.showingFrames > 0 ? param.showingFrames <= this._destinationFrame : false;
    };

    //=============================================================================
    // Game_Map
    //  行動目標ウィンドウ非表示マップであるかを判定します。
    //=============================================================================
    Game_Map.prototype.isNoDestinationWindowMap = function () {
        return param.noDestinationWindowMapIds.some(function(mapId){
            return mapId === this.mapId();
        }, this) || $dataMap.noDestinationWindow;
    };

    //=============================================================================
    // Scene_Map
    //  行動目標ウィンドウを生成します。
    //=============================================================================
    const _Scene_Map_createMapNameWindow      = Scene_Map.prototype.createMapNameWindow;
    Scene_Map.prototype.createMapNameWindow = function() {
        this.createDestinationWindow();
        _Scene_Map_createMapNameWindow.apply(this, arguments);
    };

    Scene_Map.prototype.createDestinationWindow = function() {
        this._destinationWindow = new Window_Destination(this.destinationWindowRect());
        this.addChild(this._destinationWindow);
    };

    Scene_Map.prototype.destinationWindowRect = function() {
        return new Rectangle(param.windowX, param.windowY, param.windowWidth, this.calcWindowHeight(1, false));
    };

    //=============================================================================
    // Scene_Menu
    //  メニュー画面にも表示できるようにします。
    //=============================================================================
    const _Scene_Menu_create      = Scene_Menu.prototype.create;
    Scene_Menu.prototype.create = function() {
        _Scene_Menu_create.apply(this, arguments);
        if (param.showingInMenu) {
            this.createDestinationWindow();
        }
    };

    Scene_Menu.prototype.createDestinationWindow = function() {
        this._destinationWindow = new Window_DestinationMenu(this.destinationWindowRect());
        this.addWindow(this._destinationWindow);
    };

    const _Scene_Menu_commandWindowRect = Scene_Menu.prototype.commandWindowRect;
    Scene_Menu.prototype.commandWindowRect = function() {
        const rect = _Scene_Menu_commandWindowRect.call(this);
        if (param.showingInMenu && $gameSystem.getDestination().length > 0) {
            rect.height -= this.calcDestinationWindowHeight();
        }
        return rect;
    };

    Scene_Menu.prototype.calcDestinationWindowHeight = function () {
        return Window_Destination.prototype.fittingHeight($gameSystem.getDestination().length);
    };

    Scene_Menu.prototype.destinationWindowRect = function() {
        let x, y, width, height;
        x = this._commandWindow.x;
        if (this._commandWindow.maxCols() === 1) {
            width  = this._commandWindow.width;
            height = this.calcDestinationWindowHeight();
            y      = this._goldWindow.y - height;
        } else {
            y      = this._goldWindow.y;
            width  = param.windowWidth;
            height = this._goldWindow.height;
        }
        return new Rectangle(x, y, width, height);
    };

    //=============================================================================
    // Window_Destination
    //  行動目標ウィンドウです。
    //=============================================================================
    function Window_Destination() {
        this.initialize.apply(this, arguments);
    }

    Window_Destination.prototype             = Object.create(Window_Base.prototype);
    Window_Destination.prototype.constructor = Window_Destination;

    Window_Destination.prototype.initialize = function(rect) {
        Window_Base.prototype.initialize.call(this, rect);
        this._text      = '';
        this._textList  = [];
        this._iconIndex = 0;
        this.setBackgroundType(this.findWindowBackType());
        this.update();
        this.initOpacity();
    };

    Window_Destination.prototype.findWindowBackType = function() {
        return SceneManager._scene instanceof Scene_Menu ? param.windowBackMenu : param.windowBack;
    };

    Window_Destination.prototype.loadWindowskin = function() {
        if (param.windowSkin) {
            this.windowskin = ImageManager.loadSystem(param.windowSkin);
        } else {
            Window_Base.prototype.loadWindowskin.call(this);
        }
    };

    Window_Destination.prototype.lineHeight = function() {
        return Math.max(this.standardFontSize() + 8, ImageManager.iconHeight);
    };

    Window_Destination.prototype.resetFontSettings = function () {
        Window_Base.prototype.resetFontSettings.call(this);
        this.contents.fontSize = this.standardFontSize();
    };

    Window_Destination.prototype.standardFontSize = function() {
        return param.fontSize || $gameSystem.mainFontSize();
    };

    Window_Destination.prototype.standardBackOpacity = function() {
        return param.windowOpacity || 192;
    };

    Window_Destination.prototype.standardPadding = function() {
        return 12;
    };

    Window_Destination.prototype.update = function() {
        Window_Base.prototype.update.call(this);
        if (!this.windowskin.isReady()) return;
        this.updateText();
        this.updateOpacity();
    };

    Window_Destination.prototype.initOpacity = function() {
        if (this.findWindowBackType() === 0) {
            const opacity = this.isVisible() ? 255 : 0;
            this.setOpacity(opacity);
        }
    };

    Window_Destination.prototype.updateOpacity = function() {
        if (this.findWindowBackType() > 0) {
            this.visible = this.isVisible();
            return;
        }
        if (this.isVisible()) {
            this.setOpacity(this.opacity + this.getFadeValue());
        } else {
            this.setOpacity(this.opacity - this.getFadeValue());
        }
        this.visible = (this.opacity > 0);
    };

    Window_Destination.prototype.updateText = function() {
        const textList  = $gameSystem.getDestination();
        const iconIndex = $gameSystem.getDestinationIcon();
        if (textList.length !== this._textList.length) {
            this.height = this.fittingHeight(textList.length);
            this.createContents();
            this._textList = [];
        }
        textList.forEach((text, index) => {
            if (this._textList[index] === text && this._iconIndex === iconIndex) {
                return;
            }
            this._textList[index] = text;
            this._text      = text;
            this._iconIndex = iconIndex;
            this.drawDestination(index);
        });
    };

    Window_Destination.prototype.drawDestination = function(lineNumber) {
        this.contents.clearRect(0, lineNumber * this.lineHeight(), this.contentsWidth(), this.lineHeight());
        let x = this.getContentsX();
        const y = lineNumber * this.lineHeight() + this.lineHeight() / 2 - this.contents.fontSize / 2 - 4;
        if (this._iconIndex > 0 && lineNumber === 0) {
            this.drawIcon(this._iconIndex, x, y);
            x += ImageManager.iconWidth;
        }
        if (param.autoAdjust) {
            this.resetTextColor();
            this.drawText(this._text, x, y, this.contentsWidth() - x);
        } else {
            this.drawTextEx(this._text, x, y);
        }
    };

    Window_Destination.prototype.getContentsX = function() {
        if (param.textAlign === 0) {
            return 0;
        }
        let width = param.autoAdjust ? this.textWidth(this._text) : this.drawTextEx(this._text, 0, -this.lineHeight());
        if (this._iconIndex > 0) {
            width += ImageManager.iconWidth;
        }
        const division = (param.textAlign === 1 ? 2 : 1);
        return this.contentsWidth() / division - width / division;
    };

    Window_Destination.prototype.setOpacity = function(value) {
        this.opacity         = value;
        this.contentsOpacity = value;
    };

    Window_Destination.prototype.getFadeValue = function() {
        return 255 / param.fadeFrame;
    };

    Window_Destination.prototype.isVisible = function() {
        return this.isValidSwitch() && !this.isEventRunning() &&
            this.isExistText() && !this.isOverFrame() && !this.isNoDestinationWindowMap();
    };

    Window_Destination.prototype.isValidSwitch = function() {
        return !param.showingSwitchId || $gameSwitches.value(param.showingSwitchId);
    };

    Window_Destination.prototype.isOverFrame = function() {
        return $gameSystem.isOverDestinationFrame();
    };

    Window_Destination.prototype.isExistText = function() {
        return this._textList.length > 0 || !!this._iconIndex;
    };

    Window_Destination.prototype.isEventRunning = function() {
        return $gameMap.isEventRunning() && param.closeEventRunning;
    };

    Window_Destination.prototype.isNoDestinationWindowMap = function() {
        return $gameMap.isNoDestinationWindowMap();
    };

    //=============================================================================
    // Window_DestinationMenu
    //  メニュー画面の行動目標ウィンドウです。
    //=============================================================================
    function Window_DestinationMenu() {
        this.initialize.apply(this, arguments);
    }

    Window_DestinationMenu.prototype             = Object.create(Window_Destination.prototype);
    Window_DestinationMenu.prototype.constructor = Window_DestinationMenu;

    Window_DestinationMenu.prototype.isOverFrame = function() {
        return false;
    };

    Window_DestinationMenu.prototype.getFadeValue = function() {
        return 255;
    };
})();