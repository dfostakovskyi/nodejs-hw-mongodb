//src\utils\ctrlWrapper.js

const ctrlWrapper = ctrl => {
    return async (req, res, next) => {
        try {
            await ctrl(req, res, next);
        } catch (err) {
            next(err);
        }
    };
};

export default ctrlWrapper;
