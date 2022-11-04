import { useQuestion } from './src/services/question/use-question'
import { useLocalStorage } from './src/services/local-storage/use-local-storage'
import { menuMundo } from './menu.js'

const main = async () => {

	const localStorage = useLocalStorage()

	const iniciar = async () => {
		const mundo_procurado = localStorage.getObject('mundo')

		if (mundo_procurado) {
			menuMundo(mundo_procurado)

		} else {
			console.clear()
			const nome_mundo = await useQuestion('Informe o nome do seu novo mundo:')
			const novo_mundo = { nome: nome_mundo, personagens: [], cemiterio: []}
			localStorage.setObject('mundo', novo_mundo)
			menuMundo(novo_mundo)
		}
	}

	iniciar()

}

main()
