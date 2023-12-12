async function signUp(event){
  event.preventDefault();
  form.submit();

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

async function addItem(event){
    event.preventDefault();
    form-item.submit();
    document.location = "/";
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

async function addToCart(id){
  const itemId = {id: id};
  const response = await fetch("/user/add/cart", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(itemId)});
    if(response.ok){
      alert(await response.text());
    }
}

async function deleteFromCart(id){
  const response = await fetch(`/user/delete/cart?id=${id}`, {
    method: "DELETE"
    });
    if(response.ok){
      alert(await response.text());
    }
}

async function payForItem(id){
  const response = await fetch(`/user/pay/cart?id=${id}`, {
    method: "DELETE"
    });
    if(response.ok){
      alert(await response.text());
    }
}

async function filterItems(){
  const category = document.querySelector("#filters").value;
  const response = await fetch(`/filter?category=${category}`);
  if(response.ok){
    document.location = "/";
    location.reload();
    document.querySelector("#search").value = category;
  }
}

async function resetFilters(){
  const category = "";
  const response = await fetch(`/filter?category=${category}`);
  if(response.ok){
    document.location = "/";
    location.reload();
    document.querySelector("#search").value = category;
  }
}

async function search(e){
  if(e.keyCode == 13){
    const searchBar = document.querySelector("#search").value;
    console.log(searchBar);
    const response = await fetch(`/search?str=${searchBar}`);
    if(response.ok){
      document.location = "/";
      location.reload();
      document.querySelector("#search").value = searchBar;
    }
  }
}

document.querySelector("#search").addEventListener('keydown', search)


