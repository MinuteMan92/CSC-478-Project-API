/* eslint-disable max-lines */

import {
  getMovieCopiesUPC,
  getMovieRowTitle,
  getMovieRowUPC,
} from '../../../src/db/movieManagement'
import { mockReq, mockRes } from 'sinon-express-mock'
import chai from 'chai'
import db from '../../../src/db/index'
import getMovieController from '../../../src/controllers/movieManagement/getMovie'
import sinon from 'sinon'

chai.use(require('sinon-chai'))
const expect = chai.expect


describe('get all movies controller tests', () => {
  let dbStub

  afterEach(() => {
    dbStub.restore()
  })

  it('Responds properly to database error', async() => {
    const dbReturn = {
      numRows: 0,
      rows: [],
      error: true,
      errorMsg: 'Some database error',
    }

    dbStub = sinon.stub(db, 'sqlQuery').returns(dbReturn)

    const request = {
      body: {
        upc: '232423434242',
        title: 'V for Vendetta',
      },
    }

    const req = mockReq(request)
    const res = mockRes()
    const next = sinon.spy()

    await getMovieController(req, res, next)

    expect(res.status).to.be.calledWith(500)
    expect(res.json).to.be.calledWith({ error: true, errorMsg: 'Database error' })
    expect(next).to.not.be.called
    expect(dbStub.callCount).to.equal(1)
    expect(dbStub).to.be.calledWith(getMovieRowUPC(request.body.upc))
  })

  it('Returns error if UPC and title are not included', async() => {
    dbStub = sinon.stub(db, 'sqlQuery')

    const request = {
      body: {
      },
    }

    const req = mockReq(request)
    const res = mockRes()
    const next = sinon.spy()

    await getMovieController(req, res, next)


    expect(res.status).to.be.calledWith(449)
    expect(res.json).to.be.calledWith({ error: true, errorMsg: 'No UPC provided' })
    expect(next).to.be.not.called
    expect(dbStub).to.not.be.called
  })

  it('Successfully returns all movies with a UPC filter', async() => {
    const allMoviesDbReturn = {
      numRows: 1,
      rows: [
        {
          upc: '889443493345',
          title: 'Pulp Fiction',
        },
      ],
      error: false,
      errorMsg: '',
    }

    const copiesDbReturn = {
      numRows: 1,
      rows: [
        {
          id: 'gggjgggjggj',
          upc: '889443493345',
          active: true,
        },
      ],
      error: false,
      errorMsg: '',
    }

    dbStub = sinon.stub(db, 'sqlQuery')
      .onCall(0).returns(allMoviesDbReturn)
      .onCall(1).returns(copiesDbReturn)

    const request = {
      body: {
        upc: '889443493345',
      },
    }

    const req = mockReq(request)
    const res = mockRes()
    const next = sinon.spy()

    await getMovieController(req, res, next)

    const expected = {
      ...allMoviesDbReturn,
      rows: [
        {
          upc: '889443493345',
          title: 'Pulp Fiction',
          copies: [
            'gggjgggjggj',
          ],
        },
      ],
    }

    expect(res.status).to.be.calledWith(200)
    expect(res.json).to.be.calledWith(expected)
    expect(next).to.be.called
    expect(dbStub.callCount).to.equal(2)
    expect(dbStub).to.be.calledWith(getMovieRowUPC(request.body.upc))
    expect(dbStub).to.be.calledWith(getMovieCopiesUPC(allMoviesDbReturn.rows[0].upc))
  })

  it('Successfully returns all movies with a title filter', async() => {
    const allMoviesDbReturn = {
      numRows: 1,
      rows: [
        {
          upc: '889443493345',
          title: 'Pulp Fiction',
        },
      ],
      error: false,
      errorMsg: '',
    }

    const copiesDbReturn = {
      numRows: 1,
      rows: [
        {
          id: 'gggjgggjggj',
          upc: '889443493345',
          active: true,
        },
      ],
      error: false,
      errorMsg: '',
    }

    dbStub = sinon.stub(db, 'sqlQuery')
      .onCall(0).returns(allMoviesDbReturn)
      .onCall(1).returns(copiesDbReturn)

    const request = {
      body: {
        title: 'Pulp Fiction',
      },
    }

    const req = mockReq(request)
    const res = mockRes()
    const next = sinon.spy()

    await getMovieController(req, res, next)

    const expected = {
      ...allMoviesDbReturn,
      rows: [
        {
          upc: '889443493345',
          title: 'Pulp Fiction',
          copies: [
            'gggjgggjggj',
          ],
        },
      ],
    }

    expect(res.status).to.be.calledWith(200)
    expect(res.json).to.be.calledWith(expected)
    expect(next).to.be.called
    expect(dbStub.callCount).to.equal(2)
    expect(dbStub).to.be.calledWith(getMovieRowTitle(request.body.title))
    expect(dbStub).to.be.calledWith(getMovieCopiesUPC(allMoviesDbReturn.rows[0].upc))
  })

  it('Successfully returns all movies with a upc and title filter', async() => {
    const dbReturn = {
      numRows: 1,
      rows: [
        {
          upc: '245345345534',
          title: 'Fast and Furious 42',
        },
      ],
      error: false,
      errorMsg: '',
    }

    const copiesDbReturn = {
      numRows: 1,
      rows: [
        {
          id: 'gggjgggjggj',
          upc: '245345345534',
          active: true,
        },
      ],
      error: false,
      errorMsg: '',
    }

    dbStub = sinon.stub(db, 'sqlQuery')
      .onCall(0).returns(dbReturn)
      .onCall(1).returns(copiesDbReturn)

    const request = {
      body: {
        upc: '245345345534',
        title: 'Fast and Furious 42',
      },
    }

    const req = mockReq(request)
    const res = mockRes()
    const next = sinon.spy()

    await getMovieController(req, res, next)

    const expected = {
      ...dbReturn,
      rows: [
        {
          upc: '245345345534',
          title: 'Fast and Furious 42',
          copies: [
            'gggjgggjggj',
          ],
        },
      ],
    }

    expect(res.status).to.be.calledWith(200)
    expect(res.json).to.be.calledWith(expected)
    expect(next).to.be.called
    expect(dbStub.callCount).to.equal(2)
    expect(dbStub).to.be.calledWith(getMovieRowUPC(request.body.upc))
    expect(dbStub).to.be.calledWith(getMovieCopiesUPC(dbReturn.rows[0].upc))
  })

  it('Successfully returns all movies with excludeInactive filter set to false', async() => {
    const allMoviesDbReturn = {
      numRows: 2,
      rows: [
        {
          upc: '889443493345',
          title: 'Pulp Fiction',
        },
      ],
      error: false,
      errorMsg: '',
    }

    const copiesDbReturn = {
      numRows: 4,
      rows: [
        {
          id: 'asldkfjasl;dkfj',
          upc: '889443493345',
          active: true,
        },
        {
          id: 'ttttttttttttt',
          upc: '889443493345',
          active: false,
        },
      ],
      error: false,
      errorMsg: '',
    }

    dbStub = sinon.stub(db, 'sqlQuery')
      .onCall(0).returns(allMoviesDbReturn)
      .onCall(1).returns(copiesDbReturn)

    const request = {
      body: {
        upc: '889443493345',
        excludeInactive: false,
      },
    }

    const req = mockReq(request)
    const res = mockRes()
    const next = sinon.spy()

    await getMovieController(req, res, next)


    const expected = {
      ...allMoviesDbReturn,
      numRows: 1,
      rows: [
        {
          upc: '889443493345',
          title: 'Pulp Fiction',
          copies: [
            'asldkfjasl;dkfj',
            'ttttttttttttt',
          ],
        },
      ],
    }


    expect(res.status).to.be.calledWith(200)
    expect(res.json).to.be.calledWith(expected)
    expect(next).to.be.called
    expect(dbStub.callCount).to.equal(2)
    expect(dbStub).to.be.calledWith(getMovieRowUPC(request.body.upc))
    expect(dbStub).to.be.calledWith(getMovieCopiesUPC(allMoviesDbReturn.rows[0].upc))
  })
})
