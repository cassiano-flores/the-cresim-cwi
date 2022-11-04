import axios from 'axios'

import { criarPersonagem, dormirPersonagem, treinar, nivelCargo, tomarBanho, interagirPersonagem,
         nivelAfinidade, realizarCheat, validarCompra, trabalhar, 
         novoEmprego, verificaVida, verificaCargo } from '../src/funcoes/personagem'

jest.setTimeout(2000000)  //aumentar o tempo de esperada maximo aceito pelo jest

let itens_json
let interacoes_json
let empregos_json

beforeAll(async () => {
  itens_json = (await axios.get('https://emilyspecht.github.io/the-cresim/itens-habilidades.json')).data
  interacoes_json = (await axios.get('https://emilyspecht.github.io/the-cresim/interacoes.json')).data
  empregos_json = (await axios.get('https://emilyspecht.github.io/the-cresim/empregos.json')).data
})


describe('Suite de criação de personagem', () => {

  it('Deve conseguir criar um novo Cresim com nome, pontos de higiene e energia carregados e 1500 Cresceleons',() =>  {
    
    const nome_esperado = 'Joao'
    const higiene_esperada = 28
    const energia_esperada = 32
    const cresceleons_esperado = 1500

    const personagem = criarPersonagem('Joao', 'GASTRONOMIA')
    const nome_obtido = personagem.nome
    const higiene_obtida = personagem.higiene
    const energia_obtida = personagem.energia
    const cresceleons_obtido = personagem.cresceleons

    expect(nome_obtido).toBe(nome_esperado)
    expect(higiene_obtida).toBe(higiene_esperada)
    expect(energia_obtida).toBe(energia_esperada)
    expect(cresceleons_obtido).toBe(cresceleons_esperado)
  })

  it('Deve conseguir atribuir uma aspiração ao Cresim',() =>  {
    
    const aspiracao_esperada = 'GASTRONOMIA'

    const personagem = criarPersonagem('Joao', 'GASTRONOMIA')
    const aspiracao_obtida = personagem.aspiracao

    expect(aspiracao_obtida).toBe(aspiracao_esperada)
  })
})

describe('Suite de validação', () => {

  it('Deve validar os pontos de energia do personagem para que não passem de 32 pontos', async () =>  {
      
    const energia_esperada = 32
    const personagem = criarPersonagem('Joao', 'GASTRONOMIA')

    const novo_personagem = await dormirPersonagem(personagem, 5000)
    const energia_obtida = novo_personagem.energia

    expect(energia_obtida).toBe(energia_esperada)
  })

  it('Deve validar os pontos de energia do personagem para que não fiquem negativados', async () =>  {
      
    const energia_esperada = 0
    const personagem = criarPersonagem('Joao', 'GASTRONOMIA')
    personagem.energia = 0

    const aux = itens_json.GASTRONOMIA[0]
    const item = {
      ...aux,
      categoria: 'GASTRONOMIA'
    }

    const novo_personagem = await treinar(personagem, item)
    const energia_obtida = novo_personagem.energia

    expect(energia_obtida).toBe(energia_esperada)
  })
})

describe('Suite de testes função dormir', () => {

  it('Deve conseguir dormir e receber seus pontos de energia', async () =>  {

      const energia_esperada = 30
      const personagem = criarPersonagem('Joao', 'GASTRONOMIA')
      personagem.energia = 14

      const novo_personagem = await dormirPersonagem(personagem, 15000)
      const energia_obtida = novo_personagem.energia

      expect(energia_obtida).toBe(energia_esperada)
  })
})

describe('Suite de testes função comprar', () => {
  
  it('Deve conseguir comprar um item de habilidade', async () =>  {

    const personagem = criarPersonagem('Joao', 'GASTRONOMIA')

    const aux = itens_json.PINTURA[0]
    const item_esperado = {
      ...aux,
      categoria: 'PINTURA'
    }

    const novo_personagem = await validarCompra(personagem, item_esperado)
    const item_obtido = novo_personagem.itens.PINTURA[0]

    expect(item_obtido).toBe(item_esperado)
  })
  
  it('Deve validar ao tentar comprar um item de habilidade sem Cresceleons suficientes', async () =>  {
  
    const personagem = criarPersonagem('Joao', 'GASTRONOMIA')

    const aux = itens_json.GASTRONOMIA[0]
    const item = {
      ...aux,
      categoria: 'GASTRONOMIA'
    }

    const novo_personagem = await validarCompra(personagem, item)  //tenta comprar

    expect(novo_personagem).toStrictEqual(personagem)  //nao tem cresceleons, "itens" permanece igual
  })
})

