avatarSelect.onchange = (event) =>{
  const image = avatarSelect.files[0];
  if (image){
      avatarImage.src = URL.createObjectURL(image);
      avatarImage.classList.toggle("previewAvatar");
      avatarLabel.classList.remove("previewAvatar");
      avatarLabel.classList.toggle("disable");
  }
};
itemSelect.onchange = (event) =>{
  const image = itemSelect.files[0];
  if (image){
      itemImage.src = URL.createObjectURL(image);
      itemImage.classList.toggle("previewAvatar");
      itemLabel.classList.remove("previewAvatar");
      itemLabel.classList.toggle("disable");
  }
};
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