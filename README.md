**Changelog**

**The project was never intended to work on chromium based browsers, use Firefox instead**

**Link to project:** https://procuraya-hdemo.herokuapp.com/

**For more info check public Trello Roadmap at:** https://trello.com/b/Nk5HrWOk/procura-ya

**Email sender was succesfully tested with the following emails:**

 Protonmail
 Outlook
 Gmail
 Mohmal

Update #20

1. Fixes

Update #19

1. Attorneys actions were reduced, attorneys can't:
    * Upload Files
    * Search for files in DB
    * Assign tasks to files
    * Assign files to other users
2. Implemented jwt (with refresh tokens) over sessions
3. Now users with "representative" user type will see an un-accomplished tasks table for each file
4. Now users with "attorney" user type will see an un-accomplished tasks table for each file and from there they can complete them.
5. When session expires, you will be asked to extend it
6. Improved messages when there's no data to show


Update #18

1. Fixes and miscellaneous improvemets
2. Representatives can now attach tasks to specific file

Update #17

1. Users can now assign/un-assign files to their attorneys
2. Representatives can now send messages in-app
3. Attorneys Panel
4. Miscellaneous fixes
5. More features I don't remember

Update #16

1. New Landing Page

Update #15

1. The Api that gets user's files list is now working
2. An Api will get a file on demand
3. Fixed an issue were server didn't save user info in session after signUp
4. Upload file Api
5. Implemented protected react routes, now direct access to /Home will redirect to an unauthorized page
6. New unauthorized page, watch out ! Gandalf is blocking the way !
7. Control panel now will display an image with a message if no file were found for logged user
8. Now you can see the files you uploaded using a button in Control panel
9. Fixed some css issues with Text Editor in File Upload Form
10. Added fields validation to the File Upload Form
11. Css fixes
12. The posibility for creating a "representative account" was paused
13. Added some messages for user based on his interaction with diferent components

Update #14

1. Upload File Form

Update #13

1. Various fixes in the following forms: SignUp Form, Reset Password Form, Login Form.
2. Trello roadmap updated
3. Reset password feature now has it's own diagram design
4. An api will confirm users email when they unblock their accounts
5. NavBar fixed: now it shows user name
6. Some images sizes were reduced for faster loading
 

Update #12

1. Minor fixes on signUp Form
2. Reset Password Form can now guide users trough steps to restore password and unblock their accounts
3. Unblock user api is now working as expected
4. A brand new update password api was violently added
5. We added an api for sending random codes to users emails
6. We added an api for validate those codes sended

Update #11

1. Online Mongo DB Cluster is now connected to Heroku

Update #10

1. Automatic deploys to Heroku with commits (no BD yet)
2. The Create Account page now supports from 1024x768p to 1920x1080p resolution display
3. Changelog
4. We don't remember others older updates,  ¯\_( ͡❛ ᴗ ͡❛)_/¯

Update #9

1. Captcha comprobation Api
2. Login Form v1.1

Update #8

1. Sign Up Form v1.1
2. Generate Random Captcha Api

Update #7

1. Login Api v1.1
2. Message when user deactivates javascript

Update #6

1. BD set up
2. Sign up Api
3. Sign up Form
4. Login Api
5. Login Form

Update #5

1. Miscelaneous fixes
2. Home page
3. Backend server set up

Update #4

1. Footer

Update #3

1. Css fixes

Update #2

1. Create Account Page

Update #1

1. Landing Page
