
  // Elementos
  const startBtn = document.getElementById('startBtn');
  const levelDisplay = document.getElementById('level');
  const villainName = document.getElementById('villainName');
  const heroHealth = document.getElementById('heroHealth');
  const villainHealth = document.getElementById('villainHealth');
  const hero = document.getElementById('hero');
  const villain = document.getElementById('villain');
  const sequenceDisplay = document.querySelector('.sequence-display');
  const colorButtons = document.querySelectorAll('.color-btn');

  // Cores das bolas
  const colors = ['red', 'blue', 'yellow', 'green'];

  // Estado do jogo
  let level = 1;
  let sequence = [];
  let playerIndex = 0;
  let canClick = false;
  let heroLives = 2;
  let villainLives = 2;
  let hitsThisLevel = 0; // Quantas sequências foram acertadas neste nível

  // Nomes dos vilões por nível
  const villainNames = [
    "Bruxo Sombrio",
    "Feiticeiro do Caos",
    "Rei das Chamas",
    "Mago do Vácuo",
    "Senhor do Caos Final"
  ];

  // Atualiza barras de vida
  function updateHealth() {
    heroHealth.style.width = (heroLives * 50) + '%';
    villainHealth.style.width = (villainLives * 50) + '%';
  }

  // Adiciona à sequência
  function addToSequence() {
    const rand = Math.floor(Math.random() * 4);
    sequence.push(rand);
  }

  // Pisca o botão
  function flashButton(index) {
    const btn = colorButtons[index];
    btn.style.transform = 'scale(0.9)';
    btn.style.boxShadow = '0 0 15px white';
    setTimeout(() => {
      btn.style.transform = '';
      btn.style.boxShadow = '';
    }, 300);
  }

  // Herói atira no vilão
  function shootHeroProjectile() {
    const projectile = document.createElement('div');
    projectile.classList.add('projectile');
    projectile.style.backgroundColor = colors[sequence[sequence.length - 1]];

    const heroRect = hero.getBoundingClientRect();
    const villainRect = villain.getBoundingClientRect();

    const top = heroRect.top + window.scrollY + heroRect.height / 2 - 9;
    const left = heroRect.left + window.scrollX + heroRect.width / 2 - 9;

    projectile.style.position = 'absolute';
    projectile.style.left = left + 'px';
    projectile.style.top = top + 'px';
    document.body.appendChild(projectile);

    let x = 0;
    const targetDistance = villainRect.left - heroRect.left - 100;

    const move = setInterval(() => {
      x += 5;
      projectile.style.transform = `translateX(${x}px)`;

      if (x >= targetDistance) {
        clearInterval(move);
        projectile.remove();

        // Efeito no vilão
        villain.style.opacity = 0.6;
        setTimeout(() => {
          villain.style.opacity = 1;
        }, 150);

        // Conta o acerto
        hitsThisLevel++;

        // ✅ Primeiro acerto: perde metade da vida
        if (hitsThisLevel === 1) {
          villainLives = 1; // metade da vida
          updateHealth();
          sequenceDisplay.textContent = `Nível ${level} (2/2): Última chance!`;
          setTimeout(startNextSequence, 800);
        }
        // ✅ Segundo acerto: passa de nível
        else if (hitsThisLevel >= 2) {
          nextLevel();
        }
      }
    }, 30);
  }

  // Vilão atira no herói
  function shootVillainProjectile() {
  // Criar projétil
  const projectile = document.createElement('div');
  projectile.classList.add('projectile');
  projectile.style.backgroundColor = 'purple';
  projectile.style.position = 'absolute';
  projectile.style.width = '18px';
  projectile.style.height = '18px';
  projectile.style.borderRadius = '50%';
  projectile.style.boxShadow = '0 0 8px white';
  projectile.style.zIndex = '1000';
  projectile.style.pointerEvents = 'none';

  // Obter posições
  const villainRect = villain.getBoundingClientRect();
  const heroRect = hero.getBoundingClientRect();

  // Posição inicial: centro do vilão
  const startX = villainRect.left + villainRect.width / 2 - 9;
  const startY = villainRect.top + villainRect.height / 2 - 9;

  // Aplicar posição absoluta com scroll
  projectile.style.left = (startX + window.scrollX) + 'px';
  projectile.style.top = (startY + window.scrollY) + 'px';

  // Adicionar ao DOM
  document.body.appendChild(projectile);

  // Calcular distância total em X (da direita para a esquerda)
  const totalDistance = heroRect.left - (villainRect.left + villainRect.width) + 100;

  // Animação com transform: translateX
  let moved = 0;
  const step = 5; // px por frame
  const interval = setInterval(() => {
    moved += step;
    projectile.style.transform = `translateX(-${moved}px)`; // movimento para a esquerda

    // Quando chegar perto do herói
    if (moved >= Math.abs(totalDistance)) {
      clearInterval(interval);

      // Efeito no herói
      hero.style.opacity = 0.6;
      setTimeout(() => {
        hero.style.opacity = 1;
      }, 150);

      // Remover projétil
      projectile.remove();

      // Aplicar dano
      heroLives--;
      updateHealth();

      if (heroLives <= 0) {
        endGame(false);
      } else {
        setTimeout(startNextSequence, 800);
      }
    }
  }, 30);
}

  // Inicia nova sequência no mesmo nível
  function startNextSequence() {
    sequence = [];
    playerIndex = 0;
    canClick = false;

    for (let i = 0; i < level; i++) {
      addToSequence();
    }

    playSequence();
  }

  // Próximo nível
  function nextLevel() {
    setTimeout(() => {
      level++;
      levelDisplay.textContent = level;
      hitsThisLevel = 0;
      sequence = [];
      playerIndex = 0;
      canClick = false;

      villainName.textContent = villainNames[(level - 1) % villainNames.length];

      // ✅ Resetar vida do vilão para 2 (cheia) no novo nível
      villainLives = 2;
      updateHealth();

      for (let i = 0; i < level; i++) {
        addToSequence();
      }

      sequenceDisplay.textContent = `Nível ${level} (1/2): Memorize a sequência!`;
      playSequence();
    }, 1000);
  }

  // Mostra a sequência
  function playSequence() {
    canClick = false;
    let i = 0;
    const delay = Math.max(600 - level * 30, 300);

    const interval = setInterval(() => {
      const index = sequence[i];
      flashButton(index);
      i++;
      if (i >= sequence.length) {
        clearInterval(interval);
        setTimeout(() => {
          canClick = true;
          sequenceDisplay.textContent = "Sua vez! Repita a sequência.";
        }, 500);
      }
    }, delay);
  }

  // Jogador errou
  function playerWrong() {
    canClick = false;
    sequenceDisplay.textContent = "Erro! O vilão contra-ataca!";
    hitsThisLevel = 0; // Reseta progresso do nível==
    shootVillainProjectile();
  }

  // Fim de jogo
  function endGame(victory) {
    canClick = false;
    const msg = victory
      ? `🎉 Você venceu! O reino está salvo! Nível alcançado: ${level}`
      : `💀 Você foi derrotado! O vilão dominou tudo!`;
    setTimeout(() => alert(msg), 500);
    startBtn.textContent = "Jogar Novamente";
    startBtn.style.display = "block";
  }

  // Iniciar batalha
  function startBattle() {
    level = 1;
    heroLives = 2;
    villainLives = 2;
    hitsThisLevel = 0;
    sequence = [];
    playerIndex = 0;
    canClick = false;

    levelDisplay.textContent = level;
    villainName.textContent = villainNames[0];
    sequenceDisplay.textContent = "Preparando batalha...";
    startBtn.style.display = "none";

    for (let i = 0; i < level; i++) {
      addToSequence();
    }

    updateHealth();
    playSequence();
  }

  // Eventos dos botões de cor
  colorButtons.forEach((btn, index) => {
    btn.addEventListener('click', () => {
      if (!canClick) return;

      flashButton(index);

      if (sequence[playerIndex] === index) {
        playerIndex++;
        if (playerIndex === sequence.length) {
          sequenceDisplay.textContent = "Acertou! Atacando vilão!";
          canClick = false;
          shootHeroProjectile();
          playerIndex = 0;
        }
      } else {
        playerWrong();
      }
    });
  });

  // Botão de início
  startBtn.addEventListener('click', startBattle);
