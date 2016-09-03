from django.shortcuts import render, redirect
from django.contrib import messages
from django.contrib.auth import authenticate, login, logout


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
        return redirect(request.GET['next']) if 'next' in request.GET else redirect('welcome')
    else:
        messages.add_message(request, messages.ERROR, 'Incorrect login.', extra_tags='label-danger')
        return redirect('welcome')


def do_logout(request):
    logout(request)
    return redirect(request.path)
