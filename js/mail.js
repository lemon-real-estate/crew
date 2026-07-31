const correctPin = "7676";


function checkPin(){

    const pin =
        document.getElementById("pin").value;


    if(pin === correctPin){

        window.open(
            "https://docs.google.com/spreadsheets/d/17DMw3lJQzAgFytIX2VEyhbnWuXYjiQvcV0QSMu7ORr8/edit?gid=0",
            "_blank"
        );

    }else{

        document.getElementById("message").textContent =
        "PINが違います";

    }

}