export default function Loading() {
  return (
    <div className="w-full flex items-center justify-center p-10">
      <div className="animate-spin h-6 w-6 border-4 border-blue-500 border-t-transparent rounded-full mr-2"></div>
      <span>Loading...</span>
    </div>
  )
}
