# __Member Management System__

## __Setup__ 
Setting up project is piece of cake. Follow the steps below.

1. Open Terminal
1. Clone the project using `git clone https://github.com/itSubeDibesh/Member_Management_System` command.
1. Run `npm install` command to fetch the dependencies.
1. Create MySql Database with name `membership`
1. Now Download and Import [Membership Database](./Database/Schema/membership.sql) to __PhpMyAdmin__
1. Copy, Paste and Rename `.env.example` to `.env`
1. Now Execuate `npm run watch` to launch the website.

__Note :__ Your MySql Server is only required so you can turn off __apache__ if you are using __xampp server__.
___
## __Tools and Languages Utilized__
| Name       	| Type                            	| Purpose                                      	|
|------------	|---------------------------------	|----------------------------------------------	|
| __HTML__       	| Language                        	| Basic Structure                              	|
| __Css__        	| Tool                            	| Design and Decorating HTML                   	|
| __JS__         	| Scripting Tool                  	| Used to Write Scripts                        	|
| __Node__       	| Server Side Scripting Tool      	| Used to Write Server Side Script             	|
| __Express__    	| Server Side Scripting Framework 	| Used to Optimize Server Side Code            	|
| __HandleBars__ 	| Templating Engine               	| Used to create Dynamic Client Side Templates 	|
| __MySql__      	| Database                        	| Used for Storing and Quering Datas           	|
| __PhpMyAdmin__ 	| Database Management Software    	| Helps to Organize MariaDb Database(MySql)    	|
| __Npm__        	| Package Manager                 	| Package Server                               	|

___

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
## __Database Schema__
A Basic database Schema Concept is Explained Below.
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
         |-----> Status [Enum(Active,Inactive)]
         |-----> Remarks [Text]
         |-----> CreatedAt [TimeStamp]
         |-----> UpdatedAt [TimeStamp(ON Update)]

[Permission]---> PermissionId [PK]
         |-----> Name [Varchar(100)]
         |-----> Status [Enum(Active,Inactive)]
         |-----> Remarks [Text]
         |-----> CreatedAt [TimeStamp]
         |-----> UpdatedAt [TimeStamp(ON Update)]

[RolePermission]
         |-----> RoleID [FK]
         |-----> PermissionId [FK]

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
        |--------> CommitteId [FK]
        |--------> MemberId [FK]
</pre>

Following schema diagram can be extracted after implementing the avove schema

<img src="./Database/Schema/Schema Diagram.png">

Sql script is available inside [`/Database/Schema/`](./Database/Schema/membership.sql) directory. 