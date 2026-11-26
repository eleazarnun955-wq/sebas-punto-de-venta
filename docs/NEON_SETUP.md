# Integración Neon — SEBAS PUNTO DE VENTA

## Estado
Esta rama prepara el esquema PostgreSQL y la guía de integración. La aplicación sigue usando su almacenamiento local y sus respaldos JSON; **no se ha cambiado el flujo de ventas ni se ha conectado aún a una base remota**. No se necesita ni se debe tocar CHAT PRO o SEBAS PLAY.

## Servicio gratuito
Neon Free anuncia $0/mes, 100 proyectos, 100 CU-hours por proyecto al mes, 1 GB PostgreSQL por proyecto y 5 GB de transferencia por proyecto al mes. El cómputo se suspende temporalmente al agotar la cuota mensual o queda inactivo tras el periodo de escala a cero. Consulta los límites vigentes antes de publicar: https://neon.com/docs/introduction/plans

## Arquitectura prevista
- Neon PostgreSQL para los datos del negocio.
- Neon Managed Better Auth para cuentas y sesiones.
- Neon Data API para acceso HTTP desde la app Capacitor.
- Row-Level Security (RLS) en PostgreSQL: cada fila tiene owner_id derivado de auth.user_id() y cada consulta queda limitada al administrador autenticado.
- Los datos locales y la exportación/restauración JSON se conservan como modo offline y respaldo.
- La marca fija SEBAS PUNTO DE VENTA permanece en la interfaz; cada negocio solo personaliza sus propios datos comerciales.

Documentación oficial:
- Data API: https://neon.com/docs/data-api/overview
- RLS: https://neon.com/docs/guides/rls-tutorial
- Managed Better Auth: https://neon.com/docs/auth/overview
- Capacitor + Neon Auth: https://neon.com/blog/category/guides

## Preparar el proyecto Neon
1. Crear una cuenta gratuita en https://console.neon.tech/ si aún no existe.
2. Crear un proyecto exclusivo llamado `sebas-punto-de-venta` en una región AWS cercana a México (por ejemplo, US West).
3. En el proyecto, habilitar **Managed Better Auth** y **Data API**.
4. Revisar el SQL de `database/neon/001_schema.sql` y ejecutarlo en SQL Editor después de habilitar Auth, ya que usa `auth.user_id()`.
5. Ejecutar los Data API Advisors y verificar las políticas RLS antes de conectar datos reales.
6. Configurar la URL pública de Data API y los parámetros públicos de Auth en la app. Nunca colocar `DATABASE_URL`, contraseña PostgreSQL ni claves de administración en el APK.
7. Implementar el adaptador remoto y la sincronización por negocio; probar con dos cuentas distintas antes de activar el modo nube.

## Reglas de seguridad
- No confiar en filtros de interfaz para separar comercios.
- No conceder acceso anónimo a tablas de ventas, clientes, proveedores, inventario o caja.
- No desactivar RLS.
- No exponer credenciales de propietario/administrador de PostgreSQL en el cliente.
- Verificar que cada tabla nueva tenga RLS, política de propietario y grants mínimos.
- No borrar datos locales después de una sincronización hasta comprobar importación, totales, inventario y restauración.
- La primera cuenta que crea un negocio queda como propietaria; el soporte de empleados/roles se añadirá después, con permisos explícitos.

## Limitaciones actuales
El esquema es la primera base de datos propuesta, no una migración ya ejecutada. Las relaciones de negocio y los flujos transaccionales (venta + descuento de stock, compra + entrada de stock y devoluciones) deberán implementarse en RPC/funciones SQL o backend transaccional antes de habilitar sincronización multi-dispositivo. No conectar la interfaz directamente hasta probar esas operaciones y RLS con dos cuentas independientes.
