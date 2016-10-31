# Анимации по БЭМ [WIP]
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
var levels = [
  // ...другие уровни
  {path: 'libs/bem-animations/@common', check: false}
];
```
Если используется `bem-core@v4`, необходимо подключить ещё один уровень.

```js
{path: 'libs/bem-animations/@bem-core-v4', check: false}
```

## Использование
на примере __bem-core@v4__

#### Шаг №1

Подключить нужную анимацию в __deps.js__ блока (`my-block/my-block.deps.js`)
```js
({
  mustDeps: [
    {block: 'animation', mods: {fade: 'in-down'}}
  ]
})
```

#### Шаг №2

Примиксовать блок анимации в __BEMTREE/BEMHTML__
```js
{
  block: 'my-block',
  mix: [{block: 'animation'}]
}
```
#### Шаг №3

Подключить (необходимо только в __bem-core@v4__) в __YModules__, и использовать блок анимации в __i-bem__
```js
modules.define('my-block',
['i-bem-dom', /* ...другие модули */ 'animation'],
function (provide, bemDom, /* ...другие модули */ Animation) {
  provide(bemDom.declBlock(this.name, {
    onSetMod: {
      js: {
        'inited': function() {
          this._animate = this.findMixedBlock(Animation);
          this._animate.setMod('fade', 'in-down');
        }
      }
    }
  }));
});

```
