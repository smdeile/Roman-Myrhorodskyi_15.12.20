import './styles.css';
import movieModal from './templates/movie-modal.hbs';
import listItem from './templates/list-item-movie.hbs';
import favoriteItem from './templates/favorite-item.hbs';
import moviesService from './services/get-movies';

const moviesListElement = document.querySelector('.movies__list');
const favoriteList = document.querySelector('.favorite__list');

const getFavoriteMovies = () => localStorage.getItem('favoriteMovies');
const arrayFavorite = getFavoriteMovies()?.split(',');

if (getFavoriteMovies() === null) {
  localStorage.setItem('favoriteMovies', []);
}

function checkFavoritesList() {
  if (getFavoriteMovies()) {
    const markupFavoriteList = favoriteItem(
      getFavoriteMovies()
        .split(',')
        .sort(function (a, b) {
          return a - b;
        }),
    );
    favoriteList.innerHTML = markupFavoriteList;
  } else {
    favoriteList.innerHTML = '<li><p>There are no favorite movies yet</p></li>';
  }
}

function setFavoriteMovie(id) {
  if (getFavoriteMovies()) {
    if (
      !getFavoriteMovies()
        .split(',')
        .find(el => el == id)
    ) {
      localStorage.setItem('favoriteMovies', [...getFavoriteMovies(), ...id]);
      checkFavoritesList();
      return;
    }
  } else {
    localStorage.setItem('favoriteMovies', [id]);
  }
}

function removeFavorite(id) {
  const array = getFavoriteMovies()?.split(',');
  const index = array.indexOf(id);
  if (index > -1) {
    array.splice(index, 1);
    localStorage.setItem('favoriteMovies', array);
    checkFavoritesList();
  }
}

function removeFavoriteFromList(event) {
  const id = event.target.id;

  if (event.target.classList[0] === 'favorite__delete-button') {
    toggleLikeMovie(id);
  }
}
async function fetchMovies() {
  const moviesList = await moviesService.fetchArticles();
  return moviesList;
}
async function fetchSingleMovie(id) {
  const movie = await moviesService.fetchMovie(id);
  return movie;
}

function modalOpening(id) {
  fetchSingleMovie(id).then(singleMovie => {
    moviesListElement.insertAdjacentHTML('beforeend', movieModal(singleMovie));
    const modal = moviesListElement.querySelector('.modal__background');
    if (
      getFavoriteMovies()
        .split(',')
        .find(el => el == id)
    ) {
      modal.querySelector('.star-button').classList.add('like');
    }
  });
}

const toggleLikeMovie = id => {
  const currentActiveLink = document.getElementById(id);
  const modal = document.querySelector('.modal__background');

  if (modal) {
    const modalLikeMovie = modal.querySelector('.star-button');
    if (modalLikeMovie?.className.includes('like')) {
      modalLikeMovie.classList.remove('like');
      currentActiveLink.classList.remove('like');
      removeFavorite(id);
      return;
    }
    setFavoriteMovie(id);
    modalLikeMovie?.classList.add('like');
    currentActiveLink.classList.remove('like');
  }

  if (currentActiveLink?.className.includes('like')) {
    currentActiveLink.classList.remove('like');
    removeFavorite(id);
    return;
  }

  if (id) {
    setFavoriteMovie(id);
    currentActiveLink?.classList.add('like');
    checkFavoritesList();
  }
};

function handleClick(event) {
  const target = event.target;
  const targetId = target.id;
  const modal = document.querySelector('.modal__background');
  if (target.className.includes('star-button')) {
    toggleLikeMovie(targetId);
    return;
  }
  if (target.parentNode.id.includes('movie')) {
    const id = target.parentNode.id?.split('movie').join('');
    modalOpening(id);
  }
  if (target.classList[0] === 'modal__close-button' && modal) {
    moviesListElement.removeChild(modal);
  }
}

fetchMovies()
  .then(moviesList => {
    moviesListElement.insertAdjacentHTML('beforeend', listItem(moviesList));
  })
  .then(() => {
    moviesListElement.addEventListener('click', handleClick);
    checkFavoritesList();

    favoriteList.addEventListener('click', removeFavoriteFromList);
    arrayFavorite?.map(el => toggleLikeMovie(el));
  });
