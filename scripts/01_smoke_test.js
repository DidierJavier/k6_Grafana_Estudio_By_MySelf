import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
  vus: 1, // Un solo usuario para probar conexión
  duration: '5s',
};

export default function test() {
  http.get('https://test.k6.io');
  console.log('Ejecutando iteración...');
  sleep(1);
}