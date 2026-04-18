import http from 'k6/http';
import { check, sleep } from 'k6';

// Simulación de una base de datos de productos
const productos = ['apple', 'orange', 'banana', 'crocodile'];

export const options = {
  vus: 5,
  duration: '10s',
  thresholds: {
    // Añadimos esto solo para que k6 lo imprima en el resumen
    'http_req_waiting': ['p(95)>0'], 
  },
};

export default function () {
  // Elegimos un producto aleatorio en cada iteración
  const productoAzar = productos[Math.floor(Math.random() * productos.length)];
  
  // URL dinámica
  const res = http.get(`https://test.k6.io/?item=${productoAzar}`);

  check(res, {
    'status es 200': (r) => r.status === 200,
    'URL contiene producto': (r) => r.url.includes(productoAzar),
  });

  sleep(1);
}