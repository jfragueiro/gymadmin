#!/bin/sh
set -e

echo "Ejecutando migraciones..."
npm run migrate

echo "Cargando datos iniciales..."
npm run seed

echo "Iniciando servidor..."
exec node src/server.js
