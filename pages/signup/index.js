const
    userInp = document.querySelector("#user-login"),
    emailInp = document.querySelector("#user-email"),
    passwordInp = document.querySelector("#user-password"),
    confirmPassInp = document.querySelector("#user-confirm-password"),
    buttonForm = document.querySelector("#handle-signup")

buttonForm.addEventListener("click", function (e) {
    e.preventDefault()

    signUp()
})

function signUp() {
    if (isInputsBlank()) return

    if (isEmailInvalid()) return

    if (isPasswordNotEqual()) return

    if (newUser()) window.location.href = "../../index.html"
}

function isInputsBlank() {
    if (userInp.value.length == 0 || emailInp.value.length == 0 || passwordInp.value.length == 0 || confirmPassInp.value.length == 0) {
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

function isEmailInvalid() {
    if (!emailInp.value.includes("@") || !emailInp.value.includes(".com")) {
        swal(
            'Erro!',
            "E-mail inválido",
            'warning'
        )

        return true
    } else {
        return false
    }
}

function isPasswordNotEqual() {
    if (passwordInp.value !== confirmPassInp.value) {
        swal(
            'Erro!',
            "Senhas não correspondem",
            'warning'
        )

        return true
    } else {
        return false
    }
}

function newUser() {
    let allUsers = localStorage.getItem("allUsers") ? JSON.parse(localStorage.getItem("allUsers")) : [],
        newUser = {
            "name": userInp.value,
            "email": emailInp.value,
            "password": passwordInp.value,
            "ceps": []
        }

    return hasUser(allUsers, newUser) ? false : true
}

function hasUser(allUsers, newUser) {
    let isUser = allUsers.filter(user => user.name === newUser.name || user.email === newUser.email)

    if (isUser.length != 0) {
        swal(
            'Erro!',
            "Usuário já existe",
            'warning'
        )

        return true
    } else {
        allUsers.push(newUser)

        localStorage.setItem("allUsers", JSON.stringify(allUsers))

        return false
    }
}