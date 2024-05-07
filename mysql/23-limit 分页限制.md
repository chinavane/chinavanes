---
title: 介绍
aside: false
---

# 23-limit 分页限制

<video autoplay src="http://qn.chinavanes.com/mysql/23-mysql%E4%B8%ADlimit%E5%88%86%E9%A1%B5%E9%99%90%E5%88%B6.mp4" controls controlsList="nodownload" width="100%" height="680"/>

LIMIT 子句用于限制查询结果的数量，常用于分页显示数据。基本语法为 LIMIT offset, count，其中 offset 指定了从哪一行开始，count 定义了返回的最大行数。例如，LIMIT 10, 20 表示从第 11 行开始，返回 20 行数据。这对于提高网页加载速度和用户体验至关重要。
