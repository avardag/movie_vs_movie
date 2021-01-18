const createAutoComplete = ({
  root,
  renderOption,
  onOptionSelect,
  inputValue,
  fetchData,
}) => {
  // const root = document.querySelector(".autocomplete");
  root.innerHTML = `
    <div>
    <label class="label"><b>Search here</b></label>
    <input class="search-input"/>
    </div>
    <div class="dropdown">
      <div class="dropdown-menu">
        <div class="dropdown-content results">
        
        </div>
      </div>
    </div>
`;

  const searchInput = root.querySelector(".search-input");
  const dropdown = root.querySelector(".dropdown");
  const resultsWrapper = root.querySelector(".results");

  const onInput = async (event) => {
    const items = await fetchData(url, event.target.value);
    //clear previous search results before searching
    resultsWrapper.innerHTML = "";

    if (items.length === 0) {
      dropdown.classList.add("is-active");
      resultsWrapper.innerHTML = `<p class="dropdown-item has-text-danger">Nothing found</p>`;
    } else {
      dropdown.classList.add("is-active");
      resultsWrapper.innerHTML = "";
      for (let item of items) {
        const option = document.createElement("a");
        option.classList.add("dropdown-item");
        option.innerHTML = renderOption(item);
        option.addEventListener("click", () => {
          dropdown.classList.remove("is-active");
          searchInput.value = inputValue(item);
          onOptionSelect(item);
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
};
