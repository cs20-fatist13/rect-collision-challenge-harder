let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
canvas.width = 900;
canvas.height = 600;
console.log("start");

let walls = [];

// character properties
let character = {
  x: 0,
  y: 300,
  width: 10,
  height: 10,
  speed: 5,
  dx: 0,
  dy: 0,
  characterStartX: 0,
  characterStartY: 300,
};

// load walls from JSON file
function getWalls() {
  fetch("walls-data.json")
    .then((response) => response.json())
    .then((data) => {
      walls = data.map((wallData) => ({
        x: Math.floor(Math.random() * (canvas.width - wallData.width)),
        y: Math.floor(Math.random() * (canvas.height - wallData.height)),
        width: wallData.width,
        height: wallData.height,
      }));
    })
    .then(() => {
      moveCharacter();
    });
}

// handle keydown events for character movement
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e) {
  if (e.key === "Right" || e.key === "ArrowRight") {
    character.dx = character.speed;
  } else if (e.key === "Left" || e.key === "ArrowLeft") {
    character.dx = -character.speed;
  } else if (e.key === "Up" || e.key === "ArrowUp") {
    character.dy = -character.speed;
  } else if (e.key === "Down" || e.key === "ArrowDown") {
    character.dy = character.speed;
  }
}

// handle keyup events to stop character movement
function keyUpHandler(e) {
  if (
    e.key === "Right" ||
    e.key === "ArrowRight" ||
    e.key === "Left" ||
    e.key === "ArrowLeft" ||
    e.key === "Up" ||
    e.key === "ArrowUp" ||
    e.key === "Down" ||
    e.key === "ArrowDown"
  ) {
    character.dx = 0;
    character.dy = 0;
  }
}

// function to move the character and check for collisions
function moveCharacter() {
  character.x += character.dx;
  character.y += character.dy;

  // boundary checks to keep the character within the canvas
  if (character.x < 0) character.x = 0;
  if (character.x + character.width > canvas.width)
    character.x = canvas.width - character.width;
  if (character.y < 0) character.y = 0;
  if (character.y + character.height > canvas.height)
    character.y = canvas.height - character.height;

  // check for collision with walls
  for (let i = 0; i < walls.length; i++) {
    const wall = walls[i];
    if (
      character.x < wall.x + wall.width &&
      character.x + character.width > wall.x &&
      character.y < wall.y + wall.height &&
      character.y + character.height > wall.y
    ) {
      // collision detected, move character back
      character.x = character.x - character.dx;
      character.y = character.y - character.dy;
      break;
    }
  }

  //check for walls overlapping
  //for (let i = 0; i < walls.length; i++) {
  //const wall = walls[i];
  //for (let j = i + 1; j < walls.length; j++) {
  //const wall2 = walls[j];
  //if (
  //wall.x < wall2.x + wall2.width &&
  //wall.x + wall.width > wall2.x &&
  //wall.y < wall2.y + wall2.height &&
  //wall.y + wall.height > wall2.y
  //) {
  // collision detected, move character back
  //wall.x = wall.x - wall.dx;
  //wall.y = wall.y - wall.dy;
  //break;
  //}
  //}
  //}

  // clear canvas and redraw everything
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // draw walls
  walls.forEach((wall) => {
    ctx.fillStyle = "#abadb0";
    ctx.fillRect(wall.x, wall.y, wall.width, wall.height);
  });

  // draw character
  ctx.fillStyle = "#348feb";
  ctx.fillRect(character.x, character.y, character.width, character.height);

  requestAnimationFrame(moveCharacter);
}

getWalls();

// reload page when space pressed
function spacePressed(e) {
  if (e.key === " " || e.key === "Spacebar") {
    location.reload();
  }
}
