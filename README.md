# Personal Website Backend
### This project is a **Backend Server** for my personal website project, using MongoDB to store data
<br/>

# About `Personal Website Project`
It is a full-stack personal website system, consisting of project three elements **Main Website**, **Backend Server** and **Content Management System**

Your can click blew link to get more info 
### Main Website: [Personal Website Dcard](https://github.com/okesseko/personal-website-dcard)
### Content Management System: [Personal Website CMS](https://github.com/okesseko/personal-website-cms)

# Getting Started
Firstly, you will need to clone the repo locally. Once you have it ready navigate into the directory and run the following commands:

1. Prepared your MongoDB, if you didn't ready yet. Follow this [Download and Install Compass](https://www.mongodb.com/docs/compass/current/install/)
2. `npm install` or `yarn` (if you use yarn)
3. Create a `.env` file in the root directory of this repo file
![env path](/docs/env.png)

4. Set three variables DB_URL,JWT_SECRET and PASSWORD_SECRET into .env file
```
DB_URL = <mongodb url>
JWT_SECRET = < jwt private key>
PASSWORD_SECRET = <private key to encode password> 
```

5. `npm run start` or `yarn start` (if you use yarn)

After you start the project. It will automatically open on port **9000**.<br/>
You can call it by the url `http://localhost:9000` 
