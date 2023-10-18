(() => {
  const TIME_OUT_SEC = 60;
  const containerName = '.container';
  const defaultRowsNum = 4;
  let pairsNum = 0;
  let isWinner = false;

  getUserConfigAndStartGame();


function getUserConfigAndStartGame() {
  const userInputDom = document.querySelector('.user-input');
  const userBtnDom = document.querySelector('.user-btn');
  userBtnDom.addEventListener('click', () =>{
    const userRowsNum = userInputDom.value;
    if (userRowsNum <= 10 && userRowsNum % 2 == 0) {
      pairsNum = (userRowsNum ** 2) / 2;
    }
    else {
      pairsNum = (defaultRowsNum ** 2) / 2;
    }
    startGame(pairsNum);
  })
}


function setGameTimeout(pairs) {
  isWinner = false;
  setTimeout(() => {
    if (!isWinner) {
      startGame(pairs)
    }
  }, TIME_OUT_SEC * 1000);
}

function createNumbersArray(count) {
  numArray = [];
  for (let i = 1; i <= count; i++) {
    numArray.push(i);
    numArray.push(i);
  }
  return numArray;
}

function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

// count: pairs num
function startGame(count) {
  setGameTimeout(count)
  // init vars
  const FONT_SIZE = '16px';
  const winPoints = count;
  let points = 0;
  let turnCounter = 1;
  let prevCard = null;
  let currCard = null;

  // generate nums
  randomNums = shuffle(createNumbersArray(count))

  // create container
  const container = document.querySelector(`${containerName}`);
  container.innerHTML = '';
  container.style = 'max-width: 768px; margin: auto auto; padding: 15px 15px;';

  // create grid
  const grid = {};
  grid.gridDom = document.createElement('div');
  grid.gridDom.classList.add('grid');
  container.append(grid.gridDom);
  grid.currRow = null;
  grid.cardsInCurrRowNum = 0;
  maxCardsInRow = Math.sqrt(count * 2);

  grid.createNewRow = function() {
    const newRow = document.createElement('div');
    newRow.style.display = 'flex';
    this.currRowDom = newRow;
    this.gridDom.append(newRow);
  }

  grid.appendCard = function(cardDom) {
    if (!grid.currRowDom) {
      this.createNewRow();
    }

    if (grid.cardsInCurrRowNum < maxCardsInRow) {
      this.currRowDom.append(cardDom);
      this.cardsInCurrRowNum++;
    }
    else {
      this.createNewRow()
      this.currRowDom.append(cardDom);
      this.cardsInCurrRowNum = 1;
    }

  }

  // create cards
  for (const num of randomNums) {
    const card = {};
    card.value = num;
    card.isWon = false;

    // create card DOM elem
    const cardDom = document.createElement('button');
    cardDom.style = 'background-color: red; width: 50px; height: 50px;';
    cardDom.textContent = card.value;
    cardDom.style.fontSize = 0;
    card.cardDom = cardDom;

    // set card state functions
    card.setOn = function() {
      this.cardDom.style.backgroundColor = 'green';
      this.cardDom.style.fontSize = FONT_SIZE;
    }
    card.setOff = function() {
      if (!this.isWon) {
        this.cardDom.style.backgroundColor = 'red';
        this.cardDom.style.fontSize = 0;
      }
    }
    card.setWon = function() {
      this.isWon = true;
    }



    // add button event
    card.cardDom.addEventListener('click', ()=>{
      if (turnCounter % 2 === 1) {
        if (prevCard && currCard) {
          prevCard.setOff();
          currCard.setOff();
        }
        prevCard = currCard;
        currCard = card;
        currCard.setOn();
      }
      else {
        prevCard = currCard;
        currCard = card;
        currCard.setOn();
        if (currCard.value === prevCard.value
            && currCard != prevCard) {
              currCard.setWon();
              prevCard.setWon();
              points++;
        }
      }
      turnCounter++;

      if (points === winPoints) {
        replayBtn.style.display = 'block';
        isWinner = true;
      }
    })

    // fieldDom.append(card.cardDom);
    grid.appendCard(card.cardDom);
  }

  // create replay btn
  const replayBtn = document.createElement('button');
  replayBtn.style = `width: 100px; height: 100px; font-size: ${FONT_SIZE}; display: none;`;
  replayBtn.textContent = 'Сыграть ещё раз';
  replayBtn.addEventListener('click', () => startGame(count));
  container.append(replayBtn);
}
})();
