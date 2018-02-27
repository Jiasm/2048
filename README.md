# 2048
`2048`game

live demo: http://blog.jiasm.org/2048

## Project structure

### Game

2048游戏的核心数据处理  
用来生成游戏矩阵，并暴露四个方向移动的API，返回移动后的矩阵以及当前的游戏状态

#### init

返回一个`game`实例，用来产生游戏所需要的数据矩阵，并提供移动的API

#### move

接受一个`direction`参数，用来标识移动的方向

key       | description
:-:       | :-:
top/1     | 向上移动
right/2   | 向右移动
bottom/3  | 向下移动
left/4    | 向左移动


#### status

返回当前游戏实例所对应的状态 [`running`|`over`]

### GameRender

> 用来将矩阵渲染到`canvas`上

##### init

返回一个`render`实例，等同于调用`new`

#### render

仅会提供一个API用来渲染矩阵到`canvas`  

param   | description
:-:     | :-:
matrix  | 二维数组，游戏数据的矩阵
score   | 游戏目前的分数
status  | 游戏目前的状态

### GameController

> 控制页面中游戏与用户的交互，触发事件移动矩阵之类的

由`controller`调用`Game`和`GameRender`实例，来进行游戏的交互，并计算分数。

*大致结构如此，开发过程中有什么补充会记录在下边。2017-08-21 21:55:49*

#### TODO

1. 矩阵数据的缓存
2. 积分的统计
