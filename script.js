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

  getFirstFreePosition = (x) => {
    return this.grid[x].findIndex((e) => e == null);
  };

  setPawnInGrid = ({ x, y, color }) => {
    this.grid[x][y] = color;
  };

  changePlayer = () => {
    if (this.currentPlayer == "yellow") {
      this.currentPlayer = "red";
      return;
    }
    this.currentPlayer = "yellow";
  };
}

class Pawn {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.color = color;
  }
}

const game = new Game();

const gridElt = document.getElementById("grid");

const buildGrid = () => {
  gridElt.innerHTML = "";
  const clickableColumnContainer = document.createElement("div");
  clickableColumnContainer.id = "clickableColumnContainer";
  for (let x = 0; x < game.largeur; x++) {
    const column = document.createElement("div");
    for (let y = 0; y < game.hauteur; y++) {
      const row = document.createElement("div");
      row.classList.add("circle");
      row.dataset.coord = `${x}${y}`;
      column.prepend(row);
    }
    gridElt.appendChild(column);

    const clickableColumn = document.createElement("div");
    clickableColumn.dataset.col = x;
    clickableColumn.onclick = () => handleColumnClick(x);
    clickableColumnContainer.appendChild(clickableColumn);
    gridElt.appendChild(clickableColumnContainer);
  }
};
buildGrid();

const handleColumnClick = (x) => {
  const y = game.getFirstFreePosition(x);
  if (y === -1) {
    return;
  }

  const pawn = new Pawn(x, y, game.currentPlayer);

  game.setPawnInGrid(pawn);

  addPawnToDom(pawn);

  // todo: verifier victoire ou null

  game.changePlayer();
  console.log(game);
};

const addPawnToDom = ({ x, y, color }) => {
  document.querySelector(`[data-coord="${x}${y}"]`).classList.add(color);
};
