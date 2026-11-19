# 智慧家居 FUN｜GitHub Pages 公開遊戲版

這個版本以已通過驗收的 `SmartHome_WiFi_DecisionTree_v4.ino` 為基礎，保留三款遊戲的題目、條件、計分及計時邏輯，並加入獨立的決策樹教學區。

## 檔案
- `index.html`：網站首頁與遊戲介面
- `style.css`：手機與電腦版面樣式
- `game.js`：三款遊戲與決策樹運算（僅在瀏覽器內執行）
- `.nojekyll`：讓 GitHub Pages 直接提供靜態檔案

## 三款遊戲
- A：決策樹挑戰賽，10 題、每題 10 分。
- B：我是智慧家居工程師，5 關，調整虛擬溫溼度。
- C：60 秒智慧判斷王，答對得 10 分，答錯不扣分。

決策條件依序為：溫度 ≥ 30°C → 高溫；濕度 ≥ 70% → 高濕；濕度 < 30% → 低濕；溫度 < 20°C → 低溫；其餘 → 正常。先符合者優先。

## 發布到 GitHub Pages
1. 登入 GitHub，建立一個 **Public** repository，例如 `smart-home-fun`。
2. 在儲存庫根目錄上傳 `index.html`、`style.css`、`game.js`、`.nojekyll`（不是上傳整個 ZIP 當網站）。
3. 進入 **Settings → Pages**，在 **Build and deployment** 下選擇 **Deploy from a branch**。
4. Branch 選 `main`，資料夾選 `/ (root)`，按 **Save**。
5. 等待 GitHub Pages 發布，網站通常為 `https://你的GitHub帳號.github.io/smart-home-fun/`（以 Pages 顯示的實際網址為準）。
6. 使用手機行動網路開啟網站，測試三款遊戲，確認不需連接 ESP32。

## 本機測試
可直接用瀏覽器開啟 `index.html`；若瀏覽器的本機安全限制阻止載入 JS，請在資料夾中執行 `python -m http.server 8000`，再開啟 `http://localhost:8000/`。

## 硬體隔離與隱私
- 這個公開網站**沒有** ESP32 IP、Wi-Fi SSID、密碼、感測器資料、遠端控制按鈕或 `/control`、`/simulate` API 呼叫。
- JavaScript 不使用 `fetch`、`WebSocket` 或其他對外網路請求；CSP 亦設定 `connect-src 'none'`。
- 分數只保存在目前瀏覽器頁面記憶體，不會上傳至伺服器，也沒有跨裝置排行榜。
- GitHub Pages 是公開靜態網站，任何知道網址的人都可存取；不要上傳原始 ESP32 `.ino` 中的真實 Wi-Fi 密碼。
- 決策閾值為科普教學範例，不代表室內環境安全或健康標準。

## 修改與維護
更動題目請編輯 `game.js` 中的 `quizQuestions`；更動工程師任務請編輯 `missions`；更動顏色與版面請編輯 `style.css`。若更改決策條件，請同步修改 `decide()`、`decisionPath()` 與首頁規則表，以避免不一致。
