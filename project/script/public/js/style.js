avatarSelect.onchange = (event) => {
  const image = avatarSelect.files[0];
  if (image) {
    avatarImage.src = URL.createObjectURL(image);
    avatarImage.classList.toggle("preview-avatar");
  }
};

itemSelect.onchange = (event) => {
  const image = itemSelect.files[0];
  if (image) {
    itemImage.src = URL.createObjectURL(image);
    itemImage.classList.toggle("preview-avatar");
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

