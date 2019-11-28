
# js事件循环执行机制

关键词：单线程，执行栈，宏任务，微任务，同步任务，异步任务

1. 所有的同步任务都在主线程上执行，形成一个执行栈
2. 事件触发线程管理一个任务队列，当异步任务运行完成，就在任务队列中放置一个事件
3. 一旦执行栈中的所有同步任务执行完毕，即JS引擎空闲，系统就会读取任务队列，将异步回调的任务添加到可执行栈中执行。

事件循环图  

<img :src="$withBase('/img/事件循环.png')">

### 宏任务(macrotask)和微任务(microtask)
js中分两种任务类型，macrotask和microtask,在ECMAScript中，microtask称为jobs，macrotask可称为task.

* macrotask，每次执行栈执行的代码就是一个宏任务（包括每次从事件队列中获取一个事件回调并放到执行栈中执行）
    - 每一个task会从头到尾将这个任务执行完毕，不会执行其它
    - 浏览器为了能够使得JS内部task与DOM任务能够有序的执行，会在一个task执行结束后，在下一个 task 执行开始前，对页面进行重新渲染
```javascript
task->jobs->渲染->task->...
```
* microtask，所有微任务也按顺序执行，且在以下场景会立即执行所有微任务
    - 每个回调之后且js执行栈中为空，即使依然有同步事件。（下文有该例子，很经典）
    - 每个宏任务结束后。（即事件循环的一般逻辑）

宏任务和微任务的类型：

- 宏任务包括：script(全局任务), setTimeout, setInterval, setImmediate, I/O, UI rendering。
- 微任务包括: new Promise().then(回调), process.nextTick,MutationObserver(html5新特性)

宏任务按顺序执行，且浏览器在每个宏任务之间渲染页面

<img :src="$withBase('/img/宏任务和微任务.png')">

参考文献

### Node中的事件循环

process.nextTick   > promise  >  setTimeout   >   异步IO  >  setImmediate 

<img :src="$withBase('/img/nodeEventloop.jpg')">

1. [Tasks, microtasks, queues and schedules](https://user-gold-cdn.xitu.io/2018/6/5/163ceb8ce3986025?imageslim)
1. [node eventloop standard](https://nodejs.org/en/docs/guides/event-loop-timers-and-nexttick/)


