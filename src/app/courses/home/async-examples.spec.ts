
import { fakeAsync, tick, flush, flushMicrotasks } from '@angular/core/testing';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';
xdescribe('Async Testing Examples', () => {

  it('Async test examples with Jasmine done()', (done: DoneFn) => {
    let test = false;

    setTimeout(() => {
      console.log('running assestions')
      test = true;
      expect(test).toBeTruthy();
      done()
    }, 1000)

  })

  it('Async test example - setTimeout()', fakeAsync(() => {
    let test = false
    setTimeout(() => {
      test = true;
      expect(test).toBeTruthy();
    }, 1000)
    flush();
  }))

  it('Asynchronous test example - plain promise', fakeAsync(() => {
    let test = false;
    console.log('1.creating Promise'); //1

    Promise.resolve().then(() => {
      console.log('first Promise evaluated successfully'); //3
      return Promise.resolve();
    })
      .then(() => {
        console.log('2nd promise resolved') //4
        test = true
      })

    flushMicrotasks()
    console.log('2. running test assertions') //2
    expect(test).toBeTruthy() //fail

  }))

  it('Async test example: Promises + setTimeout', fakeAsync(() => {
    let counter = 0;

    Promise.resolve()
      .then(() => {
        counter += 10

        setTimeout(() => {
          counter += 1
        }, 1000)
      })
    expect(counter).toBe(0)

    flushMicrotasks()

    expect(counter).toBe(10)

    tick(500)

    expect(counter).toBe(10)

    tick(500)

    expect(counter).toBe(11)
  }))

  it('Async test example - Observables', fakeAsync(() => {
    let test = false;

    console.log('Creating Observable');
    const test$ = of(test).pipe(delay(1000))

    test$.subscribe(() => {
      test = true;
    })
    tick(1000);
    console.log('Running test assertion');
    expect(test).toBe(true)
  }))
})
