# this, call, apply, bind
## this指向
牢记以下两条规则，再对各种情况下的this具体分析，验证即可
- 在非箭头函数中，**this的指向与函数的定义和在哪执行的位置无关，其永远指向最后调用它的那个对象**。
- 在箭头函数中，**箭头函数自身没有this,它会捕获其定义时的上下文的this的值，作为自己的this**，因此call,apply,bind对箭头函数无效#。

对于一般函数，this指向的几种情况

1. 作为普通的函数调用，this指向window,严格模式下指向undefined
2. 作为对象的方法调用，this指向调用的对象
3. 作为构造器调用，即new，则this指向当前创建的对象
4. call,apply,bind(ie8不支持，可自己写)会重定向this

其他情况很容易理解，不作详解，此处讨论回调函数，函数作为对象的方法，DOM事件的this和匿名函数(通常自执行)的this

回调函数
```javascript
function Name(){
            this.name = "HMC";
            setTimeout(function(){
                console.log(this);   // window
            },1000);
            setTimeout(()=>{console.log(this.name)}
            ,1000); // HMC
        }
        var p = new Name();
```
回调函数中，一般函数的this指向window，箭头函数由于创建时，当前环境的上下文的this即为其this。ajax和promise的then同理。

函数作为对象的方法和自执行函数
```javascript
    var c = 4;
    let A= {
        c:3,
        a :function() {
            (()=>{console.log(this.c);})(); // 3
        },
        b:function() {
            (function () {
                console.log(this.c) // 4
            })();
        },
        d:()=>{console.log(this.c)}, // 4
        e:function(){
            console.log(this.c);// 3
        }
    };
    A.a(); 
    A.b();
    A.d();
    A.e();
```
字面量方式创建，根据词法，箭头函数创建时候的执行上下文是winow,因为只有函数执行的时候才会创建执行上下文。而对于自执行函数，箭头函数创建时上下文已经是在A.a()中了，因此this是A,而普通自函数则因为没有被调用，this指向window

```javascript
    function B(){
            this.name = "HMC";
            this.f1 = function(){console.log(this.name)};
            this.f2 = ()=>{console.log(this.name)};
        }
    var a = new B();
    a.f1(); // HMC
    a.f2(); // HMC
```
构造函数的方式创建，在创建过程中，此时箭头函数的执行上下文的this已经是新建的对象了(详细可见下述new的模拟实现)，因此this指向a

DOM事件的this

使用addEventListener/attchEvent，或DOM.onEvent(div.onClick)添加事件的时候，触发事件时的this是监听器所在的DOM元素

## call, apply, bind, new的实现
以下实现方式主要参考讶羽大大的深入理解JS系列，自己添加了一些关于高阶函数和设计模式的想法

### call , apply
call和apply的区别只在于call是接收任意参数，apply则接收一个参数数组
```javascript
/**
 * Created by hmc on 2019/03/03.
 *代码实现来源于讶羽大大的github

/*
思路：1.将函数设为对象的属性
     2.执行该函数
     3.删除该函数
 */

//第一版
Function.prototype.call2 = function (context) {
    context.fn = this;
    context.fn();
    delete  context.fn;
};

var foo = {
    value:1
};
function bar() {
    console.log(this.value);
}
bar.call2(foo);

//要传入参数，且参数不确定,有返回值

//第二版
Function.prototype.call3 = function (context) {
    context = context || window;
    context.fn = this;
    //假设原函数会传入多个参数，因arguments是一个数组，
    //因此不能直接context.fn(arguments)，即要把arguments拆分
    //也不能context.fn(Array.prototype.join.call(arguments, ','))
    //例如传入的参数是("hello",1),这相当于context.fn("hello,1"),很显然是有问题的
    //先把arguments保存到一个数组里，然后用eval
    var args = [];
    for(var i =1, len = arguments.length; i<len; i++) {
        args.push('arguments[' + i + ']');
        //'arguments[' + i + ']'
    }
    //又因eval内部必须是字符串，而字符串对象会自动转化为字符串，因此
    var result = eval('context.fn(' + args + ')');// 相当于context.fn(arguments[0],arguments[1]);
    //如果直接使用arguments,会发生以下结果,这是为什么要把arguments用字符串拼接的原因
    // eval('context.fn(' + Array.prototype.shift(arguments) + ')')相当于context.fn(hello,1)，hello undefined
    delete context.fn;
    return result;

};
function bar3(name ,age) {
    console.log(name);
    console.log(age);
    console.log(this.value);

}
bar3.call3(foo, 'kevin', 18);

//apply的模拟实现
Function.prototype.apply2 = function (context, arr) {
    context = context || window;
    context.fn = this;
    var result;
    if(!arr){
        result = context.fn();
    } else {
        var args = [];
        for(var i = 0, len = arr.length;i<len;i++){
            args.push('arr[' + i + ']');
        }
        result = eval('context.fn(' + args + ')');
    }
    delete context.fn;
    return result;
};
```
### bind
IE8不兼容bind
```javascript
//兼容性
Function.prototype.bind = Function.prototype.bind || function () {};
```

