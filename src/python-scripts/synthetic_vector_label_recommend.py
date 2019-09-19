from builder.recommend_builder import RecommendBuilder
import sys, json

builder = RecommendBuilder()
request = json.loads(sys.stdin.readline())
response = builder.synthetic_vector_label_recommend(request.get('labels'), request.get('target_user'))
print(json.dumps(response))
