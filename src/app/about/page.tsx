import React from "react";
import ReactMarkdown from "react-markdown";

const markdown = `
---
title: Vue-项目详情页示例
meta:
  - name: description
    content: Hello World
test: test
---




# 项目详情页示例

## 行业背景

**无论环境如何变化，前端高级工程师都是各大公司一将难求的核心人才**

当前你大部分的职业困境，大概率是因为你还处在初级能力阶段

![img](https://static.www.toimc.com/blog/picgo/2023/06/19/section1-main-item1-dcd555.webp)

**全新打造“技术成长&职业破局”双高体系 培养驾驭全局，深广兼备，打通多端全栈的高级工程师**

## 技术方案

![img](https://static.www.toimc.com/blog/picgo/2023/06/19/section2-main-item1-e72aab.webp)

![img](https://static.www.toimc.com/blog/picgo/2023/06/19/section2-main-item2-a8e18a.webp)


## **项目介绍**
![img](https://static.www.toimc.com/blog/picgo/2023/06/19/section4-main-item1-34f452.webp)

![img](https://static.www.toimc.com/blog/picgo/2023/06/19/section4-main-item5-f2d50c.webp)

## 技术架构

![img](https://static.www.toimc.com/blog/picgo/2023/06/19/section4-main-item6-165354.webp)

`;

const MarkdownComponent = () => {
  return (
    <div className="prose max-w-none">
      <ReactMarkdown>{markdown}</ReactMarkdown>
    </div>
  );
};

export default MarkdownComponent;
