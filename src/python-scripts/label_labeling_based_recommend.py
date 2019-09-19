from builder.recommend_builder import RecommendBuilder
import sys, json

builder = RecommendBuilder()
request = json.loads(sys.stdin.readline())
response = builder.label_labeling_based_recommend(request.get('labelings'), request.get('target_label'))
print(json.dumps(response))
