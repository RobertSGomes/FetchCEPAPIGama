import {
    fetchCep
} from "./fetch.js"

$("#cep-search").mask("00000-000")

if (!localStorage.getItem("currentUser")) {
    window.location.href = "../../index.html"
} else {
    const userName = document.querySelector("#user-name"),
        btnLogOut = document.querySelector("#logout")

    let name = localStorage.getItem("currentUser")

    name = name.split(" ")

    userName.textContent = name[0]

    const
        searchInp = document.querySelector("#cep-search"),
        fetchBtn = document.querySelector("#handle-search")

    fetchBtn.addEventListener("click", function (e) {
        if (searchInp.value.length == 9) {
            e.preventDefault()

            fetchCep(searchInp.value)
        } else {
            swal(
                'Erro!',
                "CEP inválido",
                'warning'
            )
        }

        searchInp.value = null
    })

    btnLogOut.addEventListener("click", function () {
        let users = JSON.parse(localStorage.getItem("cepUsers"))
        let ceps = JSON.parse(localStorage.getItem("cepList"))
        localStorage.clear()
        localStorage.setItem("cepUsers", JSON.stringify(users))
        localStorage.setItem("cepList", JSON.stringify(ceps))

        window.location.href = "../../index.html"
    })
}