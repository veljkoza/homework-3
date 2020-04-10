const gridContainer = document.querySelector(".grid-container");
const loadMoreBtn = document.getElementById("load-more");
const inputText = document.getElementById("inputText").firstElementChild;
const searchBtn = document.getElementById("searchBtn");
const nameRadio = document.getElementById("name");
const genreRadio = document.getElementById("genre");
let allData = [];
let ratingsOptions = document.getElementById("rating");
let data = [];

let pointer;
let count = 3;

loadFirstThree();

(function loadEventListeners() {
  loadMoreBtn.addEventListener("click", loadThree);
  inputText.addEventListener("keyup", (e) => {
    if (e.target.value === "") {
      data = [];
      gridContainer.innerHTML = "";
      count = 3;
      loadFirstThree();
      console.log(data);
    }
  });
  searchBtn.addEventListener("click", (e) => {
    let foundGames = searchGames();
    gridContainer.innerHTML = "";
    displayFoundGames(foundGames);
  });
})();

function loadAll(){
  for (let i = 1; i <= 80; i++) {
    fetchOneGame(i,false);    
  }
}

function loadFirstThree() {
  let i;
  for (i = 0; i <= count; i++) {
    fetchOneGame(i,true);
  }
  loadAll();
  pointer = i;
  count += 3;
}

function loadThree() {
  console.log("BEFORE\npointer: " + pointer + ", count: " + count);
  let i;
  for (i = pointer; i <= count; i++) {
    fetchOneGame(i,true);
  }
  pointer = i;
  count += 3;
  console.log("AFTER\npointer: " + pointer + ", count: " + count);
}




function fetchOneGame(id,add) {
  fetch(`https://rawg-video-games-database.p.rapidapi.com/games/${id}`, {
    method: "GET",
    headers: {
      "x-rapidapi-host": "rawg-video-games-database.p.rapidapi.com",
      "x-rapidapi-key": "b3071fb829msha09abfd4c5a24dep19a5b1jsne43ce7980b41",
    },
  })
    .then((response) => {
      return response.json();
    })
    .then((obj) => {
      let newObj = { genre: [] };

      newObj.id = obj.id;
      newObj.bgImg = obj.background_image;
      newObj.name = obj.name;
      if (obj.publishers === undefined) {
        newObj.publisher = "not known";
      } else if (obj.publishers[0] === undefined) {
        newObj.publisher = "not known";
      } else {
        newObj.publisher = obj.publishers[0].name;
      }
      newObj.rating = obj.rating_top;
      newObj.url = obj.stores[0].url;

      [...obj.genres].forEach((genre) => {
        newObj.genre.push(genre.name);
      });
      if (newObj.bgImg == null) {
        newObj.bgImg = "img/uknownGameImg.gif";
      }

      data.push(newObj);
      allData.push(newObj);
      if(add){
        let newGameDiv = createGameDiv(newObj);
      addGame(newGameDiv);
      }
    })
    .catch((err) => {
      console.log(err);
    });
}

function addGame(gameDiv) {
  gridContainer.appendChild(gameDiv);
}

function createGameDiv(gameObj) {
  let gameId = gameObj.id;
  let gameName = gameObj.name;
  let gamePublisher = gameObj.publisher;
  let gameGenres = gameObj.genre;
  let gameRating = gameObj.rating;
  let gameBg = gameObj.bgImg;
  let gameUrl = gameObj.url;
  let gameCard = document.createElement("div");
  gameCard.classList.add("game-card");

  let delBtn = document.createElement("button");
  delBtn.classList.add("delBtn");

  let xIcon = document.createElement("i");
  xIcon.classList.add("fas", "fa-times");

  delBtn.appendChild(xIcon);
  delBtn.addEventListener("click", (e) => {
    e.stopImmediatePropagation();
    let toDelete = e.currentTarget.parentElement;
    let id = toDelete.getAttribute("data-id");
    removeById(id);
    gridContainer.removeChild(toDelete);
  });

  gameCard.appendChild(delBtn);

  let gameInfo = document.createElement("div");
  gameInfo.classList.add("game-info");

  let showName = document.createElement("h4");
  showName.innerHTML = gameName;

  let showPublisher = document.createElement("h5");
  showPublisher.innerHTML = gamePublisher;

  let showGenre = document.createElement("p");

  if (gameGenres.length === 0) {
    showGenre.innerHTML = "not known";
  }

  gameGenres.forEach((genre) => {
    showGenre.innerHTML += `${genre} `;
  });

  let stars = addStars(gameRating);
  let imgDiv = addBackgroundImg(gameBg);

  gameInfo.appendChild(showName);
  gameInfo.appendChild(showPublisher);
  gameInfo.appendChild(showGenre);
  gameInfo.appendChild(stars);

  gameCard.appendChild(imgDiv);
  gameCard.appendChild(gameInfo);
  gameCard.setAttribute("title", gameName);
  gameCard.setAttribute("data-id", gameId);

  gameCard.addEventListener("click", (e) => {
    let win = window.open(gameUrl, "_blank");
    win.focus();
  });
  return gameCard;

  function addStars(rating) {
    let starsDiv = document.createElement("div");
    starsDiv.classList.add("stars");

    let counter = 0;
    for (let i = 0; i < 5; i++) {
      let star = document.createElement("i");
      star.classList.add("fas", "fa-star");
      if (counter < rating) {
        star.classList.add("yellow");
        counter++;
      }
      starsDiv.appendChild(star);
    }

    return starsDiv;
  }

  function addBackgroundImg(url) {
    let imgDiv = document.createElement("div");
    imgDiv.classList.add("game-img");

    imgDiv.style.background = `url("${url}") center center no-repeat`;
    imgDiv.style.backgroundSize = "cover";

    return imgDiv;
  }
}

function removeById(id){
  let gameToDelete = data.find(game => game.id == id);
  let index = data.indexOf(gameToDelete)
  console.log(gameToDelete)
  data.slice(index,1);
}

function displayFoundGames(foundGames) {
  console.log(foundGames)
  foundGames.forEach(game => {
    const index = data.indexOf(game);
    data.splice(index,1);
  })
  foundGames.forEach((game) => fetchOneGame(game.id,true));
}

function searchGames() {
  let selectedOption = ratingsOptions[ratingsOptions.selectedIndex].value;
  let searchText = inputText.value.toLowerCase();
  let foundGames =[];


  if (nameRadio.checked) {
    foundGames = data.filter(
      (game) =>
        game.name.toLowerCase().includes(searchText) &&
        game.rating >= selectedOption
    );
  } else {
    data.forEach((game) => {
      console.log(game)
      game.genre.forEach((genre) => {
        if (
          genre.toLowerCase().includes(searchText) &&
          game.rating >= selectedOption
        ) {
          foundGames.push(game);
        }
      });
    });
  }

  return foundGames;
}
