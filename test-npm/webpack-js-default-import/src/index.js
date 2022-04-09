import "../../../dist/coloris.css";
import Coloris from "../../..";

Coloris.init();

Coloris({
    el: "#coloris",
});

Coloris.close();

document.getElementById("status").textContent = "done";
