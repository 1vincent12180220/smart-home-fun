# 智慧家居 FUN v5｜GitHub Pages 公開科普網站

## 網站功能

- 科普教學：DHT11、ESP32、RGB LED、溫溼度獨立判斷規則。
- 虛擬實驗室：溫度與濕度滑桿、虛擬 LED 顏色與閃爍動畫、九種組合快捷鍵。
- 決策路徑：同步顯示溫度與濕度兩條判斷路徑。
- 遊戲 A：決策挑戰賽，10 題，每題 10 分。
- 遊戲 B：我是智慧家居工程師，5 個雙條件任務。
- 遊戲 C：60 秒智慧判斷王，每題 10 分，答錯不扣分。
- 支援手機、平板、電腦；無外部 CDN、無登入、無成績上傳。

## v5 規則（與 ESP32 v5 程式一致）

- 溫度 ≥ 30°C：紅燈；20°C ≤ 溫度 < 30°C：綠燈；溫度 < 20°C：藍燈。
- 濕度 < 40%：快閃 2 Hz；40% ≤ 濕度 ≤ 60%：恆亮；濕度 > 60%：慢閃 0.5 Hz。
- 顏色與閃爍獨立決定，總共 3 × 3 = 9 種組合。
- 邊界 20、30、40、60 已納入題庫。

## GitHub Pages 部署

1. 在 GitHub 建立公開儲存庫（例如 `smart-home-fun`）。
2. 解壓 ZIP，將 **index.html、style.css、game.js、README.md、.nojekyll** 上傳到儲存庫根目錄。**不要只上傳 ZIP**。
3. 進入 `Settings → Pages → Build and deployment`，選 `Deploy from a branch`。
4. Branch 選 `main`，Folder 選 `/(root)`，儲存。
5. 等待部署完成，以 GitHub Pages 頁面顯示的實際 URL 為準。一般專案網址形式為 `https://帳號.github.io/smart-home-fun/`。
6. 使用手機行動網路測試公開網址、九種燈號與三款遊戲。

## 本機預覽

直接開啟 `index.html`，或於網站資料夾執行 `python -m http.server 8000` 後瀏覽 `http://localhost:8000/`。

## 重要安全與功能限制

- **公開 GitHub Pages 版只提供模擬，不連線、不讀取、不控制實體 ESP32**。現場實體控制仍使用 ESP32 的區域網路頁面。
- 不要上傳含 Wi-Fi SSID/密碼的 `.ino` 到公開儲存庫。
- 本站 CSP 禁止對外連線（`connect-src 'none'`），不含第三方分析或外部資源。
- 本站沒有後端排行榜；分數只存在當前頁面記憶體。
- 本站的決策樹是**規則式邏輯**，不是機器學習訓練的 AI 模型。
- 閃爍動畫在系統設定「減少動態效果」時停用，以改善可及性；實體 ESP32 的閃爍不受此設定影響。

## 修改指南

- 內容與版面：`index.html`、`style.css`。
- 規則與題庫：`game.js` 的 `decide()`、`questions`、`missions`。
- 如更改門檻，請同步修改網站教學文案、題庫與 ESP32 韌體，確保一致。
