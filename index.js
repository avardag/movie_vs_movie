const url = "http://www.omdbapi.com/";
const apikey = "2305f86f";

const fetchData = async (url, searchterm) => {
  const response = await axios.get(url, {
    params: {
      apikey,
      // s: "avengers",
      s: searchterm,
      // i: "tt0848228",
    },
  });
  if (response.data.Error) return []; //if nothing found return empty arr
  return response.data.Search;
};

const root = document.querySelector(".autocomplete");
root.innerHTML = `
    <div>
    <label class="label"><b>Search for a movie</b></label>
    <input class="search-input"/>
    </div>
    <div class="dropdown">
      <div class="dropdown-menu">
        <div class="dropdown-content results">
        
        </div>
      </div>
    </div>
`;

const searchInput = document.querySelector(".search-input");
const dropdown = document.querySelector(".dropdown");
const resultsWrapper = document.querySelector(".results");

const onInput = async (event) => {
  const movies = await fetchData(url, event.target.value);
  //clear previous search results before searching
  resultsWrapper.innerHTML = "";

  if (movies.length === 0) {
    dropdown.classList.add("is-active");
    resultsWrapper.innerHTML = `<p class="dropdown-item has-text-danger">Nothing found</p>`;
  } else {
    dropdown.classList.add("is-active");
    resultsWrapper.innerHTML = "";
    for (let m of movies) {
      const option = document.createElement("a");
      option.classList.add("dropdown-item");
      option.innerHTML = `
        <img src="${m.Poster === "N/A" ? "" : m.Poster}" alt="">
        ${m.Title}
    `;
      option.addEventListener("click", () => {
        dropdown.classList.remove("is-active");
        searchInput.value = m.Title;
        onMovieSelect(m);
      });
      resultsWrapper.appendChild(option);
    }
  }
};

searchInput.addEventListener("input", debounce(onInput, 500));

document.addEventListener("click", (event) => {
  if (!root.contains(event.target)) {
    dropdown.classList.remove("is-active");
  }
});

const onMovieSelect = async (movie) => {
  const response = await axios.get(url, {
    params: {
      apikey,
      i: movie.imdbID,
    },
  });
  document.querySelector(".summary").innerHTML = renderMovie(response.data);
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
