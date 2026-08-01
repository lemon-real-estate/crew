const GAS_URL = "https://script.google.com/macros/s/AKfycbwcX6P9Z2U7-DVLtp-jAM__nQapXIFqdKX6amfYMyWrbP7idJG5JpuoZj8Hd-gfNJXJtg/exec";

const passwordBox = document.getElementById("password");
const loginButton = document.getElementById("loginButton");
const errorMessage = document.getElementById("errorMessage");

// 60分　60 (分)* 60(秒) * 1000(ミリ秒)

const LOGIN_TIME = 5 * 60 * 1000;

// 起動時
window.addEventListener("load", () => {

    checkLogin();

});

// ボタン
loginButton.addEventListener("click", login);

// Enterキー
passwordBox.addEventListener("keydown", e => {

    if (e.key === "Enter") {

        login();

    }

});

// ------------------------------

function checkLogin() {

    const loginTime = localStorage.getItem("loginTime");

    if (!loginTime) {

        return;

    }

    const now = Date.now();

    if (now - Number(loginTime) < LOGIN_TIME) {

        location.href = "key.html";

    } else {

        localStorage.removeItem("loginTime");

    }

}

// ------------------------------

async function login() {

    errorMessage.textContent = "";

    const input = passwordBox.value.trim();

    if (input === "") {

        errorMessage.textContent = "パスワードを入力してください。";

        return;

    }

    try {

        const response = await fetch(
            GAS_URL + "?action=pin"
        );

        const data = await response.json();

        if (input === data.pin) {

            localStorage.setItem(
                "loginTime",
                Date.now()
            );

            location.href = "key.html";

        } else {

            errorMessage.textContent =
                "パスワードが違います。";

            passwordBox.value = "";
            passwordBox.focus();

        }

    } catch {

        errorMessage.textContent =
            "通信エラー";

    }

}