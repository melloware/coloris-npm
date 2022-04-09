requirejs(["lib/coloris"], function(Coloris) {
    Coloris.init();
    
    Coloris({
        el: "#coloris",
    });
    
    Coloris.close();

    document.getElementById("status").textContent = "done";
});
