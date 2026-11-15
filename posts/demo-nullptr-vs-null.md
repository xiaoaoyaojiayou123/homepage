# 示例文章：nullptr 和 NULL 到底差在哪

> 这是一篇用来测试页面效果的示例文章，内容取自错题本里的一条记录，之后会换成正式文章。

## 我错在哪

这两个概念我答反过三次：以为 `NULL` 是空指针，`nullptr` 是"一个数"。实际正好相反。

## 三句话记死

1. `NULL` 是宏，在 C++ 里就是整型的 `0`。
2. `nullptr` 是关键字，类型是 `std::nullptr_t`。
3. `nullptr` 能转成任意指针，但不能转成整型。

## 动手验证

```cpp
#include <iostream>

void f(int)   { std::cout << "f(int)\n"; }
void f(char*) { std::cout << "f(char*)\n"; }

int main() {
    f(0);        // f(int)
    f(nullptr);  // f(char*)

    int x = 0;          // 可以
    // int y = nullptr; // 编译报错：nullptr 不能转成整型
    (void)x;
}
```

`f(NULL)` 的结果看编译器：MSVC 把 `NULL` 定义成 `0`，会调用 `f(int)`；GCC 会直接报调用有二义性。两种结果都说明同一件事：`NULL` 不是一个可靠的"空指针"。

| 写法 | 类型 | 能转成指针 | 能转成整型 |
| --- | --- | --- | --- |
| `NULL` | 宏，整型 0 | 能 | 能 |
| `nullptr` | `std::nullptr_t` | 能 | 不能 |

## 为什么 C++ 不把 NULL 定义成 `(void*)0`

C 语言里 `void*` 可以隐式转成其他指针，所以 `(void*)0` 没问题。C++ 不允许这种隐式转换，`int* p = (void*)0;` 编译不过，`NULL` 只能定义成 `0`，于是有了重载匹配错的问题，再于是有了 `nullptr`。

## 结论

C++ 代码里一律写 `nullptr`。看到 `NULL` 就提醒自己：它其实是个 `0`。
