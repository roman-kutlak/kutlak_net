from django.shortcuts import render
from django.views.generic import TemplateView
from django.http.response import JsonResponse


def homepage(request):
    return render(request, 'socrates/base.html')


def demo(request):
    return render(request, 'socrates/demo.html')


class JSONResponseMixin(object):
    """A mixin that can be used to render a JSON response."""
    def render_to_json_response(self, context, **response_kwargs):
        """Returns a JSON response, transforming 'context' to make the payload."""
        return JsonResponse(self.get_data(context), **response_kwargs)

    def get_data(self, context):
        """Returns an object that will be serialized as JSON by json.dumps()."""
        return context


class Graph(JSONResponseMixin, TemplateView):

    def get_data(self, context):
        context.update({'nodes': [], 'edges': []})
        context.pop('view')
        return context

    def render_to_response(self, context, **response_kwargs):
        return self.render_to_json_response(context, **response_kwargs)


def process_command(request):
    return JsonResponse({'nodes': [{'id': 'a', 'name': 'a'},
                                  {'id': 'b', 'name': 'b'},
                                  {'id': 'c', 'name': 'c'},
                                  {'id': 'j', 'name': 'j'}],
                        'edges': [{'id': 'ab', 'source': 'a', 'target': 'b'},
                                  {'id': 'ac', 'source': 'a', 'target': 'c'},
                                  {'id': 'bc', 'source': 'b', 'target': 'c'},
                                  {'id': 'cj', 'source': 'c', 'target': 'j'}]})
