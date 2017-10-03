def compute(n):
    if n < 0:
        return 'error'
    elif n == 0 or n == 1:
        return 1
    else:
        return n * compute(n-1)
