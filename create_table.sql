CREATE TABLE `users` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(20) COLLATE utf8_bin NOT NULL DEFAULT '',
  `is_seed` tinyint(1) NOT NULL DEFAULT '0',
  `is_email_fetched` tinyint(1) NOT NULL DEFAULT '0',
  `is_list_fetched` tinyint(1) NOT NULL DEFAULT '0',
  `email` varchar(30) COLLATE utf8_bin DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;