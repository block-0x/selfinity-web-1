from builder.builder import Builder
from engine.engine import Engine
# from engine.content_based_recommend_engine import ContentBasedRecommendEngine
from engine.user_score_based_recommend_engine import UserScoreBasedRecommendEngine
from engine.user_owned_based_recommend_engine import UserOwnedBasedRecommendEngine
from engine.user_viewed_based_recommend_engine import UserViewedBasedRecommendEngine
from engine.user_request_based_recommend_engine import UserRequestBasedRecommendEngine
from engine.user_upvote_based_recommend_engine import UserUpvoteBasedRecommendEngine
from engine.label_interest_based_recommend_engine import LabelInterestBasedRecommendEngine
from engine.label_labeling_based_recommend_engine import LabelLabelingBasedRecommendEngine
# from engine.user_comment_based_recommend_engine import UserCommentBasedRecommendEngine
# from engine.synthetic_vector_recommend_engine import SyntheticVectorRecommendEngine
# from engine.vectorize_text_engine import VectorizeTextEngine
# from engine.label_create_engine import LabelCreateEngine
from models.content import Content, Contents
from models.label import Label, Labels
from models.labeling import Labeling, Labelings
from models.user import User, Users
from models.view_history import ViewHistory, ViewHistories
from models.upvote import Upvote,Upvotes
from models.interest import Interest,Interests
from models.request import Request, Requests
# from engine.label_based_recommend_engine import LabelBasedRecommendEngine

class RecommendBuilder(Builder):
    def __init__(self):
        super().__init__()

    def user_score_based_recommend(self, users, target_user):
        """
        @data: data is a list of recommend contents's ids
        """
        engine = UserScoreBasedRecommendEngine(self)
        data = engine.run(Users(users), User(target_user))
        return data

    def user_owned_based_recommend(self, contents, target_content):
        """
        @data: data is lists of recommend contents's ids that can get from key of user id
        """
        engine = UserOwnedBasedRecommendEngine(self)
        data = engine.run(Contents(contents), Content(target_content))
        return data.toJSON()

    def user_viewed_based_recommend(self, viewHistories, target_content):
        """
        @data: data is lists of recommend contents's ids that can get from key of user id
        """
        engine = UserViewedBasedRecommendEngine(self)
        data = engine.run(ViewHistories(viewHistories), Content(target_content))
        return data

    def user_request_based_recommend(self, requests, target_user):
        """
        @data: data is lists of recommend contents's ids that can get from key of user id
        """
        engine = UserRequestBasedRecommendEngine(self)
        data = engine.run(Requests(requests), User(target_user))
        return data

    def user_comment_based_recommend(self, comments, target_content):
        """
        @data: data is lists of recommend contents's ids that can get from key of user id
        """
        engine = UserCommentBasedRecommendEngine(self)
        data = engine.run(Contents(comments), Content(target_content))
        return data

    def user_upvote_based_recommend(self, upvotes, target_content):
        """
        @data: data is lists of recommend contents's ids that can get from key of user id
        """
        engine = UserUpvoteBasedRecommendEngine(self)
        data = engine.run(Upvotes(upvotes), Content(target_content))
        return data

    def label_interest_based_recommend(self, interests, target_label):
        """
        @data: data is lists of recommend contents's ids that can get from key of user id
        """
        engine = LabelInterestBasedRecommendEngine(self)
        data = engine.run(Interests(interests), Label(target_label))
        return data

    def label_labeling_based_recommend(self, labelings, target_label):
        """
        @data: data is lists of recommend contents's ids that can get from key of user id
        """
        engine = LabelLabelingBasedRecommendEngine(self)
        data = engine.run(Labelings(labelings), Label(target_label))
        return data


    # def content_based_recommend(self, contents, target_content):
    #     """
    #     @data: data is a dict that key of recommend contents's id and value of
    #     simiraly with target content
    #     """
    #     engine = ContentBasedRecommendEngine(self)
    #     data = engine.run(Contents(contents), Content(target_content))
    #     return data

    # def synthetic_vector_recommend(self, contents, target_user):
    #     engine = SyntheticVectorRecommendEngine(self)
    #     data = engine.run(Contents(contents).items, User(target_user))
    #     return [item.toJSON() for item in data]

    # def synthetic_vector_label_recommend(self, labels, target_user):
    #     engine = SyntheticVectorRecommendEngine(self)
    #     data = engine.run(Labels(labels).items, User(target_user))
    #     return [item.toJSON() for item in data]

    # def vectorize_text(self, sentences):
    #     engine = VectorizeTextEngine(self)
    #     data = engine.run(sentences)
    #     return data

    # def label_create(self, contents):
    #     engine = LabelCreateEngine(self)
    #     data = engine.run(Contents(contents))
    #     return data


    # def static_recommend(self):


