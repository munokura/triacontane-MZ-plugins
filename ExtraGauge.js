/*=============================================================================
 ExtraGauge.js
----------------------------------------------------------------------------
 (C)2020 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.22.0 2025/02/02 ゲージの表示優先度をキャラクターの下やバトラーの下に表示できるよう修正
 1.21.2 2025/01/07 1.21.1の修正でゲージ画像を指定した場合の初期表示が正常でない問題を修正
 1.21.1 2024/12/14 ゲージが非表示の状態でも裏で画像の状態を更新するよう修正
 1.21.0 2024/10/11 パーティの並べ替えをしたときゲージに即座に反映されるよう修正
                   ラベルの表示で%1がバトラー名に置き換わるよう修正
 1.20.3 2024/10/06 カスタムメニュープラグインと併用する場合のヘルプを追記
 1.20.2 2024/07/08 ピクチャの表示優先度調整プラグインと併用する場合、表示優先度は0以外指定できない旨の警告をヘルプに追記
 1.20.1 2024/06/02 タイムプログレスゲージを表示するための凡例を追加
 1.20.0 2024/04/30 ゲージの表示原点を指定できる機能を追加
                   バトラー情報をMenuActorにしたとき、メニュー画面でアクターを切り替えてもゲージ内容が更新されない問題を修正
 1.19.0 2024/01/17 ラベルの表示位置を調整できる機能を追加
 1.18.0 2024/01/14 アクターのレベルゲージと経験値ゲージを簡単に表示できるスクリプト凡例を追加
 1.17.0 2023/12/19 ゲージが満タンのときにONになるスイッチを指定できる機能を追加
 1.16.0 2023/12/13 ゲージの表示位置をプレイヤーやイベントに連動させる機能を追加
 1.15.1 2023/11/22 1.0.3の修正内容のデグレが発生していたので再修正
 1.15.0 2023/11/21 表示優先度の仕様を再検討し、「最前面」「ピクチャの下」「ピクチャの上」からの選択にしました。
 1.14.0 2023/10/15 ゲージ画像が下ピクチャに合わせて表示されるよう仕様変更
 1.13.2 2023/09/01 ゲージ画像を使わない場合も背景を非表示に出来るよう修正
 1.13.1 2023/08/29 バトラータイプで敵キャラIDを選択したとき、戦闘中かつ対象がグループにいればそのオブジェクトを返すよう修正
 1.13.0 2023/08/28 戦闘画面でゲージ画像をバトラー表示位置と連動させる機能を追加
                   無効なバトラーのゲージを表示した場合にエラーになる問題を修正
 1.12.0 2023/08/16 ゲージの現在値、最大値に数値以外の値が設定されたとき、分かりやすいエラーを表示してゲームが停止するよう修正
 1.11.0 2023/07/13 ゲージを左右反転させる設定を追加
 1.10.0 2023/06/09 ゲージを任意のウィンドウの子要素にできる機能を追加
 1.9.1 2023/05/21 1.9.0の機能で、ゲージX座標を変更していると現在値の位置が揃え次第でずれる問題を修正
 1.9.0 2023/05/21 現在値表示の揃えとゼロ埋め表示を指定できる機能を追加
 1.8.0 2023/05/17 ゲージの背景部分を非表示にできる機能を追加
 1.7.0 2023/05/12 ゲージにオリジナルの画像を指定できる機能を追加
 1.6.1 2023/05/09 不透明度のパラメータが正常に機能していなかった問題を修正
 1.6.0 2023/04/24 マップ、戦闘画面でゲージをウィンドウの上に表示できる機能を追加
 1.5.3 2023/01/31 ゲージを非表示にして現在値を変更してから再表示すると変更前の数値が一瞬表示されてしまう問題を修正
 1.5.2 2022/12/08 ゲージX座標のパラメータ初期値を変更
 1.5.1 2022/11/20 プリセットをtimeにするとラベルが表示されなくなる件を制約事項としてヘルプに記載
 1.5.0 2022/11/19 ラベル部分にアイコンを表示できる機能を追加
 1.4.0 2022/09/11 満タン時のゲージ色を指定できる機能を追加
 1.3.0 2022/08/23 現在値の描画フォーマットを指定できる機能を追加
 1.2.0 2022/05/06 ゲージの表示優先度をピクチャの下に変更できる機能を追加
 1.1.2 2021/10/20 フォント指定のヘルプが誤っていたのを修正
 1.1.1 2021/09/15 コアスクリプトv1.3.3に伴う修正
 1.1.0 2021/04/10 座標に計算式や変数を指定した場合、表示位置やリアルタイムに変更できる機能を追加
 1.0.3 2020/09/16 ゲージ表示後に一度シーンを切り替えてからマップ移動するとゲージピクチャが消えてしまう問題を修正
 1.0.2 2020/09/12 ヘルプのスクリプトの誤記を修正
 1.0,1 2020/08/30 非表示のときは画像を更新しないよう修正
 1.0.0 2020/08/29 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/ExtraGauge.js
@plugindesc General gauge addition plugin
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

ExtraGauge.js

You can display any number of additional gauges on each screen.
Simply specify the current and maximum values via variables or scripts, and
the gauges will automatically increase or decrease as the values change.

Gauges are displayed above the picture and below the window on the map and
battle screens,
but above the window on other screens.

You can also specify an original image for the gauge.
The original image specifications and display specifications are as follows:
- Image gauges are displayed above the current value display.
- The display coordinates of the image gauge are aligned with the gauge
background, with the top left coordinate aligned with the bottom picture.
However, if the gauge background is hidden and a bottom picture is displayed,
the top left coordinate will be aligned with the bottom picture.
- Image gauges are cropped left and right to fit the current gauge value.
Therefore, adding transparent margins to the left and right is not
recommended.

When used in conjunction with the Picture Display Priority Adjustment Plugin,
the display priority cannot be set to anything other than 0.

The base plugin "PluginCommonBase.js" is required to use this plugin.
"PluginCommonBase.js" is located in the following folder under the RPG Maker
MZ installation folder:

dlc/BasicResources/plugins/official

"FontLoad.js" is required to use font specification.

Click the "Raw" button on the following page to download it:
https://github.com/triacontane/RPGMakerMV/tree/mz_master/FontLoad.js

To display a gauge on a screen created using a custom menu screen,

Enter the "Scene Identifier" value specified in the Custom Menu Plugin
directly into the "Target Scene" parameter.

Terms of Use:

You may modify and redistribute this plugin without permission, and there are
no restrictions on its use (commercial, R18+, etc.).

This plugin is now yours.

@param GaugeList
@text Gauge List
@desc A list of gauges to add to each screen.
@type struct<Gauge>[]
@default []

@param PriorityMap
@text Display Priority (Map)
@desc The display priority of the gauge image on the map screen.
@type select
@default 0
@option 0: Front (not affected by screen fade-out)
@value 0
@option 1: Above the picture
@value 1
@option 2: Below the picture
@value 2
@option 3: Above the character
@value 3
@option 4: Same as the character
@value 4
@option 5: Under the character
@value 5

@param PriorityBattle
@text Display Priority (Battle)
@desc The display priority of the gauge image on the battle screen.
@type select
@default 0
@option 0: Front (not affected by screen fade-out)
@value 0
@option 1: Above the picture
@value 1
@option 2: Below the picture
@value 2
@option 3: Under Butler
@value 3
*/

