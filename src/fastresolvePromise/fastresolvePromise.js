import EventTypes from './eventTypes';
import Event from './event';

const IsPromise = promise => Promise.resolve(promise) === promise;

const FastResolvePromises = (promises) => {
  if (!promises.every(IsPromise)) throw new Error('FastResolvePromises only accepts a list of <Promise>');
  let resolved = 0;
  let rejected = 0;
  const event = Event();
  promises.forEach((promise) => {
    const reportWhenOperationEnded = () => {
      if ((resolved + rejected) === promises.length) {
        setTimeout(() => {
          event.emit(EventTypes.OperationEnded, { resolved, rejected });
          event.clear();
        });
      }
    };
    promise
      .then((result) => {
        ++resolved;
        reportWhenOperationEnded();
        event.emit(EventTypes.Resolved, result);
      })
      .catch((err) => {
        ++rejected;
        reportWhenOperationEnded();
        event.emit(EventTypes.Rejected, err);
      });
  });
  return {
    on: function on(eventType, fn) {
      event.on(eventType, fn);
      return this;
    },
  };
};

export default FastResolvePromises;