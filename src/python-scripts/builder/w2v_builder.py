from builder.builder import Builder
from engine.engine import Engine
from engine.content_based_recommend_engine import ContentBasedRecommendEngine
from engine.user_score_based_recommend_engine import UserScoreBasedRecommendEngine
from engine.user_owned_based_recommend_engine import UserOwnedBasedRecommendEngine
from engine.vectorize_text_engine import VectorizeTextEngine
from engine.label_create_engine import LabelCreateEngine
from models.content import Content, Contents
from models.label import Label, Labels
# from engine.label_based_recommend_engine import LabelBasedRecommendEngine

class W2vBuilder(Builder):
    def __init__(self):
        super().__init__()

    def vectorize_text(self, contents):
        engine = VectorizeTextEngine(self)
        content_models = Contents(contents)
        data = engine.run([content.pure_array_body for content in content_models.items  if content.pure_body != ''])
        for index, content in enumerate(content_models.items):
            content.vector = data[index]
        return content_models.toJSON()

    def vectorize_labels(self, labels):
        engine = VectorizeTextEngine(self)
        label_models = Labels(labels)
        data = engine.run([label.pure_array_title for label in label_models.items])
        for index, label in enumerate(label_models.items):
            label.vector = data[index]
        return label_models.toJSON()

    # def static_recommend(self):