/*~struct~Gauge:
@param SceneName
@text Target Scene
@desc The scene to be added. If you want to target the original scene, enter the scene class name directly.
@type select
@default Scene_Title
@option title
@value Scene_Title
@option map
@value Scene_Map
@option game over
@value Scene_Gameover
@option Battle
@value Scene_Battle
@option Main Menu
@value Scene_Menu
@option item
@value Scene_Item
@option skill
@value Scene_Skill
@option Equipment
@value Scene_Equip
@option status
@value Scene_Status
@option option
@value Scene_Options
@option save
@value Scene_Save
@option load
@value Scene_Load
@option Game End
@value Scene_End
@option shop
@value Scene_Shop
@option Enter your name
@value Scene_Name
@option debug
@value Scene_Debug

@param Id
@text identifier
@desc This is the gauge's identifier. It is not used in particular, but setting a clear name will make management easier.
@default gauge01

@param SwitchId
@text Display Switch ID
@desc It will only be displayed on the screen when the specified switch is ON. If you specify 0, it will always be displayed.
@type switch
@default 0

@param OpacityVariable
@text Opacity variable ID
@desc Variable number to get the opacity. If you specify 0, it will always be displayed with an opacity of 255.
@type variable
@default 0

@param Layout
@text Layout
@desc The display coordinates, width, and height of the gauge. When using a script, you can get the width and height of the UI area using the variables witch and height.
@type struct<Layout>
@default {"x":"width / 2","y":"30","width":"width * 0.8","height":"36","GaugeX":"0","GaugeHeight":"0","Vertical":"false"}

@param CurrentMethod
@text How to get the current reading
@desc This is a way to get the current value of the gauge. Set a variable or a script.
@type struct<Method>
@default {"VariableId":"0","Script":"","FixedValue":""}

@param MaxMethod
@text How to get the maximum value
@desc This is a way to get the maximum value of the gauge. You can set a variable, script, or a fixed value.
@type struct<Method>
@default {"VariableId":"0","Script":"","FixedValue":""}

@param Detail
@text Advanced Settings
@desc These are detailed settings such as gauge placement and color.
@type struct<Detail>

@param LowerPicture
@text Bottom picture
@desc This is the picture that will be displayed below the gauge. The center of the image will be aligned with the center of the gauge.
@type struct<Picture>

@param UpperPicture
@text Top Picture
@desc This is the picture that will be displayed above the gauge. The center of the image will be aligned with the center of the gauge.
@type struct<Picture>

@param Battler
@text Butler Information
@desc Specifies how to reference the main battler information for the gauge. Use this only when determining the current and maximum values in a script.
@type struct<Battler>
*/

/*~struct~Layout:
@param x
@text X coordinate
@desc X coordinate. The origin is the center. If a non-numeric value is specified, it will be evaluated as a script.
@default width / 2

@param y
@text Y coordinate
@desc Y coordinate. The origin is the center. If a non-numeric value is specified, it will be evaluated as a script.
@default 30

@param originX
@text Origin X
@desc The x-coordinate origin of the gauge.
@type select
@default center
@option left
@value left
@option center
@value center
@option right
@value right

@param originY
@text Origin Y
@desc The Y coordinate origin of the gauge.
@type select
@default center
@option above
@value top
@option center
@value center
@option under
@value bottom

@param linkCharacter
@text Interlocking characters
@desc This is the character that links the gauge coordinates. It is only valid on the map screen. -1 is the player, 1 or more is the event ID.
@type number
@default 0
@min -1

@param realTime
@text Real-time coordinate reflection
@desc After displaying the gauge, the gauge position is reevaluated when the X and Y coordinates are changed.
@type boolean
@default false

@param width
@text Width
@desc Width. If a non-numeric value is specified, it will be evaluated as a script.
@default width * 0.8

@param height
@text height
@desc Height. If a non-numeric value is specified, it will be evaluated as a script.
@default 36

@param GaugeX
@text Gauge X coordinate
@desc The X coordinate of the gauge. Specify this if you do not want the label string to overlap the gauge.
@default 28

@param GaugeEndX
@text Gauge end X coordinate
@desc The end X coordinate of the gauge. Specify this if you want to display the numerical value outside the gauge.
@default 0

@param GaugeHeight
@text Gauge Height
@desc The height of the gauge. Specifying 0 will set it to the overall height.
@default 0

@param Vertical
@text Vertical Gauge
@desc When enabled, the gauge will be vertical. Please note that labels will also be vertical.
@type boolean
@default false

@param Mirror
@text Invert
@desc When enabled, the gauge will be inverted horizontally. Labels and values will also be inverted, so please be careful when displaying them.
@type boolean
@default false

@param ParentWindow
@text Parent window
@desc Specifies if you want the gauge to be a child element of a specific window. This setting overrides the global display priority setting.
@type select
@option なし
@option [General Game] Help window
@value Window_Help
@option [General Game] Money Window
@value Window_Gold
@option [Main Menu] Main Command Window
@value Window_MenuCommand
@option [Main Menu] Actor Status Window
@value Window_MenuStatus
@option [Item Screen] Item Category Window
@value Window_ItemCategory
@option [Item Screen] Item List Window
@value Window_ItemList
@option [Item Screen] Actor Selection Window
@value Window_MenuActor
@option [Skill Screen] Skill Type Window
@value Window_SkillType
@option [Skills Screen] Status Window
@value Window_SkillStatus
@option [Skills Screen] Skill List Window
@value Window_SkillList
@option [Equipment Screen] Status Window
@value Window_EquipStatus
@option [Equipment Screen] Equip Command Window
@value Window_EquipCommand
@option [Equipment Screen] Equipment Slot Window
@value Window_EquipSlot
@option [Equipment Screen] Equipment List Window
@value Window_EquipItem
@option [Status Screen] Status Window
@value Window_Status
@option [Status Screen] Equipment Window
@value Window_StatusEquip
@option [Status Screen] Parameter Window
@value Window_StatusParams
@option [Options Screen] Options Window
@value Window_Options
@option [Save/Load Screen] File List Window
@value Window_SavefileList
@option [Shop Screen] Shop Command Window
@value Window_ShopCommand
@option [Shop Screen] Purchased Items Window
@value Window_ShopBuy
@option [Shop Screen] Selling Item Window
@value Window_ShopSell
@option [Shop Screen] Numerical Input Window
@value Window_ShopNumber
@option [Shop Screen] Status Window
@value Window_ShopStatus
@option [Name entry screen] Name window
@value Window_NameEdit
@option [Name entry screen] Name entry window
@value Window_NameInput
@option [Map Screen] Choices Window
@value Window_ChoiceList
@option [Map screen] Numerical value input window
@value Window_NumberInput
@option [Map Screen] Item Selection Window
@value Window_EventItem
@option [Map Screen] Name Window
@value Window_NameBox
@option [Map Screen] Message Window
@value Window_Message
@option [Map Screen] Scrolling Message Window
@value Window_ScrollText
@option [Map Screen] Map Name Window
@value Window_MapName
@option [Battle Screen] Battle Log Window
@value Window_BattleLog
@option [Battle Screen] Party Command Window
@value Window_PartyCommand
@option [Battle Screen] Actor Command Window
@value Window_ActorCommand
@option [Battle Screen] Battler Status Window
@value Window_BattleStatus
@option [Battle Screen] Actor List Window
@value Window_BattleActor
@option [Battle screen] Enemy character list window
@value Window_BattleEnemy
@option [Battle Screen] Skill List Window
@value Window_BattleSkill
@option [Battle Screen] Item List Window
@value Window_BattleItem
@option [Title Screen] Title Window
@value Window_TitleCommand
@option [Game End Screen] Exit confirmation window
@value Window_GameEnd
@option [Debug screen] Variable selection window
@value Window_DebugRange
@option [Debug Screen] Variables Settings Window
@value Window_DebugEdit
@option [Behavior Goal Window Plugin] Behavior Goal Window
@value Window_Destination
@option [Behavior Objective Window Plugin] Menu Behavior Objective Window
@value Window_DestinationMenu
@option [In-game time plugin] Time window
@value Window_Chronus
@option [Official Gacha Plugin] Gacha display window
@value Window_Gacha
@option [Official Gacha Plugin] Command Window
@value Window_GachaCommand
@option [Official Gacha Plugin] Acquisition confirmation window
@value Window_GachaGetCommand
@option [Official Gacha Plugin] Acquisition Information Window
@value Window_GachaGet
@option [Official Gacha Plugin] Cost Window
@value Window_Cost
@option [Novel Game General Plugin] Novel Selection Window
@value Window_NovelChoiceList
@option [Novel Game General Plugin] Novel Message Window
@value Window_NovelMessage
@option [Novel Game General Plugin] Novel Title Command Window
@value Window_NovelTitleCommand
@option [Novel Game General Plugin] Novel Number Input Window
@value Window_NovelNumberInput
@option [Novel Game General Plugin] Pause Menu Window
@value Window_PauseMenu
@option [Cross Save Plugin] Password entry window
@value Window_PasswordInput
@option [Cross Save Plugin] Password window
@value Window_PasswordEdit
@option [Terminology Plug-in] Term Category Window
@value Window_GlossaryCategory
@option [Glossary Plug-in] Term List Window
@value Window_GlossaryList
@option [Terminology Dictionary Plug-in] Usage confirmation window
@value Window_GlossaryConfirm
@option [Glossary Plugin] Collection Rate Window
@value Window_GlossaryComplete
@option [Glossary Plug-in] Terminology window
@value Window_Glossary
@option Sound Test Plug-in Audio Category Window
@value Window_AudioCategory
@option [Sound Test Plug-in] Audio List Window
@value Window_AudioList
@option [Sound Test Plugin] Audio Settings window
@value Window_AudioSetting
@option [Numeric Input Screen Plug-in] Numeric Input Window
@value Window_NumberInput
@option [Numeric Input Screen Plugin] Numeric Window
@value Window_NumberEdit
*/

