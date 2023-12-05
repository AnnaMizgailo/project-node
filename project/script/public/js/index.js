async function signUp(){
  const user = {
    login: document.querySelector("#newLogin").value,
    password: document.querySelector("#newPassword").value,
    role: document.querySelector("#role").value,
    image: avatarSelect.files[0]
  }
  const response = await fetch("/user/sign-up", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });
  if(response.ok){
    document.location = "/";
    return;
  }
  alert(await response.text());
}
async function signIn(){
    const login = document.querySelector("#login").value;
    const password = document.querySelector("#password").value;
    const response = await fetch(`/user/sign-in?login=${login}&password=${password}`);
    if(response.ok){
      document.location = "/";
      return;
    }
    alert(await response.text());
}
async function backToMainPage(){
    document.location = "/";
}

async function addItem(){
  const item = {
    name: document.querySelector("#itemName").value,
    price: document.querySelector("#itemPrice").value,
    category: document.querySelector("#category").value,
    image: itemSelect.files[0]
  }
  const response = await fetch("/retailer/add/item", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(item),
  });
  if(response.ok){
    alert(await response.text());
    document.location = "/";
    return;
  }
  alert(await response.text());
}

async function userModify(){
  document.location = "/user/moderate";
}
async function deleteUser(id){
  const response = await fetch(`/user/moderate/delete?id=${id}`, {
    method: "DELETE",
  });
  if(response.ok){
    alert("Пользователь удален!");
  }
}
async function banUser(id){
  const data = {id: id};
  const response = await fetch("/user/moderate/ban", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data)});
    if(response.ok){
      alert("Пользователь забанен!");
    }
}
async function unbanUser(id){
  const data = {id: id};
  const response = await fetch("/user/moderate/unban", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data)});
    if(response.ok){
      alert("Пользователь разбанен!");
    }
}