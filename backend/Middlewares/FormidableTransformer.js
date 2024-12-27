import formidable from "formidable";

const formidableTransformer = (req, res, next) => {
    let form = formidable();
    form.parse(req, (err, fields, files) => {
        if (err) {
            console.error(err)
            return res.status(400)
                .json({message: err})
        }
        req.fields = fields;
        req.files = files;
        next();
    })
}

export {formidableTransformer}