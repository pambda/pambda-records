const { callbackify } = require('lambda-callbackify');

exports.records = options => {
  if (typeof options === 'function') {
    options = { handler: options };
  }

  let {
    handler,
  } = options;

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
        (next, record) =>
          () => handler(record, context,
            err => err ? callback(err) : next()),
        callback);

      chain();
    };
  };
};
