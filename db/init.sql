CREATE TABLE IF NOT EXISTS Inmobiliaria (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    direccion VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS Cliente (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    nombre VARCHAR(150) NOT NULL,
    apellido VARCHAR(150) NOT NULL,
    telefono VARCHAR(20) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS Propiedad (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(200) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(12, 2) NOT NULL CHECK (precio >= 0),
    estado VARCHAR(20) NOT NULL DEFAULT 'Disponible'
        CHECK (estado IN ('Disponible', 'Reservado', 'Vendido')),
    inmobiliaria_id INTEGER REFERENCES Inmobiliaria(id) ON DELETE SET NULL,
    superficie DECIMAL(10, 2),
    ubicacion VARCHAR(255),
    manzana VARCHAR(50),
    lote_num VARCHAR(50),
    points TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS SolicitudVisita (
    id SERIAL PRIMARY KEY,
    fecha DATE NOT NULL DEFAULT CURRENT_DATE,
    estado VARCHAR(20) NOT NULL DEFAULT 'Pendiente'
        CHECK (estado IN ('Pendiente', 'Contactado', 'Cerrado')),
    mensaje TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    cliente_id INTEGER NOT NULL REFERENCES Cliente(id) ON DELETE CASCADE,
    propiedad_id INTEGER NOT NULL REFERENCES Propiedad(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_propiedad_estado ON Propiedad(estado);
CREATE INDEX IF NOT EXISTS idx_propiedad_precio ON Propiedad(precio);
CREATE INDEX IF NOT EXISTS idx_solicitud_estado ON SolicitudVisita(estado);
CREATE INDEX IF NOT EXISTS idx_solicitud_cliente ON SolicitudVisita(cliente_id);
CREATE INDEX IF NOT EXISTS idx_solicitud_propiedad ON SolicitudVisita(propiedad_id);

INSERT INTO Inmobiliaria (nombre, direccion) VALUES
    ('Tres Raíces Propiedades', 'Av. Principal 123, Ciudad')
ON CONFLICT DO NOTHING;

-- Migraciones para tablas existentes
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='propiedad' AND column_name='points') THEN
        ALTER TABLE Propiedad ADD COLUMN points TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='propiedad' AND column_name='descripcion') THEN
        ALTER TABLE Propiedad ADD COLUMN descripcion TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='cliente' AND column_name='username') THEN
        ALTER TABLE Cliente ADD COLUMN username VARCHAR(50) UNIQUE;
        UPDATE Cliente SET username = SPLIT_PART(email, '@', 1) WHERE username IS NULL;
        ALTER TABLE Cliente ALTER COLUMN username SET NOT NULL;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='cliente' AND column_name='apellido') THEN
        ALTER TABLE Cliente ADD COLUMN apellido VARCHAR(150) NOT NULL DEFAULT '';
    END IF;
END $$;
