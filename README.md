# pambda-records

[Pambda](https://github.com/pambda/pambda) to process event records.

## Installation

```
npm i pambda-records -S
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

## records(options)

Generate a pambda to process events having the `Records` property. The Pambda ignores unrelated events.

- `options`
  - If a function is passed, it is treated as `options.handler`.
- `options.handler`
  - The function to process each record of an event. This function must be either `(record, context, callback)` or `async (record, context)`.

Event to handle by this pambda, are events of following services:

- DynamoDB Streams
- Kinesis Data Streams
- Lambda@Edge
- S3 Event Notifications
- SES
- SNS

## License

MIT
