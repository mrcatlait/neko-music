import http from 'k6/http'
import { sleep, check } from 'k6'


const PORT = __ENV.PORT
const BASE_URL = `http://localhost:${PORT}`
const ADMINISTRATOR_EMAIL = __ENV.ADMINISTRATOR_EMAIL
const ADMINISTRATOR_PASSWORD = __ENV.ADMINISTRATOR_PASSWORD

export const options = {
  vus: 50,
  thresholds: {
    http_req_duration: ['p(95)<100'],
    http_req_failed: ['rate<0.01'],
  },
  stages: [
    { duration: '30s', target: 50 },
    { duration: '1m', target: 50 },
    { duration: '10s', target: 0 },
  ]
}

export function setup() {
  // Login as admin
  const loginResponse = http.post(`${BASE_URL}/auth/login`, JSON.stringify({
    email: ADMINISTRATOR_EMAIL,
    password: ADMINISTRATOR_PASSWORD,
  }), { headers: { 'Content-Type': 'application/json' } })
  
  const { accessToken } = JSON.parse(loginResponse.body)
  
  // Create genres
  http.post(`${BASE_URL}/backstage/genres`, 
    JSON.stringify({ name: 'Rock' }),
    { headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${accessToken}` } }
  )

  return { accessToken }
}

export default function (data) {
  const response = http.get(`${BASE_URL}/backstage/genres`, {
    headers: { 'Authorization': `Bearer ${data.accessToken}` }
  })

  check(response, {
    'is status 200': (r) => r.status === 200,
  })

  sleep(1)
}
