/*=============================================================================
 ElectronForMz.js
----------------------------------------------------------------------------
 (C)2022 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.2.0 2023/07/23 Mac対応と全体的な見直しを行いました。
 1.1.0 2023/06/01 Electron v20.3.9およびコアスクリプトv1.6.0に対応
 1.0.0 2022/02/20 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/ElectronForMz.js
@plugindesc Electron development support plugin
@author Triacontane
@license MIT License

@help
English Help Translator: munokura
Please check the URL below for the latest version of the plugin.
URL https://triacontane.blogspot.com
-----

ElectronForMz.js

This is a plugin required for developing and deploying RPG Maker MZ with
Electron.

Terms of Use:
You may modify and redistribute it without permission from the author, and
there are no restrictions on its use (commercial, 18+, etc.).
This plugin is now yours.
*/

/*:ja
@plugindesc Electron開発支援プラグイン
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/ElectronForMz.js
@author トリアコンタン

@help ElectronForMz.js

RPGツクールMZをElectronで開発、デプロイメントするために
必要なプラグインです。

利用規約：
 作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 についても制限はありません。
 このプラグインはもうあなたのものです。
*/

(() => {
    'use strict';

    const _Main_isPathRandomized = Main.isPathRandomized;
    Main.isPathRandomized = function () {
        // [Note] We cannot save the game properly when Gatekeeper Path Randomization is in effect.
        if (Utils.isElectron()) {
            return __filename.startsWith('/private/var');
        } else {
            return _Main_isPathRandomized.apply(this, arguments);
        }
    }

    Utils.isElectron = function () {
        return !!window.electronAPI;
    }

    if (!Utils.isElectron()) {
        return;
    }

    let options = '';
    window.electronAPI.optionValid();
    window.electronAPI.optionValidReply((event, arg) => {
        options = arg;
    });

    const _Utils_isOptionValid = Utils.isOptionValid;
    Utils.isOptionValid = function(name) {
        return _Utils_isOptionValid.apply(this, arguments) || options.split(',').includes(name);
    };

    const _StorageManager_fileDirectoryPath = StorageManager.fileDirectoryPath;
    StorageManager.localFileDirectoryPath = function () {
        const path = require('path');
        if (Utils.isElectron()) {
            const base = path.dirname(__filename);
            return Utils.isOptionValid('test')
                ? path.join(base, 'save/')
                : path.join(base, '../../save/');
        } else {
            return _StorageManager_fileDirectoryPath.apply(this, arguments);
        }
    };

    const _SceneManager_reloadGame = SceneManager.reloadGame;
    SceneManager.reloadGame = function () {
        if (Utils.isElectron()) {
            window.electronAPI.reloadPage();
        } else {
            _SceneManager_reloadGame.apply(this, arguments);
        }
    };

    const _SceneManager_showDevTools = SceneManager.showDevTools;
    SceneManager.showDevTools = function() {
        _SceneManager_showDevTools.apply(this, arguments);
        if (Utils.isOptionValid('test')) {
            window.electronAPI.openDevTools();
        }
    };

    const _SceneManager_terminate = SceneManager.terminate;
    SceneManager.terminate = function() {
        if (Utils.isElectron()) {
            window.close();
        } else {
            _SceneManager_terminate.apply(this, arguments);
        }
    };
})();