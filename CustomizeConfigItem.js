//=============================================================================
// CustomizeConfigItem.js
// ----------------------------------------------------------------------------
// (C) 2016 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 3.4.0 2025/02/01 項目の隠しフラグをプラグインコマンドから再設定できる機能を追加
// 3.3.0 2024/03/30 追加項目同士の並び順を変更できる機能を追加
// 3.2.0 2021/12/21 項目に余白を設定できる機能を追加
// 3.1.3 2021/08/09 セーブデータをロードした際に、追加オプションの設定値がゲーム変数に反映されない問題を修正
// 3.1.2 2021/08/05 セーブがある状態で隠し項目を追加した時に上手く動作しない問題を修正
// 3.1.1 2020/10/13 Mano_InputConfig.jsと併用したとき、項目を末尾以外に追加すると表示不整合が発生する競合を修正
// 3.1.0 2020/08/20 スイッチ項目でONとOFFの表示文字列を変更できる機能を追加
// 3.0.0 2020/08/20 MZで動作するよう全面的に修正
// 2.1.0 2017/12/15 追加項目のデフォルト項目を含めた並び順を自由に設定できる機能を追加
//                  項目名称を日本語化
// 2.0.1 2017/10/15 2.0.0の修正によりスイッチ項目を有効にしたときにゲーム開始するとエラーになる問題を修正
// 2.0.0 2017/09/10 ツクールの型指定機能に対応し、各オプション項目を任意の数だけ追加できる機能を追加
// 1.2.3 2017/06/08 1.2.2の修正により起動できなくなっていた問題を修正
// 1.2.2 2017/05/27 競合の可能性のある記述（Objectクラスへのプロパティ追加）をリファクタリング
// 1.2.1 2016/12/08 1.2.0の機能追加以降、デフォルト項目で決定ボタンを押すとエラーになっていた現象を修正
// 1.2.0 2016/12/02 各項目で決定ボタンを押したときに実行されるスクリプトを設定できる機能を追加
// 1.1.1 2016/08/14 スイッチ項目、音量項目の初期値が無効になっていた問題を修正
// 1.1.0 2016/04/29 項目をクリックしたときに項目値が循環するよう修正
// 1.0.0 2016/01/17 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/CustomizeConfigItem.js
@plugindesc Optional item creation plugin
@author Triacontane
@license MIT License

@help
English Help Translator: munokura
Please check the URL below for the latest version of the plugin.
URL https://triacontane.blogspot.com
-----

Add any item to the options screen.
There are four types of items as follows.
Set the value of unnecessary items to blank.

- Switch Item:
An item for selecting ON/OFF. The value is synchronized with the switch with
the specified number.
Setting a value from the options will be reflected in the switch,
and changing the switch will be reflected in the option value.
In addition, the value is shared between save data.
Setting the hidden flag will prevent an item from appearing on the options
screen.
This can be used for items that only appear after progressing through the
game.
The hidden flag can be disabled using the plugin command.

Script is an item for advanced users. Hover the cursor over the item and press
the confirm button
to execute the specified JavaScript.
This is mainly used for transitions to dedicated settings screens, etc.

- Number Item:
An item for selecting a number. The value is synchronized with the variable
with the specified number.
In addition to the contents specified in the switch item,
you can specify minimum and maximum values, as well as the value that changes
with a single input.

- Volume Item:
An item for selecting the volume. Use it for things like character voice
volume, with the same specifications as background music volume.

- Character Item:
This item allows you to select a character. It selects an item from a
specified character array.
The index of the selected character (starting at 0) is set to the variable.
The initial value is also an index.

You can set margins for items, but doing so will disable scrolling in the
options window.

Terms of Use:
You may modify and redistribute this plugin without permission from the
author, and there are no restrictions on its use (commercial, R18+, etc.).
This plugin is now yours.

@param NumberOptions
@text Numerical items
@desc Optional field information for the numeric field to be added.
@type struct<NumberData>[]

@param StringOptions
@text string item
@desc Optional item information for the text item to be added.
@type struct<StringData>[]

@param SwitchOptions
@text Switch Item
@desc Optional item information for the switch item to be added.
@type struct<BooleanData>[]

@param VolumeOptions
@text Volume item
@desc Optional item information for the volume item to be added.
@type struct<VolumeData>[]