describe('Suite de testes função treinar', () => {

  it('Deve conseguir concluir um ciclo de treino com habilidade que não é aspiração e receber os pontos corretamente', async () =>  {
  
    const level_esperado = 3
    const personagem = criarPersonagem('Joao', 'GASTRONOMIA')

    const aux = itens_json.GASTRONOMIA[0]
    const item = {
      ...aux,
      categoria: 'PINTURA'
    }
  
    const novo_personagem = await treinar(personagem, item)
    const level_obtido = novo_personagem.habilidades[1].nivel
  
    expect(level_obtido).toBe(level_esperado)
  })
  
  it('Deve conseguir concluir um ciclo de treino com habilidade que é sua aspiração e receber os pontos corretamente', async () =>  {
  
    const level_esperado = 4
    const personagem = criarPersonagem('Joao', 'GASTRONOMIA')

    const aux = itens_json.GASTRONOMIA[0]
    const item = {
      ...aux,
      categoria: 'GASTRONOMIA'
    }
  
    const novo_personagem = await treinar(personagem, item)
    const level_obtido = novo_personagem.habilidades[0].nivel
  
    expect(level_obtido).toBe(level_esperado)
  })

  it('Deve perder pontos de energia ao terminar um ciclo de treino', async () => {

    const energia_esperada = 28
    const personagem = criarPersonagem('Joao', 'GASTRONOMIA')

    const aux = itens_json.GASTRONOMIA[0]
    const item = {
      ...aux,
      categoria: 'GASTRONOMIA'
    }

    const novo_personagem = await treinar(personagem, item)
    const energia_obtida = novo_personagem.energia

    expect(energia_obtida).toBe(energia_esperada)
  })

  it('Deve perder pontos de higiene ao terminar um ciclo de treino', async () => {

    const higiene_esperada = 26
    const personagem = criarPersonagem('Joao', 'GASTRONOMIA')

    const aux = itens_json.GASTRONOMIA[0]
    const item = {
      ...aux,
      categoria: 'GASTRONOMIA'
    }

    const novo_personagem = await treinar(personagem, item)
    const higiene_obtida = novo_personagem.higiene

    expect(higiene_obtida).toBe(higiene_esperada)
  })
})

describe('Suite de testes função nivel de habilidade', () => {

  it('Deve avançar o nivel de habilidade quando completar os pontos necessarios', async () => {

    const personagem = criarPersonagem('Joao', 'MUSICA')
    personagem.cresceleons += 30000

    const aux = itens_json.MUSICA[2]
    const item = {
      ...aux,
      categoria: 'MUSICA'
    }

    const nivel_esperado = 'PLENO'

    const p1 = await treinar(personagem, item)
    const novo_personagem = await treinar(p1, item)

    const nivel_obtido = nivelCargo(novo_personagem, 'MUSICA')

    expect(nivel_obtido).toBe(nivel_esperado)
  })
})

describe('Suite de testes função tomar banho', () => {

  it('Deve descontar 10 Cresceleons ao tomar banho', async () => {

    const personagem = criarPersonagem('Joao', 'MUSICA')
    const cresceleons_esperado = 1490

    const novo_personagem = await tomarBanho(personagem)
    const cresceleons_obtido = novo_personagem.cresceleons

    expect(cresceleons_obtido).toBe(cresceleons_esperado)
  })
})

describe('Suite de testes função interagir personagens', () => {

  it('Deve evoluir o relacionamento de dois Cresims para AMIZADE', async () => {

    const personagem1 = criarPersonagem('Joao', 'MUSICA')
    const personagem2 = criarPersonagem('Jose', 'GASTRONOMIA')

    const relacionamento_esperado = 'AMIZADE'

    const p1 = await interagirPersonagem(personagem1, personagem2, interacoes_json.NEUTRO[2])
    const p2 = await interagirPersonagem(p1[0], p1[1], interacoes_json.NEUTRO[2])
    const personagens_interacao = await interagirPersonagem(p2[0], p2[1], interacoes_json.NEUTRO[2])

    const relacionamento_obtido = nivelAfinidade(personagens_interacao[0], personagens_interacao[1])

    expect(relacionamento_obtido).toBe(relacionamento_esperado)
  })

  it('Deve recuar o relacionamento de dois Cresims para INIMIZADE', async () => {

    const personagem1 = criarPersonagem('Joao', 'MUSICA')
    const personagem2 = criarPersonagem('Jose', 'GASTRONOMIA')

    const relacionamento_esperado = 'INIMIZADE'

    const personagens_interacao = await interagirPersonagem(personagem1, personagem2, interacoes_json.NEUTRO[5])

    const relacionamento_obtido = nivelAfinidade(personagens_interacao[0], personagens_interacao[1])

    expect(relacionamento_obtido).toBe(relacionamento_esperado)
  })

  it('Deve descontar os pontos de energia em uma interação entre dois Cresims', async () => {

    const personagem1 = criarPersonagem('Joao', 'MUSICA')
    const personagem2 = criarPersonagem('Jose', 'GASTRONOMIA')

    const energia_esperada = 30

    const personagens_interacao = await interagirPersonagem(personagem1, personagem2, interacoes_json.NEUTRO[6])

    const energia_obtida = personagens_interacao[0].energia

    expect(energia_obtida).toBe(energia_esperada)
  })
})

