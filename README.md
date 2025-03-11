# AWS-Final-Project

透過AWS Rekognition建立一個可以註冊、登入，並將偵測到的臉部表情即時轉換為對應顏文字輸入到瀏覽器中指定的文字輸入框的Chrome/Edge Extension。

---

## Features
- **註冊與登入**：使用AWS Rekognition臉部辨識進行安全且快速的使用者註冊及登入。

- **即時表情辨識**：使用偵測使用者的臉部表情並轉換為對應的顏文字。
  
- **自動輸入功能**：將轉換後的顏文字即時輸入到當前啟用（active）的文字欄位。

---
## Tools
- AWS Rekognition
- Chrome/Edge Extension API
- JavaScript
- HTML/CSS
- React
---
## Project Structure
```bash
AWS-Final-Project/
├── aws-face-emoji-extension # Browser Extension Files
├── lambda_rekognition_emoji # 用於處理上傳的圖片，返回對應的表情符號。
└── lambda_S3_emoji          # 主要用於接收上傳的身分驗證圖片，將圖片存儲到AWS S3存儲桶中。
```
``` bash
aws-face-emoji-extension/
├── manifest.json            # Browser Extension 配置檔
├── popup.html               # 跳出視窗頁面
├── emoji.js                 # 負責處理表情符號的插入以及鍵盤事件處理
├── authenticate.js          # 負責處理用戶的身份驗證，通過上傳圖片到AWS API進行身份驗證
├── background.js            # 處理瀏覽器背景執行及訊息傳遞
├── content.js               # 負責將偵測到的顏文字輸入到指定的輸入框中
├── camera.js                # 負責處理瀏覽器相機的開啟、拍照
├── index.css                # 樣式設定
└── libs/
    ├── react.js             # React 核心
    └── react-dom.js         # React DOM渲染
```
---
## Important Notes
- This project requires an AWS Rekognition setup and is not ready-to-use out of the box.
- Using AWS Rekognition may incur costs.
- This project uses your browser's built-in camera, and your browser will automatically request permission to access it upon first use.
---
## Installation
1. Clone this repository:
```bash
git clone https://github.com/FrostRabbit/AWS-Final-Project.git
```
2. Zip aws-face-emoji-extension folder
3. Navigate to browser settings
4. Enable "Developer mode" and click on "Load unpacked". Select the zipped project folder.
   
---
## Face expressions & Emoji comparison

| Face expressions | Emoji |
|------------------|-------|
| HAPPY            | (＊゜ー゜)b |
| SAD              | (´;ω;`) |
| ANGRY            | (／‵Д′)／~ ╧╧ |
| CONFUSED         | ( ╹ -╹)? |
| DISGUSTED        | (·•᷄‎ࡇ•᷅ ) |
| SURPRISED        | Σ(;ﾟдﾟ) |
| CALM             | (*ᵕᴗᵕ)⁾⁾ |
| UNKNOWN          | 🤔 |
| FEAR             | ( ﾟдﾟ) |

---
## Demo Video
<iframe width="560" height="315" src="https://www.youtube.com/embed/nJWwoXhRGVw?si=5fRMqF0stkh-F5mo" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>