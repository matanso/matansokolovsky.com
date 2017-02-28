/**
 * Created by matan on 28/02/17.
 */

'use strict'

const { createHash } = require('crypto')

function getPasshash (username, password) {
  const hash = createHash('sha256')
  hash.update(username)
  hash.update(password)
  return hash.digest()
}

async function find (client, username, password) {
  const passhash = getPasshash(username, password)
  const user = await client.collection('User').findOne({
    username,
    passhash
  })
  return user || null
}

async function findById (client, _id) {
  const user = await client.collection('User').findOne({
    _id
  })
  return user || null
}

async function register (client, username, password) {
  const passhash = getPasshash(username, password)
  const user = await client.collection('User').findOne({ username })
  if (user) return false
  // todo user class?
  await client.collection('User').insertOne({
    username,
    passhash
  })
  return true
}

module.exports = {
  find,
  findById,
  register
}