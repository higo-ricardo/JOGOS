document.addEventListener('DOMContentLoaded', () => {
    const words = {
        'gato': 'Nome genérico dado aos felinos criados como PET',
        'cachorro': 'Nome genérico dado aos canídeos criados como PET',
        'rio': 'Curso de água natural',
        'smartphone': 'Dispositivo móvel que combina telefone, câmera, aplicativos e acesso à Internet',
        'macarronada': 'Preparo alimentar de macarrão cozido com carne moída, com ou sem molho e queijo ralado',
        'casa': 'Nome popular de qualquer habitação humana',
        'chuva': 'Fenômeno meteorológico em que água retorna para a superfície terrestre na sua forma líquida',
        'volei': 'Esporte coletivo praticado em quadra com revezamento aéreo de uma bola entre duas equipes',
        'oculos': 'Dispositivo óptico com duas lentes e uma armação usado para correção da visão',
        'piano': 'Instrumento musical de teclas usado em músicas clássicas',
        'bicicleta': 'Veículo de propulsão humana com 2 rodas',
        'navio': 'Veículo de transporte aquático para pessoas e coisas',
        'vinho': 'Bebida alcoólica fermentada obtida da fermentação da uva',
        'baleia': 'Maior mamífero aquático que habita os oceanos',
        'relogio': 'Instrumento usado no pulso que mede o tempo, indicando horas, minutos e segundos',
        'cavalo': 'Animal de 4 patas que serve de montaria a pessoas humanas',
        'hotdog': 'Comida típica dos EUA com salsicha dentro de um pão sovado',
        'galinha': 'Animal bípede de bico afiado e crista que come grãos e põe ovos',
        'elefante': 'Mamífero herbívoro de grande porte com tromba muscular que vive em bandos',
        'girassol': 'Flor que segue o sol',
        'jacare': 'Espécie de réptil carnívoro que vive na água',
        'samba': 'Gênero musical e dança brasileira que usa instrumentos de percussão',
        'batata': 'Tubérculo com casca fina e amarelada cultivado para servir de alimento'
    };

    let selectedWord = '';
    let selectedHint = '';
    let guessedLetters = [];
    let attempts = 0;
    let score = 0;
    let playerName = '';
    const wrongSound = document.getElementById('wrong-sound');
    const wordContainer = document.querySelector('.word-container');
    const hintElement = document.createElement('p');
    const attemptsElement = document.getElementById('attempts');
    const keyboardContainer = document.querySelector('.keyboard');
    const rankingList = document.getElementById('ranking-list');
    const playerNameElement = document.getElementById('player-name');
    const playerScoreElement = document.getElementById('player-score');

    document.querySelector('.game-container').insertBefore(hintElement, document.querySelector('.guesses'));

    function getPlayerName() {
        playerName = prompt('Digite seu nome:') || 'Anônimo';
        playerNameElement.textContent = `Jogador: ${playerName}`;
        startGame();
    }

    function startGame() {
        const wordKeys = Object.keys(words);
        selectedWord = wordKeys[Math.floor(Math.random() * wordKeys.length)].toLowerCase();
        selectedHint = words[selectedWord];
        guessedLetters = [];
        attempts = Math.min(selectedWord.length, 6);
        hintElement.textContent = '';
        displayWord();
        displayKeyboard();
        updateGuesses();
        updatePlayerScore();
    }

    function displayWord() {
        wordContainer.innerHTML = selectedWord
            .split('')
            .map(letter => guessedLetters.includes(letter.toLowerCase()) ? letter : '█')
            .join(' ');
    }

    function displayKeyboard() {
        keyboardContainer.innerHTML = '';
        
        // Criar linhas de letras
        const row1 = document.createElement('div');
        row1.className = 'keyboard-row';
        for (let i = 65; i <= 90; i++) {
            const letter = String.fromCharCode(i).toLowerCase();
            const button = document.createElement('button');
            button.textContent = letter.toUpperCase();
            button.addEventListener('click', function() {
                handleGuess(letter);
                this.disabled = true;
            });
            row1.appendChild(button);
            if (i === 90) keyboardContainer.appendChild(row1); // Adiciona a linha completa ao container
        }

        // Adicionar o botão RESETAR em uma linha separada
        const resetRow = document.createElement('div');
        resetRow.className = 'keyboard-row';
        const resetButton = document.createElement('button');
        resetButton.id = 'reset-button';
        resetButton.textContent = 'RESETAR';
        resetButton.addEventListener('click', () => {
            score = 0;
            updatePlayerScore();
            startGame();
        });
        resetRow.appendChild(resetButton);
        keyboardContainer.appendChild(resetRow);
    }

    function handleGuess(letter) {
        letter = letter.toLowerCase();
        if (guessedLetters.includes(letter) || attempts <= 0) return;
        guessedLetters.push(letter);

        if (!selectedWord.includes(letter)) {
            attempts--;
            wrongSound.play();
            if (attempts === 2) {
                hintElement.textContent = 'Dica: ' + selectedHint;
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
            startGame();
        } else if (!wordContainer.textContent.includes('█')) {
            score += attempts * 10;
            alert('Parabéns! Você venceu! Pontuação: ' + score);
            saveGameData(true);
            startGame();
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
            let li = document.createElement('li');
            li.textContent = `${index + 1}. ${name}: ${stats.totalPoints} pontos`;
            rankingList.appendChild(li);
        });
    }

    getPlayerName();
});