CREATE DATABASE  IF NOT EXISTS `infopower_pt` /*!40100 DEFAULT CHARACTER SET latin1 */;
USE `infopower_pt`;
-- MySQL dump 10.13  Distrib 5.7.17, for Win64 (x86_64)
--
-- Host: localhost    Database: infopower_pt
-- ------------------------------------------------------
-- Server version	5.7.22-log

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `alunos`
--

DROP TABLE IF EXISTS `alunos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `alunos` (
  `codigo` int(11) NOT NULL,
  `nome` varchar(100) NOT NULL,
  `curso` varchar(100) NOT NULL,
  PRIMARY KEY (`codigo`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `alunos`
--

LOCK TABLES `alunos` WRITE;
/*!40000 ALTER TABLE `alunos` DISABLE KEYS */;
INSERT INTO `alunos` VALUES (170257007,'Emanuel','MES'),(170257008,'Susana','MES');
/*!40000 ALTER TABLE `alunos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `docentes`
--

DROP TABLE IF EXISTS `docentes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `docentes` (
  `codigo` int(11) NOT NULL,
  `nome` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`codigo`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `docentes`
--

LOCK TABLES `docentes` WRITE;
/*!40000 ALTER TABLE `docentes` DISABLE KEYS */;
INSERT INTO `docentes` VALUES (123,'Gustavo Santos');
/*!40000 ALTER TABLE `docentes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `inscricoes`
--

DROP TABLE IF EXISTS `inscricoes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `inscricoes` (
  `idinscricao` int(11) NOT NULL AUTO_INCREMENT,
  `alunos_codigo` int(11) NOT NULL,
  `data` date NOT NULL,
  `provas_idprova` int(11) NOT NULL,
  `presenca` tinyint(4) NOT NULL DEFAULT '0',
  PRIMARY KEY (`idinscricao`,`provas_idprova`),
  KEY `fk_inscricoes_alunos1_idx` (`alunos_codigo`),
  KEY `fk_inscricoes_provas1_idx` (`provas_idprova`),
  CONSTRAINT `fk_inscricoes_alunos1` FOREIGN KEY (`alunos_codigo`) REFERENCES `alunos` (`codigo`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_inscricoes_provas1` FOREIGN KEY (`provas_idprova`) REFERENCES `provas` (`idprova`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inscricoes`
--

LOCK TABLES `inscricoes` WRITE;
/*!40000 ALTER TABLE `inscricoes` DISABLE KEYS */;
INSERT INTO `inscricoes` VALUES (7,170257008,'2018-07-07',4,0);
/*!40000 ALTER TABLE `inscricoes` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `incricoesVerificarData`
BEFORE INSERT
	ON `inscricoes` FOR EACH ROW
BEGIN
-- variable
	DECLARE dataProva DATETIME;    
-- code	
    SELECT data INTO dataProva FROM provas WHERE idprova = NEW.provas_idprova LIMIT 1;

	IF (dataProva <= SYSDATE()) THEN
		-- To signal a generic SQLSTATE value, use '45000', which means "unhandled user-defined exception."
        SET @message = CONCAT('Já não se pode inscrever na prova datada a: ',dataProva);
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = @message;
    END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `provas`
--

DROP TABLE IF EXISTS `provas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `provas` (
  `idprova` int(11) NOT NULL AUTO_INCREMENT,
  `tipo` varchar(20) NOT NULL DEFAULT 'Teste',
  `data` datetime NOT NULL,
  `sala` varchar(45) DEFAULT NULL,
  `lotacaoMaxima` int(11) DEFAULT NULL,
  `docentes_codigo` int(11) NOT NULL,
  `estado` tinyint(4) NOT NULL DEFAULT '1',
  `ucs_iduc` int(11) NOT NULL,
  PRIMARY KEY (`idprova`),
  KEY `fk_provas_docentes1_idx` (`docentes_codigo`),
  KEY `fk_provas_ucs1_idx` (`ucs_iduc`),
  CONSTRAINT `fk_provas_docentes1` FOREIGN KEY (`docentes_codigo`) REFERENCES `docentes` (`codigo`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_provas_ucs1` FOREIGN KEY (`ucs_iduc`) REFERENCES `ucs` (`iduc`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `provas`
--

LOCK TABLES `provas` WRITE;
/*!40000 ALTER TABLE `provas` DISABLE KEYS */;
INSERT INTO `provas` VALUES (4,'Teste','2018-07-17 15:00:00','F200',30,123,1,1);
/*!40000 ALTER TABLE `provas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ucs`
--

DROP TABLE IF EXISTS `ucs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ucs` (
  `iduc` int(11) NOT NULL AUTO_INCREMENT,
  `unidadeCurricular` varchar(100) NOT NULL,
  `sigla` varchar(6) DEFAULT NULL,
  PRIMARY KEY (`iduc`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ucs`
--

LOCK TABLES `ucs` WRITE;
/*!40000 ALTER TABLE `ucs` DISABLE KEYS */;
INSERT INTO `ucs` VALUES (1,'Segurança de informação e de Software',NULL),(2,'Programação Avançada para a Internet',NULL),(3,'Análise de Dados',NULL),(4,'Qualidade de Software',NULL),(5,'Aplicações Móveis e Serviços',NULL),(6,'Reutilização de software',NULL),(7,'Visualização de Informação',NULL);
/*!40000 ALTER TABLE `ucs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `utilizadores`
--

DROP TABLE IF EXISTS `utilizadores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `utilizadores` (
  `idutilizador` int(11) NOT NULL AUTO_INCREMENT,
  `estado` tinyint(4) NOT NULL DEFAULT '1',
  `codigo` int(11) NOT NULL,
  `email` varchar(45) DEFAULT NULL,
  `password` varchar(100) NOT NULL,
  `permisao` varchar(2) NOT NULL DEFAULT 'A',
  PRIMARY KEY (`idutilizador`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `utilizadores`
--

LOCK TABLES `utilizadores` WRITE;
/*!40000 ALTER TABLE `utilizadores` DISABLE KEYS */;
INSERT INTO `utilizadores` VALUES (1,1,170257007,NULL,'$2a$06$Gc6/Gbz6oVax1ZNa4udXC.j8wsFTrfJvw6/8M/bCxhquW/M5aA46e','A'),(2,1,123,NULL,'$2a$06$Gc6/Gbz6oVax1ZNa4udXC.j8wsFTrfJvw6/8M/bCxhquW/M5aA46e','D'),(3,1,170257008,'phorbs@gmail.com','$2a$06$fS5zW1kO6nTSCeaQA4mpnuHi3AYSl3yYiNtRWqsUKLHa9w2hXoZ3y','A');
/*!40000 ALTER TABLE `utilizadores` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2018-07-07 16:57:03
