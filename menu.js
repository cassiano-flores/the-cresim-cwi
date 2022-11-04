import { useQuestion } from './src/services/question/use-question'
import { useLocalStorage } from './src/services/local-storage/use-local-storage'
import { criarPersonagem, dormirPersonagem, treinar, novoEmprego, trabalhar, nivelCargo, tomarBanho, interagirPersonagem, nivelAfinidade, realizarCheat, validarCompra, verificaVida } from './src/funcoes/personagem'
import axios from 'axios'

export const menuMundo = async (mundo) => {
	console.clear()

	const selecao = await useQuestion(
		`=========== MENU DO MUNDO =============\n-------------------\n${mundo.nome}\n-------------------\n\n1. criar personagem\n2. selecionar personagem\n3. visitar cemitério\n\n0. encerrar sessão`)

	switch (selecao) {
		case '1':
			menuCriarPersonagem()
				.then(personagem => {
					const novo_mundo = {
						...mundo,
						personagens: [...mundo.personagens, personagem]
					}
					//assim que o novo personagem é adicionado a gente já salva o novo estado do mundo
					useLocalStorage().setObject('mundo', novo_mundo)
					return menuMundo(novo_mundo)
				})
			break
		case '2':
			// verificando se existem personagens disponíveis para listar
			if(mundo.personagens.length === 0 ){
				console.clear()
				setTimeout(() => {
					return menuMundo(mundo)
				}, 2000)
				console.log("Nenhum personagem disponível\n\nVoltando para o menu do mundo")
			} else {
				menuSelecionarPersonagem(mundo.personagens)
				.then(personagem => {
					//agora a gente faz a chamada do menuPersonagem
					menuPersonagem(personagem, mundo)
				})
			}
			
			break
		case '3': 
			menuListarPersonagensNoCemiterio(mundo)
			break
		case '0':
			break
		default:
			return menuMundo(mundo)
	}
}

const menuListarPersonagensNoCemiterio = async (mundo) => {
	console.clear()
	const personagensMortos = mundo.cemiterio.reduce((personagens, item) => {
		personagens +=  `☠️  ${item} \n`
		return personagens
	}, `========= CEMITÉRIO ==========\n\n`)

	const escolha = await useQuestion(personagensMortos + '\n0. voltar ao menu mundo')
	if(escolha == 0){
		menuMundo(mundo)
	} else {
		menuListarPersonagensNoCemiterio(mundo)
	}

}

