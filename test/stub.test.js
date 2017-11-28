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

describe('stub', () => {
  beforeEach(() => {
    myObj.count = 0;
  });

  describe('return value', () => {
    it('stubで上書きした戻り値を返す', () => {
      assert(myObj.incCount(2) === 2);
      assert(myObj.count === 2);

      // incCountを上書きする、戻り値はundefinedになる
      const stub = sinon.stub(myObj, 'incCount');

      // 戻り値の指定も可能
      stub.returns('hoge');
      assert(myObj.incCount(3) === 'hoge');

      // 特定の引数の時の戻り値の指定も可能
      stub.withArgs(0).returns('zero');
      stub.withArgs(9).returns('nine');

      assert(myObj.incCount(0) === 'zero');
      assert(myObj.incCount(9) === 'nine');
      stub.restore();
    });
  });

  describe('callback', () => {
    it('コールバック関数countIsNineが実行されcountが9になる', () => {
      const countIsNine = () => {
        myObj.count = 9;
      };
      const stub = sinon.stub(myObj, 'incCount');

      // stub.callsArg(Number)とすることで、Number番目の引数を、コールバックとして実行するようになる。
      // 今回は0を指定しているため、0番目の引数がコールバックで実行される
      stub.callsArg(0);

      // countIsNineがコールバックとして実行されるためmyObj.count = 9になる
      myObj.incCount(countIsNine);

      assert(myObj.count === 9);

      stub.restore();
    });
  });

  describe('throws', () => {
    it('incCount()の引数にfalseを渡した場合例外を投げる', () => {
      const stub = sinon.stub(myObj, 'incCount');

      // falseが渡した時に例外を投げるように指定する
      stub.withArgs(false).throws('error message');

      // 例外を返さない
      try {
        myObj.incCount();
      } catch (e) {
        myObj.count = e.name;
      }

      assert(myObj.count === 0);

      // 例外を返す
      try {
        myObj.incCount(false);
      } catch (e) {
        myObj.count = e.name;
      }

      assert(myObj.count === 'error message');
      stub.restore();
    });
  });
});
