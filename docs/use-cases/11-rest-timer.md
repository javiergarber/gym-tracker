# Temporizador de descanso

## Descripción
Durante el entrenamiento, el usuario puede activar una cuenta atrás para controlar el tiempo de descanso entre series. La cuenta atrás se muestra dentro del mismo reloj esférico que el cronómetro de sesión, en un color distinto y con tamaño más pequeño. El tiempo de descanso es configurable desde Ajustes. En los últimos 3 segundos suena un pitido para advertir que el descanso termina.

## Flujo
1. Durante la sesión activa, el usuario pulsa el botón "Descanso"
2. El cronómetro de sesión sigue corriendo normalmente
3. Justo debajo del cronómetro, dentro de la misma esfera, aparece la cuenta atrás en un color distinto y tamaño más pequeño
4. Cuando quedan 3 segundos, comienza a sonar un pitido intermitente
5. Al llegar a 0, suena un pitido final y la cuenta atrás desaparece
6. El usuario puede pulsar de nuevo el botón "Descanso" para saltar el descanso restante

## Acceptance Criteria
- Botón "Descanso" visible y accesible durante la sesión activa
- Al pulsarlo, aparece la cuenta atrás debajo del cronómetro, dentro del mismo reloj esférico
- El cronómetro de sesión (HH:MM:SS) se mantiene en la parte superior de la esfera
- La cuenta atrás (MM:SS) se muestra justo debajo, en un color diferente (ej: naranja o rojo) y tamaño de fuente menor
- El diseño parece un reloj con dos líneas de tiempo dentro de una misma esfera
- La cuenta atrás comienza automáticamente con el tiempo configurado
- Mientras la cuenta atrás está activa, aparecen dos botones a los lados de la esfera: "-" a la izquierda y "+" a la derecha
- Cada pulsación de "+" añade 10 segundos al tiempo restante de descanso
- Cada pulsación de "-" resta 10 segundos al tiempo restante (mínimo 0, que finaliza el descanso)
- A los 3 segundos restantes, empieza un pitido corto cada segundo
- Al llegar a 0, suena un pitido más largo y la cuenta atrás desaparece
- Pulsar "Descanso" de nuevo mientras está activo salta el descanso
- El tiempo de descanso se configura desde Ajustes con opciones predefinidas (60s, 90s, 120s)
