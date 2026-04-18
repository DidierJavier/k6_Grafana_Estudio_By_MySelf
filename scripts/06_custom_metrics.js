import http from 'k6/http';
import { sleep } from 'k6';
import { Counter, Trend } from 'k6/metrics'; // Importamos los tipos de métricas

// Definimos nuestras métricas globales (Nivel Senior)
const comprasRealizadas = new Counter('total_compras');
const pesoContenido = new Trend('peso_de_respuesta');

export const options = {
  vus: 5,
  duration: '10s',
  thresholds: {
    // También podemos poner umbrales a nuestras propias métricas
    total_compras: ['count > 10'], 
    peso_de_respuesta: ['p(95) < 5000'], // Que el 95% pese menos de 5KB
  },
};

export default function () {
  const res = http.get('https://test.k6.io/');

  // 1. Registramos el peso de la respuesta en nuestra métrica Trend
  pesoContenido.add(res.body.length);

  // 2. Simulamos una compra lógica
  if (res.status === 200) {
    comprasRealizadas.add(1); // Sumamos 1 al contador
  }

  sleep(1);
}