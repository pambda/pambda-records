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

## API

### records(options[, finalHandler])

`Records` プロパティを持つイベントを処理する Pambda を生成する。 その Pambda は無関係なイベントは無視する。

- `options`
  - 関数を渡した場合、 `options.handler` として扱われる。
- `options.handler`
  - イベントの各レコードを処理する関数。 この関数は `(record, context, callback)` か `async (record, context)` のいずれかでなければならない。
    - `record`
      - 処理対象となるレコード。
    - `context`
      - Lambda が呼ばれた時の Context オブジェクト。
    - `callback(err, ...result)`
      - レコード処理が完了した時に呼ぶ必要があるコールバック関数。
- `options.parallel`
  - `Records` の配列を並行処理するかどうかを示す Boolean 。
  - このオプションが真の場合、`finalHandler` に渡される `data.records` と `data.failures` の要素の順序は、`Records` と同じ順序になることを保証しない。
- `finalHandler(err, data, callback)`
  - 全てのレコードの処理が完了した時に呼ばれる関数。
    - `err`
      - レコードの処理中に起きた最初のエラー。
    - `data`
      - 以下のプロパティを持つ Object 。
        - `records`
          - `options.handler` が返した結果を要素に持つ配列。
        - `failures`
          - `options.handler` がエラーを返した時の `err` と `record` を持つ Object を要素に持つ配列。
    - `callback(err, result)`
      - Lambda が呼ばれた時のコールバック関数。
  - 省略した場合、 `err` を `callback` に渡す関数が使用される。

この Pambda によって処理されるイベントは、以下のサービスのイベントとなる。

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

この関数は以下の呼び出しと等価。

``` javascript
records({
  handler,
  parallel: true,
}, finalHandler);
```

### series(handler[, finalHandler])

この関数は以下の呼び出しと等価。

``` javascript
records({
  handler,
  parallel: false,
}, finalHandler);
```

## License

MIT
