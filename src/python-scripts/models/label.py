import numpy as np

class Labels(object):
    def __init__(self, JSON):
        self.items = [Label(label) for label in JSON]

    def toJSON(self):
        return { "labels": [label.toJSON() for label in self.items if label is not None] }

class Label(object):
    def __init__(self, JSON):
        if JSON is None:
            return
        self.id = JSON.get("id")
        self.title = JSON.get("title")
        self.vector = JSON.get("vector")
        self.score = JSON.get('score')
        self.pure_score = JSON.get("pure_score")
        self.isPrivate = JSON.get("isPrivate")
        self.valid = JSON.get("valid")
        self.permission = JSON.get("permission")

    @property
    def pure_array_title(self):
        return self.title.split(r'\n||。||\.') if self.title is not None else ['']

    def toJSON(self):
        return {
            'id': self.id,
            'score': self.score,
            'pure_score': self.pure_score,
            'title': self.title,
            'vector': self.vector if True not in [np.isnan(vec) for vec in self.vector] else np.zeros(len(self.vector)),
            'isPrivate': self.isPrivate,
            'valid': self.valid,
            'permission': self.permission,
        }
