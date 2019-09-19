
class Upvotes(object):
    def __init__(self, JSON=None):
        if JSON == None:
            self.items = []
            return
        self.items = [Upvote(upvote) for upvote in JSON if upvote is not None]

    def toSortArrayWithContent(self):
        return { val.VotedId : [ item.VoterId for item in self.getsByVotedId(val.VotedId) ] for val in self.items }

    def getsByVotedId(self, id):
        return [item for item in self.items if item.VotedId == id]

class Upvote(object):
    def __init__(self, JSON=None):
        if JSON == None:
            return
        self.id = JSON.get("id")
        self.VoterId = JSON.get("VoterId")
        self.VotedId = JSON.get("VotedId")
        self.score = JSON.get("score")
        self.isPrivate = JSON.get("isPrivate")
        self.valid = JSON.get("valid")
        self.permission = JSON.get("permission")
