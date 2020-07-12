/* In-game coordinate system:
Walls and junctions between four cells (called pillars) also count for the coordinate
system, so the number of rows/columns with "walkable" cells (called ground cells) is
actually half of the board's size (rounding up). Both dimensions of the board should
be odd, as they start and end with a row / column of walkable cells.
The first coordinate is the row (y-axis / height), denoted with variable r by convention.
The second coordinate is the column (x-axis / width), denoted with variable c by convention.
*/

export function cellTypeByPos(pos) {
  if (pos.r % 2 === 0 && pos.c % 2 === 0) return "Ground";
  if (pos.r % 2 === 0 && pos.c % 2 === 1) return "Wall";
  if (pos.r % 2 === 1 && pos.c % 2 === 0) return "Wall";
  return "Pillar"; //case i%2 === 1 && j%2 === 1
}

function dimensions(grid) {
  return { h: grid.length, w: grid[0].length };
}

function inBounds(pos, dims) {
  return pos.r >= 0 && pos.r < dims.h && pos.c >= 0 && pos.c < dims.w;
}

function isWallBuilt(grid, pos) {
  const cellType = cellTypeByPos(pos);
  if (cellType !== "Wall") return false; //cannot check for wall here
  return grid[pos.r][pos.c] !== 0;
}

function accessibleNeighbors(grid, pos) {
  const dims = dimensions(grid);
  if (cellTypeByPos(pos) !== "Ground") {
    return []; //only ground coords can access neighbors
  }
  const dirs = [
    { r: 0, c: 1 },
    { r: 0, c: -1 },
    { r: 1, c: 0 },
    { r: -1, c: 0 },
  ];
  const res = [];
  const [pr, pc] = [pos.r, pos.c];
  for (let k = 0; k < dirs.length; k++) {
    const [dr, dc] = [dirs[k].r, dirs[k].c];
    const adjWall = { r: pr + dr, c: pc + dc };
    const adjGround = { r: pr + 2 * dr, c: pc + 2 * dc };
    if (inBounds(adjGround, dims) && !isWallBuilt(grid, adjWall)) {
      res.push(adjGround);
    }
  }
  return res;
}

function distance(grid, start, target) {
  //implements bfs algorithm
  if (start.r === target.r && start.c === target.c) return 0;
  const C = grid[0].length;
  const posToKey = (pos) => pos.r * C + pos.c;

  const queue = [];
  queue.push(start);
  const dist = new Map();
  dist.set(posToKey(start), 0);
  while (queue.length > 0) {
    const pos = queue.shift(); //todo: inefficient, change for real queue
    const nbrs = accessibleNeighbors(grid, pos);
    for (let k = 0; k < nbrs.length; k++) {
      let nbr = nbrs[k];
      if (!dist.has(posToKey(nbr))) {
        dist.set(posToKey(nbr), dist.get(posToKey(pos)) + 1);
        if (nbr.r === target.r && nbr.c === target.c)
          return dist.get(posToKey(nbr));
        queue.push(nbr);
      }
    }
  }
  return -1;
}

function canReach(grid, start, target) {
  return distance(grid, start, target) !== -1;
}

//can handle more than 2 players, which is not used for now
function isValidBoard(grid, playerPos, goals) {
  for (let k = 0; k < playerPos.length; k++) {
    if (!canReach(grid, playerPos[k], goals[k])) return false;
  }
  return true;
}

function canBuildWall(grid, playerPos, goals, pos) {
  if (isWallBuilt(grid, pos)) return false;
  grid[pos.r][pos.c] = 1; //grid parameter is only modified in this scope
  var res = isValidBoard(grid, playerPos, goals);
  grid[pos.r][pos.c] = 0;
  return res;
}

//when player selects / clicks a position, it can trigger one or two actions
//1 action = build 1 wall or move to adj cell
//-1 indicates that the clicked position triggers no action
export function numberOfActions(grid, playerPos, goals, pId, pos) {
  const cellType = cellTypeByPos(pos);
  if (cellType === "Ground") {
    return distance(grid, playerPos[pId - 1], pos);
  } else if (cellType === "Wall") {
    return canBuildWall(grid, playerPos, goals, pos) ? 1 : 0;
  } else {
    return 0; //clicked on pillar
  }
}
