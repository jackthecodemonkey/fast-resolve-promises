import React from 'react';
import FastResolvePromises, { EventTypes } from './fastresolvePromise';

const test = FastResolvePromises(
  [
    new Promise((resolve, reject) => { setTimeout(() => { resolve('thrid') }, 1500) }),
    new Promise((resolve, reject) => { setTimeout(() => { resolve('fourth') }, 2000) }),
    new Promise((resolve, reject) => { setTimeout(() => { resolve('first') }, 500) }),
    new Promise((resolve, reject) => { setTimeout(() => { reject(new Error('second : reject after 1 min')) }, 1000) }),
    new Promise((resolve, reject) => { setTimeout(() => { resolve('fifth') }, 3000) }),
    new Promise((resolve, reject) => { setTimeout(() => { reject(new Error('last: reject after 3 min')) }, 3000) }),
  ],
);

test
  .on(EventTypes.Resolved, (str) => {
    console.log(str);
  })
  .on(EventTypes.OperationEnded, ({ resolved, rejected }) => {
    console.log('resolved: ', resolved);
    console.log('rejected: ', rejected);
  })
  .on(EventTypes.Rejected, (error) => {
    console.log(error);
  });

const anotherTest = FastResolvePromises(
  [
    Promise.resolve('anotherTest first'),
    Promise.resolve('anotherTest second'),
    Promise.reject(new Error('anotherTest third!')),
    Promise.resolve('anotherTest fourth'),
    Promise.resolve('anotherTest fifth'),
    Promise.reject(new Error('anotherTest last!')),
  ],
);

anotherTest
  .on(EventTypes.Resolved, (str) => {
    console.log(str);
  })
  .on(EventTypes.OperationEnded, ({ resolved, rejected }) => {
    console.log('resolved: ', resolved);
    console.log('rejected: ', rejected);
  })
  .on(EventTypes.Rejected, (error) => {
    console.log(error);
  });


function App() {
  return (
    <div></div>
  );
}

export default App;
