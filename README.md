![bem-animations](https://cloud.githubusercontent.com/assets/1655916/19938823/69484340-a137-11e6-8560-dc3da4fda6b0.png)

Библиотека готовых CSS-анимаций для БЭМ-платформы, основанная на [Animate.CSS](https://github.com/daneden/animate.css). Портирована для тех, кто не хочет каждый раз настраивать анимации вручную.

Прятной разработки! ;)

## Подключение
на примере project-stub

#### Шаг №1
```
bower install bem-contrib/bem-animations --save
```

#### Шаг №2

в `.enb/make.js` подключить уровни

```js
const levels = [
    // ...другие уровни
    { path : 'libs/bem-animations/@common', check : false }
]
```

## Использование

#### Шаг №1

Подключить нужную анимацию в __deps.js__ блока (`my-block/my-block.deps.js`)
```js
[{
    shouldDeps : [
        {
            block : 'animation',
            mods : { type : 'fade-in-down' }
        }
    ]
}]
```

#### Шаг №2

Примиксовать блок анимации в __BEMTREE/BEMHTML__
```js
{
    block : 'my-block',
    mix : [{ block : 'animation' }]
}
```
#### Шаг №3

Подключить в __YModules__, и использовать блок анимации в __i-bem__
```js
modules.define('my-block',
    ['i-bem__dom', 'animation'],
    function(provide, bemDom, Animation) {

provide(bemDom.declBlock(this.name, {
    onSetMod : {
        js : {
            inited : function() {
                cosnt anim = this.findBlockOn('animation');

                anim.start('fade-in-down');
            }
        }
    }
}));

});

```
