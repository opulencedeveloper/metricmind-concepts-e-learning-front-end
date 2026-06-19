import { FeatureProps } from '@/types/course'

export default function Feature({ text }: FeatureProps) {
  return (
    <div className="flex items-start gap-3">
      <div className="h-4 w-4 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-1">
        <div className="h-2 w-2 rounded-full bg-green-600" />
      </div>
      <p className="text-sm text-gray-700">{text}</p>
    </div>
  )
}
