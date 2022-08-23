class CEP {
    constructor() {
        this._cep = []
    }

    set cep(cep) {
        let newitem = true

        for (let item of this._cep) {
            if (item.cep === cep.cep) {
                newitem = false
            }
        }

        if (newitem) {
            this._cep = [...this._cep, cep]
        } else {
            alert("Este CEP já existe")
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

let cepClass = new CEP()

const
    cepTable = document.getElementById("cep_table"),
    cepBody = document.getElementById("list_cep"),
    inpSearch = document.getElementById("search_inp"),
    btnSearch = document.getElementById("search_btn"),
    txtTitle = document.getElementById("title"),
    btnDeleteAll = document.getElementById("delete_all")

$("#search_inp").mask("00000-000")

btnSearch.addEventListener("click", function (e) {
    e.preventDefault()

    const cep = inpSearch.value

    fetchCep(cep)

    inpSearch.value = null
})

btnDeleteAll.addEventListener("click", function () {
    cepClass.removeAll()
    createTable(cepClass.cep)
})

function fetchCep(cep) {
    let newCep = cep.replace("-", "")

    let url = `http://viacep.com.br/ws/${newCep}/json/`

    fetch(url).then(async response => {
        let data = await response.json()

        if (typeof data.cep != "undefined") {
            cepClass.cep = data

            createTable(cepClass.cep)
        } else {
            alert("CEP inválido")
        }
    }).catch((e) => {
        alert("CEP inválido")
    })
}

function createTable(array) {
    cepBody.innerHTML = null

    if (array.length === 0) {
        txtTitle.textContent = "Busque algum CEP"
        cepTable.style.display = "none"
        btnDeleteAll.style.display = "none"
    } else {
        txtTitle.textContent = "Lista de CEPs"
        cepTable.style.display = "table"
        btnDeleteAll.style.display = "flex"

        for (let i = 0; i < array.length; i++) {
            addRow(array[i], i)
        }

        tableEvents()
    }
}

function addRow(item, id) {
    let row = cepBody.insertRow(-1);

    let column1 = row.insertCell(0),
        column2 = row.insertCell(1),
        column3 = row.insertCell(2),
        column4 = row.insertCell(3),
        column5 = row.insertCell(4),
        column6 = row.insertCell(5)

    column1.innerHTML = item.cep
    column2.innerHTML = item.logradouro
    column3.innerHTML = item.bairro
    column4.innerHTML = item.localidade
    column5.innerHTML = item.uf
    column6.innerHTML = `<div><i class="fa-solid fa-trash delete_cep" id="delete_${id}"></i></div>`
}

function tableEvents() {
    var deleteCeps = document.getElementsByClassName("delete_cep")

    for (let deleteCep of deleteCeps) {
        deleteCep.addEventListener("click", function () {
            let id = deleteCep.id
            cepClass.removeCep(id.replace("delete_", ""))
            createTable(cepClass.cep)
        })
    }
}