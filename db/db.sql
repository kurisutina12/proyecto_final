CREATE TABLE `users` (
 `id` varchar(255) NOT NULL,
 `username` varchar(255) NOT NULL,
 `password` varchar(255) NOT NULL,
 `registered` datetime NOT NULL,
 `last_login` datetime,
 PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1