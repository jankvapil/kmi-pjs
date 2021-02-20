const axios = require('axios')

///
/// Fetches current BTC price from Coindesk API
/// 
const fetchBTC = async () => {
  const res = await axios.get('https://api.coindesk.com/v1/bpi/currentprice/btc.json')
  console.log(`Current BTC price at ${res.data.time.updated} is $${res.data.bpi.USD.rate}.`)
}

fetchBTC()