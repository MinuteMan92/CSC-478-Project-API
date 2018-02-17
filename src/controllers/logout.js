import { allUsers as allUsersQuery, updateTokenAndTimestampForUser } from '../db/userManagement'
import {
  databaseErrorMessage,
  userNotFoundErrorMessage,
} from '../errorMessages'
import { sqlQuery } from '../db'


const logoutController = async(req, res, next) => {
  const id = req.body.id

  if (!id) {
    return userNotFoundErrorMessage(res)
  }

  const queryData = await sqlQuery(allUsersQuery())

  if (queryData.error) {
    return databaseErrorMessage(res)
  }

  const allUsers = queryData.rows

  const matchingUsers = allUsers.filter(x => x.id === id)

  if (matchingUsers.length === 0) {
    return userNotFoundErrorMessage(res)
  }

  await sqlQuery(updateTokenAndTimestampForUser(id, '', ''))

  res.status(200).json({ error: false, errorMsg: '' })
  next()
}

export default logoutController
