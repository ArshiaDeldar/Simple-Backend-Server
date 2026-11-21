This is just a simple exercise code for a server, not a complete production-ready secure application.

After performing simple CRUD operations using Node.js and Express.js, I connected the project to a PostgreSQL database.
I wrote and executed simple queries using SQL and pgAdmin 4 to shape the structure of my database.
I used Prisma to connect my database to my existing JavaScript backend. After that I added some more authentication code.
Users could then send register, login and logout requests. Also I added a route for a dashboard.
I used a session-based authentication which means when a user logs in the information is stored in a cookie. That way, the user will stay logged in even after refereshing.
There is only simple authorization code. For example when someone who hasn't logged in tries to access the dashboard route they get redirected to the login route.
But as I mentioned earlier, the authorization is not complete.

Finally, after adding all of this, I connected the backend to a simple React.js UI so it will be easier to test.
During development, the testing was only done using Thunder Client. But now it's easier to test. It also looks more like a complete beginner's full-stack web-app.
