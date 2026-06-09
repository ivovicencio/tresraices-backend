-- ============================================================
-- Row Level Security (RLS) - Tres Raíces Inmobiliaria
-- Ejecutar con: docker exec -i inmo_postgres psql -U inmo_admin -d inmobiliaria_db < db/rls.sql
-- ============================================================

-- 1. Crear roles de aplicación (si no existen)
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'app_public') THEN
    CREATE ROLE app_public;
  END IF;
  IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'app_admin') THEN
    CREATE ROLE app_admin;
  END IF;
END
$$;

-- 2. Permisos a nivel esquema
GRANT USAGE ON SCHEMA public TO app_public, app_admin;

-- app_public: solo lectura + registro
GRANT SELECT ON Propiedad TO app_public;
GRANT SELECT ON Inmobiliaria TO app_public;
GRANT INSERT ON Cliente TO app_public;
GRANT INSERT ON SolicitudVisita TO app_public;

-- app_admin: permisos completos
GRANT ALL ON Propiedad TO app_admin;
GRANT ALL ON Cliente TO app_admin;
GRANT ALL ON SolicitudVisita TO app_admin;
GRANT ALL ON Inmobiliaria TO app_admin;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO app_admin;

-- 3. Habilitar RLS (FORCE para que aplique incluso al owner)
ALTER TABLE Inmobiliaria ENABLE ROW LEVEL SECURITY;
ALTER TABLE Inmobiliaria FORCE ROW LEVEL SECURITY;

ALTER TABLE Propiedad ENABLE ROW LEVEL SECURITY;
ALTER TABLE Propiedad FORCE ROW LEVEL SECURITY;

ALTER TABLE Cliente ENABLE ROW LEVEL SECURITY;
-- Sin FORCE: el owner (inmo_admin) bypasses RLS para login/registro.
-- Las políticas aplican cuando se usen roles restringidos (app_public/app_admin).

ALTER TABLE SolicitudVisita ENABLE ROW LEVEL SECURITY;
ALTER TABLE SolicitudVisita FORCE ROW LEVEL SECURITY;

-- 4. Políticas para Inmobiliaria (solo lectura pública, escritura admin)
DROP POLICY IF EXISTS inmobiliaria_select_all ON Inmobiliaria;
CREATE POLICY inmobiliaria_select_all ON Inmobiliaria
    FOR SELECT USING (true);

DROP POLICY IF EXISTS inmobiliaria_admin_all ON Inmobiliaria;
CREATE POLICY inmobiliaria_admin_all ON Inmobiliaria
    FOR INSERT WITH CHECK (current_setting('app.role', true) = 'admin');

DROP POLICY IF EXISTS inmobiliaria_admin_update ON Inmobiliaria;
CREATE POLICY inmobiliaria_admin_update ON Inmobiliaria
    FOR UPDATE USING (current_setting('app.role', true) = 'admin')
    WITH CHECK (current_setting('app.role', true) = 'admin');

DROP POLICY IF EXISTS inmobiliaria_admin_delete ON Inmobiliaria;
CREATE POLICY inmobiliaria_admin_delete ON Inmobiliaria
    FOR DELETE USING (current_setting('app.role', true) = 'admin');

-- 5. Políticas para Propiedad (lectura pública, escritura admin)
DROP POLICY IF EXISTS propiedad_select_all ON Propiedad;
CREATE POLICY propiedad_select_all ON Propiedad
    FOR SELECT USING (true);

DROP POLICY IF EXISTS propiedad_insert_admin ON Propiedad;
CREATE POLICY propiedad_insert_admin ON Propiedad
    FOR INSERT WITH CHECK (current_setting('app.role', true) = 'admin');

DROP POLICY IF EXISTS propiedad_update_admin ON Propiedad;
CREATE POLICY propiedad_update_admin ON Propiedad
    FOR UPDATE USING (current_setting('app.role', true) = 'admin')
    WITH CHECK (current_setting('app.role', true) = 'admin');

DROP POLICY IF EXISTS propiedad_delete_admin ON Propiedad;
CREATE POLICY propiedad_delete_admin ON Propiedad
    FOR DELETE USING (current_setting('app.role', true) = 'admin');

-- 6. Políticas para Cliente
-- Registro público permitido
DROP POLICY IF EXISTS cliente_insert_public ON Cliente;
CREATE POLICY cliente_insert_public ON Cliente
    FOR INSERT WITH CHECK (true);

-- Usuario ve su propio registro
DROP POLICY IF EXISTS cliente_select_self ON Cliente;
CREATE POLICY cliente_select_self ON Cliente
    FOR SELECT USING (id::text = current_setting('app.user_id', true));

-- Admin ve todos los clientes
DROP POLICY IF EXISTS cliente_select_admin ON Cliente;
CREATE POLICY cliente_select_admin ON Cliente
    FOR SELECT USING (current_setting('app.role', true) = 'admin');

-- Admin puede actualizar clientes
DROP POLICY IF EXISTS cliente_update_admin ON Cliente;
CREATE POLICY cliente_update_admin ON Cliente
    FOR UPDATE USING (current_setting('app.role', true) = 'admin')
    WITH CHECK (current_setting('app.role', true) = 'admin');

-- 7. Políticas para SolicitudVisita
-- Cualquiera puede crear una solicitud
DROP POLICY IF EXISTS sv_insert_public ON SolicitudVisita;
CREATE POLICY sv_insert_public ON SolicitudVisita
    FOR INSERT WITH CHECK (true);

-- Admin ve todas las solicitudes
DROP POLICY IF EXISTS sv_select_admin ON SolicitudVisita;
CREATE POLICY sv_select_admin ON SolicitudVisita
    FOR SELECT USING (current_setting('app.role', true) = 'admin');

-- Admin actualiza solicitudes
DROP POLICY IF EXISTS sv_update_admin ON SolicitudVisita;
CREATE POLICY sv_update_admin ON SolicitudVisita
    FOR UPDATE USING (current_setting('app.role', true) = 'admin')
    WITH CHECK (current_setting('app.role', true) = 'admin');
