
const box=document.getElementById("box");
const boxt=document.getElementById("box2");
const register=document.getElementById("register");
const login=document.getElementById("login-btn");


register.addEventListener("click",()=>{

    box.style.zIndex="-1";
    boxt.style.zIndex="1";
});

login.addEventListener("click",()=>{
    
    box.style.zIndex="1";
    boxt.style.zIndex="-1";
});







