import './sass/main.scss';

import countriesCardTpl from './templates/countries-card.hbs';
import listCountryTpl from './templates/countries-list.hbs';

import API from './js/fetch-api.js';
import getRefs from './js/refs.js';

import '@pnotify/core/dist/BrightTheme.css';
import { info } from '@pnotify/core';
import '@pnotify/core/dist/PNotify.css';
import '@pnotify/core/dist/BrightTheme.css';
import * as Confirm from '@pnotify/confirm';
import '@pnotify/confirm/dist/PNotifyConfirm.css';
import { SameValueZero } from 'es-abstract';

const refs = getRefs();

refs.serchInput.addEventListener('input', _.debounce(onInputSearch, 1000));

function onInputSearch(event) {
  event.preventDefault();

  const input = event.target;
  const searchCountry = input.value.toLowerCase();

  if (searchCountry === '') {
    refs.cardContainer.innerHTML = '';
    return;
  }

  API.fetchCountriesByName(searchCountry)
    .then(createCountries)
    .catch(error => {
      console.log(error);
    });
}

function createCountries(countries) {
  refs.cardContainer.innerHTML = '';

  if (countries.length > 1) {
    if (countries.length <= 10) {
      renderList(countries);
    } else {
      onError();
    }
  } else {
    if (countries.length === undefined) {
      onSerchError(countries);
    } else {
      renderCountries(countries);
    }
  }
}

function onSerchError(value) {
  info({
    title: '❌ Error',
    text: 'Country was not found 🕵. Please, try again.',
    modules: new Map([
      [
        Confirm,
        {
          confirm: true,
          buttons: [
            {
              text: 'Ok',
              primary: true,
              click: notice => {
                notice.close();
              },
            },
          ],
        },
      ],
    ]),
  });
}

function onError() {
  info({
    title: '❌ Error',
    text: 'Too many matches found. Please entry a more specific query!',
    modules: new Map([
      [
        Confirm,
        {
          confirm: true,
          buttons: [
            {
              text: 'Ok',
              primary: true,
              click: notice => {
                notice.close();
              },
            },
          ],
        },
      ],
    ]),
  });
}

function renderCountries(country) {
  const markup = countriesCardTpl(country[0]);
  refs.cardContainer.innerHTML = markup;
}

function renderList(country) {
  const markup = listCountryTpl(country);
  refs.cardContainer.insertAdjacentHTML('beforeend', markup);
}
