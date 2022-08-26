export function signIn(login, password) {
    if (login.length == 0 || password.length == 0) {
        swal(
            'Erro!',
            "Preencha todos os campos",
            'warning'
        )

        return
    }


    if (localStorage.getItem("cepUsers")) {
        const users = JSON.parse(localStorage.getItem("cepUsers"))

        let error = true

        for (let user of users) {
            if (user.name === login && user.password === password) {
                error = false
                localStorage.setItem("currentUser", login)
            }
        }

        if (error) {
            swal(
                'Erro!',
                "Usuário e/ou senha incorretos",
                'warning'
            )
        } else {
            window.location.href = "./pages/dashboard/index.html"
        }
    } else {
        swal(
            'Erro!',
            "Nenhum usuário encontrado. Faça seu cadastro",
            'warning'
        )
    }
}