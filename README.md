**A Tiny lib that sends a notification whenever any of promise is resolved from a list of Promises**

It can be useful for
* A batch call
* You want to run your promises in parallel and don't care the order of resolved promises but still want to get notified for resolved ones

Sample usage

```
import FastResolvePromises, { EventTypes } from './fastresolvePromise';

const test = FastResolvePromises(
  [
    new Promise((resolve, reject) => { setTimeout(() => { resolve('second') }, 1500) }),
    new Promise((resolve, reject) => { setTimeout(() => { resolve('third') }, 2000) }),
    new Promise((resolve, reject) => { setTimeout(() => { resolve('first') }, 500) }),
    new Promise((resolve, reject) => { setTimeout(() => { resolve('fourth') }, 3000) }),
  ],
);

test
  .on(EventTypes.Resolved, (str) => {
      // this is called whenever a promise is resolved
      // in this example, this callback will be called 4 times
      // 1. str => 'first'
      // 2. str => 'second'
      // 3. str => 'third'
      // 4. str => 'fourth'
  })
  .on(EventTypes.OperationEnded, ({ resolved, rejected }) => {
    // this is called when every promises finished 
    console.log('resolved: ', resolved); // number of resolved 
    console.log('rejected: ', rejected); // number of rejected
  })
  .on(EventTypes.Rejected, (error) => {
   // this is called whenever there is rejected promise
    console.log(error);
  });
 ```

API

**FastResolvePromises**
 
 Param
 
 | Type | Description | Required |
 | ---- | ----------- | -------- |
 | Array | Array of Promises | Yes | 

**The function returns an event object which has `on` method that you can listen events**

 | Event name | Description |
 | ---- | ----------- |
 | EventTypes.Resolved | Notified whenever a promise resolved | 
 | EventTypes.Rejected | Notified whenever a promise rejected |
 | EventTypes.OperationEnded | Notified when all promises resolved/rejected |


