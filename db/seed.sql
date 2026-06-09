-- Seed: 48 lotes del loteo Tres Raíces (sectores AP1-AP7)
-- Ejecutar con: docker exec -i inmo_postgres psql -U inmo_admin -d inmobiliaria_db < db/seed.sql

TRUNCATE TABLE Propiedad RESTART IDENTITY CASCADE;

INSERT INTO Propiedad (titulo, descripcion, precio, estado, superficie, ubicacion, manzana, lote_num, points, inmobiliaria_id)
VALUES
-- Sector AP1 (6 lotes)
('Lote 1 - Sector AP1', 'Lote esquinero frente a calle principal del sector AP1.', 1, 'Disponible', '600.86', '-31.4167,-64.1833', 'AP1', '1', NULL, 1),
('Lote 2 - Sector AP1', 'Lote con acceso directo a servicios.', 1, 'Disponible', '602.95', '-31.4168,-64.1834', 'AP1', '2', NULL, 1),
('Lote 3 - Sector AP1', 'Terreno de forma regular con buena orientación.', 1, 'Disponible', '603.01', '-31.4169,-64.1835', 'AP1', '3', NULL, 1),
('Lote 4 - Sector AP1', 'Lote tranquilo al fondo del pasaje.', 1, 'Disponible', '603.01', '-31.4170,-64.1836', 'AP1', '4', NULL, 1),
('Lote 5 - Sector AP1', 'Lote cercano a espacios verdes.', 1, 'Disponible', '602.95', '-31.4171,-64.1837', 'AP1', '5', NULL, 1),
('Lote 6 - Sector AP1', 'Excelente relación superficie-precio.', 1, 'Disponible', '589.20', '-31.4172,-64.1838', 'AP1', '6', NULL, 1),

-- Sector AP2 (8 lotes)
('Lote 1 - Sector AP2', 'Lote con frente a calle principal.', 1, 'Disponible', '600.00', '-31.4173,-64.1839', 'AP2', '1', NULL, 1),
('Lote 2 - Sector AP2', 'Terreno amplio y bien proporcionado.', 1, 'Disponible', '602.51', '-31.4174,-64.1840', 'AP2', '2', NULL, 1),
('Lote 3 - Sector AP2', 'Lote de gran superficie.', 1, 'Disponible', '607.39', '-31.4175,-64.1841', 'AP2', '3', NULL, 1),
('Lote 4 - Sector AP2', 'Posibilidad de construcciÃ³n en dos plantas.', 1, 'Disponible', '612.58', '-31.4176,-64.1842', 'AP2', '4', NULL, 1),
('Lote 5 - Sector AP2', 'Lote con buena iluminaciÃ³n natural.', 1, 'Disponible', '612.58', '-31.4177,-64.1843', 'AP2', '5', NULL, 1),
('Lote 6 - Sector AP2', 'Lote esquinero con formato irregular.', 1, 'Disponible', '604.71', '-31.4178,-64.1844', 'AP2', '6', NULL, 1),
('Lote 7 - Sector AP2', 'Terreno compacto y funcional.', 1, 'Disponible', '602.51', '-31.4179,-64.1845', 'AP2', '7', NULL, 1),
('Lote 8 - Sector AP2', 'Lote con frente a calle secundaria.', 1, 'Disponible', '606.15', '-31.4180,-64.1846', 'AP2', '8', NULL, 1),

-- Sector AP3 (8 lotes)
('Lote 1 - Sector AP3', 'Lote esquinero con frente a calle principal del sector.', 1, 'Disponible', '653.32', '-31.4181,-64.1847', 'AP3', '1', NULL, 1),
('Lote 2 - Sector AP3', 'Terreno plano con servicios cercanos.', 1, 'Disponible', '649.13', '-31.4182,-64.1848', 'AP3', '2', NULL, 1),
('Lote 3 - Sector AP3', 'Excelente ubicaciÃ³n dentro del barrio.', 1, 'Disponible', '644.95', '-31.4183,-64.1849', 'AP3', '3', NULL, 1),
('Lote 4 - Sector AP3', 'Lote de gran superficie con buena orientaciÃ³n.', 1, 'Disponible', '640.76', '-31.4184,-64.1850', 'AP3', '4', NULL, 1),
('Lote 5 - Sector AP3', 'Terreno listo para construir.', 1, 'Disponible', '640.76', '-31.4185,-64.1851', 'AP3', '5', NULL, 1),
('Lote 6 - Sector AP3', 'Lote con potencial de plusvalÃ­a.', 1, 'Disponible', '644.95', '-31.4186,-64.1852', 'AP3', '6', NULL, 1),
('Lote 7 - Sector AP3', 'Cerca de futuros servicios comerciales.', 1, 'Disponible', '649.13', '-31.4187,-64.1853', 'AP3', '7', NULL, 1),
('Lote 8 - Sector AP3', 'Lote premium con frente a calle principal.', 1, 'Disponible', '653.32', '-31.4188,-64.1854', 'AP3', '8', NULL, 1),

