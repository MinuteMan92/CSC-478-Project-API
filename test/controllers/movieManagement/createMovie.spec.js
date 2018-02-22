/* eslint-disable max-lines */

import { mockReq, mockRes } from 'sinon-express-mock'
import chai from 'chai'
import createMovieController from '../../../src/controllers/movieManagement/createMovie'
import db from '../../../src/db/index'
import sinon from 'sinon'

chai.use(require('sinon-chai'))
const expect = chai.expect


describe('create customer controller tests', () => {
  let dbStub

  afterEach(() => {
    dbStub.restore()
  })

  it('Responds properly to database error', async() => {
    const dbReturn = {
      rowNum: 0,
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

    await createMovieController(req, res, next)

    expect(res.status).to.be.calledWith(500)
    expect(res.json).to.be.calledWith({ error: true, errorMsg: 'Database error' })
    expect(next).to.not.be.called

    expect(dbStub.callCount).to.equal(1)
  })


  it('Returns error if upc is not provided', async() => {
    const dbReturn = {
      error: false,
      errorMsg: '',
    }

    dbStub = sinon.stub(db, 'sqlQuery').returns(dbReturn)

    const request = {
      body: {
        //upc: '232423434242',
        title: 'V for Vendetta',
      },
    }

    const req = mockReq(request)
    const res = mockRes()
    const next = sinon.spy()

    await createMovieController(req, res, next)

    expect(res.status).to.be.calledWith(449)
    expect(res.json).to.be.calledWith({ error: true, errorMsg: 'No UPC provided' })
    expect(next).to.not.be.called
    expect(dbStub).to.not.be.called
  })


  it('Returns error if title is not provided', async() => {
    const dbReturn = {
      error: false,
      errorMsg: '',
    }

    dbStub = sinon.stub(db, 'sqlQuery').returns(dbReturn)

    const request = {
      body: {
        upc: '2342423434',
        //title: 'Star Wars Episode 53',
      },
    }

    const req = mockReq(request)
    const res = mockRes()
    const next = sinon.spy()

    await createMovieController(req, res, next)

    expect(res.status).to.be.calledWith(449)
    expect(res.json).to.be.calledWith({ error: true, errorMsg: 'No title provided' })
    expect(next).to.not.be.called
    expect(dbStub).to.not.be.called
  })


  it('Returns error UPC already exists in the database', async() => {
    const dbReturn = {
      rowNum: 2,
      rows: [
        {
          upc: '245345345534',
        },
        {
          upc: '889443493345',
        },
      ],
      error: false,
      errorMsg: '',
    }

    dbStub = sinon.stub(db, 'sqlQuery').returns(dbReturn)

    const request = {
      body: {
        upc: '889443493345',
        title: 'Star Wars Episode 53',
      },
    }

    const req = mockReq(request)
    const res = mockRes()
    const next = sinon.spy()

    await createMovieController(req, res, next)

    expect(res.status).to.be.calledWith(400)
    expect(res.json).to.be.calledWith({ error: true, errorMsg: 'UPC already exists' })
    expect(next).to.not.be.called
  })


  it('Returns error copies is passed but is not an array', async() => {
    const dbReturn = {
      rowNum: 2,
      rows: [
        {
          upc: '245345345534',
        },
        {
          upc: '889443493345',
        },
      ],
      error: false,
      errorMsg: '',
    }

    dbStub = sinon.stub(db, 'sqlQuery').returns(dbReturn)

    const request = {
      body: {
        upc: '5464656464564465',
        title: 'Star Wars Episode 53',
        copies: 1234,
      },
    }

    const req = mockReq(request)
    const res = mockRes()
    const next = sinon.spy()

    await createMovieController(req, res, next)

    expect(res.status).to.be.calledWith(449)
    expect(res.json).to.be.calledWith({ error: true, errorMsg: 'Copies must be of type "array"' })
    expect(next).to.not.be.called
  })


  it('Returns error copies contains an object that isnt a string', async() => {
    const dbReturn = {
      rowNum: 2,
      rows: [
        {
          upc: '245345345534',
        },
        {
          upc: '889443493345',
        },
      ],
      error: false,
      errorMsg: '',
    }

    dbStub = sinon.stub(db, 'sqlQuery').returns(dbReturn)

    const request = {
      body: {
        upc: '5464656464564465',
        title: 'Star Wars Episode 53',
        copies: [
          'asdfasdf',
          45568,
          'asdfasdere',
        ],
      },
    }

    const req = mockReq(request)
    const res = mockRes()
    const next = sinon.spy()

    await createMovieController(req, res, next)

    expect(res.status).to.be.calledWith(449)
    expect(res.json).to.be.calledWith({ error: true, errorMsg: 'Copies must be an array of strings' })
    expect(next).to.not.be.called
  })


  it('Successfully creates movie', async() => {
    const dbReturn = {
      rowNum: 2,
      rows: [
        {
          upc: '245345345534',
        },
        {
          upc: '889443493345',
        },
      ],
      error: false,
      errorMsg: '',
    }

    dbStub = sinon.stub(db, 'sqlQuery').returns(dbReturn)

    const request = {
      body: {
        upc: '5464656464564465',
        title: 'Star Wars Episode 53',
        copies: [ '234234', '2342342' ],
      },
    }

    const req = mockReq(request)
    const res = mockRes()
    const next = sinon.spy()

    await createMovieController(req, res, next)

    expect(res.status).to.be.calledWith(200)
    expect(res.json).to.be.calledWith({ error: false, errorMsg: '' })
    expect(next).to.be.called
  })
})