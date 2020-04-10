const gridContainer = document.querySelector(".grid-container");
const loadMoreBtn = document.getElementById("load-more");
const data = [];

let pointer;
let count = 3;

(function loadMoreModule() {
  loadMoreBtn.addEventListener("click", loadThree);

  (function loadFirstThree() {
    let i;
    for (i = 0; i <= count; i++) {
      fetchOneGame(i);
    }
    pointer = i;
    count += 3;
  })();
})();

function loadThree() {
  console.log("BEFORE\npointer: " + pointer + ", count: " + count);
  let i;
  for (i = pointer; i <= count; i++) {
    fetchOneGame(i);
  }
  pointer = i;
  count += 3;
  console.log("AFTER\npointer: " + pointer + ", count: " + count);
}

function fetchOneGame(id) {
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
        newObj.bgImg = "../code-2/img/uknownGameImg.gif";
      }

      data.push(newObj);
      let newGameDiv = createGameDiv(newObj);
      addGame(newGameDiv);
    })
    .catch((err) => {
      console.log(err);
    });
}

function addGame(gameDiv) {
  gridContainer.appendChild(gameDiv);
}

function createGameDiv(gameObj) {
  let gameName = gameObj.name;
  let gamePublisher = gameObj.publisher;
  let gameGenres = gameObj.genre;
  let gameRating = gameObj.rating;
  let gameBg = gameObj.bgImg;
  let gameCard = document.createElement("div");
  gameCard.classList.add("game-card");

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
