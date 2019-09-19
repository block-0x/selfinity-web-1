from builder.recommend_builder import RecommendBuilder
import sys, json

builder = RecommendBuilder()
request = json.loads(sys.stdin.readline())
response = builder.label_interest_based_recommend(request.get('interests'), request.get('target_label'))
print(json.dumps(response))
