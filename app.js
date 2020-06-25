const lw = require('@google-cloud/logging-winston');
const winston = require('winston');

// Import express module and create an http server.
const express = require('express');
const logger = winston.createLogger();

async function main() {
    // Create a middleware that will use the provided logger.
    // A Stackdriver Logging transport will be created automatically
    // and added onto the provided logger.
    const mw = await lw.express.makeMiddleware(logger);
    // Alternatively, you can construct a LoggingWinston transport
    // yourself and pass it int.
    // const transport = new LoggingWinston({...});
    // const mw = await lw.express.makeMiddleware(logger, transport);

    const app = express();

    // Install the logging middleware. This ensures that a Winston-style `log`
    // function is available on the `request` object. Attach this as one of the
    // earliest middleware to make sure that the log function is available in all
    // subsequent middleware and routes.
    app.use(mw);

    // Setup an http route and a route handler.
    app.get('/', (req, res) => {
        // `req.log` can be used as a winston style log method. All logs generated
        // using `req.log` use the current request context. That is, all logs
        // corresponding to a specific request will be bundled in the Stackdriver
        // UI.
        req.log.info('Nested INFO log.');
	req.log.info('Another INFO log.');
	req.log.error('Nested ERROR log.')
        res.send('hello world');
    });

    // `logger` can be used as a global logger, one not correlated to any specific
    // request.
    logger.info('Global log 1');
    logger.info('Global log 2');

    // Start listening on the http server.
    app.listen(8080, () => {
        logger.info('http server listening on port 8080');
    });
}

main();
