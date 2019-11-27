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
                    title:'第二章：JS进阶',
                    collapsable: true,
                    children:[
                        'javascript进阶/javascript高级/深拷贝和浅拷贝的实现',
                        'javascript进阶/javascript高级/promise的实现',
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