/*
 Navicat Premium Data Transfer

 Source Server         : local
 Source Server Type    : MySQL
 Source Server Version : 50731
 Source Host           : localhost:3306
 Source Schema         : template_scum_log_tool

 Target Server Type    : MySQL
 Target Server Version : 50731
 File Encoding         : 65001

 Date: 18/03/2024 21:57:08
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for actions_record
-- ----------------------------
DROP TABLE IF EXISTS `actions_record`;
CREATE TABLE `actions_record` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `scumId` varchar(50) COLLATE utf8mb4_bin DEFAULT NULL,
  `steamId` varchar(17) COLLATE utf8mb4_bin DEFAULT NULL,
  `sessionId` varchar(10) COLLATE utf8mb4_bin DEFAULT NULL,
  `createdLocations` varchar(60) COLLATE utf8mb4_bin NOT NULL,
  `createdArea` varchar(15) COLLATE utf8mb4_bin NOT NULL,
  `createdTimeStamp` varchar(13) COLLATE utf8mb4_bin NOT NULL,
  `targetName` varchar(50) COLLATE utf8mb4_bin DEFAULT NULL,
  `otherConfig` json DEFAULT NULL,
  `type` varchar(30) COLLATE utf8mb4_bin NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Table structure for admin_command
-- ----------------------------
DROP TABLE IF EXISTS `admin_command`;
CREATE TABLE `admin_command` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `scumId` varchar(50) COLLATE utf8mb4_bin NOT NULL,
  `steamId` varchar(17) COLLATE utf8mb4_bin NOT NULL,
  `sessionId` varchar(10) COLLATE utf8mb4_bin NOT NULL,
  `content` text COLLATE utf8mb4_bin NOT NULL,
  `sendTimeStamp` varchar(13) COLLATE utf8mb4_bin NOT NULL,
  `otherConfig` json DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Table structure for chat_message
-- ----------------------------
DROP TABLE IF EXISTS `chat_message`;
CREATE TABLE `chat_message` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `scumId` varchar(50) COLLATE utf8mb4_bin NOT NULL,
  `steamId` varchar(17) COLLATE utf8mb4_bin NOT NULL,
  `sessionId` varchar(10) COLLATE utf8mb4_bin NOT NULL,
  `type` varchar(10) COLLATE utf8mb4_bin NOT NULL,
  `content` text COLLATE utf8mb4_bin NOT NULL,
  `sendTimeStamp` varchar(13) COLLATE utf8mb4_bin NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Table structure for economy
-- ----------------------------
DROP TABLE IF EXISTS `economy`;
CREATE TABLE `economy` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `scumId` varchar(50) COLLATE utf8mb4_bin DEFAULT NULL,
  `steamId` varchar(17) COLLATE utf8mb4_bin DEFAULT NULL,
  `type` varchar(15) COLLATE utf8mb4_bin NOT NULL,
  `createdTimeStamp` varchar(13) COLLATE utf8mb4_bin NOT NULL,
  `otherConfig` json DEFAULT NULL,
  `trader` varchar(30) COLLATE utf8mb4_bin DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Table structure for kill
-- ----------------------------
DROP TABLE IF EXISTS `kill`;
CREATE TABLE `kill` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `killerName` varchar(30) COLLATE utf8mb4_bin NOT NULL,
  `distance` double NOT NULL,
  `isEventKill` tinyint(4) NOT NULL,
  `victimName` varchar(30) COLLATE utf8mb4_bin NOT NULL,
  `killerLocations` varchar(60) COLLATE utf8mb4_bin NOT NULL,
  `killerArea` varchar(10) COLLATE utf8mb4_bin NOT NULL,
  `victimLocations` varchar(60) COLLATE utf8mb4_bin NOT NULL,
  `victimArea` varchar(10) COLLATE utf8mb4_bin NOT NULL,
  `weapon` varchar(200) COLLATE utf8mb4_bin NOT NULL,
  `killerSteamId` varchar(17) COLLATE utf8mb4_bin NOT NULL,
  `victimSteamId` varchar(17) COLLATE utf8mb4_bin NOT NULL,
  `occuredTimeStamp` varchar(13) COLLATE utf8mb4_bin NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Table structure for server_config
-- ----------------------------
DROP TABLE IF EXISTS `server_config`;
CREATE TABLE `server_config` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `value` text COLLATE utf8mb4_bin,
  `modify` tinyint(4) NOT NULL DEFAULT '1',
  `createdTimeStamp` varchar(13) COLLATE utf8mb4_bin NOT NULL,
  `name` varchar(100) COLLATE utf8mb4_bin NOT NULL,
  `cnName` varchar(100) COLLATE utf8mb4_bin DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=183 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Records of server_config
-- ----------------------------
BEGIN;
INSERT INTO `server_config` VALUES (8, '{\"value\":\"\"}', 1, '1611587843813', 'SteamAPIToken', 'SteamAPIToken');
INSERT INTO `server_config` VALUES (15, '{\"value\":\"\"}', 1, '1611587843813', 'GGHostServerDetail', 'GGHostServerDetail');
INSERT INTO `server_config` VALUES (16, '{\"value\":\"\"}', 1, '1611587843813', 'GGHostFTPUrl', 'GGHostFTPUrl');
INSERT INTO `server_config` VALUES (17, '{\"value\":\"\"}', 1, '1611587843813', 'GGHostFTPAccount', 'GGHostFTPAccount');
INSERT INTO `server_config` VALUES (18, '{\"value\":\"\"}', 1, '1611587843813', 'GGHostFTPPassword', 'GGHostFTPPassword');
INSERT INTO `server_config` VALUES (19, '{\"value\":false}', 1, '1611587843813', 'EnableGGHostLogsRollback', 'EnableGGHostLogsRollback');
INSERT INTO `server_config` VALUES (21, '{\"value\":360000}', 1, '1611587843813', 'GGHostLogsRollbackSingleTimeout', 'GGHostLogsRollbackSingleTimeout');
INSERT INTO `server_config` VALUES (24, '{\"value\":{\"recentTimeStamp\":\"1643399987145\",\"result\":\"\"}}', 1, '1611587843813', 'GGHostServerLogAsyncRecord', 'GGHostServerLogAsyncRecord');
INSERT INTO `server_config` VALUES (26, '{\"value\":1000}', 0, '1611587843813', 'GGHostLogsRollbackInterval', 'GGHostLogsRollbackInterval');
INSERT INTO `server_config` VALUES (29, '{\"value\":{\"xMax\":620000,\"xMin\":-904299,\"yMax\":620000,\"yMin\":-908000}}', 1, '1611587843813', 'GameMapBorderInfo', 'GameMapBorderInfo');
INSERT INTO `server_config` VALUES (31, '{\"value\":\"https://image.scum-cn.com:65500/images/getOldImg?originalPath=https://i1.fuimg.com/734277/6abda95a31875ba5.jpg\"}', 1, '1611587843813', 'GameMapImageUrl', 'GameMapImageUrl');
INSERT INTO `server_config` VALUES (77, '{\"value\":\"\"}', 1, '1611587843813', 'ServerId', 'ServerId');
INSERT INTO `server_config` VALUES (78, '{\"value\":\"0/0\"}', 1, '1611587843813', 'ServerOnlinePlayers', 'ServerOnlinePlayers');
INSERT INTO `server_config` VALUES (80, '{\"value\":\"GPORTAL\"}', 1, '1611587843813', 'GameServerType', 'GameServerType');
INSERT INTO `server_config` VALUES (82, '{\"value\":{\"recentTimeStamp\":\"\",\"result\":\"\"}}', 1, '1611587843813', 'NitradoServerLogAsyncRecord', 'NitradoServerLogAsyncRecord');
INSERT INTO `server_config` VALUES (83, '{\"value\":1000}', 1, '1611587843813', 'NitradoLogsRollbackInterval', 'NitradoLogsRollbackInterval');
INSERT INTO `server_config` VALUES (84, '{\"value\":false}', 1, '1611587843813', 'EnableNitradoLogsRollback', 'EnableNitradoLogsRollback');
INSERT INTO `server_config` VALUES (85, '{\"value\":\"\"}', 1, '1611587843813', 'NitradoAuthorizationToken', 'NitradoAuthorizationToken');
INSERT INTO `server_config` VALUES (102, '{\"value\":\"ftp\"}', 1, '1611587843813', 'GGHostFTPType', 'GGHostFTPType');
INSERT INTO `server_config` VALUES (103, '{\"value\":\"\"}', 1, '1611587843813', 'ServerIP', 'ServerIP');
INSERT INTO `server_config` VALUES (109, '{\"value\":false}', 1, '1611587843813', 'EnableGPortalLogsRollback', 'EnableGPortalLogsRollback');
INSERT INTO `server_config` VALUES (122, '{\"value\":360000}', 1, '1611587843813', 'GPortalLogsRollbackSingleTimeout', 'GPortalLogsRollbackSingleTimeout');
INSERT INTO `server_config` VALUES (133, '{\"value\":1000}', 1, '1611587843813', 'GPortalLogsRollbackInterval', 'GPortalLogsRollbackInterval');
INSERT INTO `server_config` VALUES (137, '{\"value\":{\"admin\":null,\"chat\":null,\"kill\":null,\"login\":null}}', 0, '1611587843813', 'NitradoLogsRecentFileNames', 'NitradoLogsRecentFileNames');
INSERT INTO `server_config` VALUES (144, '{\"value\":\"\"}', 1, '1611587843813', 'GPortalFTPUrl', 'GPortalFTPUrl');
INSERT INTO `server_config` VALUES (145, '{\"value\":\"\"}', 1, '1611587843813', 'GPortalFTPAccount', 'GPortalFTPAccount');
INSERT INTO `server_config` VALUES (146, '{\"value\":\"\"}', 1, '1611587843813', 'GPortalFTPPassword', 'GPortalFTPPassword');
INSERT INTO `server_config` VALUES (148, '{\"value\":\"/SaveFiles/Logs\"}', 1, '1611587843813', 'GGHostFTPPath', 'GGHostFTPPath');
INSERT INTO `server_config` VALUES (151, '{\"value\":{\"recentTimeStamp\":\"\",\"result\":\"\"}}', 0, '1611587843813', 'GPortalServerLogAsyncRecord', 'GPortalServerLogAsyncRecord');
INSERT INTO `server_config` VALUES (158, '{\"value\":\"\"}', 1, '1611587843813', 'GPortalPreservedCookies', 'GPortalPreservedCookies');
INSERT INTO `server_config` VALUES (160, '{\"value\":{\"A1\":{\"xMin\":-600000,\"xMax\":-295500,\"yMin\":-600000,\"yMax\":-294000},\"A2\":{\"xMin\":-295500,\"xMax\":10000,\"yMin\":-600000,\"yMax\":-294000},\"A3\":{\"xMin\":10000,\"xMax\":314500,\"yMin\":-600000,\"yMax\":-294000},\"A4\":{\"xMin\":314500,\"xMax\":620000,\"yMin\":-600000,\"yMax\":-294000},\"B1\":{\"xMin\":-600000,\"xMax\":-295500,\"yMin\":-294000,\"yMax\":12000},\"B2\":{\"xMin\":-295500,\"xMax\":10000,\"yMin\":-294000,\"yMax\":12000},\"B3\":{\"xMin\":10000,\"xMax\":314500,\"yMin\":-294000,\"yMax\":12000},\"B4\":{\"xMin\":314500,\"xMax\":620000,\"yMin\":-294000,\"yMax\":12000},\"C1\":{\"xMin\":-600000,\"xMax\":-295500,\"yMin\":12000,\"yMax\":318000},\"C2\":{\"xMin\":-295500,\"xMax\":10000,\"yMin\":12000,\"yMax\":318000},\"C3\":{\"xMin\":10000,\"xMax\":314500,\"yMin\":12000,\"yMax\":318000},\"C4\":{\"xMin\":314500,\"xMax\":620000,\"yMin\":12000,\"yMax\":318000},\"D1\":{\"xMin\":-600000,\"xMax\":-295500,\"yMin\":318000,\"yMax\":620000},\"D2\":{\"xMin\":-295500,\"xMax\":10000,\"yMin\":318000,\"yMax\":620000},\"D3\":{\"xMin\":10000,\"xMax\":314500,\"yMin\":318000,\"yMax\":620000},\"D4\":{\"xMin\":314500,\"xMax\":620000,\"yMin\":318000,\"yMax\":620000},\"A0\":{\"xMax\":-600000,\"xMin\":-904299,\"yMax\":-294000,\"yMin\":-600000},\"B0\":{\"xMax\":-600000,\"xMin\":-904299,\"yMax\":12000,\"yMin\":-294000},\"C0\":{\"xMax\":-600000,\"xMin\":-904299,\"yMax\":318000,\"yMin\":12000},\"D0\":{\"xMax\":-600000,\"xMin\":-904299,\"yMax\":620000,\"yMin\":318000},\"Z0\":{\"xMax\":-600000,\"xMin\":-904299,\"yMax\":-600000,\"yMin\":-908000},\"Z1\":{\"xMax\":-295500,\"xMin\":-600000,\"yMax\":-600000,\"yMin\":-908000},\"Z2\":{\"xMax\":10000,\"xMin\":-295500,\"yMax\":-600000,\"yMin\":-908000},\"Z3\":{\"xMax\":314500,\"xMin\":10000,\"yMax\":-600000,\"yMin\":-908000},\"Z4\":{\"xMax\":620000,\"xMin\":314500,\"yMax\":-600000,\"yMin\":-908000}}}', 1, '1611587843813', 'GameAreaRanges', 'GameAreaRanges');
INSERT INTO `server_config` VALUES (173, '{\"value\":false}', 1, '1611587843813', 'LockAll', 'LockAll');
COMMIT;

-- ----------------------------
-- Table structure for user_login
-- ----------------------------
DROP TABLE IF EXISTS `user_login`;
CREATE TABLE `user_login` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `sessionId` varchar(10) COLLATE utf8mb4_bin NOT NULL,
  `status` varchar(10) COLLATE utf8mb4_bin NOT NULL DEFAULT 'login',
  `scumId` varchar(50) COLLATE utf8mb4_bin NOT NULL,
  `steamId` varchar(17) COLLATE utf8mb4_bin NOT NULL,
  `loginIp` varchar(20) COLLATE utf8mb4_bin NOT NULL,
  `loginTimeStamp` varchar(13) COLLATE utf8mb4_bin DEFAULT NULL,
  `logoutTimeStamp` varchar(13) COLLATE utf8mb4_bin DEFAULT NULL,
  `otherConfig` json DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Table structure for violations_record
-- ----------------------------
DROP TABLE IF EXISTS `violations_record`;
CREATE TABLE `violations_record` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `rawContent` text COLLATE utf8mb4_bin NOT NULL,
  `createdTimeStamp` varchar(13) COLLATE utf8mb4_bin DEFAULT NULL,
  `steamId` varchar(17) COLLATE utf8mb4_bin DEFAULT NULL,
  `count` int(11) NOT NULL DEFAULT '1',
  `tag` varchar(150) COLLATE utf8mb4_bin DEFAULT NULL,
  `otherConfig` json DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin ROW_FORMAT=DYNAMIC;

SET FOREIGN_KEY_CHECKS = 1;
