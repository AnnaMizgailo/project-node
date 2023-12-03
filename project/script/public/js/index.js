
async function signUp(){
  const user = {
    login: document.querySelector("#newLogin").value,
    password: document.querySelector("#newPassword").value,
    role: document.querySelector("#role").value,
    image: avatarImage.src
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

