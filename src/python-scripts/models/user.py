from models.upvote import Upvotes, Upvote

class Users(object):
    def __init__(self, JSON):
        self.items = [User(user) for user in JSON if user is not None]

    def toScoreBaseDict(self):
        return { user.id : { upvote.VotedId: float(score) for upvote in user.upvotes.items } for user in self.items if len(user.upvotes) > 0 }
    def toOwnedBaseDict(self):
        return { user.id : { upvote.VotedId: float(score) for upvote in user.upvotes.items } for user in self.items if len(user.upvotes) > 0 }

class User(object):
    def __init__(self, JSON):
        if JSON is None:
            return
        self.id = JSON.get("id")
        self.username = JSON.get("username")
        self.nickname = JSON.get("nickname")
        self.detail = JSON.get("detail")
        self.picture_small = JSON.get("picture_small")
        self.picture_large = JSON.get("picture_large")
        self.eth_address = JSON.get("eth_address")
        self.token_balance = JSON.get("token_balance")
        self.score = JSON.get("score")
        self.pure_score = JSON.get("pure_score")
        self.locale = JSON.get("locale")
        self.timezone = JSON.get("timezone")
        self.verified = JSON.get("verified")
        self.bot = JSON.get("bot")
        self.vector = JSON.get("vector")
        self.sign_up_meta = JSON.get("sign_up_meta")
        self.isPrivate = JSON.get("isPrivate")
        self.permission = JSON.get("permission")
        self.upvotes = Upvotes(JSON.get("upvotes")) if "upvotes" in JSON else []