export const menuPersonagem = async (personagem, mundo) => {
	console.clear()

	if(!verificaVida(personagem)){
		const personagens_vivos = mundo.personagens.filter(personagem_mundo => {
			return personagem.id !== personagem_mundo.id
		})

		const epitafio = await useQuestion(`${personagem.nome} morreu, informe o que deve ser escrito em seu túmulo: \n------------------------------------------------------------`)

		const mundo_atualizado = {
			...mundo, 
			personagens: personagens_vivos, 
			cemiterio: [...mundo.cemiterio, `${personagem.nome} - ${epitafio}`]
		}
		useLocalStorage().setObject('mundo', mundo_atualizado)
		menuMundo(mundo_atualizado)

	} else {

		const selecao = await useQuestion(
			`=========== MENU DO PERSONAGEM ============\n${personagem.nome}\n--------------------\nenergia: ${personagem.energia}\npontos de higiene: ${personagem.higiene}\ncresceleons: ${personagem.cresceleons}\ntempo de vida: ${personagem.vida_restante}\n\n1. trabalhar\n2. treinar\n3. interagir\n4. fazer compras\n5. dormir\n6. tomar banho\n\n0. voltar ao menu mundo`)
	
		switch (selecao) {
			case '1':
				//vai trabalhar! 
	
				//o retorno dessa função será um objeto que vamos buscar usando axios
				menuOpcoesDeTrabalho()
					.then(trabalho_selecionado => {
						//aqui a gente usa a função trabalhar que deve retornar um personagem
						const novo_personagem = novoEmprego(personagem, trabalho_selecionado)
						console.log(`${personagem.nome} está trabalhando`)
						trabalhar(novo_personagem).then(personagem_depois_do_trabalho => {
							const mundo_apos_trabalhar = atualizarPersonagensDoMundo(personagem_depois_do_trabalho, mundo)
							useLocalStorage().setObject('mundo', mundo_apos_trabalhar)
							return menuPersonagem(personagem_depois_do_trabalho, mundo_apos_trabalhar)
						})
					})
				break
			case '2':
				//vai treinar! 
	
				// essa função vai precisar da lista de itens que o personagem já comprou
				// o retorno dela é o item que o usuário escolheu pra treinar
				const objeto_para_treinar = await menuOpcoesDeTreino(personagem.itens)
	
				if(objeto_para_treinar){
	
					console.log(`\n${personagem.nome} está treinando`)
					const personagem_depois_do_treino = await treinar(personagem, objeto_para_treinar)
					const mundo_apos_treinar = atualizarPersonagensDoMundo(personagem_depois_do_treino, mundo)
	
					useLocalStorage().setObject('mundo', mundo_apos_treinar)
					return menuPersonagem(personagem_depois_do_treino, mundo_apos_treinar)
				} else {
	
					console.log('o personagem não selecionou ou não tem um item para treinar')
					return menuPersonagem(personagem,mundo)
				}
				
			case '3':
				//vai interagir seu anti-social! 
	
				//o retorno dela sera do personagem que foi selecionado para a interação
				const personagem_selecionado = await selecionarPersonagensParaInteragir(personagem, mundo.personagens).then(personagem_selecionado => personagem_selecionado)
				const afinidade = nivelAfinidade(personagem, personagem_selecionado) // está retornando undefined
				const interacao = await menuSelecionarInteracao(afinidade)
	
				interagirPersonagem(personagem, personagem_selecionado, interacao)
					.then(personagens => {
						const novo_mundo_um = atualizarPersonagensDoMundo(personagens[0], mundo)
						const novo_mundo_dois = atualizarPersonagensDoMundo(personagens[1], novo_mundo_um)
						useLocalStorage().setObject('mundo', novo_mundo_dois)
						return menuPersonagem(personagens[0], novo_mundo_dois)
					})
				
				break
			case '4':
				//vai fazer compras pra poder treinar cara! 
	
				//deve retornar o item que o usuario deseja comprar
				//precisamos bloquear caso não tenha dinheiro suficiente
				const item_selecionado = await menuLojaDeItens()
				const personagem_depois_das_compras = validarCompra(personagem, item_selecionado)
				const novo_mundo = await atualizarPersonagensDoMundo(personagem_depois_das_compras, mundo)
				useLocalStorage().setObject('mundo', novo_mundo)
				menuPersonagem(personagem_depois_das_compras, novo_mundo)
	
				break
			case '5':
				//vai dormir madruga!
	
				const tempo_de_sono = await useQuestion("==========================\nQuantos ciclos o personagem vai dormir?")
					.then(ciclo => ciclo * 5000)
	
				console.log(`\n${personagem.nome} está dormindo`)
				const personagem_descansado = await dormirPersonagem(personagem, tempo_de_sono)
				const mundo_novo = atualizarPersonagensDoMundo(personagem_descansado, mundo)
				useLocalStorage().setObject('mundo', mundo_novo)
				return menuPersonagem(personagem_descansado, mundo_novo)
	
			case '6':
				//vai tomar banho!
				const personagem_depois_do_banho = tomarBanho(personagem)
				const mundo_banho = await atualizarPersonagensDoMundo(personagem_depois_do_banho, mundo)
				useLocalStorage().setObject('mundo', mundo_banho)
				return menuPersonagem(personagem_depois_do_banho, mundo_banho)
			
			case '0':
				//volta para o menu mundo!
				menuMundo(mundo)
	
				break
			default:
				realizarCheat(personagem, selecao)
				const mundo_atualizado = atualizarPersonagensDoMundo(personagem, mundo)
				useLocalStorage().setObject('mundo', mundo_atualizado)
				menuPersonagem(personagem, mundo_atualizado)
				break
		}
	}
}

// menus de criação, modificação e seleção dos personagens
const atualizarPersonagensDoMundo = (personagem, mundo) => {
	const novos_personagens = mundo.personagens.map(personagem_antigo => {
		if (personagem_antigo.id === personagem.id) {
			return personagem
		} else {
			return personagem_antigo
		}
	})
	const novo_mundo = {
		...mundo,
		personagens: novos_personagens
	}

	return novo_mundo
}

export const menuSelecionarPersonagem = async (personagens) => {
	 
	//op é o número que representa aquela opção
	const opcoes = personagens.map((personagem, index) => {
		return {
			op: index + 1,
			nome: personagem.nome,
		}
	})

	//transforma as opções em uma string 
	const opcoes_to_string = opcoes.reduce((opcao, proxima) => {
		opcao += `${proxima.op}. ${proxima.nome}\n`
		return opcao
	}, `========================================\nSelecione o número correspondente ao personagem:\n\n`)

	let personagem_selecionado

	do {
		console.clear()
		personagem_selecionado = await useQuestion(opcoes_to_string)
	} while (personagem_selecionado > personagens.length || personagem_selecionado < 1)

	return {
		...personagens[personagem_selecionado - 1],
	}

	
}

