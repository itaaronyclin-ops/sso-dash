/**
 * 簽到管理系統 (Attendance Pro) 整合指南
 * 當使用者在簽到系統 App 中掃描交通系統產生的 QR Code 時，應執行的邏輯。
 */

// 1. 掃描後取得 QR URL
// 範例 URL: https://script.google.com/macros/s/SSO_SCRIPT_ID/exec?action=authorize&qrToken=UUID_TOKEN

async function onQRCodeScanned(scannedUrl) {
    try {
        // 取得當前簽到系統的使用者 AGCODE (假設已登入)
        const currentAgCode = UserSession.getAgCode();

        // 解析 URL 並附加 agcode 參數
        // 或者直接從 URL 提取 qrToken，再呼叫 SSO API
        const url = new URL(scannedUrl);
        const qrToken = url.searchParams.get('qrToken');

        if (!qrToken) {
            alert('無效的登入碼');
            return;
        }

        // 2. 呼叫 SSO 授權介面
        const ssoBaseUrl = scannedUrl.split('?')[0]; // 取得 SSO 腳本網址
        const system = url.searchParams.get('system') || 'attendance'; // 從 QR 取得系統名稱，或自定義
        const authUrl = `${ssoBaseUrl}?action=authorize&qrToken=${qrToken}&agcode=${currentAgCode}&system=${system}`;

        const response = await fetch(authUrl, { method: 'POST' });
        const result = await response.json();

        if (result.status === 'success') {
            alert('已成功授權登入！');
        } else {
            alert('授權失敗：' + result.message);
        }
    } catch (error) {
        console.error('SSO Authorization Error:', error);
        alert('系統連線錯誤');
    }
}
