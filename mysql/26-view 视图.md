---
title: 介绍
aside: false
---

# 26-view 视图

<video autoplay src="http://qn.chinavanes.com/mysql/26-mysql%E4%B8%AD%E7%9A%84view%E8%A7%86%E5%9B%BE.mp4" controls controlsList="nodownload" width="100%" height="680"/>

视图（VIEW）是一个虚拟表，其内容由一个 SELECT 语句定义，不包含实际存储的数据，而是存储了这个查询的定义。视图可以简化复杂的查询，隐藏数据库的复杂性，提供安全访问控制。用户可以像操作真实表一样对视图进行查询、更新等操作，但底层实际上执行的是定义视图的 SQL 语句。
