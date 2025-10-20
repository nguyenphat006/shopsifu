import ClipLoader from 'react-spinners/ClipLoader'

export default function Loading() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <ClipLoader color="#000" loading={true} />
    </div>
  )
}