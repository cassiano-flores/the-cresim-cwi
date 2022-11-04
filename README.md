# The Cresims

[NOTION](https://pouncing-paddleboat-749.notion.site/The-Cresims-9261c42c1b00420783bc90cf49ffb7c4)

### REQUISITO 01 - REGRAS GERAIS

- Ao criar um personagem, o jogador deverá criar um nome para o Cresim;
- O jogador pode criar quantos personagens quiser;
- O Cresim terá 60 “dias” de vida (3.600.000ms ou 1 hora);
    - O jogo termina quando o tempo de vida do personagem acaba.
- O dia de um Cresim tem 60.000ms (1 minuto);
- O Cresim começará com 1.500 Cresceleons (moeda do jogo);
- O jogador poderá escolher uma aspiração ao iniciar o jogo (poderá ser uma das 5 habilidades disponíveis: GASTRONOMIA, PINTURA, JOGOS, JARDINAGEM OU MUSICA);
- Quando o Cresim estiver ocupado com alguma tarefa (dormindo, treinando, trabalhando…) o jogador não poderá jogar com esse personagem);
- O Cresim deve iniciar com 28 pontos de higiene.

### REQUISITO 02 - ENERGIA

- O Cresim tem 32 pontos de energia máximos e iniciará o jogo com a carga completa;
- O Cresim ganha 4 pontos de energia a cada 5.000ms dormidos, e ganha 2 pontos bônus a cada 5.000ms a mais que dormir direto, ou seja, se dormir 10.000ms, ganha 8 pontos + 2;
- O Cresim não deve ficar com os pontos de energia negativados, e nem passar dos pontos máximos de energia (32 pontos)

### REQUISITO 03 - HABILIDADES E ASPIRAÇÕES