/*~struct~Picture:
@param FileName
@text File name
@desc The picture's filename.
@type file
@dir img/pictures

@param OffsetX
@text X coordinate correction value
@desc The X coordinate correction value.
@type number
@default 0
@min -9999

@param OffsetY
@text Y coordinate correction value
@desc The Y coordinate correction value.
@type number
@default 0
@min -9999
*/

/*~struct~Method:
@param VariableId
@text Acquisition variable ID
@desc This is the variable number that retrieves the gauge value. It is referenced with priority over the script.
@type variable
@default 0

@param Script
@text Acquisition script
@desc A script to get the gauge value. It takes priority over the fixed value.
@type combo
@option battler.hp; // HP
@option battler.mhp; // Max HP
@option battler.mp; // MP
@option battler.mmp; // Max MP
@option battler.tp; // TP
@option battler.maxTp(); // Max MP
@option battler.currentLevelGetExp(); // Experience points earned at the current level
@option battler.currentLevelUpExp(); // Experience required for next level
@option battler.level; // level
@option battler.maxLevel(); // Maximum Level
@option meta.value; // Value in the memo field [value]
@option battler.tpbChargeTime(); // Time gauge accumulation rate (0 to 1)

@param FixedValue
@text Fixed value
@desc Sets the gauge's value to a fixed value. It is not recommended to set a fixed current value.
@type number
@min 1
*/

/*~struct~Detail:
@param RisingSmoothness
@text Smoothness during ascent
@desc A larger number will cause the gauge to fill up more slowly.
@type number
@default 1
@min 1

@param FallingSmoothness
@text Smoothness during descent
@desc A larger number will cause the gauge to drop more slowly.
@type number
@default 1
@min 1

@param GaugeImage
@text Gauge Image
@desc Specify a dedicated image for the gauge image. It will be cropped according to the gauge amount. Various settings such as gauge color will be ignored.
@type file
@dir img/pictures

@param GaugeBackHidden
@text Hide Gauge Background
@desc Hides the background of the gauge image. This is mainly enabled when a gauge image is specified.
@type boolean
@default false

@param ScaleAutoAdjust
@text Automatic zoom adjustment
@desc The magnification of the gauge image is automatically adjusted to match the gauge size.
@type boolean
@default true

@param GaugeColorPreset
@text Gauge Color Presets
@desc You can easily specify the gauge color from presets. Since the existing gauge specifications are reused, if you set it to time, the label will not be displayed.
@type select
@default hp
@option hp
@option mp
@option tp
@option time

@param GaugeColorLeft
@text Gauge color (left)
@desc The color of the left gauge. Specify the text color number or CSS color (rgba(0, 0, 0, 0)).
@type color
@default 0

@param GaugeColorRight
@text Gauge color (right)
@desc The color of the right gauge. Specify the text color number or CSS color (rgba(0, 0, 0, 0)).
@type color
@default 0

@param GaugeColorFullLeft
@text Gauge color when full (left)
@desc The color of the left gauge when full. Specify a text color number or a CSS color (rgba(0, 0, 0, 0)).
@type color
@default 0

@param GaugeColorFullRight
@text Gauge color when full (right)
@desc The color of the right gauge when full. Specify a text color number or a CSS color (rgba(0, 0, 0, 0)).
@type color
@default 0

@param BackColor
@text Gauge Background Color
@desc The gauge background color. Specify the text color number or CSS color (rgba(0, 0, 0, 0)).
@type color
@default 0

@param Label
@text label
@desc The label string displayed to the left of the gauge. %1 will be replaced with the battler name.

@param LabelY
@text Label Y coordinate
@desc The Y coordinate of the label.
@type number
@default 3
@min -9999
@max 9999
@parent Label

@param IconIndex
@text icon
@desc This is an icon that is drawn together with the label. Please note that if you display it together with the label, it will be displayed overlapping.
@type icon
@default 0

@param LabelFont
@text Label Font
@desc Font information for displaying the label. If not specified, the gauge's default font will be used.
@type struct<Font>

@param DrawValue
@text Draw the current value
@desc Draws the current value on the right side of the gauge.
@type boolean
@default true

@param ValueFont
@text Current value font
@desc Font information for displaying the current value. If not specified, the gauge's default value will be used.
@type struct<Font>

@param ValueFormat
@text Current Value Format
@desc This is the display format for displaying the current value. %1: Current value %2: Replaced with maximum value.
@default %1/%2

@param ValuePadZeroDigit
@text Fill current value with 0
@desc The current value is displayed with zeros filled in.
@type number
@default 0
@parent ValueFormat

@param ValueAlign
@text Current value alignment
@desc The alignment direction of the current value.
@type select
@default right
@option left
@option center
@option right
@parent ValueFormat

@param FlashIfFull
@text Flush when full
@desc The gauge will flash when its current value is equal to or greater than its maximum value.
@type boolean
@default false

@param FullSwitchId
@text Full Switch ID
@desc When the current value of the gauge is equal to or greater than the maximum value, the specified switch will turn ON. When it falls below the maximum value, it will turn OFF.
@type switch
@default 0
*/

/*~struct~Font:
@param Face
@text Font Name
@desc Font name. Requires a separate font loading plugin.
@dir fonts

@param Size
@text Font size
@desc The font size.
@type number
@default 0

@param Color
@text Text Color
@desc Text color. Specify the text color number or CSS color (rgba(0, 0, 0, 0)).
@type color
@default 0

@param OutlineColor
@text Outline Color
@desc Outline color. Specify the text color number or CSS color (rgba(0, 0, 0, 0)).
@type color
@default 0

@param OutlineWidth
@text Outline Width
@desc The width of the outline.
@type number
@default 0
*/

/*~struct~Battler:
@param Type
@text Butler Type
@desc This is how to obtain the battler that is the main focus of the gauge.
@type select
@default ActorId
@option Actor ID
@value ActorId
@option Party order
@value PartyIndex
@option Enemy character ID
@value EnemyId
@option Enemy group order (effective on battle screen)
@value TroopIndex
@option Actor selected on the menu screen (valid on the menu details screen)
@value MenuActor

@param ActorId
@text Actor ID
@desc This is the actor ID when "Actor ID" is selected in the type selection.
@type actor
@default 0

@param EnemyId
@text Enemy character ID
@desc This is the enemy character ID when "Enemy Character ID" is selected in the type selection.
@type enemy
@default 0

@param Index
@text Sort order
@desc This is the sort order when you select "Party Order" or "Enemy Group Order" in the type selection. The first is [0].
@type number
@default 0

@param LinkPosition
@text Butler image link
@desc Links the gauge display coordinates to the butler's coordinates.
@type boolean
@default true
*/

