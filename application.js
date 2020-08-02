class Despesa {
    constructor(ano,mes,dia,tipo,descricao,valor){
        this.ano = ano
        this.mes = mes
        this.dia = dia
        this.tipo = tipo
        this.descricao = descricao
        this.valor = valor
    }

    validacaoDados(){
        for(let i in this) {
            if(this[i] == undefined || this[i] == "" || this[i] == null  ) {
                return false
            }
        }
        return true
    }
}

class DataBase {

    constructor() {
        let id = localStorage.getItem('id')

        if(id === null) {
            localStorage.setItem('id', "0")
        }
    }

    getProxId() {
        let proxId = localStorage.getItem('id')
        return parseInt(proxId) + 1
    }

    gravar(d) {
        let id = this.getProxId()

        localStorage.setItem(id, JSON.stringify(d))

        localStorage.setItem('id', id)
    }

    recuperarDespesas() {

        //array de despesas
        let despesas = []

        let id = localStorage.getItem("id")

        //Recuperar as despesas já cadastradas em localStorage
        for(let i =1; i<=id; i++){

            //recuperar a despesa
            let despesa = JSON.parse(localStorage.getItem(i))

            //possibilidade de existir i = null

            if(despesa === null){
                continue
            }
            despesa.id = i
            despesas.push(despesa)
            
        }

        return despesas
    }

    pesquisar(despesa) {
        let despesasFiltradas = this.recuperarDespesas()

        console.log(despesasFiltradas)

        //ano
        if(despesa.ano != ""){
         despesasFiltradas = despesasFiltradas.filter(d => d.ano == despesa.ano)
        }

        //mes 
        if(despesa.mes != ""){
            despesasFiltradas = despesasFiltradas.filter(d => d.mes == despesa.mes )
        }

        //dia 
        if(despesa.dia != ""){
            despesasFiltradas = despesasFiltradas.filter(d => d.dia == despesa.dia)
        }

        //tipo
        if(despesa.tipo != ""){
            despesasFiltradas = despesasFiltradas.filter(d => d.tipo == despesa.tipo)
        }

        //descricao
        if(despesa.descricao != "") {
            despesasFiltradas = despesasFiltradas.filter(d => d.descricao == despesa.descricao)
        }

        //valor
        if(despesa.valor != ""){
            despesasFiltradas = despesasFiltradas.filter(d => d.valor == despesa.valor)
        }


        return despesasFiltradas
    }
    remover(id) {
        localStorage.removeItem(id)
    }
   
}

let dataBase = new DataBase() 



function cadastroDespesa() {
   let ano = document.querySelector("#ano").value
    let mes =document.querySelector("#mes").value
    let dia =document.querySelector("#dia").value
    let tipo =document.querySelector("#tipo").value
    let descricao = document.querySelector("#descricao").value
    let valor =document.querySelector("#valor").value
    
    
    
    let despesa = new Despesa(ano,mes,dia,tipo,descricao,valor)

   if(despesa.validacaoDados()) {
        dataBase.gravar(despesa)
        document.querySelector(".modal-header").classList.add("text-success")
        document.querySelector(".modal-title").innerHTML = "Gravação bem sucedida"
        document.querySelector(".modal-body").innerHTML = "Dados salvos com sucesso"
        document.querySelector("#botaoRodape").innerHTML = "Entendido"
        document.querySelector("#botaoRodape").classList.add("btn-success")
        $('#janelaRegistro').modal('show') // caso o processo ocorra sem problemas

        limparCampos()
        
    }
    else{
        document.querySelector(".modal-header").classList.add("text-danger")
        document.querySelector(".modal-title").innerHTML = "Atenção! Dados inválidos"
        document.querySelector(".modal-body").innerHTML = "Alguns campos obrigatórios não foram preenchidos corretamente"
        document.querySelector("#botaoRodape").innerHTML = "Retornar e realizar as correções"
        document.querySelector("#botaoRodape").classList.add("btn-danger")
        $('#janelaRegistro').modal('show')//caso ocorra algum erro
    }

}


function valorEmReal(){
    let valor = document.querySelector("#valor").value.replace(/(.*)/,"R$ $1")
    document.querySelector("#valor").value = valor 
}

function limparCampos() {
    document.querySelector("#ano").value = ''
    document.querySelector("#mes").value = ''
    document.querySelector("#dia").value = ''
    document.querySelector("#tipo").value =''
    document.querySelector("#descricao").value =''
    document.querySelector("#valor").value = ''
}

function carregarDespesa(despesas = Array(), filtro = false) {

    if(despesas.length == 0 && filtro == false){
        despesas = dataBase.recuperarDespesas()
    }
    
    let despesasLista = document.querySelector("#despesas")

    despesasLista.innerHTML =''

    //percorrer o array despesas, listando cada despesa de forma dinâmica
    despesas.forEach(function(d) {
        
        
        let linha = despesasLista.insertRow()

        linha.insertCell(0).innerHTML = `${d.dia}/${d.mes}/${d.ano}`
        
        //ajuste tipo
        switch(d.tipo){
            case "1": d.tipo = "Alimentação"
                break
            case "2": d.tipo = "Estudos"
                break
            case "3": d.tipo = "Lazer"
                break
            case "4": d.tipo = "Transporte"
                break
            case "5": d.tipo = "Saúde"
                break
        }

        linha.insertCell(1).innerHTML = d.tipo

        linha.insertCell(2).innerHTML = d.descricao
        linha.insertCell(3).innerHTML = d.valor

        //criacao botao excluir
        let botao = document.createElement("button")
        botao.className = "btn btn-secondary"
        botao.innerHTML = "<f class ='fas fa-times'></i>"
        botao.id = `Identificador${d.id}`
        botao.onclick = function() {
            //remover a despesa
            
            let id = this.id.replace('Identificador','')
            alert(id)
            dataBase.remover(id)

            window.location.reload()
        }
        linha.insertCell(4).append(botao)

        console.log(d)
        
        

    })

   
}

function pesquisaDespesa(){
    let ano = document.querySelector("#ano").value
    let mes = document.querySelector("#mes").value
    let dia = document.querySelector("#dia").value
    let tipo = document.querySelector("#tipo").value
    let descricao = document.querySelector("#descricao").value
    let valor = document.querySelector("#valor").value

    let despesa = new Despesa(ano, mes, dia, tipo, descricao, valor)

   let despesasComFiltro = dataBase.pesquisar(despesa)
   

    carregarDespesa(despesasComFiltro, true)
    

}