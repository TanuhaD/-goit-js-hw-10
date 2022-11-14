import "./css/styles.css";
import { fetchCountries } from "./fetchCountries.js";
import debounce from "lodash.debounce";
import { Notify } from "notiflix";

const DEBOUNCE_DELAY = 300;

const inputEl = document.querySelector("#search-box");
const listEl = document.querySelector(".country-list");
const countryEl = document.querySelector(".country-info");

function handleInputChange(event) {
  const name = event.target.value.trim();
  if (name === "") {
    return;
  }
  listEl.innerHTML = "";
  countryEl.innerHTML = "";
  fetchCountries(name)
    .then((data) => {
      console.log(data);
      if (data.length > 10) {
        Notify.info(
          "Too many matches found. Please enter a more specific name."
        );
        return;
      }
      if (data.length === 1) {
        showOneCountry(data[0]);
        return;
      }
      showAllCountries(data);
    })
    .catch((error) => {
      console.log(error);

      Notify.failure("Oops, there is no country with that name");
    });
}
function showOneCountry(oneCountry) {
  console.log(oneCountry);
  const languages = Object.values(oneCountry.languages).join(", ");
  const markup = `<img class="flag" src="${oneCountry.flags.png}" alt="${oneCountry.name.common}" /><span class="text-explanation">${oneCountry.name.official}</span>
  <p class="text">Capital: ${oneCountry.capital[0]}</p>
  <p class="text">Population: ${oneCountry.population}</p>
  <p class="text">Language: ${languages}</p>`;
  countryEl.innerHTML = markup;
}

function showAllCountries(allCountries) {
  const markup = allCountries
    .map((country) => {
      return `<li><img class="flag" src="${country.flags.png}" alt="${country.name.common}" /><span class="text-info">${country.name.official}</span></li>`;
    })
    .join("");
  listEl.innerHTML = markup;

  console.log(allCountries);
}
inputEl.addEventListener("input", debounce(handleInputChange, DEBOUNCE_DELAY));
