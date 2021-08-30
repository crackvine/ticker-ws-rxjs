import { webSocket } from 'rxjs/webSocket';
import { map, scan, filter } from 'rxjs/operators';

const OVER = 60;
const subject = webSocket('wss://stream.binance.com:9443/ws/btcusdt@ticker');

const mapped = subject.pipe(
  scan((acc, curr) => {
    acc.push(curr.a);
    if (acc.length > OVER) { acc.shift(); }
    return acc;
  }, []),
  map(arr => arr.reduce((avg, val) => avg + parseFloat(val), 0) / arr.length),
);

mapped.subscribe({
  next: msg => console.log(msg), 
  error: err => console.log(err), 
  complete: () => console.log('complete')
});
