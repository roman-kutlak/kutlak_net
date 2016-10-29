from django.shortcuts import render
from django.views.generic import TemplateView
from django.http.response import JsonResponse
from django.utils.html import escape

from argulib.dialog import Dialog


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
    history = request.POST.get('history')
    d = Dialog()
    for row in history.split('\n'):
        d.parse(row) if row else None

    response = d.parse(request.POST.get('command'))
    if type(response) == tuple:
        reason, argument = response
        message = 'SYSTEM: {}: {}\n'.format(reason, repr(argument))
    else:
        message = 'SYSTEM: {}\n'.format(response)
    nodes = [{'id': x.name, 'name': str(x.rule)} for x in d.aaf.arguments]
    edges = [{'id': '{}_{}'.format(a.name, b.name), 'source': a.name, 'target': b.name}
             for a in d.aaf.arguments for b in a.plus]
    labelling = d.labelling.to_dict()
    return JsonResponse({'nodes': nodes,
                         'edges': edges,
                         'message': escape(message),
                         'labelling': labelling})
