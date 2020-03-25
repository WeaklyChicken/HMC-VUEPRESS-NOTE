
# throttle和debounce
```javascript
/**
 * debounce
 * 场景:1.窗口大小变化, 调整样式 2.搜索,输入后500ms校验, 发送请求
 */
function debounce(fn, wait, immediate){
    let timer = null;
    return function (...args) {
        if(!timer && immediate){
            fn.apply(this, args);
        }
        clearTimeout(timer);
        timer = setTimeout(() => {
            fn.apply(this, args);
        }, wait);
    };
}

/**
 * throttle
 * 第一次必然触发,最后一次不触发
 */
function throttle(fn, time){
    let start = 0, end = 0;
    return function (...args) {
        end = Date.now();
        if(end - start > time){
            fn.apply(this, args);
            start = end;
        }
    }
}
/**
 * 定时器版
 * 第一次不触发,最后一次必然触发
 */
function throttle2(fn, time){
    let timer = null;
    return function (...args){
        if(!timer){
            timer = setTimeout(() => {
                timer = null;
                fn.apply(this, args);
            }, time);
        }
    }
}

/**
 * 防抖和节流结合,第一次和最后一次都会触发,也可避免防抖函数一直点击,从而长时间不触发
 */
function throttle3(fn, time){
    let timer = null;
    let start = 0, end = 0;
    return function(...args){
        end = Date.now();
        if(end - start > time){
            clearTimeout(timer);
            timer = null; //记得清空
            fn.apply(this, args);
            start = end;
        } else if(!timer){
            timer = setTimeout(() => {
                fn.apply(this, args);
            }, time);
        }
    }
}
```
