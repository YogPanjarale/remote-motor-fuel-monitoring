def increase(x:int,curve:int,max_:int):
    a = round((max_-x)/curve)+1
    r = sorted([x+a,max_,0])[1]
    return r
def decrease(x:int,curve:int,min_:int):
    a = round((x-min_)/curve)+1
    r = sorted([x-a,min_,x])[1]
    return r
