const test = require('tape');
const { parallel } = require('..');

test('test', t => {
  t.plan(8);

  const pambda = parallel((record, context, callback) => {
    if (record % 2) {
      callback(new Error(record));
    } else {
      callback(null, record * 2);
    }
  }, (err, data, callback) => {
    t.deepEqual(data.results, [[4], [8]]);

    const [f0, f1] = data.failures;
    t.equal(f0.record, 1);
    t.equal(f0.err.message, '1');
    t.equal(f1.record, 3);
    t.equal(f1.err.message, '3');

    callback(err);
  });

  const lambda = pambda((event, context, callback) => {
    callback(null, {
      statusCode: 200,
    });
  });

  lambda({
    Records: [ 1, 2, 3, 4 ],
  }, {}, (err, result) => {
    t.ok(err instanceof Error);
  });

  lambda({}, {}, (err, result) => {
    t.error(err);
    t.equal(result.statusCode, 200);
  });
});

test('test async handler', t => {
  t.plan(8);

  const pambda = parallel(async (record, context) => {
    if (record % 2) {
      throw new Error(record);
    }

    return record * 2;
  }, (err, data, callback) => {
    t.deepEqual(data.results, [[4], [8]]);

    const [f0, f1] = data.failures;
    t.equal(f0.record, 1);
    t.equal(f0.err.message, '1');
    t.equal(f1.record, 3);
    t.equal(f1.err.message, '3');

    callback(err);
  });

  const lambda = pambda((event, context, callback) => {
    callback(null, {
      statusCode: 200,
    });
  });

  lambda({
    Records: [ 1, 2, 3, 4 ],
  }, {}, (err, result) => {
    t.ok(err instanceof Error);
  });

  lambda({}, {}, (err, result) => {
    t.error(err);
    t.equal(result.statusCode, 200);
  });
});
