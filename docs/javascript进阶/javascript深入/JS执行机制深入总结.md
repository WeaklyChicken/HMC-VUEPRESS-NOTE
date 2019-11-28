# javascript 执行机制总结
## 词法作用域
JavaScript 采用的是词法作用域，函数的作用域在函数定义的时候就决定了。   

而函数调用对于变量时的查找是通过作用域链进行的，因此在函数创建的时候其实已经添加了作用域链  
 
## 执行上下文栈
可执行代码：全局代码、函数代码、eval代码
当调用可执行代码的时候，即会创建可执行上下文，JavaScript 引擎创建了执行上下文栈（Execution context stack，ECS）来管理执行上下文

js初始化的时候即会压入全局可执行上下文（global context）,程序执行完成之前底部必有一个global context

```javascript
ECStack = {
    globalContext
}
```
每个**执行上下文**，都包含三个对象
- 变量对象(Variable object，VO)
- 作用域链(Scope chain)
- this  

全局上下文的变量对象就是全局对象，在浏览器系统中就是window.
## 变量对象
### 函数上下文
在函数上下文中，我们用活动对象(activation object, AO)来表示变量对象  

<img :src="$withBase('/img/AO对象创建过程.png')">


活动对象是在进入函数上下文时刻被创建的，它通过函数的 arguments 属性初始化。arguments 属性值是 Arguments 对象。然后再按上图步骤声明其他变量
## 执行过程
### 进入执行上下文
当进入执行上下文时，这时候还没有执行代码，此刻创建活动对象  

变量对象会包括：
1. 函数的所有形参 (如果是函数上下文)  
    - 由名称和对应值组成的一个变量对象的属性被创建
    - 没有实参，属性值设为 undefined
2. 函数声明
    + 由名称和对应值（函数对象(function-object)）组成一个变量对象的属性被创建
    + 如果变量对象已经存在相同名称的属性，则完全替换这个属性
3. 变量声明
    * 由名称和对应值（undefined）组成一个变量对象的属性被创建；
    * 如果变量名称跟已经声明的形式参数或函数相同，则变量声明不会干扰已经存在的这类属性
### 代码执行
在代码执行阶段，会顺序执行代码，根据代码，修改变量对象的值


举个例子：
```javascript
function foo(a) {
  var b = 2;
  function c() {}
  var d = function() {};

  b = 3;

}
foo(1);
```
在进入执行上下文后，这时候的 AO 是：
```javascript
AO = {
    arguments: {
        0: 1,
        length: 1
    },
    a: 1,
    b: undefined,
    c: reference to function c(){},
    d: undefined
}
```
在代码执行阶段，会顺序执行代码，根据代码，修改变量对象的值
```javascript
AO = {
    arguments: {
        0: 1,
        length: 1
    },
    a: 1,
    b: 3,
    c: reference to function c(){},
    d: reference to FunctionExpression "d"
}
```
### 总结

1. 全局上下文的变量对象初始化是全局对象

2. 进入函数上下文的变量对象初始化只包括 Arguments 对象

3. 在进入执行上下文时会给变量对象添加形参、函数声明、变量声明等初始的属性值

4. 在代码执行阶段，会再次修改变量对象的属性值  
## 作用域链
每个**执行上下文**，都包含三个对象
- 变量对象(Variable object，VO)
- 作用域链(Scope chain)
- this  

由JavaScript词法作用域，函数的作用域在函数定义的时候就已经决定了  
这是因为函数有一个内部属性 [[scope]]，当函数创建的时候，就会保存所有父变量对象到其中，你可以理解 [[scope]] 就是所有父变量对象的层级链
### 函数激活
当函数激活时，进入函数上下文，创建 VO/AO 后，就会将活动对象添加到作用链的前端，此时作用域链创建完毕
```javascript
Scope = [AO].concat([[Scope]]);
```
### 函数的参数
函数的参数在内部是用数组的方式存储的，因此JS的函数不介意传递过来多少个参数，在函数体内可用通过aruguments对象来访问这个参数数组，在上下文创建活动对象AO的时候创建。arguments的长度等于实际参数的长度
### 函数的操作
>创建函数  
>1,先开辟一个新的内存空间  
>2,把函数体中编写的js代码当作字符串存储到空间中，函数只创建不执行没有意义，因为其中都是字符串
>3,把分配的地址赋值给声明的函数名（function fn 和 var fn操作原理相同，都是在当前作用域中声明了一个名字，var fn只是变量的声明，在执行的时候才将函数体赋值给fn,而function fn是函数的声明和创建，声明的时候就已经赋值）  

>执行函数  
>1,函数执行的时候会形成一个新的私有作用域，只能执行函数体中的代码  
>2,执行代码之前，先把创建函数存储的字符串变成真正的js表达式，按照从上到下的顺序在私有作用域执行  
>3,一个函数可以执行n次，互不干扰，形成的私有作用域把函数体中的私有变量都包裹起来了，这种保护机制是闭包的保护功能

### JS中的栈内存和堆内存
**栈内存**：
俗称作用域（全局私有）,执行上下文即是栈内存。为js代码提供执行的环境，基本数据类型的直是直接存放在栈内存之中的  
**堆内存**：
存储引用数据类型（相当于一个存储的仓库），对象存储的是键值对，函数存储的是代码字符串  
【堆内存】    
var o = {},当前对象堆内存被变量o占用则堆内存是无法销毁的
o = null，null为空对象指针，此时上一次的堆内存就没有被占用了，chrome浏览器会在空闲时间把没有被占用的堆内存自动释放  
【栈内存】
一般情况下，函数执行形成栈内存，函数执行完，浏览器会把形成的栈内存自动释放；但有时候执行完成，栈内存不能被释放。全局作用域在加载页面但时候执行，在关掉页面但时候销毁

