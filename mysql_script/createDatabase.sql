-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

-- -----------------------------------------------------
-- Schema infopower_pt
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema infopower_pt
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `infopower_pt` DEFAULT CHARACTER SET utf8 ;
USE `infopower_pt` ;

-- -----------------------------------------------------
-- Table `infopower_pt`.`utilizadores`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `infopower_pt`.`utilizadores` ;

CREATE TABLE IF NOT EXISTS `infopower_pt`.`utilizadores` (
  `idutilizador` INT NOT NULL AUTO_INCREMENT,
  `estado` TINYINT NOT NULL DEFAULT 1,
  `codigo` INT NOT NULL,
  `email` VARCHAR(45) NULL,
  `password` VARCHAR(100) NOT NULL,
  `permisao` VARCHAR(2) NOT NULL DEFAULT 'A',
  PRIMARY KEY (`idutilizador`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `infopower_pt`.`alunos`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `infopower_pt`.`alunos` ;

CREATE TABLE IF NOT EXISTS `infopower_pt`.`alunos` (
  `codigo` INT NOT NULL,
  `nome` VARCHAR(100) NOT NULL,
  `curso` VARCHAR(100) NOT NULL,
  PRIMARY KEY (`codigo`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `infopower_pt`.`docentes`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `infopower_pt`.`docentes` ;

CREATE TABLE IF NOT EXISTS `infopower_pt`.`docentes` (
  `codigo` INT NOT NULL,
  `nome` VARCHAR(100) NULL,
  PRIMARY KEY (`codigo`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `infopower_pt`.`ucs`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `infopower_pt`.`ucs` ;

CREATE TABLE IF NOT EXISTS `infopower_pt`.`ucs` (
  `iduc` INT NOT NULL AUTO_INCREMENT,
  `unidadeCurricular` VARCHAR(100) NOT NULL,
  PRIMARY KEY (`iduc`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `infopower_pt`.`provas`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `infopower_pt`.`provas` ;

CREATE TABLE IF NOT EXISTS `infopower_pt`.`provas` (
  `idprova` INT NOT NULL AUTO_INCREMENT,
  `tipo` VARCHAR(20) NOT NULL DEFAULT 'Teste',
  `data` DATETIME NOT NULL,
  `sala` VARCHAR(45) NULL,
  `lotacaoMaxima` INT NULL,
  `docentes_codigo` INT NOT NULL,
  `estado` TINYINT NOT NULL DEFAULT 1,
  `ucs_iduc` INT NOT NULL,
  PRIMARY KEY (`idprova`),
  INDEX `fk_provas_docentes1_idx` (`docentes_codigo` ASC),
  INDEX `fk_provas_ucs1_idx` (`ucs_iduc` ASC),
  CONSTRAINT `fk_provas_docentes1`
    FOREIGN KEY (`docentes_codigo`)
    REFERENCES `infopower_pt`.`docentes` (`codigo`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_provas_ucs1`
    FOREIGN KEY (`ucs_iduc`)
    REFERENCES `infopower_pt`.`ucs` (`iduc`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `infopower_pt`.`inscricoes`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `infopower_pt`.`inscricoes` ;

CREATE TABLE IF NOT EXISTS `infopower_pt`.`inscricoes` (
  `idinscricao` INT NOT NULL AUTO_INCREMENT,
  `alunos_codigo` INT NOT NULL,
  `data` DATE NOT NULL,
  PRIMARY KEY (`idinscricao`),
  INDEX `fk_inscricoes_alunos1_idx` (`alunos_codigo` ASC),
  CONSTRAINT `fk_inscricoes_alunos1`
    FOREIGN KEY (`alunos_codigo`)
    REFERENCES `infopower_pt`.`alunos` (`codigo`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `infopower_pt`.`codigosbarras`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `infopower_pt`.`codigosbarras` ;

CREATE TABLE IF NOT EXISTS `infopower_pt`.`codigosbarras` (
  `idcodigobarra` INT NOT NULL AUTO_INCREMENT,
  `numero` INT NULL,
  `provas_idprova` INT NOT NULL,
  `inscricoes_idinscricao` INT NOT NULL,
  PRIMARY KEY (`idcodigobarra`, `provas_idprova`, `inscricoes_idinscricao`),
  INDEX `fk_codigosbarras_provas1_idx` (`provas_idprova` ASC),
  INDEX `fk_codigosbarras_inscricoes1_idx` (`inscricoes_idinscricao` ASC),
  CONSTRAINT `fk_codigosbarras_provas1`
    FOREIGN KEY (`provas_idprova`)
    REFERENCES `infopower_pt`.`provas` (`idprova`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_codigosbarras_inscricoes1`
    FOREIGN KEY (`inscricoes_idinscricao`)
    REFERENCES `infopower_pt`.`inscricoes` (`idinscricao`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
