import FastResolvePromises, { EventTypes } from '../fastresolvePromise';

describe('FastResolvePromise test', () => {

    it('Should return an event object', () => {
        const test = FastResolvePromises([new Promise((resolve) => { resolve(true) })]);
        expect(typeof test.on).toEqual('function');
    })

    it('Should accept only Promise objects', (done) => {
        try {
            FastResolvePromises(
                [
                    new Promise((resolve) => { resolve(true) }),
                    () => { },
                ],
            );
        } catch (e) {
            expect(e.message).toEqual('FastResolvePromises only accepts a list of <Promise>');
            done();
        }
    })

    it('Should get notified whenever any of promises resolved', (done) => {
        const expectedResults = ['first', 'second', 'third', 'fourth'];
        const test = FastResolvePromises(
            [
                new Promise((resolve) => { setTimeout(() => { resolve('second') }, 500) }),
                new Promise((resolve) => { setTimeout(() => { resolve('third') }, 700) }),
                new Promise((resolve) => { setTimeout(() => { resolve('first') }, 200) }),
                new Promise((resolve) => { setTimeout(() => { resolve('fourth') }, 1000) }),
            ],
        );
        let i = 0;
        test
            .on(EventTypes.Resolved, (result) => {
                expect(result).toEqual(expectedResults[i]);
                i++;
            })
            .on(EventTypes.OperationEnded, ({ resolved, rejected }) => {
                expect(resolved).toEqual(4);
                expect(rejected).toEqual(0);
                done();
            })
    });

    it('Mix of rejected and resolved', (done) => {
        const expectedResolvedResults = ['first', 'thrid', 'fourth', 'fifth'];
        const exepectedRejectedResults = ['second : reject', 'last: reject'];
        const test = FastResolvePromises(
            [
                new Promise((resolve) => { setTimeout(() => { resolve('thrid') }, 500) }),
                new Promise((resolve) => { setTimeout(() => { resolve('fourth') }, 700) }),
                new Promise((resolve) => { setTimeout(() => { resolve('first') }, 100) }),
                new Promise((resolve, reject) => { setTimeout(() => { reject(new Error('second : reject')) }, 200) }),
                new Promise((resolve) => { setTimeout(() => { resolve('fifth') }, 900) }),
                new Promise((resolve, reject) => { setTimeout(() => { reject(new Error('last: reject')) }, 900) }),
            ],
        );
        let i = 0;
        let j = 0;
        test
            .on(EventTypes.Resolved, (resolvedResult) => {
                expect(resolvedResult).toEqual(expectedResolvedResults[i]);
                i++;
            })
            .on(EventTypes.Rejected, (rejected) => {
                expect(rejected.message).toEqual(exepectedRejectedResults[j]);
                j++;
            })
            .on(EventTypes.OperationEnded, ({ resolved, rejected }) => {
                expect(resolved).toEqual(4);
                expect(rejected).toEqual(2);
                done();
            })
    });
})