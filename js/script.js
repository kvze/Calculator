const buttons = document.querySelector(".buttons");

function test(){
    console.log("test");
}

buttons.addEventListener("click", function(event){
    if (event.target.closest(".button")){
        test();
    }
});