-- Sector AP4 (8 lotes)
('Lote 1 - Sector AP4', 'Lote esquinero con acceso rÃ¡pido.', 1, 'Disponible', '632.94', '-31.4189,-64.1855', 'AP4', '1', NULL, 1),
('Lote 2 - Sector AP4', 'Terreno de forma regular.', 1, 'Disponible', '628.76', '-31.4190,-64.1856', 'AP4', '2', NULL, 1),
('Lote 3 - Sector AP4', 'Buena ubicaciÃ³n dentro del barrio.', 1, 'Disponible', '624.57', '-31.4191,-64.1857', 'AP4', '3', NULL, 1),
('Lote 4 - Sector AP4', 'Lote de superficie equilibrada.', 1, 'Disponible', '620.38', '-31.4192,-64.1858', 'AP4', '4', NULL, 1),
('Lote 5 - Sector AP4', 'Terreno con buena tierra y drenaje.', 1, 'Disponible', '620.38', '-31.4193,-64.1859', 'AP4', '5', NULL, 1),
('Lote 6 - Sector AP4', 'Cerca de espacios verdes.', 1, 'Disponible', '624.57', '-31.4194,-64.1860', 'AP4', '6', NULL, 1),
('Lote 7 - Sector AP4', 'Lote premium del sector.', 1, 'Disponible', '628.76', '-31.4195,-64.1861', 'AP4', '7', NULL, 1),
('Lote 8 - Sector AP4', 'Frente a plazoleta proyectada.', 1, 'Disponible', '632.94', '-31.4196,-64.1862', 'AP4', '8', NULL, 1),

-- Sector AP5 (8 lotes)
('Lote 1 - Sector AP5', 'Lote con frente a calle interna.', 1, 'Disponible', '612.56', '-31.4197,-64.1863', 'AP5', '1', NULL, 1),
('Lote 2 - Sector AP5', 'Terreno accesible y bien ubicado.', 1, 'Disponible', '608.38', '-31.4198,-64.1864', 'AP5', '2', NULL, 1),
('Lote 3 - Sector AP5', 'Lote ideal para casa familiar.', 1, 'Disponible', '604.19', '-31.4199,-64.1865', 'AP5', '3', NULL, 1),
('Lote 4 - Sector AP5', 'Excelente relaciÃ³n calidad-precio.', 1, 'Disponible', '600.00', '-31.4200,-64.1866', 'AP5', '4', NULL, 1),
('Lote 5 - Sector AP5', 'Lote con servicios a estrenar.', 1, 'Disponible', '600.00', '-31.4201,-64.1867', 'AP5', '5', NULL, 1),
('Lote 6 - Sector AP5', 'Terreno con inclinaciÃ³n suave.', 1, 'Disponible', '604.19', '-31.4202,-64.1868', 'AP5', '6', NULL, 1),
('Lote 7 - Sector AP5', 'Lote amplio con buena orientaciÃ³n.', 1, 'Disponible', '608.38', '-31.4203,-64.1869', 'AP5', '7', NULL, 1),
('Lote 8 - Sector AP5', 'Ãšltimo lote disponible de la fila.', 1, 'Disponible', '612.56', '-31.4204,-64.1870', 'AP5', '8', NULL, 1),

-- Sector AP6 (10 lotes)
('Lote 1 - Sector AP6', 'Lote de gran tamaÃ±o, ideal para proyecto familiar.', 1, 'Disponible', '995.63', '-31.4205,-64.1871', 'AP6', '1', NULL, 1),
('Lote 2 - Sector AP6', 'Lote de forma cuadrada y bien proporcionada.', 1, 'Disponible', '600.97', '-31.4206,-64.1872', 'AP6', '2', NULL, 1),
('Lote 3 - Sector AP6', 'Terreno regular con acceso a calle.', 1, 'Disponible', '600.97', '-31.4207,-64.1873', 'AP6', '3', NULL, 1),
('Lote 4 - Sector AP6', 'Lote con frente a calle interna del sector.', 1, 'Disponible', '600.00', '-31.4208,-64.1874', 'AP6', '4', NULL, 1),
('Lote 5 - Sector AP6', 'Excelente oportunidad de inversiÃ³n.', 1, 'Disponible', '600.00', '-31.4209,-64.1875', 'AP6', '5', NULL, 1),
('Lote 6 - Sector AP6', 'Lote accesible desde calle principal.', 1, 'Disponible', '600.00', '-31.4210,-64.1876', 'AP6', '6', NULL, 1),
('Lote 7 - Sector AP6', 'Terreno con buena iluminaciÃ³n.', 1, 'Disponible', '600.00', '-31.4211,-64.1877', 'AP6', '7', NULL, 1),
('Lote 8 - Sector AP6', 'Lote con formato particular.', 1, 'Disponible', '601.80', '-31.4212,-64.1878', 'AP6', '8', NULL, 1),
('Lote 9 - Sector AP6', 'Luce cÃ©ntrico dentro del loteo.', 1, 'Disponible', '600.10', '-31.4213,-64.1879', 'AP6', '9', NULL, 1),
('Lote 10 - Sector AP6', 'Lote esquinero del sector AP6.', 1, 'Disponible', '600.62', '-31.4214,-64.1880', 'AP6', '10', NULL, 1)

ON CONFLICT DO NOTHING;
