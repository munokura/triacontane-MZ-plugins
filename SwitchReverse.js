/*=============================================================================
 SwitchReverse.js
----------------------------------------------------------------------------
 (C)2021 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.1.0 2021/07/10 MZ版を作成
 1.0.0 2021/07/08 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/SwitchReverse.js
@plugindesc Switch Inversion Plugin
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

SwitchReverse.js

Reverses the switch's retrieval results and settings.

- Retrieval Reverse
Changes the switch so that it returns OFF when the switch is ON and ON when
the switch is OFF.

- Config Reverse
Setting a switch to ON will turn it OFF, and setting it to OFF will turn it
ON.

Retrieving or changing the switch settings from a plugin or script is
generally effective.
However, this is not guaranteed, as it depends on the plugin's implementation.

This plugin does not have plugin commands.

Terms of Use:
You may modify and redistribute this plugin without permission, and there are
no restrictions on its use (commercial, 18+, etc.).

This plugin is now yours.

@param setReverseList
@text Inverted list of settings
@desc The switch specified here will turn OFF when changed to ON, and ON when changed to OFF.
@type switch[]
@default []

@param getReverseList
@text Get reverse list
@desc The switch specified here returns OFF when it is ON and ON when it is OFF.
@type switch[]
@default []
*/

/*:ja
@plugindesc スイッチ反転プラグイン
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/SwitchReverse.js
@base PluginCommonBase
@orderAfter PluginCommonBase
@author トリアコンタン

@param setReverseList
@text 設定の反転リスト
@desc ここで指定したスイッチはONに変更したときOFFに、OFFに変更したときONになります。
@default []
@type switch[]

@param getReverseList
@text 取得の反転リスト
@desc ここで指定したスイッチはONのときにOFFを、OFFのときにONを返します。
@default []
@type switch[]

@help SwitchReverse.js

スイッチの取得結果や設定内容を反転させます。
・取得の反転
スイッチの実体がONのときにOFFを、実体がOFFのときにONを返すように変更します。

・設定の反転
スイッチをONに設定するとOFFに、OFFに設定するとONになります。

プラグインやスクリプトから取得、変更した場合も基本的には有効です。
ただし、プラグイン側の実装にも依存するので絶対ではありません。

このプラグインにはプラグインコマンドはありません。

利用規約：
 作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 についても制限はありません。
 このプラグインはもうあなたのものです。
*/

(()=> {
    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);
    if (!param.setReverseList) {
        param.setReverseList = [];
    }
    if (!param.getReverseList) {
        param.getReverseList = [];
    }

    const _Game_Switches_value = Game_Switches.prototype.value;
    Game_Switches.prototype.value = function(switchId) {
        const value = _Game_Switches_value.apply(this, arguments);
        if (param.getReverseList.contains(switchId)) {
            return !value;
        } else {
            return value;
        }
    };

    const _Game_Switches_setValue = Game_Switches.prototype.setValue;
    Game_Switches.prototype.setValue = function(switchId, value) {
        if (param.setReverseList.contains(switchId)) {
            arguments[1] = !value;
        }
        _Game_Switches_setValue.apply(this, arguments);
    };
})();