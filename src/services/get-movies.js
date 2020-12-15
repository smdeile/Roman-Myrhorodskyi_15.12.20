const moviesAPI = 'http://my-json-server.typicode.com/moviedb-tech/movies/list';
export default {
  async fetchArticles() {
    return fetch(moviesAPI).then(response => response.json());
  },
  async fetchMovie(id) {
    return fetch(`${moviesAPI}/${id}`).then(response => response.json());
  },
};
