# Vue slot嵌套传递和render中的scopedSlots属性
## Vue slot嵌套传递

这在封装高级别组件的时候十分有用,例如我们采用ant-design的组件库,然后要在这之上封装我们自己的组件,那么如果需要用到slot,便需要嵌套, component use -> component based on Antd -> component Antd

以下介绍在组件嵌套中,如何传递slot和scopedSlots, 以及如何在render函数中使用嵌套slot

### step1:在grandParent组件中使用parent, 并传入三个slot,两个是scopedSlot
```javascript
// grandParent
<template>
    <parent>
        <span slot="test1">hello world</span>
        <!-- hello world -->
        <span slot="test2" slot-scope="slotScope"> {{slotScope.attr.text}}</span>
        <!-- i am parent slot scope test2 text -->
        <span slot="test3" slot-scope="slotScope"> {{slotScope.attr.text}} {{slotScope.attr2.text}}</span> 
        <!-- i am test3 child text -->

    </parent>
</template>

<script>
import parent from '@/components/scopeSlot/parent.vue'
import child from '@/components/scopeSlot/child.vue'
export default {
    components:{
        parent,
        child
    }
}
</script>

<style>

</style>
```
### step2:
template形式

* 在parent中假设使用template的方法, 可以看到在parent中渲染的slot test2,直接定义slot标签即可.而在child中渲染的slot则首先通过一个template定义一个slot,表示这是一个作用域child的插槽,然后插槽的内容则是从grandParent中定义的slot,因此内部是一个slot,用于接收从grandParent中传输的内容.
* 而如果是作用域插槽的话,在template中接收child传递过来的参数,通过v-bind的方式原封不动地传向grandParent, 因为child中传递的参数可能是有多个的,为了保持接口的一致性,这里直接使用v-bind传出  

render形式:parent这个组件承上启下,直接分析他的render即可得出所有的slot情况.

* 对于scopedSlots, 如果是组件本身接收, 即parent, 则是写在h函数的子集中,如test2, 如果是组件的子组件接收,即存在嵌套, 那么应当作为child的数据对象的scopedSlots属性传出, 如test3.而该属性渲染的值则为parent.$scopedSlots.test3(props).($scopedSlots返回的是一个可以生成vode的函数数组,$slots返回的是vode对象数组,因此this.$scopedSlots.test1() == this.$slots.test1).而传递的参数则为child内部定义的slot绑定的对象{attr:{}, attr2:{}}
* 对于slot, 如果是组件本身接收, 则作为组件渲染的根元素的子集, 如果是传递给嵌套的组件, 则依然是作为child的组件渲染的子集,但是却要加上slot属性,其值是template的slot名字.这应该是vue文档中说的**如果组件是其它组件的子组件，需为插槽指定名称的意思** .如果只是用template包裹的slot,没有实际标签,则h('template')即可.
```javascript
//parent
<script>
import child from "@/components/scopeSlot/child.vue";

// <template>
//     <div>
//        <child>
//             <template slot="test1">
//                 <div>
//                     <slot name='test1'></slot>
//                 </div>
//             </template>   
//             <template slot="test3" slot-scope="props">
//                 <div>
//                     <slot name='test3' v-bind="props"></slot>
//                 </div>
//             </template>   
//         </child>
//         <slot name="test2" :attr='obj'></slot> 
//     </div>
// </template>

export default {
  data() {
    return {
      obj: {
        text: "i am parent slot scope test2 text"
      }
    };
  },
  components: {
    child
  },
  render(h) {
      let self = this
        /**
         * 作用域插槽可以传入一个参数,这个参数就是内部slot绑定的对象
         * 多级传递的话,首先child需要一个scopedSlots属性代表他可以接收scopeSlot,
         * 然后传入的值为parent(当前组件)所接收到的scopeSlots, 即存在于this.$scopedSlots中的内容
         */
      return h('div',[h(child, {
          scopedSlots:{
              'test3':function(props){
                //   {attr:{}, attr2:{}}
                  return h('div', self.$scopedSlots.test3(props))
              }
          },
        
      },[h('div', {slot:'test1'}, self.$scopedSlots.test1())]), self.$scopedSlots.test2({attr:self.$data.obj})])
      /**
       * 如果不是多级传递,在parent中显示scopeSlots, 则定义在子集中,且传入的参数可以是this.$data, 只需要指定key值attr即可. 
       * 
       * 而插槽无论多级传递,都是放在第三个参数中的,只是传递的值不同而已
       */
  },
};
</script>

<style>
</style>
```
### step3:child组件
```javascript
//child
<template>
  <div>
    <slot name="test1"></slot>
    <slot name="test3" :attr="obj" :attr2="obj2"></slot>

  </div>
</template>

<script>
export default {
    data(){
        return {
            obj:{
                text:"i am test3 child text"
            },
            obj2:{
                text:"i am test3 child text2"
            }
        }
    }
}
</script>

<style>

</style>
```

### 最终结果如下:
<img :src="$withBase('/img/vue/slot_renderSlot.png')">