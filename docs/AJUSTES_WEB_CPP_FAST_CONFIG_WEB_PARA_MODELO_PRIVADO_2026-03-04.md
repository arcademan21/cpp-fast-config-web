# Ajustes necesarios en la web (Next.js) para el modelo privado

Fecha: 2026-03-04  
Proyecto inspeccionado: `/Users/arcademan/Documents/Projects/HAROLD/cpp-fast-config-web`

## Objetivo de estos ajustes

- Evitar exponer públicamente métodos directos de descarga/instalación que ya no aplican.
- Redirigir el onboarding a registro/login + panel de usuario + API key.
- Mantener la web como punto oficial de acceso sin filtrar detalles de infraestructura interna.

---

## Hallazgos clave detectados

Se encontraron referencias directas a instalación/descarga y al repositorio antiguo en:

- `src/app/page.tsx`
- `src/app/docs/getting-started/page.tsx`
- `src/components/snippet-tabs.tsx`
- `src/components/site-header.tsx`
- `src/app/docs/license/page.tsx`
- `src/i18n/messages.ts`

Estas rutas muestran hoy comandos con `curl` hacia `raw.githubusercontent.com`, `git clone` público y enlaces directos a GitHub que no encajan con el modelo privado.

---

## Ajustes funcionales por fase (frontend)

## Fase W1 — Reenfocar el mensaje público (alta prioridad)

### Cambios de contenido

1. Reemplazar “Quick install (curl)” público por “Get access” o “Request access”.
2. Eliminar `git clone` público de la documentación principal.
3. Sustituir snippets que muestran instalación directa por flujo autenticado.

### Resultado esperado

- La home y docs no exponen comandos válidos sin registro.

---

## Fase W2 — Nueva sección de acceso (registro/login)

### Nuevas páginas recomendadas

- `/access` (explica acceso y plan de uso)
- `/login`
- `/register`
- `/dashboard` (zona autenticada)
- `/dashboard/api-keys`

### Requisitos del dashboard

- Crear key
- Ver prefijo/estado
- Revocar key
- Rotar key
- Copiar comando de instalación personalizado con `--key`

---

## Fase W3 — Política de documentación pública

## Qué sí mostrar

- Conceptos generales del producto.
- CLI de uso una vez instalado.
- licencia y contacto comercial.

## Qué no mostrar públicamente

- URL real de artefactos privados.
- endpoint interno de broker con detalles sensibles.
- comandos de descarga que funcionen sin autenticación.
- ruta exacta de almacenamiento en VPS/R2.

---

## Cambios concretos por archivo (según estado actual)

## 1) `src/app/page.tsx`

### Situación actual

- Incluye `heroInstall` con `curl` a `raw.githubusercontent.com`.
- Muestra flujos terminal con instalación pública implícita.

### Ajuste requerido

- Reemplazar snippet de instalación por CTA a `/access`.
- Mantener demos de uso de `cpp` pero sin instrucción de descarga pública.
- Ajustar copy de “Get Started” para dirigir a registro.

---

## 2) `src/app/docs/getting-started/page.tsx`

### Situación actual

- `quickInstall` usa `curl` a GitHub raw.
- `manualInstall` usa `git clone` del repo.

### Ajuste requerido

- Sustituir por flujo autenticado:
  - paso 1: crear cuenta
  - paso 2: generar key
  - paso 3: ejecutar installer con key
- Añadir nota de “si no tienes acceso, solicita aprobación”.

---

## 3) `src/components/snippet-tabs.tsx`

### Situación actual

- Tab `install` contiene comando `curl` público.

### Ajuste requerido

- Reemplazar por snippet de acceso autenticado (placeholder de key):
  - ejemplo: `curl ... | sh -s -- --key <YOUR_KEY>`
- Opcional: desactivar tab install para usuarios no autenticados.

---

## 4) `src/components/site-header.tsx`

### Situación actual

- Link directo a GitHub del core en navegación principal.

### Ajuste requerido

- Cambiar por “Portal”, “Access”, “Login” o “Pricing/License”.
- Si mantienes GitHub, apuntar solo a repo público de installer o página informativa.

---

## 5) `src/app/docs/license/page.tsx`

### Situación actual

- Link fijo a LICENSE en GitHub del core.

### Ajuste requerido

- Mover texto de licencia a página legal en tu propio dominio o repo público de docs.
- Evitar enlaces al repo privado/core.

---

## 6) `src/i18n/messages.ts`

### Situación actual

- Mensajes que anuncian instalación por curl público y docs de instalación manual por repo.

### Ajuste requerido

- Cambiar textos ES/EN para nuevo flujo:
  - “Get access”
  - “Generate API key”
  - “Install with authenticated command”
- Revisar consistencia de copy en home, docs overview y getting-started.

---

## Checklist de publicación segura (frontend)

- [ ] No quedan comandos con `raw.githubusercontent.com/.../bootstrap.sh`.
- [ ] No queda `git clone` del core privado en docs públicas.
- [ ] Home redirige a acceso/registro.
- [ ] Snippets públicos no revelan URLs privadas.
- [ ] Enlaces “GitHub” no apuntan al core privado.
- [ ] Copy legal y de licencia consistente con modelo privado.

---

## UX recomendada para no bloquear onboarding

1. Home CTA: “Get access”.
2. Registro simple (email + pass).
3. Verificación email.
4. Dashboard con botón “Generate key”.
5. Comando de instalación listo para copiar.
6. Estado de descargas en panel (opcional fase 2).

---

## Riesgos de no aplicar estos ajustes

- Confusión de usuarios (comandos públicos ya no válidos).
- Exposición involuntaria de rutas técnicas en docs.
- Desalineación entre producto real (privado) y comunicación pública.

---

## Prioridad sugerida de implementación web

1. Actualizar `getting-started`, `snippet-tabs` y `home`.
2. Ajustar mensajes i18n ES/EN.
3. Reemplazar enlaces GitHub sensibles.
4. Añadir páginas de acceso (`/access`, `/login`, `/register`).
5. Añadir `/dashboard/api-keys`.
