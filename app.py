import server
from html import home_html
from utils import compute

def fact(request, response):
    # checks if number present and valid
    try:
        num = int(request["content"]["num"])
    except:
        num = -1

    # if num valid return factorial else return 'error'
    if num == -1:
        num_html = "error"
    else:
        num_html = str(compute(num))
    return server.send_html_handler(request, response, num_html)

def home(request, response):
    return server.send_html_handler(request, response, home_html)

server.add_route("get", "/fact", fact)
server.add_route("get", "/", home)
server.start_server("0.0.0.0", 8000)
