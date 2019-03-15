### DOES NOT WORK ###


import json
import requests
import os
import logging


# base_url = "http://localhost:8888"
base_url = "http://gallery-b-dot-mit-appinventor-gallery.appspot.com"

with open('projects.json') as json_data:
    project_list = json.load(json_data)
    for project in project_list:
        project_title = project["aiaPath"].split(".aia")[0]
        aiaPath = os.path.join("uploads", project["aiaPath"])
        imagePath = project["imagePath"].split("api/")[1] if project["imagePath"] else None
        data = {
            "title": project_title,
            "description": project["description"],
            "moreInfo": project["tutorialUrl"],
            "projectId": project["projectId"],
            "email": project["authorUsername"] + "@gmail.com",
            "isFeatured": "true" if "featuredLabel" in project else "false",
        }
        data = {k: v for k, v in data.items() if v is not None}
        print(data)

        # Add project info and create gallery app
        r = requests.post(base_url + "/ode2/receivegalleryprojectinfo", data=data)
        galleryId = r.text
        print(project_title, r.status_code, r.text)

        if r.status_code != 200:
            raise Exception("exception on " + project_title)

        # Add AIA file to gallery app
        with open(aiaPath, "rb") as aiaFile:
            data = aiaFile.read()
        r = requests.post(base_url + "/ode2/receivegalleryproject/" + galleryId, data=data)
        print("added aia for", project_title)

        if r.status_code != 200:
            raise Exception("exception on " + project_title)

        # Add image to gallery app
        if imagePath:
            with open(imagePath, "rb") as imageFile:
                data = imageFile.read()
            r = requests.post(base_url + "/ode2/receivegalleryprojectimage/" + galleryId, data=data)
            print("added image for", project_title)

            if r.status_code != 200:
                raise Exception("exception on " + project_title)
        print('done', project_title)
    
