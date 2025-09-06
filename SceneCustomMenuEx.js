/*=============================================================================
 SceneCustomMenuEx.js
----------------------------------------------------------------------------
 (C)2022 Triacontane, (改造したらここに作者名を追加)
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.1 2022/11/08 Scene_CustomMenuのテンプレートを追加
 1.0.0 2022/10/27 テンプレート作成
=============================================================================*/

/*:
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/SceneCustomMenuEx.js
@plugindesc Custom Menu Plugin Modification Template
@author Triacontane
@license MIT License

@help
English Help Translator: munokura
Please check the URL below for the latest version of the plugin.
URL https://triacontane.blogspot.com
-----

SceneCustomMenuEx.js

This is a template for modifying custom menu plugins.
By adding methods to Window_CustomMenu,
you can externally define complex window drawing processes.
*/

/*:ja
@plugindesc カスタムメニュープラグイン改造テンプレート
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/SceneCustomMenuEx.js
@base SceneCustomMenu
@orderAfter SceneCustomMenu
@author 作者名を入れます

@help SceneCustomMenuEx.js

カスタムメニュープラグインを改造するためのテンプレートです。
Window_CustomMenuにメソッドを追加することで
複雑なウィンドウの描画処理を外部定義できます。
*/

(()=> {

    /**
     * 既存メソッドを書き換えたい場合
     */
    const _Window_CustomMenu_drawItem = Window_CustomMenu.prototype.drawItem;
    Window_CustomMenu.prototype.drawItem = function(index) {
        _Window_CustomMenu_drawItem.apply(this, arguments);
    };

    /**
     * メソッドを追加したい場合
     * [methodName]を任意のメソッド名に変更します。
     * 定義したメソッドはウィンドウのフィルタスクリプトや項目描画スクリプトで使えます。
     *
     * 呼び出し例:
     * this.methodName();
     */
    Window_CustomMenu.prototype.methodName = function() {
        console.log('test');
    };

    /**
     * メソッドを追加したい場合
     * [methodName]を任意のメソッド名に変更します。
     * 定義したメソッドは決定イベントやキャンセルイベントのスクリプトで使えます。
     *
     * 呼び出し例:
     * this.methodName();
     */
    Scene_CustomMenu.prototype.methodName = function () {
        console.log('test');
    };
})();