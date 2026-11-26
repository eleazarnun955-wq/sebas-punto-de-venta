# SEBAS PUNTO DE VENTA

Sistema de punto de venta gratuito, offline-first y multi-negocio.

## Objetivos
- Marca fija del sistema: **SEBAS PUNTO DE VENTA**.
- Cada comerciante administra su propio negocio, nombre, logotipo y datos.
- Separación estricta de datos entre negocios.
- Ventas en efectivo, tarjeta, transferencia y pagos mixtos; cálculo de cambio.
- Catálogo, inventario, compras, costos, precios, descuentos y utilidad real.
- Tickets, historial, devoluciones y reportes.
- Operación sin internet, copias de seguridad y restauración.
- Aplicación adaptable para Android y Windows.

## Estado
Repositorio inicializado. La primera entrega establece la arquitectura y las funciones base. No se publicará una APK hasta que el proyecto compile y se verifique.

## Desarrollo
- Interfaz web adaptable y PWA para operación local.
- Persistencia local para trabajar sin conexión.
- Preparación para empaquetado Android con Capacitor.
- Pruebas automatizadas para reglas críticas de ventas e inventario.

## Seguridad
Los datos se particionan por negocio. La app no debe confiar en identificadores enviados por el cliente para autorizar acceso; cualquier sincronización remota deberá aplicar autorización por usuario y negocio en el servidor.
