import type { PulseSnapshot } from '@/sanity/queries/pulse'

/**
 * Fuente de datos del pulso. Hoy no hay ninguna conectada.
 *
 * Cuando llegue la aprobación de Huawei Health Kit (o se use Strava como puente),
 * esta función debe:
 *   1. Renovar el access token con el refresh token (env var, nunca en el cliente)
 *   2. Pedir el sueño de anoche y los pasos de ayer
 *   3. Devolver solo totales: nada de horas de dormir/despertar
 *
 * Devuelve null si no hay fuente o si falla: el sitio simplemente no muestra nada.
 */
export async function fetchPulseFromSource(): Promise<PulseSnapshot | null> {
  return null
}
