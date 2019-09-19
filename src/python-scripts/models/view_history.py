import re
from collections import OrderedDict
import sys, json
import numpy as np
from models.content import Contents, Content
from models.user import Users, User

class ViewHistories(object):
    def __init__(self, JSON):
        self.items = [ViewHistory(val) for val in JSON if val is not None]

    def toSortArrayWithContent(self):
        return { val.ContentId : [ item.UserId for item in self.getsByContentId(val.ContentId) ] for val in self.items }

    def toJSON(self):
        return { "viewHistories": [val.toJSON() for val in self.items] }

    def getById(self, id):
        for item in self.items:
            if item.id == id:
                return item
            continue

    def getsByContentId(self, id):
        return [item for item in self.items if item.ContentId == id]


class ViewHistory(object):
    def __init__(self, JSON):
        if JSON is None:
            return
        self.id = JSON.get('id')
        self.UserId = JSON.get('UserId')
        self.ContentId = JSON.get('ContentId')
        self.meta = JSON.get('meta')
        self.isPrivate = JSON.get('isPrivate')
        self.valid = JSON.get('valid')
        self.permission = JSON.get('permission')
        # self.Content = Content(JSON.get("Content"))

    def toJSON(self):
        return {
            'id': self.id,
            'UserId': self.UserId,
            'ContentId': self.ContentId,
            'meta': self.meta,
            'isPrivate': self.isPrivate,
            'valid': self.valid,
            'permission': self.permission,
        }
