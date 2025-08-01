declare global {
  namespace google {
    namespace maps {
      interface Map {
        setCenter(center: LatLng | LatLngLiteral): void
        setZoom(zoom: number): void
        addListener(event: string, handler: () => void): void
      }

      interface MapOptions {
        center?: LatLng | LatLngLiteral
        zoom?: number
        mapTypeControl?: boolean
        streetViewControl?: boolean
        fullscreenControl?: boolean
        styles?: any[]
      }

      interface LatLng {
        lat(): number
        lng(): number
      }

      interface LatLngLiteral {
        lat: number
        lng: number
      }

      interface Marker {
        setPosition(position: LatLng | LatLngLiteral): void
        setTitle(title: string): void
        setIcon(icon: string | Icon): void
        setMap(map: Map | null): void
        addListener(event: string, handler: () => void): void
      }

      interface MarkerOptions {
        position: LatLng | LatLngLiteral
        map?: Map
        title?: string
        icon?: string | Icon
      }

      interface Icon {
        url: string
        scaledSize?: Size
      }

      interface Size {
        width: number
        height: number
      }

      interface InfoWindow {
        open(map?: Map, anchor?: Marker): void
        close(): void
        setContent(content: string | Node): void
      }

      interface InfoWindowOptions {
        content?: string | Node
      }

      class Map {
        constructor(element: HTMLElement, options?: MapOptions)
      }

      class Marker {
        constructor(options?: MarkerOptions)
      }

      class InfoWindow {
        constructor(options?: InfoWindowOptions)
      }

      class LatLng {
        constructor(lat: number, lng: number)
        lat(): number
        lng(): number
      }

      class Size {
        constructor(width: number, height: number)
      }
    }
  }
}

export {}
