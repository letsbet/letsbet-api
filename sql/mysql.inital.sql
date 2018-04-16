DROP TABLE IF EXISTS `letsbet`.`fx_rates`;
CREATE TABLE  `letsbet`.`fx_rates` (
  `symbol` varchar(6) COLLATE utf8_bin NOT NULL,
  `value` decimal(10,6) NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `create_time` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00'
) ENGINE=ROCKSDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;