describe('Suite de testes função cheat', () => {

  it('Deve conseguir aplicar o cheat SORTENAVIDA e receber as recompensas', async () => {

    const personagem = criarPersonagem('Joao', 'MUSICA')
    const emprego = {
      ...empregos_json[0],
      salario: { "nivel": 'JUNIOR', "valor": 160 }
    }

    personagem.emprego = emprego
    const recompensa_esperada = 176

    const novo_personagem = await realizarCheat(personagem, 'SORTENAVIDA')
    const recompensa_obtida = novo_personagem.emprego.salario.valor

    expect(recompensa_obtida).toBe(recompensa_esperada)
  })

  it('Deve conseguir aplicar o cheat DEITADONAREDE e receber as recompensas', async () => {

    const personagem = criarPersonagem('Joao', 'MUSICA')
    personagem.energia = 3

    const recompensa_esperada = 8

    const novo_personagem = await realizarCheat(personagem, 'DEITADONAREDE')
    const recompensa_obtida = novo_personagem.energia

    expect(recompensa_obtida).toBe(recompensa_esperada)
  })

  it('Deve conseguir aplicar o cheat JUNIM e receber as recompensas para a habilidade escolhida', async () => {

    const personagem = criarPersonagem('Joao', 'MUSICA')
    const recompensa_esperada = 5

    const novo_personagem = await realizarCheat(personagem, 'JUNIM')
    const recompensa_obtida = novo_personagem.habilidades[4].nivel

    expect(recompensa_obtida).toBe(recompensa_esperada)
  })

  it('Deve conseguir aplicar o cheat CAROLINAS e receber as recompensas', async () => {

    const personagem = criarPersonagem('Joao', 'MUSICA')
    const recompensa_esperada = 3700000

    const novo_personagem = await realizarCheat(personagem, 'CAROLINAS')
    const recompensa_obtida = novo_personagem.vida_restante

    expect(recompensa_obtida).toBe(recompensa_esperada)
  })

  it('Deve conseguir aplicar o cheat SINUSITE ter a vida zerada', async () => {

    const personagem = criarPersonagem('Joao', 'MUSICA')
    const recompensa_esperada = 0

    const novo_personagem = await realizarCheat(personagem, 'SINUSITE')
    const recompensa_obtida = novo_personagem.vida_restante

    expect(recompensa_obtida).toBe(recompensa_esperada)
  })
})

describe('Suite de testes função trabalhar', () => {

  it('Deve perder os pontos de energia ao trabalhar uma jornada padrão ', async () => {
    
    const energia_esperada = 22
    const p1 = criarPersonagem('Joao', 'GASTRONOMIA')
    const personagem = novoEmprego(p1, empregos_json[0])
  
    const novo_personagem = await trabalhar(personagem)
    const energia_obtida = novo_personagem.energia
  
    expect(energia_obtida).toBe(energia_esperada)
  })
  
  it('Deve receber o salario do dia ao trabalhar uma jornada padrão', async () => {
  
    const cresceleons_esperado = 3100
    const p1 = criarPersonagem('Joao', 'GASTRONOMIA')
    const personagem = novoEmprego(p1, empregos_json[0])
  
    const novo_personagem = await trabalhar(personagem)
    const cresceleons_obtido = novo_personagem.cresceleons
  
    expect(cresceleons_obtido).toBe(cresceleons_esperado)
  })
  
  it('Deve receber o salario equivalente quando começar a trabalhar com os pontos de energia menores que 10', async () => {
  
    const cresceleons_esperado = 2572
    const p1 = criarPersonagem('Joao', 'GASTRONOMIA')
    const personagem = novoEmprego(p1, empregos_json[0])
    personagem.energia = 9
  
    const novo_personagem = await trabalhar(personagem)
    const cresceleons_obtido = novo_personagem.cresceleons
  
    expect(cresceleons_obtido).toBe(cresceleons_esperado)
  })
  
  it('Deve receber o salario equivalente quando começar a trabalhar com os pontos de energia menores que 10 e pontos de higiene menores que 4', async () => {
  
    const cresceleons_esperado = 2320.8
    const p1 = criarPersonagem('Joao', 'GASTRONOMIA')
    const personagem = novoEmprego(p1, empregos_json[0])
    personagem.energia = 8
    personagem.higiene = 3
  
    const novo_personagem = await trabalhar(personagem)
    const cresceleons_obtido = novo_personagem.cresceleons
  
    expect(cresceleons_obtido).toBe(cresceleons_esperado)
  })

  it('Deve validar para que o Cresim não consiga começar a trabalhar com os pontos de energia menores que 4', async () => {

    const p1 = criarPersonagem('Joao', 'GASTRONOMIA')
    const personagem = novoEmprego(p1, empregos_json[0])
    personagem.energia = 3
  
    const novo_personagem = await trabalhar(personagem)
  
    expect(novo_personagem).toStrictEqual(personagem)
  })
})

