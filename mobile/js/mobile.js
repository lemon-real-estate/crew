const GAS_URL = "https://script.google.com/macros/s/AKfycbwcX6P9Z2U7-DVLtp-jAM__nQapXIFqdKX6amfYMyWrbP7idJG5JpuoZj8Hd-gfNJXJtg/exec";

const searchButton = document.getElementById("searchButton");
const listButton = document.getElementById("listButton");
const searchBox = document.getElementById("searchBox");
const resultArea = document.getElementById("resultArea");
const updateDate = document.getElementById("updateDate");

window.addEventListener("load", () => {
    loadUpdateDate();
});

searchButton.addEventListener("click", searchKey);

listButton.addEventListener("click", showList);

searchBox.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
        searchKey();
    }
});

async function loadUpdateDate() {

    try {

        const response = await fetch(
            GAS_URL + "?action=updated"
        );

        const data = await response.json();

        updateDate.textContent = data.updated;

    } catch {

        updateDate.textContent = "取得できません";

    }

}

async function searchKey() {

    const keyword = searchBox.value.trim();

    if (keyword === "") {

        resultArea.innerHTML = `
            <div class="resultCard">
                検索文字を入力してください。
            </div>
        `;

        return;

    }

    resultArea.innerHTML = `
        <div class="loading">
            検索中...
        </div>
    `;

    try {

        const response = await fetch(
            GAS_URL +
            "?action=search&keyword=" +
            encodeURIComponent(keyword)
        );

        const list = await response.json();

        drawAccordion(list);

    } catch (e) {

        console.error(e);

        resultArea.innerHTML = `
            <div class="resultCard">
                通信エラー
            </div>
        `;

    }

}

async function showList() {

    resultArea.innerHTML = `
        <div class="loading">
            一覧を取得しています...
        </div>
    `;

    try {

        const response = await fetch(
            GAS_URL + "?action=list"
        );

        const list = await response.json();

        drawAccordion(list);

    } catch (e) {

        console.error(e);

        resultArea.innerHTML = `
            <div class="resultCard">
                通信エラー
            </div>
        `;

    }

}


function toggleAccordion(index){

    const bodies =
        document.querySelectorAll(".accordionBody");

    bodies.forEach((body,i)=>{

        if(i===index){

            if(body.classList.contains("open")){

                body.classList.remove("open");

            }else{

                body.classList.add("open");

            }

        }else{

            body.classList.remove("open");

        }

    });

}
function drawAccordion(list) {

    if (!Array.isArray(list) || list.length === 0) {

        resultArea.innerHTML = `
            <div class="resultCard">
                該当データはありません。
            </div>
        `;

        return;

    }

    let html = "";

    list.forEach((item, index) => {

        html += `
        <div class="accordionCard">

            <div class="accordionHeader"
                 onclick="toggleAccordion(${index})">

                ▶ 🏢 ${item.property}　${item.room}

            </div>

            <div class="accordionBody"
                 id="acc${index}">

                <div class="resultLocation">
                    📍 ${item.location}
                </div>

                ${item.note && item.note.trim() !== ""
                    ? `<div class="resultNote">📝 ${item.note}</div>`
                    : ""}

                ${item.pin && item.pin.trim() !== ""
                    ? `<div class="resultPin">🔐 ${item.pin}</div>`
                    : ""}

            </div>

        </div>
        `;

    });

    resultArea.innerHTML = html;

}

function toggleAccordion(index) {

    const bodies =
        document.querySelectorAll(".accordionBody");

    bodies.forEach((body, i) => {

        if (i === index) {

            body.classList.toggle("open");

        } else {

            body.classList.remove("open");

        }

    });

}
const logoutButton = document.getElementById("logoutButton");

if (logoutButton) {

    logoutButton.addEventListener("click", () => {

        localStorage.removeItem("loginTime");

        location.href = "login.html";

    });

}