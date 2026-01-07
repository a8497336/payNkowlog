import Joi from 'joi'

export const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body)
    
    if (error) {
      return res.status(400).json({
        code: 400,
        message: error.details[0].message,
        data: null
      })
    }
    
    next()
  }
}

export const validateQuery = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.query)
    
    if (error) {
      return res.status(400).json({
        code: 400,
        message: error.details[0].message,
        data: null
      })
    }
    
    next()
  }
}

export const validateParams = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.params)
    
    if (error) {
      return res.status(400).json({
        code: 400,
        message: error.details[0].message,
        data: null
      })
    }
    
    next()
  }
}
