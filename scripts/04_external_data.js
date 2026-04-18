import http from 'k6/http';
import { check, sleep, group } from 'k6'; // Añadimos group
import { SharedArray } from 'k6/data';
import papaparse from 'https://jslib.k6.io/papaparse/5.1.1/index.js';

const csvData = new SharedArray('usuarios', function () {
  return papaparse.parse(open('../data/usuarios.csv'), { header: true }).data;
});

export const options = {
  vus: 3,
  duration: '5s',
  thresholds: {
    'group_duration{group:::Login}': ['p(95)<500'], // Umbral específico para el Login
    'group_duration{group:::Navegacion}': ['p(95)<1000'],
  },
};

export default function () {
  const usuario = csvData[__VU % csvData.length];

  // GRUPO 1: Proceso de Login
  group('Login', function () {
    const payload = JSON.stringify({ user: usuario.username, pass: usuario.password });
    const params = { headers: { 'Content-Type': 'application/json' } };
    
    const res = http.post('https://httpbin.test.k6.io/post', payload, params);

    check(res, {
      'status es 200': (r) => r.status === 200,
    });
  });

  // GRUPO 2: Proceso de Navegación
  group('Navegacion', function () {
    http.get('https://test.k6.io/static/css/site.css');
    sleep(0.5);
    http.get('https://test.k6.io/contact.php');
  });

  sleep(1);
}