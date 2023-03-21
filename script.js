class Game {
  largeur = 7;
  hauteur = 6;
  grid = Array.from({ length: this.largeur }, () =>
    Array.from({ length: this.hauteur }, () => null)
  );
  currentPlayer = "yellow";
  scores = {
    yellow: 0,
    red: 0,
  };
  winner = undefined;
  pawnsInGrid = 0;

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
    const result = [
      this.checkVertical(),
      this.checkHorizontal(),
      this.checkDiagonals(),
    ].some((f) => f === true);
    if (result) {
      this.winner = this.currentPlayer;
    }
    return result;
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
    for (let x = 0; x < this.largeur; x++) {
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
    while (tempLineSlot.x > -1 && tempLineSlot.y < this.hauteur) {
      tempLineSlot.x--, tempLineSlot.y++;
    }
    while (tempLineSlot.x < this.largeur - 1 && tempLineSlot.y > 0) {
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
      tempLineSlot.x < this.largeur - 1 &&
      tempLineSlot.y < this.hauteur - 1
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
  for (let x = 0; x < game.largeur; x++) {
    const column = document.createElement("div");
    for (let y = 0; y < game.hauteur; y++) {
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
  const columnWidth = gridElt.clientWidth / game.largeur + "px";
  for (let x = 0; x < game.largeur; x++) {
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

  if (!game.isFinished()) {
    game.changePlayer();
  } else {
    // todo : end of game
    alert(`player ${game.winner} wins!`);
  }
};

const addPawnToDom = ({ x, y, color }) => {
  document.querySelector(`[data-coord="${x}${y}"]`).classList.add(color);
};

// todo:
// detecter partie nulle
// fin de partie
// reset grille
// afficher score