/*:ja
@plugindesc 汎用ゲージ追加プラグイン
@target MZ
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/ExtraGauge.js
@base PluginCommonBase
@author トリアコンタン

@param GaugeList
@text ゲージリスト
@desc 各画面に追加するゲージのリストです。
@default []
@type struct<Gauge>[]

@param PriorityMap
@text 表示優先度(マップ)
@desc マップ画面におけるゲージ画像の表示優先度です。
@default 0
@type select
@option 0:最前面(画面のフェードアウトの影響を受けない)
@value 0
@option 1:ピクチャの上
@value 1
@option 2:ピクチャの下
@value 2
@option 3:キャラクターの上
@value 3
@option 4:キャラクターと同じ
@value 4
@option 5:キャラクターの下
@value 5

@param PriorityBattle
@text 表示優先度(バトル)
@desc 戦闘画面におけるゲージ画像の表示優先度です。
@default 0
@type select
@option 0:最前面(画面のフェードアウトの影響を受けない)
@value 0
@option 1:ピクチャの上
@value 1
@option 2:ピクチャの下
@value 2
@option 3:バトラーの下
@value 3

@help ExtraGauge.js

各画面に追加で任意のゲージを好きなだけ表示できます。
現在値や最大値を変数、スクリプトから指定すれば、あとは値の変動に応じて
自動的にゲージが増減します。

ゲージは、マップ画面と戦闘画面ではピクチャの上かつウィンドウの下に、
それ以外の画面ではウィンドウの上に表示されます。

ゲージにオリジナルの画像も指定できます。
オリジナル画像の規格および表示仕様は以下の通りです。
・画像ゲージは、現在値表示より上に表示されます。
・画像ゲージの表示座標は、ゲージ背景と左上座標を合わせて表示されます。
　ただし、ゲージ背景を非表示かつ下ピクチャを表示した場合、
　下ピクチャに左上座標を合わせて表示されます。
・画像ゲージはゲージの現在値に合わせて左右にトリミングされます。
　ゆえに左右に透過色による余白を設けることは推奨されません。

ピクチャの表示優先度調整プラグインと併用する場合、
表示優先度は0以外指定できません。

このプラグインの利用にはベースプラグイン『PluginCommonBase.js』が必要です。
『PluginCommonBase.js』は、RPGツクールMZのインストールフォルダ配下の
以下のフォルダに格納されています。
dlc/BasicResources/plugins/official

フォント指定を利用する場合『FontLoad.js』が必要です。
以下のページの『Raw』ボタンを押下した先から入手してください。
https://github.com/triacontane/RPGMakerMV/tree/mz_master/FontLoad.js

カスタムメニュー画面を使って作った画面にゲージを出したい場合
パラメータ「対象シーン」にカスタムメニュープラグインで指定した
「シーン識別子」の値を直接入力してください。

利用規約：
 作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 についても制限はありません。
 このプラグインはもうあなたのものです。
*/

/*~struct~Gauge:ja

@param SceneName
@text 対象シーン
@desc 追加対象のシーンです。オリジナルのシーンを対象にする場合はシーンクラス名を直接記入します。
@type select
@default Scene_Title
@option タイトル
@value Scene_Title
@option マップ
@value Scene_Map
@option ゲームオーバー
@value Scene_Gameover
@option バトル
@value Scene_Battle
@option メインメニュー
@value Scene_Menu
@option アイテム
@value Scene_Item
@option スキル
@value Scene_Skill
@option 装備
@value Scene_Equip
@option ステータス
@value Scene_Status
@option オプション
@value Scene_Options
@option セーブ
@value Scene_Save
@option ロード
@value Scene_Load
@option ゲーム終了
@value Scene_End
@option ショップ
@value Scene_Shop
@option 名前入力
@value Scene_Name
@option デバッグ
@value Scene_Debug

@param Id
@text 識別子
@desc ゲージの識別子です。特に使用されませんが、分かりやすい名称を設定すると管理がしやすくなります。
@default gauge01

@param SwitchId
@text 表示スイッチID
@desc 指定したスイッチがONの場合のみ画面に表示されます。0を指定すると常に表示されます。
@default 0
@type switch

@param OpacityVariable
@text 不透明度変数ID
@desc 不透明度を取得する変数番号です。0を指定すると常に不透明度255で表示されます。
@default 0
@type variable

@param Layout
@text レイアウト
@desc ゲージの表示座標と幅、高さです。スクリプトを使用する場合、変数witch, heightでUIエリアの幅と高さを取得できます。
@type struct<Layout>
@default {"x":"width / 2","y":"30","width":"width * 0.8","height":"36","GaugeX":"0","GaugeHeight":"0","Vertical":"false"}

@param CurrentMethod
@text 現在値取得方法
@desc ゲージの現在値を取得する方法です。変数、スクリプトのいずれかを設定します。
@default {"VariableId":"0","Script":"","FixedValue":""}
@type struct<Method>

@param MaxMethod
@text 最大値取得方法
@desc ゲージの最大値を取得する方法です。変数、スクリプト、固定値のいずれかを設定します。
@default {"VariableId":"0","Script":"","FixedValue":""}
@type struct<Method>

@param Detail
@text 詳細設定
@desc ゲージの配置や色などの細かい設定です。
@type struct<Detail>
@default

@param LowerPicture
@text 下ピクチャ
@desc ゲージの下に表示されるピクチャです。ゲージの中心と画像の中心が合わせて表示されます。
@default
@type struct<Picture>

@param UpperPicture
@text 上ピクチャ
@desc ゲージの上に表示されるピクチャです。ゲージの中心と画像の中心が合わせて表示されます。
@default
@type struct<Picture>

@param Battler
@text バトラー情報
@desc ゲージの主体となるバトラー情報の参照方法を指定します。現在値、最大値をスクリプトで決める場合のみ使用します。
@default
@type struct<Battler>
*/

