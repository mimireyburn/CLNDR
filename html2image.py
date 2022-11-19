from selenium import webdriver
from webdriver_manager.chrome import ChromeDriverManager

DRIVER = 'chromedriver'
driver = webdriver.Chrome(ChromeDriverManager().install())
driver.get('http://localhost:3000')
screenshot = driver.save_screenshot('screenshot.png')
driver.quit() 