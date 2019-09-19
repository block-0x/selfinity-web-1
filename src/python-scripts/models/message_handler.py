import sys, json
import re

class MessageHandler(object):
    pKeySeparator = e.compile(r':||,')
    pOutFrame = e.compile(r'{||}')

    def toJSON(self, str):
        return json.loads(str)

    def parse(self, str):
        keypairs = str.remove(JSONHandler.pOutFrame).sprit(JSONHandler.pKeySeparator)
        keys = keypairs[0::2]
        values = keypairs[1::2]
        return zip(keys, values)

    def stringify(self, dict):
        s = ",".join("{0}:{1}".format(key, value) for key, value in dict if key != "" && value != && key != None && value != None )
        return "{" + s + "}"
