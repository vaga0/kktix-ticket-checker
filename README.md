# HTML DOM 處理

## 前言

KKtix 售票頁面分了幾個類型，這個自動檢查腳本僅適用 KKtix 部分頁面

## 腳本如何運作

腳本的工作流程如下

1. 等待售票區塊出現
2. 計算各種票面數量是否正確（ex. 是否有大於0的數量、售罄+未售出票 是否等於總票數）
3. 若有票可買則停留目前頁面（想獲得通知需配合其他工具）
4. 非 3. 的狀況時重新整理頁面（想自動回到 1. 需配合瀏覽器延伸套件）

## 使用方法

下面列出常見的幾種使用方式

### 一、開發人員工具

1. 開啟你想檢測的頁面後開啟「開發人員工具」

- Windows 快速鍵
  - Chrome/Edge: `Ctrl` + `Shift` + `I`
- Mac 快速鍵
  - Chrome/Safari/Edge: `Option` + `Command` + `I`

2. 於主控台貼上整段 JS 程式碼後按 `Enter`

### 二、安裝擴充功能（Chrome）

此類工具涉及資安應謹慎使用，因此這邊僅告知有這個方法並不進行教學說明
此類工具主要功能為，可以設定當哪個網址被開啟後自動執行什麼腳本，配合腳本會自動重整頁面，做到持續刷新頁面

### 三、利用我的最愛(書籤)執行腳本

將 JavaScript 腳本放在瀏覽器最愛連結（書籤）中執行的技術，稱為 Bookmarklet（書籤小程序）。

Bookmarklet 的特點
  - 簡單易用：只需將代碼存為書籤，點擊即可執行。
  - 跨平台：適用於大多數現代瀏覽器（如 Chrome、Firefox、Safari）。
  - 限制：受瀏覽器 URL 長度限制（通常約 2000 字元），因此代碼需要精簡（不可換行），或透過外部腳本載入。
  - 安全注意：Bookmarklet 能存取當前網頁的 DOM 和資料（如 cookies），因此僅應使用來自可信來源的代碼，以免洩露隱私或執行惡意代碼。

1. 準備好所需格式的 javascript 程式
   ```javascript
   javascript:(function(){'use strict';const e=!0,t=new Date().getTime(),o=new MutationObserver(()=>{const e=document.querySelector('.ticket-quantity');if(e){o.disconnect();var n=new Date().getTime();console.log(n+': 🎯 目標元素出現'),console.log("差幾秒"+(n-t)),c()}}),n=()=>{if(e){document.querySelectorAll('.ticket-quantity.ng-binding.ng-scope').forEach(e=>{const t=e.closest('.ticket-unit.ng-scope');t&&(t.style.display='none')})}},c=()=>{const e=document.querySelectorAll('.ticket-unit').length,t=document.querySelectorAll('.ticket-quantity.ng-binding.ng-scope').length,o=document.querySelectorAll('.ticket-quantity.ng-scope:not(.ng-binding)').length;if(0===e)console.warn('沒有展示任何票位？？');else if(e-t<=0)console.warn('全部票位已售完！');else if(e-t!==o)console.warn('票位數量不一致！？');else{console.log('🎉 有票可買！播放提示音！'),fetch('http://localhost:8080'),n();return}const c=Math.floor(2e3*Math.random())+1e3;console.warn(c+'毫秒後重新整理'),setTimeout(() => location.reload(),c)};console.log(t+': Start waitting...'),o.observe(document.body,{childList:!0,subtree:!0})})()
   ```

2. 手動添加書籤：
  - 打開瀏覽器的書籤管理器（通常在選單中找到「書籤」或「書籤管理」）。
  - 選擇「新建書籤」或「添加書籤」。
  - 在「名稱」欄輸入書籤名稱（例如「我的 Bookmarklet」）。
  - 在「URL」欄貼上生成的 javascript: URL。
  - 保存書籤。

3. 拖曳添加（若工具支援）：
  - 將工具生成的連結直接拖到瀏覽器的書籤欄或書籤選單。

4. 執行測試：
  - 打開目標網頁。
  - 點擊書籤欄中的 Bookmarklet。

## 有票時發出提示聲

基於瀏覽器本身安全機制，當網頁被開啟後，若使用者與瀏覽器沒有任何的互動（滑鼠點擊、鍵盤按鍵信號）前，無法主動發出聲音
因此腳本在偵測到有票時是透過 `fetch('http://localhost:8080');` 去嘗試呼叫使用者本機 8080 port 上的服務（若沒有啟用則無作用）

### 如何啟動該服務

參考另一個專案 [vaga0/soundNotify](https://github.com/vaga0/soundNotify)

利用此專案在自己電腦上起一個監聽服務，一但間聽到有人呼叫 http://localhost:8080 時便撥放提示音效。
