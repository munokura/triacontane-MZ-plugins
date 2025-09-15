/*=============================================================================
 AudioSuppression.js
----------------------------------------------------------------------------
 (C)2022 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.1.0 2023/10/07 フェードイン時間とフェードアウト時間を別々に指定できるよう修正
 1.0.1 2022/10/02 最小音量とフェード時間に制御文字\v[n]が使えるよう修正
 1.0.0 2022/09/23 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/AudioSuppression.js
@plugindesc Audio Volume Suppression Plug-in
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

AudioSuppression.js

Suppresses the volume of the audio being played when the specified switch is
ON.
However, this does not apply to SE or ME.

This plugin requires the base plugin "PluginCommonBase.js."
"PluginCommonBase.js" is located in the following folder under the RPG Maker
MZ installation folder:

dlc/BasicResources/plugins/official

Terms of Use:
You may modify and redistribute this plugin without permission, and there are
no restrictions on its use (commercial, R18+, etc.).
This plugin is now yours.

@param triggerSwitch
@text Trigger switch
@desc The number of frames over which the audio fades out to minimum volume.
@type switch
@default 1

@param minVolume
@text Minimum volume
@desc The minimum volume value.
@type number
@default 50
@min 0
@max 100

@param fadeTime
@text Fade Out Time
@desc The number of frames over which the audio fades out to minimum volume.
@type number
@default 60
@min 1

@param fadeInTime
@text Fade-in Time
@desc The number of frames the audio will fade in from its minimum volume.
@type number
@default 60
@min 1
*/

/*:ja
@plugindesc オーディオ音量抑制プラグイン
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/AudioSuppression.js
@base PluginCommonBase
@orderAfter PluginCommonBase
@author トリアコンタン

@param triggerSwitch
@text トリガースイッチ
@desc オーディオが最小音量までフェードアウトするフレーム数です。
@default 1
@type switch

@param minVolume
@text 最小音量
@desc 最小となる音量値です。
@default 50
@type number
@min 0
@max 100

@param fadeTime
@text フェードアウト時間
@desc オーディオが最小音量までフェードアウトするフレーム数です。
@default 60
@type number
@min 1

@param fadeInTime
@text フェードイン時間
@desc オーディオが最小音量からフェードインするフレーム数です。
@default 60
@type number
@min 1

@help AudioSuppression.js

指定したスイッチがONのとき演奏中のオーディオのボリュームを抑制します。
ただしSE,MEには適用されません。

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

    const _AudioManager_updateBufferParameters = AudioManager.updateBufferParameters;
    AudioManager.updateBufferParameters = function(buffer, configVolume, audio) {
        if (buffer === this._bgmBuffer || buffer === this._bgsBuffer) {
            configVolume *= (this._audioSuppression / 100);
        }
        _AudioManager_updateBufferParameters.call(this, buffer, configVolume, audio);
    };

    AudioManager._audioSuppression = 100;
    AudioManager.updateAudioSuppression = function() {
        if (!$gameSwitches) {
            return;
        }
        const sign = $gameSwitches.value(param.triggerSwitch) ? -1 : 1;
        if (this._audioSuppressionSign === sign && !this._audioSuppressionChange) {
            return;
        }
        this._audioSuppressionSign = sign;
        const fadeFrame = (sign === 1 ? param.fadeInTime || param.fadeTime : param.fadeTime) || 1;
        const suppressionDelta = (100 - param.minVolume) / fadeFrame;
        const newVolume = (this._audioSuppression + (suppressionDelta * sign)).clamp(param.minVolume, 100);
        this._audioSuppressionChange = this._audioSuppression !== newVolume;
        if (this._audioSuppressionChange) {
            this._audioSuppression = newVolume;
            this.updateBgmParameters(this._currentBgm);
            this.updateBgsParameters(this._currentBgs);
        }
    };

    const _SceneManager_updateMain = SceneManager.updateMain;
    SceneManager.updateMain = function() {
        _SceneManager_updateMain.apply(this, arguments);
        AudioManager.updateAudioSuppression();
    };
})();