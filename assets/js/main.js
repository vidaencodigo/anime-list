var array = []; // this array contents all favs 
let animes = [];
if (localStorage.getItem('anime') === null) {
  localStorage.setItem('anime', '[]');
}
array = JSON.parse(localStorage.getItem('anime') || '[]');


async function getAnime() {
  // get anime by name
  const input = document.querySelector('.input--search')
  const anime = input.value
  const url = `https://api.jikan.moe/v4/anime?q=${anime}&sfw&limit=24&type=tv`;
  document.querySelector('.anime--list').innerHTML = `<h2>Loading</h2>`;
  const response = await fetch(url);
  const data = await response.json();
  document.querySelector('.anime--list').innerHTML = '';
  try {
    if (data.data.length === 0) {
      // can we put image not found
      document.querySelector('.anime--list').innerHTML = `<h2>Not found</h2>`;
    }
    data.data.forEach(anime => {
      let image = anime.images.jpg.large_image_url
      let title = anime.title // anime.title_english
      let id = anime.mal_id;
      create_card(image, title, id);
    })

  } catch (error) {
    console.log(error);
  }
}
async function getRandomAnime() {
  // get random anime from api
  const url = `https://api.jikan.moe/v4/anime?sfw&limit=24&type=tv&order_by=popularity&page=1`;
  const page = new URL(url).searchParams.get('page');
  document.querySelector('.anime--list').innerHTML = `<h2>Loading</h2>`;
  const response = await fetch(url);
  const data = await response.json();
  console.log("actual page: " + page);
  console.log("datos de paginacion: " + JSON.stringify(data.pagination));
  document.querySelector('.anime--list').innerHTML = ``;
  return data.data

}


function create_card(image, title, id) {
  animes = array.map(anime => {
    return JSON.parse(anime);
  })
  const card = document.createElement('section');
  card.classList.add('card', 'retro--card');
  // image section
  const cardImage = document.createElement('div');
  cardImage.classList.add('card--image');
  const img = document.createElement('img');
  img.classList.add('responsive');
  img.src = image;
  cardImage.appendChild(img);

  // title section
  const cardTitle = document.createElement('div');
  cardTitle.classList.add('card--title');
  const h3 = document.createElement('h3');
  h3.textContent = title;
  cardTitle.appendChild(h3);

  // actions section
  const cardActions = document.createElement('div');
  cardActions.classList.add('card--actions');
  const buttons = document.createElement('div');
  buttons.classList.add('buttons');

  const button_details = document.createElement('button');
  button_details.classList.add('button', 'retro--btn', 'btn--flat');
  button_details.setAttribute('data-anime-id', id);
  button_details.textContent = 'Details';

  const button_fv = document.createElement('button');
  button_fv.classList.add('button', 'retro--btn', 'btn--flat');
  button_fv.setAttribute('data-id', id);
  button_fv.setAttribute('data-title', title);
  button_fv.setAttribute('data-image', image);
  button_fv.textContent = 'Favorite';
  button_fv.addEventListener('click', addFav);
  if (!animes.find(anime => anime.id === id)) {
    // if it in favs not add btn
    buttons.appendChild(button_fv);
  }
  buttons.appendChild(button_details);

  cardActions.appendChild(buttons);

  card.appendChild(cardImage);
  card.appendChild(cardTitle);
  card.appendChild(cardActions);

  document.querySelector('.anime--list').appendChild(card);
}

function addFav(event) {
  const animeId = event.target.getAttribute('data-id');
  const animeTitle = event.target.getAttribute('data-title');
  const animeImage = event.target.getAttribute('data-image');

  let json = JSON.stringify({
    id: parseInt(animeId),
    title: animeTitle,
    image: animeImage
  });

  console.log(json);
  // here we save the anime in local storage, pending verify the favs saved
  saveLocalStorage(json);
  loadAnimes();

}

function saveLocalStorage(json) {
  try {

    array.push(json);
    localStorage.setItem('anime', JSON.stringify(array));
    myFunc();
  } catch (error) {
    console.log(error);
  }
}
function myFunc() {
  // show toast
  Toastify({
    text: "Added to favs",
    duration: 2000,
    gravity: "bottom", // `top` or `bottom`
    position: "right", // `left`, `center` or `right`
    style: {
      background: "linear-gradient(to right, #00b09b, #96c93d)",
    }
  }).showToast();
}
// JSON.parse(localStorage.getItem('anime')) get favs anime

function loadAnimes() {
  getRandomAnime().then(anime => {
    anime.forEach(anime => {
      let image = anime.images.jpg.large_image_url
      let title = anime.title
      let id = anime.mal_id;
      create_card(image, title, id);
    })
  }).catch(error => {
    console.log(error);
  })
}