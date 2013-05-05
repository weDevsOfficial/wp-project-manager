# WordPress Project Manager Plugin (beta)
A project management plugin built on top of WordPress. It simply mimics the simpleness of basecamp.

[Download Now](http://wordpress.org/extend/plugins/wedevs-project-manager/)

## Features
 - Projects
   - Create a new project
   - Set title and details of that project
   - Assign users for that project
 - Messages
   - Messages are used for discussing about the project with co-workers of  that project
   - You can add attachments on messages
   - Comments can be made for discussion
 - To-do List
   - Add as many to-do list as you want with title and description
   - Add tasks, assign users, assign due date
   - See progressbar on the list
   - Add comments on individual to-do lists and to-do's
   - Mark to-do as complete/incomplete
 - Milestone
   - Create milestone
   - Assign messages and to-do list on milestone
   - 3 types of milestones are there, a) upcoming, b) completed and c) late milstone
 - Files
   - See all the uploaded files on messages and comments in one place and navigate to invidual attached threads.


> Currently all the options are in the
> admin panel. Nothing is in frontend
> yet.


## Video Demo
[![Watch Demo][1]][2]

## Extensions
* [WP Project Manger Frontend](http://wedevs.com/plugin/wp-project-manager-frontend/) (*premium*) - brings the plugin functionality to your site frontend.

## FAQ
### Q. Why doesn't it shows up in frontend
A. Currently all the project management options resides in the admin panel. No functionality shows up in frontend right now.

### Q. Who can create projects?
A. Only Editors and Admin's can projects and edit them.

### Q. Who can create tasklist, todo, messages or milestone?
A. Admins and every co-workers from a project can create these.

### Q. Can every member see every project?
A. Only admins (editor/administrator) can see all of them. Other user roles can only see their assigned projects.

### Q. Can the plugin be extended?
A. Sure, lots of actions and filters are added by default and will add more of them.

## Bug Report
Found any bugs? Please create an [issue](https://github.com/tareq1988/wp-project-manager/issues) on github.

## Contribute
This is a beta version right now and should have bugs and lack of many features. If you want to contribute on this project, you are more than welcome.

## Contribution
* French translation by Corentin allard
* Dutch translation by eskamedia
* Brazilian Portuguese translation by Anderson
* German translation by Alexander Pfabel
* Spanish translation by Luigi Libet
* Indonesian translation by hirizh
* Polish translation by Jacek Synowiec

## Changelog


= 0.4.3 =

* new: Spanish translation
* new: German translation
* new: Indonesian translation
* fix: milestone datepicker issue
* fix: some typo fixes
* improved: comment count next to tasklists

### 0.4.2

* bug fix: project activity/comments on frontend widget
* bug fix: project activity/comments on comment rss
* bug fix: number of milestones
* improved: plugin textdomain loading
* new: project task progressbar on project listing
* new: tasklist sorting
* new: task sorting
* new: Dutch translation language added
* new: Brazilian Portuguese language added

### 0.4.1

* bug fix: attachment association problem on comment update
* bug fix: error on message update

### 0.4

* improved: default email format changed to 'text/plain' from 'text/html'
* improved: toggle added on user notification selection
* improved: only date was showing on single message details, time added
* improved: some filters added on URLs
* bug fix: actual file url hidden on files tab for privacy
* bug fix: any user could edit any users message
* bug fix: any user could delete any users message
* new: admin settings page added
* new: email template added
* new: French translation added
* new: file upload size settings added

### 0.3.1

* comment update bug fix
* project activity is now grouped by date
* "load more" button added on project activity
* some function documentation added.

### 0.3

* Translation capability added
* Attachment security added. All files are now served via a proxy script
  for security with permission checking.

### 0.2.1

* Comments display error fix

### 0.2

* Remove comments from listing publicly
* Post types are hidden from search

### 0.1
Initial version released


## Author
[Tareq Hasan](http://tareq.wedevs.com)

[1]: http://i.imm.io/MOeu.png
[2]: https://www.youtube.com/watch?v=tETwpwjSA4Q
