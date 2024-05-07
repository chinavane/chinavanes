---
title: 介绍
aside: false
---

# 24-union 联合处理

<video autoplay src="http://qn.chinavanes.com/mysql/24-mysql%E4%B8%AD%E7%9A%84union%E8%81%94%E5%90%88%E5%A4%84%E7%90%86.mp4" controls controlsList="nodownload" width="100%" height="680"/>

UNION 操作符用于合并两个或更多 SELECT 语句的结果集，同时去除重复的行。所有联合的查询必须有相同数量的列，并且对应列的数据类型要兼容。默认使用 UNION 会去除重复行，而 UNION ALL 则保留所有行，包括重复的。此功能适用于需要汇总多个查询结果的情况。
