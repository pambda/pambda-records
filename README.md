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

## records(options)

Generate a pambda to process events having the `Records` property. The Pambda ignores unrelated events.

- `options`
  - If a function is passed, it is treated as `options.handler`.
- `options.handler`
  - The function to process each record of an event. This function must be either `(record, context, callback)` or `async (record, context)`.

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

## License

MIT
