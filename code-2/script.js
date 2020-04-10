const gridContainer = document.querySelector('.grid-container');
const data = [];

let count = 70;
for (let i = 0; i < count; i++) {
  fetchOneGame(i);

}

console.log(data);

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
        newObj.publisher = 'not known';
      } else if (obj.publishers[0] === undefined) {
        newObj.publisher = 'not known';
      } else {
        newObj.publisher = obj.publishers[0].name;
      }
      newObj.rating = obj.rating_top;
      newObj.url = obj.stores[0].url;

      [...obj.genres].forEach((genre) => {
        newObj.genre.push(genre.name);
      });
      data.push(newObj);
      let newGameDiv = createGameDiv(newObj);
      addGame(newGameDiv);
    })
    .catch((err) => {
      console.log(err);
    });
}


function addGame(gameDiv){
  gridContainer.appendChild(gameDiv);
}

function createGameDiv(gameObj){
  let gameName = gameObj.name;
  let gamePublisher = gameObj.publisher;
  let gameGenres = gameObj.genre;
  let gameRating = gameObj.rating;
  let gameBg = gameObj.bgImg;
  let gameCard = document.createElement('div');
  gameCard.classList.add('game-card');

  let gameInfo = document.createElement('div');
  gameInfo.classList.add('game-info');

  let showName = document.createElement('h4');
  showName.innerHTML = gameName;

  let showPublisher = document.createElement('h4');
  showPublisher.innerHTML = gamePublisher;

  let showGenre = document.createElement('p');
  gameGenres.forEach(genre => {
    showGenre.innerHTML += `|${genre}|`
  })

  let stars = addStars(gameRating);

  gameInfo.appendChild(showName);
  gameInfo.appendChild(showPublisher);
  gameInfo.appendChild(showGenre)
  gameInfo.appendChild(stars);

  addBackgroundImg(gameBg);
  gameCard.appendChild(gameInfo);

  return gameCard;

  function addStars(rating){
    let starsDiv = document.createElement('div');
    starsDiv.classList.add('stars');

    let counter = 0;
    for (let i = 0; i < 5; i++) {
      let star = document.createElement('i');
      star.classList.add('fas','fa-star');
      if(counter<rating){
        star.classList.add('yellow');
        counter++;
      }   
      starsDiv.appendChild(star);
    }

    return starsDiv;
  }

  function addBackgroundImg(url){
    gameCard.style.background = `url(${url})`;
    gameCard.style.backgroundRepeat = 'no-repeat';
    gameCard.style.backgroundSize= 'cover';

  }


}
