from models.user import Users, User
import re
from collections import OrderedDict
import sys, json
import numpy as np

class Requests(object):
    def __init__(self, JSON):
        self.items = [Request(content) for content in JSON if content is not None]

    def toSortArrayWithContent(self):
        return { val.VoteredId : [ item.VoterId for item in self.getsByVoteredId(val.VoteredId) ] for val in self.items }

    def toJSON(self):
        return { "requests": [content.toJSON() for content in self.items] }

    def getById(self, id):
        for item in self.items:
            if item.id == id:
                return item
            continue

    def getsByVoteredId(self, id):
        return [item for item in self.items if item.VoteredId == id]


class Request(object):
    p = re.compile(r"<[^>]*?>")
    def __init__(self, JSON):
        if JSON is None:
            return
        self.id = JSON.get('id')
        self.VoterId = JSON.get('VoterId')
        self.VoteredId = JSON.get('VoteredId')
        self.score = JSON.get('score')
        self.pure_score = JSON.get("pure_score")
        self.author_score = JSON.get('author_score')
        self.author_pure_score = JSON.get("author_pure_score")
        self.voters_score = JSON.get('voters_score')
        self.voters_pure_score = JSON.get("voters_pure_score")
        self.url = JSON.get('url')
        self.title = JSON.get('title')
        self.body = JSON.get('body')
        self.meta = JSON.get('meta')
        self.mode = JSON.get('mode')
        self.vector =  json.loads(JSON.get("vector")) if isinstance(JSON.get("vector"), str) else JSON.get("vector")
        self.isStory = JSON.get('isStory')
        self.isNsfw = JSON.get('isNsfw')
        self.ishide = JSON.get('ishide')
        self.allowEdit = JSON.get('allowEdit')
        self.allowDelete = JSON.get('allowDelete')
        self.allowReply = JSON.get('allowReply')
        self.allow_votes = JSON.get('allow_votes')
        self.allow_curation_rewards = JSON.get('allow_curation_rewards')
        self.max_opinions_select = JSON.get('max_opinions_select')
        self.pending_payout_value = JSON.get('pending_payout_value')
        self.curator_payout_value = JSON.get('curator_payout_value')
        self.max_accepted_payout = JSON.get('max_accepted_payout')
        self.total_payout_value = JSON.get('total_payout_value')
        self.total_pending_payout_value = JSON.get('total_pending_payout_value')
        self.hasPendingPayout = JSON.get('hasPendingPayout')
        self.cashout_time = JSON.get('cashout_time')
        self.deadline_cashout_time = JSON.get('deadline_cashout_time')
        self.last_payout_at = JSON.get('last_payout_at')
        self.isPrivate = JSON.get('isPrivate')
        self.valid = JSON.get('valid')
        self.permission = JSON.get('permission')

    @property
    def pure_body(self):
        return self.remove_html_tag(self.body)

    @property
    def pure_array_body(self):
        return self.remove_html_tag(self.body).split(r'\n||。||\.')


    def remove_html_tag(self, html_text):
        return self.p.sub("", html_text)

    def toJSON(self):
        return {
            'id': self.id,
            'VoteredId': self.VoterId,
            'VoterId': self.VoteredId,
            'score': self.score,
            'pure_score': self.pure_score,
            'url': self.url,
            'title': self.title,
            'body': self.body,
            'meta': self.meta,
            'mode': self.mode,
            'vector': self.vector if True not in [np.isnan(vec) for vec in self.vector] else np.zeros(len(self.vector)),
            'isStory': self.isStory,
            'isNsfw': self.isNsfw,
            'ishide': self.ishide,
            'allowEdit': self.allowEdit,
            'allowDelete': self.allowDelete,
            'allowReply': self.allowReply,
            'allow_votes': self.allow_votes,
            'allow_curation_rewards': self.allow_curation_rewards,
            'max_opinions_select': self.max_opinions_select,
            'pending_payout_value': self.pending_payout_value,
            'curator_payout_value': self.curator_payout_value,
            'max_accepted_payout': self.max_accepted_payout,
            'total_payout_value': self.total_payout_value,
            'total_pending_payout_value': self.total_pending_payout_value,
            'hasPendingPayout': self.hasPendingPayout,
            'cashout_time': self.cashout_time,
            'deadline_cashout_time': self.deadline_cashout_time,
            'last_payout_at': self.last_payout_at,
            'isPrivate': self.isPrivate,
            'valid': self.valid,
            'permission': self.permission,
        }