export const menuCriarPersonagem = async () => {
	console.clear()
	const lista_aspiracoes = ['GASTRONOMIA', 'PINTURA', 'JOGOS', 'JARDINAGEM', 'MUSICA',]
	const nome = await useQuestion(
		`=============================\nInforme o nome do personagem: `)

	let menu_aspiracoes

	do {
		console.clear()
		menu_aspiracoes = await useQuestion(
			`==========================================================\nSelecione o número correspondente a aspiração de ${nome}:\n\n1. GASTRONOMIA\n2. PINTURA\n3. JOGOS\n4. JARDINAGEM\n5. MUSICA`)

	} while (menu_aspiracoes > 5 || menu_aspiracoes < 1)


	const aspiracao = lista_aspiracoes[menu_aspiracoes - 1]

	return criarPersonagem(nome, aspiracao)
}

/*
	SUB-MENUS DO PERSONAGEM 
*/

const menuOpcoesDeTrabalho = async () => {
	//aqui a gente faz uma requisição e guarda os objetos em uma lista 
	const trabalhos = await axios.get("https://emilyspecht.github.io/the-cresim/empregos.json")

	
	const titulo = (categoria) => {
		return `============= OPÇÕES DE ${categoria} ===============\n\n`
	}
	const modelo_string = (emprego) => {
		return `${emprego.id}. ${emprego.cargo} \n   Categoria: ${emprego.categoria}\n-------------------------------------\n`
	}

	return menuSelecionarItens(trabalhos.data, "TRABALHO", titulo, modelo_string)
}

const menuOpcoesDeTreino = async (itens) => {
	console.clear()
	//tenho uma função que transforma uma lista de objetos para string no formato de menu
	const itens_por_categoria = `============ CATEGORIAS DE ITEM ===========\n\n1. GASTRONOMIA\n   itens: ${itens["GASTRONOMIA"].length}\n-------------------------------\n2. PINTURA\n   itens: ${itens["PINTURA"].length}\n-------------------------------\n3. JOGOS\n   itens: ${itens["JOGOS"].length}\n-------------------------------\n4. JARDINAGEM\n   itens: ${itens["JARDINAGEM"].length}\n-------------------------------\n5. MUSICA\n   itens: ${itens["MUSICA"].length}\n-------------------------------\n`
	
	let categoria_selecionada
	
	do {
		categoria_selecionada = await useQuestion(itens_por_categoria)
	} while (categoria_selecionada < 1 || categoria_selecionada > 5)


	let categoria

	switch(categoria_selecionada) {
		case '1': 
			categoria = "GASTRONOMIA"
			break
		case '2': 
			categoria = "PINTURA"
			break
		case '3': 
			categoria = "JOGOS"
			break
		case '4': 
			categoria = "JARDINAGEM"
			break
		case '5': 
			categoria = "MUSICA"
			break
		default: 
			return menuOpcoesDeTreino()
	}

	const titulo = (afinidade) => {
		return `============= ITENS DE ${afinidade} ===============\n\n`
	}
	const modelo_string = (item) => {
		return `${item.id}. ${item.nome} \n   Pontos: ${item.pontos}\n-------------------------------------\n`
	}

	if(itens[categoria].length === 0){
		return null
	} else {
		return menuSelecionarItens(itens[categoria], categoria, titulo, modelo_string)
	}
}

const selecionarPersonagensParaInteragir = async (personagem, personagens_do_mundo) => {

	// todos os personagens do mundo, menos o que iniciou a ação de interagir
	const personagens_para_interagir = personagens_do_mundo.filter(perso => {
		return perso.id !== personagem.id
	})

	const personagem_selecionado = menuSelecionarPersonagem(personagens_para_interagir)


	return personagem_selecionado
}