@param CustomOrder
@text Order of additional items
@desc Set this if you want to change the default order of items that have the same addition position specified.
@type select[]
@default ["NumberOptions","StringOptions","SwitchOptions","VolumeOptions"]
@option 数値項目
@value NumberOptions
@option 文字列項目
@value StringOptions
@option スイッチ項目
@value SwitchOptions
@option 音量項目
@value VolumeOptions

@command UNLOCK
@text Unhiding an Item
@desc Removes the hidden flag for the specified item.
@arg name
@text Item name
@desc The name of the target item.

@command LOCK
@text Hidden reset of items
@desc Resets the hidden flag for the specified item.
@arg name
@text Item name
@desc The name of the target item.
*/

/*~struct~NumberData:
@param Name
@text Item name
@desc The name of the item.
@default 数値項目1

@param DefaultValue
@text Initial Value
@desc The initial value of the item.
@type number
@default 0

@param VariableID
@text Variable Number
@desc The variable number where the setting content of the item will be stored.
@type variable
@default 0

@param HiddenFlag
@text Hidden Flag
@desc The item will be hidden by default and will be shown when you run the plugin command.
@type boolean
@default false

@param Script
@text script
@desc This is the script that will be executed when the item is selected.

@param NumberMin
@text Minimum
@desc The minimum value of the item.
@type number
@default 0

@param NumberMax
@text Maximum
@desc The maximum value of the item.
@type number
@default 100

@param NumberStep
@text Change Value
@desc The amount of change in the value when the item is operated.
@type number
@default 20

@param AddPosition
@text additional position
@desc The position to add the item above.
@type select
@option 末尾に追加
@option Constant dash
@value alwaysDash
@option Command Memory
@value commandRemember
@option Touch UI
@value touchUI
@option BGM volume
@value bgmVolume
@option BGS Volume
@value bgsVolume
@option ME Volume
@value meVolume
@option Sound Effects Volume
@value seVolume

@param PaddingTop
@text margin
@desc The number of pixels of white space above the item. Specify this if you want to increase the spacing between items.
@type number
@default 0
*/

/*~struct~BooleanData:
@param Name
@text Item name
@desc The name of the item.
@default スイッチ項目1

@param DefaultValue
@text Initial Value
@desc The initial value of the item.
@type boolean
@default false

@param SwitchID
@text Switch Number
@desc The switch number where the setting of the item is stored.
@type switch
@default 0

@param OnText
@text ON text
@desc The text that will be displayed in the options window when the switch is ON. If omitted, it will default to ON.

@param OffText
@text OFF Text
@desc The text that will be displayed in the options window when the switch is ON. If omitted, it will be OFF.

@param HiddenFlag
@text Hidden Flag
@desc The item will be hidden by default and will be shown when you run the plugin command.
@type boolean
@default false

@param Script
@text script
@desc This is the script that will be executed when the item is selected.

@param AddPosition
@text additional position
@desc The position to add the item above.
@type select
@option 末尾に追加
@option Constant dash
@value alwaysDash
@option Command Memory
@value commandRemember
@option Touch UI
@value touchUI
@option BGM volume
@value bgmVolume
@option BGS Volume
@value bgsVolume
@option ME Volume
@value meVolume
@option Sound Effects Volume
@value seVolume

@param PaddingTop
@text margin
@desc The number of pixels of white space above the item. Specify this if you want to increase the spacing between items.
@type number
@default 0
*/

/*~struct~StringData:
@param Name
@text Item name
@desc The name of the item.
@default 文字列項目1

@param DefaultValue
@text Initial Value
@desc The initial value of the item. Specify the index number.
@type number
@default 0

@param VariableID
@text Variable Number
@desc The variable number where the setting content of the item will be stored.
@type variable
@default 0

@param HiddenFlag
@text Hidden Flag
@desc The item will be hidden by default and will be shown when you run the plugin command.
@type boolean
@default false

@param Script
@text script
@desc This is the script that will be executed when the item is selected.

@param StringItems
@text Content Array
@desc An array of item settings.
@type string[]

@param AddPosition
@text additional position
@desc The position to add the item above.
@type select
@option 末尾に追加
@option Constant dash
@value alwaysDash
@option Command Memory
@value commandRemember
@option Touch UI
@value touchUI
@option BGM volume
@value bgmVolume
@option BGS Volume
@value bgsVolume
@option ME Volume
@value meVolume
@option Sound Effects Volume
@value seVolume

@param PaddingTop
@text margin
@desc The number of pixels of white space above the item. Specify this if you want to increase the spacing between items.
@type number
@default 0
*/

