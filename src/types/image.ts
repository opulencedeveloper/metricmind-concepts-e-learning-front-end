import { ImageProps } from 'next/image'

export enum ImagePropertyOmit {
  OnLoad = 'onLoad',
  Placeholder = 'placeholder',
}

export interface SmartImageProps extends Omit<ImageProps, ImagePropertyOmit.OnLoad | ImagePropertyOmit.Placeholder> {
  containerClassName?: string
  useSkeleton?: boolean
  preload?: boolean
  eager?: boolean
}
