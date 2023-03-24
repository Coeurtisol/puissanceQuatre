class Game {
  width = 7;
  height = 6;
  grid = Array.from({ length: this.width }, () =>
    Array.from({ length: this.height }, () => null)
  );
  currentPlayer = "yellow";
  scores = {
    yellow: 0,
    red: 0,
  };
  winner = undefined;
  pawnsInGrid = 0;

  resetGame = () => {
    this.grid = Array.from({ length: this.width }, () =>
      Array.from({ length: this.height }, () => null)
    );
    this.changePlayer();
    this.winner = undefined;
    this.pawnsInGrid = 0;
  };

  getFirstFreePosition = (x) => {
    return this.grid[x].findIndex((e) => e == null);
  };

  addPawn = ({ x, y, color }) => {
    this.grid[x][y] = color;
    this.lastPawn = {
      x,
      y,
    };
    this.pawnsInGrid++;
  };

  isFinished = () => {
    const currentPlayerHasWon = [
      this.checkVertical(),
      this.checkHorizontal(),
      this.checkDiagonals(),
    ].some((f) => f === true);
    if (currentPlayerHasWon) {
      this.winner = this.currentPlayer;
    }
    if (this.isGridFull()) {
      this.winner = null;
    }
    return this.winner;
  };

  isGridFull = () => {
    return this.pawnsInGrid === this.width * this.height;
  };

  checkVertical = () => {
    const verticalLine = this.grid[this.lastPawn.x];
    return this.checkLine(verticalLine);
  };

  checkHorizontal = () => {
    const horizontalLine = this.generateHorizontal();
    return this.checkLine(horizontalLine);
  };

  generateHorizontal = () => {
    const line = [];
    for (let x = 0; x < this.width; x++) {
      line.push(this.grid[x][this.lastPawn.y]);
    }
    return line;
  };

  checkDiagonals = () => {
    const [topLeftToBottomRightLine, bottomLeftToTopRightLine] =
      this.generateDiagonals();
    return (
      this.checkLine(topLeftToBottomRightLine) ||
      this.checkLine(bottomLeftToTopRightLine)
    );
  };

  generateDiagonals = () => {
    const tlTObrLine = [];
    let tempLineSlot = {
      ...this.lastPawn,
    };
    while (tempLineSlot.x > -1 && tempLineSlot.y < this.height) {
      tempLineSlot.x--, tempLineSlot.y++;
    }
    while (tempLineSlot.x < this.width - 1 && tempLineSlot.y > 0) {
      tempLineSlot.x++, tempLineSlot.y--;
      tlTObrLine.push(this.grid[tempLineSlot.x][tempLineSlot.y]);
    }

    const blTOtrLane = [];
    tempLineSlot = {
      ...this.lastPawn,
    };
    while (tempLineSlot.x > -1 && tempLineSlot.y > -1) {
      tempLineSlot.x--, tempLineSlot.y--;
    }
    while (
      tempLineSlot.x < this.width - 1 &&
      tempLineSlot.y < this.height - 1
    ) {
      tempLineSlot.x++, tempLineSlot.y++;
      blTOtrLane.push(this.grid[tempLineSlot.x][tempLineSlot.y]);
    }

    return [tlTObrLine, blTOtrLane];
  };

  checkLine = (line) => {
    let result = false;
    let checkLine = [];
    line.forEach((pawn) => {
      if (!checkLine.length) {
        checkLine.push(pawn);
      } else {
        if (pawn === null || pawn !== checkLine[0]) {
          checkLine = [];
        }
        checkLine.push(pawn);
      }
      if (checkLine.length === 4) {
        result = true;
      }
    });
    return result;
  };

  changePlayer = () => {
    if (this.currentPlayer == "yellow") {
      this.currentPlayer = "red";
      return;
    }
    this.currentPlayer = "yellow";
  };
}

const game = new Game();

const gridElt = document.getElementById("grid");

const buildGrid = () => {
  gridElt.innerHTML = "";
  for (let x = 0; x < game.width; x++) {
    const column = document.createElement("div");
    for (let y = 0; y < game.height; y++) {
      const row = document.createElement("div");
      row.classList.add("circle");
      row.dataset.coord = `${x}${y}`;
      column.prepend(row);
    }
    gridElt.appendChild(column);
  }
};
buildGrid();

const buildClickableColumns = () => {
  const clickableColumnContainer = document.createElement("div");
  clickableColumnContainer.id = "clickableColumnContainer";
  const columnHeight = gridElt.clientHeight + "px";
  const columnWidth = gridElt.clientWidth / game.width + "px";
  for (let x = 0; x < game.width; x++) {
    const clickableColumn = document.createElement("div");
    clickableColumn.style.height = columnHeight;
    clickableColumn.style.width = columnWidth;
    clickableColumn.onclick = () => handleColumnClick(x);
    clickableColumnContainer.appendChild(clickableColumn);
    gridElt.appendChild(clickableColumnContainer);
  }
};
buildClickableColumns();

const handleColumnClick = (x) => {
  const y = game.getFirstFreePosition(x);
  if (y === -1) {
    return;
  }

  const pawn = { x, y, color: game.currentPlayer };

  game.addPawn(pawn);

  addPawnToDom(pawn);

  const winner = game.isFinished();
  if (winner === undefined) {
    game.changePlayer();
  } else {
    endGame(winner);
  }
};

const addPawnToDom = ({ x, y, color }) => {
  document.querySelector(`[data-coord="${x}${y}"]`).classList.add(color);
};

const endGame = (winner) => {
  if (winner === null) {
    alert(`Game over, no winner!`);
  } else {
    alert(`Player ${winner} wins!`);
    game.resetGame();
    buildGrid();
    buildClickableColumns();
  }
};

// todo:
// gérer les scores
// afficher les scores
// relance de partie manuelle (bouton)
