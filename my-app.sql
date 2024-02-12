-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Feb 07, 2024 at 09:39 AM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.0.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `my-app`
--

-- --------------------------------------------------------

--
-- Table structure for table `tbl_logins`
--

CREATE TABLE `tbl_logins` (
  `Id` int(11) NOT NULL,
  `Username` varchar(25) DEFAULT NULL,
  `Password` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_logins`
--

INSERT INTO `tbl_logins` (`Id`, `Username`, `Password`) VALUES
(1, 'honny@gmail.com', 123456),
(3, 'mani@gmail.com', 151462),
(4, 'rajai@gmail.com', 254462),
(5, 'manira@gmail.com', 194155),
(6, 'hongkai@gmail.com', 999999),
(10, 'Ticha@gmail.com', 123654);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `tbl_logins`
--
ALTER TABLE `tbl_logins`
  ADD PRIMARY KEY (`Id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `tbl_logins`
--
ALTER TABLE `tbl_logins`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
