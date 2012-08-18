SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;


CREATE TABLE IF NOT EXISTS `wp_cpm_comments` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `object_id` int(10) unsigned NOT NULL,
  `text` text,
  `privacy` tinyint(1) unsigned NOT NULL DEFAULT '0',
  `user_id` bigint(20) unsigned NOT NULL DEFAULT '0',
  `created` datetime DEFAULT NULL,
  `status` tinyint(1) unsigned NOT NULL DEFAULT '1',
  `type` enum('MESSAGE','TASK','TASK_LIST') DEFAULT 'MESSAGE',
  PRIMARY KEY (`id`),
  KEY `object_id` (`object_id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=85 ;

CREATE TABLE IF NOT EXISTS `wp_cpm_files` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `project_id` int(10) unsigned NOT NULL DEFAULT '0',
  `object_id` int(11) unsigned NOT NULL DEFAULT '0',
  `name` varchar(100) DEFAULT NULL,
  `path` varchar(200) DEFAULT NULL,
  `url` varchar(200) NOT NULL,
  `mime` varchar(45) DEFAULT NULL,
  `type` enum('MESSAGE','COMMENT') NOT NULL,
  `created` datetime DEFAULT NULL,
  `status` tinyint(1) unsigned NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `project_id` (`object_id`),
  KEY `project_id_2` (`project_id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=71 ;

CREATE TABLE IF NOT EXISTS `wp_cpm_invoice` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(100) DEFAULT NULL,
  `note` text NOT NULL,
  `terms` text NOT NULL,
  `project_id` int(11) unsigned NOT NULL DEFAULT '0',
  `client_id` int(11) unsigned NOT NULL DEFAULT '0',
  `gateway` varchar(50) NOT NULL,
  `total` decimal(13,2) unsigned NOT NULL DEFAULT '0.00',
  `subtotal` decimal(13,2) NOT NULL DEFAULT '0.00',
  `tax` decimal(13,2) unsigned NOT NULL DEFAULT '0.00',
  `discount` decimal(13,2) NOT NULL DEFAULT '0.00',
  `paid` decimal(13,2) unsigned NOT NULL DEFAULT '0.00',
  `due_date` datetime DEFAULT NULL,
  `status` tinyint(1) unsigned NOT NULL DEFAULT '1',
  `recurring` tinyint(1) unsigned NOT NULL DEFAULT '0',
  `recurring_time` tinyint(1) unsigned NOT NULL DEFAULT '3',
  `pay_status` enum('PAID','UNPAID','OVERDUE') DEFAULT 'UNPAID',
  `created` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `project_id` (`project_id`),
  KEY `client_id` (`client_id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=12 ;

CREATE TABLE IF NOT EXISTS `wp_cpm_invoice_item` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `invoice_id` int(10) unsigned NOT NULL,
  `title` varchar(100) DEFAULT NULL,
  `amount` float DEFAULT NULL,
  `qty` int(10) unsigned NOT NULL,
  `tax` int(10) unsigned NOT NULL,
  `text` text NOT NULL,
  `type` enum('hour','item') NOT NULL DEFAULT 'item',
  `created` datetime NOT NULL,
  `order` tinyint(1) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `invoice_id` (`invoice_id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=30 ;

CREATE TABLE IF NOT EXISTS `wp_cpm_messages` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `project_id` int(11) unsigned NOT NULL DEFAULT '0',
  `milestone_id` int(11) NOT NULL DEFAULT '0',
  `title` varchar(100) DEFAULT NULL,
  `author` int(11) unsigned DEFAULT NULL,
  `privacy` tinyint(1) unsigned DEFAULT '0',
  `message` text,
  `status` tinyint(1) unsigned NOT NULL DEFAULT '1',
  `created` datetime DEFAULT NULL,
  `reply_count` int(11) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `project_id` (`project_id`),
  KEY `milestone_id` (`milestone_id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=12 ;

CREATE TABLE IF NOT EXISTS `wp_cpm_milestone` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `project_id` int(10) unsigned NOT NULL,
  `author` int(10) unsigned NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `description` text NOT NULL,
  `due_date` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `assigned_to` int(10) unsigned NOT NULL DEFAULT '0',
  `privacy` tinyint(1) unsigned NOT NULL DEFAULT '0',
  `completed` tinyint(1) unsigned NOT NULL DEFAULT '0',
  `completed_on` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `created` datetime DEFAULT NULL,
  `status` tinyint(1) unsigned NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `project_id` (`project_id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=4 ;

CREATE TABLE IF NOT EXISTS `wp_cpm_projects` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(150) DEFAULT NULL,
  `description` text,
  `author` bigint(20) unsigned NOT NULL DEFAULT '0',
  `started` datetime DEFAULT NULL,
  `ends` datetime DEFAULT NULL,
  `client` bigint(20) unsigned DEFAULT NULL,
  `coworker` varchar(100) NOT NULL,
  `budget` decimal(13,2) DEFAULT '0.00',
  `created` datetime DEFAULT NULL,
  `updated` datetime DEFAULT NULL,
  `status` tinyint(1) unsigned NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `created_UNIQUE` (`created`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=5 ;

CREATE TABLE IF NOT EXISTS `wp_cpm_tasks` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `list_id` int(11) unsigned DEFAULT NULL,
  `text` text,
  `author` int(11) unsigned DEFAULT NULL,
  `assigned_to` int(11) unsigned DEFAULT '0',
  `due_date` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `completed_date` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `complete` tinyint(1) unsigned NOT NULL DEFAULT '0',
  `created` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `order` tinyint(1) unsigned NOT NULL DEFAULT '0',
  `status` tinyint(1) unsigned NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `list_id` (`list_id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=12 ;

CREATE TABLE IF NOT EXISTS `wp_cpm_task_list` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `milestone_id` int(11) unsigned NOT NULL DEFAULT '0',
  `project_id` int(11) unsigned NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `description` text,
  `author` int(11) unsigned NOT NULL DEFAULT '0',
  `due_date` datetime DEFAULT NULL,
  `privacy` tinyint(1) unsigned NOT NULL,
  `priority` int(3) unsigned NOT NULL DEFAULT '0',
  `completed` datetime DEFAULT NULL,
  `order` tinyint(1) unsigned NOT NULL,
  `created` datetime DEFAULT NULL,
  `updated` datetime DEFAULT NULL,
  `status` tinyint(1) unsigned NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `milestone_id` (`milestone_id`),
  KEY `project_id` (`project_id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=4 ;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
