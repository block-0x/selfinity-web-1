
class Interests(object):
    def __init__(self, JSON):
        self.items = [Interest(interest) for interest in JSON if interest is not None]

    def toSortArrayWithLabel(self):
        return { val.LabelId : [ item.UserId for item in self.getsByLabelId(val.LabelId) ] for val in self.items }

    def getsByLabelId(self, id):
        return [item for item in self.items if item.LabelId == id]

    def toJSON(self):
        return { "interests": [val.toJSON() for val in self.items] }

class Interest(object):
    def __init__(self, JSON):
        if JSON is None:
            return
        self.id = JSON.get("id")
        self.UserId = JSON.get("UserId")
        self.LabelId = JSON.get("LabelId")
        self.action = JSON.get("action")
        self.isPrivate = JSON.get("isPrivate")
        self.valid = JSON.get("valid")
        self.permission = JSON.get("permission")

    def toJSON(self):
        return {
            'id': self.id,
            'UserId': self.UserId,
            'LabelId': self.LabelId,
            'action': self.action,
            'isPrivate': self.isPrivate,
            'valid': self.valid,
            'permission': self.permission,
        }
