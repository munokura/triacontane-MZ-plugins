/*=============================================================================
 EventCommentTag.js
----------------------------------------------------------------------------
 (C)2021 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2021/06/18 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/EventCommentTag.js
@plugindesc Event Annotation Tag Plugin
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

EventCommentTag.js

This plugin recognizes the contents of the "Annotation" event command as a
note tag.
Only the first annotation on the first page of the list will be loaded.

Terms of Use:
You may modify and redistribute this plugin without permission, and there are
no restrictions on its use (commercial, 18+, etc.).
This plugin is now yours.
*/

/*:ja
@plugindesc イベント注釈タグプラグイン
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/EventCommentTag.js
@orderAfter CharacterGraphicExtend
@author トリアコンタン

@help EventCommentTag.js

イベントコマンド『注釈』の内容をメモタグとして認識できるようになります。
1ページ目かつリストの先頭の注釈のみが読み込まれます。

利用規約：
 作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 についても制限はありません。
 このプラグインはもうあなたのものです。
*/

(() => {
    'use strict';

    const _DataManager_extractMetadata = DataManager.extractMetadata;
    DataManager.extractMetadata = function(data) {
        _DataManager_extractMetadata.apply(this, arguments);
        if (data.pages) {
            this.extractCommentMetadata(data);
        }
    }

    DataManager.extractCommentMetadata = function(data) {
        const comment = this.findTopCommentText(data);
        const commentData = {note: comment};
        _DataManager_extractMetadata.call(this, commentData);
        Object.keys(commentData.meta).forEach(key => {
            data.meta[key] = commentData.meta[key];
        });
        // for CharacterGraphicExtend.js
        if (data.metaArray) {
            Object.keys(commentData.metaArray).forEach(key => {
                data.metaArray[key] = commentData.metaArray[key];
            });
        }
    };

    DataManager.findTopCommentText = function (data) {
        const list = data.pages[0].list;
        // 108 : Code Comment
        if (!list[0] || list[0].code !== 108) {
            return '';
        }
        let comment = list[0].parameters[0];
        // 408 : Code Comment(2-)
        for (let i = 1; list[i] && list[i].code === 408; i++) {
            comment += list[i].parameters[0];
        }
        return comment;
    };
})();