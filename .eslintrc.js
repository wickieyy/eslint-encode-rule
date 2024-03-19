module.exports = {
    "env": {
        "browser": true,
        "es2021": true,
        "node": true
    },
    "parserOptions": {
        "ecmaVersion": 2017,
         "ecmaFeatures": {
            "jsx": true,
            "modules": true
        }
    },
    "plugins": ["missing-encoding"],
    "rules": {
        "missing-encoding/non-encoded": "error",
        "no-console": "off"
    }
};
