from django.core.urlresolvers import get_resolver
from django.shortcuts import render, redirect
from django.contrib import messages
from django.contrib.auth import authenticate, login, logout


def create_urls(request):
    for x in get_resolver(None).reverse_dict.items():
        print(x)
    # TODO: render this as a javascript file with URLs suitable for the reverse lookup
    return None


def welcome(request):
    return render(request, 'base.html')


def do_login(request):
    if request.method == 'GET':
        return render(request, 'login.html')
    username = request.POST['username']
    password = request.POST['password']
    user = authenticate(username=username, password=password)
    if user is not None:
        login(request, user)
        return redirect(request.GET.get('next', 'homepage'))
    else:
        messages.add_message(request, messages.ERROR, 'Incorrect login.', extra_tags='label-danger')
        return redirect('homepage')


def do_logout(request):
    logout(request)
    return redirect(request.GET.get('next', 'homepage'))
