/* 
    FUNCOES RELACIONADAS AO PERSONAGEM
*/

//funcao para criar personagem passando como parametro nome e sua aspiracao
//conforme for surgindo outros atributos para personagem, acrescentamos
export function criarPersonagem(nome, aspiracao) {
    
    const personagem = {
        id: (Math.random().toFixed(4)).toString().split('.')[1],  //id unico para cada personagem
        nome: nome,
        vida_restante: 3600000,  //vida inicial padrao em ms
        cresceleons: 1500,       //moeda do jogo inicial padrao
        aspiracao: aspiracao,
        estado: null,            //estado atual (dormindo, treinando, etc)
        higiene: 28,             //higiene inicial padrao
        energia: 32,             //energia inicial padrao
        emprego: null,
        habilidades: [
            {"habilidade": "GASTRONOMIA", "nivel": 0},
            {"habilidade": "PINTURA", "nivel": 0},
            {"habilidade": "JOGOS", "nivel": 0},
            {"habilidade": "JARDINAGEM", "nivel": 0},
            {"habilidade": "MUSICA", "nivel": 0}
        ],
        itens: {
            "GASTRONOMIA": [],
            "PINTURA": [],
            "JOGOS": [],
            "JARDINAGEM": [],
            "MUSICA": [],
        },
        relacionamentos: []
    }

    return personagem
}

//funcao para testar se o personagem morreu (acabou o tempo de vida)
//true = tem vida, false = morto (personagem sera desabilitado)
//if (verificaVida == false), entao o personagem sera removido da selecao
export function verificaVida(personagem) {
    return personagem.vida_restante > 0
}

//funcao dormir, recupera energia conforme o tempo dormido
export function dormirPersonagem(personagem, tempo) {

    return new Promise((resolve) => {
        setTimeout(() => {

            if (tempo < 0) {
                tempo = 0
            }
            
            let ganho_energia = 0
            const calculo = Math.trunc(tempo/5000)
        
            if (calculo >= 1) {
                const energia_dormida = calculo * 4
                const energia_bonus = (calculo - 1) * 2
                ganho_energia = energia_dormida + energia_bonus
            }
        
            const nova_energia = personagem.energia + ganho_energia
            
            const novo_personagem = {
                ...personagem,
                vida_restante: personagem.vida_restante - tempo, //vida gasta dormindo
                energia: nova_energia > 32 ? 32 : nova_energia   //energia ganha por dormir
            }

            resolve(novo_personagem)
            
        }, tempo)
    })
}

//metodo de tempo em que sera executado por 8000ms
export function treinar(personagem, item) {
    const tempo_treino_padrao = 8000

    if (((personagem.higiene - 2) >= 0) && ((personagem.energia - 4) >= 0)) {

        return new Promise((resolve) => {
            setTimeout(() => {
    
                const pontos_ganhos = item.categoria === personagem.aspiracao ? item.pontos + 1 : item.pontos
    
                const habilidades_atualizadas = personagem.habilidades.map(habilidade => {
                    if(habilidade.habilidade === item.categoria) {
                        return {
                            ...habilidade, 
                            nivel: habilidade.nivel + pontos_ganhos
                        }
                    
                    } else {
                        return habilidade
                    }
                })
                const novo_personagem = {
                    ...personagem, 
                    higiene: personagem.higiene - 2, 
                    energia: personagem.energia - 4, 
                    vida_restante: personagem.vida_restante - tempo_treino_padrao,
                    habilidades: habilidades_atualizadas
                }
    
                resolve(novo_personagem)
                
            }, tempo_treino_padrao)
        })

    } else {
        console.log('Você não tem energia ou higiene suficiente!')
        return personagem
    }
}

//funcao de tomar banho, recupera toda higiene e desconta cresceleons
export function tomarBanho(personagem) {

    if (personagem.cresceleons >= 10) {

        const novo_personagem = {
            ...personagem,
            cresceleons: personagem.cresceleons - 10,
            higiene: 28
        }

        return novo_personagem

    } else {
        console.log('Você não tem cresceleons suficientes!')
        return personagem
    }    
}

