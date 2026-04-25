# 🕹️ LIBESCAPE

> Um jogo de sobrevivência e exploração desenvolvido com HTML5 Canvas e JavaScript puro.

## 📝 Sobre o Projeto
O **LIBESCAPE** é um jogo de aventura top-down onde o jogador deve explorar diferentes mapas (Metrô, Cidade e Faculdade), coletar itens preciosos e sobreviver a hordas de inimigos com diferentes habilidades. O projeto foca em lógica de colisão complexa e renderização dinâmica.

### 🌟 Funcionalidades
* **Três Fases Progressivas:** Cada nível apresenta um novo mapa e novos desafios.
* **Sistema de Inimigos:** IA que persegue o jogador e inimigos que utilizam ataques à distância.
* **Câmera Dinâmica:** Sistema de acompanhamento (viewport) com zoom de 1.2x.
* **Minimapa Real-time:** Radar localizado no canto superior para orientação estratégica.
* **Efeitos Sonoros:** Áudio procedural gerado via Web Audio API (sem necessidade de arquivos externos).

---

## 🛠️ Tecnologias Utilizadas
* **Linguagem:** JavaScript (ES6+)
* **Gráficos:** HTML5 Canvas API
* **Mapeamento:** Coordenadas geradas via Image-Map Generator

---

## 🚀 Como Jogar
1. Clone o repositório ou baixe os arquivos. (LIBESCAPE.zip)
2. Abra o arquivo `index.html` em seu navegador. (Instale o plugin "Live.Server" caso queira)
3. Use as teclas **W, A, S, D** ou as **Setas do Teclado** para se movimentar.
4. **Objetivo:** Colete as **6 Gemas (💎)**. Após coletá-las, aguarde o tempo acabar para que a porta de saída seja aberta e você possa avançar de fase.

---

## 📂 Estrutura de Arquivos
* `script.js`: Toda a lógica de classes, física e renderização.
* `index.html`: Estrutura da tela e containers do Canvas.
* `assets/`: Imagens dos mapas, personagens e portas.

---
