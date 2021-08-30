import { interval } from 'rxjs';
import { map, filter, takeWhile } from 'rxjs/operators';

console.log(process.env.BINANCE_API_KEY);

// An OBSERVER which logs
const loggerObserver = {
  next: (x) => {
    console.log(x);
  },
  complete: () => {
    console.log('done');
  },
  error: (error) => {
    console.error(error);
  },
};

// An interval OBSERVABLE
const ticker$ = interval(2000).pipe(
  takeWhile((x) => x < 5),
  map((x) => x * 2 + x),
  filter((x) => x % 2 === 0),
);

// A SUBSCRIPTION of the logger observer to the interval observable
const loggerSub1 = ticker$.subscribe(loggerObserver);

// UNSUBSCRIBING the subscription after a period of time
setTimeout(() => {
  loggerSub1.unsubscribe();
}, 20000);