//funcao para dois personagens interagirem, recebe os personagens e a interacao escolhida pelo jogador
export function interagirPersonagem(personagem_atual, personagem_para_interagir, interacao) {

    const tempo_gasto = interacao.energia * 2000
    const array_novos_personagens = []

    const posicao_relacionamento_atual = encontraRelacionamento(personagem_atual, personagem_para_interagir)
    const posicao_relacionamento_interagido = encontraRelacionamento(personagem_para_interagir, personagem_atual)

    const nova_energia_personagem_atual = personagem_atual.energia - interacao.energia
    const nova_energia_personagem_interagido = Math.ceil(personagem_para_interagir.energia - (interacao.energia/2))

    if ((nova_energia_personagem_atual >= 0) && (nova_energia_personagem_interagido >= 0)) {

        personagem_atual.relacionamentos[posicao_relacionamento_atual].nivel += interacao.pontos
        personagem_para_interagir.relacionamentos[posicao_relacionamento_interagido].nivel += interacao.pontos
    
        return new Promise((resolve) => {
            setTimeout(() => {
    
                const novo_personagem_atual = {
                    ...personagem_atual,
                    vida_restante: personagem_atual.vida_restante - tempo_gasto,
                    energia: nova_energia_personagem_atual
                }
    
                const novo_personagem_interagido = {
                    ...personagem_para_interagir,
                    vida_restante: personagem_para_interagir.vida_restante - tempo_gasto,
                    energia: nova_energia_personagem_interagido
                }

                array_novos_personagens.push(novo_personagem_atual)
                array_novos_personagens.push(novo_personagem_interagido)
    
                resolve(array_novos_personagens)
                
            }, tempo_gasto)
        })

    } else {
        console.log('Você não tem energia suficiente!')
        return personagem_atual
    }
}

//funcao para determinar a "interacao" entre personagens
//usada para saber o nivel de afinidade
export function nivelAfinidade(personagem_atual, personagem_para_interagir) {

    const posicao_relacionamento = encontraRelacionamento(personagem_atual, personagem_para_interagir)
    const nivel_interacao = personagem_atual.relacionamentos[posicao_relacionamento].nivel
    let nivel_afinidade

    switch(true) {
        case (nivel_interacao < 0):
            nivel_afinidade = 'INIMIZADE'
            break

        case (nivel_interacao >= 0 && nivel_interacao <= 10):
            nivel_afinidade = 'NEUTRO'
            break

        case (nivel_interacao >= 11 && nivel_interacao <= 25):
            nivel_afinidade = 'AMIZADE'
            break
                
        case (nivel_interacao > 25):
            nivel_afinidade = 'AMOR'
            break

        default:
            nivel_afinidade = 'NEUTRO'
    }

    return nivel_afinidade
}

//funcao encontra o relacionamento para entao saber em que indice do vetor "relacionamentos" se encontra o outro personagem
export function encontraRelacionamento(personagem1, personagem2) {

    let posicao_relacionamento = null

    for (let i = 0; i < personagem1.relacionamentos.length; i++) {
        if (personagem1.relacionamentos[i].id == personagem2.id) {
            posicao_relacionamento = i
            break
        }
    }

    if (posicao_relacionamento == null) {
        personagem1.relacionamentos.push({"id": personagem2.id, "nivel": 0})
        posicao_relacionamento = personagem1.relacionamentos.length-1
    }

    return posicao_relacionamento
}

//funcao para adicionar um cheat ao personagem dependendo do que foi digitado
//deve ser verificado a todo momento se o texto digitado em input nao foi um cheat
export function realizarCheat(personagem, cheat) {

    switch(cheat) {
        case 'SORTENAVIDA':
            personagem.emprego.salario.valor += personagem.emprego.salario.valor * 0.1
            break

        case 'DEITADONAREDE':
            personagem.energia += 5
            if (personagem.energia > 32) {
                personagem.energia = 32
            }
            break

        case 'JUNIM':
            for (let i = 0; i < 5; i++) {
                if (personagem.aspiracao == personagem.habilidades[i].habilidade) {
                    personagem.habilidades[i].nivel += 5
                    break
                }
            }
            break

        case 'CAROLINAS':
            personagem.vida_restante += 100000
            break

        case 'SINUSITE':
            personagem.vida_restante = 0
            break
    }

    return personagem
}