describe('Suite de testes gerais', () => {

  it('Deve retornar true se personagem vivo', () => {

    const personagem = criarPersonagem('Joao', 'GASTRONOMIA')
    const condicao = verificaVida(personagem)

    expect(condicao).toBeTruthy()
  })

  it('Deve retornar false se personagem morto', () => {

    const personagem = criarPersonagem('Joao', 'GASTRONOMIA')
    personagem.vida_restante = 0
    const condicao = verificaVida(personagem)

    expect(condicao).toBeFalsy()
  })

  it('Deve retornar o mesmo personagem quando tempo de dormir for negativo', async () => {

    const personagem = criarPersonagem('Joao', 'GASTRONOMIA')
    const novo_personagem = await dormirPersonagem(personagem, -1)

    expect(novo_personagem).toStrictEqual(personagem)
  })

  it('Deve retornar o mesmo personagem quando não tiver cresceleons suficiente', async () => {

    const personagem = criarPersonagem('Joao', 'GASTRONOMIA')
    personagem.cresceleons = 9
    const novo_personagem = await tomarBanho(personagem)

    expect(novo_personagem).toStrictEqual(personagem)
  })

  it('Deve retornar o mesmo personagem quando não tiver energia suficiente', async () => {

    const personagem = criarPersonagem('Joao', 'GASTRONOMIA')
    const personagem2 = criarPersonagem('Jose', 'GASTRONOMIA')
    personagem.energia = 0
    const novo_personagem = await interagirPersonagem(personagem, personagem2, interacoes_json.NEUTRO[2])

    expect(novo_personagem).toStrictEqual(personagem)
  })

  it('Deve retornar nivel de amizade NEUTRO', async () => {

    const personagem = criarPersonagem('Joao', 'GASTRONOMIA')
    const personagem2 = criarPersonagem('Jose', 'GASTRONOMIA')

    personagem.relacionamentos[0] = { id: personagem2.id, nivel: 4 }
    personagem2.relacionamentos[0] = { id: personagem.id, nivel: 4 }

    const nivel_esperado = 'NEUTRO'
    const nivel_obtido = nivelAfinidade(personagem, personagem2)

    expect(nivel_obtido).toBe(nivel_esperado)
  })

  it('Deve retornar nivel de amizade AMOR', async () => {

    const personagem = criarPersonagem('Joao', 'GASTRONOMIA')
    const personagem2 = criarPersonagem('Jose', 'GASTRONOMIA')

    personagem.relacionamentos[0] = { id: personagem2.id, nivel: 30 }
    personagem2.relacionamentos[0] = { id: personagem.id, nivel: 30 }

    const nivel_esperado = 'AMOR'
    const nivel_obtido = nivelAfinidade(personagem, personagem2)

    expect(nivel_obtido).toBe(nivel_esperado)
  })

  it('Deve permanecer energia 32 se cheat for passar do limite', async () => {

    const personagem = criarPersonagem('Joao', 'GASTRONOMIA')
    await realizarCheat(personagem, 'DEITADONAREDE')

    const energia_esperada = 32
    const energia_obtida = personagem.energia

    expect(energia_obtida).toBe(energia_esperada)
  })

  it('Deve retornar o mesmo personagem quando tentar trabalhar sem emprego', async () => {

    const personagem = criarPersonagem('Joao', 'GASTRONOMIA')
    const novo_personagem = await trabalhar(personagem)

    expect(novo_personagem).toStrictEqual(personagem)
  })

  it('Deve retornar SENIOR quando o nivel de habilidade for maior que 26', () => {

    const personagem = criarPersonagem('Joao', 'GASTRONOMIA')
    personagem.habilidades[0].nivel = 30

    const nivel_esperado = 'SENIOR'
    const nivel_obtido = nivelCargo(personagem, 'GASTRONOMIA')

    expect(nivel_obtido).toBe(nivel_esperado)
  })

  it('Deve atualizar o trabalho quando subir de nivel na habilidade', async () => {

    const personagem = criarPersonagem('Joao', 'GASTRONOMIA')
    const p1 = await novoEmprego(personagem, empregos_json[0])

    personagem.habilidades[2].nivel = 30

    const novo_personagem = await verificaCargo(p1)

    const emprego_esperado = {"nivel": "SENIOR", "valor": 340}
    const emprego_obtido = novo_personagem.emprego.salario

    expect(emprego_obtido).toStrictEqual(emprego_esperado)
  })
})
