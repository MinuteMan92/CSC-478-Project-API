import {
  allUsers as allUsersQuery,
  createUser,
} from '../../db/userManagement'
import {
  databaseErrorMessage,
  idAlreadyExistsErrorMessage,
  noIdProvidedErrorMessage,
  noPinProvidedErrorMessage,
  noRoleProvidedErrorMessage,
} from '../../errorMessages'
import { sqlQuery } from '../../db'


const createUserController = async(req, res, next) => {
  const newId = req.body.id
  const newPin = req.body.pin
  const newRole = req.body.role

  if (!newId) {
    return noIdProvidedErrorMessage(res)
  } else if (!newPin) {
    return noPinProvidedErrorMessage(res)
  } else if (!newRole) {
    return noRoleProvidedErrorMessage(res)
  }

  const newFName = !req.body.f_name ? '' : req.body.f_name
  const newLName = !req.body.l_name ? '' : req.body.l_name
  const newPhoneNum = !req.body.phoneNum ? '' : req.body.phoneNum
  const newAddress = !req.body.address ? '' : req.body.address

  const allUsersQ = await sqlQuery(allUsersQuery())

  if (allUsersQ.error) {
    return databaseErrorMessage(res)
  }

  const allUserIDs = allUsersQ.rows.map(user => user.id)

  if (allUserIDs.includes(newId)) {
    return idAlreadyExistsErrorMessage(res)
  }

  const qResult = await sqlQuery(createUser(newId, newFName, newLName, newPin, newRole, true, newPhoneNum, newAddress))

  if (qResult.error) {
    return databaseErrorMessage(res)
  }

  res.status(200).json({ error: false, errorMsg: '' })
  next()
}

export default createUserController
