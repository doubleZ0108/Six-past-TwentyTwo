import pypinyin

def readFile(filename):
    with open(filename) as f:
        lines = f.readlines()
        lines = [i.strip()[2:] for i in lines]
        return lines

def sortLength(academys):
    return sorted(academys, key=lambda x: len(x))

def sortPinYin(academys):
    academy_pinyin_list = []
    for academy in academys:
        academy_pinyin = ''
        for i in pypinyin.pinyin(academy, style=pypinyin.NORMAL):
            academy_pinyin += ''.join(i)
        academy_pinyin_list.append({
            "name": academy,
            "pinyin": academy_pinyin
        })
    academy_sort_pinyin = sorted(academy_pinyin_list, key=lambda x: x["pinyin"])
    return list(map(lambda x: x["name"], academy_sort_pinyin))

if __name__ == "__main__":
    filename = "academy-all.md"

    # 全部学院
    academys = readFile(filename)
    print(academys)

    # 按长度排序
    academys_sort_length = sortLength(academys)
    print(academys_sort_length)

    # 按拼音首字母排序
    academy_sort_pinyin = sortPinYin(academys)
    print(academy_sort_pinyin)