//=============================================================================
// ZeroDamageSound.js
// ----------------------------------------------------------------------------
// (C)2022 COBURA, Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.1.0 2022/12/21 ノーダメージ効果音演奏の対象外になるスキルやアイテムを作成できる機能を追加
// 1.0.0 2022/11/07 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/ZeroDamageSound.js
@plugindesc No Damage Sound Effect Plugin
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

ZeroDamageSound.js

Plays a sound effect when damage is 0.

If you don't want to play a sound effect even when damage is 0, write the
following tag in the memo field of the target skill or item:
<NoZeroSound>

This plugin requires the base plugin "PluginCommonBase.js."
"PluginCommonBase.js" is located in the following folder under the RPG Maker
MZ installation folder:
dlc/BasicResources/plugins/official

Terms of Use:
You may modify and redistribute this plugin without permission, and there are
no restrictions on its use (commercial, 18+, etc.).
This plugin is now yours.

@param name
@text SE
@desc The file name of the sound effect to be changed.
@type file
@dir audio/se

@param volume
@text volume
@desc The volume of the sound effect to change.
@type number
@default 90
@max 100

@param pitch
@text pitch
@desc The pitch of the sound effect to change.
@type number
@default 100
@min 50
@max 150

@param pan
@text phase
@desc This is the phase (position) of the sound effect to be changed.
@type number
@default 0
@min -100
@max 100
*/

/*:ja
@plugindesc ノーダメージ効果音プラグイン
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/ZeroDamageSound.js
@base PluginCommonBase
@orderAfter PluginCommonBase
@author COBURA, トリアコンタン


@param name
@text SE
@desc 変更する効果音のファイル名です。
@default
@type file
@dir audio/se

@param volume
@text 音量
@desc 変更する効果音の音量です。
@default 90
@type number
@max 100

@param pitch
@text ピッチ
@desc 変更する効果音のピッチです。
@default 100
@type number
@min 50
@max 150

@param pan
@text 位相
@desc 変更する効果音の位相（定位）です。
@default 0
@type number
@min -100
@max 100


@help ZeroDamageSound.js

ダメージが0の時効果音を鳴らします。

ダメージが0でも効果音を鳴らしたくないときは、対象スキル、アイテムの
メモ欄に以下のタグを記述します。
<NoZeroSound>

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

	const _Game_Action_executeDamage = Game_Action.prototype.executeDamage;
	Game_Action.prototype.executeDamage = function(target, value) {
		_Game_Action_executeDamage.apply(this, arguments);
		
		if (value === 0 && this.isNeedZeroSound()) {
			AudioManager.playSe({"name":param.name, "volume":param.volume, "pitch":param.pitch, "pan":param.pan});
		}
	};

	Game_Action.prototype.isNeedZeroSound = function() {
		return !PluginManagerEx.findMetaValue(this.item(), ['NoZeroSound']);
	};
})();