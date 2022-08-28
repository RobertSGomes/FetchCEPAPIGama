class CEP {
    constructor() {
        this._cep = []
    }

    set cep(newCep) {
        let newitem = this._cep.filter(cep => newCep.response.cep === cep.response.cep)

        if (newitem.length == 0) {
            this._cep = [...this._cep, newCep]
            currentUser.ceps = this._cep
            localStorage.setItem("currentUser", JSON.stringify(currentUser))
        } else {
            swal(
                'Erro!',
                "CEP já existe",
                'warning'
            )
        }
    }

    get cep() {
        return this._cep
    }

    removeCep(id) {
        this._cep.splice(id, 1)
        currentUser.ceps = this._cep
        localStorage.setItem("currentUser", JSON.stringify(currentUser))
    }

    removeAll() {
        this._cep = []
        currentUser.ceps = this._cep
        localStorage.setItem("currentUser", JSON.stringify(currentUser))
    }

    findCEP(id) {
        return this._cep[id]
    }

    changeCep(cep, id) {
        this._cep[id] = cep
        currentUser.ceps = this._cep
        localStorage.setItem("currentUser", JSON.stringify(currentUser))
    }
}

if (!localStorage.getItem("currentUser")) window.location.href = "../../index.html"

$("#inp-cep").mask("00000-000")
$("#house-number").mask("00000")

const
    currentUser = JSON.parse(localStorage.getItem("currentUser")),
    txtName = document.querySelector("#user-name"),
    btnSignOut = document.querySelector("#handle-logout"),
    inpCep = document.querySelector("#inp-cep"),
    btnFetch = document.querySelector("#handle-fetch"),
    cepClass = new CEP(),
    cepList = document.querySelector("#cep-list"),
    txtTitle = document.querySelector("#txt-title"),
    trashAll = document.querySelector("#trash-all"),
    btnChangeCepInfos = document.querySelector("#handle-change"),
    formCepInfos = document.querySelector("#form"),
    txtForm = document.querySelector("#form-cep"),
    inpNumber = document.querySelector("#house-number"),
    inpComplement = document.querySelector("#house-complement"),
    inpReference = document.querySelector("#house-reference")

loadUserName()
loadCeps()

btnFetch.addEventListener("click", function (e) {
    e.preventDefault()

    fetchCep()
})

trashAll.addEventListener("click", function () {
    cepClass.removeAll()
    createCards(cepClass.cep)
    hideForm()
})

btnChangeCepInfos.addEventListener("click", function (e) {
    e.preventDefault()

    if (isFormInputsBlank()) return

    let
        cepId = localStorage.getItem("currentCepId"),
        cepInfos = cepClass.findCEP(cepId),
        cepIcon = document.querySelector("input[name='location']:checked").value

    cepInfos.icon = cepIcon
    cepInfos.response.number = inpNumber.value
    cepInfos.response.complement = inpComplement.value
    cepInfos.response.reference = inpReference.value

    cepClass.changeCep(cepInfos, cepId)
    createCards(cepClass.cep)

    hideForm()
})

btnSignOut.addEventListener("click", function () {
    let allUsers = JSON.parse(localStorage.getItem("allUsers")),
        index = allUsers.findIndex(user => {
            return currentUser.name === user.name
        })

    allUsers[index] = currentUser

    localStorage.setItem("allUsers", JSON.stringify(allUsers))
    localStorage.removeItem("currentUser")
    localStorage.removeItem("currentCepId")

    window.location.href = "../../index.html"
})


function loadUserName() {
    let userName = currentUser.name.split(" ")

    txtName.textContent = userName[0]
}

function loadCeps() {
    for (let cep of currentUser.ceps) {
        if (typeof cep.response.cep === "undefined") {
            return
        } else {
            cepClass.cep = cep
            createCards(cepClass.cep)
        }
    }
}

function fetchCep() {
    if (!validateFetch()) return

    let newCep = inpCep.value.replace("-", ""),
        url = `http://viacep.com.br/ws/${newCep}/json/`

    fetch(url).then(async response => {
        let data = await response.json()

        if (isCepUndefined(data)) return

        cepClass.cep = {
            "icon": "fa-location-dot",
            "response": data
        }

        createCards(cepClass.cep)
    }).catch((e) => {
        swal(
            'Erro!',
            "CEP inválido",
            'warning'
        )
    })

    inpCep.value = null
}

