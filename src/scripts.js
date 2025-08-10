
export function showBar() {
    const navBar = document.querySelector('.navBar');
    const hisChat = document.querySelector('.hisChat');
  
    if (navBar.style.width === "260px") {
        navBar.style.width = "50px";
        navBar.style.height = "100vh"
        hisChat.style.display = "none";
    } 
 
    else {
        navBar.style.width = "260px";
        navBar.style.height = "180px"
        hisChat.style.display = "block"
    }
}
