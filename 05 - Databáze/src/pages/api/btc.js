
const axios = require('axios')

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

///
/// Handles api/btc request
///
export default async (req, res) => {
  const btcRes = await fetchBTC()
  res.statusCode = 200
  res.json({ ...btcRes })
}