import {
  databaseErrorMessage,
  noUPCProvidedErrorMessage,
} from '../../errorMessages'
import {
  getCopyRow,
  getMovieCopiesUPC,
  getMovieRowTitle,
  getMovieRowUPC,
} from '../../db/movieManagement'
import _ from 'lodash'
import { sqlQuery } from '../../db'

const getMovieController = async(req, res, next) => {
  const title = req.body.title
  const copyID = req.body.copyID
  const excludeInactive = req.body.excludeInactive === undefined ? true : req.body.excludeInactive


  const getUPC = async() => {
    if (copyID !== undefined && copyID !== '') {
      const copies = await sqlQuery(getCopyRow(copyID))

      return copies.rows.length === 0 ? '' : copies.rows[0].upc
    }

    return req.body.upc
  }
  const upc = await getUPC()


  if (!upc && !title) {
    return noUPCProvidedErrorMessage(res)
  }

  const decideMoviesQuery = () => !upc ? getMovieRowTitle(title) : getMovieRowUPC(upc)
  const moviesQuery = await sqlQuery(decideMoviesQuery())

  if (moviesQuery.error) {
    return databaseErrorMessage(res)
  }

  const moviesList = moviesQuery.rows


  const movieCopiesPromise = await moviesList.map(async movie => {
    const copiesQ = await sqlQuery(getMovieCopiesUPC(movie.upc))

    return copiesQ.rows
  })
  const movieCopies = await Promise.all(movieCopiesPromise)
  const flatMovieCopies = _.flatten(movieCopies)


  const moviesWithCopies = moviesList.map(movie => {
    const thisMoviesCopies = flatMovieCopies.filter(copy => copy.upc === movie.upc)
    const activeFilteredCopies = excludeInactive ? thisMoviesCopies.filter(copy => copy.active) : thisMoviesCopies
    const copyIds = activeFilteredCopies.map(copy => copy.id)

    return {
      ...movie,
      copies: copyIds,
    }
  })


  const returnVal = {
    numRows: moviesWithCopies.length,
    rows: moviesWithCopies,
    error: false,
    errorMsg: '',
  }

  res.status(200).json(returnVal)
  next()
}

export default getMovieController
