


export function BarTrue()
{   
    var state = true
}

export function showBar()
{
    if (state === true){
        const navBar = document.querySelector('.navBar');
        navBar.style.width = "250px";
    }
}



