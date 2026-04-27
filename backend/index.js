const http = require('http');
const url = require('url');

const cities = [
  { id: 1, name: 'Budapest', description: 'Magyarország fővárosa, a Duna két partjával.' },
  { id: 2, name: 'Prága', description: 'A Cseh Köztársaság gyöngyszeme, történelmi városközponttal.' },
  { id: 3, name: 'Róma', description: 'Az örök város, rengeteg történelmi látnivalóval.' }
];

const attractions = [
  { id: 1, city_id: 1, name: 'Parlament', description: 'Lenyűgöző épület a Duna partján.' },
  { id: 2, city_id: 1, name: 'Halászbástya', description: 'Kilátópont a városra.' },
  { id: 3, city_id: 2, name: 'Károly-híd', description: 'Középkori híd a Moldván.' },
  { id: 4, city_id: 2, name: 'Vár', description: 'Középkori vár a Moldván.' },
  { id: 5, city_id: 3, name: 'Colosseum', description: 'Ókori amfiteátrum.' },
  { id: 6, city_id: 3, name: 'Trevi-kút', description: 'Híres barokk szökőkút.' }
];

function json(res, obj, code = 200) {
  res.writeHead(code, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
  res.end(JSON.stringify(obj));
}

function notFound(res, msg = 'Not found') {
  json(res, { error: msg }, 404);
}

const server = http.createServer((req, res) => {
  const parsed = url.parse(req.url, true);
  const parts = parsed.pathname.split('/').filter(Boolean);

  if (parsed.pathname === '/') {
    return json(res, { status: 'ok', service: 'k8sFantazia backend (embedded data)' });
  }

  if (parts.length === 1 && parts[0] === 'cities') {
    return json(res, cities.map(c => ({ id: c.id, name: c.name, description: c.description })));
  }

  if (parts.length === 2 && parts[0] === 'cities') {
    const id = parseInt(parts[1]);
    const city = cities.find(c => c.id === id);
    if (!city) return notFound(res, 'City not found');
    return json(res, city);
  }

  if (parts.length === 3 && parts[0] === 'cities' && parts[2] === 'attractions') {
    const id = parseInt(parts[1]);
    const city = cities.find(c => c.id === id);
    if (!city) return notFound(res, 'City not found');
    const list = attractions.filter(a => a.city_id === id).map(a => ({ id: a.id, name: a.name, description: a.description }));
    return json(res, list);
  }

  if (parts.length === 2 && parts[0] === 'attractions') {
    const id = parseInt(parts[1]);
    const a = attractions.find(x => x.id === id);
    if (!a) return notFound(res, 'Attraction not found');
    return json(res, a);
  }

  notFound(res);
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
