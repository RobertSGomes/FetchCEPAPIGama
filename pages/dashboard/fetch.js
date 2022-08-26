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
    }

    removeAll() {
        this._cep = []
    }
}

const cepClass = new CEP()

const
    cepList = document.querySelector("#cep-list"),
    titleTxt = document.querySelector("#title"),
    trashAll = document.querySelector("#trash-all")

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

    card.innerHTML = `
        <div class="card-icon normal-cep">
            <i class="fa-solid ${item.icon}"></i>
        </div>
        <div class="card-body">
            <h1>${item.response.cep}</h1>
            <span>${item.response.logradouro}, ${item.response.bairro}, ${item.response.localidade}-${item.response.uf}</span>
        </div>
        <div class="card-footer">
            <i class="fa-solid fa-trash delete_cep" id="delete_${id}"></i>
        </div>
    `

    cepList.appendChild(card)
}

function listEvents() {
    var deleteCeps = document.getElementsByClassName("delete_cep")

    for (let deleteCep of deleteCeps) {
        deleteCep.addEventListener("click", function () {
            let id = deleteCep.id
            cepClass.removeCep(id.replace("delete_", ""))
            createItem(cepClass.cep)
        })
    }
}