简洁版bind
```javascript
Function.prototype.bind = function(){
    var fn = this;//保存被bind的函数
    args = Array.prototype.slice.call(arguments);//先把arguments类数组转化为数组
    var object = args.shift();
    return function(){
        fn.apply(object, args.call(Array.prototype.slice.call(arguments)));
        //  bind可以在绑定时和调用时分别传入参数，因此此处拼接
    }
```

构造器优化版bind

当函数作为构造函数时，绑定的bind无效，该简洁版的this依然会指向object,实际应该指向构造函数，fn
```javascript
Function.prototype.bind = function (context) {
    if(typeof this !== 'function'){
        throw new Error('what is trying to be bound is not callable')
        //调用者不是函数的异常
    }
    var self = this;
    //获取第二个到最后的参数,经典的把类数组转化为数组方法
    var args = Array.prototype.slice.call(arguments, 1);
    var fnop = function () {

    };
    var fBind = function () {
        //获取第二次传入的参数，使用concat进行拼接
        var bindArgs = Array.prototype.slice.call(arguments);
        //如果当成构造函数了，则当前对象就是fBind的实例，因此把this指向实例，否则依然是指定的上下文
        return self.apply(this instanceof fBind ? this : context, args.concat(bindArgs));
    };
    //把prototype指向当前函数，目的是为了可以使实例继承到prototype
    //寄生式继承也用了这种原理
    fnop.prototype = this.prototype;
    fBind.prototype = new fnop();
    //使用空函数实例中转prototype，防止改变实例的protototype的时候fBind.prototype也会改变
    return fBind;
};
```
### new
思路：
    1.创建一个空对象，用该对象执行构造函数，即可获取构造函数的属性
    2.将原型指向构造函数的原型，即可获取原型链上的属性
```javascript
function objectFactory(){
    var obj = new Object();
    //取出第一个参数，即为构造函数，且shift会修改arguments，去除第一个参数
    var myConstructor = [].shift.call(arguments);
    obj.__proto__ = myConstructor.prototype;//即可使用原型中的属性
    //浏览器中才能用__proto__
    myConstructor.apply(obj, arguments);//即可使用构造函数中的属性
    var ret = Constructor.apply(obj, arguments);
    //如果构造函数有返回值，则返回值是对象则返回对象，返回值是其他则不作处理，依然返回obj
    return typeof ret === 'object' ? ret : obj;

};
}
function Ota(name, age){
    this.name = name;
    this.age = age;
}
Ota.prototype.strength = 60;
Ota.prototype.getStrength = function () {
    return this.strength;
};
var person = objectFactory(Ota,'hmc',22);
console.log(person.name);
console.log(person.strength);
console.log(person.getStrength());
```
参考资料：

https://github.com/mqyqingfeng/Blog/issues/13
https://www.cnblogs.com/dongcanliang/articles/7054176.html
