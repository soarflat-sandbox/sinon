import sinon from 'sinon';
import assert from 'assert';

const myObj = {
  count: 0,
  operateDate(count) {
    if (myObj.isPositive(count)) {
      myObj.incCount(count);
    }
  },

  incCount(count) {
    myObj.count += count;
    return myObj.count;
  },

  isPositive(count) {
    return count > 0;
  },
};

describe('mock', () => {
  let mock;
  beforeEach(() => {
    myObj.count = 0;
  });

  afterEach(() => {
    mock.restore();
  });

  it('basic', () => {
    mock = sinon.mock(myObj);
    assert(myObj.incCount(3) === 3);
    assert(myObj.count === 3);

    // incCountメソッドの呼び出しをチェックする
    // 以下の記述後、incCount()を2回呼び出すと例外を投げる
    // incCountメソッドはラップされるのでundefinedを返す
    mock.expects('incCount').once();

    assert(myObj.incCount(2) === undefined);
    assert(myObj.count === 3);
    assert(myObj.isPositive(-1) === false);
    mock.verify();
  });

  it('verify1', () => {
    mock = sinon.mock(myObj);
    mock.expects('incCount').once();

    // メソッドが期待された動きをしたかチェック
    // incCount（）が一回も呼ばれておらず、期待に反しているため例外を投げる（テストが通らない）
    mock.verify();
  });

  it('verify2', () => {
    mock = sinon.mock(myObj);
    mock.expects('incCount').once();
    myObj.incCount(1);

    // incCountが2回呼び出されてしまったため、ここで例外を投げる
    myObj.incCount(1);
    mock.verify();
  });

  it('arg1', () => {
    mock = sinon.mock(myObj);

    // incCountが引数が1で2回実行されるのを期待する
    mock.expects('incCount').withArgs(1).exactly(2);

    myObj.incCount(1);
    myObj.incCount(1);
    mock.verify();
  });

  it('arg2', () => {
    mock = sinon.mock(myObj);
    mock.expects('incCount').withArgs(1).exactly(2);
    myObj.incCount(1);

    // incCountが引数が1で1回しか実行されていないため、例外を投げる
    mock.verify();
  });

  it('arg3', () => {
    mock = sinon.mock(myObj);
    mock.expects('incCount').withArgs(1).exactly(2);

    // 引数0でincCountが実行されるため例外を投げる
    myObj.incCount(0);
  });
});
