const
    userInp = document.querySelector("#user-login"),
    emailInp = document.querySelector("#user-email"),
    passwordInp = document.querySelector("#user-password"),
    confirmPassInp = document.querySelector("#user-confirm-password"),
    buttonForm = document.querySelector("#handle-signup")

buttonForm.addEventListener("click", function (e) {
    e.preventDefault()

    if (userInp.value.length == 0 || emailInp.value.length == 0 || passwordInp.value.length == 0 || confirmPassInp.value.length == 0) {
        swal(
            'Erro!',
            "Preencha todos os campos",
            'warning'
        )
        return
    }

    let name = "oi"

    if (!emailInp.value.includes("@") || !emailInp.value.includes(".com")) {
        swal(
            'Erro!',
            "E-mail inválido",
            'warning'
        )
        return
    }

    if (passwordInp.value === confirmPassInp.value) {
        let users = [],
            newUser = {
                "name": userInp.value,
                "email": emailInp.value,
                "password": passwordInp.value
            },
            newItem = true

        if (localStorage.getItem("cepUsers")) {
            users = JSON.parse(localStorage.getItem("cepUsers"))
        }

        for (let user of users) {
            if (user.name === newUser.name) {
                newItem = false
            }
        }

        if (newItem) {
            users.push(newUser)
        }

        localStorage.setItem("cepUsers", JSON.stringify(users))
        window.location.href = "../../index.html"
    } else {
        swal(
            'Erro!',
            "Senhas não correspondem",
            'warning'
        )
    }
})