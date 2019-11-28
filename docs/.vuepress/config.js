module.exports = {
    title: 'HMC NOTE',
    description: 'record hmc note',
    markdown: {
        lineNumbers: true // 代码块显示行号
    },
    base: '/HMC-VUEPRESS-NOTE/',
    themeConfig: {
        nav: [
            { text: '首页', link:'/'},
            { text: 'javascript进阶', link: '/javascript进阶/' },
            { text: 'css进阶', link: '/css进阶/' },
        ],
        sidebar: {
            '/javascript进阶': [
                {
                    title:'第一章：DOM',
                    collapsable: true,
                    children:[
                        'javascript进阶/DOM/js上传文件的方式',
                        'javascript进阶/DOM/vue-cli脚手架快速搭建项目',
                    ]
                },
                {
                    title:'第二章：JS常用代码原理实现',
                    collapsable: true,
                    children:[
                        ['javascript进阶/javascript原理实现/深拷贝和浅拷贝的实现','1.深拷贝和浅拷贝的实现'],
                        ['javascript进阶/javascript原理实现/不同继承方式的实现','2.不同继承方式的实现'],
                        ['javascript进阶/javascript原理实现/DOM树的深度和广度遍历','3.DOM树的深度和广度遍历'],
                        ['javascript进阶/javascript原理实现/this指向和call,apply,bind,new的实现','4.this指向和call,apply,bind,new的实现'],
                        'javascript进阶/javascript原理实现/promise的实现',
                    ]
                },
                {
                    title:'第三章：JS深入',
                    collapsable: true,
                    children:[
                        ['javascript进阶/javascript深入/原型和原型链','1.原型和原型链'],
                        ['javascript进阶/javascript深入/JS事件循环执行机制','2.JS事件循环执行机制'],
                        ['javascript进阶/javascript深入/JS执行机制深入总结','3.JS执行机制深入总结'],
                    ]
                },
                {
                    title:'第四章：JS设计模式',
                    collapsable: true,
                    children:[
                        ['javascript进阶/JS设计模式/1.单例模式','1.单例模式'],
                        ['javascript进阶/JS设计模式/2.策略模式','2.策略模式'],
                        ['javascript进阶/JS设计模式/3.代理模式','3.代理模式'],
                        ['javascript进阶/JS设计模式/4.迭代器模式','4.迭代器模式'],
                        ['javascript进阶/JS设计模式/5.发布订阅模式','5.发布订阅模式'],
                        ['javascript进阶/JS设计模式/6.命令模式','6.命令模式'],
                        ['javascript进阶/JS设计模式/7.组合模式','7.组合模式'],
                        ['javascript进阶/JS设计模式/8.模板方法模式','8.模板方法模式'],
                        ['javascript进阶/JS设计模式/9.享元模式','9.享元模式'],
                        ['javascript进阶/JS设计模式/10.职责链模式','10.职责链模式'],
                        ['javascript进阶/JS设计模式/11.中介者模式','11.中介者模式'],
                        ['javascript进阶/JS设计模式/12.装饰者模式','12.装饰者模式'],
                        ['javascript进阶/JS设计模式/13.状态模式','13.状态模式'],
                        ['javascript进阶/JS设计模式/14.适配器模式','14.适配器模式'],
                        ['javascript进阶/JS设计模式/高阶函数','高阶函数']
                    ]
                },
            ],
            '/css进阶': [
                {
                    title:'第一章：基线，line-height和vertical-align',
                    collapsable: true,
                    children:[
                        'css进阶/chapter1/line-height和vertical-align',
                        'css进阶/chapter1/temp',
                    ]
                },
            ]
        }
    },
    sidebarDepth:2
    
}