/*=============================================================================
 SwitchExclusive.js
----------------------------------------------------------------------------
 (C)2025 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2025/03/05 初版
----------------------------------------------------------------------------
 [X]      : https://x.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/SwitchExclusive.js
@plugindesc Exclusive Switch Plugin
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

SwitchExclusive.js

Automatically controls a specified group of switches so that two or more
switches are not turned on at the same time.
When any switch in the group is turned on,
the other switches are automatically turned off.
It is acceptable for all switches to be turned off.

This plugin requires the base plugin "PluginCommonBase.js."
"PluginCommonBase.js" is located in the following folder
in the RPG Maker MZ installation folder:
dlc/BasicResources/plugins/official

Terms of Use:
You may modify and redistribute this plugin without permission from the
author, and there are no restrictions on its use (commercial, 18+, etc.).
This plugin is now yours.

@param switchGroupList
@text Exclusive Switch List
@desc A list of exclusive switches.
@type struct<SwitchGroup>[]
@default []
*/

/*~struct~SwitchGroup:
@param label
@text label
@desc This is the label for the switch group. There is no particular purpose for this, so give it an easy-to-understand name.
@type multiline_string

@param switches
@text Switch Group
@desc A list of exclusive switches. No more than two switches in this group can be ON at the same time.
@type switch[]
@default []
*/

/*:ja
@plugindesc 排他的スイッチプラグイン
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/SwitchExclusive.js
@base PluginCommonBase
@orderAfter PluginCommonBase
@author トリアコンタン

@param switchGroupList
@text 排他的スイッチリスト
@desc 排他的スイッチ群のリストです。
@default []
@type struct<SwitchGroup>[]

@help SwitchExclusive.js

指定したスイッチ群で二つ以上のスイッチが同時にONにならないよう自動制御します。
スイッチ群のなかのいずれかのスイッチがONになったとき、
その他のスイッチは自動でOFFになります。
すべてのスイッチがOFFになることは許容します。

このプラグインの利用にはベースプラグイン『PluginCommonBase.js』が必要です。
『PluginCommonBase.js』は、RPGツクールMZのインストールフォルダ配下の
以下のフォルダに格納されています。
dlc/BasicResources/plugins/official

利用規約：
 作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 についても制限はありません。
 このプラグインはもうあなたのものです。
*/

/*~struct~SwitchGroup:ja
@param label
@text ラベル
@desc スイッチグループのラベルです。特に利用用途はないのでわかりやすい名称を付けてください。
@default
@type multiline_string

@param switches
@text スイッチグループ
@desc 排他的スイッチのリストです。ここのグループ内のスイッチは同時に二つ以上ONになりません。
@default []
@type switch[]
*/

(() => {
    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);
    if (!param.switchGroupList) {
        param.switchGroupList = [];
    }
    const switchMap = new Map();
    param.switchGroupList.forEach(group => {
        group.switches.forEach(id => {
            if (!switchMap.has(id)) {
                switchMap.set(id, new Set());
            }
            group.switches.filter(s => s !== id).forEach(s => switchMap.get(id).add(s));
        });
    });

    const _Game_Switches_setValue = Game_Switches.prototype.setValue;
    Game_Switches.prototype.setValue = function(switchId, value) {
        _Game_Switches_setValue.apply(this, arguments);
        if (value && switchMap.has(switchId)) {
            switchMap.get(switchId).forEach(id => this.setValue(id, false));
        }
    }
})();