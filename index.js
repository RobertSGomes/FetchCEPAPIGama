import {
    signIn
} from "./scripts/signin.js"

const
    userInp = document.querySelector("#user-login"),
    passwordInp = document.querySelector("#user-password"),
    buttonForm = document.querySelector("#handle-signin")

buttonForm.addEventListener("click", function (e) {
    e.preventDefault()

    signIn(userInp.value, passwordInp.value)
})

if (localStorage.getItem("currentUser")) {
    window.location = "./pages/dashboard/index.html"
}