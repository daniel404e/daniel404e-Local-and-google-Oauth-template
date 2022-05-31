# daniel404e-Local-and-google-Oauth-template
A simple template for devs to directly patch in Oauth and Local authentication using mongoose , express sessions and passportjs

Use command `npm i` to install all the dependencies 


replace your api key and secret key in .env file







![image](https://user-images.githubusercontent.com/83254980/171171104-9c719d8c-1a96-4a4d-aac4-c05d207ad3c3.png)


all conflicts regarding user registration using Oauth or local  has been taken care of.The users are addressed by their username or email-id even if they sign in via Oauth
![image](https://user-images.githubusercontent.com/83254980/171171616-35d9b565-bbd8-4063-9474-26d880101f16.png)
![image](https://user-images.githubusercontent.com/83254980/171173000-273345b2-e2c0-4b27-8bd3-243885eb8d99.png)



the Oauth callback address has to be changed in  google console
![image](https://user-images.githubusercontent.com/83254980/171172095-50592be3-1f50-4dcc-9abf-f9a22c009e30.png)



page visiblity of `secrets` is set to public while `submit` can only be accessed if you are loged-in .
![image](https://user-images.githubusercontent.com/83254980/171172513-bcd23be5-9e62-464c-aa71-b2e2c7508c9e.png)
![image](https://user-images.githubusercontent.com/83254980/171172851-850fa3dc-0948-47e1-980f-c54a4a4c7777.png)


any unauthorized access will redirect you back to register/login page.

once you log-out the session is made to expire and the chache is cleared landing you back to the index page.