- O Cresim pode evoluir as habilidades de gastronomia, pintura, jogos, jardinagem e musica;
- Para isso, ele deve comprar itens que vão permiti-lo praticar e acrescentar pontos de habilidade;
    
    [ITENS DE HABILIDADE](https://pouncing-paddleboat-749.notion.site/ITENS-DE-HABILIDADE-e53fd35cd124496f888303b73f499a3a)
    
    Link para requisição: [https://emilyspecht.github.io/the-cresim/itens-habilidades.json](https://emilyspecht.github.io/the-cresim/itens-habilidades.json)
    
- Cada ciclo de treino dura 8.000ms. Quando completo, ele ganha os pontos de habilidade do item que ele utilizou;
- Caso a habilidade que o Cresim esteja exercitando seja sua aspiração, ele poderá acrescentar +1 ponto de habilidade a cada ciclo de treino;
- Em um ciclo de treino, o Cresim perde 4 pontos de energia;
- Na medida em que vai evoluindo nas habilidades, o nível de habilidade e salário vão aumentando;
- Cada habilidade tem 3 níveis: JUNIOR, PLENO E SÊNIOR:
    - O Cresim iniciará no nível JUNIOR, com 0 pontos de habilidade;
    - Cada nível tem uma quantidade de pontos de habilidade para alcançar. Quando o Cresim alcança os pontos de habilidade requeridos, ele passa para o próximo nível.
    
    🍼 **JUNIOR**
    
    0 - 16 pontos
    
    🔥 **PLENO**
    
    17 - 26 pontos
    
    👑 **SENIOR**
    
    maior que 27 pontos
    

### REQUISITO 04 - TRABALHO

[EMPREGOS](https://pouncing-paddleboat-749.notion.site/EMPREGOS-b37df020cad94ce7b015e7e21093db7b)

Link para requisição: [https://emilyspecht.github.io/the-cresim/empregos.json](https://emilyspecht.github.io/the-cresim/empregos.json)

- A jornada de trabalho padrão de um Cresim é de 20.000 ms;
- O Cresim deve perder 10 pontos de energia na jornada de trabalho padrão;
- Se um Cresim começar a trabalhar com menos de 10 pontos de energia, ele deve ganhar -10% Cresceleons a cada ponto de energia menor que 5;
- O Cresim só pode trabalhar até 2 pontos de energia, ou seja, a jornada de trabalho deve ser recalculada, juntamente ao salário, e ele deve parar antes e receber equivalente;
    
    <aside>
    💡 Supondo que o Cresim esteja com 10 pontos de energia e ganhe 160 Cresceleons por dia de trabalho:
    
    cargaDeTrabalho / pontosDeEnergiaAtuais = msParaCadaPontoDeEnergia  
    $20.000 / 10 = 2.000ms$  
    Cada ponto de energia sao 2.000ms de trabalho  
    
    pontosDeEnergiaAtuais - pontosDeEnergiaMinimo = pontosDeEnergiaParaGastar * msParaCadaPontoDeEnergia = maximoDeTempoParaTrabalhar  
    $10 - 2 = 8 * 2.000 = 16.000ms$  
    O Cresim vai poder trabalhar até 16.000ms  
    
    cargaDeTrabalho / salarioDiario = tempoEmMsParaCadaCresceleon  
    $20.000 / 160 = 125ms$  
    A cada 125ms o Cresim ganha 1 Cresceleon  
    
    msParaCadaPontoDeEnergia / tempoEmMsParaCadaCresceleon = cresceleonParaCadaPontoDeEnergia  
    $2.000ms / 125ms = 16 cresceleons$  
    A cada 2.000ms o Cresim ganha 16 Cresceleons  
    
    pontosDeEnergiaParaDesconto - pontosDeEnergiaMinimo = pontosDeEnergiaParaRecalculo  
    $5 - 2 = 3$  
    3 pontos de energia servirão para o recálculo (desconto de 10%) do salário do Cresim  
    
    pontosDeEnergiaParaRecalculo * (cresceleonParaCadaPontoDeEnergia - porcentagemDeDesconto) = recalculoSalarioCresimCansado  
    $3 * (16 - 10porcento) = 43,2$  
    O Cresim receberá 43,2 Cresceleons referente ao tempo em que trabalhou cansado  
    
    pontosDeEnergiaAtuais - pontosDeEnergiaParaDesconto = pontosDeEnergiaCresimDescansado  
    $10 - 5 = 5$  
    O Cresim ainda tem 5 pontos de energia descansado para trabalhar  
    
    pontosDeEnergiaCresimDescansado * cresceleonParaCadaPontoDeEnergia = salarioCresimDescansado  
    $5 * 16 = 80 cresceleons$   
    O Cresim receberá 80 Cresceleons referente ao tempo em que trabalhou descansado  
    
    recalculoSalarioCresimCansado + salarioCresimDescansado = salarioTotal  
    $43,2 + 80 = 123,2$  
    O Cresim receberá 123,2 Cresceleons recalculados ao fim de um turno de trabalho  
    
    </aside>
    
- O Cresim não deve conseguir COMEÇAR a trabalhar com os pontos de energia menores que 4;

### REQUISITO 05 - RELACIONAMENTOS

[INTERAÇÕES](https://pouncing-paddleboat-749.notion.site/INTERA-ES-99852c862c3e421693e208d8f0a4b88d)

Link para requisição: [https://emilyspecht.github.io/the-cresim/interacoes.json](https://emilyspecht.github.io/the-cresim/interacoes.json)

- Um Cresim pode se comunicar com outro;
- Ao comunicar-se, o relacionamento dos Cresims vai evoluindo de acordo com os pontos de cada tipo de interação;
- Cada nível de relacionamento desbloqueia novas interações para os Cresims;
- Os níveis de relacionamento consistem em:

 💔 INIMIZADE 

< 0 pontos

 🌱 NEUTRO 

0 - 10 pontos

 🍻 AMIZADE 

11 - 25 pontos

 ❤️‍🔥 AMOR 

maior que 25 pontos

- O Cresim vai iniciar com apenas as interações NEUTRAS disponíveis, e de acordo de como ele ir  evoluindo, outras categorias de interações vão liberando, assim surgindo mais opções para que os Cresims interajam;
    - Se o Cresim evoluir do NEUTRO para AMIZADE, então ele terá as interações de NEUTRO e AMIZADE; se ele evoluir para amor, então ele terá as categorias NEUTRO, AMIZADE E AMOR; se ele evoluir para INIMIZADE, então ele terá NEUTRO e INIMIZADE.
- O Cresim perde pontos de energia referente a cada interação;
    - O outro Cresim envolvido na interação gasta METADE dos pontos de energia da interação.
- O tempo gasto em cada interação é o numero de pontos de energia multiplicado por 2000ms;
    - Ambos os Cresims envolvidos gastam o mesmo tempo de energia.

### REQUISITO 06 - CHEATS

[CHEATS](https://pouncing-paddleboat-749.notion.site/CHEATS-232e71c966be4c869c57140f55d6d44d)

Link para requisição: [https://emilyspecht.github.io/the-cresim/cheats.json](https://emilyspecht.github.io/the-cresim/cheats.json)

- Durante qualquer momento onde o jogador tiver realizando algum input de dado no jogo ele poderá realizar um cheat.
    - Esse cheat é um texto pré-definido que irá habilitar certas recompensas para o personagem;
    - Caso o usuário tenha inputado algum comando de cheat, a aplicação deve aplicar o cheat e continuar de onde parou.

### REQUISITO 07 - HIGIENE

- O Cresim deve perder 4 pontos de higiene quando trabalhar um turno inteiro;
    - Caso ele não trabalhe um turno inteiro, deve ser feito o cálculo para descontar os pontos de higiene equivalente.
- O Cresim deve perder 2 pontos de higiene a cada ciclo de treino;
- O Cresim deve poder tomar banho;
    - Quando o Cresim tomar banho, deve ser descontado 10 Cresceleons.
- A higiene do Cresim não pode ficar menor que 4: caso isso aconteça, seu desempenho no trabalho será reduzido, ou seja, deve ser descontado 10% do salário do dia do Cresim.

![image](https://user-images.githubusercontent.com/61355223/197869025-0a45e135-1e44-42b5-9d74-09e4823b21d4.png)
