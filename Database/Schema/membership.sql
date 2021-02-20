-- phpMyAdmin SQL Dump
-- version 5.0.4
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Feb 20, 2021 at 02:25 PM
-- Server version: 10.4.17-MariaDB
-- PHP Version: 8.0.0

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `membership`
--

-- --------------------------------------------------------

--
-- Table structure for table `alligationsandrewards`
--

CREATE TABLE `alligationsandrewards` (
  `AlligationsAndRewardsID` int(11) NOT NULL,
  `MemberId` int(11) NOT NULL COMMENT 'Relation with Member Table',
  `Type` enum('Alligation','Reward') DEFAULT NULL,
  `Title` text NOT NULL,
  `Description` text DEFAULT NULL,
  `CreatedAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `UpdatedAt` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `branch`
--

CREATE TABLE `branch` (
  `BranchId` int(11) NOT NULL COMMENT 'Store New Branch ID',
  `ParentId` int(11) DEFAULT NULL,
  `Name` varchar(100) NOT NULL,
  `Address` varchar(100) DEFAULT NULL,
  `Contact` varchar(20) DEFAULT NULL,
  `Status` enum('Active','Inactive') NOT NULL DEFAULT 'Inactive',
  `CreatedAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `UpdatedAt` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `committe`
--

CREATE TABLE `committe` (
  `ComitteId` int(11) NOT NULL,
  `BranchId` int(11) NOT NULL COMMENT 'Relation With Branch Table on Branch Id',
  `Starting_Year` date NOT NULL,
  `Ending_Year` date NOT NULL,
  `Name` varchar(100) NOT NULL,
  `ComitteHead` int(11) NOT NULL COMMENT 'Relation With Member ID on Member Table'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `committemember`
--

CREATE TABLE `committemember` (
  `ComitteMemberId` int(11) NOT NULL,
  `CommitteId` int(11) NOT NULL,
  `MemberId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `designation`
--

CREATE TABLE `designation` (
  `DesignationId` int(11) NOT NULL COMMENT 'Set Designation ',
  `Name` varchar(100) NOT NULL,
  `Membership_Fee` double NOT NULL,
  `Hierarchy_Value` int(11) NOT NULL,
  `Remarks` text DEFAULT NULL,
  `CreatedAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `UpdatedAt` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `member`
--

CREATE TABLE `member` (
  `MemberId` int(11) NOT NULL,
  `UserId` int(11) NOT NULL,
  `DesignationId` int(11) NOT NULL,
  `Name` varchar(100) NOT NULL,
  `DOB` date NOT NULL,
  `Address` varchar(100) NOT NULL,
  `Profession` varchar(100) NOT NULL,
  `Gender` enum('Male','Female','Others','None') NOT NULL DEFAULT 'None',
  `Contact` varchar(20) NOT NULL,
  `Status` enum('Active','Inactive') NOT NULL DEFAULT 'Active',
  `Joined_Date` date DEFAULT NULL COMMENT 'Register New Membership',
  `Membership_Renew_Status` tinyint(4) DEFAULT NULL,
  `Last_Renewed_Date` date DEFAULT NULL,
  `CreatedAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `UpdatedAt` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

CREATE TABLE `payments` (
  `PaymentId` int(11) NOT NULL,
  `MemberId` int(11) NOT NULL COMMENT 'Relation With Member Table',
  `Payment_Title` enum('Membership_Renew','Penalty','New_Membership') NOT NULL,
  `Amount` double NOT NULL,
  `CreatedAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `UpdatedAt` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `penaltycriteria`
--

CREATE TABLE `penaltycriteria` (
  `PenaltyCriteriaId` int(11) NOT NULL,
  `Number_of_Exceeded_Days` int(11) NOT NULL,
  `Amount` double NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `permission`
--

CREATE TABLE `permission` (
  `PermissionId` int(11) NOT NULL,
  `Name` varchar(100) NOT NULL,
  `Remarks` text DEFAULT NULL,
  `CreatedAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `UpdatedAt` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `role`
--

CREATE TABLE `role` (
  `RoleId` int(11) NOT NULL,
  `Name` varchar(100) NOT NULL,
  `Remarks` text DEFAULT NULL,
  `CreatedAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `UpdatedAt` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `rolepermission`
--

CREATE TABLE `rolepermission` (
  `RolePermissionId` int(11) NOT NULL,
  `RoleId` int(11) DEFAULT NULL,
  `PermissionId` int(11) DEFAULT NULL,
  `Status` enum('Active','Inactive') NOT NULL DEFAULT 'Inactive'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `UserId` int(11) NOT NULL,
  `RoleId` int(11) NOT NULL COMMENT 'Relation Between Role and User',
  `UserName` varchar(20) NOT NULL,
  `Password` varchar(20) NOT NULL,
  `CreatedAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `UpdatedAt` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `alligationsandrewards`
--
ALTER TABLE `alligationsandrewards`
  ADD PRIMARY KEY (`AlligationsAndRewardsID`),
  ADD KEY `MembershipId_Fk_AlligationAndRewards_MembershipId` (`MemberId`);

--
-- Indexes for table `branch`
--
ALTER TABLE `branch`
  ADD PRIMARY KEY (`BranchId`),
  ADD KEY `ParentId_Fk_Branch_BranchId` (`ParentId`);

--
-- Indexes for table `committe`
--
ALTER TABLE `committe`
  ADD PRIMARY KEY (`ComitteId`),
  ADD KEY `BranchId_Fk_Committe_BranchId` (`BranchId`),
  ADD KEY `ComitteHead_Fk_Committe_MemberId` (`ComitteHead`);

--
-- Indexes for table `committemember`
--
ALTER TABLE `committemember`
  ADD PRIMARY KEY (`ComitteMemberId`),
  ADD KEY `ComitteID_FK_ComitteMember_ComitteId` (`CommitteId`),
  ADD KEY `Member_Fk_CommitteMember_MemberId` (`MemberId`);

--
-- Indexes for table `designation`
--
ALTER TABLE `designation`
  ADD PRIMARY KEY (`DesignationId`);

--
-- Indexes for table `member`
--
ALTER TABLE `member`
  ADD PRIMARY KEY (`MemberId`),
  ADD KEY `UserID_FK_User_UserID` (`UserId`),
  ADD KEY `DesignationID_FK_Designation_DesignationId` (`DesignationId`);

--
-- Indexes for table `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`PaymentId`),
  ADD KEY `MemberID_FK_Payments_MemberID` (`MemberId`);

--
-- Indexes for table `penaltycriteria`
--
ALTER TABLE `penaltycriteria`
  ADD PRIMARY KEY (`PenaltyCriteriaId`);

--
-- Indexes for table `permission`
--
ALTER TABLE `permission`
  ADD PRIMARY KEY (`PermissionId`);

--
-- Indexes for table `role`
--
ALTER TABLE `role`
  ADD PRIMARY KEY (`RoleId`);

--
-- Indexes for table `rolepermission`
--
ALTER TABLE `rolepermission`
  ADD PRIMARY KEY (`RolePermissionId`),
  ADD KEY `PermissionID_FK_RolePermission_PermissionID` (`PermissionId`),
  ADD KEY `RoleID_FK_RolePermission_RoleID` (`RoleId`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`UserId`),
  ADD UNIQUE KEY `UserName` (`UserName`),
  ADD KEY `RoleID_FK_User_RoleID` (`RoleId`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `alligationsandrewards`
--
ALTER TABLE `alligationsandrewards`
  MODIFY `AlligationsAndRewardsID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `branch`
--
ALTER TABLE `branch`
  MODIFY `BranchId` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Store New Branch ID';

--
-- AUTO_INCREMENT for table `committe`
--
ALTER TABLE `committe`
  MODIFY `ComitteId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `committemember`
--
ALTER TABLE `committemember`
  MODIFY `ComitteMemberId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `designation`
--
ALTER TABLE `designation`
  MODIFY `DesignationId` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Set Designation ';

--
-- AUTO_INCREMENT for table `member`
--
ALTER TABLE `member`
  MODIFY `MemberId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `payments`
--
ALTER TABLE `payments`
  MODIFY `PaymentId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `penaltycriteria`
--
ALTER TABLE `penaltycriteria`
  MODIFY `PenaltyCriteriaId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `permission`
--
ALTER TABLE `permission`
  MODIFY `PermissionId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `role`
--
ALTER TABLE `role`
  MODIFY `RoleId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `rolepermission`
--
ALTER TABLE `rolepermission`
  MODIFY `RolePermissionId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `UserId` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `alligationsandrewards`
--
ALTER TABLE `alligationsandrewards`
  ADD CONSTRAINT `MembershipId_Fk_AlligationAndRewards_MembershipId` FOREIGN KEY (`MemberId`) REFERENCES `member` (`MemberId`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `branch`
--
ALTER TABLE `branch`
  ADD CONSTRAINT `ParentId_Fk_Branch_BranchId` FOREIGN KEY (`ParentId`) REFERENCES `branch` (`BranchId`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `committe`
--
ALTER TABLE `committe`
  ADD CONSTRAINT `BranchId_Fk_Committe_BranchId` FOREIGN KEY (`BranchId`) REFERENCES `branch` (`BranchId`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `ComitteHead_Fk_Committe_MemberId` FOREIGN KEY (`ComitteHead`) REFERENCES `member` (`MemberId`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `committemember`
--
ALTER TABLE `committemember`
  ADD CONSTRAINT `ComitteID_FK_ComitteMember_ComitteId` FOREIGN KEY (`CommitteId`) REFERENCES `committe` (`ComitteId`) ON DELETE CASCADE,
  ADD CONSTRAINT `Member_Fk_CommitteMember_MemberId` FOREIGN KEY (`MemberId`) REFERENCES `member` (`MemberId`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `member`
--
ALTER TABLE `member`
  ADD CONSTRAINT `DesignationID_FK_Designation_DesignationId` FOREIGN KEY (`DesignationId`) REFERENCES `designation` (`DesignationId`),
  ADD CONSTRAINT `UserID_FK_User_UserID` FOREIGN KEY (`UserId`) REFERENCES `user` (`UserId`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `payments`
--
ALTER TABLE `payments`
  ADD CONSTRAINT `MemberID_FK_Payments_MemberID` FOREIGN KEY (`MemberId`) REFERENCES `member` (`MemberId`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `rolepermission`
--
ALTER TABLE `rolepermission`
  ADD CONSTRAINT `PermissionID_FK_RolePermission_PermissionID` FOREIGN KEY (`PermissionId`) REFERENCES `permission` (`PermissionId`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `RoleID_FK_RolePermission_RoleID` FOREIGN KEY (`RoleId`) REFERENCES `role` (`RoleId`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `user`
--
ALTER TABLE `user`
  ADD CONSTRAINT `RoleID_FK_User_RoleID` FOREIGN KEY (`RoleId`) REFERENCES `role` (`RoleId`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
