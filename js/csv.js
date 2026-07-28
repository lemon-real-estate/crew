const file = document.getElementById("csvFile");
const button = document.getElementById("convertButton");
const status = document.getElementById("status");

button.addEventListener("click", async () => {

    if (!file.files.length) {
        alert("CSVを選択してください");
        return;
    }

    const text = await file.files[0].text();
    // CSV読込
    const workbook = XLSX.read(text, {
        type: "string"
    });

    const sheet = workbook.Sheets[workbook.SheetNames[0]];

    const rows = XLSX.utils.sheet_to_json(sheet, {
        header: 1,
        raw: false
    });
    // CSVを配列へ

    console.log(rows);

    // Excelブック作成
    const wb = XLSX.utils.book_new();

    // シート作成
    const output = [];

    XLSX.utils.book_append_sheet(wb, ws, "CSV");

    // 保存
    XLSX.writeFile(wb, "確認.xlsx");

    status.innerHTML =
        "確認.xlsx を保存しました";
});