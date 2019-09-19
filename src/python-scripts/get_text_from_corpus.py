from builder.seed_builder import SeedBuilder
import sys, json

request = json.loads(sys.stdin.readline())
builder = SeedBuilder()
response = builder.get_sentence_from_corpus(request.get('limit'), request.get('min_text_length'), request.get('max_text_length'))
print(json.dumps({ "bodies": [ body for title, body in response.items()], "titles": [ title for title, body in response.items()]}))
