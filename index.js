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
    onMovieSelect(movie, summaryLeft, "left");
  },
  ...autoCompleteConfig,
});
createAutoComplete({
  root: autoCompleteRight,
  onOptionSelect(movie) {
    document.querySelector(".tutorial").classList.add("is-hidden");
    onMovieSelect(movie, summaryRight, "right");
  },
  ...autoCompleteConfig,
});

let rightMovie;
let leftMovie;

const onMovieSelect = async (movie, summaryElement, side) => {
  const response = await axios.get(url, {
    params: {
      apikey,
      i: movie.imdbID,
    },
  });
  summaryElement.innerHTML = renderMovie(response.data);

  if (side === "left") {
    leftMovie = response.data;
  } else {
    rightMovie = response.data;
  }

  if (leftMovie && rightMovie) {
    runcomparison();
  }
};

const runcomparison = () => {
  const leftSideStats = document.querySelectorAll(
    ".left-summary .notification "
  );
  const rightSideStats = document.querySelectorAll(
    ".right-summary .notification "
  );

  leftSideStats.forEach((leftStatEl, index) => {
    const rightStatEl = rightSideStats[index];
    if (rightStatEl.dataset.value > leftStatEl.dataset.value) {
      leftStatEl.classList.remove("is-primary");
      leftStatEl.classList.add("is-warning");
    } else {
      rightStatEl.classList.remove("is-primary");
      rightStatEl.classList.add("is-warning");
    }
  });
};
const renderMovie = (movieDetails) => {
  const dollars = parseInt(
    movieDetails.BoxOffice.replace(/\$/g, "").replace(/,/g, "")
  );
  const metascore = parseInt(movieDetails.Metascore);
  const imdbRating = parseFloat(movieDetails.imdbRating);
  const imdbVotes = parseInt(movieDetails.imdbVotes.replace(/,/g, ""));

  const awards = movieDetails.Awards.split(" ").reduce((acc, curr) => {
    const value = parseInt(curr);
    if (typeof value === "number" && !isNaN(value)) {
      return acc + value;
    } else {
      return acc;
    }
  }, 0);

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
  <article data-value=${awards} class="notification is-primary">
    <p class="title">${movieDetails.Awards}</p>
    <p class="subtitle">Awards</p>
  </article>
  <article data-value=${dollars} class="notification is-primary">
    <p class="title">${movieDetails.BoxOffice}</p>
    <p class="subtitle">Box Office</p>
  </article>
  <article data-value=${metascore} class="notification is-primary">
    <p class="title">${movieDetails.Metascore}</p>
    <p class="subtitle">Metascore</p>
  </article>
  <article data-value=${imdbRating} class="notification is-primary">
    <p class="title">${movieDetails.imdbRating}</p>
    <p class="subtitle">IMDB Rating</p>
  </article>
  <article data-value=${imdbVotes} class="notification is-primary">
    <p class="title">${movieDetails.imdbVotes}</p>
    <p class="subtitle">IMDB Votes</p>
  </article>
  `;
};