/*~struct~Layout:ja

@param x
@text X座標
@desc X座標です。原点は中央です。数値以外を指定した場合はスクリプトとして評価します。
@default width / 2

@param y
@text Y座標
@desc Y座標です。原点は中央です。数値以外を指定した場合はスクリプトとして評価します。
@default 30

@param originX
@text 原点X
@desc ゲージのX座標原点です。
@default center
@type select
@option 左
@value left
@option 中央
@value center
@option 右
@value right

@param originY
@text 原点Y
@desc ゲージのY座標原点です。
@default center
@type select
@option 上
@value top
@option 中央
@value center
@option 下
@value bottom

@param linkCharacter
@text 連動するキャラクター
@desc ゲージの座標を連動させるキャラクターです。マップ画面でのみ有効です。-1でプレイヤー、1以上でイベントIDになります。
@default 0
@type number
@min -1

@param realTime
@text リアルタイム座標反映
@desc ゲージを表示後、X座標、Y座標が変更されたときにゲージの位置を再評価します。
@default false
@type boolean

@param width
@text 横幅
@desc 横幅です。数値以外を指定した場合はスクリプトとして評価します。
@default width * 0.8

@param height
@text 高さ
@desc 高さです。数値以外を指定した場合はスクリプトとして評価します。
@default 36

@param GaugeX
@text ゲージX座標
@desc ゲージのX座標です。ラベル文字列をゲージに被らせたくないときに指定してください。
@default 28

@param GaugeEndX
@text ゲージ終端X座標
@desc ゲージの終端X座標です。数値の表示をゲージの外に表示したい場合に指定してください。
@default 0

@param GaugeHeight
@text ゲージ高さ
@desc ゲージの高さです。0を指定すると全体の高さに合わせられます。
@default 0

@param Vertical
@text 縦ゲージ
@desc 有効にすると縦方向ゲージになります。ラベルなども縦方向になるので注意してください。
@default false
@type boolean

@param Mirror
@text 反転
@desc 有効にするとゲージの左右が反転します。ラベルや値も一緒に反転するので、これらを表示する場合は注意してください。
@default false
@type boolean

@param ParentWindow
@text 親ウィンドウ
@desc ゲージを特定のウィンドウの子要素にしたい場合に指定します。この設定は全体の表示優先度の設定より優先されます。
@type select
@default
@option なし
@value
@option [ゲーム全般]ヘルプウィンドウ
@value Window_Help
@option [ゲーム全般]お金ウィンドウ
@value Window_Gold
@option [メインメニュー]メインコマンドウィンドウ
@value Window_MenuCommand
@option [メインメニュー]アクターステータスウィンドウ
@value Window_MenuStatus
@option [アイテム画面]アイテムカテゴリウィンドウ
@value Window_ItemCategory
@option [アイテム画面]アイテムリストウィンドウ
@value Window_ItemList
@option [アイテム画面]アクター選択ウィンドウ
@value Window_MenuActor
@option [スキル画面]スキルタイプウィンドウ
@value Window_SkillType
@option [スキル画面]ステータスウィンドウ
@value Window_SkillStatus
@option [スキル画面]スキルリストウィンドウ
@value Window_SkillList
@option [装備画面]ステータスウィンドウ
@value Window_EquipStatus
@option [装備画面]装備コマンドウィンドウ
@value Window_EquipCommand
@option [装備画面]装備スロットウィンドウ
@value Window_EquipSlot
@option [装備画面]装備リストウィンドウ
@value Window_EquipItem
@option [ステータス画面]ステータスウィンドウ
@value Window_Status
@option [ステータス画面]装備ウィンドウ
@value Window_StatusEquip
@option [ステータス画面]パラメータウィンドウ
@value Window_StatusParams
@option [オプション画面]オプションウィンドウ
@value Window_Options
@option [セーブ、ロード画面]ファイルリストウィンドウ
@value Window_SavefileList
@option [ショップ画面]ショップコマンドウィンドウ
@value Window_ShopCommand
@option [ショップ画面]購入アイテムウィンドウ
@value Window_ShopBuy
@option [ショップ画面]売却アイテムウィンドウ
@value Window_ShopSell
@option [ショップ画面]数値入力ウィンドウ
@value Window_ShopNumber
@option [ショップ画面]ステータスウィンドウ
@value Window_ShopStatus
@option [名前入力画面]名前ウィンドウ
@value Window_NameEdit
@option [名前入力画面]名前入力ウィンドウ
@value Window_NameInput
@option [マップ画面]選択肢ウィンドウ
@value Window_ChoiceList
@option [マップ画面]数値入力ウィンドウ
@value Window_NumberInput
@option [マップ画面]アイテム選択ウィンドウ
@value Window_EventItem
@option [マップ画面]名前ウィンドウ
@value Window_NameBox
@option [マップ画面]メッセージウィンドウ
@value Window_Message
@option [マップ画面]スクロールメッセージウィンドウ
@value Window_ScrollText
@option [マップ画面]マップ名ウィンドウ
@value Window_MapName
@option [戦闘画面]バトルログウィンドウ
@value Window_BattleLog
@option [戦闘画面]パーティコマンドウィンドウ
@value Window_PartyCommand
@option [戦闘画面]アクターコマンドウィンドウ
@value Window_ActorCommand
@option [戦闘画面]バトラーステータスウィンドウ
@value Window_BattleStatus
@option [戦闘画面]アクター一覧ウィンドウ
@value Window_BattleActor
@option [戦闘画面]敵キャラ一覧ウィンドウ
@value Window_BattleEnemy
@option [戦闘画面]スキル一覧ウィンドウ
@value Window_BattleSkill
@option [戦闘画面]アイテム一覧ウィンドウ
@value Window_BattleItem
@option [タイトル画面]タイトルウィンドウ
@value Window_TitleCommand
@option [ゲーム終了画面]終了確認ウィンドウ
@value Window_GameEnd
@option [デバッグ画面]変数選択ウィンドウ
@value Window_DebugRange
@option [デバッグ画面]変数設定ウィンドウ
@value Window_DebugEdit
@option [行動目標ウィンドウプラグイン]行動目標ウィンドウ
@value Window_Destination
@option [行動目標ウィンドウプラグイン]メニュー行動目標ウィンドウ
@value Window_DestinationMenu
@option [ゲーム内時間の導入プラグイン]時間ウィンドウ
@value Window_Chronus
@option [公式ガチャプラグイン]ガチャ表示ウィンドウ
@value Window_Gacha
@option [公式ガチャプラグイン]コマンドウィンドウ
@value Window_GachaCommand
@option [公式ガチャプラグイン]入手確認ウィンドウ
@value Window_GachaGetCommand
@option [公式ガチャプラグイン]入手情報ウィンドウ
@value Window_GachaGet
@option [公式ガチャプラグイン]コストウィンドウ
@value Window_Cost
@option [ノベルゲーム総合プラグイン]ノベル選択肢ウィンドウ
@value Window_NovelChoiceList
@option [ノベルゲーム総合プラグイン]ノベルメッセージウィンドウ
@value Window_NovelMessage
@option [ノベルゲーム総合プラグイン]ノベルタイトルコマンドウィンドウ
@value Window_NovelTitleCommand
@option [ノベルゲーム総合プラグイン]ノベル数値入力ウィンドウ
@value Window_NovelNumberInput
@option [ノベルゲーム総合プラグイン]ポーズメニューウィンドウ
@value Window_PauseMenu
@option [クロスセーブプラグイン]パスワード入力ウィンドウ
@value Window_PasswordInput
@option [クロスセーブプラグイン]パスワードウィンドウ
@value Window_PasswordEdit
@option [用語辞典プラグイン]用語カテゴリウィンドウ
@value Window_GlossaryCategory
@option [用語辞典プラグイン]用語リストウィンドウ
@value Window_GlossaryList
@option [用語辞典プラグイン]使用確認ウィンドウ
@value Window_GlossaryConfirm
@option [用語辞典プラグイン]収集率ウィンドウ
@value Window_GlossaryComplete
@option [用語辞典プラグイン]用語ウィンドウ
@value Window_Glossary
@option [サウンドテストプラグイン]オーディオカテゴリウィンドウ
@value Window_AudioCategory
@option [サウンドテストプラグイン]オーディオリストウィンドウ
@value Window_AudioList
@option [サウンドテストプラグイン]オーディオ設定ウィンドウ
@value Window_AudioSetting
@option [数値入力画面プラグイン]数値入力ウィンドウ
@value Window_NumberInput
@option [数値入力画面プラグイン]数値ウィンドウ
@value Window_NumberEdit
*/

/*~struct~Picture:ja

@param FileName
@text ファイル名
@desc ピクチャのファイル名です。
@default
@type file
@dir img/pictures

@param OffsetX
@text X座標補正値
@desc X座標の補正値です。
@default 0
@type number
@min -9999

@param OffsetY
@text Y座標補正値
@desc Y座標の補正値です。
@default 0
@type number
@min -9999
*/

/*~struct~Method:ja

@param VariableId
@text 取得変数ID
@desc ゲージの値を取得する変数番号です。スクリプトより優先して参照されます。
@default 0
@type variable

@param Script
@text 取得スクリプト
@desc ゲージの値を取得するスクリプトです。固定値より優先して参照されます。
@default
@type combo
@option battler.hp; // HP
@option battler.mhp; // 最大HP
@option battler.mp; // MP
@option battler.mmp; // 最大MP
@option battler.tp; // TP
@option battler.maxTp(); // 最大MP
@option battler.currentLevelGetExp(); // 現レベルの獲得経験値
@option battler.currentLevelUpExp(); // 次レベルの必要経験値
@option battler.level; // レベル
@option battler.maxLevel(); // 最大レベル
@option meta.value; // メモ欄[value]の値
@option battler.tpbChargeTime(); // タイムゲージ蓄積割合(0～1)

@param FixedValue
@text 固定値
@desc ゲージの値を固定値で設定します。現在値に固定値を指定することは推奨しません。
@default
@type number
@min 1
*/

