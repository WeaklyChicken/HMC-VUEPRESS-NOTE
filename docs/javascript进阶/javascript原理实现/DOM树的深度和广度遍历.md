# 深度和广度优先遍历DOM树

## 深度优先遍历并输出带有tagName的node
```javascript
function deepTravTagNames(parentNode){
    let childNodes = parentNode.childNodes;
    Array.prototype.filter.call(childNodes, item=>item.tagName).forEach(element => {
        deepTravTagNames(element);
    });    
}
deepTravTagNames(document.body);
```
## 广度优先遍历并输出带有tagName的node
```javascript
function breadTravTagNames(parentNode){
    let queue  = [parentNode];
    while(queue.length){
        let currentNode = queue.shift();
        let {childNodes, tagName} = currentNode;
        tagName && console.log(currentNode.tagName);
        Array.prototype.filter.call(childNodes, item=>item.tagName).forEach(element => {
            queue.push(element);
        });

    }
}
breadTravTagNames(document.body);
```