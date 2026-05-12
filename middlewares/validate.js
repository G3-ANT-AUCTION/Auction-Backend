const validate = (schema) => (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
        abortEarly: true,
        allowUnknow: true
    })

    if (error) {
        return res.json({
            message: 'Validate Error',
            details: error.details.map((d) => d.message)
        })
    }

    req.validatedData = value   
    next(); 

}

module.exports = validate;