export function validarCompra(personagem, item) {

    if(personagem.cresceleons >= item.preco) {
    
        const novos_itens = {
            ...personagem.itens, 
            [item.categoria]: [...personagem.itens[item.categoria], item]
        }
    
        return {
            ...personagem,
            cresceleons: personagem.cresceleons - item.preco, 
            itens: novos_itens
        }

    } else {
        console.log("Você não tem cresceleons suficientes para comprar esse item, vai trabalhar!")
        return personagem
    }
}

export function novoEmprego(personagem, emprego) {

    const novo_emprego = {
        ...emprego,
        salario: emprego.salario[0],
        opcoes: [
            emprego.salario[1], emprego.salario[2]
        ]
    }

    const novo_personagem = {
        ...personagem,
        emprego: novo_emprego
    }

    return novo_personagem
}

export function trabalhar(personagem) {

    if (personagem.emprego == null) {
        console.log("Você está desempregado!")
        return personagem
    }

    const personagem_auxiliar = verificaCargo(personagem)
    
    if (personagem_auxiliar.energia >= 4) {
        
        const salario = personagem_auxiliar.emprego.salario.valor
        let energia_disponivel = personagem_auxiliar.energia
        let higiene_disponivel = personagem_auxiliar.higiene
        let count = 0
        let porcentagem_ganha = 1
        let salario_diario = 0
    
        //turnos
        while ((energia_disponivel > 2) && (count < 10) && (higiene_disponivel >= 0.4)) {
    
            if (energia_disponivel < 6) {
                porcentagem_ganha = 0.9
            }
    
            salario_diario += salario * porcentagem_ganha
            
            energia_disponivel--
            higiene_disponivel -= 0.4
            count++
        }

        if (higiene_disponivel < 4) {
            salario_diario = salario_diario * 0.9
        }
    
        const tempo_gasto = 2000 * count

        return new Promise((resolve) => {
            setTimeout(() => {
    
                const novo_personagem = {
                    ...personagem_auxiliar,
                    vida_restante: personagem_auxiliar.vida_restante - tempo_gasto,
                    cresceleons: personagem_auxiliar.cresceleons + salario_diario,
                    energia: energia_disponivel,
                    higiene: Math.round(higiene_disponivel)
                }
    
                resolve(novo_personagem)
                
            }, tempo_gasto)
        })

    } else {
        console.log("Você não tem energia suficiente para trabalhar!")
        return personagem_auxiliar
    }
}

//retorna o cargo que o personagem se encontra em determinada habilidade
export function nivelCargo(personagem, habilidade) {

    let nivel_habilidade

    for (let i = 0; i < 5; i++) {
        if (personagem.habilidades[i].habilidade == habilidade) {
            nivel_habilidade = personagem.habilidades[i].nivel
            break
        }
    }

    switch(true) {
        case (nivel_habilidade >= 0 && nivel_habilidade <= 16):
            return 'JUNIOR'

        case (nivel_habilidade > 16 && nivel_habilidade <= 26):
            return 'PLENO'

        case (nivel_habilidade > 26):
            return 'SENIOR'

        default:
            return 'JUNIOR'
    }
}

export function verificaCargo(personagem) {

    const categoria_emprego = personagem.emprego.categoria
    const nivel_emprego = nivelCargo(personagem, categoria_emprego)

    let emprego_merecido = personagem.emprego.salario
    let emprego_antigo = personagem.emprego.salario

    for (let i = 0; i < 2; i++) {
        if (personagem.emprego.opcoes[i].nivel == nivel_emprego) {
            emprego_merecido = personagem.emprego.opcoes[i]
            personagem.emprego.opcoes[i] = emprego_antigo
            break
        }
    }

    const emprego_atualizado = {
        ...personagem.emprego,
        salario: emprego_merecido
    }

    const novo_personagem = {
        ...personagem,
        emprego: emprego_atualizado
    }

    return novo_personagem
}
