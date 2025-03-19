document.addEventListener('DOMContentLoaded', () => {
    const words = {
        'Gato': 'Nome genérico dado aos felinos criados como PET', // 4 letras
        'Casa': 'Nome popular de qualquer habitação humana', // 4 letras
        'Rio': 'Curso de água natural', // 3 letras
        'Sol': 'Estrela do sistema solar', // 3 letras
        'Lua': 'Satélite natural da Terra', // 3 letras
        'Chuva': 'Fenômeno natural em que água presente da atmosfera retorna a superfície terrestre na sua forma líquida', // 5 letras
        'Volei': 'Esporte coletivo praticado em quadra com revezamento aéreo de uma bola entre duas equipes', // 5 letras
        'Piano': 'Instrumento musical de teclas usado em músicas clássicas', // 5 letras
        'Navio': 'Veículo de transporte aquático para pessoas e coisas', // 5 letras
        'Vinho': 'Bebida alcoólica fermentada obtida da fermentação da uva', // 5 letras
        'NetFlix':'',
        'Amazon':'',
        'Google':'',
        'Marte':'',
        
        'Jupiter':'',
        'Cachorro': 'Nome genérico dado aos canídeos criados como PET', // 8 letras
        'Smartphone': 'Dispositivo móvel que combina telefone, câmera, aplicativos e acesso à Internet', // 10 letras
        'Bicicleta': 'Veículo de propulsão humana com 2 rodas', // 9 letras
        'Computador': 'Máquina eletrônica que processa dados e realiza cálculos', // 10 letras     
        'Oculos': 'Dispositivo óptico com duas lentes e uma armação usado para correção da visão', // 6 letras
        'Baleia': 'Maior mamífero aquático que habita os oceanos', // 6 letras
        'Relogio': 'Instrumento usado no pulso que mede o tempo, indicando horas, minutos e segundos', // 7 letras
        'Cavalo': 'Animal de 4 patas que serve de montaria a pessoas humanas', // 6 letras
        'Hotdog': 'Comida típica dos EUA com salsicha dentro de um pão sovado', // 6 letras
        'Galinha': 'Animal bípede de bico afiado e crista que come grãos e põe ovos', // 7 letras
        'Elefante': 'Mamífero herbívoro de grande porte com tromba muscular que vive em bandos', // 8 letras
        'Jacare': 'Espécie de réptil carnívoro que vive na água', // 6 letras
        'Samba': 'Gênero musical e dança brasileira que usa instrumentos de percussão', // 5 letras
        'Batata': 'Tubérculo com casca fina e amarelada cultivado para servir de alimento', // 6 letras

        
        'Macarronada': 'Preparo culinário feito de macarrão e carne moída, com ou sem molho.', // 11 letras
        'Ornitorrinco': '', // 12 letras
        'Paralelepidedo': '', // 14 letras 
        'Intempestivo':'', // 12 letras
        'Inconsequente':'', // 13 letras
        'Inconstitucional':'', // 15 letras
        'Ancestralidade':'',
        'Anticonstitucional':'',
        'Sociambiental':'',
        'arrependimento':'',
        'desenvolvimento':'',
       
    };

    let selectedWord = '';
    let selectedHint = '';
    let guessedLetters = [];
    let attempts = 0;
    let score = 0;
    let playerName = '';
    let streak = 0;
    let hintUsed = false;
    const wrongSound = document.getElementById('wrong-sound');
    const wordContainer = document.querySelector('.word-container');
    const hintElement = document.createElement('p');
    const attemptsElement = document.getElementById('attempts');
    const keyboardContainer = document.querySelector('.keyboard');
    const rankingList = document.getElementById('ranking-list');
    const playerNameElement = document.getElementById('player-name');
    const playerScoreElement = document.getElementById('player-score');
    const modal = document.getElementById('difficulty-modal');

    document.querySelector('.game-container').insertBefore(hintElement, document.querySelector('.guesses'));

    function getPlayerName() {
        playerName = prompt('Digite seu nome:') || 'Anônimo';
        playerNameElement.textContent = `Jogador: ${playerName}`;
        showDifficultyModal();
    }

    function showDifficultyModal() {
        modal.style.display = 'flex';
        document.getElementById('easy-btn').onclick = () => startGame('easy');
        document.getElementById('medium-btn').onclick = () => startGame('medium');
        document.getElementById('hard-btn').onclick = () => startGame('hard');
    }

    function startGame(difficulty) {
        modal.style.display = 'none';
        
        // Filtrar palavras por tamanho
        let filteredWords = {};
        if (difficulty === 'easy') {
            filteredWords = Object.fromEntries(
                Object.entries(words).filter(([word]) => word.length <= 5)
            );
            attempts = 8;
        } else if (difficulty === 'medium') {
            filteredWords = Object.fromEntries(
                Object.entries(words).filter(([word]) => word.length >= 6 && word.length <= 9)
            );
            attempts = 6;
        } else if (difficulty === 'hard') {
            filteredWords = Object.fromEntries(
                Object.entries(words).filter(([word]) => word.length >= 10)
            );
            attempts = 4;
        }

        const wordKeys = Object.keys(filteredWords);
        if (wordKeys.length === 0) {
            alert('Nenhuma palavra disponível para este nível de dificuldade!');
            showDifficultyModal();
            return;
        }

        selectedWord = wordKeys[Math.floor(Math.random() * wordKeys.length)].toLowerCase();
        selectedHint = filteredWords[selectedWord];
        guessedLetters = [];
        hintUsed = false;

        hintElement.textContent = '';
        displayWord();
        displayKeyboard();
        updateGuesses();
        updatePlayerScore();
    }

    function displayWord() {
        wordContainer.innerHTML = selectedWord
            .split('')
            .map(letter => `<span class="letter">${guessedLetters.includes(letter.toLowerCase()) ? letter : '█'}</span>`)
            .join(' ');
    }

    function displayKeyboard() {
        keyboardContainer.innerHTML = '';
        const row1 = document.createElement('div');
        row1.className = 'keyboard-row';
        for (let i = 65; i <= 90; i++) {
            const letter = String.fromCharCode(i).toLowerCase();
            const button = document.createElement('button');
            button.textContent = letter.toUpperCase();
            button.dataset.letter = letter; // Armazenar a letra no botão
            button.addEventListener('click', () => {
                handleGuess(letter);
                button.disabled = true;
            });
            row1.appendChild(button);
        }
        keyboardContainer.appendChild(row1);

        const resetRow = document.createElement('div');
        resetRow.className = 'keyboard-row';
        const resetButton = document.createElement('button');
        resetButton.id = 'reset-button';
        resetButton.textContent = 'RESETAR';
        resetButton.addEventListener('click', () => {
            score = Math.max(0, score - 5);
            streak = 0;
            updatePlayerScore();
            showDifficultyModal();
        });
        resetRow.appendChild(resetButton);
        keyboardContainer.appendChild(resetRow);
    }

    function handleGuess(letter) {
        letter = letter.toLowerCase();
        if (guessedLetters.includes(letter) || attempts <= 0) return;
        guessedLetters.push(letter);

        const button = Array.from(keyboardContainer.querySelectorAll('button')).find(
            btn => btn.dataset.letter === letter
        );
        if (!selectedWord.includes(letter)) {
            attempts--;
            wrongSound.play();
            if (button) button.classList.add('wrong');
            if (attempts === 2) {
                hintElement.textContent = 'Dica: ' + selectedHint;
                hintUsed = true;
            }
        }

        displayWord();
        updateGuesses();
        checkGameStatus();
    }

    function updateGuesses() {
        attemptsElement.textContent = attempts;
    }

    function updatePlayerScore() {
        playerScoreElement.textContent = `Pontuação: ${score}`;
    }

    function checkGameStatus() {
        if (attempts <= 0) {
            alert('Você perdeu! A palavra era: ' + selectedWord);
            saveGameData(false);
            streak = 0;
            showDifficultyModal();
        } else if (!wordContainer.textContent.includes('█')) {
            let bonus = 0;
            if (!hintUsed) bonus += 20;
            streak++;
            bonus += streak * 10;
            score += (attempts * 10) + bonus;
            alert(`Parabéns! Você venceu! Pontuação: ${score} (+${bonus} de bônus)`);
            saveGameData(true);
            showDifficultyModal();
        }
    }

    function saveGameData(won) {
        let data = JSON.parse(localStorage.getItem('gameData')) || { scores: {} };

        if (!data.scores[playerName]) {
            data.scores[playerName] = { games: 0, wins: 0, totalPoints: 0 };
        }

        data.scores[playerName].games += 1;
        if (won) data.scores[playerName].wins += 1;
        data.scores[playerName].totalPoints += score;

        localStorage.setItem('gameData', JSON.stringify(data));
        updateRanking();
    }

    function updateRanking() {
        let data = JSON.parse(localStorage.getItem('gameData')) || { scores: {} };
        if (!data.scores) return;
        const sortedScores = Object.entries(data.scores)
            .sort((a, b) => b[1].totalPoints - a[1].totalPoints)
            .slice(0, 10);

        rankingList.innerHTML = '';
        sortedScores.forEach(([name, stats], index) => {
            const avg = (stats.totalPoints / stats.games).toFixed(1);
            let li = document.createElement('li');
            li.textContent = `${index + 1}. ${name}: ${stats.totalPoints} pontos (Vitórias: ${stats.wins}, Jogos: ${stats.games}, Média: ${avg})`;
            if (name === playerName) li.classList.add('current-player');
            rankingList.appendChild(li);
        });
    }

    getPlayerName();
});