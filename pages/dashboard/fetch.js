class CEP {
    constructor() {
        this._cep = []
    }


    set cep(cep) {
        let newitem = true

        for (let item of this._cep) {
            if (item.response.cep === cep.response.cep) {
                newitem = false
            }
        }

        if (newitem) {
            this._cep = [...this._cep, cep]
            localStorage.setItem("cepList", JSON.stringify(this._cep))
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
        if (id = localStorage.getItem("currentCepId")) {
            localStorage.removeItem("currentCepId")
        }
        this._cep.splice(id, 1)
        localStorage.setItem("cepList", JSON.stringify(this._cep))
    }

    removeAll() {
        this._cep = []
        localStorage.removeItem("cepList")
    }

    findCEP(id) {
        return this._cep[id]
    }

    changeCep(cep, id) {
        this._cep[id] = cep
        localStorage.setItem("cepList", JSON.stringify(this._cep))
    }
}

const cepClass = new CEP(),
    cepList = document.querySelector("#cep-list"),
    titleTxt = document.querySelector("#title"),
    trashAll = document.querySelector("#trash-all"),
    btnChange = document.querySelector("#handle-change"),
    form = document.querySelector("#form"),
    formText = document.querySelector("#form-cep")

if (localStorage.getItem("cepList")) {
    for (let cep of JSON.parse(localStorage.getItem("cepList"))) {
        cepClass.cep = cep
    }
    createItem(JSON.parse(localStorage.getItem("cepList")))
    if (localStorage.getItem("cepList")) {
        if (localStorage.getItem("currentCepId")) {
            let id = localStorage.getItem("currentCepId"),
                cep = cepClass.findCEP(id)

            formText.textContent = cep.response.cep
            form.style.display = "flex"
        } else {
            form.style.display = "none"
        }
    }
}

trashAll.addEventListener("click", function () {
    cepClass.removeAll()
    createItem(cepClass.cep)
})

export function fetchCep(cep) {
    let newCep = cep.replace("-", "")

    let url = `http://viacep.com.br/ws/${newCep}/json/`

    fetch(url).then(async response => {
        let data = await response.json()

        if (typeof data.cep != "undefined") {
            cepClass.cep = {
                "icon": "fa-location-dot",
                "response": data
            }

            createItem(cepClass.cep)
        } else {
            swal(
                'Erro!',
                "CEP inválido",
                'warning'
            )
        }
    }).catch(() => {
        swal(
            'Erro!',
            "CEP inválido",
            'warning'
        )
    })
}

function createItem(array) {
    cepList.innerHTML = null

    if (array.length === 0) {
        titleTxt.textContent = "Busque algum CEP"
        trashAll.style.display = "none"
    } else {
        titleTxt.textContent = "Lista de CEPs"
        trashAll.style.display = "flex"

        for (let i = 0; i < array.length; i++) {
            addRow(array[i], i)
        }

        listEvents()
    }
}

function addRow(item, id) {
    let card = document.createElement("div")
    card.classList.add("card")

    var cardTitle = item.response.cep

    if (item.icon === "fa-home") {
        cardTitle = "Casa"
    } else if (item.icon === "fa-briefcase") {
        cardTitle = "Trabalho"
    } else if (item.icon === "fa-school") {
        cardTitle = "Escola"
    }

    card.innerHTML = `
        <div class="card-icon normal-cep">
            <i class="fa-solid ${item.icon}"></i>
        </div>
        <div class="card-body">
            <h1>${cardTitle}</h1>
            <span>${item.response.logradouro}, ${item.response.bairro}, ${item.response.localidade}-${item.response.uf}</span>
        </div>
        <div class="card-footer">
            <i class="fa-solid fa-pen select-cep" id="select_${id}"></i>
            <i class="fa-solid fa-trash delete-cep" id="delete_${id}"></i>
        </div>
    `

    cepList.appendChild(card)
}

function listEvents() {
    var deleteCeps = document.getElementsByClassName("delete-cep"),
        selectCeps = document.getElementsByClassName("select-cep")

    for (let deleteCep of deleteCeps) {
        deleteCep.addEventListener("click", function () {
            let id = deleteCep.id
            cepClass.removeCep(id.replace("delete_", ""))
            createItem(cepClass.cep)
        })
    }

    for (let selectCep of selectCeps) {
        selectCep.addEventListener("click", function () {
            let id = selectCep.id
            id = id.replace("select_", "")
            localStorage.setItem("currentCepId", id)
            changeCepInfos()
        })
    }
}

function changeCepInfos() {
    form.reset()
    form.style.display = "flex"

    let id = localStorage.getItem("currentCepId"),
        cep = cepClass.findCEP(id)

    formText.textContent = cep.response.cep

    localStorage.setItem("currentCepId", id)
}

btnChange.addEventListener("click", function (e) {
    e.preventDefault()

    if (localStorage.getItem("currentCepId")) {
        const
            inpNumber = document.querySelector("#house-number"),
            inpComplement = document.querySelector("#house-complement"),
            inpReference = document.querySelector("#house-reference"),
            inpCepType = document.getElementsByName("location")

        if (inpNumber.value.length == 0 || inpComplement.value.length == 0 || inpReference.value.length == 0) {
            swal(
                'Erro!',
                "Preencha todos os campos",
                'warning'
            )
            return
        }

        let cepIcon

        for (let type of inpCepType) {
            if (type.checked) {
                cepIcon = type.value
            }
        }

        let id = localStorage.getItem("currentCepId"),
            cep = cepClass.findCEP(id)

        cep.icon = cepIcon

        cepClass.changeCep(cep, id)
        createItem(cepClass.cep)
        form.reset()
        localStorage.removeItem("currentCepId")
        form.style.display = "none"
    } else {
        swal(
            'Informação!',
            "Selecione um CEP para alterar",
            'info'
        )
    }
})