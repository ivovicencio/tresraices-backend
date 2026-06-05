const validate = (schema, source = 'body') => {
    return (req, res, next) => {
        const errors = [];
        const data = source === 'body' ? req.body : source === 'query' ? req.query : req.params;

        for (const field in schema) {
            const rules = schema[field];
            const value = data[field];

            if (rules.required) {
                if (value === undefined || value === null || value === '') {
                    errors.push(`El campo '${field}' es obligatorio`);
                    continue;
                }
            } else if (value === undefined || value === null || value === '') {
                continue;
            }

            if (rules.type === 'number' && (isNaN(Number(value)) || value === '')) {
                errors.push(`El campo '${field}' debe ser un número válido`);
            }

            if (rules.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                errors.push(`El campo '${field}' debe ser un email válido`);
            }

            if (rules.enum && !rules.enum.includes(value)) {
                errors.push(`El campo '${field}' debe ser uno de: ${rules.enum.join(', ')}`);
            }

            if (rules.minLength && String(value).length < rules.minLength) {
                errors.push(`El campo '${field}' debe tener al menos ${rules.minLength} caracteres`);
            }

            if (rules.type === 'string' && typeof value !== 'string') {
                errors.push(`El campo '${field}' debe ser un texto`);
            }

            if (rules.min !== undefined && Number(value) < rules.min) {
                errors.push(`El campo '${field}' debe ser mayor o igual a ${rules.min}`);
            }
        }

        if (errors.length > 0) {
            return res.status(400).json({ status: '0', msg: 'Error de validación', data: errors });
        }

        next();
    };
};

module.exports = { validate };
