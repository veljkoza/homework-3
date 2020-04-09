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
      let newObj = {
        id: 0,
        bgImg: "",
        name: "",
        publisher: "",
        genre: [],
        rating: 0,
        url: "",
      };
      newObj.id = obj.id;
      newObj.bgImg = obj.background_image;
      newObj.name = obj.name;
      if (obj.publishers === undefined) {
        newObj.publisher = "not known";
	  }else if(obj.publishers[0] === undefined){
        newObj.publisher = obj.publishers[0].name;
	  }
	   else {
        newObj.publisher = obj.publishers[0].name;
      }
      newObj.rating = obj.rating_top;
      newObj.url = obj.stores[0].url;

      [...obj.genres].forEach((genre) => {
        newObj.genre.push(genre.name);
      });

      data.push(newObj);
    })
    .catch((err) => {
      console.log(err);
    });
}
