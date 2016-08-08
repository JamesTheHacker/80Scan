let argv = require('yargs').argv
let cidr = new require('cidr-js')()
let fs = require('fs')
let _ = require('lodash')
let request = require('request-promise')

require('events').EventEmitter.prototype._maxListeners = 100;

// Check if the correct arguments have been past
if(!argv.cidr || !argv.needles) {
  throw new Error('Usage: node 80scan.js --cidr=192.168.0.0/24 --needles=needles.txt')
}

// Convert the CIDR into a list of IP addresses
ips = cidr.list(argv.cidr)

if(!ips) {
  throw new Error('Invalid CIDR!')
}

// Open the needles file and convert to an array
needles = fs.readFileSync(argv.needles).toString().split('\n').filter((n) => {
  if(n) return n
})

// Loop through the IP addresses
ips.map((ip) => {

  let options = {
    url: `http://${ip}`,
    timeout: 5000,
    transform: (body, response) => {
      return {
        "ip": ip,
        "body": body,
        "headers": _.values(response.headers)
      }
    }
  }

  request(options)
  .then((response) => {

    if(argv.headers) {

      // Check the headers contain any needles
      let headers = _.intersectionWith(needles, response.headers, (needle, header) => {
        return header.indexOf(needle) !== -1
      })
      if(headers.length > 0) console.log(response.ip)
    } else {

      // Check the body for needles
      let inBody = needles.some((needle) => response.body.indexOf(needle) > -1)
      if(inBody) console.log(response.ip)
    }
  }).catch((err) => {
    return
  })
})
