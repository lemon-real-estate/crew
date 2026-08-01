const GAS_URL = "https://script.google.com/macros/s/AKfycbwcX6P9Z2U7-DVLtp-jAM__nQapXIFqdKX6amfYMyWrbP7idJG5JpuoZj8Hd-gfNJXJtg/exec";

let phoneList = [];

const tbody = document.querySelector("#phoneTable tbody");
const keyword = document.getElementById("keyword");
const type = document.getElementById("type");
const count = document.getElementById("count");

window.addEventListener("load", loadPhoneList);

keyword.addEventListener("input", filterTable);
type.addEventListener("change", filterTable);

//--------------------------------------
// 電話帳読込
//--------------------------------------

async function loadPhoneList() {

    try {

        const response = await fetch(
            GAS_URL + "?action=phone"
        );

        phoneList = await response.json();

        drawTable(phoneList);

    } catch (e) {

        console.error(e);

        tbody.innerHTML = `
            <tr>
                <td colspan="5">
                    読み込みに失敗しました
                </td>
            </tr>
        `;

    }

}

//--------------------------------------
// 一覧表示
//--------------------------------------

function drawTable(list) {

    tbody.innerHTML = "";

    count.textContent = list.length;

    const isMobile =
        /Android|iPhone|iPad/i.test(
            navigator.userAgent
        );

    list.forEach(item => {

        const tr = document.createElement("tr");

        const telCell = isMobile

            ? `<a href="tel:${item.tel.replace(/-/g, "")}">
                    ${item.tel}
               </a>`

            : `<span class="copyTel">
                    ${item.tel}
               </span>`;

        const shortCell =

            `<span class="copyShort">
                ${item.short}
             </span>`;

        tr.innerHTML = `

            <td class="short">

                ${shortCell}

            </td>

            <td>

                ${item.name}

            </td>

            <td class="tel">

                ${telCell}

            </td>

            <td>

                ${item.group}

            </td>

            <td>

                ${item.type}

            </td>

        `;

        tbody.appendChild(tr);

        //----------------------------------
        // PCだけコピー
        //----------------------------------

        if (!isMobile) {

            tr.querySelector(".copyTel")
                .addEventListener("click", () => {

                    navigator.clipboard.writeText(item.tel);

                    alert("電話番号をコピーしました");

                });

            tr.querySelector(".copyShort")
                .addEventListener("click", () => {

                    navigator.clipboard.writeText(item.short);

                    alert("短縮番号をコピーしました");

                });

        }

    });

}

//--------------------------------------
// 検索
//--------------------------------------

function filterTable() {

    const word = keyword.value
        .trim()
        .toLowerCase();

    const typeValue = type.value;

    const result = phoneList.filter(item => {

        const target = (

            item.short +

            item.name +

            item.kana

        ).toLowerCase();

        const keywordOK =
            target.includes(word);

        const typeOK =
            typeValue === "" ||
            item.type === typeValue;

        return keywordOK && typeOK;

    });

    drawTable(result);

}
window.addEventListener("load", () => {
    document.getElementById("keyword").focus();
});