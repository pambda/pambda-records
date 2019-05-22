# pambda-records

[Pambda](https://github.com/pambda/pambda) to process event records.

## Installation

```
npm i pambda-records
```

## Usage

``` javascript
const { compose, createLambda } = require('pambda');
const { records } = require('pambda-records');

export const handler = createLambda(
  compose(
    records((record, context, callback) => {
      // Process the record.

      callback(null);
    }),
    // other pambdas
  )
);
```

## API

### records(options[, finalHandler])

Generate a pambda to process events having the `Records` property. The Pambda ignores unrelated events.

- `options`
  - If a function is passed, it is treated as `options.handler`.
- `options.handler`
  - The function to process each record of an event. This function must be either `(record, context, callback)` or `async (record, context)`.
    - `record`
      - A record to be processed.
    - `context`
      - A context object when the lambda is called.
    - `callback(err, ...result)`
      - A callback function that needs to be called when record processing is complete.
- `options.parallel`
  - A boolean value indicating whether to process an array of `Records` in parallel.
  - If this option is truthy, the order of elements of `data.records` and `data.failures` passed to `finalHandler` is not guaranteed to be in the same order as `Records`.
- `finalHandler(err, data, callback)`
  - A function called when all records have been processed.
    - `err`
      - A first error that occurred while processing records.
    - `data`
      - An object with the following properties:
        - `records`
          - An array whose elements are the results returned by `options.handler`.
        - `failures`
          - An array whose element is an object that has `err` and` record` when `options.handler` returns an error.
    - `callback(err, result)`
      - A callback function when the lambda is called.
  - If omitted, the function passing `err` to `callback` is used.

Event to handle by this pambda, are events of following services:

- [CloudTrail](https://docs.aws.amazon.com/lambda/latest/dg/with-cloudtrail.html)
- [CodeCommit](https://docs.aws.amazon.com/lambda/latest/dg/services-codecommit.html)
- [DynamoDB Streams](https://docs.aws.amazon.com/lambda/latest/dg/with-ddb.html)
- [Kinesis Data Streams](https://docs.aws.amazon.com/lambda/latest/dg/with-kinesis.html)
- [Lambda@Edge](https://docs.aws.amazon.com/lambda/latest/dg/lambda-edge.html)
- [S3 Event Notifications](https://docs.aws.amazon.com/lambda/latest/dg/with-s3.html)
- [SES](https://docs.aws.amazon.com/lambda/latest/dg/services-ses.html)
- [SNS](https://docs.aws.amazon.com/lambda/latest/dg/with-sns.html)
- [SQS (Standard Queue)](https://docs.aws.amazon.com/lambda/latest/dg/with-sqs.html)

### parallel(handler[, finalHandler])

This function is equivalent to the following call:

``` javascript
records({
  handler,
  parallel: true,
}, finalHandler);
```

### series(handler[, finalHandler])

This function is equivalent to the following call:

``` javascript
records({
  handler,
  parallel: false,
}, finalHandler);
```

## License

MIT
