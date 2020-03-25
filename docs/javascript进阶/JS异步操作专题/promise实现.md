# Promise实现

```javascript
let resolvePromise = (promise2, x, resolve, reject)=>{
    // x是上一个promise成功或失败之后的回调函数返回的值
    // promise2则是上一个promise then的返回值， resolve和reject则是promise2的函数
    // 判断 x的类型, 来处理promise2的流程
    if(promise2 === x) {
        // 即then的返回值和回调的返回值指向同一个对象
        // resolvePromise是为了解决回调返回的值对于promise2的状态的影响， 而返回promise2的话无法自己判断自己的状态
        return reject(new TypeError('Chaining cycle detected for promise #<Promise>'));
    }
    let called; //确保promise不会同时调用成功和失败态，确保与其他promise兼容
    if(typeof x === "function" || (typeof x === "object" && x !== null)){
        //如果是函数 or 对象则有可能是一个promise
        try{ //此处try针对取then可能报的错误，例如Object.defineProperty({},'then',{get(){throw error})，因为promise A+只是一个规范，确保我们的promise与别人的兼容
            let then = x.then; // promise一定有then方法
            if(typeof then === "function"){ // 如果是函数则认为是一个promise, 不再做更多判断
                then.call(x, y=>{
                    if(called) return;
                    called = true;
                    //成功的情况下，y有可能解析出来依然是promise，因此递归解析
                    //直到y是普通值的情况下即可正确判断出promise2的状态
                    resolvePromise(promise2, y, resolve, reject);
                }, e=>{
                    if(called) return;
                    called = true;
                    reject(e);
                })
            } else{
                resolve(x); // x不是promise,则直接抛出返回值
            }
        } catch(e){
            if(called) return;
            called = true;
            reject(e);
        }
        
    } else {
        resolve(x); //如果是常量，直接成功
    }
}
class Promise{
    constructor(executor){
        this.status = "pending";//状态
        this.value;//成功返回的值
        this.reason;//失败的原因
        /**
         * value和reason是重点,这两个值是链式调用的核心传递值
         */
        this.resolveCallbacks = [];//promise异步执行，则保存pending状态的回调函数
        this.rejectCallbacks = [];//pending状态下提前then的值会放在这里，之后then不受影响
        //promise没有resolve, reject方法，因此肯定不是写在原型上的
        let resolve = (value)=>{
            //只有等待态的时候才能更改状态
            if(this.status == "pending"){
                this.status = "fulfilled";
                this.value = value;
                this.resolveCallbacks.forEach(fn=>fn())// 发布订阅
            }
            
        }
        let reject = (reason)=>{
            if(this.status == "pending"){
                this.status = "rejected";
                this.reason = reason;
                this.rejectCallbacks.forEach(fn=>fn())
            }
            
        }
        try{ // try针对在promise状态改变的时候执行的时候出错，则直接走到失败态
            executor(resolve, reject);//promise创建就立即执行
        }catch(e){
            reject(e);
        }
        
    }
    //promise A+ standard
    // 如果promise中的then方法，无论是成功还是失败，他的返回结果是一个普通的时候就会把这个结果传递给外层的then的下一个then的成功回调, 因为链式调用的promise不是同一个promise
    // 如果promise中的then方法, 无论当前promise是成功 、失败 ,then内部抛错就会走外层的then的下一个then的失败回调,如果下一个then没有错误处理(reject) 会继续向下找，如果找不到就报错
    // 如果promise中的then方法, 无论当前promise是成功 、失败, 如果then的返回值返回是一个promise 那么会让这个promise执行 采用他的状态
    then(onfulfilled, onrejected){
        //链式调用，因此调用then后必须返回一个新的promise
        //.then中onfulfilled, onrejected的返回值将会成为promise2的resolve, reject的参数
        onfulfilled = typeof onfulfilled === "function" ? onfulfilled : value=>value;//如果缺省该函数，则直接返回值，以便下一个then可以处理,相当于往下传
        onrejected = typeof onrejected === "function" ? onrejected : err=>{throw err};//如果缺省该函数，则直接抛出错误，只有这样才能走到下一个的onRejected中,因为两个promise的状态是无关的
        let promise2;
        promise2 = new Promise((resolve,reject)=>{
            if(this.status === 'fulfilled'){
                setTimeout(()=>{ // 既为异步执行，也为了保证promise2存在
                    try{ // try 针对在then中报错的情况，如果报错了，则promise2直接失败即可。
                        // 需要对then的成功的回调和失败的回调取到他的返回结果，如果是普通值就让promise2成功即可
                        let x = onfulfilled(this.value);
                        // 对x的类型做判断，常量可以直接抛出来 但是如果是promise需要采取x的状态(可能是异步执行)作为promise2的状态
                        resolvePromise(promise2,x,resolve,reject);
                    }catch(e){
                        reject(e);//如果error直接做reject,即对应上一个promise reject之后onrejected这里抛出错误 
                    }
                },0);
            }
            if(this.status === 'rejected'){
                setTimeout(()=>{
                    try{
                        let x = onrejected(this.reason);
                        resolvePromise(promise2,x,resolve,reject);
                        //执行完onrejected,如果没有出问题,那么promise2其实是resovled的
                    }catch(e){
                        reject(e);
                    }
                },0)
            }
            if(this.status === 'pending'){
                // 如果then的时候当前状态是pending，则代表内部是异步执行，因此先把成功的回调和失败的回调分开存放
                this.resolveCallbacks.push(()=>{
                    setTimeout(()=>{
                        try{
                            let x = onfulfilled(this.value); //使用箭头函数确保this是当前的promise对象
                            resolvePromise(promise2,x,resolve,reject);
                        }catch(e){
                            reject(e);
                        }
                    },0)
                });
                this.rejectCallbacks.push(()=>{
                    setTimeout(()=>{
                        try{
                            let x = onrejected(this.reason);
                            resolvePromise(promise2,x,resolve,reject);
                        }catch(e){
                            reject(e);
                        }
                    },0)
                })
            }
        });
        return promise2;
        
    }
    catch(onrejected){
        //catch执行完之后返回的promise是resolved状态
        return this.then(null, onrejected);
    }
    static deferred(){ // 测试方法
        let dfd = {};
        dfd.promise = new Promise((resolve,reject)=>{
            dfd.resolve = resolve;
            dfd.reject = reject;
        }) // 相当于dfd是一个pending状态的promise对象，等着发布订阅
        return dfd; // 可以检测这个对象上的promise属性 resolve方法 reject方法
    }
}
module.exports = Promise;

// 全局安装 只能在命令中使用  sudo npm install promises-aplus-tests -g
// promises-aplus-tests promise.js

//.finally(fn) finally本质是执行一个回调函数,无论前面是then,catch什么的,都会执行该函数
//且fn不接受参数,即与promise的状态无关, finally之后还可以继续then,并且将值原封不动传给后面的then
Promise.prototype.finally = function(fn){
    /**
     * finally中传的fn必执行,所以在then中成功和失败都执行.
     * finally可以继续then,并原封不动地传值.因此将fn的执行结果放到promise.resolve中
     * 如果fn()返回值是一般值,则通过再then直接传递值下去
     * 如果fn()返回值是promise,或者出错之类的,缺省reject的函数依然可以将错误结果向下传递
     */
     return this.then((value)=>{
        return Promise.resolve(fn()).then(()=>value)
    },(reason)=>{
        return Promise.resolve(fn()).then(()=>{throw reason})
    });
}
/**
 * promise.resolve将一个对象转成promise对象
 * 1.如果传入promise对象,则直接传出该对象
 * 2.如果传入的是thenable对象,则采用该对象的状态,返回一个promise
 * 3.如果传入的是其他值,则返回以该值为成功过状态的promise对象
 */
Promise.resolve = function(val){
    if(val instanceof Promise){
        return val;
    }
    return new Promise((resolve, reject)=>{
        if(val && val.then && typeof val.then === 'function'){
            //因为promise的then是异步的,所以我们认为这里的thenable对象也是异步的,为了保险,加上setTimeout()
            setTimeout(() => {
                val.then(resolve, reject)
            }, 0);
        } else {
            resolve(param);
        }
    })
}
/**
 * reject的参数会原封不动地直接当作reject的理由,返回reject状态的Promise
 */
Promise.reject = function(reason){
    return new Promise((resolve, reject)=>{
        reject(reason)  
    })
}
/**
 * Promise.all
 * 该方法将多个Promise实例,包装成一个新的Promise对象
 * 该方法接收一个数组作为参数,如果数组中的值不是Promise实例,则使用Promise.resolve转成Promise对象
 * 状态,假设参数是[p1, p2, p3]
 * 1.只有p1, p2, p3的状态都变成fulfilled, p的状态才是fullfilled, 返回p1, p2, p3的返回值组成的数组,传给p的回调函数
 * 2.p1,p2,p3有一个是rejected, p就是rejected, 此时,返回第一个被reject的实例的返回值传递给p的回调函数
 * 3.传递值是通过resolve, reject进行的
 * 1.Promise.all必然返回一个数组
 * const p = Promise.all([p1, p2, p3]).then(()=>{}, ()=>{})
 */
Promise.all = function(array){
    //array不存在的情况下报错
    if(array == undefined){
        throw new Error('......');
    }
    return new Promise((resolve, reject)=>{
        let result = [];
        let i = 0;
        if(array.length === 0){
            resolve(result)
        } else{
            function resolveData(data, index){
                result.push(data);
                //i事先定义因为有可能是异步
                if(++i === array.length){
                    resolve(result)
                    console.log(i)
                }
            }
            Array.prototype.forEach.call(array, function(val, index){
                Promise.resolve(val).then(data=>{
                    resolveData(data, index)
                }, err=>{
                    reject(err);
                    return;
                })
            })
        }

    })
}

/**
 * Promise.race
 * race和all一样,也是将多个Promise实例, 包装成一个新的Promise实例
 * const p = Promise.race([p1, p2, p3])
 * 只要p1, p2, p3之中有一个实例率先改变状态,那么p的状态就跟着改变,并把那个Promise的返回值传递给p的回调函数
 * 
 * 如果传给race的是空数组,则返回的promise将一直等待
 */
Promise.race = function(array){
    //array不存在的情况下报错
    if(array == undefined){
        throw new Error('......');
    }
    return new Promise((resolve, reject)=>{
        if(array.length == 0){
            return;
        } else{
            Array.prototype.forEach.call(array, function(val, index){
                Promise.resolve(val).then(data=>{
                    resolve(data);
                    return;
                }, err=>{
                    reject(err);
                    return;
                })
            })
        }
    })
}
```
