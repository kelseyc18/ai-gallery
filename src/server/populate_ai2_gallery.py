### DOES NOT WORK ###


import json
import requests
import os
import logging


try:
    import http.client as http_client
except ImportError:
    # Python 2
    import httplib as http_client

http_client.HTTPConnection.debuglevel = 1

# You must initialize logging, otherwise you'll not see debug output.
logging.basicConfig()
logging.getLogger().setLevel(logging.DEBUG)
requests_log = logging.getLogger("requests.packages.urllib3")
requests_log.setLevel(logging.DEBUG)
requests_log.propagate = True

url = "http://localhost:8888/ode2/receivegalleryproject/"
with open('projects.json') as json_data:
    project_list = json.load(json_data)
    # for index, project in enumerate(project_list):
    #     project_title = project["aiaPath"].split(".aia")[0]
    #     aiaPath = os.path.join("uploads", project["aiaPath"])
    #     imagePath = project["imagePath"].split("api/")[1] if "imagePath" in project else None
    #     data = {
    #         "title": project_title,
    #         "projectName": project_title,
    #         "description": project["description"],
    #         "moreInfo": project["tutorialUrl"],
    #         "projectId": project["projectId"],
    #         "email": project["authorUsername"] + "@gmail.com",
    #         "aiaFile": open(aiaPath, "rb"),
    #         "imageFile": open(imagePath, "rb") if "imagePath" in project else None,
    #         "isFeatured": str(index < 35),
    #     }
    #     data = {k: v for k, v in data.items() if v is not None}
    #     r = requests.post(url, files=data)
    #     print(project_title, r.status_code)

    project = project_list[0]
    index = 0

    data = {
        "title": "OliveTitle4",
        "projectName": "OliveTitle4",
        "description": "The most wonderful time of the year. The most wonderful app of the year.",
        "moreInfo": "www.youtube.com",
        "projectId": "123462",
        "email": "boba@gmail.com",
        "aiaFile": open("/Users/admin/Desktop/test.txt", "rb"),
        "isFeatured": "false",
    }
    data = {k: v for k, v in data.items() if v is not None}
    print(data)
    r = requests.post(url, files=data)
    print(data["title"], r.status_code)
