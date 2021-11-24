const forceSync = require('sync-rpc')
const syncFunction = forceSync(require.resolve('../scripts/request_page'))
// inside your thing that needs to be sync(for whatever reason)
console.log('start')
const syncReturn = syncFunction(paramOne, paramTwo)
console.log('syncReturn', syncReturn)
// Do the rest of your stuff with `syncReturn` value