function validateFetch() {
    if (isInputCepNull()) return false

    if (isInputCepInvalid()) return false

    return true
}

function isInputCepNull() {
    if (inpCep.value.length == 0) {
        swal(
            'Informação!',
            "Digite um CEP",
            'info'
        )

        return true
    } else {
        return false
    }
}

function isInputCepInvalid() {
    if (inpCep.value.length != 9) {
        swal(
            'Erro!',
            "CEP inválido",
            'warning'
        )

        return true
    } else {
        return false
    }
}

function isCepUndefined(data) {
    if (typeof data.cep === "undefined") {
        console.log(typeof data.cep)
        swal(
            'Erro!',
            "CEP inválido",
            'warning'
        )
        return true
    } else {
        return false
    }
}

function hasCep(array) {
    if (array.length === 0) {
        txtTitle.textContent = "Busque algum CEP"
        trashAll.style.display = "none"

        return false
    } else {
        txtTitle.textContent = "Lista de CEPs"
        trashAll.style.display = "flex"

        return true
    }
}

function createCards(array) {
    cepList.innerHTML = null

    if (!hasCep(array)) return

    for (let i = 0; i < array.length; i++) {
        addCardRow(array[i], i)
    }

    loadCardEvents()
}

function addCardRow(item, id) {
    let card = document.createElement("div"),
        cardTitle

    card.classList.add("card")

    switch (item.icon) {
        case "fa-home":
            cardTitle = "Casa - " + item.response.cep
            break
        case "fa-briefcase":
            cardTitle = "Trabalho - " + item.response.cep
            break
        case "fa-school":
            cardTitle = "Escola - " + item.response.cep
            break
        default:
            cardTitle = item.response.cep
    }

    card.innerHTML = `
        <div class="card-icon card-header">
            <i class="fa-solid ${item.icon}"></i>
        </div>
        <div class="card-body">
            <h1>${cardTitle}</h1>
            ${
                item.response.number ?
                 `<span>${item.response.logradouro}, ${item.response.number} ${item.response.complement}  - ${item.response.bairro} - ${item.response.localidade}-${item.response.uf}</span>` :
                 `<span>${item.response.logradouro} - ${item.response.bairro} - ${item.response.localidade}-${item.response.uf}</span>`
            }
            ${
                item.response.reference ?
                 `<br /><span><strong>Referência:</strong> ${item.response.reference}</span>` :
                 ``
            }
        </div>
        <div class="card-footer">
            <i class="fa-solid fa-pen select-cep" id="select_${id}"></i>
            <i class="fa-solid fa-trash delete-cep" id="delete_${id}"></i>
        </div>
    `

    cepList.appendChild(card)
}

function loadCardEvents() {
    const
        deleteCeps = document.getElementsByClassName("delete-cep"),
        selectCeps = document.getElementsByClassName("select-cep")

    for (let deleteCep of deleteCeps) {
        deleteCep.addEventListener("click", function () {
            let id = deleteCep.id
            cepClass.removeCep(id.replace("delete_", ""))
            createCards(cepClass.cep)
            hideForm()
        })
    }

    for (let selectCep of selectCeps) {
        selectCep.addEventListener("click", function () {
            let id = selectCep.id
            id = id.replace("select_", "")
            changeCepInfos(id)
        })
    }
}

function changeCepInfos(id) {
    showForm(id)

    localStorage.setItem("currentCepId", id)
}

function isFormInputsBlank() {
    if (inpNumber.value.length == 0 || inpComplement.value.length == 0 || inpReference.value.length == 0) {
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

function showForm(id) {
    const inpTypes = document.getElementsByName("location")

    formCepInfos.reset()
    formCepInfos.style.display = "flex"

    let cep = cepClass.findCEP(id)
    txtForm.textContent = cep.response.cep
    inpNumber.value = cep.response.number ? cep.response.number : ""
    inpComplement.value = cep.response.complement ? cep.response.complement : ""
    inpReference.value = cep.response.reference ? cep.response.reference : ""

    for (let input of inpTypes) {
        if (input.value === cep.icon) {
            input.checked = true
        }
    }
}

function hideForm() {
    formCepInfos.reset()
    localStorage.removeItem("currentCepId")
    formCepInfos.style.display = "none"
}