import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '10s', target: 20 },
    { duration: '20s', target: 20 },
    { duration: '10s', target: 0 },
  ],
  thresholds: {
    // Añadimos esto solo para que k6 lo imprima en el resumen
    'http_req_waiting': ['p(95)>0'], 
  },
};

export default function loadTest() {
  const res = http.get('https://test.k6.io');
  
  check(res, {
    'status is 200': (r) => r.status === 200,
  });

  sleep(1);
}