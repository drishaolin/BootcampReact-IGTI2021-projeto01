function fetchJson(url) {
  return fetch(url).then((resp) => resp.json());
}

function formatNumber(n) {
  return new Intl.NumberFormat("pt-br").format(n);
}

function renderData(id, kpi) {
  return (document.getElementById(id).innerHTML = formatNumber(kpi));
}

const baseURL = "https://api.covid19api.com";

async function getCovidData() {
  let data = await fetchJson(`${baseURL}/summary`);
  let global = data.Global;
  let countriesArray = data.Countries;
  return { global, countriesArray };
}

(async function populateGlobalData() {
  ({ global } = await getCovidData());
  renderData("confirmed", global.TotalConfirmed);
  renderData("death", global.TotalDeaths);
  renderData("recovered", global.TotalRecovered);
  let day = global.Date.slice(8, 10);
  let month = global.Date.slice(5, 7);
  let year = global.Date.slice(0, 4);
  let currentDate = `${day}/${month}/${year}`;

  document.getElementById("actives").innerHTML = "Data de Atualização";
  document.getElementById(
    "active"
  ).innerHTML = `${currentDate} - ${global.Date.slice(11, 16)}`;
})();

async function populateComboCountries() {
  ({ countriesArray } = await getCovidData());
  countriesList = countriesArray.map((item) => {
    return { country: item.Country, slug: item.Slug };
  });
  
  //prettier-ignore
  countriesList.forEach((item) =>
      (document.getElementById("combo").innerHTML += `<option value=${item.slug} >${item.country}</option>`)
  );
}

async function populateCountriesData() {
    let selectedDate = document.getElementById("today").value;
    let selectedCountry = document.getElementById("combo").value;
    let startDate = `${selectedDate}T00:00:00Z`;
    let endDate = `${selectedDate}T23:59:59Z`;
    let country = await fetchJson(`${baseURL}/country/${selectedCountry}?from=${startDate}&to=${endDate}`);
      
  renderData("confirmed", country[0].Confirmed);
  renderData("death", country[0].Deaths);
  renderData("recovered", country[0].Recovered);
  document.getElementById("actives").innerHTML = "Ativos";
  renderData("active", country[0].Active);
}