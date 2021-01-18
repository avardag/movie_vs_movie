const url = "http://www.omdbapi.com/";
const apikey = "2305f86f";

const summaryLeft = document.querySelector(".left-summary");
const summaryRight = document.querySelector(".right-summary");
const autoCompleteLeft = document.querySelector("#left-autocomplete");
const autoCompleteRight = document.querySelector("#right-autocomplete");

const autoCompleteConfig = {
  renderOption(movie) {
    return `
        <img src="${movie.Poster === "N/A" ? "" : movie.Poster}" alt="">
        ${movie.Title} (${movie.Year})
    `;
  },

  inputValue(movie) {
    return movie.Title;
  },
  async fetchData(url, searchterm) {
    const response = await axios.get(url, {
      params: {
        apikey,
        s: searchterm,
      },
    });
    if (response.data.Error) return []; //if nothing found return empty arr
    return response.data.Search;
  },
};

createAutoComplete({
  root: autoCompleteLeft,
  onOptionSelect(movie) {
    document.querySelector(".tutorial").classList.add("is-hidden");
    onMovieSelect(movie, summaryLeft);
  },
  ...autoCompleteConfig,
});
createAutoComplete({
  root: autoCompleteRight,
  onOptionSelect(movie) {
    document.querySelector(".tutorial").classList.add("is-hidden");
    onMovieSelect(movie, summaryRight);
  },
  ...autoCompleteConfig,
});

const onMovieSelect = async (movie, summaryElement) => {
  const response = await axios.get(url, {
    params: {
      apikey,
      i: movie.imdbID,
    },
  });
  summaryElement.innerHTML = renderMovie(response.data);
};

const renderMovie = (movieDetails) => {
  return `
  <article class="media">
    <figure class="media-left">
      <p class="image">
        <img src="${movieDetails.Poster}" alt="${movieDetails.Title}">
      </p>
    </figure>
    <div class="media-content">
      <div class="content">
        <h1>${movieDetails.Title}</h1>
        <h4>${movieDetails.Genre}</h4>
        <p>${movieDetails.Plot}</p>
      </div>
    </div>
  </article>
  <article class="notification is-primary">
    <p class="title">${movieDetails.Awards}</p>
    <p class="subtitle">Awards</p>
  </article>
  <article class="notification is-primary">
    <p class="title">${movieDetails.BoxOffice}</p>
    <p class="subtitle">Box Office</p>
  </article>
  <article class="notification is-primary">
    <p class="title">${movieDetails.Metascore}</p>
    <p class="subtitle">Metascore</p>
  </article>
  <article class="notification is-primary">
    <p class="title">${movieDetails.imdbRating}</p>
    <p class="subtitle">IMDB Rating</p>
  </article>
  <article class="notification is-primary">
    <p class="title">${movieDetails.imdbVotes}</p>
    <p class="subtitle">IMDB Votes</p>
  </article>
  `;
};
