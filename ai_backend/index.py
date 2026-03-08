from typing import Any, Callable
import numpy as np
import matplotlib.pyplot as plt




# # sum
# sum = np.sum([[1,2,3], [4,5,6]])
# print(sum)

# # min
# min = np.min([[1,2,3], [4,5,6]])
# print(min)

# # max
# max = np.max([1,2,3,4,5])
# print(max)

# # average
# mean = np.mean([1,2,3,4,5])



# print(mean)


# def add(a: int, b: int) -> int:
#     return a + b


# print(f'Total is {add(2, 3)}')

# def print_decorator(fn: Callable[..., int]) -> Callable[..., int]:
#     def wrapper(*args: Any, **kwargs: Any):
#         print('Before excute the function')
#         result = fn(*args, **kwargs)
#         print(f'After excute the function: {result}')
#         return result
#     return wrapper

# @print_decorator
# def add(a: int, b: int) -> int:
#     return a + b

# add(4,5)


# arr1 = np.array([[1,2,3], [4,5,6]])
# arr2 = np.array([[3,4,5], [6,7,8]])

# print(arr1 * arr2)

# #Broadcasting
# arr1 = np.array([[1,2,3], [4,5,6]])
# arr2 = np.array([[3,4,5], [6,7,8]])

# print(arr1 + arr2)

# #Broadcasting
# arr1 = np.array([[1,2,3], [4,5,6]])
# arr2 = np.array([[3], [6]])

# #shape (2, 3) + (2, 1) -> (2, 3)
# print(arr1 + arr2)

# #reshape
# new_array = np.reshape(arr1, (6,))
# print(new_array)
# print(new_array.shape)

# #reshape
# new_array = np.reshape(arr1, (6,))
# print(new_array)
# print(new_array.shape)

# #flatten
# new_array = arr1.flatten()
# print(new_array)
# print(new_array.shape)


""" 
Matplotlib, line plot
"""
# Create a line plot with 20 points between 0 and 5
array_x = np.linspace(0, 5, 20)
# Create a line plot with 20 points between 0 and 10
array_y = np.linspace(0,10, 20)

fig, ax = plt.subplot()
ax.plot(array_x, array_y)
plt.show()