const menuSelecionarInteracao = async (afinidade) => {
	const tipos = await axios.get('https://emilyspecht.github.io/the-cresim/interacoes.json')

	const lista_de_interacoes = [
		{"descricao": "NEUTRO", "interacoes": tipos.data['NEUTRO']}, 
	]

	switch(afinidade){
		case 'INIMIZADE':
			lista_de_interacoes.push({"descricao": "INIMIZADE", "interacoes": tipos.data['INIMIZADE']})
			break
		case 'NEUTRO': 
			break
		case 'AMIZADE':
			lista_de_interacoes.push({"descricao": "AMIZADE", "interacoes": tipos.data['AMIZADE']}) 
			break
		case 'AMOR': 
			lista_de_interacoes.push({"descricao": "AMIZADE", "interacoes": tipos.data['AMIZADE']}) 
			lista_de_interacoes.push({"descricao": "AMOR", "interacoes": tipos.data['AMOR']}) 
			break
	}
	
	return selecionarTipoDeInteracao(lista_de_interacoes)
}

const selecionarTipoDeInteracao = async (interacoes_disponiveis) => {

	const descricao_interacao_e_index = interacoes_disponiveis.map((interacao, index) => {
		return {"index": index, "descricao": interacao.descricao}
	})

	const tipos_de_interacao_to_string = descricao_interacao_e_index.reduce((opcoes, tipo_de_interacao) => {
		opcoes += `${tipo_de_interacao.index + 1}. ${tipo_de_interacao.descricao}\n`
		return opcoes
	}, `=============== TIPOS DE INTERAÇÃO ==================\n\n`)

	// pegando os itens que precisaremos para fazer a interação
	let tipo_interacao_escolhida
	
	do{
		console.clear()
		tipo_interacao_escolhida = await useQuestion(tipos_de_interacao_to_string).then(resposta => resposta - 1)
	} while (tipo_interacao_escolhida < 0 || tipo_interacao_escolhida > interacoes_disponiveis.length - 1)

	tipo_interacao_escolhida = descricao_interacao_e_index[tipo_interacao_escolhida]

	const interacoes_escolhidas = interacoes_disponiveis.find(interacoes => {
		return interacoes.descricao === tipo_interacao_escolhida.descricao
	})

	// preparando tudo para usar a função menuSelecionarItens

	const descricao_da_interacao = interacoes_escolhidas.descricao

	const titulo = (descricao_da_interacao) => {
		return `============ INTERAÇÕES DE ${descricao_da_interacao} ============\n\n`
	}

	const modelo_string = (interacoes_escolhidas) => {
		return `${interacoes_escolhidas.id}. ${interacoes_escolhidas.interacao}\n`
	}
	
	return menuSelecionarItens(interacoes_escolhidas.interacoes, descricao_da_interacao, titulo, modelo_string)
}


/*
	FUNÇÕES PARA O MENU DA LOJA
*/

const menuLojaDeItens = async () => {
	console.clear()
	//aqui a gente faz uma requisição e guarda os objetos em uma lista 
	//tenho uma função que transforma uma lista de objetos para string no formato de menu
	const itens = await axios.get('https://emilyspecht.github.io/the-cresim/itens-habilidades.json')
	
	const categorias_de_item = await useQuestion(
		`=============== CATEGORIAS DE ITEM ==================\n\n1. gastronomia\n2. pintura\n3. jogos\n4. jardinagem\n5. musica`)


	let escolha

	switch(categorias_de_item){
		case '1': 
			escolha = "GASTRONOMIA"
			break
		case '2': 
			escolha = "PINTURA"
			break
		case '3': 
			escolha = "JOGOS"
			break
		case '4': 
			escolha = "JARDINAGEM"
			break
		case '5': 
			escolha = "MUSICA"
			break
		default: 
			return menuLojaDeItens()
	}

	const titulo = (categoria) => {
		return `============= ITENS DE ${categoria} ===============\n\n`
	}
	const modelo_string = (item) => {
		return `${item.id}. ${item.nome} \n   Pontos: ${item.pontos}\n   Preço: ${item.preco}\n-------------------------------------\n`
	}

	return menuSelecionarItens(itens.data[escolha], escolha, titulo, modelo_string)
}

/*
	FUNÇÃO QUE PERMITE LISTAR E SELECIONAR UM ITEM A PARTIR DAS REQUISIÇÕES FEITAS COM O AXIOS
*/
const menuSelecionarItens = async (itens, categoria, titulo, modelo_string) => {

	// recebe um array, e baseado em um modelo que é passado como parametro reduz o array para o formato de string, para fazer o menu de determinado array
	const itens_to_string = itens.reduce((lista, item) => {
		lista += modelo_string(item) 
		return lista
	}, titulo(categoria))

	let opcao

	do {
		console.clear()
		opcao = await useQuestion(itens_to_string)
	} while(opcao < 1 || opcao > itens.length)

	const item_selecionado = itens.find(item => {
		return item.id == opcao
	})
	
	return {
		...item_selecionado, 
		categoria: categoria
	}

}
