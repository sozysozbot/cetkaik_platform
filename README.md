# cetkaik_platform

[cerke_online](https://github.com/jurliyuuri/cerke_online_alpha) が吐く棋譜をいい感じにレンダリングしてくれるサイト

## 仕様

棋譜を描画する：
```
https://sozysozbot.github.io/cetkaik_platform/show_history.html?history=ここにencodeURIComponentした棋譜を貼る
```

A 行を一番下にして描画する：
```
https://sozysozbot.github.io/cetkaik_platform/show_history.html?side=a&history=ここにencodeURIComponentした棋譜を貼る
```

## ビルドのしかた

```
npx webpack
```
