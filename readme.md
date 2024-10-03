### Setup
1. Run `npm install` in `Backend`, `front-end` and `Common`
2. Ensure that you have `.env.development` setup in `Backend`. Build it based on `.env.example` or ask the repos owner.
3. Ensure that you have `.env.development` setup in `front-end`. Build it based on `.env.example`. For this one you can just copy it over.
4. Run `npm run update` in `front-end`
5. Run `npm run dev` in `Backend`
6. Run `npm run start` in `front-end`

If new things happen(such as a new champion being released), run `npm run update` in `front-end`.

Front end uses Material-UI: https://mui.com/material-ui/react-text-field/
Charts are made with Recharts: https://recharts.org/en-US/

# QA
## Why is naming for frontend `front-end` but CamelCase for everything else
Because react forced that and I was already using camel case for the other packages.

## What is craco and why can't we just run react-scripts normally?
I want to use the `Common` package to reduce code duplication. However, react doesn't allow references to code outside of the directory. So this is required to work around it.
