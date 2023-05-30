## Visit the deployment [`here`](https://messenger-pi-ten.vercel.app/login)

`Messenger` is my second major project used to learn web development. 

+ Designed in NextJS leveraging Redis as my database, NextAuth for user authentication  
and Pusher for realtime updates within the app.

+ Throughout the development of this project, I learned so much about producing a real full stack application. 

+ Implementing user authentication through NextAuth and database implementation with Redis was a first experience for me.

+ Alongside utlising TailwindCSS and creating functional components for case specific styling,   
there were many instances where I used Typescripts type safety features  
to create interfaces and custom types for better code practices.  

+ This app is mostly finished, with more ideas and better styling that I am intending to add in the coming future (dark mode, user profile pages, etc.)

### Challenges
There were a multitude of challenges I've faced during the development of `Messenger`.  
I spent many hours debugging why the realtime functionality was not working correctly, reading lots of documentation from Redis, Pusher, date-fns, TailwindCSS.  

Additionally from learning many technical skills from this project, I also learned patience and that growth comes with time.  
Things like these take weeks and months to put into a finished product, as well as lots of reading and looking through every letter of your code.

## Features
`Messenger` contains many features that you would see in any modern day messaging app.  

+ Using Pusher, real time notifications are displayed to the user of a new message from  
a user they're friends with.  
![alt text](https://github.com/jonathangorbachev/Messenger/assets/117601958/3ea473a6-25e5-47ee-ad88-3834b9e673ad "Dashboard page of app")  

+ A very user friendly sidebar is shown throughout the entire application to display the users current friends,  
and options to send and see current friend requests  
![alt text](https://github.com/jonathangorbachev/Messenger/assets/117601958/8cbd1bcf-57c2-4967-b8f0-bf1c38a6352f "Dashboard page of app")   

+ The messaging component also leverages Pusher to enable real time updates within the chatbox,  
showing the time messages were sent as well using the date-fns library from npm.  
![alt text](https://github.com/jonathangorbachev/Messenger/assets/117601958/74d333ac-2bd6-4fbd-9d26-c189926329e4 "Main chat component of app")

