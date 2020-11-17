from django.shortcuts import render

# This view serves the React frontend app

def index(request):
    return render(request, 'build/index.html')
