const axios = require('axios')
const express = require('express')

///
/// Fetches current BTC/USD price from Coindesk API
/// 
const fetchBTC = async () => {
  const res = await axios.get('https://api.coindesk.com/v1/bpi/currentprice/btc.json')
  return {
    date: res.data.time.updated, 
    value: res.data.bpi.USD.rate
  }
}

const server = express()
const port = 3000

server.get("/", async (req, res) => {
  const btcRes = await fetchBTC()
  res.send(`
      <h1>Bitcoin</h1>
      <table>
        <tr>
          <th>Date</th>
        </tr>
        <tr>
          <td>${btcRes.date}</td>
        </tr>
        <tr>
          <th>Price</th>
        </tr>
        <tr>
          <td>${btcRes.value}</td>
        </tr>
      </table>
    `
  )
})

server.listen(port, () => console.log(`Ready on http://localhost:${port}/...`)) 
