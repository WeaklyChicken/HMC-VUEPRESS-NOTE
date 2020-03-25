# for in 和for of循环和可迭代对象

```javascript
let arr = [1,2,3]
Array.prototype.ddd = 10

/**
 * for in 迭代key值,包括原型上的可枚举的,如果想迭代本身用hasOwnProperty
 * for of 迭代可迭代对象的定义的迭代值,而不是key
 * 可迭代对象含有Symbol.interator键
 * 内置可迭代对象:String, Array, Map, Set
 * 可迭代对象专有的语句: for of, 展开, yield*, 解构赋值
 */
for(let index in arr){
    console.log(index) //0,1,2,ddd
}
for(let index of arr){
    console.log(index) //1,2,3
} 
/**
 * 这三个和for in一样,都是迭代可枚举的key, 区别在于for of还迭代原型链上的值
 */
Object.keys([1,2,3]) //0,1,2
Object.values([1,2,3]) //1,2,3
Object.entries([1,2,3]) //[0,1],[1,2],[2,3]
//这里使用for of迭代,然后当场解构,不是let后面可以传两个参数
for(let [key, value] of Object.entries([1,2,3])){
    console.log(key, value)
    /**
     * 0 1
     * 1 2
     * 2 3
     * 
     */
}
/**
 * Object.getOwnPropertyNames(Object)
 * 这个方法迭代自身上的所有可枚举和不可枚举的属性
 * (24) ["length", "name", "prototype", "assign", "getOwnPropertyDescriptor", "getOwnPropertyDescriptors", "getOwnPropertyNames",
 *  "getOwnPropertySymbols", "is", "preventExtensions", "seal", "create", "defineProperties", "defineProperty", "freeze", 
 * "getPrototypeOf", "setPrototypeOf", "isExtensible", "isFrozen", "isSealed", "keys", "entries", "fromEntries", "values"]
 */

```