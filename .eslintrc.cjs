module.exports = {
    "env": {
        "browser": true,
        "es2021": true,
        "node": true
    },
    "plugins": ["solid"],
    "extends": ["standard-with-typescript", "plugin:solid/recommended"],
    "overrides": [
        {
            "env": {
                "node": true
            },
            "files": [
                ".eslintrc.{js,cjs}"
            ],
            "parserOptions": {
                "sourceType": "script"
            }
        }
    ],
    "parserOptions": {
        "ecmaVersion": "latest",
        "sourceType": "module",
        parser: "@typescript-eslint/parser",
        project: "./tsconfig.json",
    },
    "rules": {
        "@typescript-eslint/consistent-type-definitions": ["error", "type"],
    }
}
