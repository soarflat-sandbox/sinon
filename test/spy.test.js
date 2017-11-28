import sinon from 'sinon';
import assert from 'assert';

const myObj = {
  count: 0,
  operateDate(count) {
    if (myObj.isPositive(count)) myObj.incCount(count);
  },
  incCount(count) {
    myObj.count += count;
    return myObj.count;
  },
  isPositive(count) {
    return count > 0;
  },
};

describe('spy', () => {
  beforeEach(() => {
    myObj.count = 0;
  });

  it('incCountメソッドにスパイを仕込ませ検証', () => {
    // スパイをincCountメソッドに仕込む
    const spy = sinon.spy(myObj, 'incCount');
    myObj.operateDate(5);
    myObj.operateDate(-1);
    myObj.operateDate(3);
    myObj.operateDate(0);

    // incCount()が呼ばれた回数
    assert(spy.callCount === 2);

    // 最初にincCount()が呼ばれた際の引数
    assert(spy.getCall(0).args[0] === 5);

    // 最初にincCount()が呼ばれた際の引数
    assert(spy.args[0][0] === 5);

    // 2回目にincCount()が呼ばれた際の戻り値
    assert(spy.returnValues[1] === 8);

    // incCount()が引数3で呼ばれた回数
    assert(spy.withArgs(3).callCount === 1);
  });
});