/*~struct~VolumeData:
@param Name
@text Item name
@desc The name of the item.
@default 音量項目1

@param DefaultValue
@text Initial Value
@desc The initial value of the item.
@type number
@default 0

@param VariableID
@text Variable Number
@desc The variable number where the setting content of the item will be stored.
@type variable
@default 0

@param HiddenFlag
@text Hidden Flag
@desc The item will be hidden by default and will be shown when you run the plugin command.
@type boolean
@default false

@param Script
@text script
@desc This is the script that will be executed when the item is selected.

@param AddPosition
@text additional position
@desc The position to add the item above.
@type select
@option 末尾に追加
@option Constant dash
@value alwaysDash
@option Command Memory
@value commandRemember
@option Touch UI
@value touchUI
@option BGM volume
@value bgmVolume
@option BGS Volume
@value bgsVolume
@option ME Volume
@value meVolume
@option Sound Effects Volume
@value seVolume

@param PaddingTop
@text margin
@desc The number of pixels of white space above the item. Specify this if you want to increase the spacing between items.
@type number
@default 0
*/

/*:ja
@plugindesc オプション任意項目作成プラグイン
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/CustomizeConfigItem.js
@author トリアコンタン
@base PluginCommonBase

@param NumberOptions
@text 数値項目
@desc 追加する数値項目のオプション項目情報です。
@default
@type struct<NumberData>[]

@param StringOptions
@text 文字列項目
@desc 追加する文字項目のオプション項目情報です。
@default
@type struct<StringData>[]

@param SwitchOptions
@text スイッチ項目
@desc 追加するスイッチ項目のオプション項目情報です。
@default
@type struct<BooleanData>[]

@param VolumeOptions
@text 音量項目
@desc 追加する音量項目のオプション項目情報です。
@default
@type struct<VolumeData>[]

@param CustomOrder
@text 追加項目の並び順
@desc 同じ追加位置を指定した項目同士の並び順をデフォルトから変更したい場合に設定してください。
@default ["NumberOptions","StringOptions","SwitchOptions","VolumeOptions"]
@type select[]
@option 数値項目
@value NumberOptions
@option 文字列項目
@value StringOptions
@option スイッチ項目
@value SwitchOptions
@option 音量項目
@value VolumeOptions

@command UNLOCK
@text 項目の隠し解除
@desc 指定した項目の隠しフラグを解除します。

@arg name
@text 項目名
@desc 対象の項目名称です。
@default

@command LOCK
@text 項目の隠し再設定
@desc 指定した項目の隠しフラグを再設定します。

@arg name
@text 項目名
@desc 対象の項目名称です。
@default

@help オプション画面に任意の項目を追加します。
項目の種類は、以下の四種類があります。
不要な項目は値を空に設定してください。

・スイッチ項目：
ON/OFFを選択する項目です。指定した番号のスイッチと値が同期されます。
オプションから値を設定すれば、それがスイッチに反映され、
スイッチを変更すれば、オプションの値に反映されます。
さらに、値はセーブデータ間で共有されます。
隠しフラグを設定すると、オプション画面に表示されなくなります。
ゲームを進めないと出現しない項目などに利用できます。
隠しフラグはプラグインコマンドから解除できます。

スクリプトは上級者向け項目です。対象にカーソルを合わせて決定ボタンを
押下すると指定したJavaScriptを実行できます。
主に専用の設定画面などの遷移に使用します。

・数値項目：
数値を選択する項目です。指定した番号の変数と値が同期されます。
スイッチ項目で指定した内容に加えて、
最小値と最大値および一回の入力で変化する値を指定します。

・音量項目：
音量を選択する項目です。BGMボリュームなどと同じ仕様で
キャラクターごとのボイス音量等に使ってください。

・文字項目：
文字を選択する項目です。指定した文字の配列から項目を選択します。
選択した文字のインデックス(開始位置は0)が変数に設定されます。
初期値に設定する値もインデックスです。

項目には余白を設定できますが、設定した場合は
オプションウィンドウのスクロールが無効になります。

利用規約：
 作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 についても制限はありません。
 このプラグインはもうあなたのものです。
*/

