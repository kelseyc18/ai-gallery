from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from bs4 import BeautifulSoup as bs
import imageio
import requests
import json

DEBUG = False

def debug(message):
    if DEBUG:
        print(message)


class Project:
    def __init__(self, galleryUrl, authorUsername, title, projectId, imagePath, aiaPath, description, tutorialUrl):
        self.galleryUrl = galleryUrl
        self.authorUsername = authorUsername
        self.title = title
        self.projectId = projectId
        self.imagePath = imagePath
        self.aiaPath = aiaPath
        self.description = description
        self.tutorialUrl = tutorialUrl
        self.appInventorInstance = "ai2"


class User:
    def __init__(self, name, username, authorId):
        self.name = name
        self.username = username
        self.authorId = authorId
        self.appInventorInstance = "ai2"

gallery_urls = [
    "http://appinventor.mit.edu/explore/app-month-gallery.html",
    "http://appinventor.mit.edu/explore/app-month-winners-2018.html",
    "http://appinventor.mit.edu/explore/app-month-winners-2017.html",
    "http://appinventor.mit.edu/explore/app-month-winners-2016.html",
    "http://appinventor.mit.edu/explore/app-month-winners-2015.html",
]
urls = []
blacklisted_urls = [
    'http://ai2.appinventor.mit.edu/?galleryId=5620079787114496',
    'http://ai2.appinventor.mit.edu/?galleryId=5886772330496000'
]
projects = []
users = {}

for gallery_url in gallery_urls:
    html = bs(requests.get(gallery_url).text, "lxml")
    for link in html.find_all('a'):
        url = link.get('href')
        if url.startswith("http://ai2.appinventor.mit.edu/?galleryId=") \
                and url not in blacklisted_urls:
            urls.append(url)
print(urls)

browser = webdriver.Chrome()
browser.get('http://ai2.appinventor.mit.edu/?galleryId=5288036370874368')

try:
    WebDriverWait(browser, 10).until(EC.presence_of_element_located((By.ID, "identifierId")))
    elem = browser.find_element_by_id("identifierId")  # Find the email address box
    elem.send_keys("ultrakalliespower@gmail.com" + Keys.RETURN)

    # Wait for password input
    WebDriverWait(browser, 10).until(EC.presence_of_element_located((By.NAME, "password")))
    WebDriverWait(browser, 10).until(EC.presence_of_element_located((By.CLASS_NAME, "gallery-app-details")))

    for url in urls:
        print(url)
        browser.get(url)

        # Wait for redirect to gallery app page
        WebDriverWait(browser, 20).until(EC.presence_of_element_located((By.CLASS_NAME, "gallery-app-details")))
        
        # Get basic app info
        html = bs(browser.execute_script("return document.body.innerHTML"), 'lxml')
        app_title = html.find(class_=["app-title"]).text
        debug(app_title)
        app_username = html.find(class_=["app-username"]).text.split("@")[0]
        app_username = "".join(app_username.split())
        debug(app_username)
        description = html.find(class_="app-description").find(class_="gwt-Label").text
        debug(description)
        tutorialUrl = html.find(class_="gwt-Anchor").get("href") if html.find(class_="gwt-Anchor") else None
        debug(tutorialUrl)

        # Add user if non-existent
        if app_username not in users:
            new_user = User(name=app_username, username=app_username, authorId='%s@gmail.com' % app_username)
            users[app_username] = new_user

        # Download image
        app_image = html.find(class_="app-image")["src"]
        debug(app_image)
        try:
            im = imageio.imread(app_image)
            imagePath = "./uploads/" + app_title + ".png"
            imageio.imwrite(imagePath, im)
        except:
            imagePath = None

        # Open app
        browser.find_element_by_class_name("app-action-button").click()
        WebDriverWait(browser, 10).until(EC.visibility_of_element_located((By.CLASS_NAME, "dialogMiddleCenterInner")))
        dialog = browser.find_element_by_class_name("dialogMiddleCenterInner")
        ok_button = browser.find_element(By.XPATH, '//button[text()="OK"]')
        ok_button.click()

        # Get project ID
        WebDriverWait(browser, 30).until(EC.visibility_of_element_located((By.CLASS_NAME, "ya-ProjectName")))
        aia_title = browser.find_element_by_class_name("ya-ProjectName").get_attribute("innerHTML") + '.aia'
        project_id = browser.current_url.split('#')[-1]

        # Open new tab
        browser.find_element_by_tag_name('body').send_keys(Keys.COMMAND + 't') 
        browser.get("http://ai2.appinventor.mit.edu/ode/download/project-source/" + project_id)

        project = Project(galleryUrl=url, authorUsername=app_username, title=app_title,
            projectId=str(len(projects)), imagePath=imagePath,
            aiaPath=aia_title, description=description, tutorialUrl=tutorialUrl)
        projects.append(project)

finally:
    # Write project data
    json_data = json.dumps([project.__dict__ for project in projects])
    with open('projects.json', 'w') as f:
        f.write(json_data)
    
    # Write user data
    json_data = json.dumps([user.__dict__ for user in users.values()])
    with open('users.json', 'w') as f:
        f.write(json_data)