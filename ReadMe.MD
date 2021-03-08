## __Member Management System__ [![time tracker](https://wakatime.com/badge/github/itSubeDibesh/Member_Management_System.svg)](https://wakatime.com/@itSubeDibesh/projects/cokmemttkk)
There is the organization that does have branches and sub branches like lion's club. There is a head branch under
which other are operated. Every branch has executive committee and general members. So, it is necessary to build
the database to keep the record of these members.
The executive committee will be changed every year. So, both current and past committee executive member
should be maintained. Members are rewarded and punished according to their execution. These logs are also to be
recorded.
Every Members need to pay membership according to their designation. So, the record of that should also be done.
Late membership fine also should be applied.

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

## __Setup__ 
Setting up project is piece of cake. Follow the steps below.

1. Open Terminal
1. Clone the project using `git clone https://github.com/itSubeDibesh/Member_Management_System` command.
1. Run `npm install` command to fetch the dependencies.
1. Copy, Paste and Rename `.env.example` to `.env`

## __Setting up database__
Your project wont work yet now all you need to do is create and setup database.
1. Download The [Schema](./Database/Schema/membership.sql) alwo available inside [`/Database/Schema/`](./Database/Schema/membership.sql) directory.
1. Open [PhpMyAdmin](https://www.phpmyadmin.net/) from [Xampp Server](https://www.apachefriends.org/download.html)
1. Create MySql Database with name `membership`
1. Import [Membership Database](./Database/Schema/membership.sql) to __PhpMyAdmin__

## __Creating the First User__
1. [Serve The Project](#Serving-the-Project)
1. Login using Username as `Dibesh` and password as `Dibesh@2019`
1. Open the User and add new user.

## __Serving the Project__
You need to have node installed and all the dependencies fetched inorder to run the project. Simply
 __now execuate `npm run watch` on terminal with project directory pointed to launch the website.__

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
         |-----> Password [Text]
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

## __Setting Json Logs__
If you need to set your logs in `.json` extension then simply update your environment variable `SET_JSON` to `true` in [`.env` file](#Setup) and run your application using `npm start`.

__Note : Don't set `SET_JSON` to `true` if you are using `npm run watch` becasus it utilizes `nodemon` module which monitors all the `json` and `js files` which will restart the server itself time and again and crash the project.__

## __Folder Structure__
Folder Structure  along with uses are visualized below.
<pre>
 ________________
| Root Directory |
|________________|
 |
 |----> Config [Configurations utilized for HTTP work flow]
 |
 |----> Controller [Business logic to operate with HTTP request]
 |
 |----> Database [Core Database connection, querybox and logic]
 |      |----> Schema [Database Schema SQL File]
 |
 |----> Images [Documentation Image Directory]
 |
 |----> LOGS [Server Generated Logs]
 |      |----> ERROR [Server Generated ERROR Logs]
 |      |----> QUERY [Server Generated QUERY Logs]
 |      |----> REQUEST [Server Generated REQUEST Logs]
 |
 |----> Middleware [Validation Middleware]
 |
 |----> node_modules [Node module dependencies]
 |
 |----> Public [Public directory served to client]
 |      |---->Assets [Assets served to client]
 |      |       |----> Css [Css served to client]
 |      |       |----> Images [Images served to client]
 |      |       |----> Js [Js served to client]
 |      |       |----> Vendor [External Vendor Dependencies served to client]
 |      |----> Icons [Icons served to client]
 |
 |----> Routes [Routes Registered for HTTP Request]
 |
 |----> Views [Views and Templates that would be rendered on client]
 |      |----> Layouts [Layout Used for Views]
 |      |----> Partials [Partial view used to handle layout]
 |      |----> All the Other Directory for the specific views
 ________________
| Root Directory |
|________________|
</pre>
The image below shows the implementation of these folder structure.

<img src="./Images/Folder Structure.png">

## __Work flow__
Lets follow the clients approach to get the resources.

1. At First the routs gets request from the client which is stored on  [`webRoutes.js`](./Routes/webRoutes.js) file. Here Instance of Express Application is Required as dependency to handle multiple routes. This routs gets initialized on [`server.init.js`]('./server.init.js') file. All the routes registered on `webRoutes.js` acts as a milldeware for the individual requests registered. 

1. Then the request is passed to specific controller registered to the route under [`Controller` Directory](./Controller/). A specific file is defined under this directory for every routes and All the task related to that route is performed under that specific file.

1. Controller has a [`Config Dependency`](./Config/) stored on Config directory. Here Dependency like SQL euery execuator, Reguest Logger and Middelware handler are requested so that all these dependencies could be extracted on individual controller file as per required. 

1. All the Database queries are stored on [`Queries.json`](./Database/Queries.json) file under Database directory. These Queries are required once on [`Http.js`](./Config/Http.js) file as dependency file so that we could use all the queries independently on any controller file. These queries are stored under `queryBox` variable on `Http.js` and used on every controller file to extract query as per required.

1. All the Queries are Execuated using `QueryExe.js` file under Database directory as well. The Query fetched from `queryBox` is passed on `Exe`  function of `QueryExe.js`. `Exe` function is also set as dependency on `Http.js` so, we can perform any query on any controller as per requirement.

1. Every Execuated Query Returns 2 response. i.e `Result or error` Result are manupulated as per requirement where as errors are logged on `Error.log` file using [`nodefslogger` module](https://www.npmjs.com/package/nodefslogger) which is also set as dependency on `Http.js`.

These were the basic workflow how project works. All the Logs are maintained under [`LOGS`] logs directory which is generated when server needs to maintain log.

## __Some Extra Features__
There are some extra fatures which will only be visible on certain circumstances.
1. Permission Update, Delete and Add function is only available if you set ` HIDE_PERMISSION_ACTIONS = true` flag to false on `.env` file. If this flag is true you will not be able to see permission Update, Delete and Add function.

__Permission Flag Enabled__

<img src="./Images/Permission Enabled Flag.png">

__Result__
<img src="./Images/Permission Enabled.png">

__Permission Flag Disabled__

<img src="./Images/Permission Dissabled Flag.png">

__Result__
<img src="./Images/Permission Disabled.png">

1. Similarly if you Desire to log the data set in json fromat than simply `SET_JSON = false` to true and run using `npm start`.
1. If you want to log the data from log file to console as well then set `LOG_TO_CONSOLE = false` to true.
1. If you want to clear logs everytime server restarts or starts then set `CLEAR_LOGS = false` to true.
1. If you want change root log directory then set `LOG_DIR = LOGS` flag to any directory name you desire.
1. If you want to change pagination limit then simply change `SELECT_LIMIT = 10` flag value to amount of data you want to fetch while using pagination.

## __Todo__
1. Create Techinical and User Documentation
1. Add Monitoring functionality as well
