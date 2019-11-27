//浅拷贝之模拟Object.assign的实现

//使用defineProperty从而使assgin2是不可枚举的，与原生一致
Object.defineProperty(Object, "assign2", {
    value: function (target) {
      'use strict';
      if (target == null) { 
        throw new TypeError('Cannot convert undefined or null to object');
      }

      // 将target转化为包装对象
      var to = Object(target);
        
      for (var index = 1; index < arguments.length; index++) {
        var nextSource = arguments[index];

        if (nextSource != null) { 
          for (var nextKey in nextSource) {
              //尽量使用call，以防nextSource没有该方法，例如obj = Obejct.create(null)
            if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
              to[nextKey] = nextSource[nextKey];
            }
          }
        }
      }
      return to;
    },
    writable: true,
    configurable: true
});

//深拷贝
function deepClone(source, hash = new WeakMap()){
    if(!isObject(source)) return source;
    if(hash.has(source)) return hash.get(source);
    var target = Array.isArray(source) ? [] : {};
    hash.set(source, target);

    //使用hash表即可判断循环引用
    //直接使用Reflect即可遍历一般属性和symbol属性
    Reflect.ownKeys(source).forEach(key=>{
        if(isObject(source[key])){
            target[key] = deepClone(source[key], hash);
        } else{
            target[key] = source[key];
        }
    })
    return target;

}
function isObject(value){
    return (typeof value === "object" && value != null);
}