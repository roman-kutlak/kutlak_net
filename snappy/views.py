import json

from django.http import HttpResponse
from django.http import JsonResponse
from django.shortcuts import render

from django.views.generic import CreateView, ListView, DetailView
from django.views.generic import DeleteView, UpdateView

from .models import TemplateModel

from snappy.utils import logger

from nlglib.realisation.simplenlg.realisation import Realiser
from nlglib.lexicalisation import Lexicaliser
from nlglib.macroplanning import formula_to_rst, expr
from nlglib.microplanning import *


def homepage(request):
    return render(request, 'snappy/homepage.html', {})


class Simplification:
    def __init__(self, **kwargs):
        self.__dict__.update(kwargs)


def demo(request):
    functions = []
    # for n, f in simplification_ops.items():
    #     functions.append(Simplification(name=f.__name__, doc=f.__doc__, pretty=n))
    return render(request, 'snappy/demo.html', {
        'simplifications': functions,
    })


def translate(request):
    """Read a given FOL formula as jason data and return it as text. """
    response_data = {}
    formula = request.POST['formula'].strip()
    response_data['formula'] = formula
    simplifications = [x.strip() for x in
                       request.POST.get('simplifications', '').split('|')]
    try:
        realise = Realiser(host='roman.kutlak.info')
        if formula:
            template_instances = TemplateModel.objects.all()
            templates = {}
            errors = []
            for t in template_instances:
                name = t.name
                try:
                    template = eval(t.content)
                    templates[name] = template
                except Exception as e:
                    errors.append(('danger', str(e)))  # use bootstrap terminology...
            lex = Lexicaliser(templates=templates)
            response_data['text'] = realise(lex(formula_to_rst(expr(formula))))
            response_data['status'] = 'success'
            response_data['messages'] = json.dumps(errors)
        else:
            response_data['text'] = "Enter a formula first. E.g., 'Happy(bob)'"
            response_data['status'] = 'default'
    # except fol.FormulaParseError as e:
    #     response_data['text'] = str(e)
    #     response_data['status'] = 'error'
    except Exception as e:
        logger.exception(e)
    return JsonResponse(response_data)


class TemplateCreateView(CreateView):
    model = TemplateModel
    fields = ['name', 'num_params', 'template_content']


class TemplateListView(ListView):
    model = TemplateModel
    template_name = 'snappy/template_list.html'


class TemplateDetailView(DetailView):
    model = TemplateModel
    fields = ['name', 'num_params', 'template_content']
    template_name = 'snappy/template_detail.html'


class TemplateDeleteView(DeleteView):
    model = TemplateModel


class TemplateUpdateView(UpdateView):
    model = TemplateModel