/*~struct~NumberData:ja
@param Name
@text 項目名称
@desc 項目の名称です。
@default 数値項目1

@param DefaultValue
@text 初期値
@desc 項目の初期値です。
@default 0
@type number

@param VariableID
@text 変数番号
@desc 項目の設定内容が格納される変数番号です。
@default 0
@type variable

@param HiddenFlag
@text 隠しフラグ
@desc 項目がデフォルトで隠されるようになります。プラグインコマンドの実行で表示されます。
@default false
@type boolean

@param Script
@text スクリプト
@desc 項目を決定したときに実行されるスクリプトです。
@default

@param NumberMin
@text 最小値
@desc 項目の最小値です。
@default 0
@type number

@param NumberMax
@text 最大値
@desc 項目の最大値です。
@default 100
@type number

@param NumberStep
@text 変化値
@desc 項目を操作したときの数値の変化量です。
@default 20
@type number

@param AddPosition
@text 追加位置
@desc 項目を追加する位置です。指定した項目の上に追加されます。
@default
@type select
@option 末尾に追加
@value
@option 常時ダッシュ
@value alwaysDash
@option コマンド記憶
@value commandRemember
@option タッチUI
@value touchUI
@option BGM 音量
@value bgmVolume
@option BGS 音量
@value bgsVolume
@option ME 音量
@value meVolume
@option SE 音量
@value seVolume

@param PaddingTop
@text 余白
@desc 項目の上の余白ピクセル数です。項目の間隔を開けたいときに指定します。
@default 0
@type number
*/

/*~struct~BooleanData:ja
@param Name
@text 項目名称
@desc 項目の名称です。
@default スイッチ項目1

@param DefaultValue
@text 初期値
@desc 項目の初期値です。
@default false
@type boolean

@param SwitchID
@text スイッチ番号
@desc 項目の設定内容が格納されるスイッチ番号です。
@default 0
@type switch

@param OnText
@text ONテキスト
@desc スイッチがONのときにオプションウィンドウに表示されるテキストです。省略するとONになります。
@default

@param OffText
@text OFFテキスト
@desc スイッチがONのときにオプションウィンドウに表示されるテキストです。省略するとOFFになります。
@default

@param HiddenFlag
@text 隠しフラグ
@desc 項目がデフォルトで隠されるようになります。プラグインコマンドの実行で表示されます。
@default false
@type boolean

@param Script
@text スクリプト
@desc 項目を決定したときに実行されるスクリプトです。
@default

@param AddPosition
@text 追加位置
@desc 項目を追加する位置です。指定した項目の上に追加されます。
@default
@type select
@option 末尾に追加
@value
@option 常時ダッシュ
@value alwaysDash
@option コマンド記憶
@value commandRemember
@option タッチUI
@value touchUI
@option BGM 音量
@value bgmVolume
@option BGS 音量
@value bgsVolume
@option ME 音量
@value meVolume
@option SE 音量
@value seVolume

@param PaddingTop
@text 余白
@desc 項目の上の余白ピクセル数です。項目の間隔を開けたいときに指定します。
@default 0
@type number
*/

/*~struct~StringData:ja
@param Name
@text 項目名称
@desc 項目の名称です。
@default 文字列項目1

@param DefaultValue
@text 初期値
@desc 項目の初期値です。インデックスの数値を指定します。
@default 0
@type number

@param VariableID
@text 変数番号
@desc 項目の設定内容が格納される変数番号です。
@default 0
@type variable

@param HiddenFlag
@text 隠しフラグ
@desc 項目がデフォルトで隠されるようになります。プラグインコマンドの実行で表示されます。
@default false
@type boolean

@param Script
@text スクリプト
@desc 項目を決定したときに実行されるスクリプトです。
@default

@param StringItems
@text 内容の配列
@desc 項目の設定内容の配列です。
@default
@type string[]

@param AddPosition
@text 追加位置
@desc 項目を追加する位置です。指定した項目の上に追加されます。
@default
@type select
@option 末尾に追加
@value
@option 常時ダッシュ
@value alwaysDash
@option コマンド記憶
@value commandRemember
@option タッチUI
@value touchUI
@option BGM 音量
@value bgmVolume
@option BGS 音量
@value bgsVolume
@option ME 音量
@value meVolume
@option SE 音量
@value seVolume

@param PaddingTop
@text 余白
@desc 項目の上の余白ピクセル数です。項目の間隔を開けたいときに指定します。
@default 0
@type number
*/

