import {
  allUsers,
  updateTimestampForUser,
} from '../../src/db/userManagement'
import { mockReq, mockRes } from 'sinon-express-mock'
import chai from 'chai'
import db from '../../src/db/index'
import getUser from '../../src/middleware/getUser'
import sinon from 'sinon'

chai.use(require('sinon-chai'))
const expect = chai.expect


const dbReturn = {
  numRows: 2,
  rows: [
    {
      id: 'the_real_batman',
      role: 'admin',
      token: 'fffffffff',
      timestamp: 'January 1, 5000',
    },
    {
      id: 'batman2',
      role: 'employee',
      token: 'ddddddddd',
      timestamp: 'January 1, 1999',
    },
    {
      id: 'batman',
      role: 'employee',
      token: 'ttttttttt',
      timestamp: '',
    },
  ],
  error: false,
  errorMsg: null,
}


describe('getUser middleware tests', () => {
  let dbStub

  afterEach(() => {
    dbStub.restore()
  })

  it('Responds properly to database error', async() => {
    const dbReturnError = {
      numRows: 0,
      rows: [],
      error: true,
      errorMsg: 'Some database error',
    }

    dbStub = sinon.stub(db, 'sqlQuery').returns(dbReturnError)

    const request = {
      body: {
        token: 'asdfasdf',
      },
    }

    const req = mockReq(request)
    const res = mockRes()
    const next = sinon.spy()

    await getUser(req, res, next)

    expect(res.status).to.be.calledWith(500)
    expect(res.json).to.be.calledWith({ error: true, errorMsg: 'Database error' })
    expect(next).to.not.be.called
    expect(dbStub.callCount).to.equal(1)
    expect(dbStub).to.be.calledWith(allUsers())
  })


  it('returns error if token is not provided', async() => {
    const request = {
      body: {},
    }

    const req = mockReq(request)
    const res = mockRes()
    const next = sinon.spy()

    await getUser(req, res, next)

    expect(res.status).to.be.calledWith(449)
    expect(res.json).to.be.calledWith({ error: true, errorMsg: 'No token provided' })
    expect(next).to.not.be.called
  })


  it('returns error if token does not exist in the table', async() => {
    dbStub = sinon.stub(db, 'sqlQuery').returns(dbReturn)

    const request = {
      body: {
        token: 'someinvalidtoken',
      },
    }

    const req = mockReq(request)
    const res = mockRes()
    const next = sinon.spy()

    await getUser(req, res, next)

    expect(res.status).to.be.calledWith(401)
    expect(res.json).to.be.calledWith({ error: true, errorMsg: 'Invalid credentials' })
    expect(next).to.not.be.called
    expect(dbStub.callCount).to.equal(1)
    expect(dbStub).to.be.calledWith(allUsers())
  })

  it('returns error if token exists but the timestamp is empty string', async() => {
    dbStub = sinon.stub(db, 'sqlQuery').returns(dbReturn)

    const request = {
      body: {
        token: 'ttttttttt',
      },
    }

    const req = mockReq(request)
    const res = mockRes()
    const next = sinon.spy()

    await getUser(req, res, next)

    expect(res.status).to.be.calledWith(408)
    expect(res.json).to.be.calledWith({ error: true, errorMsg: 'Session timeout' })
    expect(next).to.not.be.called
    expect(dbStub.callCount).to.equal(1)
    expect(dbStub).to.be.calledWith(allUsers())
  })

  it('returns error if token exists but the timestamp is expired', async() => {
    dbStub = sinon.stub(db, 'sqlQuery').returns(dbReturn)

    const request = {
      body: {
        token: 'ddddddddd',
      },
    }

    const req = mockReq(request)
    const res = mockRes()
    const next = sinon.spy()

    await getUser(req, res, next)

    expect(res.status).to.be.calledWith(408)
    expect(res.json).to.be.calledWith({ error: true, errorMsg: 'Session timeout' })
    expect(next).to.not.be.called
    expect(dbStub.callCount).to.equal(2)
    expect(dbStub).to.be.calledWith(allUsers())
    updateTimestampForUser(request.body.id, '')
  })


  it('returns role if token exists and the timestamp is not expired', async() => {
    dbStub = sinon.stub(db, 'sqlQuery').returns(dbReturn)
    const clock = sinon.useFakeTimers()

    const request = {
      body: {
        token: 'fffffffff',
      },
    }

    const req = mockReq(request)
    const res = mockRes()
    const next = sinon.spy()

    await getUser(req, res, next)

    const user = res.locals.user

    expect(user).to.equal(dbReturn.rows[0])
    expect(next).to.be.called
    expect(dbStub.callCount).to.equal(2)
    expect(dbStub).to.be.calledWith(allUsers())
    updateTimestampForUser(request.body.id, new Date())

    clock.restore()
  })
})
