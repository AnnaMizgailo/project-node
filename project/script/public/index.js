async function enableAuthorization() {
    document.getElementById("myProfile").classList.toggle("show");
}

window.onclick = function(event) {
  if (!event.target.matches('.profile')) {

    let dropdowns = document.getElementsByClassName("profile-content");
    for (let i = 0; i < dropdowns.length; i++) {
      let openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}