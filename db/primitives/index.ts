/**
 * Stream Processing Primitives
 *
 * Low-level building blocks for streaming data systems:
 * - WatermarkService: Event-time tracking and progress monitoring
 */

export {
  WatermarkService,
  createWatermarkService,
  type WatermarkServiceInterface,
  type Duration,
  type Unsubscribe,
} from './watermark-service'
