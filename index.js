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

const searchInput = document.querySelector(".search-input");

const onInput = async (event) => {
  const movies = await fetchData(url, event.target.value);
  const targetDiv = document.querySelector("#target");
  if (movies.length === 0) {
    targetDiv.innerHTML = `<p class="has-text-danger">Nothing found</p>`;
  } else {
    targetDiv.innerHTML = "";
    for (let m of movies) {
      const div = document.createElement("div");
      div.innerHTML = `
    <img src="${m.Poster ? m.Poster : null}" alt="">
        <h1>${m.Title}</h1>
    `;
      targetDiv.appendChild(div);
    }
  }
};

searchInput.addEventListener("input", debounce(onInput, 500));
