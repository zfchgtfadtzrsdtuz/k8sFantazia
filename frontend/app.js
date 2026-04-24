async function fetchJSON(path) {
  try {
    const res = await fetch(BACKEND + path);
    if (!res.ok) throw new Error('HTTP ' + res.status);
    return await res.json();
  } catch (e) {
    console.error('Fetch error', e);
    return null;
  }
}

function el(tag, props = {}, ...children) {
  const node = document.createElement(tag);
  Object.entries(props).forEach(([k, v]) => node.setAttribute(k, v));
  children.flat().forEach(c => node.append(typeof c === 'string' ? document.createTextNode(c) : c));
  return node;
}

async function loadCities() {
  const list = document.getElementById('citiesList');
  list.innerHTML = '';
  const data = await fetchJSON('/cities');
  if (!data) { list.appendChild(el('li',{class:'empty'},'Hiba a betöltés során')); return; }
  data.forEach(c => {
    const li = el('li', {}, el('span',{class:'city-name'}, c.name), el('small',{class:'small'}, 'megtekintés'));
    li.addEventListener('click', () => selectCity(c.id));
    list.appendChild(li);
  });
}

async function selectCity(id) {
  const city = await fetchJSON('/cities/' + id);
  const title = document.getElementById('cityTitle');
  const desc = document.getElementById('cityDesc');
  const alist = document.getElementById('attractionsList');
  if (!city) { title.textContent = 'Hiba'; desc.textContent = ''; alist.innerHTML = ''; return; }
  title.textContent = city.name;
  desc.textContent = city.description || '';
  alist.innerHTML = '';

  const attractions = await fetchJSON('/cities/' + id + '/attractions');
  if (!attractions || attractions.length === 0) {
    alist.appendChild(el('li',{class:'empty'},'Nincsenek látnivalók')); return;
  }
  attractions.forEach(a => {
    const li = el('li', {}, el('span', {}, a.name), el('small',{class:'small'}, 'Részletek'));
    li.addEventListener('click', () => showAttraction(a));
    alist.appendChild(li);
  });
}

function showAttraction(a) {
  alert(a.name + '\n\n' + (a.description || ''));
}

document.addEventListener('DOMContentLoaded', () => {
  loadCities();
});
