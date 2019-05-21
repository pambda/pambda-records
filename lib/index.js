const { callbackify } = require('lambda-callbackify');

const defaultFinalHandler = (err, data, callback) => callback(err);

const records = (options, finalHandler) => {
  if (typeof options === 'function') {
    options = { handler: options };
  }

  return options.parallel
    ? parallel(options.handler, finalHandler)
    : series(options.handler, finalHandler);
};

const series = (handler, finalHandler = defaultFinalHandler) => {
  handler = callbackify(handler);

  return next => {
    next = callbackify(next);

    return (event, context, callback) => {
      const { Records } = event;

      /*
       * Ignore events have no Records.
       */
      if (Records === undefined) {
        return next(event, context, callback);
      }

      /*
       * Call the handler with each record.
       */
      const chain = Records.reduceRight(
        (next, record) => (firstErr, data) => handler(record, context, (err, ...result) => {
          if (!err) {
            data.results.push(result);
          } else {
            data.failures.push({
              err,
              record,
            });
          }

          next(firstErr || err, data);
        }),
        (firstErr, data) => finalHandler(firstErr, data, callback));

      chain(null, { results: [], failures: [] });
    };
  };
};

const parallel = (handler, finalHandler = defaultFinalHandler) => {
  handler = callbackify(handler);

  return next => {
    next = callbackify(next);

    return (event, context, callback) => {
      const { Records } = event;

      /*
       * Ignore events have no Records.
       */
      if (Records === undefined) {
        return next(event, context, callback);
      }

      /*
       * Call the handler with each record.
       */
      let count = Records.length;
      let firstErr = null;
      const data = { results: [], failures: [] };

      Records.forEach(record => {
        handler(record, context, (err, ...result) => {
          if (!err) {
            data.results.push(result);
          } else {
            data.failures.push({
              err,
              record,
            });

            firstErr || (firstErr = err);
          }

          if (--count === 0) {
            finalHandler(firstErr, data, callback);
          }
        });
      });
    };
  };
};

/*
 * Exports.
 */
exports.records = records;
exports.series = series;
exports.parallel = parallel;
