import http from 'k6/http'
import { sleep, check } from 'k6'

export const options = {
  stages: [
    { duration: '30s', target: 3000 },
    { duration: '1m', target: 3000 },
    { duration: '10s', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<200'],
  },
}

const BASE_URL = 'http://localhost:3000'

export default function () {
  const response = http.get(`${BASE_URL}/tracks/new`)

  check(response, {
    'is status 200': (r) => r.status === 200,
    'response has data': (r) => JSON.parse(r.body).data.length >= 0,
  })

  sleep(1)
}
