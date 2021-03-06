export const noError = () => ({ error: false, errorMsg: '' })

export const forbiddenErrorMessage = res => {
  res.status(403).json({ error: true, errorMsg: 'Forbidden' })
}

export const userNotFoundErrorMessage = res => {
  res.status(404).json({ error: true, errorMsg: 'User not found' })
}

export const timeoutErrorMessage = res => {
  res.status(408).json({ error: true, errorMsg: 'Session timeout' })
}

export const databaseErrorMessage = res => {
  res.status(500).json({ error: true, errorMsg: 'Database error' })
}

export const invalidCredentialsErrorMessage = res => {
  res.status(401).json({ error: true, errorMsg: 'Invalid credentials' })
}

export const noIdProvidedErrorMessage = res => {
  res.status(449).json({ error: true, errorMsg: 'No ID provided' })
}

export const noPinProvidedErrorMessage = res => {
  res.status(449).json({ error: true, errorMsg: 'No pin provided' })
}

export const noRoleProvidedErrorMessage = res => {
  res.status(449).json({ error: true, errorMsg: 'No role provided' })
}

export const noQuestionProvidedErrorMessage = res => {
  res.status(449).json({ error: true, errorMsg: 'No question provided' })
}

export const noAnswerProvidedErrorMessage = res => {
  res.status(449).json({ error: true, errorMsg: 'No answer provided' })
}

export const securityQuestionNotSetErrorMessage = res => {
  res.status(449).json({ error: true, errorMsg: 'Security question not set' })
}

export const incorrectAnswerErrorMessage = res => {
  res.status(449).json({ error: true, errorMsg: 'Incorrect answer' })
}

export const idAlreadyExistsErrorMessage = res => {
  res.status(400).json({ error: true, errorMsg: 'ID already exists' })
}

export const noTokenProvidedErrorMessage = res => {
  res.status(449).json({ error: true, errorMsg: 'No token provided' })
}

export const noFNameProvidedErrorMessage = res => {
  res.status(449).json({ error: true, errorMsg: 'No first name provided' })
}

export const noLNameProvidedErrorMessage = res => {
  res.status(449).json({ error: true, errorMsg: 'No last name provided' })
}

export const noPhoneNumProvidedErrorMessage = res => {
  res.status(449).json({ error: true, errorMsg: 'No phone number provided' })
}

export const noSearchStringProvidedErrorMessage = res => {
  res.status(449).json({ error: true, errorMsg: 'No search string provided' })
}

export const noUPCProvidedErrorMessage = res => {
  res.status(449).json({ error: true, errorMsg: 'No UPC provided' })
}

export const upcAlreadyExistsErrorMessage = res => {
  res.status(400).json({ error: true, errorMsg: 'UPC already exists' })
}

export const movieNotFoundErrorMessage = res => {
  res.status(404).json({ error: true, errorMsg: 'Movie not found' })
}

export const noTitleProvidedErrorMessage = res => {
  res.status(449).json({ error: true, errorMsg: 'No title provided' })
}

export const copiesIsNotAnArrayErrorMessage = res => {
  res.status(449).json({ error: true, errorMsg: 'Copies must be of type "array"' })
}

export const copiesIsNotArrayOfStringsErrorMessage = res => {
  res.status(449).json({ error: true, errorMsg: 'Copies must be an array of strings' })
}

export const copyIDNotProvidedErrorMessage = res => {
  res.status(449).json({ error: true, errorMsg: 'Copy ID not provided' })
}

export const copyIDAlreadyExistsErrorMessage = res => {
  res.status(449).json({ error: true, errorMsg: 'Copy ID already exists' })
}