/*~struct~VolumeData:ja
@param Name
@text 項目名称
@desc 項目の名称です。
@default 音量項目1

@param DefaultValue
@text 初期値
@desc 項目の初期値です。
@default 0
@type number

@param VariableID
@text 変数番号
@desc 項目の設定内容が格納される変数番号です。
@default 0
@type variable

@param HiddenFlag
@text 隠しフラグ
@desc 項目がデフォルトで隠されるようになります。プラグインコマンドの実行で表示されます。
@default false
@type boolean

@param Script
@text スクリプト
@desc 項目を決定したときに実行されるスクリプトです。
@default

@param AddPosition
@text 追加位置
@desc 項目を追加する位置です。指定した項目の上に追加されます。
@default
@type select
@option 末尾に追加
@value
@option 常時ダッシュ
@value alwaysDash
@option コマンド記憶
@value commandRemember
@option タッチUI
@value touchUI
@option BGM 音量
@value bgmVolume
@option BGS 音量
@value bgsVolume
@option ME 音量
@value meVolume
@option SE 音量
@value seVolume

@param PaddingTop
@text 余白
@desc 項目の上の余白ピクセル数です。項目の間隔を開けたいときに指定します。
@default 0
@type number
*/

(function() {
    'use strict';
    var script = document.currentScript;

    PluginManagerEx.registerCommand(script, 'UNLOCK', function(args) {
        ConfigManager.customParamUnlock(args.name, false);
    });

    PluginManagerEx.registerCommand(script, 'LOCK', function(args) {
        ConfigManager.customParamUnlock(args.name, true);
    });

    var iterate = function(that, handler) {
        Object.keys(that).forEach(function(key, index) {
            handler.call(that, key, that[key], index);
        });
    };

    //=============================================================================
    // パラメータの取得と整形
    //=============================================================================
    var param = PluginManagerEx.createParameter(script);
    if (!param.NumberOptions) {
        param.NumberOptions = [];
    }
    if (!param.StringOptions) {
        param.StringOptions = [];
    }
    if (!param.SwitchOptions) {
        param.SwitchOptions = [];
    }
    if (!param.VolumeOptions) {
        param.VolumeOptions = [];
    }
    if (!param.CustomOrder) {
        param.CustomOrder = ['NumberOptions', 'StringOptions', 'SwitchOptions', 'VolumeOptions'];
    }

    var localOptionWindowIndex = 0;

    //=============================================================================
    // ConfigManager
    //  追加項目の設定値や初期値を管理します。
    //=============================================================================
    ConfigManager.customParams   = null;
    ConfigManager.hiddenInfo     = {};
    ConfigManager._symbolNumber  = 'Number';
    ConfigManager._symbolBoolean = 'Boolean';
    ConfigManager._symbolString  = 'String';
    ConfigManager._symbolVolume  = 'Volume';

    ConfigManager.getCustomParams = function() {
        if (this.customParams) {
            return this.customParams;
        }
        this.customParams = {};
        param.CustomOrder.forEach(orderName => {
            param[orderName].forEach((optionItem, index) => {
                this[`make${orderName}`](optionItem, index);
            });
        });
        return this.customParams;
    };

    ConfigManager.makeNumberOptions = function(optionItem, index) {
        var data    = this.makeCommonOption(optionItem, index, this._symbolNumber);
        data.min    = optionItem.NumberMin;
        data.max    = optionItem.NumberMax;
        data.offset = optionItem.NumberStep;
        this.pushOptionData(data);
    };

    ConfigManager.makeStringOptions = function(optionItem, index) {
        var data    = this.makeCommonOption(optionItem, index, this._symbolString);
        data.values = optionItem.StringItems || ['no item'];
        data.min    = 0;
        data.max    = data.values.length - 1;
        this.pushOptionData(data);
    };

    ConfigManager.makeSwitchOptions = function(optionItem, index) {
        var data       = this.makeCommonOption(optionItem, index, this._symbolBoolean);
        data.variable  = optionItem.SwitchID;
        data.onText    = optionItem.OnText;
        data.offText   = optionItem.OffText;
        this.pushOptionData(data);
    };

    ConfigManager.makeVolumeOptions = function(optionItem, index) {
        var data = this.makeCommonOption(optionItem, index, this._symbolVolume);
        this.pushOptionData(data);
    };

    ConfigManager.makeCommonOption = function(optionItem, index, type) {
        var data       = {};
        data.symbol    = `${type}${index + 1}`;
        data.name      = optionItem.Name;
        data.hidden    = optionItem.HiddenFlag;
        data.script    = optionItem.Script;
        data.initValue = optionItem.DefaultValue;
        data.variable  = optionItem.VariableID || 0;
        data.addPotion = optionItem.AddPosition;
        data.padding   = optionItem.PaddingTop;
        return data;
    };

    ConfigManager.pushOptionData = function(data) {
        this.customParams[data.symbol] = data;
    };

    var _ConfigManager_makeData = ConfigManager.makeData;
    ConfigManager.makeData      = function() {
        var config        = _ConfigManager_makeData.apply(this, arguments);
        config.hiddenInfo = {};
        iterate(this.getCustomParams(), function(symbol) {
            config[symbol]            = this[symbol];
            config.hiddenInfo[symbol] = this.hiddenInfo[symbol];
        }.bind(this));
        return config;
    };

    var _ConfigManager_load = ConfigManager.load;
    ConfigManager.load = function() {
        this.applyData({});
        _ConfigManager_load.apply(this, arguments);
    };

    var _ConfigManager_applyData = ConfigManager.applyData;
    ConfigManager.applyData      = function(config) {
        _ConfigManager_applyData.apply(this, arguments);
        iterate(this.getCustomParams(), function(symbol, item) {
            if (symbol.contains(this._symbolBoolean)) {
                this[symbol] = this.readFlagCustom(config, symbol, item);
            } else if (symbol.contains(this._symbolVolume)) {
                this[symbol] = this.readVolumeCustom(config, symbol, item);
            } else {
                this[symbol] = this.readOther(config, symbol, item);
            }
            if (config.hiddenInfo && config.hiddenInfo.hasOwnProperty(symbol)) {
                this.hiddenInfo[symbol] = config.hiddenInfo[symbol];
            } else {
                this.hiddenInfo[symbol] = item.hidden;
            }
        }.bind(this));
    };

    ConfigManager.customParamUnlock = function(name, lock) {
        iterate(this.getCustomParams(), function(symbol, item) {
            if (item.name === name) this.hiddenInfo[symbol] = lock;
        }.bind(this));
        this.save();
    };

    ConfigManager.readOther = function(config, name, item) {
        var value = config[name];
        if (value !== undefined) {
            return Number(value).clamp(item.min, item.max);
        } else {
            return item.initValue;
        }
    };

    ConfigManager.readFlagCustom = function(config, name, item) {
        if (config[name] !== undefined) {
            return this.readFlag(config, name);
        } else {
            return item.initValue;
        }
    };

    ConfigManager.readVolumeCustom = function(config, name, item) {
        if (config[name] !== undefined) {
            return this.readVolume(config, name);
        } else {
            return item.initValue;
        }
    };

    ConfigManager.exportCustomParams = function() {
        if (!$gameVariables || !$gameSwitches) return;
        iterate(this.getCustomParams(), function(symbol, item) {
            if (item.variable > 0) {
                if (symbol.contains(this._symbolBoolean)) {
                    $gameSwitches.setValue(item.variable, !!this[symbol]);
                } else {
                    $gameVariables.setValue(item.variable, this[symbol]);
                }
            }
        }.bind(this));
    };

    ConfigManager.importCustomParams = function() {
        if (!$gameVariables || !$gameSwitches) return;
        iterate(this.getCustomParams(), function(symbol, item) {
            if (item.variable > 0) {
                if (symbol.contains(this._symbolBoolean)) {
                    this[symbol] = $gameSwitches.value(item.variable);
                } else if (symbol.contains(this._symbolVolume)) {
                    this[symbol] = $gameVariables.value(item.variable).clamp(0, 100);
                } else {
                    this[symbol] = $gameVariables.value(item.variable).clamp(item.min, item.max);
                }
            }
        }.bind(this));
    };

    var _ConfigManager_save = ConfigManager.save;
    ConfigManager.save      = function() {
        _ConfigManager_save.apply(this, arguments);
        this.exportCustomParams();
    };

    //=============================================================================
    // Game_Map
    //  リフレッシュ時にオプション値を同期します。
    //=============================================================================
    var _Game_Map_refresh      = Game_Map.prototype.refresh;
    Game_Map.prototype.refresh = function() {
        _Game_Map_refresh.apply(this, arguments);
        ConfigManager.importCustomParams();
    };

    //=============================================================================
    // DataManager
    //  セーブ時とロード時にオプション値を同期します。
    //=============================================================================
    var _DataManager_setupNewGame = DataManager.setupNewGame;
    DataManager.setupNewGame      = function() {
        _DataManager_setupNewGame.apply(this, arguments);
        ConfigManager.exportCustomParams();
    };

    var _DataManager_extractSaveContents = DataManager.extractSaveContents;
    DataManager.extractSaveContents = function(contents) {
        _DataManager_extractSaveContents.apply(this, arguments);
        ConfigManager.exportCustomParams();
    };

    var _Scene_Options_maxCommands = Scene_Options.prototype.maxCommands;
    Scene_Options.prototype.maxCommands = function() {
        var count =  _Scene_Options_maxCommands.apply(this, arguments);
        var params = ConfigManager.getCustomParams();
        return count + Object.keys(params).reduce(function (prev, key) {
            return ConfigManager.hiddenInfo[key] ? prev : prev + 1;
        }, 0);
    };

    var _Scene_Options_maxVisibleCommands = Scene_Options.prototype.maxVisibleCommands;
    Scene_Options.prototype.maxVisibleCommands = function() {
        var result = _Scene_Options_maxVisibleCommands.apply(this, arguments);
        return this.findPaddingHeight() > 0 ? Infinity : result;
    };

    var _Scene_Options_optionsWindowRect = Scene_Options.prototype.optionsWindowRect;
    Scene_Options.prototype.optionsWindowRect = function() {
        var rect = _Scene_Options_optionsWindowRect.apply(this, arguments);
        rect.height += this.findPaddingHeight();
        return rect;
    };

    Scene_Options.prototype.findPaddingHeight = function() {
        var params = ConfigManager.getCustomParams();
        return Object.keys(params).reduce(function (prev, key) {
            if (ConfigManager.hiddenInfo[key]) {
                return prev;
            }
            return prev + (params[key].padding || 0);
        }, 0);
    };

    //=============================================================================
    // Window_Options
    //  追加項目を描画します。
    //=============================================================================
    var _Window_Options_initialize      = Window_Options.prototype.initialize;
    Window_Options.prototype.initialize = function() {
        this._customParams = ConfigManager.getCustomParams();
        _Window_Options_initialize.apply(this, arguments);
        this.select(localOptionWindowIndex);
        localOptionWindowIndex = 0;
    };

    var _Window_Options_itemRect = Window_Options.prototype.itemRect;
    Window_Options.prototype.itemRect = function(index) {
        var rect = _Window_Options_itemRect.apply(this, arguments);
        rect.y += this.findPaddingHeight(index);
        return rect;
    };

    Window_Options.prototype.findPaddingHeight = function(index) {
        return this._list.reduce(function(prev, item, itemIndex) {
            return prev + (itemIndex <= index && item.ext ? item.ext : 0);
        }, 0);
    };

    var _Window_Options_makeCommandList      = Window_Options.prototype.makeCommandList;
    Window_Options.prototype.makeCommandList = function() {
        _Window_Options_makeCommandList.apply(this, arguments);
        this.addCustomOptions();
    };

    Window_Options.prototype.addCustomOptions = function() {
        iterate(this._customParams, function(key, item) {
            if (!ConfigManager.hiddenInfo[key]) {
                this.addCommand(item.name, key, undefined, item.padding);
                if (item.addPotion) {
                    this.shiftCustomOptions(item.addPotion);
                }
            }
        }.bind(this));
    };

    Window_Options.prototype.shiftCustomOptions = function(addPotion) {
        var targetCommand = this._list.filter(function(command) {
            return command.symbol === addPotion;
        })[0];
        if (!targetCommand) {
            return;
        }
        var targetIndex = this._list.indexOf(targetCommand);
        var newCommand = this._list.pop();
        this.addIndexForManoInputConfig(targetIndex);
        this._list.splice(targetIndex, 0, newCommand);
    };

    Window_Options.prototype.addIndexForManoInputConfig = function(index) {
        if (this._gamepadOptionIndex > index) {
            this._gamepadOptionIndex += 1;
        }
        if (this._keyboardConfigIndex > index) {
            this._keyboardConfigIndex += 1;
        }
    };

    var _Window_Options_statusText      = Window_Options.prototype.statusText;
    Window_Options.prototype.statusText = function(index) {
        var result = _Window_Options_statusText.apply(this, arguments);
        var symbol = this.commandSymbol(index);
        var value  = this.getConfigValue(symbol);
        if (this.isNumberSymbol(symbol)) {
            result = this.numberStatusText(value);
        } else if (this.isStringSymbol(symbol)) {
            result = this.stringStatusText(value, symbol);
        } else if (this.isBooleanSymbol(symbol)) {
            result = this.booleanCustomStatusText(value, symbol);
        }
        return result;
    };

    Window_Options.prototype.isNumberSymbol = function(symbol) {
        return symbol.contains(ConfigManager._symbolNumber);
    };

    Window_Options.prototype.isStringSymbol = function(symbol) {
        return symbol.contains(ConfigManager._symbolString);
    };

    Window_Options.prototype.isBooleanSymbol = function(symbol) {
        return symbol.contains(ConfigManager._symbolBoolean);
    };

    Window_Options.prototype.isCustomSymbol = function(symbol) {
        return !!this._customParams[symbol];
    };

    Window_Options.prototype.numberStatusText = function(value) {
        return value;
    };

    Window_Options.prototype.stringStatusText = function(value, symbol) {
        return this._customParams[symbol].values[value];
    };

    Window_Options.prototype.booleanCustomStatusText = function(value, symbol) {
        var data = this._customParams[symbol];
        var property = value ? 'onText' : 'offText';
        if (data && data[property]) {
            return data[property];
        } else {
            return this.booleanStatusText(value);
        }
    };

    var _Window_Options_processOk      = Window_Options.prototype.processOk;
    Window_Options.prototype.processOk = function() {
        if (!this._shiftValue(1, true)) _Window_Options_processOk.apply(this, arguments);
        this.execScript();
    };

    var _Window_Options_cursorRight      = Window_Options.prototype.cursorRight;
    Window_Options.prototype.cursorRight = function(wrap) {
        if (!this._shiftValue(1, false)) _Window_Options_cursorRight.apply(this, arguments);
    };

    var _Window_Options_cursorLeft      = Window_Options.prototype.cursorLeft;
    Window_Options.prototype.cursorLeft = function(wrap) {
        if (!this._shiftValue(-1, false)) _Window_Options_cursorLeft.apply(this, arguments);
    };

    Window_Options.prototype._shiftValue = function(sign, loopFlg) {
        var symbol = this.commandSymbol(this.index());
        var value  = this.getConfigValue(symbol);
        if (this.isNumberSymbol(symbol)) {
            value += this.numberOffset(symbol) * sign;
            this.changeValue(symbol, this._clampValue(value, symbol, loopFlg));
            return true;
        }
        if (this.isStringSymbol(symbol)) {
            value += sign;
            this.changeValue(symbol, this._clampValue(value, symbol, loopFlg));
            return true;
        }
        return false;
    };

    Window_Options.prototype.execScript = function() {
        var symbol = this.commandSymbol(this.index());
        if (!this.isCustomSymbol(symbol)) return;
        var script = this._customParams[symbol].script;
        if (script) eval(script);
        localOptionWindowIndex = this.index();
    };

    Window_Options.prototype._clampValue = function(value, symbol, loopFlg) {
        var maxValue = this._customParams[symbol].max;
        var minValue = this._customParams[symbol].min;
        if (loopFlg) {
            if (value > maxValue) value = minValue;
            if (value < minValue) value = maxValue;
        }
        return value.clamp(this._customParams[symbol].min, this._customParams[symbol].max);
    };

    Window_Options.prototype.numberOffset = function(symbol) {
        var value = this._customParams[symbol].offset;
        if (Input.isPressed('shift')) value *= 10;
        return value;
    };
})();