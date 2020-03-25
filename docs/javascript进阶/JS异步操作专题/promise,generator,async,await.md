# promise, generator, async, await

```javascript
/**
 * generator, 通过a.next()使程序暂停在yield处,得到如{ value:8, done:false }的值
 * 而yield的返回值,则是由next(arg)的参数决定
 *  
 */
function* foo(x) {
    var y = 2 * (yield (x + 1));
    var z = yield (y / 3);
    return (x + y + z);
  }
  
  var a = foo(5);
  a.next() // Object{value:6, done:false}
  a.next() // Object{value:NaN, done:false}
  a.next() // Object{value:NaN, done:true}
  
  var b = foo(5);
  b.next() // { value:6, done:false }
  b.next(12) // { value:8, done:false }
  b.next(13) // { value:42, done:true }
  
/**
 * JS异步执行方案
 * 1.回调函数,把任务的第二段单独写在一个函数里面,等到重新执行这个任务的时候,就直接调用这个函数
 * 2.Promise, 现代异步执行方案几乎都是在Promise的基础上完成,或者说支持Promise
 * 3.generator函数, 协程
 */

/**
 * 
 * next()返回值的value属性,是generator函数向外输出的数据,而next方法传入的参数,则是向generator内部传入的数据,
 * 暂停执行,恢复执行,函数体内外的数据交换,错误处理机制,有这四个特性
 * 因此generator构成了一个完整的异步解决方案
 * 缺点:需要手动next,而且分段执行的位置在不同的地方
 */
function* gen(x){
    try {
      var y = yield x + 2;
    } catch (e){
      console.log(e);
    }
    return y;
  }
  
  var g = gen(1);
  g.next();
  g.throw('出错了');

/**
 * co模块, 自动执行器,使得不需要编辑执行器就能自动执行
 * 且co模块返回一个Promise对象,因此还可以添加then方法的回调
 */
var gen = function* () {
    var f1 = yield readFile('/etc/fstab');
    var f2 = yield readFile('/etc/shells');
    console.log(f1.toString());
    console.log(f2.toString());
};
var co = require('co');
co(gen).then(function(){
    console.log('执行完毕');
})

/**
 * async, await,本质是generator函数的语法糖,体现在以下四点
 * 1.内置执行器,无需co模块
 * 2.更好的语义,语法更加清晰明朗
 * 3.更好的适用性接收Promise或原始数据类型(通过Promise.resolve转成Promise)
 * 4.async返回值是Promise,因此可以继续then
 * await的返回值是其后面Promise执行的结果,这些都可以通过后面的执行器得出
 * 
 */
const asyncReadFile = async function () {
    const f1 = await readFile('/etc/fstab');
    const f2 = await readFile('/etc/shells');
    console.log(f1.toString());
    console.log(f2.toString());
};
asyncReadFile()

/**
 * async函数的实现原理,就是将generator函数和自动执行器,包装在一个函数里
 */
async function fn(args){
    const f1 = await readFile('/etc/fstab');
    const f2 = await readFile('/etc/shells');
    console.log(f1.toString());
    console.log(f2.toString());
}
//上面的写法等同于下面的写法
function fn(args){
    return spawn(function* (){
        const f1 = yield readFile('/etc/fstab');
        const f2 = yield readFile('/etc/shells');
        console.log(f1.toString());
        console.log(f2.toString());
    });
}

function spawn(genFn) {
    //执行器返回一个promise,符合特性async返回一个Promise
    return new Promise((resolve, reject)=>{
        const gen = genFn();
        function step(nextF) {
            let next;
            try {
                //gen.throw(e) 外部抛出错误会被捕获,内部运行错误也会被捕获
                next = nextF();//{value: ,done: }
            } catch (e){
                //有一次抛出错误,就reject
                return reject(e);
            }
            if(next.done) {
                //如果执行完成,则把最后一次执行的结果resolve给async的promise
                return resolve(next.value);
            }
            //通过Promise.resolve()把原始类型也转成Promise,这就是await后面跟的是个Promise(或被转化成的Promise)的特性
            Promise.resolve(next.value).then((value)=>{
                /**
                 * 如果value是一个原始值,例如 const b = yiled 3, 则这个值直接通过next函数赋值给返回值b
                 * 解释了 const b = await 3的返回值b = 3
                 * 如果next.value是一个Promise,则Promise.resolve(next.value)原封不动地返回value这个Promise,在then之后
                 * 即把next.value得到的结果resolve(value)/reject(reason), 传给then   
                 * 当next执行出错时,通过Promise的then方法接收reason, 直接gen.throw(reason),然后被捕获
                 */
                step(()=>gen.next(value));
            }, (reason)=>{
                step(()=>gen.throw(reason));
            });
        }
        //第一次yield, 传入一个undefined值
        step(()=>gen.next(undefined));
    })
}
```

 