### 函数执行上下文中作用域链和变量对象的创建过程
1. 函数创建的时候，保存作用域链到内部属性[[scope]]
2. 执行函数的时候，先创建函数执行上下文，函数执行上下文被压入执行上下文栈
3. 函数并不立刻执行，开始做准备工作，即变量对象的创建和作用域链的创建
4. 第一步：复制函数[[scope]]属性创建作用域链
5. 第二步：用 arguments 创建活动对象，随后初始化活动对象，加入形参、函数声明、变量声明（变量提升）
6. 第三步：将活动对象压入作用域链顶端
7. 准备工作做完，开始执行函数，随着函数的执行，修改 AO 的属性值
8. 函数返回后函数执行完毕，函数上下文从执行上下文栈中弹出

例子等均可参考引用文献
## this指向
每个**执行上下文**，都包含三个对象
- 变量对象(Variable object，VO)
- 作用域链(Scope chain)
- this 

牢记两点：
1. 普通函数的this的指向只与调用时的执行上下文有关
2. 箭头函数由词法作用域，无this,指向当前执行上下文的this即可。
### 普通函数
1. 对象调用：Obj.a(), this指向Obj
2. 函数调用：a(), this指向window, 严格模式是undefined
3. 构造函数：new a(), this指向当前对象
4. 重定向调用： Obj.a.bind(b), this指向b
5. 普通函数的this在回调中指向window, 原因是同无对象调用，单纯函数调用。
6. 因此自执行函数无对象调用，this->window，任何时候
7. 回调函数为匿名函数时，执行上下文->回调函数的this会指向window
### 箭头函数
1. 在方法中定义时，由于方法是对象调用的，因此词法，this->调用的对象
2. 箭头函数当作对象的方法定义时，创建对象实则时先创建函数->赋值给变量，因此指向window.即此时的词法上下文是window,因为变量创建的时候是没有生成执行上下文的，此时的执行上下文依然是全局执行上下文
3. 回调函数中定义时，词法，this->调用的对象，如setTimeOut,Promise.

## 执行上下文过程总结
(摘自冴羽大大深入理解之执行上下文)
```javascript
var scope = "global scope";
function checkscope(){
    var scope = "local scope";
    function f(){
        return scope;
    }
    return f;
}

var foo = checkscope();
foo();
```
1.代码执行，进入全局执行上下文，压入执行上下文栈
```javascript
ECStack = [
    globalContext
]
```
2.全局上下文初始化 
```javascript
globalContext = {
        VO: [global],
        Scope: [globalContext.VO],
        this: globalContext.VO
    }
```
3.函数checkscope创建，保存作用域链到内部属性[[scope]]表示
```javascript
checkscope.[[scope]] = [
      globalContext.VO
    ];
```
4.checkscope执行，创建执行上下文，并压入执行上下文栈
```javascript
ECStack = [
    checkscopeContext,
    globalContext
]
```
5.checkscopeContext上下文初始化
1. 复制函数 [[scope]] 属性创建作用域链，
2. 用 arguments 创建活动对象AO，
3. 初始化活动对象，即加入形参、函数声明、变量声明，
4. 将活动对象压入 checkscope 作用域链顶端。
```javascript
checkscopeContext = {
        AO: {
            arguments:{
                length:0
            },
            scope: undefined,
            f: reference to function f(){}
        },
        Scope: [AO,globalContext.VO],
        this: undefined
    }
```
6.checkscope函数执行，返回f函数，checkscopeContext退栈
```javascript
ECStack = [
    globalContext
]
```
7.将f函数赋值给foo,foo执行。需要注意的是此时checkscope已经退栈，那么foo执行的时候为何scope依然引用的是“local scope”呢，原因是执行机制中，f函数创建的时候已经保存了作用域链,f的执行上下文退栈，但是其AO并没有销毁，这就是闭包的原理
```javascript
f.[[scope]] = [
    checkscope.AO,
    globalContext.VO
]
``` 
8.foo执行，创建执行上下文，压入执行上下文栈，初始化步骤同上，然后执行
1. 复制函数 [[scope]] 属性创建作用域链，
2. 用 arguments 创建活动对象AO，
3. 初始化活动对象，即加入形参、函数声明、变量声明，
4. 将活动对象压入 checkscope 作用域链顶端。
```javascript
fooContext = {
        AO: {
            arguments:{
                length:0
            },   
        },
        Scope: [AO,checkscope.AO,globalContext.VO],
        this: undefined
    }
```


## 参考文献
1. [冴羽大大深入理解系列](https://github.com/mqyqingfeng/Blog/issues/3)
2. [汤姆大叔深入js系列](https://www.cnblogs.com/TomXu/archive/2012/01/16/2309728.html)
3. [图解Javascript——变量对象和活动对象](https://www.cnblogs.com/ivehd/p/vo_ao.html)
4. [this指向详细解析(箭头函数)](http://www.cnblogs.com/dongcanliang/p/7054176.html)
5. [理解JS回调函数](https://www.cnblogs.com/gavinyyb/articles/6286750.html)
6. [JS的匿名函数与自执行](https://juejin.im/entry/57fee360a22b9d005b1d9ae3)
7. [王福朋---深入理解JS原型和闭包](https://www.cnblogs.com/wangfupeng1988/p/3994065.html)