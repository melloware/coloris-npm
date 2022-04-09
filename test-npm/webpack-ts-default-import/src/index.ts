import "../../../dist/coloris.css";
import Coloris from "../../..";

Coloris.init();

Coloris({
    el: "#coloris",
});

Coloris.close();

const status = document.getElementById("status");
if (status) status.textContent = "done";
