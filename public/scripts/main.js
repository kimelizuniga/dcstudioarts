const viewAll           = document.getElementById('viewAll'),
      closeButton       = document.getElementById('close'),
      modal             = document.getElementById('myModal')

// MODAL FUNCTION 

function viewAllGallery() {
    modal.style.display = 'block'
}

function modalNone() {
    modal.style.display = 'none';
}

window.onclick = function(event) {
    if(event.target == closeButton) {
        modalNone();
    }
}


viewAll.addEventListener('click', viewAllGallery)