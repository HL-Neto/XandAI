
export function showBar() {
    const navBar = document.querySelector('.navBar');
    const hisChat = document.querySelector('.hisChat');
  
    if (navBar.style.width === "260px") {
         navBar.style.backgroundColor =" #222222"
        navBar.style.width = "50px";
        navBar.style.height = "100vh"
        hisChat.style.display = "none";
    } 
 
    else {
        navBar.style.backgroundColor = "rgb(19, 19, 19)";
        navBar.style.width = "260px";
        navBar.style.height = "180px"
        hisChat.style.display = "block"
       
    }
}
