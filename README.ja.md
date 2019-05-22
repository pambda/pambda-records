# pambda-records

イベントレコードを処理する [Pambda](https://github.com/pambda/pambda).

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
      // record の処理。

      callback(null);
    }),
    // other pambdas
  )
);
```

## records(options)

`Records` プロパティを持つイベントを処理する Pambda を生成する。 その Pambda は無関係なイベントは無視する。

- `options`
  - 関数を渡した場合、 `options.handler` として扱われる。
- `options.handler`
  - イベントの各レコードを処理する関数。 この関数は `(record, context, callback)` か `async (record, context)` のいずれかでなければならない。

この Pambda によって処理されるイベントは、以下のサービスのイベントとなる。

- DynamoDB Streams
- Kinesis Data Streams
- Lambda@Edge
- S3 Event Notifications
- SES
- SNS
- SQS (Standard Queue)

## License

MIT