/*~struct~Detail:ja

@param RisingSmoothness
@text 上昇中のなめらかさ
@desc 大きい数を指定するとゲージがゆっくりと上昇します。
@default 1
@type number
@min 1

@param FallingSmoothness
@text 下降中のなめらかさ
@desc 大きい数を指定するとゲージがゆっくりと下降します。
@default 1
@type number
@min 1

@param GaugeImage
@text ゲージ画像
@desc ゲージ画像に専用の画像を指定します。ゲージ量に応じてトリミングされます。ゲージ色などの各種設定は無視されます。
@type file
@dir img/pictures

@param GaugeBackHidden
@text ゲージ背景を非表示
@desc ゲージ画像の背景部分を非表示にします。主にゲージ画像を指定した場合に有効にします。
@type boolean
@default false

@param ScaleAutoAdjust
@text 拡大率自動調整
@desc ゲージ画像の拡大率をゲージサイズに合わせて自動で調整します。
@type boolean
@default true

@param GaugeColorPreset
@text ゲージ色のプリセット
@desc ゲージ色をプリセットから簡易指定します。既存のゲージ仕様を流用する関係上、timeに設定するとラベルが表示されません。
@default hp
@type select
@option
@option hp
@option mp
@option tp
@option time

@param GaugeColorLeft
@text ゲージ色(左)
@desc 左側のゲージ色です。テキストカラー番号かCSS色指定(rgba(0, 0, 0, 0))を指定します。
@default 0
@type color

@param GaugeColorRight
@text ゲージ色(右)
@desc 右側のゲージ色です。テキストカラー番号かCSS色指定(rgba(0, 0, 0, 0))を指定します。
@default 0
@type color

@param GaugeColorFullLeft
@text 満タン時のゲージ色(左)
@desc 満タン時の左側のゲージ色です。テキストカラー番号かCSS色指定(rgba(0, 0, 0, 0))を指定します。
@default 0
@type color

@param GaugeColorFullRight
@text 満タン時のゲージ色(右)
@desc 満タン時の右側のゲージ色です。テキストカラー番号かCSS色指定(rgba(0, 0, 0, 0))を指定します。
@default 0
@type color

@param BackColor
@text ゲージ背景色
@desc ゲージ背景色です。テキストカラー番号かCSS色指定(rgba(0, 0, 0, 0))を指定します。
@default 0
@type color

@param Label
@text ラベル
@desc ゲージの左に表示されるラベル文字列です。%1でバトラー名に置き換えられます。
@default

@param LabelY
@text ラベルY座標
@desc ラベルのY座標です。
@default 3
@type number
@min -9999
@max 9999
@parent Label

@param IconIndex
@text アイコン
@desc ラベルと一緒に描画されるアイコンです。ラベルと一緒に表示させると重なって表示されるので注意してください。
@default 0
@type icon

@param LabelFont
@text ラベルフォント
@desc ラベルを表示するときのフォント情報です。未指定の場合はゲージのデフォルト値が使用されます。
@default
@type struct<Font>

@param DrawValue
@text 現在値を描画する
@desc ゲージの右側に現在値を描画します。
@default true
@type boolean

@param ValueFont
@text 現在値フォント
@desc 現在値を表示するときのフォント情報です。未指定の場合はゲージのデフォルト値が使用されます。
@default
@type struct<Font>

@param ValueFormat
@text 現在値フォーマット
@desc 現在値を表示する際の表示フォーマットです。%1:現在値 %2:最大値に置き換えられます。
@default %1/%2

@param ValuePadZeroDigit
@text 現在値を0埋め
@desc 現在値を0埋めして表示します。
@default 0
@type number
@parent ValueFormat

@param ValueAlign
@text 現在値の揃え
@desc 現在値の揃え方向です。
@default right
@type select
@option left
@option center
@option right
@parent ValueFormat

@param FlashIfFull
@text 満タン時にフラッシュ
@desc ゲージの現在値が最大値以上になるとゲージをフラッシュさせます。
@default false
@type boolean

@param FullSwitchId
@text 満タンスイッチID
@desc ゲージの現在値が最大値以上になると指定したスイッチをONにします。最大値を下回るとOFFになります。
@default 0
@type switch
*/

/*~struct~Font:ja

@param Face
@text フォント名
@desc フォント名です。別途フォントロードプラグインが必要です。
@default
@dir fonts

@param Size
@text フォントサイズ
@desc フォントサイズです。
@default 0
@type number

@param Color
@text テキストカラー
@desc テキストカラーです。テキストカラー番号かCSS色指定(rgba(0, 0, 0, 0))を指定します。
@default 0
@type color

@param OutlineColor
@text アウトラインカラー
@desc アウトラインカラーです。テキストカラー番号かCSS色指定(rgba(0, 0, 0, 0))を指定します。
@default 0
@type color

@param OutlineWidth
@text アウトライン横幅
@desc アウトラインの横幅です。
@default 0
@type number
*/

/*~struct~Battler:ja

@param Type
@text バトラー種別
@desc ゲージの主体となるバトラーの取得方法です。
@default ActorId
@type select
@option アクターID
@value ActorId
@option パーティの並び順
@value PartyIndex
@option 敵キャラID
@value EnemyId
@option 敵グループの並び順(戦闘画面で有効)
@value TroopIndex
@option メニュー画面で選択したアクター(メニュー詳細画面で有効)
@value MenuActor

@param ActorId
@text アクターID
@desc 種別選択で『アクターID』を選択したときのアクターIDです。
@default 0
@type actor

@param EnemyId
@text 敵キャラID
@desc 種別選択で『敵キャラID』を選択したときの敵キャラIDです。
@default 0
@type enemy

@param Index
@text 並び順
@desc 種別選択で『パーティの並び順』『敵グループの並び順』を選択したときの並び順です。先頭は[0]です。
@default 0
@type number

@param LinkPosition
@text バトラー画像連動
@desc ゲージの表示座標をバトラーの座標と連動させます。
@default true
@type boolean
*/

