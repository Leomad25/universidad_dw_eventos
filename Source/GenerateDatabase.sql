-- -----------------------------------------------------
-- Public connection
-- -----------------------------------------------------
DROP USER IF EXISTS 'unidmeventos.pa'@'localhost';
CREATE USER 'unidmeventos.pa'@'localhost' IDENTIFIED BY 'public_access';

-- -----------------------------------------------------
-- Schema uni_dw_eventos
-- -----------------------------------------------------
DROP SCHEMA IF EXISTS `uni_dw_eventos`;
CREATE SCHEMA `uni_dw_eventos` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci ;
GRANT execute ON `uni_dw_eventos`.* TO 'unidmeventos.pa'@'localhost';

-- -----------------------------------------------------
-- Table `uni_dw_eventos`.`usuarios`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `uni_dw_eventos`.`usuarios` (
  `idusuario` INT AUTO_INCREMENT,
  `documento` VARCHAR(15) NOT NULL,
  `nombre` VARCHAR(100) NOT NULL,
  `alias` VARCHAR(45) NOT NULL,
  `contrasena` TEXT NOT NULL,
  `activo` BOOL DEFAULT TRUE,
  PRIMARY KEY (`idusuario`),
  UNIQUE INDEX `documento_UNIQUE` (`documento` ASC) VISIBLE,
  UNIQUE INDEX `alias_UNIQUE` (`alias` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `uni_dw_eventos`.`eventos`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `uni_dw_eventos`.`eventos` (
  `idevento` INT AUTO_INCREMENT,
  `nombre` VARCHAR(255) NOT NULL,
  `descripcion` MEDIUMTEXT NOT NULL,
  `encargado` INT NOT NULL,
  `fecha_inicio` DATE NOT NULL,
  `fecha_fin` DATE NOT NULL,
  `tiempo_inicio` TIME NOT NULL,
  `tiempo_fin` TIME NOT NULL,
  `lugar` TEXT NULL,
  `estado` INT(1) DEFAULT 1,
  PRIMARY KEY (`idevento`),
  UNIQUE INDEX `nombre_UNIQUE` (`nombre` ASC) VISIBLE,
  INDEX `fk_eventos_usuarios_idx` (`encargado` ASC) VISIBLE,
  CONSTRAINT `fk_eventos_usuarios`
    FOREIGN KEY (`encargado`)
    REFERENCES `uni_dw_eventos`.`usuarios` (`idusuario`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `uni_dw_eventos`.`asistentes`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `uni_dw_eventos`.`asistentes` (
  `idusuario` INT NOT NULL,
  `idevento` INT NOT NULL,
  INDEX `fk_asistentes_usuarios_idx` (`idusuario` ASC) VISIBLE,
  INDEX `fk_asistentes_eventos_idx` (`idevento` ASC) VISIBLE,
  CONSTRAINT `fk_asistentes_usuarios`
    FOREIGN KEY (`idusuario`)
    REFERENCES `uni_dw_eventos`.`usuarios` (`idusuario`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_asistentes_eventos`
    FOREIGN KEY (`idevento`)
    REFERENCES `uni_dw_eventos`.`eventos` (`idevento`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `uni_dw_eventos`.`roles`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `uni_dw_eventos`.`roles` (
  `idrole` INT AUTO_INCREMENT,
  `etiqueta` VARCHAR(45) NOT NULL,
  `peso` INT(1) NOT NULL,
  PRIMARY KEY (`idrole`),
  UNIQUE INDEX `peso_UNIQUE` (`peso` ASC) VISIBLE,
  UNIQUE INDEX `etiqueta_UNIQUE` (`etiqueta` ASC) VISIBLE)
ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `uni_dw_eventos`.`roles_usuarios`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `uni_dw_eventos`.`roles_usuarios` (
  `id_role_usuario` INT AUTO_INCREMENT,
  `idrole` INT NOT NULL,
  `idusuario` INT NOT NULL,
  `asigned_by` INT NULL,
  PRIMARY KEY (`id_role_usuario`),
  INDEX `fk_(roles_usuarios)_usuarios_idx` (`idusuario` ASC, `asigned_by` ASC) VISIBLE,
  INDEX `fk_(roles_usuarios)_roles_idx` (`idrole` ASC) VISIBLE,
  CONSTRAINT `fk_(roles_usuarios)_roles`
    FOREIGN KEY (`idrole`)
    REFERENCES `uni_dw_eventos`.`roles` (`idrole`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_(roles_usuarios)_usuarios`
    FOREIGN KEY (`idusuario`)
    REFERENCES `uni_dw_eventos`.`usuarios` (`idusuario`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_(roles_usuarios)_usuarios_2`
    FOREIGN KEY (`asigned_by`)
    REFERENCES `uni_dw_eventos`.`usuarios` (`idusuario`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

-- -----------------------------------------------------
-- Store procedure `uni_dw_eventos`.`usuarios`
-- -----------------------------------------------------
DELIMITER $$
CREATE PROCEDURE `uni_dw_eventos`.`usuarios.create`(
  IN document_param VARCHAR(15),
  IN name_param VARCHAR(100),
  IN nick_param VARCHAR(45),
  IN pass_param TEXT)
BEGIN
	INSERT INTO `uni_dw_eventos`.`usuarios` (`documento`, `nombre`, `alias`, `contrasena`)
	  VALUES (
        UPPER(document_param),
        UPPER(name_param),
        UPPER(nick_param),
        UPPER(pass_param));
	SELECT `idusuario`
      FROM `uni_dw_eventos`.`usuarios`
      WHERE (`documento` = UPPER(document_param));
END $$
CREATE PROCEDURE `uni_dw_eventos`.`usuarios.getById`(
  IN id_param INT)
BEGIN
	SELECT `idusuario`, `documento`, `nombre`, `alias`, `contrasena`, `activo`
      FROM `uni_dw_eventos`.`usuarios`
      WHERE (`idusuario` = id_param);
END $$
CREATE PROCEDURE `uni_dw_eventos`.`usuarios.getByNick`(
  IN nick_param VARCHAR(45))
BEGIN
	SELECT `idusuario`, `documento`, `nombre`, `alias`, `contrasena`, `activo`
      FROM `uni_dw_eventos`.`usuarios`
      WHERE (`alias` = UPPER(nick_param));
END $$
CREATE PROCEDURE `uni_dw_eventos`.`usuarios.setAllowed`(
  IN id_param INT,
  IN allowed_param BOOL)
BEGIN
	UPDATE `uni_dw_eventos`.`usuarios`
      SET `activo` = allowed_param
      WHERE (`idusuario` = id_param);
	SELECT `idusuario`, `documento`, `nombre`, `alias`, `contrasena`, `activo`
      FROM `uni_dw_eventos`.`usuarios`
      WHERE (`idusuario` = id_param);
END $$
DELIMITER ;

-- -----------------------------------------------------
-- Store procedure `uni_dw_eventos`.`eventos`
-- -----------------------------------------------------
DELIMITER $$
CREATE PROCEDURE `uni_dw_eventos`.`eventos.create`(
  IN name_param VARCHAR(255),
  IN description_param MEDIUMTEXT,
  IN owener_param INT,
  IN date_init_param DATE,
  IN date_end_param DATE,
  IN time_init_param TIME,
  IN time_end_param TIME)
BEGIN
	INSERT INTO `uni_dw_eventos`.`eventos` (`nombre`, `descripcion`, `encargado`, `fecha_inicio`, `fecha_fin`, `tiempo_inicio`, `tiempo_fin`)
    VALUES (
      UPPER(name_param),
      UPPER(description_param),
      owener_param,
      date_init_param,
      date_end_param,
      time_init_param,
      time_end_param);
	SELECT `idevento`
      FROM `uni_dw_eventos`.`eventos`
      WHERE (`nombre` = UPPER(name_param));
END $$
CREATE PROCEDURE `uni_dw_eventos`.`eventos.getById`(
  IN id_param INT)
BEGIN
	SELECT `idevento`, `nombre`, `descripcion`, `encargado`, `fecha_inicio`, `fecha_fin`, `tiempo_inicio`, `tiempo_fin`, `estado`
      FROM `uni_dw_eventos`.`eventos`
      WHERE (`id_param` = id_param);
END $$
CREATE PROCEDURE `uni_dw_eventos`.`eventos.getByName`(
  IN name_param VARCHAR(255))
BEGIN
	SELECT `idevento`, `nombre`, `descripcion`, `encargado`, `fecha_inicio`, `fecha_fin`, `tiempo_inicio`, `tiempo_fin`, `estado`
      FROM `uni_dw_eventos`.`eventos`
      WHERE (`nombre` = UPPER(name_param));
END $$
CREATE PROCEDURE `uni_dw_eventos`.`eventos.getByDate`(
  IN date_init_param DATE,
  IN date_end_param DATE)
BEGIN
	SELECT `idevento`, `nombre`, `descripcion`, `encargado`, `fecha_inicio`, `fecha_fin`, `tiempo_inicio`, `tiempo_fin`, `estado`
      FROM `uni_dw_eventos`.`eventos`
      WHERE (`fecha` BETWEEN date_init_param AND date_end_param);
END $$
CREATE PROCEDURE `uni_dw_eventos`.`eventos.setStatus`(
  IN id_param INT,
  IN status_param INT(1))
BEGIN
	UPDATE `uni_dw_eventos`.`eventos`
      SET `estado` = status_param
      WHERE (`idevento` = id_param);
END $$
DELIMITER ;

-- -----------------------------------------------------
-- Store procedure `uni_dw_eventos`.`asistentes`
-- -----------------------------------------------------
DELIMITER $$
CREATE PROCEDURE `uni_dw_eventos`.`asistentes.create`(
  IN event_param INT,
  IN user_param INT)
BEGIN
	INSERT INTO `uni_dw_eventos`.`asistentes` (
      `idusuario`,
      `idevento`)
    VALUES (user_param, event_param);
    SELECT `idusuario`, `idevento`
      FROM `uni_dw_eventos`.`asistentes`
      WHERE (
        (`idusuario` = user_param)
        AND
        (`idevento` = event_param));
END $$
CREATE PROCEDURE `uni_dw_eventos`.`asistentes.getByEvent`(
  IN event_param INT)
BEGIN
	SELECT `idusuario`, `idevento`
      FROM `uni_dw_eventos`.`asistentes`
      WHERE (`idevento` = event_param);
END $$
DELIMITER ;

-- -----------------------------------------------------
-- Store procedure `uni_dw_eventos`.`roles`
-- -----------------------------------------------------
DELIMITER $$
CREATE PROCEDURE `uni_dw_eventos`.`roles.create`(
  IN tag_param VARCHAR(45),
  IN weight_param INT(1))
BEGIN
	INSERT INTO `uni_dw_eventos`.`roles` (
      `etiqueta`,
      `peso`)
    VALUES (
      UPPER(tag_param),
      weight_param);
	SELECT `idrole`
      FROM `uni_dw_eventos`.`roles`
      WHERE (`etiqueta` = UPPER(tag_param));
END $$
CREATE PROCEDURE `uni_dw_eventos`.`roles.getAll`()
BEGIN
	SELECT `idrole`, `etiqueta`, `peso`
      FROM `uni_dw_eventos`.`roles`;
END $$
CREATE PROCEDURE `uni_dw_eventos`.`roles.getById`(
  IN id_param INT)
BEGIN
	SELECT `idrole`, `etiqueta`, `peso`
      FROM `uni_dw_eventos`.`roles`
      WHERE (`idrole` = id_param);
END $$
CREATE PROCEDURE `uni_dw_eventos`.`roles.getByTag`(
  IN tag_param VARCHAR(45))
BEGIN
	SELECT `idrole`, `etiqueta`, `peso`
      FROM `uni_dw_eventos`.`roles`
      WHERE (`etiqueta` = UPPER(tag_param));
END $$
DELIMITER ;

-- -----------------------------------------------------
-- Store procedure `uni_dw_eventos`.`roles_usuarios`
-- -----------------------------------------------------
DELIMITER $$
CREATE PROCEDURE `uni_dw_eventos`.`roles_usuarios.create`(
  IN user_param INT,
  IN role_param INT)
BEGIN
	INSERT INTO `uni_dw_eventos`.`roles_usuarios` (
      `idrole`, `idusuario`)
    VALUES (role_param, user_param);
    SELECT `id_role_usuario`
      FROM `uni_dw_eventos`.`roles_usuarios`
      WHERE ((`idrole` = role_param) AND (`idusuario` = user_param));
END $$
CREATE PROCEDURE `uni_dw_eventos`.`roles_usuarios.createBy`(
  IN user_param INT,
  IN role_param INT,
  IN asing_param INT)
BEGIN
	INSERT INTO `uni_dw_eventos`.`roles_usuarios` (
      `idrole`, `idusuario`, `asigned_by`)
    VALUES (role_param, user_param, asing_param);
    SELECT `id_role_usuario`
      FROM `uni_dw_eventos`.`roles_usuarios`
      WHERE (
        (`idrole` = role_param) AND
        (`idusuario` = user_param) AND
        (`asigned_by` = asing_param));
END $$
CREATE PROCEDURE `uni_dw_eventos`.`roles_usuarios.getByUser`(
  IN user_param INT)
BEGIN
    SELECT `id_role_usuario`, `idrole`, `idusuario`, `asigned_by`
      FROM `uni_dw_eventos`.`roles_usuarios`
      WHERE (`idusuario` = user_param);
END $$
DELIMITER ;

-- -----------------------------------------------------
-- Load basic data
-- -----------------------------------------------------
CALL `uni_dw_eventos`.`roles.create`('administrador', 9);
CALL `uni_dw_eventos`.`roles.create`('creador', 5);
CALL `uni_dw_eventos`.`roles.create`('asistente', 1);

CALL `uni_dw_eventos`.`usuarios.create`('0000000000', 'admin', 'admin', '03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4');
CALL `uni_dw_eventos`.`roles_usuarios.create`(1, 1);

/*
-- -----------------------------------------------------
-- Test data
-- -----------------------------------------------------
-- Users
CALL `uni_dw_eventos`.`usuarios.create`('1234567890', 'primer usuario', 'user1', '1234');
CALL `uni_dw_eventos`.`usuarios.create`('2345678901', 'segundo usuario', 'user2', '1234');
CALL `uni_dw_eventos`.`usuarios.create`('3456789012', 'tercero usuario', 'user3', '1234');
CALL `uni_dw_eventos`.`usuarios.create`('4567890123', 'cuarto usuario', 'user4', '1234');
CALL `uni_dw_eventos`.`usuarios.create`('5678901234', 'quinto usuario', 'user5', '1234');
-- Role
CALL `uni_dw_eventos`.`roles_usuarios.create`(1, 1);
CALL `uni_dw_eventos`.`roles_usuarios.create`(2, 2);
CALL `uni_dw_eventos`.`roles_usuarios.createBy`(3, 3, 1);
CALL `uni_dw_eventos`.`roles_usuarios.createBy`(4, 3, 1);
CALL `uni_dw_eventos`.`roles_usuarios.createBy`(5, 3, 1);
-- Events
CALL `uni_dw_eventos`.`eventos.create`('evento1', 'evento1', 1, '2023-09-25', '2023-09-25', '13:00:00', '14:00:00');
CALL `uni_dw_eventos`.`eventos.create`('evento2', 'evento2', 2, '2023-09-28', '2023-09-29', '12:00:00', '12:00:00');
-- Assistants
CALL `uni_dw_eventos`.`asistentes.create`(1, 3);
CALL `uni_dw_eventos`.`asistentes.create`(2, 3);
CALL `uni_dw_eventos`.`asistentes.create`(1, 4);
CALL `uni_dw_eventos`.`asistentes.create`(2, 4);
CALL `uni_dw_eventos`.`asistentes.create`(1, 5);
*/