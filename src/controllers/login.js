import {
  allUsers as allUsersQuery,
  updateTokenAndTimestampForUser,
} from '../db/queries'
import { generateUniqueKey } from '../helpers/generateUniqueKey'
import { sqlQuery } from '../db'


const sendInvalidCredentials = (res, errorMsg) => {
  res.status(400).json({
    error: true,
    errorMsg,
  })
}


const loginController = async(req, res, next) => {
  const id = req.body.id
  const pin = req.body.pin

  if (id === undefined) {
    return sendInvalidCredentials(res, 'No ID provided')
  }
  if (pin === undefined) {
    return sendInvalidCredentials(res, 'No pin provided')
  }

  const queryData = await sqlQuery(allUsersQuery())
  const allUsers = queryData.rows

  const matchingUsers = allUsers.filter(x => x.id === id)

  if (matchingUsers.length === 0) {
    return sendInvalidCredentials(res, 'User not found')
  }

  const user = matchingUsers[0]

  if (user.pin !== pin) {
    return sendInvalidCredentials(res, 'Invalid credentials')
  }

  const allTokens = allUsers.map(user => user.token)

  const newToken = generateUniqueKey(allTokens)
  const timestamp = new Date()

  await sqlQuery(updateTokenAndTimestampForUser(id, newToken, timestamp))

  const resultJson = {
    id: user.id,
    f_name: user.f_name,
    l_name: user.l_name,
    role: user.role,
    token: newToken,
    error: false,
    errorMsg: '',
  }

  res.status(200).json(resultJson)
  next()
}

export default loginController
