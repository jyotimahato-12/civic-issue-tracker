import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 50,          // Simulate 50 simultaneous users
  duration: '20s',  // Run the traffic pressure for 20 seconds
};

export default function () {
  // Target your API route that reads the un-indexed issues collection
  const url = 'http://localhost:5000/api/issues'; 
  const res = http.get(url);

  check(res, {
    'status is 200': (r) => r.status === 200,
  });

  sleep(0.1); 
}  