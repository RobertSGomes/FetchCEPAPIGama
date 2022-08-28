const
    userInp = document.querySelector("#user-login"),
    passwordInp = document.querySelector("#user-password"),
    buttonForm = document.querySelector("#handle-signin")

if (localStorage.getItem("currentUser")) window.location = "./pages/dashboard/index.html"
if (!localStorage.getItem("allUsers")) window.location = "./pages/signup/index.html"

buttonForm.addEventListener("click", function (e) {
    e.preventDefault()

    signIn()
})

function signIn() {
    if (isInputsBlank()) return

    if (hasUser()) window.location.href = "./pages/dashboard/index.html"
}

function isInputsBlank() {
    if (userInp.value.length == 0 || passwordInp.value.length == 0) {
        swal(
            'Erro!',
            "Preencha todos os campos",
            'warning'
        )

        return true
    } else {
        return false
    }
}

function hasUser() {
    let allUsers = JSON.parse(localStorage.getItem("allUsers")),
        hasUser = allUsers.filter(user => user.name === userInp.value && user.password === passwordInp.value)

    if (hasUser.length == 0) {
        swal(
            'Erro!',
            "Usuário e/ou senha incorretos",
            'warning'
        )
        return false
    } else {
        localStorage.setItem("currentUser", JSON.stringify(hasUser[0]))
        return true
    }
}