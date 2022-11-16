import "./css/styles.css";
import { fetchCountries } from "./fetchCountries.js";
import debounce from "lodash.debounce";
import { Notify } from "notiflix";

const DEBOUNCE_DELAY = 600;

const inputEl = document.querySelector("#search-box");
const listEl = document.querySelector(".country-list");
const infoEl = document.querySelector(".country-info");

function handleInputChange(event) {
  const inputValue = event.target.value.trim();
  if (inputValue === "") {
    return;
  }

  const response = fetchCountries(inputValue)
    .then((data) => {
      console.log(data);
      if (data.length > 10) {
        Notify.info(
          "Too many matches found. Please enter a more specific name."
        );
        return;
      }
      if (data.length === 1) {
        listEl.innerHTML = "";
        showOneConutry(data[0]);
        return;
      }
      infoEl.innerHTML = "";
      showListCountries(data);
    })
    .catch((error) => {
      console.log(error);
      Notify.failure("Oops, there is no country with that name");
    });
}
function showOneConutry(oneCountry) {
  const languages = Object.values(oneCountry.languages).join(", ");
  const markup = `<img class="flag" src="${oneCountry.flags.svg}" alt="${oneCountry.name.common}" ><span class="text-explanation">${oneCountry.name.common}</span>
    <p class="text">Capital: ${oneCountry.capital[0]}</p>
    <p class="text">Population: ${oneCountry.population}</p>
     <p class="text">Language: ${languages}</p>`;
  infoEl.innerHTML = markup;
}

function showListCountries(listOfCountries) {
  const markup = listOfCountries
    .map((oneCountry) => {
      return `<li><img class="flag" src="${oneCountry.flags.svg}" alt="${oneCountry.name.common}" /><span class="text-info">${oneCountry.name.common}</span></li>`;
    })
    .join("");
  listEl.innerHTML = markup;
}

inputEl.addEventListener("input", debounce(handleInputChange, DEBOUNCE_DELAY));

//
