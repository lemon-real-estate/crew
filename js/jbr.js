const startButton = document.getElementById("startButton");

startButton.addEventListener("click", startCheck);


function startCheck() {

    const dataA = document.getElementById("dataA").value;
    const dataB = document.getElementById("dataB").value;


    const listA = splitLines(dataA);
    const listB = splitLines(dataB);


    const collection = parseCollectionData(listA);
    const invoice = parseInvoiceData(listB);


    const missingInvoice = checkMissingInvoice(collection, invoice);
    const missingCollection = checkMissingCollection(collection, invoice);

    console.log("集金データ", collection);
    console.log("請求データ", invoice);

    showResult(
        collection,
        invoice,
        missingInvoice,
        missingCollection
    );

}



// 空行除去
function splitLines(text) {

    return text
        .split("\n")
        .map(line => line.trim())
        .filter(line => line !== "");

}



// 集金データ解析
function parseCollectionData(lines) {

    const result = [];


    for (const line of lines) {

        const cols = line.split("\t");


        if (cols.length < 4) continue;


        result.push({

            building: cols[1].trim(),
            room: cols[2].trim(),
            name: cols[3].trim()

        });

    }


    return result;

}



// 請求データ解析
function parseInvoiceData(lines) {

    const result = [];


    for (const line of lines) {

        const cols = line.split("\t");


        if (cols.length < 5) continue;


        const name =
            cols[cols.length - 5].trim();


        const property =
            cols[cols.length - 4].trim();



        result.push({

            property,
            name

        });

    }


    return result;

}



// 表記ゆれ吸収
function normalize(text) {

    return text
        .replace(/\s+/g, "")
        .replace(/[（）()]/g, "")
        .replace(/[０-９]/g,
            s => String.fromCharCode(
                s.charCodeAt(0) - 0xFEE0
            )
        )
        .toLowerCase();

}



// 集金にあるが請求にない
function checkMissingInvoice(collection, invoice) {


    return collection.filter(c => {


        return !invoice.some(i =>

            normalize(c.building)
            ===
            normalize(i.property)

            &&

            normalize(c.name)
            ===
            normalize(i.name)

        );


    });


}



// 請求にあるが集金にない
function checkMissingCollection(collection, invoice) {


    return invoice.filter(i => {


        return !collection.some(c =>


            normalize(c.building)
            ===
            normalize(i.property)

            &&

            normalize(c.name)
            ===
            normalize(i.name)


        );


    });


}



// 結果表示
function showResult(
    collection,
    invoice,
    missingInvoice,
    missingCollection
) {


    const resultArea =
        document.getElementById("resultArea");


    const parsedArea =
        document.getElementById("parsedArea");



    resultArea.innerHTML = `

        <p>集金データ：${collection.length}件</p>

        <p>請求データ：${invoice.length}件</p>

        <hr>

        <p>
        ❌ 請求漏れ候補：
        ${missingInvoice.length}件
        </p>

        <p>
        ⚠️ 集金漏れ候補：
        ${missingCollection.length}件
        </p>

    `;



    let html = "";



    html += `
    <h3>❌ 請求漏れ候補</h3>
    `;


    if (missingInvoice.length === 0) {

        html += "なし<br>";

    }
    else {


        html += `
        <table border="1">
        <tr>
        <th>建物</th>
        <th>部屋</th>
        <th>氏名</th>
        </tr>
        `;


        missingInvoice.forEach(item => {


            html += `

            <tr>
            <td>${item.building}</td>
            <td>${item.room}</td>
            <td>${item.name}</td>
            </tr>

            `;


        });


        html += "</table>";

    }




    html += `
    <hr>
    <h3>⚠️ 集金漏れ候補</h3>
    `;



    if (missingCollection.length === 0) {

        html += "なし<br>";

    }
    else {


        html += `
        <table border="1">
        <tr>
        <th>建物</th>
        <th>氏名</th>
        </tr>
        `;


        missingCollection.forEach(item => {


            html += `

            <tr>
            <td>${item.property}</td>
            <td>${item.name}</td>
            </tr>

            `;


        });


        html += "</table>";

    }



    parsedArea.innerHTML = html;


}