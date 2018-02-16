import { allUsers } from '../../db/queries'
import { databaseErrorMessage } from '../../errorMessages'
import { sqlQuery } from '../../db'


const signedInUsersController = async(req, res, next) => {
  const usersQuery = await sqlQuery(allUsers())

  if (usersQuery.error) {
    return databaseErrorMessage(res)
  }

  const activeUsers = usersQuery.rows.filter(user => user.active)

  const rightNow = new Date()
  const signedInUsers = activeUsers.filter(user => rightNow - new Date(user.timestamp) < 900000 && user.token !== '')

  const rowsWithoutSensitiveInfo = signedInUsers.map(user => ({
    id: user.id,
    f_name: user.f_name,
    l_name: user.l_name,
    role: user.role,
  }))

  const returnVal = {
    ...usersQuery,
    rows: rowsWithoutSensitiveInfo,
    errorMsg: '',
  }

  res.status(200).json(returnVal)
  next()
}

export default signedInUsersController
