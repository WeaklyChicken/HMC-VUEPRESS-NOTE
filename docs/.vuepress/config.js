module.exports = {
    title: 'HMC NOTE',
    description: 'record hmc note',
    markdown: {
        lineNumbers: true // 代码块显示行号
    },
    base: '/HMC-VUEPRESS-NOTE/',
    themeConfig: {
        nav: [
            {
                text:'首页',
                link:'/'
            },
            {
                text: 'HMC NOTE',
                items: [
                    { text: 'vue', link: '/note/vue/' },
                    { text: 'javascript', link: '/note/javascript' },
                    { text: 'css', link: '/note/css' },   
                ]
            },
            {
                text: 'H5标准',
                link: '/Standard/'
            },
        ],
        sidebar: {
            '/note/': [
              'vue',
              'javascript',
              'css',
            ],
            '/standard/':[
                ['H5版本管理规范','H5版本管理规范'],
                ['H5开发规范','H5开发规范']
            ]
            // '/note/test/': [
            //   'child1',
            //   'child2'
            // ]
        },
        sidebarDepth:2
      
    }
    
}