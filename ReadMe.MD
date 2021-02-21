## __Member Management System__ [![time tracker](https://wakatime.com/badge/github/itSubeDibesh/Member_Management_System.svg)](https://wakatime.com/@itSubeDibesh/projects/cokmemttkk)

 ## __Requirements__
 The actual requirement of client are listed below.
 - [X] Store Branch and sub Branch Details
 - [X] Store Working Period Details
 - [X] Store Committe and General Members Details
 - [X] Store Designation, Roles And Access Details
 - [X] Store Member Awards and Alligations Details
 - [X] Store Membership and Penalty Details
 - [X] Store Payment Details
 - [X] Implement Login, Logout and Reset Password
___

## __Tools and Languages Utilized__

| Name       	| Type                            	| Purpose                                      	| Icones                                      	|
|------------	|---------------------------------	|----------------------------------------------	|----------------------------------------------	|
| __HTML__       	| Language                        	| Basic Structure                              	| !["HTML"](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)                              	|
| __Css__        	| Tool                            	| Design and Decorating HTML                   	| !["Css"](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)     
| __Bootstrap__        	| Designing Tool                            	| Design and Decorating HTML                   	| !["Bootstrap"](https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white)    |
| __JS__         	| Scripting Tool                  	| Used to Write Scripts                        	| !["JS"](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)                              	|
| __Node__       	| Server Side Scripting Tool      	| Used to Write Server Side Script             	| !["Node"](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)                              	|
| __Express__    	| Server Side Scripting Framework 	| Used to Optimize Server Side Code            	| !["Express"](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)                              	|
| __HandleBars__ 	| Templating Engine               	| Used to create Dynamic Client Side Templates 	| !["HandleBars"](https://img.shields.io/badge/Handlebars-FDB22A?style=for-the-badge&logoColor=white)                              	|
| __MySql__      	| Database                        	| Used for Storing and Quering Datas           	| !["MySql"](https://img.shields.io/badge/MySQL-00000F?style=for-the-badge&logo=mysql&logoColor=white)                              	|
| __PhpMyAdmin__ 	| Database Management Software    	| Helps to Organize MariaDb Database(MySql)    	| !["phpMyAdmin"](https://img.shields.io/badge/phpMyAdmin-ff8800?style=for-the-badge&logo=phpmyadmin&logoColor=white)                             	|
| __Npm__        	| Package Manager                 	| Package Server                               	| !["NPM"](https://img.shields.io/badge/NPM-CB3837?style=for-the-badge&logo=npm&logoColor=white)                              	|
| __MD__        	| Documenting Tool                 	| Document on Github                              	| !["MD"](https://img.shields.io/badge/Markdown-000000?style=for-the-badge&logo=markdown&logoColor=white)                              	|

___

## __Setup__ 
Setting up project is piece of cake. Follow the steps below.

1. Open Terminal
1. Clone the project using `git clone https://github.com/itSubeDibesh/Member_Management_System` command.
1. Run `npm install` command to fetch the dependencies.
1. Copy, Paste and Rename `.env.example` to `.env`
___

## __Setting up database__
Your project wont work yet now all you need to do is create and setup database.
1. Download The [Schema](./Database/Schema/membership.sql) alwo available inside [`/Database/Schema/`](./Database/Schema/membership.sql) directory.
1. Open [PhpMyAdmin](https://www.phpmyadmin.net/) from [Xampp Server](https://www.apachefriends.org/download.html)
1. Create MySql Database with name `membership`
1. Import [Membership Database](./Database/Schema/membership.sql) to __PhpMyAdmin__
___

## __Creating the First User__
1. Open [__PhpMyAdmin__](http://localhost/phpmyadmin) 
1. Select `role` table from `membership` database
1. Select Insert from menue section and insert the role information 
1. Now select `user` table from `membership` database
1. Select Insert from menue section and insert the user information 

Thats it your first user has been created now you can open the website using following step.
___
## __Serving the Project__
You need to have node installed and all the dependencies fetched inorder to run the project. Simply
 __now execuate `npm run watch` on terminal with project directory pointed to launch the website.__
 ___

## __Database Schema__
A Basic database Schema Concept is shown below.
<pre>
[Branch]-------> BranchId [PK]
         |-----> ParentId [FK] -> Branch Id Itself
         |-----> Name [Varchar(100)]
         |-----> Address [Varchar(100)]
         |-----> Contact [Varchar(20)]
         |-----> Status [Enum(Active,Inactive)]
         |-----> CreatedAt [TimeStamp]
         |-----> UpdatedAt [TimeStamp(ON Update)]

[Designation]--> DesignationId [PK]
         |-----> Name [Varchar(100)]
         |-----> Membership Fee [Varchar(100)]
         |-----> Hirachy Value [int(8)]
         |-----> Remarks [Text]
         |-----> CreatedAt [TimeStamp]
         |-----> UpdatedAt [TimeStamp(ON Update)]

[Role]---------> RoleID [PK]
         |-----> Name [Varchar(100)]
         |-----> Remarks [Text]
         |-----> CreatedAt [TimeStamp]
         |-----> UpdatedAt [TimeStamp(ON Update)]

[Permission]---> PermissionId [PK]
         |-----> Name [Varchar(100)]
         |-----> Remarks [Text]
         |-----> CreatedAt [TimeStamp]
         |-----> UpdatedAt [TimeStamp(ON Update)]

[RolePermission]
         |-----> RolePermissionId [PK]
         |-----> RoleID [FK]
         |-----> PermissionId [FK]
         |-----> Status [Enum(Active,Inactive)]

[User]-------> UserID [PK]
         |-----> RoleID [FK]
         |-----> UserName [Varchar(20)]
         |-----> Password [Varchar(20)]
         |-----> CreatedAt [TimeStamp]
         |-----> UpdatedAt [TimeStamp(ON Update)]

[Member]-------> MemberId [PK]
         |-----> UserId [FK]
         |-----> DesignationId [FK]
         |-----> Name [Varchar(100)]
         |-----> DOB [Date]
         |-----> Address [Varchar(100)]
         |-----> Profession [Varchar(100)]
         |-----> Gender [Enum(Male,Female,Others)]
         |-----> Contact [Varchar(20)]
         |-----> Status [Enum(Active,Inactive)]
         |-----> Joined Date [DateTime] -> Register New Membeship
         |-----> Membership Renew Status [TinyInt] -> Trigger when MemberShip Renews 
         |-----> Last Renewed Date [DateTime] -> Record Last Renewed Date
         |-----> CreatedAt [TimeStamp]
         |-----> UpdatedAt [TimeStamp(ON Update)]

[AlligationsAndRewards]-----> AlligationsAndRewardsID [PK]
         |-----> MemberId [FK]
         |-----> Type [Enum(Alligation,Reward)]
         |-----> Title [Text]
         |-----> Description [Text]
         |-----> CreatedAt [TimeStamp]
         |-----> UpdatedAt [TimeStamp(ON Update)]

[PenaltyCriteria]-----> PenaltyCriteriaId [PK]
         |-----> Number of Exceeded Days [Int]
         |-----> Amount [Decimal(2)]

[Payments]-----> PaymentId [PK]
         |-----> MemberId [FK]
         |-----> Payment Title [enum(Membership Renew, Penalty, New Membership)]
         |-----> Amount [Decimal(2)]
         |-----> CreatedAt [TimeStamp]
         |-----> UpdatedAt [TimeStamp(ON Update)]

[Committe]----> ComitteId [PK]
        |-----> BranchId [FK]
        |-----> Starting Year [Date]
        |-----> Ending Year [Date]
        |-----> Name [varchar(50)]
        |-----> ComitteHead [Int] -> MemberId

[CommitteMember]
        |--------> CommitteMemberId [PK]
        |--------> CommitteId [FK]
        |--------> MemberId [FK]
</pre>

Following schema diagram can be extracted after implementing the above schema

<img src="./Images/Schema Diagram.png">