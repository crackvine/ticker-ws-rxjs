import { webSocket } from 'rxjs/webSocket';
import { map, scan, filter } from 'rxjs/operators';
import * as d3 from 'd3';

const SYMBOL = 'BTCUSDT';
const AVG_OVER = 60;

const svg = d3.select('#plot1');

const subject$ = webSocket(`wss://stream.binance.com:9443/ws/${SYMBOL.toLowerCase()}@ticker`);

const rollingAvg$ = subject$.pipe(
  scan((acc, curr) => {
    acc.push(curr.a);
    if (acc.length > AVG_OVER) {
      acc.shift();
    }
    return acc;
  }, []),
  map((arr) => arr.reduce((avg, val) => avg + parseFloat(val), 0) / arr.length),
);

const sub1 = rollingAvg$.subscribe({
  next: (msg) => console.log('Rolling average: ' + msg),
  error: (err) => console.log(err),
  complete: () => console.log('complete'),
});

const subA = subject$.subscribe({
  next: (msg) => plotDataPoint(msg.a),
  error: (err) => console.log('ERROR: ' + err),
});

// const subB = subject$.subscribe({
//   next: (msg) => console.log('SubB: ' + msg.a),
//   error: (err) => console.log('ERROR: ' + err),
// });

let x = 0;
const plotDataPoint = (val) => {
  console.log('plotting value ', val);
  const y = d3.scaleLinear().domain([49500, 50000]).range([0, 400]);
  console.log(y(val));
  svg.append('circle').attr('cx', x).attr('cy', y(val)).attr('r', 2).style('fill', 'blue');
  x++;
};
