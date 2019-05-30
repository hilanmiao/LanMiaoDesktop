# 表设计

## User(用户表不是必须的，我只是用来模拟登录）

| 字段名 | 数据类型 | 是否主键 | 描述 |
|--------|--------|--------|--------|
|  id  |   string     |   Y     |    id    |
|  userId  |   string     |   Y     |    用户名    |
|  password  |   string     |        |    用户名    |

## IncomeAndExpenditure(收入/支出表)

| 字段名 | 数据类型 | 是否主键 | 描述 |
|--------|--------|--------|--------|
|  id  |   string     |   Y     |    id    |
|  type  |   string     |        |    收入i\支出e    |
|  amountOfMoney  |   int     |        |    金额    |
|  remark  |   string     |        |    备注    |
|  categoryId  |   string     |        |    类别id    |
|  assetsId  |   string     |        |    资产id    |
|  createdAt  |   string     |        |    创建时间    |
|  updatedAt  |   string     |        |    更新时间    |

## Assets(资产管理表)

| 字段名 | 数据类型 | 是否主键 | 描述 |
|--------|--------|--------|--------|
|  id  |   string     |   Y     |    id    |
|  assetsName  |   string     |   Y     |    资产名    |
|  assetsDetailed  |   string     |        |    资产详细    |
|  assetsAmountOfMoney  |   int     |        |    金额   |

## Category(收入支出类别表)

| 字段名 | 数据类型 | 是否主键 | 描述 |
|--------|--------|--------|--------|
|  id  |   string     |   Y     |    id    |
|  category  |   string     |   Y     |    类别名称    |
|  remark  |   string     |        |    备注    |