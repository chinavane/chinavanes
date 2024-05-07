---
title: 介绍
aside: false
---

# 09-autocommit、commit、rollback

<video autoplay src="http://qn.chinavanes.com/mysql/09-mysql%E7%9A%84autocommit%E3%80%81commit%E3%80%81rollback.mp4" controls controlsList="nodownload" width="100%" height="680"/>

MySQL 中的事务处理机制由 autocommit、COMMIT 和 ROLLBACK 三个关键概念组成，它们控制着数据更改的持久化方式。

autocommit：默认情况下，MySQL 处于 autocommit 模式，这意味着每条 SQL 语句执行后都会立即自动提交，无法回滚。关闭 autocommit 后，需显式提交(COMMIT)或回滚(ROLLBACK)事务。

COMMIT：显式提交事务，确认并保存自上次提交或回滚以来的所有更改。在 autocommit 关闭时使用。

ROLLBACK：撤销事务中的所有更改，回到事务开始的状态。常用于错误处理，以恢复数据到事务开始前的状态。

事务控制：通过 START TRANSACTION 显式开始一个事务，然后执行一系列操作，最后根据情况决定提交或回滚，这对于确保数据一致性非常重要。
