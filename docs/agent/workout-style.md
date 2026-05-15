
## 🎨 Estilo general


*  Fondo: negro/azul muy oscuro con degradado suave.
*  Estética: “neón” con acentos en **morado/violeta** y  **turquesa** .
*  Bordes: muy redondeados (tipo 16–24px).
*  Efectos: brillo sutil en botones activos y textos destacados.
*  Tipografía: sans-serif moderna, números muy grandes y espaciados.

## 📱 Estructura de la pantalla (de arriba a abajo)

### 1. Barra superior

* Esquina izquierda: icono de menú hamburguesa dentro de un botón circular semitransparente.
* Esquina derecha: icono de estadísticas (barras verticales) también en botón circular.

---

### 2. Cabecera

* Texto centrado: **“TIEMPO TOTAL”**
* Estilo: mayúsculas, pequeño, espaciado entre letras.

---

### 3. Cronómetro principal

* Muy grande, centrado:
* `01:12:45`
* Color: degradado entre morado y violeta brillante.
* Peso visual dominante de la pantalla.

---

### 4. Botón de descanso

* Botón grande tipo “pill” (ovalado ancho).
* Contenido:
* Icono de “play” a la izquierda.
* Texto: **“INICIAR DESCANSO”**
* Borde: glow morado.
* Fondo: transparente oscuro con borde iluminado.

---

### 5. Indicador de descanso

* Debajo del botón:
* Icono de cronómetro pequeño.
* Texto: **“Descanso: 01:30”**
* Color: turquesa/verde agua.

---

## 🏋️ Sección ejercicio actual

### Contenedor tipo tarjeta

* Título pequeño: **“EJERCICIO ACTUAL”**
* Nombre del ejercicio:
* **“Press banca”**
* A ambos lados del título del ejercicio:
* Flecha izquierda (volver ejercicio anterior)
* Flecha derecha (siguiente ejercicio)

---

### Selector de series/reps

* Fila de opciones tipo “tabs”:
* `4x10` (seleccionado)
* `8`
* `6`
* `5`
* Estilo:
* Seleccionado: fondo turquesa/morado con brillo
* No seleccionados: gris oscuro con borde tenue
* Debajo: puntos indicadores (tipo paginación horizontal)

---

## ⚖️ Sección peso (KG)

### Cabecera

* Texto: **“PESO (KG)”**
* A la derecha: icono de pesa/placa.

---

### Selector doble tipo picker (iOS style)

#### Columna izquierda (ENTEROS)

* Lista vertical:
* 77, 78, 79,  **80** , 81, 82, 83
* Seleccionado: **80** resaltado con glow morado

#### Columna derecha (DECIMALES)

* Lista vertical:
* .00, .05, .25,  **.50** , .75, 1.00, 1.25
* Seleccionado: **.50** resaltado igual

---

### Resultado combinado

* Debajo del picker:
* **80.50 KG**
* Muy visible, centrado, con tipografía grande y turquesa brillante.

---

## 🔘 Botonera inferior (acciones)

Cuatro botones grandes, ocupando ancho:

### 1. FALLO

* Color: rojo
* Icono: X dentro de círculo
* Acción: registrar fallo

### 2. RIR 1

* Color: morado
* Icono: barras (tipo intensidad)
* Acción: registrar RIR 1

### 3. RIR 2

* Igual estilo que RIR 1 pero distinto valor

### 4. ACABAR EJERCICIO

* Color: verde/turquesa
* Icono: bandera a cuadros
* Acción final de la serie

---

## 🧠 Comportamiento general

* Todo es táctil, con feedback visual (glow al pulsar).
* La UI está pensada para uso rápido en gimnasio.
* Prioridad absoluta: peso + control de serie + estado del set.

---

Si quieres, puedo convertir esto directamente en:

* **componentes React Native / Flutter**
* o **un diseño en código (HTML + CSS o Tailwind)**
* o incluso **un sistema de design tokens para replicarlo fielmente**

Tú dime.

### Has alcanzado el límite de Free para chats con archivos adjuntos

Mejora tu plan ahora o espera hasta 19:54 para seguir usando archivos, o chatea ahora sin archivos.

Nuev
