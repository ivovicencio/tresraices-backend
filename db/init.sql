CREATE TABLE IF NOT EXISTS Inmobiliaria (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    direccion VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS Cliente (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
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
