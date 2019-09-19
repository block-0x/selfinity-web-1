class Labelings(object):
    def __init__(self, JSON):
        self.items = [Labeling(labeling) for labeling in JSON if labeling is not None]

    def toSortArrayWithLabel(self):
        return { val.LabelId : [ item.ContentId for item in self.getsByLabelId(val.LabelId) ] for val in self.items }

    def getsByLabelId(self, id):
        return [item for item in self.items if item.LabelId == id]

class Labeling(object):
    def __init__(self, JSON):
        if JSON is None:
            return
        self.id = JSON.get("id")
        self.LabelId = JSON.get("LabelId")
        self.ContentId = JSON.get("ContentId")
        self.meta = JSON.get("meta")
        self.label = Label(JSON.get("label")) if "label" in JSON else []
        self.content = Content(JSON.get("content")) if "content" in JSON else []