(() => {
    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);
    if (!param.GaugeList) {
        param.GaugeList = [];
    }

    const _Scene_Base_create    = Scene_Base.prototype.create;
    Scene_Base.prototype.create = function() {
        _Scene_Base_create.apply(this, arguments);
        if (!(this instanceof Scene_Map)) {
            this.createExtraGauges();
        }
    };

    // 場所移動時に画像キャッシュが破棄される仕様のためマップ画面ではキャッシュ破棄後にゲージを作成する
    const _Scene_Map_create = Scene_Map.prototype.create;
    Scene_Map.prototype.create = function() {
        _Scene_Map_create.apply(this, arguments);
        this.createExtraGauges();
    };

    Scene_Base.prototype.createExtraGauges = function() {
        this._extraGauges = this.findExtraGaugeList().map(data => {
            return new Sprite_ExtraGaugeContainer(data, data.Detail || {}, data.Layout || {});
        });
    };

    const _Scene_Base_start    = Scene_Base.prototype.start;
    Scene_Base.prototype.start = function() {
        _Scene_Base_start.apply(this, arguments);
        this.addExtraGauge();
    };

    Scene_Base.prototype.addExtraGauge = function() {
        if (this._extraGaugesAdd) {
            return;
        }
        this._extraGauges.forEach(extraGauge => {
            this.addChildExtraGauge(extraGauge);
        });
        this._extraGaugesAdd = true;
    };

    Scene_Base.prototype.addChildExtraGauge = function(extraGauge) {
        const parentName = extraGauge.getParentWindowName();
        const priority = this.findGaugePriority();
        if (parentName && this._windowLayer) {
            const win = this._windowLayer.children.find(window =>
                window instanceof Window && window.findWindowClassName() === parentName);
            if (win) {
                win.addChild(extraGauge);
            } else {
                PluginManagerEx.throwError('Window is not found : ' + parentName, script);
            }
        } else if (priority > 0) {
            this._spriteset.addChildExtraGauge(extraGauge, priority);
        } else {
            this.addChild(extraGauge);
        }
    };

    Scene_Base.prototype.findGaugePriority = function() {
        return 0;
    };

    Scene_Battle.prototype.findGaugePriority = function() {
        return param.PriorityBattle;
    };

    Scene_Map.prototype.findGaugePriority = function() {
        return param.PriorityMap;
    };

    Spriteset_Base.prototype.addChildExtraGauge = function(extraGauge, priority) {
        let index = this.getChildIndex(this._pictureContainer);
        if (priority === 1) {
            index++;
        }
        this.addChildAt(extraGauge, index);
    };

    Spriteset_Battle.prototype.addChildExtraGauge = function(extraGauge, priority) {
        if (priority === 3) {
            const index = this._baseSprite.getChildIndex(this._battleField);
            this._baseSprite.addChildAt(extraGauge, index);
        } else {
            Spriteset_Base.prototype.addChildExtraGauge.apply(this, arguments);
        }
    };

    Spriteset_Map.prototype.addChildExtraGauge = function(extraGauge, priority) {
        if (priority >= 3) {
            extraGauge.z = 7 - priority;
            this._tilemap.addChild(extraGauge);
        } else {
            Spriteset_Base.prototype.addChildExtraGauge.apply(this, arguments);
        }
    };

    Scene_Base.prototype.findExtraGaugeList = function() {
        const currentSceneName = PluginManagerEx.findClassName(this);
        return (param.GaugeList || []).filter(function(data) {
            return data.SceneName === currentSceneName;
        }, this);
    };

    const _Sprite_Gauge_initialize = Sprite_Gauge.prototype.initialize;
    Sprite_Gauge.prototype.initialize = function(data, detail, layout) {
        if (data) {
            this._data = data;
            this._detail = detail;
            this._layout = layout;
        }
        _Sprite_Gauge_initialize.apply(this, arguments);
    };

    Window.prototype.findWindowClassName = function() {
        const className = PluginManagerEx.findClassName(this);
        // for SceneCustomMenu.js
        if (this._data?.Id) {
            return this._data.Id;
        } else {
            return className;
        }
    };

    const _Sprite_Battler_updatePosition = Sprite_Battler.prototype.updatePosition;
    Sprite_Battler.prototype.updatePosition = function() {
        _Sprite_Battler_updatePosition.apply(this, arguments);
        if (this._battler) {
            this._battler.updateSpritePosition(this);
        }
    };

    Game_Battler.prototype.updateSpritePosition = function(sprite) {
        this._imageX = sprite.x;
        this._imageY = sprite.y;
    };

    Game_Battler.prototype.findImageX = function() {
        return this._imageX || 0;
    };

    Game_Battler.prototype.findImageY = function() {
        return this._imageY || 0;
    };

    Game_Actor.prototype.currentLevelUpExp = function() {
        return this.nextLevelExp() - this.currentLevelExp();
    };

    Game_Actor.prototype.currentLevelGetExp = function() {
        return this.currentExp() - this.currentLevelExp();
    };

    /**
     * Sprite_ExtraGaugeContainer
     * 追加ゲージとピクチャを含むコンテナです。
     */
    class Sprite_ExtraGaugeContainer extends Sprite {
        constructor(data, detail, layout) {
            super();
            this._data = data;
            this._detail = detail;
            this._layout = layout;
            this.create();
        }

        getParentWindowName() {
            return this._layout.ParentWindow;
        }

        create() {
            this._gauge = new Sprite_ExtraGauge(this._data, this._detail, this._layout);
            this._lower = this.createPicture(this._data.LowerPicture);
            this.addChild(this._gauge);
            this._upper = this.createPicture(this._data.UpperPicture);
            this.setupPosition();
            this.update();
        }

        setupPosition() {
            this.x = this._gauge.findLayoutValue(this._layout.x);
            this.y = this._gauge.findLayoutValue(this._layout.y);
            this._baseX = this.x;
            this._baseY = this.y;
            if (this._layout.Mirror) {
                this.scale.x = -1;
            }
            if (this._lower && this._detail.GaugeBackHidden) {
                this._gauge.syncWithPicture(this._lower);
            }
        }

        syncBattler() {
            const battler = this._gauge.findLinkBattler();
            this.x = this._baseX + battler.findImageX();
            this.y = this._baseY + battler.findImageY();
        }

        syncCharacter() {
            const id = this._layout.linkCharacter;
            const character = id < 0 ? $gamePlayer : $gameMap.event(id);
            if (character) {
                this.x = this._baseX + character.screenX();
                this.y = this._baseY + character.screenY();
            }
        }

        update() {
            this.updateVisibly();
            super.update();
            if (this._layout.realTime) {
                this.setupPosition();
            }
            if (!!this._gauge.findLinkBattler()) {
                this.syncBattler();
            }
            if (this._layout.linkCharacter && !!$dataMap) {
                this.syncCharacter();
            }
            this.updateOpacity();
            this.updateFullSwitch();
            this._gauge.updateBattler();
        }

        updateVisibly() {
            this.visible = this.isVisible();
        }

        updateOpacity() {
            if (this._data.OpacityVariable) {
                this.opacity = $gameVariables.value(this._data.OpacityVariable);
            }
        }

        updateFullSwitch() {
            const id = this._detail.FullSwitchId;
            if (id > 0) {
                $gameSwitches.setValue(id, this._gauge.isFull());
            }
        }

        isVisible() {
            if (!this._gauge.isValid()) {
                return false;
            }
            return !this._data.SwitchId || $gameSwitches.value(this._data.SwitchId);
        }

        createPicture(pictureData) {
            if (!pictureData || !pictureData.FileName) {
                return null;
            }
            const sprite = new Sprite();
            sprite.bitmap = ImageManager.loadPicture(pictureData.FileName);
            this._gauge.setSpriteOrigin(sprite);
            sprite.x = pictureData.OffsetX || 0;
            sprite.y = pictureData.OffsetY || 0;
            this.addChild(sprite);
            return sprite;
        }
    }
    window.Sprite_ExtraGaugeContainer = Sprite_ExtraGaugeContainer;

    /**
     * Sprite_ExtraGauge
     * 追加ゲージを扱うクラスです。
     */
    class Sprite_ExtraGauge extends Sprite_Gauge {
        constructor(data, detail, layout) {
            super(data, detail, layout);
            this.setup(this.findBattler(), this._detail.GaugeColorPreset);
            this.setupPosition();
            if (this._detail.GaugeImage) {
                this.setupImage();
            }
            if (this._detail.GaugeBackHidden) {
                this.bitmap.fillRect = new Function();
            }
        }

        setupImage() {
            const gauge = new Sprite();
            gauge.bitmap = ImageManager.loadPicture(this._detail.GaugeImage);
            gauge.x = -this.width / 2 + this.gaugeX();
            gauge.y = -this.gaugeHeight() / 2 + (this.height - this.gaugeHeight()) / 2;
            if (this._detail.ScaleAutoAdjust) {
                gauge.bitmap.addLoadListener(() => {
                    gauge.scale.x = (this.width - this.gaugeX() - this.gaugeEndX()) / gauge.width;
                    gauge.scale.y = this.gaugeHeight() / gauge.height;
                });
            }
            this._gaugeImage = gauge;
            this.bitmap.gradientFillRect = new Function();
            this.addChild(gauge);
        }

        updateBattler() {
            if (this._menuActor) {
                this._battler = $gameParty.menuActor();
            } else {
                this._battler = this.findBattler();
            }
        }

        findBattler() {
            const battlerData = this._data.Battler;
            if (!battlerData || !battlerData.Type) {
                return $gameParty.members()[0];
            }
            const methodName = `findBattler${battlerData.Type}`;
            if (this[methodName]) {
                return this[methodName](battlerData);
            } else {
                return null;
            }
        }

        setSpriteOrigin(sprite) {
            if (this._layout.originX === 'left') {
                sprite.anchor.x = 0;
            } else if (this._layout.originX === 'right') {
                sprite.anchor.x = 1;
            } else {
                sprite.anchor.x = 0.5;
            }
            if (this._layout.originY === 'top') {
                sprite.anchor.y = 0;
            } else if (this._layout.originY === 'bottom') {
                sprite.anchor.y = 1;
            } else {
                sprite.anchor.y = 0.5;
            }
        }

        findLinkBattler() {
            if (this._data.Battler?.Type && this._data.Battler?.LinkPosition) {
                return this.findBattler();
            } else {
                return null;
            }
        }

        findBattlerActorId(battlerData) {
            return $gameActors.actor(battlerData.ActorId);
        }

        findBattlerMenuActor(battlerData) {
            this._menuActor = true;
            return $gameParty.menuActor();
        }

        findBattlerPartyIndex(battlerData) {
            return $gameParty.members()[battlerData.Index];
        }

        findBattlerEnemyId(battlerData) {
            const id = battlerData.EnemyId;
            const enemy = $gameTroop.members().find(battler => battler.enemyId() === id);
            return enemy || new Game_Enemy(battlerData.EnemyId, 0, 0);
        }

        findBattlerTroopIndex(battlerData) {
            return $gameTroop.members()[battlerData.Index];
        }

        updateBitmap() {
            const visible = this.parent ? this.parent.isVisible() : false;
            if (visible) {
                if (!this._prevVisible) {
                    this._value = this._targetValue;
                    this._maxValue = this._targetMaxValue;
                    this.redraw();
                }
            }
            super.updateBitmap();
            this._prevVisible = visible;
        }

        updateFlashing() {
            if (!this._detail.FlashIfFull) {
                return;
            }
            if (this.isFull()) {
                this._flashingCount++;
                if (this._flashingCount % 20 < 10) {
                    this.setBlendColor(this.flashingColor1());
                } else {
                    this.setBlendColor(this.flashingColor2());
                }
            } else {
                this.setBlendColor([0, 0, 0, 0]);
            }
        }

        flashingColor1() {
            return [255, 255, 255, 96];
        }

        flashingColor2() {
            return [255, 255, 255, 64];
        }

        isFull() {
            return this._value >= this._maxValue;
        }

        setupPosition() {
            this.setSpriteOrigin(this);
            if (this._layout.Vertical) {
                this.rotation = (270 * Math.PI) / 180;
            }
        }

        syncWithPicture(sprite) {
            if (!this._gaugeImage) {
                return;
            }
            sprite.bitmap.addLoadListener(() => {
                this._gaugeImage.x = sprite.x - sprite.anchor.x * sprite.width;
                this._gaugeImage.y = sprite.y - sprite.anchor.y * sprite.height;
            });
        }

        bitmapWidth() {
            return this.findLayoutValue(this._layout.width) || super.bitmapWidth();
        }

        bitmapHeight() {
            return this.findLayoutValue(this._layout.height) || super.bitmapHeight();
        }

        textHeight() {
            return this.bitmapHeight();
        }

        gaugeHeight() {
            return this.findLayoutValue(this._layout.GaugeHeight) || this.bitmapHeight();
        }

        gaugeX() {
            return this.findLayoutValue(this._layout.GaugeX) || 0;
        }

        gaugeEndX() {
            return this.findLayoutValue(this._layout.GaugeEndX) || 0;
        }

        drawGaugeRect(x, y, width, height) {
            super.drawGaugeRect(x, y, width - this.gaugeEndX(), height);
            if (this._gaugeImage) {
                this.drawGaugeImage();
            }
        }

        drawGaugeImage() {
            const gauge = this._gaugeImage;
            gauge.bitmap.addLoadListener(() => {
                const rate = this.gaugeRate();
                gauge.setFrame(0, 0, gauge.bitmap.width * rate, gauge.bitmap.height);
            });
        }

        findLayoutValue(value) {
            if (isNaN(value)) {
                try {
                    const width = $dataSystem.advanced.uiAreaWidth;
                    const height = $dataSystem.advanced.uiAreaHeight;
                    return eval(value);
                } catch (e) {
                    console.error(e);
                    return 0;
                }
            } else {
                return value;
            }
        }

        currentValue() {
            const value = this.findValue(this._data.CurrentMethod);
            if (!isFinite(value)) {
                PluginManagerEx.throwError(`Invalid current value[${value}] id[${this._data.Id}]`, script);
            }
            return value;
        }

        currentMaxValue() {
            const value = Math.max(this.findValue(this._data.MaxMethod), 1);
            if (!isFinite(value)) {
                PluginManagerEx.throwError(`Invalid current max value[${value}] id[${this._data.Id}]`, script);
            }
            return value;
        }

        findValue(method) {
            if (!method) {
                return 0;
            } else if (method.VariableId) {
                return $gameVariables.value(method.VariableId)
            } else if (method.Script) {
                const battler = this._battler;
                if (!battler) {
                    return 0;
                }
                const meta = battler.isActor() ? battler.actor().meta : battler.enemy().meta;
                try {
                    return eval(method.Script);
                } catch (e) {
                    console.error(e);
                    return 0;
                }
            } else {
                return method.FixedValue;
            }
        }

        label() {
            const label = this._detail.Label || ''
            return label.format(this._battler?.name() || '');
        }

        labelY() {
            const y = this._detail.LabelY;
            return isFinite(y) ? y : super.labelY();
        }

        iconIndex() {
            return this._detail.IconIndex || 0;
        }

        labelColor() {
            return this.findColor(this.findLabelFont().Color, super.labelColor());
        }

        labelOutlineColor() {
            return this.findColor(this.findLabelFont().OutlineColor, super.labelOutlineColor());
        }

        labelOutlineWidth() {
            return this.findLabelFont().OutlineWidth || super.labelOutlineWidth();
        }

        labelFontFace() {
            return this.findLabelFont().Face || super.labelFontFace();
        }

        labelFontSize() {
            return this.findLabelFont().Size || super.labelFontSize();
        }

        findLabelFont() {
            return this._detail.LabelFont || {};
        }

        valueColor() {
            return this.findColor(this.findValueFont().Color, super.valueColor());
        }

        valueOutlineColor() {
            return this.findColor(this.findValueFont().OutlineColor, super.valueOutlineColor());
        }

        valueOutlineWidth() {
            return this.findValueFont().OutlineWidth || super.valueOutlineWidth();
        }

        valueFontFace() {
            return this.findValueFont().Face || super.valueFontFace();
        }

        valueFontSize() {
            return this.findValueFont().Size || super.valueFontSize();
        }

        findValueFont() {
            return this._detail.ValueFont || {};
        }

        gaugeBackColor() {
            return this.findColor(this._detail.BackColor, super.gaugeBackColor());
        }

        gaugeColor1() {
            const fullColor = this._detail.GaugeColorFullLeft;
            const color = this._detail.GaugeColorLeft;
            return this.findColor(this.isFull() ? (fullColor || color) : color, super.gaugeColor1());
        }

        gaugeColor2() {
            const fullColor = this._detail.GaugeColorFullRight;
            const color = this._detail.GaugeColorRight;
            return this.findColor(this.isFull() ? (fullColor || color) : color, super.gaugeColor2());
        }

        isValid() {
            return !!this._battler;
        }

        smoothness() {
            if (this._value <= this._targetValue) {
                return this._detail.RisingSmoothness || 1;
            } else {
                return this._detail.FallingSmoothness || 1;
            }
        }

        drawValue() {
            if (this._detail.DrawValue) {
                if (this._detail.ValueFormat) {
                    this.drawCustomValue();
                } else {
                    super.drawValue();
                }
            }
        }

        drawCustomValue() {
            const digit = this._detail.ValuePadZeroDigit || 0;
            const current = this.currentValue().padZero(digit);
            const max = this.currentMaxValue().padZero(digit);
            const text = this._detail.ValueFormat.format(current, max);
            const x = this.gaugeX();
            const width = this.bitmapWidth() - 2 - x;
            const height = this.textHeight();
            const align = this._detail.ValueAlign || 'right';
            this.setupValueFont();
            this.bitmap.drawText(text, x, 0, width, height, align);
        }

        findColor(code, defaultColor = null) {
            if (!code) {
                return defaultColor ? defaultColor : ColorManager.normalColor();
            } else if (isNaN(code)) {
                return code;
            } else {
                return ColorManager.textColor(code);
            }
        }

        drawLabel() {
            super.drawLabel();
            const icon = this.iconIndex();
            if (icon) {
                this.drawIcon(icon);
            }
        }

        drawIcon(iconIndex) {
            const bitmap = ImageManager.loadSystem("IconSet");
            const pw = ImageManager.iconWidth;
            const ph = ImageManager.iconHeight;
            const sx = (iconIndex % 16) * pw;
            const sy = Math.floor(iconIndex / 16) * ph;
            const x = this.labelOutlineWidth() / 2;
            const y = (this.bitmap.height - ph) / 2;
            this.bitmap.blt(bitmap, sx, sy, pw, ph, x, y);
        }
    }
    window.Sprite_ExtraGauge = Sprite_ExtraGauge;
})();