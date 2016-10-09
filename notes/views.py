from django.shortcuts import render
from django.views.generic import ListView

from .models import Note


def homepage(request):
    notes = Note.objects.all()[:3]
    width = 12 / len(notes) if notes else 12
    return render(request, 'notes/base.html', {
        'notes': notes,
        'width': int(width)
    })


class NotesView(ListView):
    model = Note
    template_name = 'notes/note_list.html'


class NotesTaggedView(ListView):
    queryset = Note.objects.all().order_by('-published')
    template_name = 'notes/note_list.html'

    def get_queryset(self):
        queryset = super(NotesTaggedView, self).get_queryset()
        if 'tags' in self.kwargs:
            queryset = queryset.filter(tags=self.kwargs['tags'])
        elif 'tag' in self.kwargs:
            queryset = queryset.filter(tags__name=self.kwargs['tag'])
        return queryset
