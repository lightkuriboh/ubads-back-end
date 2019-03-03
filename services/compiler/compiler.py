
import os
import sys
import json


def parse_args(args):
    return args[1], args[2]


def detect_language(language):
    with open('config/listLanguage.json') as json_data:
        list_language = json.load(json_data)['languages']
        for lang in list_language:
            if lang['code'] == language:
                return lang


def parse_params(params):
    ans = ''
    for x in params:
        ans += ' ' + x
    return ans


if __name__ == '__main__':

    args = sys.argv
    # print(args)

    id, language = parse_args(args)

    chosenLanguage = detect_language(language)

    # print(chosenLanguage)
    command = chosenLanguage['command']
    options = chosenLanguage['options']
    flag = chosenLanguage['flag']
    extend = chosenLanguage['extend']
    extentOut = chosenLanguage['extendOut']
    pretend = chosenLanguage['pretend']

    target = 'code/' + id + extend
    objective = 'bot/' + id + extentOut

    with open(target, 'r+') as f:
        content = f.read()
        f.seek(0, 0)
        f.write(pretend + '\n' + content)

    compilerString = command + ' ' + target + parse_params(options) + ' ' + objective + parse_params(flag)
    # print(compilerString)
    os.system(compilerString)

