import {
  checkCustomersTable,
  checkMoviesTable,
  checkUsersTable,
  createCustomersTable,
  createMoviesTable,
  createUsersTable,
} from '../db/createTables'
import { createUser } from '../db/userManagement'
import { sqlQuery } from '../db'


const tableCheckReturn = async(check, tableName, createTableQuery) => {
  if (check.error && check.errorMsg.contains('does not exist')) {
    const usersTableCreation = await sqlQuery(createTableQuery)

    if (usersTableCreation.error) {
      return { error: true, errorMsg: `Could not create ${tableName} table` }
    }
  } else if (check.error) {
    return { error: true, errorMsg: `Could not reach ${tableName} table` }
  }

  return { error: false, errorMsg: '' }
}


export const checkForUsersTable = async() => {
  const usersCheck = await sqlQuery(checkUsersTable())
  const returnVal = await tableCheckReturn(usersCheck, 'users', createUsersTable())

  return returnVal
}


const checkForCustomersTable = async() => {
  const customersCheck = await sqlQuery(checkCustomersTable())
  const returnVal = await tableCheckReturn(customersCheck, 'customers', createCustomersTable())

  return returnVal
}


const checkForMoviesTable = async() => {
  const moviesCheck = await sqlQuery(checkMoviesTable())
  const returnVal = await tableCheckReturn(moviesCheck, 'movies', createMoviesTable())

  return returnVal
}


const healthController = async(req, res, next) => {
  const usersStatus = await checkForUsersTable()
  const customersStatus = await checkForCustomersTable()
  const moviesStatus = await checkForMoviesTable()


  await sqlQuery(createUser('superuser', '', '', 'password', 'admin', true))


  // TODO Check connection to IMDB


  const returnVal = {
    usersDatabase: usersStatus,
    customersDatabase: customersStatus,
    moviesDatabase: moviesStatus,
  }


  const checkStatus = Object.values(returnVal).reduce((acc, object) => object.error ? acc + 1 : acc, 0)
  const status = checkStatus === 0 ? 200 : 500
  const error = checkStatus !== 0

  const finalReturnVal = {
    ...returnVal,
    error,
  }

  res.status(status).json(finalReturnVal)
  next()
}

export default healthController
