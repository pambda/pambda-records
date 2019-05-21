const test = require('tape');
const { records } = require('..');

test('test', t => {
  t.plan(4);

  let acc = 0;

  const pambda = records((record, context, callback) => {
    acc = acc + record;
    callback(null);
  });

  const lambda = pambda((event, context, callback) => {
    callback(null, {
      statusCode: 200,
    });
  });

  lambda({
    Records: [ 1, 2, 3, 4 ],
  }, {}, (err, result) => {
    t.error(err);
    t.equal(acc, 10);
  });

  lambda({}, {}, (err, result) => {
    t.error(err);
    t.equal(result.statusCode, 200);
  });
});

test('test async handler', t => {
  t.plan(4);

  let acc = 0;

  const pambda = records(async (record, context) => {
    acc = acc + record;
  });

  const lambda = pambda((event, context, callback) => {
    callback(null, {
      statusCode: 200,
    });
  });

  lambda({
    Records: [ 1, 2, 3, 4 ],
  }, {}, (err, result) => {
    t.error(err);
    t.equal(acc, 10);
  });

  lambda({}, {}, (err, result) => {
    t.error(err);
    t.equal(result.statusCode, 200);
  });
});
