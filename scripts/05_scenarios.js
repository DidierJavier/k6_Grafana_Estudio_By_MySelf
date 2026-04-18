import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
  scenarios: {
    // Escenario 1: Usuarios constantes (Navegación)
    usuarios_lectura: {
      executor: 'constant-vus',
      vus: 5,
      duration: '20s',
      exec: 'navegar', // Nombre de la función que ejecutará este escenario
    },
    // Escenario 2: Usuarios entrando en rampa (Carga de Login)
    usuarios_compra: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '10s', target: 10 },
        { duration: '10s', target: 0 },
      ],
      exec: 'comprar', // Nombre de la función diferente
    },
  },
};

// Función para el primer escenario
export function navegar() {
  http.get('https://test.k6.io/');
  console.log('--- VU navegando la Home');
  sleep(1);
}

// Función para el segundo escenario
export function comprar() {
  http.get('https://test.k6.io/my_messages.php');
  console.log('*** VU intentando comprar/ver mensajes');
  sleep(0.5);
}